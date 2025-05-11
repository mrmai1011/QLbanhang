import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
  items: [],
  detailDonHang: null, // Lưu đơn hàng chi tiết
  fromPage: null,
   
  },
  reducers: {
    addToOrder: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item.id === product.id);
    
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    decreaseItem: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item.id === product.id);
    
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          // Nếu còn 1 thì xóa luôn
          state.items = state.items.filter(item => item.id !== product.id);
        }
      }
    },
    clearOrder: (state) => {
      state.items = [];
    },
     setDetailDonHang: (state, action) => {
      state.detailDonHang = action.payload.order; // Cập nhật đơn hàng chi tiết
       state.fromPage = action.payload.fromPage; // 👈 Ghi nhận trang mở
    },
    clearDetailDonHang: (state) => {
      state.detailDonHang = null; // Xóa thông tin chi tiết khi không cần nữa
       state.fromPage = null; // Xóa luôn thông tin nguồn trang khi clear
    },
  },
});

export const { addToOrder, clearOrder,decreaseItem , setDetailDonHang, clearDetailDonHang} = orderSlice.actions;

export const selectOrderItems = (state) => state.order.items;

export const selectTotalItem = (state) =>
  state.order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);

// Tổng tiền
export const selectTotalPrice = (state) =>
  state.order.items.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

export default orderSlice.reducer;