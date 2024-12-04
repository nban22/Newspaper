import Category from "../models/category";

const categoryList = [
    {
        name: "Xã hội",
    },
    {
        name: "Thời sự",
        parent_name: "Xã hội",
    },
    {
        name: "Giao thông",
        parent_name: "Xã hội",
    },
    {
        name: "Môi trường - Khí hậu",
        parent_name: "Xã hội",
    },
    {
        name: "Thế giới",
    },
    {
        name: "Văn hóa",
    },
    {
        name: "Nghệ thuật",
        parent_name: "Văn hóa",
    },
    {
        name: "Ẩm thực",
        parent_name: "Văn hóa",
    },
    {
        name: "Du lịch",
        parent_name: "Văn hóa",
    },
    {
        name: "Kinh tế",
    },
    {
        name: "Knh doanh",
        parent_name: "Kinh tế",
    },
    {
        name: "Tài chính",
        parent_name: "Kinh tế",
    },
    {
        name: "Lao động làm việc",
        parent_name: "Kinh tế",
    },
    {
        name: "Chứng khoáng",
        parent_name: "Kinh tế",
    },
    {
        name: "Giáo dục",
    },
    {
        name: "Học bổng - Du học",
        parent_name: "Giáo dục",
    },
    {
        name: "Đào tạo - Thi cử",
        parent_name: "Giáo dục",
    },
    {
        name: "Thể thao",
    },
    {
        name: "Bóng đá Quốc tế",
        parent_name: "Thể thao",
    },
    {
        name: "Bóng đá Việt Nam",
        parent_name: "Thể thao",
    },
    {
        name: "Quần vợt",
        parent_name: "Thể thao",
    },
    {
        name: "Giải trí",
    },
    {
        name: "Phim ảnh",
        parent_name: "Giải trí",
    },
    {
        name: "Âm nhạc",
        parent_name: "Giải trí",
    },
    {
        name: "Thời trang",
        parent_name: "Giải trí",
    },
    {
        name: "Pháp luật",
    },
    {
        name: "Hình sự - Dân sự",
        parent_name: "Pháp luật",
    },
    {
        name: "An ninh - Trật tự",
        parent_name: "Pháp luật",
    },
    {
        name: "Đời sống",
    },
];


const seedCategory = async () => {
    categoryList.forEach(async (category) => {
        if (category.parent_name) {
            const categoryParent = await Category.findOne({ name: category.parent_name });
            if (categoryParent) {
                await Category.create({ name: category.name, parent_id: categoryParent._id });
            } else {
                throw new Error("Parent category not found");
            }
        } else {
            console.log("Creating category: ", category.name);
            await Category.create({ name: category.name });
        }
    })
}

export default seedCategory;