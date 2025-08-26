import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { TodayQuestResponse } from '../../shared/types';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// In-memory users for MVP; replace with Prisma models later
const users: { id: string; email: string; passwordHash: string }[] = [];

app.get('/health', (_req, res) => {
	res.json({ ok: true });
});

const authSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

app.post('/api/auth/signup', async (req, res) => {
	const parse = authSchema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
	const { email, password } = parse.data;
	if (users.find((u) => u.email === email)) {
		return res.status(409).json({ error: 'Email already registered' });
	}
	const passwordHash = await bcrypt.hash(password, 10);
	const id = `${Date.now()}`;
	users.push({ id, email, passwordHash });
	const token = jwt.sign({ sub: id, email }, JWT_SECRET, { expiresIn: '7d' });
	res.json({ id, email, token });
});

app.post('/api/auth/login', async (req, res) => {
	const parse = authSchema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
	const { email, password } = parse.data;
	const user = users.find((u) => u.email === email);
	if (!user) return res.status(401).json({ error: 'Invalid credentials' });
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
	const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
	res.json({ id: user.id, email, token });
});

// Placeholder quest routes for MVP
app.get('/api/quests/today', (_req, res) => {
	const payload: TodayQuestResponse = {
		questId: 'q1',
		steps: [
			{ id: 'warmup-1', title: 'Gentle Neck Roll', durationSec: 20, intensity: 2 },
			{ id: 'main-1', title: 'Hamstring Reach', durationSec: 30, intensity: 3 },
			{ id: 'main-2', title: 'Hip Flexor Lunge', durationSec: 30, intensity: 3 },
			{ id: 'cooldown-1', title: 'Child Pose Breath', durationSec: 25, intensity: 2 },
		],
	};
	res.json(payload);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`API running on http://localhost:${port}`);
});