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
    console.log(response);
    return response.data.data;
  },
};
