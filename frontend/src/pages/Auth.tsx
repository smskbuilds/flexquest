import { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { loginSuccess } from '../slices/userSlice';

export default function AuthPage() {
	const [mode, setMode] = useState<'login' | 'signup'>('signup');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();

	const submit = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/auth/${mode}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			if (!res.ok) throw new Error('Request failed');
			const data = await res.json();
			dispatch(loginSuccess({ id: data.id, email: data.email, token: data.token }));
		} catch (e) {
			setError('Authentication failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen p-4 flex items-center justify-center">
			<div className="w-full max-w-sm bg-white/90 rounded-organic shadow-soft p-6">
				<h2 className="text-xl font-semibold mb-4">{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
				<div className="space-y-3">
					<input className="w-full border rounded-md p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
					<input className="w-full border rounded-md p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
					<button className="w-full py-2 rounded-md bg-ghibli-primary text-white disabled:opacity-60" disabled={loading} onClick={submit}>
						{loading ? '...' : mode === 'signup' ? 'Sign up' : 'Log in'}
					</button>
					{error && <div className="text-red-600 text-sm">{error}</div>}
				</div>
				<div className="mt-4 text-sm">
					{mode === 'signup' ? (
						<span>Already have an account? <button className="underline" onClick={() => setMode('login')}>Log in</button></span>
					) : (
						<span>New here? <button className="underline" onClick={() => setMode('signup')}>Create one</button></span>
					)}
				</div>
			</div>
		</div>
	);
}