import { Campaign, createCampaignArgs } from "@/app/types/campaign";
import { clearAuthTokens, getAuthTokens } from "@/utils/authToken";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import api from "./api";

export const campaignService = api.injectEndpoints({
    endpoints: (builder) => ({
        getCampaigns: builder.query<Campaign[], void>({
            query: () => ({
                url: "campaign",
                method: "GET",
            }),
        }),
        getCampaignsByUserId: builder.query<Campaign[], string>({
            query: (userId) => ({
                url: `campaign/user/${userId}`,
                method: "GET",
            }),
            providesTags: (result, error, userId) =>
                result ? [{ type: "Campaign", id: "LIST" }] : [],
        }),
        getCampaignById: builder.query<Campaign, string>({
            query: (id) => ({
                url: `campaign/${id}`,
                method: "GET",
            }),
        }),
        createCampaign: builder.mutation<Campaign, createCampaignArgs>({
            query: (body) => ({
                url: "campaign",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Campaign", id: "LIST" }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetCampaignsQuery,
    useGetCampaignsByUserIdQuery,
    useGetCampaignByIdQuery,
    useCreateCampaignMutation,
} = campaignService;