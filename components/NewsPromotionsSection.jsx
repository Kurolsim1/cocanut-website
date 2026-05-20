import { useState, useEffect } from 'react';
import { Heart, MessageCircle, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Dữ liệu mẫu fallback sử dụng crypto.randomUUID() cho ID
function getFallbackPosts() {
    return [
        {
            id: crypto.randomUUID(),
            platform: 'instagram',
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
            caption: '🎉 FLASH SALE HÔM NAY! Giảm 30% cho tất cả Cold Brew Tea từ 14h-16h. Nhập mã: TEATIME30',
            likes: 234,
            comments: 45,
            date: '2 giờ trước',
            link: 'https://instagram.com/cocanut'
        },
        {
            id: crypto.randomUUID(),
            platform: 'facebook',
            image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80',
            caption: '☕ VỊ MỚI RA MẮT: Cà phê dừa - sự kết hợp độc đáo giữa cà phê nguyên chất và nước dừa tươi mát!',
            likes: 567,
            comments: 89,
            date: '5 giờ trước',
            link: 'https://facebook.com/cocanut'
        },
        {
            id: crypto.randomUUID(),
            platform: 'instagram',
            image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
            caption: '💚 Matcha Monday! Mua 2 tặng 1 cho tất cả sản phẩm Matcha. Chỉ hôm nay thôi nhé! 🍵',
            likes: 423,
            comments: 67,
            date: '1 ngày trước',
            link: 'https://instagram.com/cocanut'
        },
        {
            id: crypto.randomUUID(),
            platform: 'facebook',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
            caption: '🎁 KHÁCH HÀNG THÂN THIẾT: Tích điểm nhận quà! Mỗi đơn hàng = 10 điểm. 100 điểm = 1 ly miễn phí!',
            likes: 789,
            comments: 123,
            date: '2 ngày trước',
            link: 'https://facebook.com/cocanut'
        }
    ];
}

export default function NewsPromotionsSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch posts từ API
    useEffect(() => {
        async function fetchPosts() {
            try {
                // Giữ loading = true cho đến khi có kết quả
                setLoading(true);
                // Sử dụng setTimeout giả lập API call để tránh lỗi CORS trong môi trường test
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Giả lập Fetch API call
                // const response = await fetch('/api/social-posts');
                // const data = await response.json();

                const data = { success: false, message: "Mock API error" }; // Giả lập lỗi API để dùng fallback

                if (data.success) {
                    setPosts(data.posts);
                } else {
                    throw new Error(data.message || "Lỗi không xác định khi tải dữ liệu");
                }
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError(err.message);
                // Fallback về dữ liệu mẫu nếu API lỗi
                setPosts(getFallbackPosts());
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    const nextSlide = () => {
        // Đảm bảo posts có dữ liệu trước khi tính toán
        if (posts.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % posts.length);
    };

    const prevSlide = () => {
        // Đảm bảo posts có dữ liệu trước khi tính toán
        if (posts.length === 0) return;
        setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
    };

    // Loading state
    if (loading) {
        return (
            <section className="py-20 px-4 bg-gradient-to-b from-white to-red-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-red-700 mb-4">
                            Tin tức & Ưu đãi
                        </h2>
                    </div>
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    // No posts available
    if (posts.length === 0) {
        return (
            <section className="py-20 px-4 bg-gradient-to-b from-white to-red-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-red-700 mb-4">
                            Tin tức & Ưu đãi
                        </h2>
                    </div>
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">Chưa có bài đăng nào</p>
                    </div>
                </div>
            </section>
        );
    }

    // Đã thêm biến này để tránh truy cập trực tiếp posts[currentSlide] trong JSX 
    // và đảm bảo tính nhất quán của dữ liệu.
    const currentPost = posts[currentSlide];

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-white to-red-50 font-sans">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-red-700 mb-4">
                        Tin tức & Ưu đãi
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Cập nhật những chương trình khuyến mãi và tin tức mới nhất từ Cocanut
                    </p>
                    {error && (
                        <p className="text-sm text-amber-600 mt-2">
                            ⚠️ Đang hiển thị dữ liệu mẫu (không kết nối được API)
                        </p>
                    )}
                </div>

                {/* Desktop View - Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {posts.slice(0, 4).map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-red-100"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={`Bài đăng ${post.id}`}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-red-600 shadow-md">
                                    {post.platform === 'instagram' ? '📸 Instagram' : '👍 Facebook'}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <p className="text-gray-700 text-sm line-clamp-3 mb-4 min-h-[48px]">
                                    {post.caption}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-gray-500 text-sm mb-4 border-t pt-3">
                                    <div className="flex items-center gap-1 text-red-500">
                                        <Heart className="w-4 h-4 fill-red-500" />
                                        <span>{post.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{post.comments}</span>
                                    </div>
                                    <span className="ml-auto text-xs text-gray-400">{post.date}</span>
                                </div>

                                {/* Link */}
                                <a
                                    href={post.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium transform hover:scale-[1.01] shadow-lg"
                                >
                                    <span>Xem chi tiết</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile View - Carousel */}
                <div className="md:hidden relative">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-red-100">
                        {/* Image */}
                        <div className="relative h-80 overflow-hidden">
                            <img
                                src={currentPost.image}
                                alt={`Bài đăng ${currentPost.id}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-red-600 shadow-md">
                                {currentPost.platform === 'instagram' ? '📸 Instagram' : '👍 Facebook'}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                {currentPost.caption}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-gray-500 text-sm mb-4 border-t pt-3">
                                <div className="flex items-center gap-1 text-red-500">
                                    <Heart className="w-4 h-4 fill-red-500" />
                                    <span>{currentPost.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{currentPost.comments}</span>
                                </div>
                                <span className="ml-auto text-xs text-gray-400">{currentPost.date}</span>
                            </div>

                            {/* Link */}
                            <a
                                href={currentPost.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-medium transform hover:scale-[1.01] shadow-lg"
                            >
                                <span>Xem chi tiết</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        aria-label="Previous slide"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-r-full shadow-xl hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-6 h-6 text-red-600" />
                    </button>
                    <button
                        onClick={nextSlide}
                        aria-label="Next slide"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-l-full shadow-xl hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-6 h-6 text-red-600" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                        {posts.map((_, idx) => (
                            <button
                                key={idx}
                                aria-label={`Go to slide ${idx + 1}`}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-red-600 w-8' : 'bg-red-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Follow CTA */}
                <div className="text-center mt-16">
                    <p className="text-gray-700 text-xl font-semibold mb-4">Theo dõi chúng tôi để không bỏ lỡ ưu đãi!</p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="https://facebook.com/cocanut"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition transform hover:scale-105 shadow-md shadow-blue-300/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            Facebook
                        </a>
                        <a
                            href="https://instagram.com/cocanut"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-md shadow-pink-300/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}