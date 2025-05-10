import ItemDonHang from "./ItemDonHang"
export default function PageDonHang(){
    return (
        <div className="page-donhang">
             <div className="dh-filter-wapper">
                <select className="dh-select-day" onChange={(e) => setSelectedDay(e.target.value)}>
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="thismonth">Tháng này</option>
                <option value="lastmonth">Tháng trước</option>
                <option value="thisyear">Năm này</option>
                <option value="all">Tất cả</option>
                </select>
                <select className="dh-select-payment" onChange={(e) => setSelectedPayment(e.target.value)}>
                <option value="all">Nguồn tiền</option>
                <option value="tiền mặt">Tiền mặt</option>
                <option value="chuyển khoản">Chuyển khoản</option>
                </select>
                <select className="dh-select-transaction" onChange={(e) => setSelectedTransaction(e.target.value)}>
                <option value="all">Tất cả giao dịch</option>
                <option value="thu">Khoản thu</option>
                <option value="chi">Khoản chi</option>
                </select>
            </div>

            <ItemDonHang/>
             <ItemDonHang/>

        </div>
    )
}