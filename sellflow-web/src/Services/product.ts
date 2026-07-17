import api from "../lib/Axios";
import type { Product } from "../types/product";

export interface ProductPayload {
  category_id: number;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  thumbnail?: File | null;
  remove_thumbnail?: boolean;
}

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
  async createProduct(data: ProductPayload): Promise<Product> {
    const response = await api.post<ProductResponse>("/products", toFormData(data), multipartConfig);
    return response.data.data;
  },
  async updateProduct(id: number, data: ProductPayload): Promise<Product> {
    const formData = toFormData(data);
    formData.append("_method", "PUT");
    const response = await api.post<ProductResponse>(`/products/${id}`, formData, multipartConfig);
    return response.data.data;
  },
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};

const multipartConfig = { headers: { "Content-Type": "multipart/form-data" } };

function toFormData(data: ProductPayload): FormData {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) form.append(key, value);
    else if (typeof value === "boolean") form.append(key, value ? "1" : "0");
    else if (value === null || value === undefined) form.append(key, "");
    else form.append(key, String(value));
  });
  return form;
}
