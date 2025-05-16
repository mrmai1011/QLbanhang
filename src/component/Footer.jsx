import "../App.scss"
import { FaStore,FaBook } from "react-icons/fa";
import { LuNotepadText ,LuArrowRightLeft} from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch , useSelector} from "react-redux";
import { MdSell } from "react-icons/md";
import {
    setPageQuanLi,
    setPageDonHang,
    setPageBanHang,
    setPageThuChi,
    setPageSoNo,
    setPageThem
  } from "../redux/slice/pageSlice";

export default function Footer(){
    const currentPage = useSelector((state) => state.page.currentPage);
    const dispatch = useDispatch();

    const activeColor = "rgb(250, 235, 215)"; // hoặc màu tùy bạn (blue)  color: antiquewhite;
    const defaultColor = "rgb(65, 65, 63)";
    return(
        <div className="footer non-printable ">
          
      <i onClick={() => dispatch(setPageQuanLi())} style={{ color: currentPage === "pageQuanLi" ? activeColor : defaultColor }}>
        <FaStore  />
        <h3>Quản lý</h3>
      </i>

      <i onClick={() => dispatch(setPageBanHang())} style={{ color: currentPage === "pageBanHang" ? activeColor : defaultColor }}>
        <MdSell />
        <h3>Bán hàng</h3>
      </i>

      <i onClick={() => dispatch(setPageThuChi())} style={{ color: currentPage === "pageThuChi" ? activeColor : defaultColor }}>
        <LuArrowRightLeft />
        <h3>Thu chi</h3>
      </i>

      <i onClick={() => dispatch(setPageSoNo())} style={{ color: currentPage === "pageSoNo" ? activeColor : defaultColor }}>
        <FaBook />
        <h3>Sổ nợ</h3>
      </i>

      <i onClick={() => dispatch(setPageThem())} style={{ color: currentPage === "pageThem" ? activeColor : defaultColor }}>
        <BsThreeDots />
        <h3>Thêm</h3>
      </i>
    </div>
       
    );
}