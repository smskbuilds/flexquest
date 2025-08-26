import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
			<motion.h1
				className="text-4xl md:text-6xl font-bold text-ghibli-text"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				FlexQuest
			</motion.h1>
			<motion.p
				className="mt-4 text-lg max-w-xl"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.6 }}
			>
				Transform stretching into an epic quest. Start within seconds.
			</motion.p>
			<motion.button
				className="mt-8 px-8 py-3 rounded-organic bg-ghibli-primary text-white shadow-soft hover:opacity-90"
				whileTap={{ scale: 0.98 }}
				onClick={() => navigate('/quest')}
			>
				Start Quest
			</motion.button>
		</div>
	);
}