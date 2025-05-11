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
     setPageBanHang: (state) => {
      state.currentPage = "pageBanHang";
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
    setPageAddProduct: (state) => {
      state.currentPage = "pageAddProduct";
    },
    setPageThanhToan: (state) => {
      state.currentPage = "pageThanhToan";
    },
    setPageKhoanThu: (state) => {
      state.currentPage = "pageKhoanThu";
    },  
    setPageKhoanChi: (state) => {
      state.currentPage = "pageKhoanChi";
    },
    setPageDetailDonHang: (state) => {
      state.currentPage = "pageDetailDonHang";
    },
  

  },
});

export const {
  setPageQuanLi,
  setPageDonHang,
  setPageBanHang,
  setPageThuChi,
  setPageSoNo,
  setPageThem,
  setPageAddProduct,
  setPageThanhToan,
  setPageKhoanThu,
  setPageKhoanChi,
  setPageDetailDonHang

} = pageSlice.actions;

export default pageSlice.reducer;
