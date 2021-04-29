import { Category } from 'src/models/Category';

interface CategoryRepository {
  getAllCategories(): Promise<Category[]>;
}

export default CategoryRepository;
