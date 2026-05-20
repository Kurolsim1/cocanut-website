// pages/api/social-posts.js
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Lấy từ biến môi trường
        const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
        const FB_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
        const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

        // 1. Lấy posts từ Facebook Page
        const fbResponse = await fetch(
            `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/posts?fields=message,created_time,full_picture,permalink_url,likes.summary(true),comments.summary(true)&limit=4&access_token=${FB_ACCESS_TOKEN}`
        );
        const fbData = await fbResponse.json();

        // 2. Lấy posts từ Instagram
        const igResponse = await fetch(
            `https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media?fields=caption,media_type,media_url,thumbnail_url,permalink,like_count,comments_count,timestamp&limit=4&access_token=${FB_ACCESS_TOKEN}`
        );
        const igData = await igResponse.json();

        // 3. Format dữ liệu Facebook
        const facebookPosts = fbData.data?.map(post => ({
            id: post.id,
            platform: 'facebook',
            caption: post.message || '',
            image: post.full_picture || 'https://via.placeholder.com/800x600?text=Facebook+Post',
            likes: post.likes?.summary?.total_count || 0,
            comments: post.comments?.summary?.total_count || 0,
            date: formatDate(post.created_time),
            link: post.permalink_url
        })) || [];

        // 4. Format dữ liệu Instagram
        const instagramPosts = igData.data?.map(post => ({
            id: post.id,
            platform: 'instagram',
            caption: post.caption || '',
            image: post.media_url || post.thumbnail_url || 'https://via.placeholder.com/800x600?text=Instagram+Post',
            likes: post.like_count || 0,
            comments: post.comments_count || 0,
            date: formatDate(post.timestamp),
            link: post.permalink
        })) || [];

        // 5. Kết hợp và sắp xếp theo thời gian
        const allPosts = [...facebookPosts, ...instagramPosts]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 8); // Lấy 8 posts mới nhất

        res.status(200).json({
            success: true,
            posts: allPosts
        });

    } catch (error) {
        console.error('Error fetching social posts:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy dữ liệu từ mạng xã hội',
            error: error.message
        });
    }
}

// Helper function để format thời gian
function formatDate(dateString) {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return postDate.toLocaleDateString('vi-VN');
}