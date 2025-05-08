



import { FaRegArrowAltCircleUp ,FaRegArrowAltCircleDown } from "react-icons/fa";

export default function ItemThuChi({Icon = FaRegArrowAltCircleDown , orders}){
    const color = orders.source === "thu" ?  "green" :  "orange";
    const total = orders.source === "thu" ? "+" + orders.total.toLocaleString("vi-VN") : "-" +  orders.total.toLocaleString("vi-VN")
    const time = new Date(orders.created_at).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
      });

    return(
        <div className="item-thuchi">
              <i style={{color:color, fontSize:"1.5rem"}}><Icon /></i>
              <div className="item-thuchi-action">
                    <div className="item-thuchi-name-price">
                        <h3 style={{fontWeight:"bold"}}>Khách {orders.guest}</h3>
                        <h3 style={{color:color}}>{total}</h3>
                    </div>
                    <div className="item-thuchi-pay-time">
                        <div>bán hàng</div>
                        <div>{orders.payment_method} | {time}</div>
                    </div>
                    <div className="item-thuchi-des">
                        <div>đơn hàng : {orders.id_bill.slice(0,8)}</div>
                    </div>
              </div>
           
        </div>
    )
}