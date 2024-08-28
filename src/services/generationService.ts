import { Generation, GenerationWithScans } from "@/app/types/generation";
import { clearAuthTokens, getAuthTokens } from "@/utils/authToken";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import api from "./api";
import { Image } from "@/app/types/image";
import { Scan } from "@/app/types/scan";

export const generationService = api.injectEndpoints({
    endpoints: (builder) => ({
        getGenerations: builder.query<Generation[], void>({
            query: () => ({
                url: "generation",
                method: "GET",
            }),
            providesTags: (result) =>
                result ? [{ type: "Generation", id: "LIST" }] : [],
        }),
        getGenerationsByCampaignId: builder.query<GenerationWithScans[], string>({
            query: (campaignId) => ({
                url: `generation/campaign/${campaignId}`,
                method: "GET",
            }),
            providesTags: (result, error, campaignId) =>
                result ? [...result.map(({ _id }) => ({ type: "Generation", id: _id } as const)), { type: "Generation", id: "LIST" }] : [],
        }),
        voteGeneration: builder.mutation<Generation, { generationId: string, vote: boolean }>({
            query: ({ generationId, vote }) => ({
                url: `generation/${generationId}/vote`,
                method: "POST",
                body: { vote },
            }),
            invalidatesTags: [{ type: "Generation", id: "LIST" }],
        }),
        removeVote: builder.mutation<Generation, string>({
            query: (generationId) => ({
                url: `generation/${generationId}/remove-vote`,
                method: "PATCH",
            }),
            invalidatesTags: [{ type: "Generation", id: "LIST" }],
        }),
        getNotVotedGenerationsByCampaignId: builder.query<Generation[], string>({
            query: (campaignId) => ({
                url: `generation/campaign/${campaignId}/not-voted`,
                method: "GET",
            }),
            providesTags: (result, error, campaignId) =>
                result ? [{ type: "Generation", id: "LIST" }] : [],
        }),
        getMyGenerations: builder.query<Generation[], void>({
            query: () => ({
                url: `generation/my-generations`,
                method: "GET",
            }),
            providesTags: (result, error, ownerId) =>
                result ? [...result.map(({ _id }) => ({ type: "Generation", id: _id } as const)), { type: "Generation", id: "LIST" }] : [],
        }),
        generateCompletion: builder.mutation<Generation, { prompt: string, campaignId: string }>({
            query: ({ prompt, campaignId }) => ({
                url: `ai/campaign/${campaignId}/generate-completion`,
                method: "POST",
                body: { prompt },
            }),
            invalidatesTags: [{ type: "Generation", id: "LIST" }],
        }),
        moderateGeneration: builder.mutation<Generation, { generationId: string, approved: boolean }>({
            query: ({ generationId, approved }) => ({
                url: `generation/${generationId}/moderate`,
                method: "PATCH",
                body: { approved },
            }),
            invalidatesTags: [{ type: "Generation", id: "LIST" }],
        }),
        getMyGenerationHistory: builder.query<Generation[], void>({
            query: () => ({
                url: `generation/my-history`,
                method: "GET",
            }),
            providesTags: (result) =>
                result ? [{ type: "Generation", id: "LIST" }] : [],
        }),
        getMyImageHistory: builder.query<Image[], void>({
            query: () => ({
                url: `image/my-history`,
                method: "GET",
            }),
            providesTags: (result) =>
                result ? [{ type: "Image", id: "LIST" }] : [],
        }),
        getScansByCampaignId: builder.query<Scan[], string>({
            query: (campaignId) => ({
                url: `scan/campaign/${campaignId}`,
                method: "GET",
            }),
            providesTags: (result, error, campaignId) =>
                result ? [...result.map(({ _id }) => ({ type: "Scan", id: _id } as const)), { type: "Scan", id: "LIST" }] : [],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetGenerationsQuery,
    useGetGenerationsByCampaignIdQuery,
    useVoteGenerationMutation,
    useRemoveVoteMutation,
    useGetNotVotedGenerationsByCampaignIdQuery,
    useGetMyGenerationsQuery,
    useGenerateCompletionMutation,
    useModerateGenerationMutation,
    useGetMyGenerationHistoryQuery,
    useGetMyImageHistoryQuery,
    useGetScansByCampaignIdQuery,
} = generationService;