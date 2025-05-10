export default function ItemDonHang()

{
    return(
        <div className="item-donhang">
            <div className="item-donhang-name">
                <p>name</p>
                <p style={{color:"green"}}>Đã giao</p>
            </div>
            <div className="item-donhang-date">
                <p>date - mã đơn</p>
                <p>đã thanh toán</p>
            </div>
            <div style={{borderTop:"solid 1px rgba(107, 105, 105, 0.61)", width:"95%", transform:"translateX(10px)"}}></div>
            <div className="item-donhang-bottom">
                <div className="item-donhang-tong">
                        <h3>Tổng cộng</h3>
                        <h2>100.000</h2>
                </div>
            </div>
        </div>
    )
}