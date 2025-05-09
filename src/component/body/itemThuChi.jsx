import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";

export default function ItemThuChi({ Icon = FaRegArrowAltCircleDown, orders }) {
  const color = orders.source === "thu" ? "green" : "rgb(222, 78, 17)";
  const totalPrefix = orders.source === "thu" ? "+" : "-";
  const totalFormatted = totalPrefix + orders.amount.toLocaleString("vi-VN");
  const time = new Date(orders.created_at).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString =  new Date(orders.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
  

  return (
    <div className="item-thuchi">

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
          <div>{orders.source === "thu" ? "Thu tiền" : "Chi tiền"}</div>
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