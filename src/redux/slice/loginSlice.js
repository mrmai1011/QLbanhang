import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    user: null,
    store_id: null,
    token: null,
    role: null,      // 👈 Thêm role
    isLogin: false,  // 👈 Thêm trạng thái đăng nhập
    loading: false,
    
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isLogin = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role; // 👈 Nhận role từ payload
      state.isLogin = true;
      state.store_id = action.payload.store_id;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isLogin = false;
    },
    logout: (state) => {
      state.user = null;
      state.store_id = null;
      state.token = null;
      state.role = null;
      state.isLogin = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = loginSlice.actions;
export default loginSlice.reducer;