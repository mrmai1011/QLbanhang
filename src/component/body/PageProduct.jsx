import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setDetailProduct } from "../../redux/slice/orderSlice";
import { setPage } from "../../redux/slice/pageSlice";
import { useNotifier } from "../../utils/notifier";

export default function PageProduct() {
    const dispatch = useDispatch();
  const storeId = useSelector((state) => state.login.store_id);
  const [products, setProducts] = useState([]);
  const { notify , confirm} = useNotifier();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeId);

      if (error) {
       
        notify("Lỗi khi tải sản phẩm: " + error.message, "error");

      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, [storeId]);

 /*  const handleDelete = async (product) => {
    const confirms =  await confirm("Bạn có chắc muốn xóa sản phẩm này?");
    if (!confirms) return;

    // Xóa ảnh khỏi Cloudinary nếu có
    if (product.img_public_id) {
      try {
        await axios.post("/api/delete-image", { public_id: product.img_public_id });
      } catch (err) {
       
        notify("Lỗi khi xóa ảnh: " + err.message, "error");
      }
    }

    // Xóa khỏi Supabase
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id)
      .eq("store_id", storeId);

    if (error) {
    
      notify("Xóa thất bại: " + error.message, "error");
    } else {
    
      notify("Đã xóa sản phẩm!", "success");
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };
 */
    const handleViewDetail = (product) => {
    // Lưu thông tin sản phẩm vào Redux
        dispatch(setDetailProduct(product)); 
        dispatch(setPage("pageDetailProduct")) // Chuyển trang
    }



  return (
   <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center",  }}>
    <h2 style={{  marginBottom: 30, backgroundColor:"rgba(40, 139, 7, 0.8)", height:"50px", width:"100%" ,textAlign:"center", borderRadius:"10px", lineHeight:"50px"}}>Danh sách sản phẩm</h2>

    {products.map((product) => (
        <div
        key={product.id}
        onClick={() => handleViewDetail(product)}
        style={{
            display: "flex",
            width: "90%",
            maxWidth: 800,
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 12,
            borderRadius: 8,
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease",
            backgroundColor: "#f9f9f9",
          
        }}
        >
        {/* Ảnh (30%) */}
        <div style={{ flex: "0 0 30%", paddingRight: 12 }}>
            {product.imgUrl && (
            <img
                src={product.imgUrl}
                alt={product.name}
                style={{
                width: "100%",
                aspectRatio: "1 / 1", // ✅ luôn là hình vuông
                objectFit: "cover",
                borderRadius: 6,
                }}
            />
            )}
        </div>

        {/* Nội dung (30%) */}
        <div
            style={{
            flex: "0 0 70%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            }}
        >
            <h3
                style={{
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%", // đảm bảo giới hạn trong container
                }}
                >
                {product.name}
                </h3>
            <p style={{ margin: "4px 0 0", color: "green", fontWeight: "bold" }}>
            {Number(product.price).toLocaleString("vi-VN")}đ
            </p>
        </div>
        </div>
    ))}
    </div>
  );
}