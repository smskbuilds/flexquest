import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../hooks';
import { rateCurrentStep, startQuest, fetchTodayQuest } from '../slices/questSlice';
import { grantXp } from '../slices/userSlice';
import Poro from '../components/Poro';

function useCountdown(seconds: number, isRunning: boolean, onComplete: () => void) {
	const [remaining, setRemaining] = useState(seconds);
	const savedComplete = useRef(onComplete);
	savedComplete.current = onComplete;
	useEffect(() => {
		if (!isRunning) return;
		setRemaining(seconds);
		const start = Date.now();
		const id = setInterval(() => {
			const elapsed = Math.floor((Date.now() - start) / 1000);
			const left = Math.max(0, seconds - elapsed);
			setRemaining(left);
			if (left === 0) {
				clearInterval(id);
				savedComplete.current();
			}
		}, 250);
		return () => clearInterval(id);
	}, [seconds, isRunning]);
	return remaining;
}

export default function Quest() {
	const dispatch = useAppDispatch();
	const { steps, currentIndex, isActive, completed, loading } = useAppSelector((s) => s.quest);

	useEffect(() => {
		dispatch(fetchTodayQuest());
	}, [dispatch]);

	useEffect(() => {
		if (!isActive && !completed && steps.length > 0) {
			dispatch(startQuest());
		}
	}, [isActive, completed, steps.length, dispatch]);

	const current = steps[currentIndex];
	const [isRunning, setIsRunning] = useState(true);
	const remaining = useCountdown(current?.durationSec ?? 0, isRunning, () => setIsRunning(false));

	useEffect(() => {
		setIsRunning(true);
	}, [current?.id]);

	const intensityLabel = useMemo(() => {
		const i = current?.intensity ?? 1;
		if (i <= 2) return 'Very Easy';
		if (i <= 4) return 'Easy';
		if (i <= 6) return 'Just Right';
		if (i <= 8) return 'Challenging';
		return 'Hard';
	}, [current?.intensity]);

	return (
		<div className="min-h-screen p-4 md:p-8">
			<div className="max-w-3xl mx-auto bg-white/80 rounded-organic shadow-soft p-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold">{current?.title ?? 'Quest'}</h2>
					<div className="text-ghibli-accent font-bold text-xl">{loading ? '...' : `${remaining}s`}</div>
				</div>
				<p className="mt-2 text-sm opacity-80">{current?.description}</p>
				<div className="mt-4 text-sm">Intensity: <span className="font-medium">{current?.intensity} · {intensityLabel}</span></div>

				{/* Poro defender animation placeholder */}
				<div className="mt-6 h-40 relative overflow-hidden rounded-organic bg-gradient-to-br from-ghibli-primary/20 to-ghibli-secondary/20">
					<Poro />
					<motion.div
						className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-ghibli-accent/80"
						animate={{ x: [0, -12, 0], y: [0, -6, 0] }}
						transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
					/>
				</div>

				<div className="mt-6 grid grid-cols-5 gap-2">
					{[1,2,3,4,5].map((r) => (
						<button
							key={r}
							className={`py-2 rounded-md border ${r===3 ? 'bg-ghibli-primary text-white' : 'bg-white'} hover:bg-ghibli-primary/10`}
							onClick={() => {
								dispatch(rateCurrentStep(r as 1|2|3|4|5));
								setIsRunning(true);
								if (r >= 3) {
									dispatch(grantXp(5));
								}
							}}
						>
							{r}
						</button>
					))}
				</div>

				{completed && (
					<div className="mt-6 p-4 rounded-organic bg-ghibli-secondary/20 text-center">
						Quest complete! XP awarded. <a href="/" className="underline ml-2">Back to start</a>
					</div>
				)}
			</div>
		</div>
	);
}