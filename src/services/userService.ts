import { User } from "@/app/types/user";
import { setUser } from "@/lib/features/user/userSlice";
import api from "./api";

export const userService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => ({
                url: "me",
                method: "GET",
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const data = await queryFulfilled;
                    dispatch(setUser(data.data));
                } catch (error) {
                    console.error("Failed to get user:", error);
                }
            },
            providesTags: ["Me"],
        }),
        updateMe: builder.mutation<User, Partial<User>>({
            query: (data) => ({
                url: "me/update",
                method: "PATCH",
                body: data
            })
        }),
        resetPassword: builder.mutation<User, string>({
            query: (email) => ({
                url: "me/reset-password",
                method: "POST",
                body: email
            })
        }),
        updatePassword: builder.mutation<User, { oldPassword: string, newPassword: string }>({
            query: ({ oldPassword, newPassword }) => ({
                url: "me/update-password",
                method: "PATCH",
                body: { oldPassword, newPassword }
            })
        }),
        getAll: builder.query<User[], void>({
            query: () => ({
                url: "users",
                method: "GET",
            })
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetMeQuery,
    useUpdateMeMutation,
    useResetPasswordMutation,
    useUpdatePasswordMutation,
    useGetAllQuery
} = userService;