import api from "../lib/Axios";
import type { Category } from "../types/category";

interface CategoryListResponse {
  success: boolean;
  data: Category[];
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response =
      await api.get<CategoryListResponse>("/categories");

    return response.data.data;
  },
};