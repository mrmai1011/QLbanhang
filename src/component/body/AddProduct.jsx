import { useState , useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { TiDelete } from "react-icons/ti";
import { useFormattedAmount } from "../../utils/useFormattedAmount";

export default function AddProduct({ onBack, exit }) {
    const [name, setName] = useState("");
    
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const storeId = useSelector((state) => state.login.store_id);
    const role = useSelector((state) => state.login.role);
    
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [newCategory, setNewCategory] = useState("");

 
    const { amount, amountRaw, handleAmountChange } = useFormattedAmount();


    const formatNumber = (value) => {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const unformatNumber = (value) => {
      return value.replace(/\./g, "");
    };

    const handlePriceChange = (e) => {
      const input = e.target.value;
      const numeric = unformatNumber(input);

      if (!/^\d*$/.test(numeric)) return; // Chỉ chấp nhận số nguyên dương

      setPriceRaw(formatNumber(numeric));
      setPrice(parseInt(numeric || "0", 10));
    };


    useEffect(() => {
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .order("id", { ascending: true });
  
      if (!error) {
        console.log("not error",data)
        setCategories(data);
        setCategoryId(data[0]?.id);
      }
    };
   
  
    const handleAddCategory = async () => {
      if (!newCategory.trim()) return;
  
      const { error } = await supabase.from("category").insert([{ name: newCategory }]);
      if (!error) {
        setNewCategory("");
        fetchCategories();
      }
    };
  
    const handleDeleteCategory = async (id) => {
      const firstId = categories[0]?.id;
      if (id === firstId) return;
  
     /*  await supabase.from("category").delete().eq("id", id); */
      // Bước 1: Chuyển toàn bộ sản phẩm về danh mục mặc định
        await supabase
        .from("products")
        .update({ category: firstId })
        .eq("category", id);

      // Bước 2: Xóa danh mục
      await supabase.from("category").delete().eq("id", id);
     
      fetchCategories();
      
       
    };

    const handleAdd = async () => {
        if (role !== "admin") 
        {
            alert("bạn không có quyền add");
            return
        }
        if (!name || !amount ) {
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
            { name: name, store_id: storeId, price: amount, category: categoryId, imgUrl: imageUrl }
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
      <button onClick={onBack} className="btn-back-product">
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
        type="text"
        placeholder="Giá"
        value={amountRaw}
        onChange={handleAmountChange }
      />
   
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
     <div className="category-select-row">
        <label className="category-label">Danh mục:</label>
        <select
          value={categoryId || ""}
          onChange={e => setCategoryId(parseInt(e.target.value))}
          className="category-select"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="category-manage">
        <input
          type="text"
          placeholder="Thêm danh mục"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>+ Thêm danh mục</button>
      </div>
      <ul className="category-list">
        {categories.map((cat, index) => (
          <li key={cat.id}>
            {cat.name}
            {index !== 0 && (
              <button onClick={() => handleDeleteCategory(cat.id)}><i><TiDelete/></i></button>
            )}
          </li>
        ))}
      </ul>

      <button className="btn-add" onClick={handleAdd} disabled={loading}>
        {loading ? "Đang thêm..." : "Thêm"}
      </button>
    </div>
    );
  }