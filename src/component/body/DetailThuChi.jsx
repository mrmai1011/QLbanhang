import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { setPageThuChi } from "../../redux/slice/pageSlice";
import { supabase } from "../../supabaseClient"; // nếu bạn dùng Supabase
import { useState } from "react";
import { useNotifier } from "../../utils/notifier";


export default function DetailThuChi() {
  const dispatch = useDispatch();
  const detail = useSelector((state) => state.order.detailThuChi);
  const role = useSelector((state) => state.login.role);
 
    // State cho chỉnh sửa
  const [amount, setAmount] = useState(detail.amount || 0);
  const [note, setNote] = useState(detail.note || "");
  const [paymentMethod, setPaymentMethod] = useState(detail.payment_method || "");
  const [category, setCategory] = useState(detail.category || "");
  const { notify, confirm } = useNotifier();

  if (!detail) {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        <p>Không có dữ liệu chi tiết.</p>
        <button onClick={() => dispatch(setPageThuChi())}>Quay lại</button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (role !== "admin") {
      
      notify("Bạn không có quyền xóa giao dịch này.", "error");
      return;
    }
  const confirms = await confirm("Bạn có chắc muốn xóa giao dịch này?");
  if (!confirms)
  {
       notify('Đã huỷ thao tác.', 'info');
      return;
  }
  

  const { error } = await supabase
    .from("income")
    .delete()
    .eq("id", detail.id);
 

  if (error) {
  
    notify("Xóa thất bại!", "error");
  } else {
  
    notify("Xóa thành công!", "success");
    dispatch(setPageThuChi());
  }
};
const handleUpdate = async () => {
    if (role !== "admin") {
    
      notify("Bạn không có quyền cập nhật giao dịch này.", "error");
      return;
    }
    const { error } = await supabase
      .from("income")
      .update({
        amount,
        note: note.trim(),
        payment_method: paymentMethod.trim(),
        category: category.trim(),
      })
      .eq("id", detail.id)
      .eq("id_store", detail.id_store);

    if (error) {
   
      notify("Cập nhật thất bại!", "error");
    } else {
     
      notify("Cập nhật thành công!", "success");
      dispatch(setPageThuChi());
    }
  };
 return (
    <div className="page-detail-thuchi" style={{ padding: 16, paddingBottom: 150 }}>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 16
        }}
        onClick={() => dispatch(setPageThuChi())}
      >
        <FaArrowLeft style={{ marginRight: 8 }} />
        Quay lại
      </button>

      <h2>Chi tiết giao dịch</h2>
      <div style={{ marginTop: 16, fontSize: 16, lineHeight: 1.6 }}>
        <p>
          <strong>Số tiền:</strong>{" "}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </p>
        <p>
          <strong>Loại:</strong> {detail.source?.toUpperCase()}
        </p>
        <p>
          <strong>Ghi chú:</strong>{" "}
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </p>
        <p>
          <strong>Phương thức:</strong>{" "}
          <input
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </p>
        <p>
          <strong>Danh mục:</strong>{" "}
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </p>
        <p><strong>Thời gian:</strong> {new Date(detail.created_at).toLocaleString("vi-VN")}</p>
      </div>

      {/* Nút cố định */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 90,
          padding: 16,
          display: "flex",
          justifyContent: "center",
          gap: 50,
        }}
      >
        <button
          style={{
            padding: "12px 24px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={handleDelete}
        >
          Xóa
        </button>
        <button
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={handleUpdate}
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}
