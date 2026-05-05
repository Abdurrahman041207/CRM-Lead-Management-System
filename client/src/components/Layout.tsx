import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/leads', label: 'Leads' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-blue-400">CRM</span>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`px-3 py-1 rounded ${location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">{user?.name}</span>
          <button onClick={logout} className="text-red-400 hover:text-red-300">Logout</button>
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
