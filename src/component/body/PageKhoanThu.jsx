import { useDispatch , useSelector } from "react-redux";
import { setPageThuChi } from "../../redux/slice/pageSlice";
import { useState } from "react";
import { useFormattedAmount } from "../../utils/useFormattedAmount";
import { supabase } from "../../supabaseClient";
export default function TaoKhoanThu({ sourceType = "thu" }) {
  const dispatch = useDispatch();
  const [exitAnimation, setExitAnimation] = useState(false);
  const storeId = useSelector((state) => state.login.store_id);
  const { amount, amountRaw, handleAmountChange } = useFormattedAmount();
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tiền mặt");

  const handleBackThuChi = () => {
      setExitAnimation(true);
      setTimeout(() => {
          dispatch(setPageThuChi());
          setExitAnimation(false);
      }, 200);
  };

  const handleSave = async () => {
      if (amount <= 0) return;

    /*   const table = sourceType === "thu" ? "income" : "outcome"; */

      const { error } = await supabase.from("income").insert([
          {
              id_store: storeId,
              amount: amount,
              payment_method: paymentMethod,
              source: sourceType,
              guest: note,
              created_at: new Date().toISOString()
          }
      ]);

      if (error) {
          console.error("Lỗi khi lưu:", error);
          alert("Lưu thất bại. Vui lòng thử lại.");
      } else {
          alert(`Đã lưu khoản ${sourceType} thành công!`);
          dispatch(setPageThuChi());
      }
  };

  const saveButtonColor = sourceType === "thu" ? "rgb(55, 143, 5)" : "rgb(221, 101, 10)";

  return (
      <div className={`tao-khoan-thu ${exitAnimation ? 'slide-out' : 'slide-in'}`} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
          <h2>Tạo khoản {sourceType}</h2>

          <div className="form-group" style={{ marginBottom: '10px' }}>
              <label>Số tiền</label>
              <input type="text" className="input" placeholder="Nhập số tiền" onChange={handleAmountChange} value={amountRaw} />
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
              <label>Nguồn tiền</label>
              <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="tiền mặt">Tiền mặt</option>
                  <option value="chuyển khoản">Chuyển khoản</option>
              </select>
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
              <label>Ghi chú</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} className="input" rows="3" placeholder="Nhập ghi chú..."></textarea>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
              <button onClick={handleBackThuChi} className="btn-back-kt">Quay lại</button>
              <button
                  className="btn-save"
                  disabled={!amount || parseInt(amount) <= 0}
                  style={{ backgroundColor: !amount || parseInt(amount) <= 0 ? '#ccc' : saveButtonColor, color: 'white' }}
                  onClick={handleSave}
              >
                  Lưu
              </button>
          </div>
      </div>
  );
}