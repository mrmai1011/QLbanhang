import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PageReport({ storeId }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [timeFilter, setTimeFilter] = useState("today");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id_bill, total, created_at, items")
      .eq("id_store", storeId);

    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("id, name");

    if (orderError || productError) {
      console.error("Lỗi khi lấy dữ liệu:", orderError || productError);
      return;
    }

    setOrders(orderData || []);
    setProducts(productData || []);
  };

  const filterLabels = {
    today: "Hôm nay",
    thisMonth: "Tháng này",
    lastMonth: "Tháng trước",
    thisYear: "Năm nay",
    lastYear: "Năm trước",
  };

  const filteredOrders = orders.filter((order) => {
    const created = new Date(order.created_at);
    const now = new Date();

    switch (timeFilter) {
      case "today":
        return created.toDateString() === now.toDateString();

      case "thisMonth":
        return (
          created.getFullYear() === now.getFullYear() &&
          created.getMonth() === now.getMonth()
        );

      case "lastMonth":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return (
          created.getFullYear() === lastMonth.getFullYear() &&
          created.getMonth() === lastMonth.getMonth()
        );

      case "thisYear":
        return created.getFullYear() === now.getFullYear();

      case "lastYear":
        return created.getFullYear() === now.getFullYear() - 1;

      default:
        return true;
    }
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  const productReport = (() => {
    const countMap = {};
    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!item?.id) return;
        const key = String(item.id);
        countMap[key] = (countMap[key] || 0) + item.quantity;
      });
    });

    return Object.entries(countMap).map(([id, qty]) => {
      const product = products.find((p) => String(p.id) === String(id));
      return {
        id,
        name: product?.name || "???",
        quantity: qty,
      };
    });
  })();

  return (
    <div style={{ padding: 20 }}>
      <h2>Báo cáo doanh thu</h2>

      <div style={{ margin: "10px 0",}}>
        <label>Lọc theo: </label>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          style={{ marginLeft: 10, padding: 5, borderRadius: 5 }}
        >
          <option value="today">Hôm nay</option>
          <option value="thisMonth">Tháng này</option>
          <option value="lastMonth">Tháng trước</option>
          <option value="thisYear">Năm nay</option>
          <option value="lastYear">Năm trước</option>
        </select>
      </div>

      <h3>
        Doanh thu {filterLabels[timeFilter]}:{" "}
        <h1 style={{color:"green"}}>{totalRevenue.toLocaleString("vi-VN")}đ</h1>
      </h3>

      <div style={{ marginTop: 30 }}>
        <h3>Biểu đồ sản phẩm bán chạy</h3>
        {productReport.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productReport}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Không có dữ liệu sản phẩm trong thời gian này.</p>
        )}
      </div>
    </div>
  );
}
