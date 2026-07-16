import api from "../lib/Axios";
import type { Product } from "../types/product";

interface ProductListResponse {
  success: boolean;
  data: Product[];
}

interface ProductResponse {
  success: boolean;
  data: Product;
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response =
      await api.get<ProductListResponse>("/products");

    return response.data.data;
  },

  async getProduct(id: number): Promise<Product> {
    const response =
      await api.get<ProductResponse>(`/products/${id}`);

    return response.data.data;
  },
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await api.post<ProductResponse>("/products", data);
    return response.data.data;
  },
  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await api.put<ProductResponse>(`/products/${id}`, data);
    return response.data.data;
  },
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
