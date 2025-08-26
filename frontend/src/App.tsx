import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Quest from './pages/Quest';
import AuthPage from './pages/Auth';
import { useAppSelector } from './hooks';

function Header() {
	const { level, xp } = useAppSelector((s) => s.user);
	return (
		<header className="w-full py-3 px-4 flex items-center justify-between">
			<Link to="/" className="text-xl font-semibold">FlexQuest</Link>
			<div className="text-sm">Level {level} · XP {xp}/100</div>
		</header>
	);
}

export default function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<div className="min-h-screen">
					<Header />
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/quest" element={<Quest />} />
						<Route path="/auth" element={<AuthPage />} />
					</Routes>
				</div>
			</BrowserRouter>
		</Provider>
	);
}
