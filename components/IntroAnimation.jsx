import { useEffect, useState } from "react";
import Image from "next/image";

export default function IntroAnimation({ onFinish }) {
    const [visible, setVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const played = sessionStorage.getItem("introPlayed");

        if (played) {
            onFinish();
            return;
        }

        sessionStorage.setItem("introPlayed", "true");
        setVisible(true);

        // Sau 3 giây -> fade out
        const timer = setTimeout(() => {
            setFadeOut(true);

            setTimeout(() => {
                onFinish();
            }, 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!visible) return null;

    return (
        <div
            className={`
                fixed inset-0 z-[9999]
                flex items-center justify-center
                bg-[#601C1F]
                transition-opacity duration-500
                ${fadeOut ? "opacity-0" : "opacity-100"}
            `}
        >
            <div className="flex items-center gap-5">

                {/* Logo */}
                <div className="w-[85px] h-[85px] md:w-[100px] md:h-[100px]">
                    <Image
                        src="/images/loading.svg"
                        alt="Loading"
                        width={100}
                        height={100}
                        priority
                        className="animate-spin"
                    />
                </div>

                {/* Text */}
                <h1
                    className="
                        text-white
                        font-extrabold
                        text-5xl md:text-7xl
                        tracking-tight
                        leading-none
                        select-none
                    "
                >
                    chờ xíu...
                </h1>
            </div>
        </div>
    );
}