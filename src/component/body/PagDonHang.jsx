import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import ItemDonHang from "./ItemDonHang";
import { useSelector, useDispatch } from "react-redux";
import { FaChevronLeft , FaChevronRight } from "react-icons/fa";
import { setDetailDonHang } from "../../redux/slice/orderSlice";
import { setPageDetailDonHang } from "../../redux/slice/pageSlice";

export default function PageDonHang() {
  const [selectedDay, setSelectedDay] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;
  const storeId = useSelector((state) => state.login.store_id);

  const dispatch = useDispatch()

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    applyFilters();
  }, [selectedDay, selectedStatus, orders]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id_store", storeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi khi fetch orders:", error);
      return;
    }

    setOrders(data);
    setFilteredOrders(data);
  };

  const applyFilters = () => {
    const now = new Date();

    const filtered = orders.filter((order) => {
      // Filter theo ngày
      const dateMatch =
        selectedDay === "today"
          ? new Date(order.created_at).toDateString() === now.toDateString()
          : true;

      // Filter theo trạng thái nợ
      const statusMatch = (() => {
        if (selectedStatus === "all") return true;
        if (selectedStatus === "full") return order.debt <= 0;
        if (selectedStatus === "partial") return order.debt > 0;
        return true;
      })();

      return dateMatch && statusMatch;
    });

     // ✅ Sắp xếp theo ngày giảm dần
  const sortedFiltered = [...filtered].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  setFilteredOrders(sortedFiltered);
  };

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="page-donhang">
      <div className="dh-filter-wapper">
        {/* Filter Ngày */}
        <select
          className="dh-select-day"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option value="today">Hôm nay</option>
          <option value="all">Tất cả</option>
        </select>

        {/* Filter Trạng thái */}
        <select
          className="dh-select-status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="full">Đã thanh toán</option>
          <option value="partial">Còn nợ</option>
        </select>
      </div>

      {/* Danh sách đơn hàng */}
      {paginatedOrders.length > 0 ? (
        paginatedOrders.map((order) => (
          <ItemDonHang key={order.id_bill} order={order}
           
              onClick={() => {
                dispatch(setDetailDonHang({order,fromPage:"pageDonHang"}));
                dispatch(setPageDetailDonHang())
                
              }}
           />
        ))
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Không tìm thấy kết quả phù hợp.
        </p>
      )}

    {/* Pagination Controls */}
{totalPages > 1 && (
  <div
    style={{
      position: "fixed",
      bottom: "100px",
      left: 0,
      right: 0,
      textAlign: "center",
      zIndex: 1000, // Ưu tiên hiển thị trên cùng
    }}
  >
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      style={{
        padding: "8px 16px",
        marginRight: "10px",
        borderRadius: "8px",
        backgroundColor: "#ccc",
        border: "none",
        cursor: currentPage === 1 ? "not-allowed" : "pointer",
      }}
    >
      <i><FaChevronLeft/></i>
    </button>

    <span>
      Trang {currentPage} / {totalPages}
    </span>

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      style={{
        padding: "8px 16px",
        marginLeft: "10px",
        borderRadius: "8px",
        backgroundColor: "#ccc",
        border: "none",
        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
      }}
    >
       <i><FaChevronRight/></i>
    </button>
  </div>
)}
    </div>
  );
}
