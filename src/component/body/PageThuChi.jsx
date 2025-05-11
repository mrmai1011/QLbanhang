import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";
import ItemThuChi from "./itemThuChi";
import { supabase } from "../../supabaseClient";
import { useSelector , useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setPageKhoanThu ,setPageKhoanChi} from "../../redux/slice/pageSlice";
import { FaChevronLeft , FaChevronRight } from "react-icons/fa";

export default function PageThuChi() {
  const storeId = useSelector((state) => state.login.store_id);
  const dispatch = useDispatch()
  const [allData, setAllData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [filteredThu, setFilteredThu] = useState(0);
  const [filteredChi, setFilteredChi] = useState(0);

  const [selectedDay, setSelectedDay] = useState("today");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState("all");
  const [type, setType] = useState("Hôm nay");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenTaoChi =  () =>{
    dispatch(setPageKhoanChi())
}
  const handleOpenTaoThu =  () =>{
        dispatch(setPageKhoanThu())
  }

  const fetchAllIncomeByStore = async (storeId) => {
    const { data, error } = await supabase
      .from("income")
      .select("*")
      .eq("id_store", storeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi khi fetch income:", error);
      return [];
    }

    return data;
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAllIncomeByStore(storeId);
      setAllData(data);
    };
    getData();
  }, [storeId]);

  useEffect(() => {
    // Tính số dư và tổng thu/chi chỉ dựa vào selectedDay
    const { data: dayFilteredData, thu, chi, newType } = filterDataByTimeRange(allData, selectedDay);
    // ✅ Sắp xếp theo thời gian giảm dần (gần nhất đến lâu nhất)
    const sortedData = [...dayFilteredData].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setFilteredTotal(dayFilteredData.reduce((sum, o) => sum + o.amount, 0));
    setFilteredThu(thu);
    setFilteredChi(chi);
    setType(newType);

    // Tiếp tục filter thêm cho List Today (Payment & Transaction)
    let finalList = sortedData;

    if (selectedPayment !== "all") {
        finalList = finalList.filter((item) => item.payment_method === selectedPayment);
    }

    if (selectedTransaction !== "all") {
        finalList = finalList.filter((item) => item.source === selectedTransaction);
    }

    setFilteredOrders(finalList);
}, [allData, selectedDay, selectedPayment, selectedTransaction]);

  function filterDataByTimeRange(data, type, payment = null, transaction = null) {
    const now = new Date();
    let startDate = null;
    let endDate = null;
    let newType = "Tất cả";

    switch (type) {
        case "today":
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            newType = "Hôm nay";
            break;
        case "yesterday":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setDate(now.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
            newType = "Hôm qua";
            break;
        case "thismonth":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            newType = "Tháng này";
            break;
        case "lastmonth":
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            newType = "Tháng trước";
            break;
        case "thisyear":
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            newType = "Năm này";
            break;
        case "all":
            return applyAdditionalFilters(data, payment, transaction, "Tất cả");
        default:
            return { data: [], total: 0, thu: 0, chi: 0, newType: "Tất cả" };
    }

    const filtered = data.filter((o) => {
        const createdAt = new Date(o.created_at);
        return createdAt >= startDate && createdAt <= endDate;
    });

    return applyAdditionalFilters(filtered, payment, transaction, newType);
}

function applyAdditionalFilters(data, payment, transaction, newType) {
  const finalData = data.filter((o) => {
      const paymentMatch = payment === "all" || !payment ? true : o.payment_method === payment;
      const transactionMatch = transaction === "all" || !transaction ? true : o.source === transaction;
      return paymentMatch && transactionMatch;
  });

  return {
      data: finalData,
      total: finalData.reduce((sum, o) => sum + o.amount, 0),
      thu: finalData.filter((o) => o.source === "thu").reduce((sum, o) => sum + o.amount, 0),
      chi: finalData.filter((o) => o.source === "chi").reduce((sum, o) => sum + o.amount, 0),
      newType
  };
}

  return (
    <div className="page-thuchi">
      <div className="tc-filter-wapper">
        <select className="tc-select-day" onChange={(e) => setSelectedDay(e.target.value)}>
          <option value="today">Hôm nay</option>
          <option value="yesterday">Hôm qua</option>
          <option value="thismonth">Tháng này</option>
          <option value="lastmonth">Tháng trước</option>
          <option value="thisyear">Năm này</option>
          <option value="all">Tất cả</option>
        </select>
        <select className="tc-select-payment" onChange={(e) => setSelectedPayment(e.target.value)}>
          <option value="all">Nguồn tiền</option>
          <option value="tiền mặt">Tiền mặt</option>
          <option value="chuyển khoản">Chuyển khoản</option>
        </select>
        <select className="tc-select-transaction" onChange={(e) => setSelectedTransaction(e.target.value)}>
          <option value="all">Tất cả giao dịch</option>
          <option value="thu">Khoản thu</option>
          <option value="chi">Khoản chi</option>
        </select>
      </div>

      <div className="tc-showfilter">
        <div className="tc-sodu">
          <h2>Số dư</h2>
          <h1>{(filteredThu - filteredChi).toLocaleString("vi-VN")}</h1>
        </div>

        <div className="tc-tongthuchi">
          <div className="tc-tongchi">
            <i style={{ color: "rgb(184, 85, 14)" }}><FaRegArrowAltCircleUp /></i> TỔNG CHI
            <h1>{filteredChi.toLocaleString("vi-VN")}</h1>
          </div>
          <div className="tc-tongthu">
            <i style={{ color: "rgb(64, 123, 8)" }}><FaRegArrowAltCircleDown /></i> TỔNG THU
            <h1>{filteredThu.toLocaleString("vi-VN")}</h1>
          </div>
        </div>

        <div className="tc-today">
          <div className="tc-today-text">
              {filteredOrders.length > 0 ? (
                <>
                  <h3>{type.toUpperCase()}</h3>
                  <h3>
                    {(
                      filteredOrders
                        .filter((o) => o.source === "thu")
                        .reduce((sum, o) => sum + o.amount, 0) -
                      filteredOrders
                        .filter((o) => o.source === "chi")
                        .reduce((sum, o) => sum + o.amount, 0)
                    ).toLocaleString("vi-VN")}
                  </h3>
                </>
              ) : (
                <h3>Không tìm thấy kết quả phù hợp!</h3>
              )}
            </div>

          <div className="tc-list-today">
             {paginatedOrders.map((order, index) => {
                let Icon = FaRegArrowAltCircleUp;
                if (order.source === "thu") Icon = FaRegArrowAltCircleDown;
                return <ItemThuChi key={index} Icon={Icon} orders={order} />;
              })}

              {totalPages > 1 && (
                <div className="pagination-controls" style={{ marginTop: "10px", textAlign: "center" }}>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ marginRight: "10px" }}
                  >
                   <i><FaChevronLeft/></i>
                  </button>
                  <span>Trang {currentPage}/{totalPages}</span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ marginLeft: "10px" }}
                  >
                     <i><FaChevronRight/></i>
                  </button>
                </div>
              )}
          </div>
          {/*   tạo khoản trắng ở dưới */}
          <div style={{height:"50px"}}></div>
        </div>
      </div>

      <div className="btn-thu-chi">
            <button onClick={handleOpenTaoChi} style={{background:"rgb(188, 90, 5)", color:"white" , fontSize:"1.3rem"}}><i><FaRegArrowAltCircleUp/></i> Khoản chi</button>
            <button onClick={handleOpenTaoThu} style={{background:"rgb(55, 143, 5)", color:"white" , fontSize:"1.3rem"}}><i><FaRegArrowAltCircleDown/></i> Khoản thu</button>
      </div>
    </div>
  );
}