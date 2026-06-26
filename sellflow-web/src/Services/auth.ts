import api from "../lib/Axios";

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
};