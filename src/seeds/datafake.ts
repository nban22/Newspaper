import mongooseConnection from "../config/database";
import Category from "../models/category"; 
import User from "../models/user";
import seedCategory from "./categorySeeder";

mongooseConnection();


const seedDatabase = async () => {
    try {
        await Category.deleteMany({});

       
        await seedCategory();

        console.log("Database seeded successfully");
        
    } catch (error: any) {
        console.error(error.message);
    }
}

seedDatabase();