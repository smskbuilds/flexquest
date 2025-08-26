import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { StretchStep, TodayQuestResponse } from '@shared/types';

export interface QuestState {
	currentIndex: number;
	steps: StretchStep[];
	isActive: boolean;
	completed: boolean;
	loading: boolean;
	error?: string;
}

const fallbackSteps = (): StretchStep[] => [
	{ id: 'warmup-1', title: 'Gentle Neck Roll', durationSec: 20, intensity: 2, description: 'Slow circular neck movements' },
	{ id: 'main-1', title: 'Hamstring Reach', durationSec: 30, intensity: 3, description: 'Reach towards toes with soft knees' },
	{ id: 'main-2', title: 'Hip Flexor Lunge', durationSec: 30, intensity: 3, description: 'Gentle forward lunge with upright torso' },
	{ id: 'cooldown-1', title: 'Child Pose Breath', durationSec: 25, intensity: 2, description: 'Rest hips to heels and breathe' },
];

export const fetchTodayQuest = createAsyncThunk<StretchStep[]>(
	'quest/fetchToday',
	async () => {
		try {
			const res = await fetch('/api/quests/today');
			if (!res.ok) throw new Error('Failed');
			const data = (await res.json()) as TodayQuestResponse;
			return data.steps;
		} catch {
			return fallbackSteps();
		}
	},
);

const initialState: QuestState = {
	currentIndex: 0,
	steps: fallbackSteps(),
	isActive: false,
	completed: false,
	loading: false,
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const questSlice = createSlice({
	name: 'quest',
	initialState,
	reducers: {
		startQuest(state) {
			state.currentIndex = 0;
			state.isActive = true;
			state.completed = false;
		},
		rateCurrentStep(state, action: PayloadAction<1 | 2 | 3 | 4 | 5>) {
			const rating = action.payload;
			const current = state.steps[state.currentIndex];
			if (!current) return;
			const delta = rating - 3;
			const nextIndex = state.currentIndex + 1;
			if (state.steps[nextIndex]) {
				state.steps[nextIndex].intensity = clamp(state.steps[nextIndex].intensity + delta, 1, 10);
			}
			if (nextIndex >= state.steps.length) {
				state.isActive = false;
				state.completed = true;
			} else {
				state.currentIndex = nextIndex;
			}
		},
		resetQuest(state) {
			state.currentIndex = 0;
			state.steps = fallbackSteps();
			state.isActive = false;
			state.completed = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTodayQuest.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(fetchTodayQuest.fulfilled, (state, action) => {
				state.loading = false;
				state.steps = action.payload;
			})
			.addCase(fetchTodayQuest.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
				state.steps = fallbackSteps();
			});
	},
});

export const { startQuest, rateCurrentStep, resetQuest } = questSlice.actions;
export default questSlice.reducer;