import { MapPin, Clock, Phone, Mail, Droplet } from 'lucide-react';

export default function About() {
    const partners = [
        { name: "Partner 1", logo: "logo1" },
        { name: "Partner 2", logo: "logo2" },
        { name: "Partner 3", logo: "logo3" },
        { name: "Partner 4", logo: "logo4" },
        { name: "Partner 5", logo: "logo5" },
        { name: "Partner 6", logo: "logo6" }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* HEADER BANNER */}
            <section className="relative bg-gradient-to-b from-[#8F2D32] via-[#7A2529] to-[#601C1F] min-h-screen flex items-center justify-center py-20 px-4">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-10 right-20 w-40 h-40 bg-[#601C1F]/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#601C1F]/20 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto max-w-4xl relative z-10 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="mb-8">
                            <img
                                src="/images/loading.svg"
                                alt="Loading"
                                className="w-20 h-20 mx-auto animate-[tickSpin_60s_steps(60)_infinite]"
                            />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Về Chúng Tôi
                    </h1>
                    <p className="text-xl text-red-100 max-w-2xl mx-auto">
                        Khám phá câu chuyện của Cocanut - nơi đam mê và chất lượng gặp nhau
                    </p>
                </div>
            </section>

            {/* INTRODUCTION SECTION */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-[#601C1F] mb-6 text-center">
                            Câu Chuyện Của Chúng Tôi
                        </h2>

                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            Cocanut được thành lập với một sứ mệnh đơn giản nhưng rõ ràng:
                            mang đến cho bạn những thức uống chất lượng cao, được chế biến từ
                            những nguyên liệu tự nhiên tốt nhất, mọi lúc mọi nơi.
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="flex gap-4 items-start">
                                <div className="text-3xl">🥥</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">100% Nguyên Liệu Tự Nhiên</h3>
                                    <p className="text-gray-600">Không hóa chất, không chất bảo quản nhân tạo. Chúng tôi chỉ sử dụng những gì tốt nhất cho sức khỏe của bạn.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="text-3xl">❄️</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Công Nghệ Cold Brew</h3>
                                    <p className="text-gray-600">Phương pháp ủ lạnh độc quyền giúp giữ trọn vẹn hương vị và chất dinh dưỡng trong mỗi lon.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="text-3xl">🚚</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Giao Hàng Nhanh Chóng</h3>
                                    <p className="text-gray-600">2-4 giờ tại TP. Hồ Chí Minh với dịch vụ giao hàng miễn phí, đảm bảo sản phẩm đến tay bạn tươi mát.</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                            Với đội ngũ nhiệt tình và tâm huyết, chúng tôi cam kết cung cấp
                            những sản phẩm tốt nhất, dịch vụ khách hàng xuất sắc, và trải
                            nghiệm mua sắm đáng nhớ. Hãy trở thành một phần của gia đình Cocanut!
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTACT & INFO SECTION */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-[#601C1F] mb-12 text-center">
                        Thông Tin Liên Hệ
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Địa chỉ */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-[#601C1F] rounded-full p-4">
                                    <MapPin className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#601C1F] mb-3">Địa Chỉ</h3>
                            <p className="text-gray-700 font-medium mb-1">
                                Cocanut - Đọc là Cô ca nất
                            </p>
                            <p className="text-gray-600 text-sm">
                                202/17A Phạm Văn Hai, Phường Tân Sơn Nhất, TP. Hồ Chí Minh
                            </p>
                        </div>

                        {/* Giờ mở cửa */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-[#601C1F] rounded-full p-4">
                                    <Clock className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#601C1F] mb-3">Giờ Mở Cửa</h3>
                            <p className="text-gray-700 font-medium mb-1">
                                Thứ 2 - Thứ 7
                            </p>
                            <p className="text-gray-600 text-sm">
                                09:00 - 17:00
                            </p>
                        </div>

                        {/* Liên hệ */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                            <div className="text-center mb-4">
                                <div className="bg-[#601C1F] rounded-full p-4 inline-flex">
                                    <Phone className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#601C1F] mb-3 text-center">Liên Hệ</h3>

                            <div className="space-y-3">
                                <a
                                    href="tel:+84343866213"
                                    className="flex items-center gap-3 text-gray-700 hover:text-[#601C1F] transition font-medium"
                                >
                                    <Phone className="w-5 h-5 text-[#601C1F] flex-shrink-0" />
                                    <span>+84 (0)34 386 6213</span>
                                </a>

                                <a
                                    href="mailto:hello@cocanut.vn"
                                    className="flex items-center gap-3 text-gray-700 hover:text-[#601C1F] transition font-medium"
                                >
                                    <Mail className="w-5 h-5 text-[#601C1F] flex-shrink-0" />
                                    <span>hello@cocanut.vn</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PARTNERS SECTION */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-[#601C1F] mb-12 text-center">
                        Các Đối Tác Của Chúng Tôi
                    </h2>

                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Cocanut vinh dự được hợp tác với những thương hiệu góp phần tạo nên những sản phẩm chất lượng cao cho khách hàng.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {partners.map((partner, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col items-center justify-center aspect-square hover:scale-105 transform transition"
                            >
                                <div className="text-6xl mb-4">{partner.logo}</div>
                                <p className="text-gray-700 font-semibold text-center text-sm">
                                    {partner.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-gradient-to-r from-red-100 to-red-50 rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-bold text-[#601C1F] mb-2">
                            Bạn Muốn Trở Thành Đối Tác Của Cocanut?
                        </h3>
                        <p className="text-gray-700 mb-4">
                            Hãy liên hệ với chúng tôi để tìm hiểu về cơ hội hợp tác
                        </p>
                        <a
                            href="mailto:partnership@cocanut.vn"
                            className="inline-block bg-[#601C1F] hover:bg-[#601C1F] text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105"
                        >
                            Liên Hệ Hợp Tác
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-20 px-4 bg-gradient-to-r from-[#601C1F] to-[#601C1F]">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Cảm Ơn Bạn Đã Chọn Cocanut
                    </h2>
                    <p className="text-xl text-red-100 mb-8">
                        Hãy thưởng thức những thức uống tuyệt vời và là một phần của gia đình chúng tôi
                    </p>
                    <a
                        href="/menu"
                        className="inline-block bg-white text-[#601C1F] px-12 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition transform hover:scale-105"
                    >
                        Xem Menu Ngay
                    </a>
                </div>
            </section>
        </div>
    );
}