import api from "../lib/Axios";
import type { AuthUser } from "../components/Auth/AuthContext";

export interface UpdateProfilePayload {
    name: string;
    email: string;
}

export interface UpdatePasswordPayload {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export const authService = {

    register(data: any) {
        return api.post("/register", data);
    },

    login(data: any) {
        return api.post("/login", data);
    },

    me(token: string) {
        return api.get("/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    logout(token: string) {
        return api.post(
            "/logout",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },

    async updateProfile(data: UpdateProfilePayload): Promise<AuthUser> {
        const response = await api.patch<{ success: boolean; data: AuthUser }>("/profile", data);
        return response.data.data;
    },

    async updatePassword(data: UpdatePasswordPayload): Promise<void> {
        await api.patch("/profile/password", data);
    },
};
