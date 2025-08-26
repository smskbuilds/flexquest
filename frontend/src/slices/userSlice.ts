import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
	id: string | null;
	email: string | null;
	level: number;
	xp: number;
	token: string | null;
}

const initialState: UserState = {
	id: null,
	email: null,
	level: 1,
	xp: 0,
	token: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		loginSuccess(
			state,
			action: PayloadAction<{ id: string; email: string; token: string }>,
		) {
			state.id = action.payload.id;
			state.email = action.payload.email;
			state.token = action.payload.token;
		},
		logout(state) {
			state.id = null;
			state.email = null;
			state.token = null;
			state.level = 1;
			state.xp = 0;
		},
		grantXp(state, action: PayloadAction<number>) {
			state.xp += action.payload;
			while (state.xp >= 100) {
				state.xp -= 100;
				state.level += 1;
			}
		},
	},
});

export const { loginSuccess, logout, grantXp } = userSlice.actions;
export default userSlice.reducer;