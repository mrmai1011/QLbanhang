import { useState , useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { TiDelete } from "react-icons/ti";
import { useFormattedAmount } from "../../utils/useFormattedAmount";
import { useNotifier  } from "../../utils/notifier";
import CategoryManager from "./CategoryManager";

export default function AddProduct({ product = null, onBack, exit }) {
    const storeId = useSelector((state) => state.login.store_id);
  // const role = useSelector((state) => state.login.role);

  const isEditMode = !!product;

  const [name, setName] = useState(product?.name || "");
  const [image, setImage] = useState(null);
  const [imgUrl, setImgUrl] = useState(product?.imgUrl || "");
  const [oldImgPublicId, setOldImgPublicId] = useState(product?.img_public_id || null);
  const [loading, setLoading] = useState(false);

  const { amount, amountRaw, handleAmountChange, setAmountDirect } = useFormattedAmount();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(product?.category || null);
  const [newCategory, setNewCategory] = useState('');
   const { notify, confirm } = useNotifier();

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

  const handleAddCategory = async () => {
  if (!newCategory.trim()) {
    notify("Vui lòng nhập tên danh mục.", "error");
    return;
  }

  const { data, error } = await supabase.from("category").insert([
    {
      name: newCategory.trim(),
      store_id: storeId,
    },
  ]);

  if (error) {
    notify("Thêm danh mục thất bại.", "error");
    console.error(error);
    return;
  }

  notify("Đã thêm danh mục!", "success");
  setNewCategory('');
  fetchCategories(); // Cập nhật lại danh sách danh mục
};

  const handleDelete = async () => {
  if (!isEditMode || !product) return;

      const confirmed = await confirm('Bạn có chắc muốn xóa sản phẩm này?');
      if (!confirmed) {
        notify('Đã huỷ thao tác.', 'info');
        return;
      }

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
        }

        notify("Đã xoá sản phẩm!", "success");
        onBack();
      } catch (err) {
        console.error(err);
        notify("Xoá thất bại.", "error");
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
    // if (role !== "admin") {
    
    //    notify("Bạn không có quyền thao tác.", "error");
    //   return;
    // }

    if (!name || !amount) {
     
       notify("Vui lòng nhập đầy đủ thông tin.", "error");
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
    
         notify("Đã cập nhật sản phẩm!");
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
      
         notify("Đã thêm sản phẩm!");
       /*   console.log("Thêm sản phẩm thành công"); */
      }

      onBack();
    } catch (err) {
      console.error(err);
 
       notify("Có lỗi xảy ra.", "error");
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
      
      <CategoryManager
        storeId={storeId}
        selectedId={categoryId}
        setSelectedId={setCategoryId}
      />
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