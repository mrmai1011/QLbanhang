import { useSelector, useDispatch } from "react-redux";

import { selectTotalPrice } from "../../redux/slice/orderSlice";
import { selectOrderItems } from "../../redux/slice/orderSlice";
import { clearOrder } from "../../redux/slice/orderSlice";
import { setPageDonHang } from "../../redux/slice/pageSlice";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";

export default function PageThanhToan() {
  const items = useSelector(selectOrderItems);
  const total = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
 const [exitAnimation, setExitAnimation] = useState(false);
  const handleBack = () => {
    setExitAnimation(true); // kích hoạt animation rút ra
    setTimeout(() => {
        
        dispatch(setPageDonHang())
        setExitAnimation(false);
      }, 200); // khớp với thời gian animation
    
  };

  const handleThanhToan = () => {
    alert("Đã thanh toán!");
    dispatch(clearOrder());
    dispatch(setPageDonHang());
  };

  return (
    <div className={`page-thanhtoan ${exitAnimation ? 'slide-out' : 'slide-in'}`}>
      <h2>Chi tiết đơn hàng</h2>
      <ul className="order-list">
        {items.map((item, index) => (
          <li key={index} className="order-item">
             <span className="item-col-1">{item.name}</span>
             <span className="item-col-2">{item.quantity}x</span>
             <span className="item-col-3">{Number(item.price).toLocaleString("vi-VN")}đ</span>
          </li>
        ))}
      </ul>

      <div className="order-total">
        <span>Tổng cộng: </span>
        <span>{total.toLocaleString("vi-VN")}đ</span>
      </div>

      <div className="order-actions">
        <button className="btn-back" onClick={handleBack}><i><IoMdArrowRoundBack/></i> Quay lại</button>
        <button className="btn-confirm" onClick={handleThanhToan}><i><MdAttachMoney/></i>Thanh toán</button>
      </div>
    </div>
  );
}