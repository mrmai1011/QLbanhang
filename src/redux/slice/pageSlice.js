import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: {
    currentPage: "pageQuanLi", // Trang mặc định khi load
  },
  reducers: {
    setPageQuanLi: (state) => {
      state.currentPage = "pageQuanLi";
    },
    setPageDonHang: (state) => {
      state.currentPage = "pageDonHang";
    },
    setPageThuChi: (state) => {
      state.currentPage = "pageThuChi";
    },
    setPageSoNo: (state) => {
      state.currentPage = "pageSoNo";
    },
    setPageThem: (state) => {
      state.currentPage = "pageThem";
    },
  },
});

export const {
  setPageQuanLi,
  setPageDonHang,
  setPageThuChi,
  setPageSoNo,
  setPageThem,
} = pageSlice.actions;

export default pageSlice.reducer;
