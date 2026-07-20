import api from "../lib/Axios";
import type { Business } from "../types/business";

// 
interface BusinessResponse {
  success: boolean;
  data: Business | null;
}

export interface BusinessPayload extends Omit<Partial<Business>, "logo" | "banner"> {
  logo_image?: File | null;
  banner_image?: File | null;
  remove_logo?: boolean;
  remove_banner?: boolean;
  banner_overlay_opacity?: number;
}

//   
export const businessService = {
  async getBusiness(): Promise<Business | null> {
    const response = await api.get<BusinessResponse>("/business");
    return response.data.data;
  },
  async saveBusiness(data: BusinessPayload, exists: boolean): Promise<Business> {
    const formData = toFormData(data);
    if (exists) formData.append("_method", "PUT");
    const response = await api.post<BusinessResponse>("/business", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data as Business;
  },
};

function toFormData(data: BusinessPayload): FormData {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) form.append(key, value);
    else if (typeof value === "boolean") form.append(key, value ? "1" : "0");
    else if (value !== undefined && value !== null) form.append(key, String(value));
    else if (!["logo_image", "banner_image"].includes(key)) form.append(key, "");
  });
  return form;
}
