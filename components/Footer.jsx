import Link from 'next/link';
// 1. Import các Heroicons cần thiết
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Footer() {
    return (
        <footer className="bg-red-900 text-red-100">
            <div className="container mx-auto max-w-6xl px-4 py-12">
                {/* Main Content */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">

                    {/* Logo & Tagline */}
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-2xl mb-2">cocanut</h3>
                        <p className="text-red-200 text-sm">30+ hương vị đồ uống trong lon, giao hàng tận nơi!</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap gap-6 text-sm">
                        <Link href="/" className="hover:text-white transition">
                            Giới Thiệu
                        </Link>
                        <Link href="/menu" className="hover:text-white transition">
                            Thực Đơn
                        </Link>
                        <Link href="/about" className="hover:text-white transition">
                            Liên Hệ
                        </Link>
                    </div>

                    {/* Contact Info - Đã thay thế emoji bằng Heroicons */}
                    <div className="flex flex-col gap-2 text-sm">
                        <a href="tel:+84343866213" className="hover:text-white transition flex items-center gap-2">
                            <PhoneIcon className="h-5 w-5 text-red-300" />
                            <span>(+84) (0)34 386 6213</span>
                        </a>
                        <a href="mailto:hello@cocanut.vn" className="hover:text-white transition flex items-center gap-2">
                            <EnvelopeIcon className="h-5 w-5 text-red-300" />
                            <span>hello@cocanut.vn</span>
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-red-800 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-red-200">

                        {/* Copyright */}
                        <p>&copy; 2025 Cocanut. All rights reserved.</p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a href="https://www.facebook.com/Cocanutvietnam" className="hover:text-white transition">Facebook</a>
                            <span className="text-red-700">|</span>
                            <a href="https://www.instagram.com/cocanut.vietnam.beverage/?hl=vi" className="hover:text-white transition">Instagram</a>
                            <span className="text-red-700">|</span>
                            <a href="https://www.tiktok.com/@cocanutvietnam" className="hover:text-white transition">TikTok</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}