import { useEffect, useState } from "react";
import Image from "next/image";

const LOGO = "/images/cocanut-loading.png";

export default function IntroAnimation({ onFinish }) {
    const [dots, setDots] = useState(0);
    const [showLogo, setShowLogo] = useState(false);
    const [circleExpand, setCircleExpand] = useState(false);
    const [hideDots, setHideDots] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        // Kiểm tra sessionStorage xem animation đã chạy chưa
        if (!sessionStorage.getItem("introPlayed")) {
            setShouldShow(true); // Chạy animation
            sessionStorage.setItem("introPlayed", "true"); // Đánh dấu đã chạy
        } else {
            // Nếu đã chạy rồi, gọi onFinish ngay lập tức
            onFinish();
        }
    }, [onFinish]);

    useEffect(() => {
        if (!shouldShow) return;

        // 1) Chạy dấu chấm 0 → 3
        const dotInterval = setInterval(() => {
            setDots(prev => (prev >= 3 ? 3 : prev + 1));
        }, 370);

        // 2) Ẩn dấu chấm
        const hideDotsTimeout = setTimeout(() => setHideDots(true), 1300);

        // 3) Show logo
        const showLogoTimeout = setTimeout(() => setShowLogo(true), 1500);

        // 4) Logo xoay → circle mở rộng
        const circleExpandTimeout = setTimeout(() => setCircleExpand(true), 2600);

        // 5) Kết thúc intro
        const finishTimeout = setTimeout(() => onFinish(), 2800);

        return () => {
            clearInterval(dotInterval);
            clearTimeout(hideDotsTimeout);
            clearTimeout(showLogoTimeout);
            clearTimeout(circleExpandTimeout);
            clearTimeout(finishTimeout);
        };
    }, [shouldShow, onFinish]);

    if (!shouldShow) return null;

    return (
        <div className="fixed inset-0 bg-red-600 flex items-center justify-center z-[9999] overflow-hidden">

            {/* Circle expand reveal */}
            <div
                className={`
                    absolute w-0 h-0 rounded-full bg-white
                    transition-all duration-[900ms] ease-out
                    ${circleExpand ? "w-[3000px] h-[3000px]" : "w-0 h-0"}
                `}
            ></div>

            {/* Nội dung intro */}
            <div
                className={`
                    relative flex flex-col items-center text-white transition-opacity duration-500
                    ${circleExpand ? "opacity-0" : "opacity-100"}
                `}
            >
                {/* Dấu chấm */}
                {!hideDots && (
                    <div className="text-5xl font-bold tracking-widest mb-6">
                        {".".repeat(dots)}
                    </div>
                )}

                {/* Logo */}
                {showLogo && (
                    <div className="animate-[bounce_1s_ease-in-out]">
                        <Image
                            src={LOGO}
                            alt="logo"
                            width={140}
                            height={140}
                            className="animate-[spin_0.8s_linear]"
                        />
                    </div>
                )}
            </div>

        </div>
    );
}
