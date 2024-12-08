import catchAsync from "../utils/catchAsync";
import Tag from "../models/tag";   

const tags = [
    { name: "Tin tức" },            // News
    { name: "Chính trị" },          // Politics
    { name: "Kinh doanh" },         // Business
    { name: "Công nghệ" },          // Technology
    { name: "Sức khỏe" },           // Health
    { name: "Phong cách sống" },    // Lifestyle
    { name: "Giải trí" },           // Entertainment
    { name: "Thể thao" },           // Sports
    { name: "Khoa học" },           // Science
    { name: "Giáo dục" },           // Education
    { name: "Du lịch" },            // Travel
    { name: "Góc nhìn" },           // Opinion
    { name: "Thế giới" },           // World
    { name: "Môi trường" },         // Environment
    { name: "Văn hóa" },            // Culture
];

const seedTags = async () => {
    try {
        console.log("Seeding tags...");
        await Tag.insertMany(
            tags.map((tag) => ({
                ...tag,
                created_at: new Date(),
                updated_at: new Date(),
            }))
        );
        console.log("Tags seeded successfully.");
    } catch (error) {
        console.error(error);
    }
};

export default seedTags;