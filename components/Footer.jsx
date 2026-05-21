import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer
            className="w-full bg-[#FFFDFA] text-[#111111] overflow-hidden"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
            {/* Top Line */}
            <div className="px-6 md:px-20 pt-5">
                <div className="h-[4px] w-full bg-[#601C1F]" />
            </div>

            {/* Main Content */}
            <div className="max-w-[1800px] mx-auto px-6 md:px-24 py-10 md:py-16">
                <div className="flex flex-col md:flex-row justify-between gap-16">

                    {/* LEFT */}
                    <div className="max-w-[760px]">

                        {/* Logo */}
                        <div className="mb-8">
                            <Image
                                src="/images/footer-04.svg"
                                alt="Cocanut"
                                width={520}
                                height={180}
                                priority
                                className="w-[180px] md:w-[300px] h-auto"
                            />
                        </div>

                        {/* Info */}
                        <div className="space-y-6 text-[15px] md:text-[16px] leading-[1.5] font-medium">

                            <div>
                                <p>Thương hiệu thuộc quản lý của</p>

                                <p className="font-bold">
                                    Công ty TNHH The Hospitality Lab Vietnam
                                </p>
                            </div>

                            {/* Address */}
                            <div>
                                <span className="font-bold">
                                    Trụ sở tại:
                                </span>{' '}

                                <a
                                    href="https://maps.google.com/?q=202/17A+Pham+Van+Hai,+Phuong+5,+Tan+Binh,+Ho+Chi+Minh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    202/17A Phạm Văn Hai, P. Tân Sơn Nhất
                                    <br />
                                    (P.5, Q. Tân Bình cũ), TP.HCM, Việt Nam
                                </a>
                            </div>

                            {/* Hotline */}
                            <div>
                                <span className="font-bold">
                                    Hotline:
                                </span>{' '}
                                <a
                                    href="tel:0343866213"
                                    className="hover:underline"
                                >
                                    034 386 6213
                                </a>
                            </div>

                            {/* Email */}
                            <div>
                                <span className="font-bold">
                                    E-mail:
                                </span>{' '}
                                <a
                                    href="mailto:cocanutvietnam@thehospitalitylab.work"
                                    className="hover:underline break-all"
                                >
                                    cocanutvietnam@thehospitalitylab.work
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-start md:items-end text-left md:text-right pt-2">

                        {/* Title */}
                        <h3 className="text-[18px] md:text-[20px] font-bold leading-none mb-3">
                            Coi tiệm có gì mới?
                        </h3>

                        {/* Threads */}
                        <Link
                            href="https://www.threads.com/@cocanut.vietnam.beverage"
                            target="_blank"
                            className="mb-10 hover:opacity-80 transition"
                        >
                            <Image
                                src="/images/footer-07.svg"
                                alt="Threads"
                                width={90}
                                height={90}
                                className="w-[30px] md:w-[42px] h-auto"
                            />
                        </Link>

                        {/* Delivery Title */}
                        <h3 className="text-[24px] md:text-[34px] font-bold leading-[1.2] mb-5">
                            Tiệm đã có mặt trên
                            <br />
                            sàn Grab và Shopee!
                        </h3>

                        {/* Logos */}
                        <div className="flex flex-col items-start md:items-end gap-4">

                            <Link
                                href="https://food.grab.com/vn/en/restaurant/cocanut-%C4%91%E1%BB%8Dc-l%C3%A0-c%C3%B4-ca-n%E1%BA%A5t-ph%E1%BA%A1m-v%C4%83n-hai-delivery/5-C6TATK5WTJ4UJX?sourceID=20250822_003256_E345C37166B74E4584ABAD80C15112B2_MEXMPS"
                                target="_blank"
                                className="hover:opacity-80 transition"
                            >
                                <Image
                                    src="/images/footer-05.svg"
                                    alt="GrabFood"
                                    width={320}
                                    height={90}
                                    className="w-[150px] md:w-[220px] h-auto"
                                />
                            </Link>

                            <Link
                                href="https://shopeefood.vn/now-food/shop/1215303"
                                target="_blank"
                                className="hover:opacity-80 transition"
                            >
                                <Image
                                    src="/images/footer-06.svg"
                                    alt="ShopeeFood"
                                    width={420}
                                    height={100}
                                    className="w-[180px] md:w-[280px] h-auto"
                                />
                            </Link>

                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-[#601C1F] py-5">
                <p className="text-center text-white text-[13px] md:text-[15px] font-semibold px-4">
                    Powered by The Hospitality Lab Vietnam. All rights reserved.
                </p>
            </div>
        </footer>
    );
}