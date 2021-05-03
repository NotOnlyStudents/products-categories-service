import { Category } from 'src/models/Category';

interface CategoryRepository {
  getAllCategories(text: string): Promise<Category[]>;
}

export default CategoryRepository;
