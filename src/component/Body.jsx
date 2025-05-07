
import { MdSell } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";
import { LuArrowRightLeft} from "react-icons/lu";

import { AiFillThunderbolt } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import logo from "../assets/logo.png"

import AddProduct from "./body/addProduct";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { setPageAddProduct , setPageDonHang } from "../redux/slice/pageSlice";
import { useDispatch , useSelector} from "react-redux";
import { addToOrder } from "../redux/slice/orderSlice";

export default function Body()
{
    const dispatch = useDispatch();
    const [exitAnimation, setExitAnimation] = useState(false);
    const storeId = useSelector((state) => state.login.store_id);
    const currentPage = useSelector((state) => state.page.currentPage);
    const [products, setProducts] = useState([]);
   
    const items = useSelector((state) => state.order.items);
    const total = items.reduce((sum, item) => sum + Number(item.price), 0);
    useEffect(() => {
        const fetchProducts = async () => {
          const { data, error } = await supabase
            .from("products")
            .select("name, price, imgUrl") // chỉ chọn cột cần dùng
            .eq("store_id", storeId);
    
          if (error) {
            console.error("Lỗi khi fetch orders:", error);
          } else {
            setProducts(data);
          }
        };
    
        if (currentPage === "pageDonHang") {
            fetchProducts();
        }
      }, [storeId, currentPage]);
    const handleBack = () => {
        setExitAnimation(true); // kích hoạt animation rút ra
        setTimeout(() => {
          dispatch(setPageDonHang())
          setExitAnimation(false);
        }, 200); // khớp với thời gian animation
      };
    
   
    return(
        <div className="body">
          {/*   main quản lý */}
          {currentPage === "pageQuanLi" &&
            <div className="b-quanly">
                <div className="b-quanly-item">
                    <i className="color-red"><MdSell/></i>
                    <h3>Bán hàng</h3>
                </div>
                <div className="b-quanly-item">
                    <i className="color-orange"><FaBoxArchive/></i>
                    <h3>Sản phẩm</h3>
                </div>
                <div className="b-quanly-item">
                    <i className="color-green"><FaChartLine/></i>
                    <h3>Báo cáo</h3>
                </div>
                <div className="b-quanly-item">
                    <i className="color-puble"><LuArrowRightLeft/></i>
                    <h3>Thu chi</h3>
                </div>
            
            </div>
          }
         {/*      tao don hang  */}
         {currentPage === "pageDonHang" &&
          <div className="b-donhang">
            <div className="b-donhang-timkiem">
                <input placeholder="Tìm theo tên"></input>
            </div>
            <div className="b-donhang-wapper">
              
                <div className="b-donhang-bannhanh">
                    <i><AiFillThunderbolt/></i>
                    <h3>Bán nhanh</h3>
                </div>
                {products.map((order, index) => (
                <div key={index} className="b-donhang-item"
                    onClick={() => dispatch(addToOrder(order))} // trong map order
                >
                    <img src={order.imgUrl} onError={(e) => e.target.src = logo} />
                    <h3>{order.name}</h3>
                    <h3>{Number(order.price).toLocaleString("vi-VN")}</h3>
                </div>
                ))}
                <div className="b-donhang-them"
                 onClick={() => dispatch(setPageAddProduct())}
                >
                    <i><IoMdAdd/></i>
                    <h3>Thêm sản phẩm</h3>
                </div>

      
            </div>
          </div>
         }

          {/* Hiển thị bảng thêm sản phẩm */}
          {currentPage === "pageAddProduct"  && (
            <div className="add-product-overlay">
              <AddProduct exit={exitAnimation} onBack={handleBack} />
            </div>
          )}
         {total > 0 && currentPage === "pageDonHang" && (
            <button className="btn-thanhtoan"  onClick={() => dispatch(setPageThanhToan())} >
                Thanh toán ({total.toLocaleString("vi-VN")}đ)
            </button>
            )}

        </div>
    );
}