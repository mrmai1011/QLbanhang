



export default function ItemSoNo({order, onClick}){

    return(
        <div className="item-sono" onClick={onClick}>
                <div className="item-sono-top">
                    <h3>{order.guest}</h3>
                    <h2 style={{color:"rgb(21, 155, 6)"}}>{order.debt.toLocaleString("vi-VN")}</h2>
                </div>
                 <div className="item-sono-bottom">
                      <p>mã đơn: {(order.id_bill || order.id || "").slice(0, 8)} </p>
                       <h5>{new Date(order.created_at).toLocaleDateString("vi-VN")}</h5>
                       <p>phải thu</p>
                 </div>
        </div>
    )
}