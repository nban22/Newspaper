import mongooseConnection from "../config/database";
import Article from "../models/article";
import Category from "../models/category"; 
import { seedArticles } from "./articleSeeder";
import seedCategory from "./categorySeeder";
import seedTags from "./tagSeeder";
import Tag from "../models/tag";
import seedArticleTag from "./articleTagSeeder";
import ArticleTag from "../models/article_tag";

mongooseConnection();


const seedDatabase = async () => {
    try {
        await Article.deleteMany({});
        await Category.deleteMany({});
        await Tag.deleteMany({});
        await ArticleTag.deleteMany({});

       
        await seedCategory();
        await seedArticles();
        await seedTags();
        await seedArticleTag();

        console.log("Database seeded successfully");
        
    } catch (error: any) {
        console.error(error.message);
    }
}

seedDatabase();