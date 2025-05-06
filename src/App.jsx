
import './App.scss'
import Header from './component/Header'
import Footer from './component/Footer'
import LoginForm from './component/Loginform'
import { useDispatch , useSelector} from "react-redux";
function App() {
  const isLogin = useSelector((state) => state.login.isLogin);
  return (
    <>
      <Header/>
      <LoginForm/>
     {isLogin && <Footer/> } 
    </>
  )
}

export default App
