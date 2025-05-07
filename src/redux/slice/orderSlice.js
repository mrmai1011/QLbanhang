import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
  },
  reducers: {
    addToOrder: (state, action) => {
      const product = action.payload;
      state.items.push(product);
    },
    clearOrder: (state) => {
      state.items = [];
    },
  },
});

export const { addToOrder, clearOrder } = orderSlice.actions;

export const selectOrderItems = (state) => state.order.items;


export default orderSlice.reducer;