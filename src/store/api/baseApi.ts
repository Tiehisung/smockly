// store/api/baseApi.ts


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "../../configs/firebase";
import { TAG_TYPES } from "./tags";

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
    tagTypes: Object.values(TAG_TYPES),

    endpoints: () => ({}),

});

