import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../slice/loginSlice";
import pageReducer from "../slice/pageSlice";
import orderReducer from "../slice/orderSlice"


// Load từ localStorage nếu có
const savedAuth = localStorage.getItem("auth");
const initialLoginState = savedAuth
  ? {
      user: JSON.parse(savedAuth).user,
      token: JSON.parse(savedAuth).token,
      role: JSON.parse(savedAuth).role,
      store_id: JSON.parse(savedAuth).store_id,
      isLogin: true,
      loading: false,
      error: null,
    }
  : undefined;

export const store = configureStore({
  reducer: {
   login: loginReducer,
   page: pageReducer, // 👈 page select
   order:orderReducer
  },
  preloadedState: {
    login: initialLoginState, // 👈 Đẩy vào slice login
  },
});