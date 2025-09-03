import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useDispatch , useSelector} from "react-redux";

import { loginStart , loginSuccess , loginFailure } from "../redux/slice/loginSlice";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isLogin = useSelector((state) => state.login.isLogin);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    dispatch(loginStart());
    setError("");

    // 1. Kiểm tra user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (userError || !user) {
      dispatch(loginFailure("Sai tài khoản hoặc mật khẩu"));
      setError("Đăng nhập thất bại");
      return;
    }

    // 2. Lấy role & store_id của user đó
    const { data: roleData, error: roleError } = await supabase
      .from("user_store_roles")
      .select("store_id, roles(name)")
      .eq("user_id", user.id)
      .single(); // giả sử mỗi user chỉ có 1 cửa hàng và 1 vai trò

    if (roleError || !roleData) {
      dispatch(loginFailure("Không lấy được vai trò"));
      setError("Không tìm thấy quyền người dùng");
      return;
    }

    // 3. Cập nhật vào Redux
    const payload = {
      user: user.id,
      token: "fake-token", // nếu dùng Supabase Auth thì gán token thật
      role: roleData.roles.name,
      store_id: roleData.store_id,
    };

    dispatch(loginSuccess(payload));
  /*   console.log("Đăng nhập thành công", payload); */
    localStorage.setItem("auth", JSON.stringify(payload));
  };

  return (
        
    
      !isLogin && 
        <div className="Login-Form">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tên đăng nhập" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" />
          <button onClick={handleLogin}>Đăng nhập</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      
    
    
   
    
    
   
  );
}

export default LoginForm;