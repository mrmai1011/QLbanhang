
import './App.scss'
import Header from './component/Header'
import Body from './component/Body'
import Footer from './component/Footer'
import LoginForm from './component/Loginform'
import { useDispatch , useSelector} from "react-redux";
function App() {
  const isLogin = useSelector((state) => state.login.isLogin);
  const currentPage = useSelector((state) => state.page.currentPage);
  return (
    <>
      <Header/>
      <LoginForm/>
      <Body/>
     {isLogin && <Footer/> } 
    </>
  )
}

export default App
