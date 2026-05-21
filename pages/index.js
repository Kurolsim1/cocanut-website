import { useState } from 'react';
import Link from 'next/link';
// Lucide icons
import { ChevronDown, ShoppingCart, Droplet } from 'lucide-react';
// Heroicons
import { SparklesIcon, CubeTransparentIcon, TruckIcon } from '@heroicons/react/24/outline';
import IntroAnimation from "../components/IntroAnimation";

export default function HomePage() {
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [showIntro, setShowIntro] = useState(true);

    const features = [
        {
            icon: <SparklesIcon className="h-12 w-12 mx-auto text-[#601C1F]" />,
            title: "Nguyên liệu tự nhiên",
            desc: "100% từ nguyên liệu tự nhiên, không hóa chất, không bánh"
        },
        {
            icon: <CubeTransparentIcon className="h-12 w-12 mx-auto text-[#601C1F]" />,
            title: "Cold Brew Technology",
            desc: "Công nghệ ủ lạnh, uống ngay không cần pha thêm, lạnh mát tươi sáng"
        },
        {
            icon: <TruckIcon className="h-12 w-12 mx-auto text-[#601C1F]" />,
            title: "Giao hàng nhanh",
            desc: "15-30 phút tại TP.HCM, miễn phí vận chuyển trong thành phố"
        }
    ];

    const faqs = [
        {
            q: "Tại sao Cocanut lại chọn cold brew?",
            a: "Cold brew mang lại hương vị đậm đà, tươi mát, giàu chất dinh dưỡng và được chế biến từ những nguyên liệu tự nhiên chất lượng cao."
        },
        {
            q: "Cocanut có bao nhiêu loại hương vị?",
            a: "Cocanut có hơn 30 hương vị khác nhau bao gồm: Café, Cocoa, Chocolate Latte, Cocowater, Matcha, Cold Brew Tea với các biến thể toppings phong phú."
        },
        {
            q: "Đơn hàng được giao trong bao lâu?",
            a: "Chúng tôi giao hàng trong vòng 15-30 phút tùy khu vực tại TP. Hồ Chí Minh."
        },
        {
            q: "Sản phẩm có bảo quản được lâu không?",
            a: "Sản phẩm bảo quản tốt trong nhiệt đụ tủ lạnh, thơm ngon nhất khi dùng ngay!"
        }
    ];

    return (
        <>
            {/* INTRO ANIMATION */}
            {showIntro && <IntroAnimation onFinish={() => setShowIntro(false)} />}

            {/* Landing Page với hiệu ứng fade-in */}
            <div
                className={`transition-opacity duration-500 ${showIntro ? "opacity-0" : "opacity-100"}`}
            >
                <div className="min-h-screen bg-white overflow-x-hidden">

                    {/* HERO SECTION */}
                    <section className="relative bg-gradient-to-b from-[#8F2D32] via-[#7A2529] to-[#601C1F] min-h-screen flex items-center justify-center px-4 pt-20">
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-20 right-10 w-40 h-40 bg-red-400/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-20 left-10 w-32 h-32 bg-red-700/20 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10 text-center max-w-2xl">
                            <div className="mb-8">
                                <img
                                    src="/images/loading.svg"
                                    alt="Loading"
                                    className="w-20 h-20 mx-auto animate-[tickSpin_60s_steps(60)_infinite]"
                                />
                            </div>

                            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 font-['sans-serif'] tracking-tight">
                                cocanut
                            </h1>

                            <p className="text-lg text-red-50 mb-8 leading-relaxed max-w-xl mx-auto">
                                Thưởng thức 30+ hương vị đồ uống trong lon, giao hàng tận nơi!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/menu"
                                    className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition"
                                >
                                    Xem menu
                                </Link>
                            </div>
                        </div>
                    </section>

                    ---

                    {/* FEATURES SECTION */}
                    <section className="py-20 px-4 bg-white">
                        <div className="container mx-auto max-w-5xl">
                            <h2 className="text-4xl font-bold text-center text-[#601C1F] mb-16">
                                Tại sao chọn Cocanut?
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {features.map((item, idx) => (
                                    <div key={idx} className="bg-red-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
                                        <div className="mb-4">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-[#601C1F] mb-2">{item.title}</h3>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    ---
                    {/* FAQ SECTION */}
                    <section className="py-20 px-4 bg-red-50">
                        <div className="container mx-auto max-w-3xl">
                            <h2 className="text-4xl font-bold text-center text-[#601C1F] mb-12">
                                Câu hỏi thường gặp
                            </h2>

                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition">
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                            className="w-full p-6 flex items-center justify-between text-left hover:bg-red-50 transition"
                                        >
                                            <span className="text-lg font-semibold text-gray-800">{faq.q}</span>
                                            <ChevronDown
                                                className={`w-5 h-5 text-[#601C1F] transition transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {expandedFaq === idx && (
                                            <div className="px-6 pb-6 text-gray-600 border-t border-red-100">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    ---

                    {/* CTA SECTION */}
                    <section className="py-20 px-4 bg-gradient-to-b from-[#8F2D32] via-[#7A2529] to-[#601C1F]">
                        <div className="container mx-auto max-w-3xl text-center">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Sẵn sàng thưởng thức chưa?
                            </h2>
                            <p className="text-xl text-red-100 mb-8">
                                Chọn hương vị yêu thích và đặt hàng ngay hôm nay nào!
                            </p>
                            <Link
                                href="/menu"
                                className="bg-white text-[#601C1F] px-12 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition transform hover:scale-105 inline-flex items-center gap-2"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Đặt ngay
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}