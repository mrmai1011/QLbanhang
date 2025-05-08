import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
   
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
  },
});

export const { addToOrder, clearOrder,decreaseItem } = orderSlice.actions;

export const selectOrderItems = (state) => state.order.items;

export const selectTotalItem = (state) =>
  state.order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);

// Tổng tiền
export const selectTotalPrice = (state) =>
  state.order.items.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

export default orderSlice.reducer;