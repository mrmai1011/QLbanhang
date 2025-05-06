
import { MdSell } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";
import { LuArrowRightLeft} from "react-icons/lu";
import { useDispatch , useSelector} from "react-redux";
export default function Body()
{
    const currentPage = useSelector((state) => state.page.currentPage);
    return(
        <div className="body">
          {/*   main quản lý */}
          {currentPage === "pageQuanLi" &&
                <div className="b-quanly">
                <div className="b-quanly-item">
                    <i className="color-red"><MdSell/></i>
                    <h3>Bán hàng</h3>
                </div>
                <div className="b-quanly-item">
                    <i className="color-orange"><FaBoxArchive/></i>
                    <h3>Sản phẩm</h3>
                </div>
                <div className="b-quanly-item">
                    <i className="color-green"><FaChartLine/></i>
                    <h3>Báo cáo</h3>
                </div>
                <div className="b-quanly-item">
                    <i className="color-puble"><LuArrowRightLeft/></i>
                    <h3>Thu chi</h3>
                </div>
            
            </div>
          }
           


        </div>
    );
}