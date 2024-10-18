import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuthTokens, getAuthTokens, setAuthTokens } from '../utils/authToken';
import api from './api';

export const Auth = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<any, { email: string; password: string }>({
            query: (data) => ({
                url: 'auth/login',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { accessToken, refreshToken } = data;
                    setAuthTokens(accessToken, refreshToken);
                } catch (error) {
                    console.error('Failed to login:', error);
                }
            }
        }),
        register: builder.mutation<any, { email: string; password: string }>({
            query: (data) => ({
                url: 'auth/register',
                method: 'POST',
                body: data,
            }),
        }),
        validateToken: builder.query<any, string>({
            query: (token) => ({
                url: 'auth/validate-token',
                method: 'POST',
                body: token
            })
        }),
        logout: builder.mutation<any, void>({
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    clearAuthTokens();
                } catch (error) {
                    console.error('Failed to logout:', error);
                }
            },
        }),
    }),
    overrideExisting: true,
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
} = Auth;