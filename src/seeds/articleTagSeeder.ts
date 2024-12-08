import ArticleTag from "../models/article_tag";
import Article from "../models/article";
import Tag from "../models/tag";

const seedArticleTag = async () => {
    // Lấy danh sách bài viết và thẻ từ cơ sở dữ liệu
    try {

        const articles = await Article.find();
        const tags = await Tag.find();

        if (!articles.length || !tags.length) {
            console.log('No articles or tags found!');
            return;
        }

        // Gắn ngẫu nhiên từ 1-3 thẻ cho mỗi bài viết
        for (const article of articles) {
            const randomTags = tags
                .sort(() => 0.5 - Math.random()) // Trộn ngẫu nhiên mảng
                .slice(0, Math.floor(Math.random() * 3) + 1); // Lấy 1-3 thẻ ngẫu nhiên

            await ArticleTag.create(randomTags.map((tag) => ({ article_id: article._id, tag_id: tag._id }))); // Tạo các bản ghi trong bảng article_tag       
        }

        console.log('Article tags seeded successfully!');
    } catch (error) {
        console.error('Error while seeding article tags:', error);
    }
};

export default seedArticleTag;