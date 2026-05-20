import Link from "next/link";
import { Home, Coffee, ShoppingCart, Info, History } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import OrderHistory from "./OrderHistory";

export default function Header() {
    const { cart } = useCart();
    const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 left-0 w-full z-50 backdrop-blur-md bg-red-600">
                <div className="container mx-auto flex justify-between items-center px-4 py-4">
                    {/* Logo Cocanut */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-white tracking-tight">cocanut</span>
                            <span className="text-xs text-red-100 font-medium -mt-1">CANTY IN CAN</span>
                        </div>
                    </Link>

                    {/* Navigation icons */}
                    <nav className="flex items-center gap-6 text-white">
                        <Link
                            href="/"
                            className="hover:scale-110 transition-transform hover:text-red-100"
                            title="Trang chủ"
                        >
                            <Home size={24} />
                        </Link>

                        <Link
                            href="/menu"
                            className="hover:scale-110 transition-transform hover:text-red-100"
                            title="Menu"
                        >
                            <Coffee size={24} />
                        </Link>

                        <Link
                            href="/order"
                            className="hover:scale-110 transition-transform hover:text-red-100 relative"
                            title="Đặt hàng"
                        >
                            <ShoppingCart size={24} />
                            {cart.length > 0 && (
                                <span className="absolute -top-3 -right-3 bg-white text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        {/* Nút tra cứu lịch sử đơn hàng */}
                        <button
                            onClick={() => setIsOrderHistoryOpen(true)}
                            className="hover:scale-110 transition-transform hover:text-red-100"
                            title="Lịch sử đơn hàng"
                        >
                            <History size={24} />
                        </button>

                        <Link
                            href="/about"
                            className="hover:scale-110 transition-transform hover:text-red-100"
                            title="Giới thiệu"
                        >
                            <Info size={24} />
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Order History Sidebar */}
            <OrderHistory
                isOpen={isOrderHistoryOpen}
                onClose={() => setIsOrderHistoryOpen(false)}
            />
        </>
    );
}