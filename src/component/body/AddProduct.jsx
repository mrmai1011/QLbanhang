import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
export default function AddProduct({ onBack, exit }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const storeId = useSelector((state) => state.login.store_id);
    const role = useSelector((state) => state.login.role);
    

    const handleAdd = async () => {
        if (role !== "admin") 
        {
            alert("bạn không có quyền add");
            return
        }
        if (!name || !price || !image) {
          alert("Vui lòng nhập đầy đủ thông tin");
          return;
        }
    
        try {
          setLoading(true);
    
          // Upload lên Cloudinary
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "webbanhang");
    
          const res = await fetch("https://api.cloudinary.com/v1_1/dixsdmznl/image/upload", {
            method: "POST",
            body: formData
          });
    
          const data = await res.json();
          const imageUrl = data.secure_url;
    
          // Gửi vào Supabase
          const { error } = await supabase.from("products").insert([
            { name: name, store_id: storeId, price: Number(price), imgUrl: imageUrl }
          ]);
    
          if (error) {
            console.error(error);
            alert("Lỗi khi thêm sản phẩm");
          } else {
            alert("Đã thêm sản phẩm!");
            onBack(); // Quay lại sau khi thêm
          }
    
        } catch (err) {
          console.error(err);
          alert("Lỗi hệ thống");
        } finally {
          setLoading(false);
        }
      };

  
    return (
        <div className={`add-product-form ${exit ? 'slide-out' : 'slide-in'}`}>
      <button onClick={onBack} className="btn-back">
        <IoArrowBack size={24} /> Quay lại
      </button>

      <h2>Thêm sản phẩm mới</h2>
      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Giá"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button className="btn-add" onClick={handleAdd} disabled={loading}>
        {loading ? "Đang thêm..." : "Thêm"}
      </button>
    </div>
    );
  }