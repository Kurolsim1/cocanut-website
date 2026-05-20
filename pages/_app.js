import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }) {
    return (
        <CartProvider>
            <Header />
            <main className="min-h-screen bg-white text-gray-900">
                <Component {...pageProps} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: { background: "#333", color: "#fff" },
                    }}
                />
            </main>
            <Footer />
        </CartProvider>
    );
}
