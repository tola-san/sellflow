import api from "../lib/Axios";
import type { Business } from "../types/business";

// 
interface BusinessResponse {
  success: boolean;
  data: Business | null;
}

//   
export const businessService = {
  async getBusiness(): Promise<Business | null> {
    const response = await api.get<BusinessResponse>("/business");
    return response.data.data;
  },
  async saveBusiness(data: Partial<Business>, exists: boolean): Promise<Business> {
    const response = exists
      ? await api.put<BusinessResponse>("/business", data)
      : await api.post<BusinessResponse>("/business", data);
    return response.data.data as Business;
  },
};
