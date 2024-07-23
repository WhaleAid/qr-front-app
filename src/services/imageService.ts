import { Image, ImageWithScans } from "@/app/types/image";
import api from "./api";

export const imageService = api.injectEndpoints({
    endpoints: (builder) => ({
        getImages: builder.query<Image[], void>({
            query: () => ({
                url: "image",
                method: "GET",
            }),
            providesTags: (result) =>
                result ? [{ type: "Image", id: "LIST" }] : [],
        }),
        getImagesByCampaignId: builder.query<ImageWithScans[], string>({
            query: (campaignId) => ({
                url: `image/campaign/${campaignId}`,
                method: "GET",
            }),
            providesTags: (result, error, campaignId) =>
                result ? [...result.map(({ _id }) => ({ type: "Image", id: _id } as const)), { type: "Image", id: "LIST" }] : [],
        }),
        getImage: builder.query<Image, string>({
            query: (imageId) => ({
                url: `image/${imageId}`,
                method: "GET",
            }),
            providesTags: (result, error, imageId) =>
                result ? [{ type: "Image", id: imageId }] : [],
        }),
        moderateImage: builder.mutation<Image, { imageId: string, approved: boolean }>({
            query: ({ imageId, approved }) => ({
                url: `image/${imageId}/moderate`,
                method: "PATCH",
                body: { approved },
            }),
            invalidatesTags: [{ type: "Image", id: "LIST" }],
        }),
        voteImage: builder.mutation<Image, { imageId: string, vote: boolean }>({
            query: ({ imageId, vote }) => ({
                url: `image/${imageId}/vote`,
                method: "POST",
                body: { vote },
            }),
            invalidatesTags: [{ type: "Image", id: "LIST" }],
        }),
        removeVoteImage: builder.mutation<Image, string>({
            query: (imageId) => ({
                url: `image/${imageId}/remove-vote`,
                method: "PATCH",
            }),
            invalidatesTags: [{ type: "Image", id: "LIST" }],
        }),
        getNotVotedImagesByCampaignId: builder.query<Image[], string>({
            query: (campaignId) => ({
                url: `image/campaign/${campaignId}/not-voted`,
                method: "GET",
            }),
            providesTags: (result, error, campaignId) =>
                result ? [{ type: "Image", id: "LIST" }] : [],
        }),
        getMyImages: builder.query<Image[], void>({
            query: () => ({
                url: `image/my-images`,
                method: "GET",
            }),
            providesTags: (result, error, ownerId) =>
                result ? [...result.map(({ _id }) => ({ type: "Image", id: _id } as const)), { type: "Image", id: "LIST" }] : [],
        }),
        generateImages: builder.mutation<{ hash: string }, { prompt: string, campaignId: string }>({
            query: ({ prompt, campaignId }) => ({
                url: `ai/campaign/${campaignId}/generate-images`,
                method: "POST",
                body: { prompt },
            }),
            invalidatesTags: [{ type: "Image", id: "LIST" }],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetImagesQuery,
    useGetImagesByCampaignIdQuery,
    useGetImageQuery,
    useModerateImageMutation,
    useVoteImageMutation,
    useRemoveVoteImageMutation,
    useGetNotVotedImagesByCampaignIdQuery,
    useGetMyImagesQuery,
    useGenerateImagesMutation,
} = imageService