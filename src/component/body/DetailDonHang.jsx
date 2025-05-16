import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../../supabaseClient";

import { setDetailDonHang, clearDetailDonHang } from "../../redux/slice/orderSlice";
import { setPageDonHang , setPageSoNo} from "../../redux/slice/pageSlice";
import { useNotifier } from "../../utils/notifier";


export default function DetailDonHang() {

  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.detailDonHang);
  const fromPage = useSelector((state) => state.order.fromPage);
  const [paymentMethod, setPaymentMethod] = useState("tiền mặt");
  const storeId = useSelector((state) => state.login.store_id);
  const { notify, confirm } = useNotifier();
  const handlePrintWithRAWBT = () => {
    window.print();
  };

  if (!order) return <p>Không tìm thấy đơn hàng.</p>;
 
  const handleThanhToanNo = async () => {
 

    try {
        const ngayThanhToan = new Date();

        const [updateResult, incomeResult] = await Promise.all([
          supabase.from("orders").update({
            debt: 0,
            prepaid: order.total,
            time_prepaid: ngayThanhToan,
          }).eq("id_bill", order.id_bill),

          supabase.from("income").insert([
            {
              id_store: storeId,
              amount: order.debt, 
              guest: `Thu nợ ${order.id_bill.slice(0,8)}`,
              payment_method:paymentMethod,
              created_at: ngayThanhToan,
              source: "thu",
            },
          ]),
        ]);

        const { error: orderError } = updateResult;
        const { error: incomeError } = incomeResult;

        if (orderError || incomeError) {
          if (orderError) console.error("Lỗi cập nhật đơn hàng:", orderError);
          if (incomeError) console.error("Lỗi ghi nhận giao dịch:", incomeError);

        
          notify("Thanh toán thất bại! Vui lòng thử lại.", "error");
          return; // ❌ Dừng luôn nếu 1 trong 2 lỗi
        }


        notify("Thanh toán thành công!", "success");
        if (fromPage === "pageDonHang"){
           dispatch(setPageDonHang());
        } else if (fromPage === "pageSoNo"){
           dispatch(setPageSoNo());
        }
         
        dispatch(clearDetailDonHang());
      

      } catch (err) {
     
      
        notify("Đã xảy ra lỗi, vui lòng thử lại!", "error");
      }
  };
  const handleBack = () =>{
     if (fromPage === "pageDonHang"){
           dispatch(setPageDonHang());
        } else if (fromPage === "pageSoNo"){
           dispatch(setPageSoNo());
        }
  }

  return (
   <div className="detail-container ">
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
       <button className="btn-back-detail non-printable" onClick={handleBack}>
      ← Quay lại
    </button>
    <button className="btn-back-detail" onClick={handlePrintWithRAWBT}>
        in
      </button>
    </div>
 


  <div className="detail-info print-area">
    {order.items && order.items.length > 0 && (
        <div className="order-items">
          <h3 className="items-title">Chi tiết Đơn Hàng</h3>
          <ul>
            {order.items.map((item, index) => (
              <li key={index} className="item-row">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">
                  {Number(item.price).toLocaleString("vi-VN")}đ
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
  
    <p><span className="label">ID:</span> {order.id_bill.slice(0,8)}</p>
    {/*   <p><span className="label">order:</span> {order.items}</p> */}
    <p><span className="label">Ghi chú:</span> {order.note}</p>
    <p><span className="label">Tên Khách:</span> {order.guest || "Không có tên"}</p>
    <p><span className="label">Tổng tiền:</span> {Number(order.total).toLocaleString("vi-VN")}đ</p>
    <p><span className="label">Đã trả:</span> {Number(order.prepaid).toLocaleString("vi-VN")}đ</p>
    <p>
    <span className="label">Còn nợ:</span>{" "}
    <span
      style={{
        color: order.debt === 0 ? "green" : "orange",
        fontWeight: "bold",
      }}
    >
      {Number(order.debt).toLocaleString("vi-VN")}đ
    </span>
  </p>
    <p><span className="label">Ngày đặt đơn:</span> {order.created_at 
    ? new Date(order.created_at).toLocaleString("vi-VN", { 
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit", 
        hour: "2-digit", 
        minute: "2-digit" 
      }) 
    : "Chưa có"}</p>
   <p>
  <span className="label">Ngày thanh toán nợ:</span>{" "}
  {order.debt === 0 ? (
    order.time_prepaid ? (
      new Date(order.time_prepaid).toLocaleString("vi-VN", { 
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit", 
        hour: "2-digit", 
        minute: "2-digit" 
      })
    ) : (
      <span style={{ color: "green", fontWeight: "bold" }}>Đã thanh toán</span>
    )
  ) : (
    <span style={{ color: "orange", fontWeight: "bold" }}>Chưa thanh toán</span>
  )}
</p>


  </div>

  {order.debt > 0 && (
    <>
   <select 
      name="payment" 
      id="paymentid" 
      value={paymentMethod} 
      onChange={(e) => setPaymentMethod(e.target.value)}
      style={{ padding: "8px", borderRadius: "8px", marginTop: "16px" }}
    >
  <option value="tiền mặt">Tiền mặt</option>
  <option value="chuyển khoản">Chuyển khoản</option>
</select>
    <button onClick={handleThanhToanNo} className="btn-pay">
      Thanh Toán Nợ
    </button>
    </>
  )}
</div>

  );
}
