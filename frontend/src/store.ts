import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import questReducer from './slices/questSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		quest: questReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;