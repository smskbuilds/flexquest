export interface StretchStep {
	id: string;
	title: string;
	durationSec: number;
	intensity: number;
	description?: string;
}

export interface TodayQuestResponse {
	questId: string;
	steps: StretchStep[];
}