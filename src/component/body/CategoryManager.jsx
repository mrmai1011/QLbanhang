import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNotifier } from "../../utils/notifier";
import { TiDelete } from "react-icons/ti";

export default function CategoryManager({ storeId, selectedId, setSelectedId }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const { notify, confirm } = useNotifier();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("category")
      .select("id, name")
      .or(`store_id.eq.${storeId},store_id.is.null`);

    if (!error) {
      setCategories(data);
      if (!selectedId) setSelectedId(data[0]?.id);
    }
  };

  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return notify("Vui lòng nhập tên danh mục.", "error");

    const { error } = await supabase.from("category").insert([
      { name, store_id: storeId },
    ]);

    if (error) return notify("Thêm danh mục thất bại.", "error");

    notify("Đã thêm danh mục!", "success");
    setNewCategory("");
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    if (id === 1){
        return notify("Không thể xoá danh mục này.", "error");
    }
    const ok = await confirm("Bạn có chắc muốn xoá danh mục này?");
    if (!ok) return;

    const { error } = await supabase.from("category").delete().eq("id", id);
    if (error) return notify("Xoá thất bại.", "error");

    notify("Đã xoá danh mục!", "success");
    if (selectedId === id) setSelectedId(null);
    fetchCategories();
  };

  return (
    <>
    <div style={{ 
         marginBottom: 10,
     }}>
      <h4 style={{   marginBottom: 10,}}>Danh mục sản phẩm:</h4>
      <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 10 }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedId(cat.id)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginBottom: 6,
              backgroundColor: selectedId === cat.id ? "#e0f7ff" : "#fff",
              cursor: "pointer",
            }}
          >
            <span>{cat.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(cat.id);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "red",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              <i><TiDelete/></i>
            </button>
          </div>
        ))}
      </div>

      
    </div>
    <div style={{ display: "flex", gap: 10 }}>
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Tên danh mục mới"
          style={{ flex: 1, padding: 8 }}
        />
        <button
          onClick={handleAddCategory}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "8px 12px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Thêm
        </button>
      </div>
      </>
  );
}
