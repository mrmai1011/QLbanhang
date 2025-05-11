
import { MdSell } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";
import { LuArrowRightLeft ,LuNotepadText} from "react-icons/lu";

import { AiFillThunderbolt } from "react-icons/ai";
import { BsBagFill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import logo from "../assets/logo.png"

import AddProduct from "./body/addProduct";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { setPageAddProduct , setPageDonHang,setPageThanhToan , setPageSoNo ,setPageBanHang, setPageThuChi} from "../redux/slice/pageSlice";
import { useDispatch , useSelector} from "react-redux";
import { addToOrder,decreaseItem,selectTotalItem,selectTotalPrice } from "../redux/slice/orderSlice";
import PageThanhToan from "./body/PageThanhToan";
import PageThuChi from "./body/PageThuChi";
import TaoKhoanThu from "./body/PageKhoanThu";
import PageSoNo from "./body/PageSoNo";
import PageDonHang from "./body/PagDonHang";
import DetailDonHang from "./body/DetailDonHang";


export default function Body()
{
    const dispatch = useDispatch();
    const [exitAnimation, setExitAnimation] = useState(false);
    const storeId = useSelector((state) => state.login.store_id);
    const currentPage = useSelector((state) => state.page.currentPage);
    const [products, setProducts] = useState([]);
   
    const items = useSelector((state) => state.order.items);
    const totalItem = useSelector(selectTotalItem);
    const total = useSelector(selectTotalPrice);

    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);

    const [selectedCategoryId, setSelectedCategoryId] = useState('1'); // "" là Tất cả danh mục
 

    useEffect(() => {
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
      const { data, error } = await supabase
              .from("category")
                .select("id, name")
                .or(`store_id.eq.${storeId},store_id.is.null`); // storeId là UUID, ví dụ '550e8400-e29b-41d4-a716-446655440000'
  
      if (!error) {
        console.log("not error",data)
        setCategories(data);
        setCategoryId(data[0]?.id);
      }
    };
    useEffect(() => {
        const fetchProducts = async () => {
          const { data, error } = await supabase
            .from("products")
            .select("id,name, price, imgUrl, category") // chỉ chọn cột cần dùng
            .eq("store_id", storeId);
    
          if (error) {
            console.error("Lỗi khi fetch orders:", error);
          } else {
            const filtered =
              selectedCategoryId === '1'
              ? data // Nếu là "1" → lấy hết
              : data.filter(item => String(item.category) === String(selectedCategoryId));
            setProducts(filtered);
          }
        };
    
        if (currentPage === "pageBanHang") {
            fetchProducts();
        }
      }, [storeId, currentPage,selectedCategoryId]);

 

    const handleBack = () => {
        setExitAnimation(true); // kích hoạt animation rút ra
        setTimeout(() => {
          dispatch(setPageBanHang())
          setExitAnimation(false);
        }, 200); // khớp với thời gian animation
      };

      const handleAddOder = (order) =>{
        dispatch(addToOrder(order))
        console.log(items)
      }
      const handleOpenPage = (name) =>{
        switch(name)
        {
          case "pageDonHang" :
            dispatch(setPageDonHang())
            break
          case "pageBanHang" :
          dispatch(setPageBanHang())
          break
            case "pageThuChi" :
          dispatch(setPageThuChi())
          break
        }
      }
    
   
    return(
        <div className="body">
          {/*   main quản lý */}
          {currentPage === "pageQuanLi" &&
            <div className="b-quanly">
                <div className="b-quanly-item" onClick={()=>handleOpenPage("pageBanHang")}>
                    <i className="color-red"><MdSell/></i>
                    <h3>Bán hàng</h3>
                </div>
                <div className="b-quanly-item" onClick={()=>handleOpenPage("pageDonHang")} >
                    <i className="color-blue"><LuNotepadText/></i>
                    <h3>Đơn hàng</h3>
                </div>
                <div className="b-quanly-item">
                    <i className="color-orange"><FaBoxArchive/></i>
                    <h3>Sản phẩm</h3>
                </div>
                <div className="b-quanly-item">
                    <i className="color-green"><FaChartLine/></i>
                    <h3>Báo cáo</h3>
                </div>
                <div className="b-quanly-item" onClick={()=>handleOpenPage("pageThuChi")}>
                    <i className="color-puble"><LuArrowRightLeft/></i>
                    <h3>Thu chi</h3>
                </div>
            
            </div>
          }
         {/*      tao don hang  */}
         {currentPage === "pageBanHang" &&
          <div className="b-donhang">
            <div className="b-donhang-timkiem">
                <input placeholder="Tìm theo tên"></input>
                <select 
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                 
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
              </select>
            </div>
            <div className="b-donhang-wapper">
              
                <div className="b-donhang-bannhanh">
                    <i><AiFillThunderbolt/></i>
                    <h3>Bán nhanh</h3>
                </div>
                {products.map((order, index) => {
                  const existingItem = items.find(item => item.id === order.id);
                  
                    
                  return (
                    <div
                      key={index}
                      className="b-donhang-item"
                      onClick={()=>handleAddOder(order)}
                    >
                      <img src={order.imgUrl} onError={(e) => (e.target.src = logo)} />
                      <h3>{order.name}</h3>
                      <h3>{Number(order.price).toLocaleString("vi-VN")}</h3>

                      {existingItem && existingItem.quantity > 0 &&(
                        <div className="item-controls">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(decreaseItem(order));
                            }}
                          >
                            -
                          </button>

                          <span>{existingItem.quantity}</span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(addToOrder(order));
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                

             
                <div className="b-donhang-them"
                 onClick={() => dispatch(setPageAddProduct())}
                >
                    <i><IoMdAdd/></i>
                    <h3>Thêm sp</h3>
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
         {total > 0 && currentPage === "pageBanHang" && (
              <button className="btn-thanhtoan" onClick={() => dispatch(setPageThanhToan())}>
              <div className="btn-left">
               <i><BsBagFill/></i> <span>{totalItem}</span>
              </div>
              <div className="btn-center">
                {total.toLocaleString("vi-VN")}đ
              </div>
              <div className="btn-right">
                Tiếp tục
              </div>
            </button>
            )}
          {/*   page thanh toán */ }
          {currentPage === "pageThanhToan" && <PageThanhToan />}
          {currentPage === "pageThuChi" && <PageThuChi />}
          {currentPage === "pageKhoanThu" && <TaoKhoanThu sourceType="thu"/>}
          {currentPage === "pageKhoanChi" && <TaoKhoanThu sourceType="chi"/>}
            {/*   page sono */ }
              {currentPage === "pageSoNo" && <PageSoNo/>}
             {/*  page don hang */}
               {currentPage === "pageDonHang" && <PageDonHang/>}
           {/*     detail don hang */}
              {currentPage === "pageDetailDonHang" && <DetailDonHang/>}
        </div>

     

    );
}