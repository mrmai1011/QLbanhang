import { useSelector, useDispatch } from "react-redux";

import { selectTotalPrice } from "../../redux/slice/orderSlice";
import { selectOrderItems } from "../../redux/slice/orderSlice";
import { clearOrder } from "../../redux/slice/orderSlice";
import { setPage} from "../../redux/slice/pageSlice";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { supabase } from "../../supabaseClient";

import { useFormattedAmount } from "../../utils/useFormattedAmount";
import { useNotifier } from "../../utils/notifier";

export default function PageThanhToan() {
  const items = useSelector(selectOrderItems);
  const total = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
 const [exitAnimation, setExitAnimation] = useState(false);
 const storeId = useSelector((state) => state.login.store_id);

  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tiền mặt");
  const [guest, setQuest] = useState("tới mua");
  const { amount, amountRaw, handleAmountChange } = useFormattedAmount(total);

  const { notify} = useNotifier();




  const handleBack = () => {
    setExitAnimation(true); // kích hoạt animation rút ra
    setTimeout(() => {
        
        dispatch(setPage("pageBanHang"))
        setExitAnimation(false);
      }, 200); // khớp với thời gian animation
    
  };

  const handleThanhToan = async () => {
   /*  console.log("prepaid", amount) */
    const actualPrepaid = amount === 0 || amount == null ? total : amount;
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
    const income = {
      id_store:storeId,
      amount: actualPrepaid,
      payment_method : paymentMethod,
      created_at: new Date().toISOString(),
      source : "thu",
      guest,

    }
  
    const { error } = await supabase.from("orders").insert([donHang]); // hoặc gọi API bạn dùng
    const { error1 } = await supabase.from("income").insert([income]); // hoặc gọi API bạn dùng
  
    if (error || error1) {

      notify("Đã xảy ra lỗi khi lưu đơn hàng.", "error");
      return;
    } else {

      notify("Đã thanh toán và lưu đơn hàng!", "success");
      dispatch(clearOrder());
      dispatch(setPage("pageBanHang"));
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
              <option value="chuyển khoản">Chuyển khoản</option>
            </select>
          </div>

          <div className="order-prepaid">
            <label>Đưa trước:</label>
            <input
              type="text"
              className="prepaid-input"
              value={amountRaw}
              onChange={handleAmountChange}
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