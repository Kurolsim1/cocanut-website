import { useState } from 'react';
import { X, Search, Package, Clock, MapPin, Phone, User, FileText } from 'lucide-react';

export default function OrderHistory({ isOpen, onClose }) {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!phone.trim()) {
            setError('Vui lòng nhập số điện thoại');
            return;
        }

        setLoading(true);
        setError('');
        setSearched(false);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phone.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setOrders(data.orders);
                setSearched(true);
            } else {
                setError(data.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="bg-red-600 text-white p-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Package size={24} />
                            Lịch sử đơn hàng
                        </h2>
                        <button
                            onClick={onClose}
                            className="hover:bg-red-700 p-2 rounded-lg transition"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Search Form */}
                    <div className="p-4 border-b">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="flex-1 relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại (bắt đầu sau số 0)"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black placeholder-gray-600"
                                />

                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    </>
                                ) : (
                                    <>
                                        <Search size={20} />
                                        Tra cứu
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {searched && orders.length === 0 && (
                            <div className="text-center text-gray-500 mt-10">
                                <Package size={64} className="mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">Không tìm thấy đơn hàng nào</p>
                                <p className="text-sm mt-2">Vui lòng kiểm tra lại số điện thoại</p>
                            </div>
                        )}

                        {orders.length > 0 && (
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600 mb-4">
                                    Tìm thấy <span className="font-bold text-red-600">{orders.length}</span> đơn hàng
                                </div>

                                {orders.map((order, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                                    >
                                        {/* Order Header */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock size={16} />
                                                    {order.timestamp}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Mã đơn: {order.orderId}
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'Đã chuyển khoản'
                                                ? 'bg-green-100 text-green-700'
                                                : order.paymentStatus === 'COD'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.paymentStatus}
                                            </div>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="space-y-2 mb-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <User size={16} className="text-gray-400" />
                                                <span className="font-medium">{order.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <MapPin size={16} className="text-gray-400" />
                                                <span>{order.address}</span>
                                            </div>
                                        </div>

                                        {/* Drinks */}
                                        <div className="bg-gray-50 rounded p-3 mb-3">
                                            <div className="text-xs text-gray-600 mb-1 font-medium">Đồ uống:</div>
                                            <div className="text-sm text-gray-800 whitespace-pre-line">
                                                {order.drinks}
                                            </div>
                                        </div>

                                        {/* Note */}
                                        {order.note && order.note !== 'null' && order.note.trim() !== '' && (
                                            <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                                                <FileText size={16} className="text-gray-400 mt-0.5" />
                                                <span className="italic">{order.note}</span>
                                            </div>
                                        )}

                                        {/* Total */}
                                        <div className="border-t pt-3 flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Tổng tiền:</span>
                                            <span className="text-lg font-bold text-red-600">
                                                {formatCurrency(parseFloat(order.total.replace(/[^\d]/g, '')))}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!searched && !loading && (
                            <div className="text-center text-gray-400 mt-20">
                                <Search size={64} className="mx-auto mb-4 opacity-30" />
                                <p>Nhập số điện thoại để tra cứu lịch sử đơn hàng</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}