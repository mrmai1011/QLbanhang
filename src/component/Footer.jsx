import "../App.scss"
import { FaStore,FaBook } from "react-icons/fa";
import { LuNotepadText ,LuArrowRightLeft} from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
export default function Footer()
{
    return(
        <div className="footer">
            <i><FaStore/><h3 >Quản lý</h3></i>           {/*  Quản lý    */} 
            <i><LuNotepadText/><h3 >Đơn hàng</h3></i>     {/*  Đơn Hàng    */}     
            <i><LuArrowRightLeft/><h3 >Thu chi</h3></i>  {/*  Thu Chi    */} 
            <i><FaBook/><h3 >Sổ nợ</h3></i>            {/*  Sổ nợ    */} 
            <i><BsThreeDots/><h3 >Thêm</h3></i>       {/*  Thêm    */} 
        </div>
    );
}