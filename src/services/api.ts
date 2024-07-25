import { clearAuthCookies, getAuthCookies } from "@/utils/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const { accessToken } = getAuthCookies();
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        clearAuthCookies();
    }
    return result;
};

export const api = createApi({
    tagTypes: [
        "Me",
        "Generation",
        "Campaign",
        "Image",
    ],
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
})

export default api