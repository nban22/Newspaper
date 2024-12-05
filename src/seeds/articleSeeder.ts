// const ArticleSchema: Schema<IArticle> = new mongoose.Schema({
//     title: { type: String, required: true },
//     summary: { type: String },
//     content: { type: String, required: true },
//     thumbnail: { type: String },
//     category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
//     author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     publish_date: { type: Date },
//     status: { type: String, enum: ["draft", "published", "archived"], default: "draft", required: true },
//     created_at: { type: Date, default: Date.now },
//     updated_at: { type: Date, default: Date.now }
// });

import Article from "../models/article";
import Category from "../models/category";


const articlesList = [
    {
        title: "Bóng đá Việt Nam: HAGL thắng trận thứ 2 liên tiếp",
        summary: "HAGL đã có chiến thắng thứ 2 liên tiếp tại V-League 2021",
        content: "HAGL đã có chiến thắng thứ 2 liên tiếp tại V-League 2021 khi đánh bại Viettel với tỷ số 2-1. Đây là trận thắng thứ 2 liên tiếp của HAGL sau khi họ thắng trận trước Hà Nội FC. Với chiến thắng này, HAGL đã tạm thời vươn lên dẫn đầu bảng xếp hạng V-League 2021.",
        thumbnail: "https://robohash.org/1",
        category_name: "Bóng đá Việt Nam",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Công nghệ AI và tương lai của ngành y tế",
        summary: "AI đang dần thay đổi ngành y tế và mang lại những cơ hội mới.",
        content: "Công nghệ AI đang giúp các bác sĩ trong việc chuẩn đoán bệnh tật, dự đoán nguy cơ bệnh và hỗ trợ quá trình điều trị. Các ứng dụng AI trong y tế đã và đang có những bước tiến đáng kể, mang lại cơ hội chữa bệnh hiệu quả hơn.",
        thumbnail: "https://robohash.org/2",
        category_name: "Công nghệ",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Tác động của mạng xã hội đối với giới trẻ",
        summary: "Mạng xã hội có ảnh hưởng rất lớn đối với hành vi và nhận thức của giới trẻ.",
        content: "Mạng xã hội trở thành công cụ không thể thiếu trong đời sống hàng ngày, đặc biệt là với giới trẻ. Tuy nhiên, việc lạm dụng mạng xã hội có thể gây ra những tác động tiêu cực đến sức khỏe tâm lý và các mối quan hệ xã hội của giới trẻ.",
        thumbnail: "https://robohash.org/3",
        category_name: "Xã hội",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Vì sao chúng ta cần bảo vệ môi trường?",
        summary: "Bảo vệ môi trường là nhiệm vụ của mọi cá nhân và tổ chức.",
        content: "Môi trường là nền tảng cho sự sống trên Trái Đất. Tuy nhiên, việc khai thác tài nguyên thiên nhiên không bền vững và sự ô nhiễm đang đe dọa sự sống của các sinh vật trên hành tinh này. Chúng ta cần hành động ngay để bảo vệ môi trường cho các thế hệ tương lai.",
        thumbnail: "https://robohash.org/4",
        category_name: "Môi trường - Khí hậu",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Xu hướng học trực tuyến trong giáo dục hiện đại",
        summary: "Học trực tuyến đang trở thành xu hướng trong giáo dục.",
        content: "Học trực tuyến giúp học sinh và sinh viên học tập mọi lúc, mọi nơi, đồng thời tiết kiệm thời gian và chi phí đi lại. Tuy nhiên, học trực tuyến cũng có một số thử thách như thiếu sự tương tác trực tiếp giữa giảng viên và học viên.",
        thumbnail: "https://robohash.org/5",
        category_name: "Giáo dục",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Lợi ích của việc tập thể dục hàng ngày",
        summary: "Tập thể dục hàng ngày mang lại nhiều lợi ích cho sức khỏe.",
        content: "Việc tập thể dục không chỉ giúp cải thiện sức khỏe thể chất mà còn giúp tăng cường sức khỏe tinh thần. Các nghiên cứu đã chỉ ra rằng tập thể dục đều đặn có thể giúp giảm nguy cơ mắc các bệnh mãn tính như tiểu đường, béo phì và bệnh tim mạch.",
        thumbnail: "https://robohash.org/6",
        category_name: "Sức khỏe",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Phát triển bền vững trong kinh doanh",
        summary: "Kinh doanh bền vững giúp doanh nghiệp phát triển lâu dài.",
        content: "Phát triển bền vững không chỉ bao gồm các yếu tố kinh tế mà còn phải đảm bảo lợi ích về môi trường và xã hội. Doanh nghiệp thực hiện các chiến lược bền vững có thể nâng cao giá trị thương hiệu và gia tăng lợi nhuận trong dài hạn.",
        thumbnail: "https://robohash.org/7",
        category_name: "Kinh doanh",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Ứng dụng của Blockchain trong các ngành công nghiệp",
        summary: "Blockchain có thể thay đổi cách thức hoạt động của nhiều ngành công nghiệp.",
        content: "Blockchain không chỉ là nền tảng của các đồng tiền ảo mà còn có tiềm năng ứng dụng trong nhiều lĩnh vực như ngân hàng, bảo hiểm, logistics và chăm sóc sức khỏe. Công nghệ này giúp đảm bảo tính bảo mật và minh bạch trong giao dịch.",
        thumbnail: "https://robohash.org/8",
        category_name: "Công nghệ",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Tương lai của giao thông thông minh",
        summary: "Giao thông thông minh sẽ cải thiện hiệu suất và an toàn trong đô thị.",
        content: "Giao thông thông minh là sự kết hợp giữa công nghệ và các phương tiện giao thông để tối ưu hóa lưu thông, giảm tắc nghẽn và nâng cao an toàn cho người tham gia giao thông. Đây là xu hướng phát triển trong tương lai cho các thành phố thông minh.",
        thumbnail: "https://robohash.org/9",
        category_name: "Giao thông",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Sự phát triển của công nghệ 5G",
        summary: "Công nghệ 5G sẽ mở ra nhiều cơ hội mới cho ngành viễn thông.",
        content: "Công nghệ 5G không chỉ cung cấp tốc độ truy cập nhanh hơn mà còn giúp kết nối nhiều thiết bị cùng lúc. Điều này mở ra nhiều cơ hội mới cho các ứng dụng như xe tự hành, truyền hình 4K và thực tế ảo.",
        thumbnail: "https://robohash.org/10",
        category_name: "Công nghệ",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    },
    {
        title: "Tác động của biến đổi khí hậu đến nông nghiệp",
        summary: "Biến đổi khí hậu gây ra nhiều thách thức cho ngành nông nghiệp.",
        content: "Biến đổi khí hậu gây ra hiện tượng thất thu, hạn hán và lũ lụt, ảnh hưởng đến năng suất và chất lượng nông sản. Để giải quyết vấn đề này, cần có các biện pháp như ứng dụng công nghệ vào sản xuất và bảo vệ môi trường.",
        thumbnail: "https://robohash.org/11",
        category_name: "Môi trường - Khí hậu",
        author_id: "60a6b3a0c7f8f4b0f4c3f4e7",
        publish_date: new Date(),
        status: "published"
    }
]

export const seedArticles = async () => {
    try {
        for (let index = 0; index < articlesList.length; index++) {
            const article = articlesList[index];
            
            const category = await Category.findOne({name: article.category_name});
            if (!category) {
                console.error(`Category ${article.category_name} not found!`);
                return;
            }
            const newArticle = await Article.create({
                title: article.title,
                summary: article.summary,
                content: article.content,
                thumbnail: article.thumbnail,
                category_id: category._id,
                author_id: article.author_id,
                publish_date: article.publish_date,
                status: article.status
            })
            if (!newArticle) {
                console.error(`Failed to seed article ${article.title}`);
                return;
            } else {
                console.log(`Article ${article.title} has been seeded successfully!`);
            }
        }
        console.log("Articles have been seeded successfully!");
    } catch (err) {
        console.error(err);
    }
}