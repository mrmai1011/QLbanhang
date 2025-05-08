import { useSelector, useDispatch } from "react-redux";

import { selectTotalPrice } from "../../redux/slice/orderSlice";
import { selectOrderItems } from "../../redux/slice/orderSlice";
import { clearOrder } from "../../redux/slice/orderSlice";
import { setPageDonHang } from "../../redux/slice/pageSlice";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { supabase } from "../../supabaseClient";
import { nanoid } from "nanoid";
export default function PageThanhToan() {
  const items = useSelector(selectOrderItems);
  const total = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
 const [exitAnimation, setExitAnimation] = useState(false);
 const storeId = useSelector((state) => state.login.store_id);
 const [priceRaw, setPriceRaw] = useState(""); // Dạng hiển thị: "100.000"
 /* const [price, setPrice] = useState(0);   */

 const [prepaid, setPrepaid] = useState(0);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tiền mặt");
  const [guest, setQuest] = useState("tới mua");
  const formatNumber = (num) => Number(num).toLocaleString("vi-VN");

  const unformatNumber = (str) => str.replace(/\D/g, "");

const handlePriceChange = (e) => {
  let input = e.target.value;
  let numeric = unformatNumber(input); // bỏ dấu . nếu có

  if (!/^\d*$/.test(numeric)) return; // chỉ nhận số nguyên dương

  let value = parseInt(numeric || "0", 10);

  if (value > total) value = total;
    
 

  setPriceRaw(formatNumber(value)); // hiển thị đã format
  setPrepaid(value); // lưu giá trị số thực
};

  const handleBack = () => {
    setExitAnimation(true); // kích hoạt animation rút ra
    setTimeout(() => {
        
        dispatch(setPageDonHang())
        setExitAnimation(false);
      }, 200); // khớp với thời gian animation
    
  };

  const handleThanhToan = async () => {
    console.log("prepaid", prepaid)
    const actualPrepaid = prepaid === 0 || prepaid == null ? total : prepaid;
    const debt = total - actualPrepaid;
    const donHang = {
     
      id_store:storeId,
      items,
      total,
      prepaid : actualPrepaid,
      debt,
      note,
      guest,
      payment_method:paymentMethod,
      created_at: new Date().toISOString()
    };
  
    const { error } = await supabase.from("orders").insert([donHang]); // hoặc gọi API bạn dùng
  
    if (error) {
      console.error("Lỗi khi lưu đơn hàng:", error);
      alert("Đã xảy ra lỗi khi lưu đơn hàng.");
    } else {
      alert("Đã thanh toán và lưu đơn hàng!");
      dispatch(clearOrder());
      dispatch(setPageDonHang());
    }
 
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
          <div className="order-note-section">
            <label>Ghi chú:</label>
            <textarea
              className="order-note-input"
              rows="2"
              placeholder="Ghi chú đơn hàng..."
              value={note} 
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className="order-guest">
            <label>khách ở đâu:</label>
           
            <select className="guest-select"
            value={guest} 
            onChange={(e) => setQuest(e.target.value)}
            >
              <option value="tới mua">Khách tới mua</option>
              <option value="gọi điện">Khách gọi điện</option>
              <option value="facebook">Khách facebook</option>
              <option value="zalo">Khách zalo</option>
            </select>
          </div>
          <div className="order-payment-method">
            <label>Hình thức thanh toán:</label>
           
            <select className="payment-method-select"
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="tiền mặt">Tiền mặt</option>
              <option value="ngân hàng">Chuyển khoản</option>
            </select>
          </div>

          <div className="order-prepaid">
            <label>Đưa trước:</label>
            <input
              type="text"
              className="prepaid-input"
              value={priceRaw}
              onChange={handlePriceChange}
              placeholder="Nhập số tiền đã đưa trước"
            />
          </div>
        </div>

      <div className="button-actions">
        
        <button className="btn-back" onClick={handleBack}><i><IoMdArrowRoundBack/></i> Quay lại</button>
        <button className="btn-confirm" onClick={handleThanhToan}><i><MdAttachMoney/></i>Thanh toán</button>
      </div>
    </div>
  );
}