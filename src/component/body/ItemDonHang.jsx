

export default function ItemDonHang({ order , onClick}) {
  const getPaymentStatus = () => {
    if (order.debt > 0) return `Còn nợ ${order.debt.toLocaleString("vi-VN")}đ`;
    return "Đã thanh toán";
  };

  const paymentColor = order.debt > 0 ? "rgb(184, 64, 13)" : "green";
  console.log(order.items);
  return (
    <div className="item-donhang"  onClick={onClick}>
      <div className="item-donhang-name">
        <p>{order.payment_method || "(Không tên)"} - {order.items[0].name}</p>
        <p style={{ color: "green" }}>
          {order.status || "Đã giao"}
        </p>
      </div>

      <div className="item-donhang-date">
        <p>
          {new Date(order.created_at).toLocaleDateString("vi-VN")} - Mã đơn:{" "}
          {(order.id_bill || order.id || "").toString().slice(0, 8)}
        </p>
        <p style={{ color: paymentColor }}>{getPaymentStatus()}</p>
      </div>

      <div
        style={{
          borderTop: "solid 1px rgba(107, 105, 105, 0.61)",
          width: "95%",
          transform: "translateX(10px)",
        }}
      ></div>

      <div className="item-donhang-bottom">
        <div className="item-donhang-tong">
          <h3>Tổng cộng</h3>
          <h2>{Number(order.total).toLocaleString("vi-VN")}đ</h2>
        </div>
      </div>
    </div>
  );
}