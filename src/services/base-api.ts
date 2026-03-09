// services/api.ts


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "../configs/firebase";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: async (headers) => {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Auth', "User", 'Users', 'Notifications','Settings',],

    endpoints: () => ({}),

});

