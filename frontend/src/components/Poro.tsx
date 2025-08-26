import { motion } from 'framer-motion';

export default function Poro() {
	return (
		<motion.div
			className="absolute bottom-2 left-2 w-16 h-16 rounded-full bg-white/90 shadow-soft"
			animate={{ x: [0, 12, 0], y: [0, -6, 0] }}
			transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
		/>
	);
}