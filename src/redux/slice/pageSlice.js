import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: {
    currentPage: "pageQuanLi", // Trang mặc định khi load
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    }
  }
});

export const { setPage } = pageSlice.actions;
export default pageSlice.reducer;
