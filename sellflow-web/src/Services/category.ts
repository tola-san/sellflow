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
  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await api.post<{ data: Category }>("/categories", data);
    return response.data.data;
  },
  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const response = await api.put<{ data: Category }>(`/categories/${id}`, data);
    return response.data.data;
  },
  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
