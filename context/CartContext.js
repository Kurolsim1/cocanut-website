import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    //Lấy dữ liệu từ localStorage khi load trang
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = JSON.parse(localStorage.getItem("cart") || "[]");
            setCart(saved);
        }
    }, []);

    //Lưu lại mỗi khi giỏ hàng thay đổi
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("cart", JSON.stringify(cart));
            window.dispatchEvent(new Event("storage")); //cập nhật header badge
        }
    }, [cart]);

    //Thêm món mới (cho phép cùng id nhưng khác setting)
    const addItem = (item) => {
        const uniqueId = `${item.id}-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 5)}`;

        setCart((prev) => [
            ...prev,
            {
                ...item,
                uniqueId,
                qty: item.qty || 1,
                ice: item.ice || "bình thường",
                sweet: item.sweet || "bình thường",
                size: item.size || "M",
            },
        ]);
    };

    //Xóa món theo uniqueId
    const removeItem = (uniqueId) => {
        setCart((prev) => prev.filter((x) => x.uniqueId !== uniqueId));
    };

    //Cập nhật thuộc tính món theo uniqueId
    const updateItem = (uniqueId, changes) => {
        setCart((prev) =>
            prev.map((x) =>
                x.uniqueId === uniqueId ? { ...x, ...changes } : x
            )
        );
    };

    //Xóa toàn bộ giỏ
    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{ cart, addItem, removeItem, updateItem, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
