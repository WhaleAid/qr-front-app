import { clearAuthTokens, getAuthTokens } from "@/utils/authToken";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
        const accessToken = (await getAuthTokens()).accessToken;
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        clearAuthTokens();
    }
    return result;
};

export const api = createApi({
    tagTypes: [
        "Me",
        "Generation",
        "Campaign",
        "Image",
        "Scan"
    ],
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
})

export default api