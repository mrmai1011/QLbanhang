import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";
import { useEffect,useState } from "react";
import { supabase } from "../../supabaseClient";
import { useSelector } from "react-redux";


export default function ItemThuChi({ Icon = FaRegArrowAltCircleDown, orders , onClick }) {



  const color = orders.source === "thu" ? "green" : "rgb(222, 78, 17)";
  const totalPrefix = orders.source === "thu" ? "+" : "-";
  const totalFormatted = totalPrefix + orders.amount.toLocaleString("vi-VN");
  const [categoryMap, setCategoryMap] = useState({});
  const storeId = useSelector((state) => state.login.store_id);

    const thuchi = useSelector((state) => state.order.detailThuChi);

  const time = new Date(orders.created_at).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString =  new Date(orders.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
  

  useEffect(() => {
    const fetchCategories = async () => {
        const { data, error } = await supabase
                 .from("category")
                .select("id, name")
                .or(`store_id.eq.${storeId},store_id.is.null`); // storeId là UUID, ví dụ '550e8400-e29b-41d4-a716-446655440000'


        if (!error && data) {
            const map = {};
            data.forEach((cat) => {
                map[cat.id] = cat.name;
            });
            setCategoryMap(map);
        }
    };

    fetchCategories();
}, [storeId]);
  const handleShowDetail = () => {
    if (onClick) {
      onClick(orders);
      /* console.log(thuchi); */
      
    }
  };

  return (
    <div className="item-thuchi" onClick={handleShowDetail} >

      <i style={{ color, fontSize: "1.5rem" }}><Icon /></i>
      <div className="item-thuchi-action">
        <div className="item-thuchi-name-price">
          <h3 style={{   fontWeight: "bold",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "200px" }}
            >Khách {orders.guest || "(Không tên)"}</h3>
          <h3 style={{ color }}>{totalFormatted}</h3>
        </div>
        <div className="item-thuchi-pay-time">
          <div>
            {orders.source === "thu" 
              ? `Thu ${orders.category ? ` - ${categoryMap[orders.category]}` : ""}` 
              : `Chi ${orders.category ? ` - ${categoryMap[orders.category]}` : ""}`}
          </div>
          <div>{orders.payment_method} | {time}</div>
        </div>
        <div className="item-thuchi-des">
          <div>Mã giao dịch: {(orders.id_bill || orders.id || "").slice(0, 8)}</div>
          <div style={{fontSize:"1.2rem"}}>{dateString}</div>
        </div>
      </div>
    </div>
  );
}