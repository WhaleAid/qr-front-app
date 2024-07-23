import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuthCookies, getAuthCookies, setAuthCookies } from '../utils/cookies';
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
                    setAuthCookies(accessToken, refreshToken);
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
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    clearAuthCookies();
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