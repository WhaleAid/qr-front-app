import api from '@/services/api'
import { configureStore } from '@reduxjs/toolkit'
import userSlice from './features/user/userSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            [api.reducerPath]: api.reducer,
            auth: userSlice,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']