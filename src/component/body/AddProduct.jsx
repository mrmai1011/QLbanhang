import { useState , useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { TiDelete } from "react-icons/ti";
import { useFormattedAmount } from "../../utils/useFormattedAmount";

export default function AddProduct({ product = null, onBack, exit }) {
    const storeId = useSelector((state) => state.login.store_id);
  const role = useSelector((state) => state.login.role);

  const isEditMode = !!product;

  const [name, setName] = useState(product?.name || "");
  const [image, setImage] = useState(null);
  const [imgUrl, setImgUrl] = useState(product?.imgUrl || "");
  const [oldImgPublicId, setOldImgPublicId] = useState(product?.img_public_id || null);
  const [loading, setLoading] = useState(false);

  const { amount, amountRaw, handleAmountChange, setAmountDirect } = useFormattedAmount();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(product?.category || null);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      setAmountDirect(product?.price || 0);
    }
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("category")
      .select("id, name")
      .or(`store_id.eq.${storeId},store_id.is.null`);

    if (!error) {
      setCategories(data);
      if (!isEditMode) {
        setCategoryId(data[0]?.id);
      }
    }
  };

  const handleDelete = async () => {
  if (!isEditMode || !product) return;

  const confirmDelete = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
  if (!confirmDelete) return;

  try {
    setLoading(true);

    // Xóa ảnh cũ nếu có
    if (product.img_public_id) {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: product.img_public_id }),
      });
    }

    // Xóa sản phẩm khỏi Supabase
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id)
      .eq("store_id", storeId);

    if (error) {
      throw error;
    } else {
      alert("Đã xóa sản phẩm!");
      onBack();
    }
  } catch (err) {
    console.error(err);
    alert("Xóa thất bại.");
  } finally {
    setLoading(false);
  }
};

  const deleteOldImage = async () => {
    if (!oldImgPublicId) return;
    await fetch("/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: oldImgPublicId }),
    });
  };

  const handleSaveOrUpdate = async () => {
    if (role !== "admin") {
      alert("Bạn không có quyền thao tác.");
      return;
    }

    if (!name || !amount) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = imgUrl;
      let imagePublicId = oldImgPublicId;

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "webbanhang");

        const res = await fetch("https://api.cloudinary.com/v1_1/dixsdmznl/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        imageUrl = data.secure_url;
        imagePublicId = data.public_id;

        if (isEditMode) await deleteOldImage();
      }

      if (isEditMode) {
        const { error } = await supabase
          .from("products")
          .update({
            name,
            price: amount,
            category: categoryId,
            imgUrl: imageUrl,
           
          })
          .eq("id", product.id)
          .eq("store_id", storeId);

        if (error) throw error;
        alert("Đã cập nhật sản phẩm!");
      } else {
        const { error } = await supabase.from("products").insert([
          {
            name,
            store_id: storeId,
            price: amount,
            category: categoryId,
            imgUrl: imageUrl,
           
          },
        ]);
        if (error) throw error;
        alert("Đã thêm sản phẩm!");
      }

      onBack();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`add-product-form ${exit ? "slide-out" : "slide-in"}`} style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <button onClick={onBack} className="btn-back-product">
        <IoArrowBack size={24} /> Quay lại
      </button>

      <h2>{isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>

      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Giá"
        value={amountRaw}
        onChange={handleAmountChange}
      />

      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

      {imgUrl && !image && (
        <img src={imgUrl} alt="Ảnh sản phẩm" style={{ width: 100, height: 100, marginTop: 10 }} />
      )}

      <div style={{ marginTop: 10 }}>
        <label className="category-label">Danh mục:</label>
        <select className="category-select" value={categoryId || ""} onChange={(e) => setCategoryId(parseInt(e.target.value))}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
          <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            flexDirection: isEditMode ? "row" : "column",
          }}
        >
          {isEditMode && (
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: "red",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {loading ? "Đang xóa..." : "Xóa sản phẩm"}
            </button>
          )}

          <button
            onClick={handleSaveOrUpdate}
            disabled={loading}
          
            style={{
              flex: 1,
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {loading ? "Đang xử lý..." : isEditMode ? "Cập nhật" : "Thêm"}
          </button>
        </div>
    </div>
  );
  }