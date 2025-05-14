

import { useState, useEffect } from "react";
import { FaRegArrowAltCircleDown } from "react-icons/fa"
import ItemSoNo from "./itemSoNo"
import { supabase } from "../../supabaseClient";
import { useDispatch } from "react-redux";
import { setPageDetailDonHang } from "../../redux/slice/pageSlice";
import { setDetailDonHang } from "../../redux/slice/orderSlice";

export default function PageSoNo() {
    const dispatch = useDispatch()
      const [orders, setOrders] = useState([]);
      useEffect(() => {
        const fetchDebtOrders = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .gt("debt", 0); // debt > 0

            if (error) {
                console.error("Lỗi khi lấy danh sách nợ:", error);
            } else {
                const sortedData = [...data].sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                setOrders(sortedData);
            }
        };

        fetchDebtOrders();
    }, []);
    const totalDebt = orders.reduce((sum, o) => sum + o.debt, 0);
        return (
            <div className="page-sono">
                <div className="sono-phaithu">
                   <h1 style={{ color:"rgb(54, 57, 54)"}}><i style={{color:"rgb(20, 92, 6)"}}><FaRegArrowAltCircleDown/></i> PHẢI THU</h1>
                   <h1 style={{fontSize:"3rem", color:"rgb(20, 92, 6)"}}> {totalDebt.toLocaleString("vi-VN")}</h1>
                </div>
                <div className="sono-list-kh">
                    <h3 style={{paddingTop:"10px", paddingBottom:"10px", 
                        backgroundColor:"rgb(136, 152, 133)",
                        color:"rgb(52, 53, 52)",
                        borderRadius:"10px"
                        }}>DANH SÁCH KHÁCH HÀNG</h3>


                    {orders.length > 0 ? (
                        orders.map((order,index) => (
                            <ItemSoNo key={index}  order={order} 
                                onClick={() => {
                                            dispatch(setDetailDonHang({order,fromPage:"pageSoNo"}));
                                            dispatch(setPageDetailDonHang())
                                            
                                            }} 
                             />
                        ))
                    ) : (
                        <p style={{paddingTop:"30px", color:"green", fontWeight:"bold"}}>Không có khách hàng nợ.</p>
                    )}
                </div>
            </div>
        )
}