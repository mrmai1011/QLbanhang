import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";
import ItemThuChi from "./itemThuChi";
import { supabase } from "../../supabaseClient";
import { useSelector , useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setPageKhoanThu } from "../../redux/slice/pageSlice";

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
    let { data: filtered, total, thu, chi, newType } = filterDataByTimeRange(allData, selectedDay);
    console.log("pay ",selectedPayment)
    if (selectedPayment !== "all") {
      filtered = filtered.filter((item) => item.payment_method === selectedPayment);
    }

    if (selectedTransaction !== "all") {
      filtered = filtered.filter((item) => item.source === selectedTransaction);
    }

    setFilteredOrders(filtered);
    setFilteredTotal(filtered.reduce((sum, o) => sum + o.amount, 0));
    setFilteredThu(thu);
    setFilteredChi(chi);
    setType(newType);
  }, [allData, selectedDay, selectedPayment, selectedTransaction]);

  function filterDataByTimeRange(data, type) {
    const now = new Date();
    let startDate = null;
    let endDate = null;
    let newType = "Tất cả"

    switch (type) {
      case "today":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        newType = "Hôm nay"
        break;
      case "yesterday":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setDate(now.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        newType = "Hôm qua"
        break;
      case "thismonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        newType = "Tháng này"
        break;
      case "lastmonth":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
         newType = "Tháng trước"
        break;
      case "thisyear":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        newType = "Năm này"
        break;
      case "all":
        return {
          data,
          total: data.reduce((sum, o) => sum + o.amount, 0),
          thu: data.filter((o) => o.source === "thu").reduce((sum, o) => sum + o.amount, 0),
          chi: data.filter((o) => o.source === "chi").reduce((sum, o) => sum + o.amount, 0),
          newType: "Tất cả"
        };
      default:
        return { data: [], total: 0, thu: 0, chi: 0, type: "Tất cả" };
    }

    const filtered = data.filter((item) => {
      const date = new Date(item.created_at);
      return date >= startDate && date <= endDate;
    });

    const total = filtered.reduce((sum, o) => sum + o.amount, 0);
    const thu = filtered.filter((o) => o.source === "thu").reduce((sum, o) => sum + o.amount, 0);
    const chi = filtered.filter((o) => o.source === "chi").reduce((sum, o) => sum + o.amount, 0);

    return { data: filtered, total, thu, chi, newType };
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
          <h1>{(filteredThu - filteredChi).toLocaleString("vi-VN")}đ</h1>
        </div>

        <div className="tc-tongthuchi">
          <div className="tc-tongchi">
            <i style={{ color: "rgb(184, 85, 14)" }}><FaRegArrowAltCircleUp /></i> TỔNG CHI
            <h1>{filteredChi.toLocaleString("vi-VN")}đ</h1>
          </div>
          <div className="tc-tongthu">
            <i style={{ color: "rgb(64, 123, 8)" }}><FaRegArrowAltCircleDown /></i> TỔNG THU
            <h1>{filteredThu.toLocaleString("vi-VN")}đ</h1>
          </div>
        </div>

        <div className="tc-today">
          <div className="tc-today-text">
            <h3>{type.toUpperCase()}</h3>
            <h3>{filteredTotal.toLocaleString("vi-VN")}đ</h3>
          </div>

          <div className="tc-list-today">
            {filteredOrders.map((order, index) => {
              let Icon = FaRegArrowAltCircleUp;
              if (order.source === "thu") Icon = FaRegArrowAltCircleDown;
              return <ItemThuChi key={index} Icon={Icon} orders={order} />;
            })}
          </div>
          {/*   tạo khoản trắng ở dưới */}
          <div style={{height:"50px"}}></div>
        </div>
      </div>

      <div className="btn-thu-chi">
            <button style={{background:"rgb(188, 90, 5)", color:"white" , fontSize:"1.3rem"}}><i><FaRegArrowAltCircleUp/></i> Khoản chi</button>
            <button onClick={handleOpenTaoThu} style={{background:"rgb(55, 143, 5)", color:"white" , fontSize:"1.3rem"}}><i><FaRegArrowAltCircleDown/></i> Khoản thu</button>
      </div>
    </div>
  );
}