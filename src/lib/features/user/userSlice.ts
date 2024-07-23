import { User } from '@/app/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    userInfo: User | null;
    isAdmin: boolean | null;
}

const initialState: UserState = {
    userInfo: null,
    isAdmin: null,
};

const userSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.userInfo = action.payload;
            state.isAdmin = action.payload.role === 'admin';
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: { auth: UserState }) => state.auth.userInfo;

export const selectIsAdmin = (state: { auth: UserState }) => state.auth.isAdmin;

export default userSlice.reducer;