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
};