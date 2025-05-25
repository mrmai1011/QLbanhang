import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";
import { setPage } from "../../redux/slice/pageSlice";
import { FaArrowLeft, FaBolt } from "react-icons/fa";

import { useFormattedAmount } from "../../utils/useFormattedAmount";
import { useNotifier } from "../../utils/notifier";

export default function PageBanNhanh() {
  const dispatch = useDispatch();
  const storeId = useSelector((state) => state.login.store_id);
  const { notify } = useNotifier();

  const [note, setNote] = useState("");
   const [exitAnimation, setExitAnimation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tiền mặt");
  const [guest, setGuest] = useState("tới mua");

  const {
    amount: totalAmount,
    amountRaw: totalRaw,
    handleAmountChange: handleTotalChange,
  } = useFormattedAmount();

  const {
    amount: prepaidAmount,
    amountRaw: prepaidRaw,
    handleAmountChange: handlePrepaidChange,
  } = useFormattedAmount();


    const handleBack = () => {
    setExitAnimation(true); // kích hoạt animation rút ra
    setTimeout(() => {
        
        dispatch(setPage("pageBanHang"))
        setExitAnimation(false);
      }, 200); // khớp với thời gian animation
    
  };

  const handleQuickSell = async () => {
  const total = totalAmount;
  const prepaid = prepaidAmount || total; // nếu không nhập thì coi như thanh toán đủ
  const debt = total - prepaid;

  if (!total || total <= 0 || !selectedCategoryId) {
    notify("Vui lòng nhập số tiền đơn hàng và danh mục!" , "error");
    return;
  }

  if (prepaid > total) {
    notify("Số tiền đưa trước không được lớn hơn tổng đơn hàng!",   "error");
    return;
  }

  const now = new Date().toISOString();

  const order = {
    id_store: storeId,
   items: [
    {
      id: "quick-sale",
      name: "Bán nhanh",
      quantity: 1,
      price: prepaid,
      image: "" // bạn thay bằng logo của bạn
    }
    ],
    total,
    prepaid,
    debt,
    note,
    guest,
    payment_method: paymentMethod,
    created_at: now,
  };

  const income = {
    id_store: storeId,
    amount: prepaid,
    payment_method: paymentMethod,
    source: "thu",
    guest,
    category: selectedCategoryId,
    created_at: now,
  };

  const { error: error1 } = await supabase.from("orders").insert([order]);
  const { error: error2 } = await supabase.from("income").insert([income]);

  if (error1 || error2) {
    console.error("Lỗi:", error1 || error2);
    notify("Không thể tạo đơn bán nhanh!", "error");
  } else {
    notify("Tạo đơn bán nhanh thành công!", "success");
    dispatch(setPage("pageBanHang"));
  }
};

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("category")
        .select("id, name")
        .or(`store_id.eq.${storeId},store_id.is.null`);

      if (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } else {
        const thuCategories = data.filter(cat => cat.name?.toLowerCase() !== "chi");
        setCategories(thuCategories);
        if (thuCategories.length > 0) setSelectedCategoryId(thuCategories[0].id);
      }
    };

    fetchCategories();
  }, [storeId]);

  return (
    <div className={`ban-nhanh-container ${exitAnimation ? 'slide-out' : 'slide-in'}`}>
      <div className="ban-nhanh-header">
        <button onClick={handleBack} className="btn-back">
          <FaArrowLeft />
        </button>
        <h2>Bán nhanh</h2>
      </div>

      <div className="ban-nhanh-form">
        <div className="form-group">
          <label>Số tiền đơn hàng</label>
          <input
            type="text"
            value={totalRaw}
            onChange={handleTotalChange}
            placeholder="Nhập tổng đơn hàng"
          />
        </div>

        <div className="form-group">
          <label>Số tiền khách đưa trước</label>
          <input
            type="text"
            value={prepaidRaw}
            onChange={handlePrepaidChange}
            placeholder="Nếu để trống sẽ mặc định thanh toán đủ"
          />
        </div>

        <div className="form-group">
          <label>Danh mục</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Hình thức thanh toán</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="tiền mặt">Tiền mặt</option>
            <option value="chuyển khoản">Chuyển khoản</option>
          </select>
        </div>

            

        <div className="form-group">
          <label>Nội dung</label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú đơn hàng"
          />
        </div>

      <button
        className="btn-bannhanh"
        onClick={handleQuickSell}
        disabled={!totalAmount || totalAmount <= 0 || !selectedCategoryId}
        style={{
            backgroundColor:
            !totalAmount || totalAmount <= 0 || !selectedCategoryId ? "#ccc" : "#f59e0b",
            color: "white",
            cursor:
            !totalAmount || totalAmount <= 0 || !selectedCategoryId
                ? "not-allowed"
                : "pointer",
        }}
        >
        <FaBolt style={{ marginRight: "8px" }} />
        Bán nhanh
        </button>
      </div>
    </div>
  );
}
