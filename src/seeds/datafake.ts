import mongooseConnection from "../config/database";
import Article from "../models/article";
import Category from "../models/category"; 
import { seedArticles } from "./articleSeeder";
import seedCategory from "./categorySeeder";

mongooseConnection();


const seedDatabase = async () => {
    try {
        await Article.deleteMany({});
        await Category.deleteMany({});


       
        await seedCategory();
        await seedArticles();

        console.log("Database seeded successfully");
        
    } catch (error: any) {
        console.error(error.message);
    }
}

seedDatabase();