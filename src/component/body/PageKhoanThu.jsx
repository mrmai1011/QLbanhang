import { useDispatch , useSelector } from "react-redux";
import { setPageThuChi } from "../../redux/slice/pageSlice";
import { useState , useEffect} from "react";
import { useFormattedAmount } from "../../utils/useFormattedAmount";
import { supabase } from "../../supabaseClient";
import { useNotifier } from "../../utils/notifier";
import { configs } from "eslint-plugin-react-refresh";


export default function TaoKhoanThu({ sourceType = "thu", detail = null }) {
  const dispatch = useDispatch();
  const [exitAnimation, setExitAnimation] = useState(false);
  const storeId = useSelector((state) => state.login.store_id);
  const role = useSelector((state) => state.login.role);

  const isViewMode = !!detail;

  const { amount, amountRaw, handleAmountChange, setAmountDirect } = useFormattedAmount();

  const [note, setNote] = useState(detail?.guest || "");
  const [paymentMethod, setPaymentMethod] = useState(detail?.payment_method || "tiền mặt");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(detail?.category || "");
   const { notify, confirm } = useNotifier();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("category")
        .select("id, name")
        .or(`store_id.eq.${storeId},store_id.is.null`);

      if (error) {
        console.error("Lỗi khi tải category:", error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, [storeId]);

  useEffect(() => {
    if (detail) {
      setAmountDirect(detail.amount);
    }
  }, [detail]);

  const handleBackThuChi = () => {
    setExitAnimation(true);
    setTimeout(() => {
      dispatch(setPageThuChi());
      setExitAnimation(false);
    }, 200);
  };

  const handleSave = async () => {
    if (amount <= 0) return;

    const { error } = await supabase.from("income").insert([
      {
        id_store: storeId,
        amount: amount,
        payment_method: paymentMethod,
        source: sourceType,
        guest: note,
        category: selectedCategoryId || null,
        created_at: new Date().toISOString()
      }
    ]);

    if (error) {
   
      
      notify("Lưu thất bại!", "error");
    } else {
   
      notify("Lưu thành công!", "success");
      dispatch(setPageThuChi());
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("income")
      .update({
        amount,
        guest: note,
        payment_method: paymentMethod,
        category: selectedCategoryId || null
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

  const handleDelete = async () => {
    if (role !== "admin") {
   
      notify("Bạn không có quyền xóa giao dịch.", "error");
      return;
    }

    const confirms = await confirm("Bạn có chắc chắn muốn xóa giao dịch này?");
    if (!confirms) return;

    const { error } = await supabase
      .from("income")
      .delete()
      .eq("id", detail.id)
      .eq("id_store", detail.id_store);

    if (error) {
    
      notify("Xóa thất bại!", "error");
    } else {
 
      notify("Xóa thành công!", "success");
      dispatch(setPageThuChi());
    }
  };

  const saveButtonColor = sourceType === "thu" ? "rgb(55, 143, 5)" : "rgb(221, 101, 10)";

  return (
    <div className={`tao-khoan-thu ${exitAnimation ? "slide-out" : "slide-in"}`} style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>{isViewMode ? "Chi tiết giao dịch" : `Tạo khoản ${sourceType}`}</h2>

      <div className="form-group" style={{ marginBottom: "10px" }}>
        <label style={{ color: sourceType === "thu" ? "rgb(8, 158, 8)" : "rgb(188, 133, 14)" }}>Số tiền {sourceType}</label>
        <input type="text" className="input" onChange={handleAmountChange } value={amountRaw} style={{ color: sourceType === "thu" ? "rgb(8, 158, 8)" : "rgb(188, 133, 14)" }} />
      </div>

      <div className="form-group" style={{ marginBottom: "10px" }}>
        <label>Danh mục</label>
        <select className="input" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat,index) => (
            <option key={index} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: "10px" }}>
        <label>Nguồn tiền</label>
        <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="tiền mặt">Tiền mặt</option>
          <option value="chuyển khoản">Chuyển khoản</option>
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: "10px" }}>
        <label>Ghi chú</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} className="input" rows="3" />
      </div>

      <div className="form-actions" style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
      

        {isViewMode ? (
          <>
            <button onClick={handleBackThuChi} className="btn-back-kt" style={{width:"33%"}}>Quay lại</button>
            <button onClick={handleDelete} 
                style={{
                backgroundColor: role !== "admin" ? "#ccc" : "red",
                color: "white",
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                width: "33%",
                cursor: role !== "admin" ? "not-allowed" : "pointer",
            }}
            disabled={role !== "admin"}
            >Xóa</button>

            <button onClick={handleUpdate} 
            style={{
            backgroundColor: role !== "admin" ? "#ccc" : "#007bff",
            color: "white",
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            width: "33%",
            cursor: role !== "admin" ? "not-allowed" : "pointer",
           }}
                    disabled={role !== "admin"}
            >Cập nhật</button>
          </>
        ) : (
            <>
             <button onClick={handleBackThuChi} className="btn-back-kt">Quay lại</button> 
            <button
                onClick={handleSave}
                className="btn-save"
                disabled={!amount || parseInt(amount) <= 0}
                style={{
                backgroundColor: !amount || parseInt(amount) <= 0 ? "#ccc" : saveButtonColor,
                color: "white",
                cursor: !amount || parseInt(amount) <= 0 ? "not-allowed" : "pointer",
                }}
            >
                Lưu
            </button>
          </>
        )}
      </div>
    </div>
  );
}
