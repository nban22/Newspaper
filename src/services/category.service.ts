// categories.service.ts
import Category from '../models/category';
import { Types } from 'mongoose';

interface CategoryTree {
    _id: Types.ObjectId;
    name: string;
    children: CategoryTree[];
}

export async function getAllCategoriesTree(): Promise<CategoryTree[]> {
    // First fetch all categories
    const categories = await Category.find().lean();
    
    // Create a map for quick lookups
    const categoryMap = new Map();
    categories.forEach(cat => {
        categoryMap.set(cat._id.toString(), {
            _id: cat._id,
            name: cat.name,
            children: []
        });
    });
    
    // Build the tree structure
    const rootCategories: CategoryTree[] = [];
    
    categories.forEach(cat => {
        const categoryWithChildren = categoryMap.get(cat._id.toString());
        
        if (cat.parent_id) {
            const parent = categoryMap.get(cat.parent_id.toString());
            if (parent) {
                parent.children.push(categoryWithChildren);
            }
        } else {
            rootCategories.push(categoryWithChildren);
        }
    });
    
    return rootCategories;
}