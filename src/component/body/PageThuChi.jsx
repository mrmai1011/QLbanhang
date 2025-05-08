import { FaRegArrowAltCircleUp ,FaRegArrowAltCircleDown } from "react-icons/fa";
import ItemThuChi from "./itemThuChi";
import { supabase } from "../../supabaseClient";
import { useSelector , useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export default function PageThuChi() {
    const storeId = useSelector((state) => state.login.store_id);
    const [orders,setOrders] = useState([])
    const [totalToday, setTotalToday] = useState(0)
    const [totalYesterday, setTotalYesterday] = useState(0)
   

    const [selectedDay, setSelectedDay] = useState("today");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filteredTotal, setFilteredTotal] = useState(0);
    const [filteredTotalChi, setFilteredTotalChi] = useState(0);
    const [type, setType] = useState("Hôm nay");

    const fetchOrdersByStoreId = async (storeId) => {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id_store', storeId)
          .order('created_at', { ascending: false }); // sắp xếp mới nhất trước
      
        if (error) {
          console.error('Lỗi khi fetch orders theo store:', error);
          return [];
        }
      
        return data;
      };

      useEffect(() => {
        const getOrders = async () => {
         
          const orders = await fetchOrdersByStoreId(storeId);
          setOrders(orders);
        
        };
      
        getOrders();
      }, []);
      useEffect(() => {
        const todayToday = filterOrdersByTimeRange(orders, "today");
        const todayYesterday = filterOrdersByTimeRange(orders, "yesterday");
        setTotalToday(todayToday.total);
        setTotalYesterday(todayYesterday.total);
      }, [orders]);

      useEffect(() => {
        const { orders: resultOrders, total , thu, chi, type} = filterOrdersByTimeRange(orders, selectedDay);
        setFilteredOrders(resultOrders);
        setFilteredTotal(thu);
        setFilteredTotalChi(chi);
        switch(type)
        {
            case "today" : setType("Hôm nay"); break;
            case "yesterday" : setType("Hôm qua"); break;
            case "thismonth" : setType("Tháng này"); break;
            case "lastmonth" : setType("Tháng trước"); break;
            case "thisyear" : setType("Năm này"); break;
            case "all" : setType("Tất cả"); break;
        }
        
      }, [orders, selectedDay]);

      function filterOrdersByTimeRange(orders, type) {
        const now = new Date();
      
        let startDate = null;
        let endDate = null;
      
        switch (type) {
          case "today":
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
      
          case "yesterday":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setDate(now.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
            break;
      
          case "thismonth":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
      
          case "lastmonth":
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            break;
      
          case "thisyear":
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
      
          case "all":
            return {
              orders,
              total: orders.reduce((sum, o) => sum + o.total, 0),
              thu: orders.filter(o => o.source === "thu").reduce((sum, o) => sum + o.total, 0),
              chi: orders.filter(o => o.source === "chi").reduce((sum, o) => sum + o.total, 0),
              type
            };
      
          default:
            return { orders: [], total: 0, thu: 0, chi: 0, type };
        }
      
        const filtered = orders.filter((order) => {
          const date = new Date(order.created_at);
          return date >= startDate && date <= endDate;
        });
      
        const total = filtered.reduce((sum, o) => sum + o.total, 0);
        const thu = filtered.filter(o => o.source === "thu").reduce((sum, o) => sum + o.total, 0);
        const chi = filtered.filter(o => o.source === "chi").reduce((sum, o) => sum + o.total, 0);
      
        return { orders: filtered, total, thu, chi, type };
      }
    return (
        <div className="page-thuchi">
            <div className="tc-filter-wapper">
               <select className="tc-select-day" onChange={(e) => setSelectedDay(e.target.value)}>
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="thismonth">Tháng này</option>
                <option value="lastmonth">Tháng trước</option>
                <option value="thisyear">Năm này</option>
                <option value="all">Tất cả</option>
             </select>
                <select className="tc-select-payment">
                    <option value="payment">Nguồn tiền</option>
                    <option value="cash">Tiền mặt</option>
                    <option value="bank">Chuyển khoản</option>

                </select>
                <select className="tc-select-transaction">
                    <option value="all">Tất cả giao dịch</option>
                    <option value="thu">Khoản thu</option>
                    <option value="chi">Khoản chi</option>

                </select>
            </div>
            <div className="tc-showfilter">
                <div className="tc-sodu">
                    <h2>Số dư</h2>
                    <h1>{(filteredTotal-filteredTotalChi).toLocaleString("vi-VN")}</h1>
                </div>
                <div className="tc-tongthuchi">
                    <div className="tc-tongchi">
                        <i><FaRegArrowAltCircleUp/></i> TỔNG CHI
                        <h1>{filteredTotalChi.toLocaleString("vi-VN")}</h1>
                    </div>
                    <div className="tc-tongthu">
                        <i><FaRegArrowAltCircleDown/></i> TỔNG THU
                        <h1>{filteredTotal.toLocaleString("vi-VN")}</h1>
                    </div>
                </div>

                <div className="tc-today">
                    <div className="tc-today-text">
                       <h3>{type.toLocaleUpperCase()}</h3>
                       <h3>{filteredTotal.toLocaleString("vi-VN")}đ</h3>
                    </div>
                    <div className="tc-list-today">
                    {filteredOrders.map((order, index) => {
                        let Icon = FaRegArrowAltCircleUp;
                        if (order.source === "thu") {
                            Icon = FaRegArrowAltCircleDown;
                        }

                        return <ItemThuChi key={index} Icon={Icon} orders={order} />;
                        })}
                    
                    </div>
                </div>
               {/*  <div className="tc-yesterday">
                    <div className="tc-yesterday-text">
                       <h3>HÔM QUA</h3>
                       <h3>{totalYesterday.toLocaleString("vi-VN")}đ</h3>
                    </div>
                    <div className="tc-list-yesterday">
                    <div>testt</div>
                    <div>testt</div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}