import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { Shield, LayoutDashboard, LogOut, CheckCircle, XCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-sans">
      <nav className="border-b border-[#1c1c1e] bg-[#161618] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">RBAC <span className="text-blue-500">Master</span></span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.username}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl transition-all border border-red-500/20 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your roles and permissions across the platform.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Permissions Grid */}
          <div className="md:col-span-3 bg-[#161618] border border-[#28282b] rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold flex items-center">
                <LayoutDashboard className="w-5 h-5 mr-3 text-blue-400" />
                Feature Access Control
              </h2>
              <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                LIVE STATUS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { res: 'todos', act: 'view', label: 'View Tasks', desc: 'Read-only access to task lists' },
                { res: 'todos', act: 'create', label: 'Create Content', desc: 'Add new entries to the system' },
                { res: 'todos', act: 'delete', label: 'Destructive Actions', desc: 'Permanently remove resources' },
                { res: 'users', act: 'view', label: 'User Directory', desc: 'View other members in your org' },
                { res: 'comments', act: 'create', label: 'Collaboration', desc: 'Interact with other users' },
                { res: 'settings', act: 'edit', label: 'System Config', desc: 'Change global application state' },
              ].map((perm) => {
                const allowed = hasPermission(perm.res, perm.act);
                return (
                  <div
                    key={`${perm.res}-${perm.act}`}
                    className={`group relative p-6 rounded-2xl border transition-all duration-300 ${allowed
                        ? 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40'
                        : 'bg-gray-500/[0.02] border-gray-500/10 grayscale opacity-60'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${allowed ? 'bg-blue-500/10' : 'bg-gray-500/10'}`}>
                        <Shield className={`w-4 h-4 ${allowed ? 'text-blue-400' : 'text-gray-500'}`} />
                      </div>
                      {allowed ? (
                        <div className="flex items-center text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded uppercase">
                          <CheckCircle className="w-3 h-3 mr-1" /> Authorized
                        </div>
                      ) : (
                        <div className="flex items-center text-[10px] font-bold text-gray-500 bg-gray-500/10 px-2 py-0.5 rounded uppercase">
                          <XCircle className="w-3 h-3 mr-1" /> Denied
                        </div>
                      )}
                    </div>
                    <h3 className={`font-semibold ${allowed ? 'text-white' : 'text-gray-500'}`}>{perm.label}</h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-1">{perm.desc}</p>
                    {allowed && (
                      <div className="absolute inset-0 rounded-2xl bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-[#161618] border border-[#28282b] rounded-2xl p-8 shadow-xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
              <span className="text-2xl font-bold text-white uppercase">{user?.username.substring(0, 2)}</span>
            </div>
            <h3 className="text-xl font-bold">{user?.username}</h3>
            <p className="text-gray-400 text-sm mb-6">{user?.email}</p>

            <div className="w-full space-y-3">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Assigned Roles</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {user?.roles?.map((role: any) => (
                  <span key={role.id || role.name} className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-500/20">
                    {role.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* API Info Card */}
          <div className="md:col-span-2 bg-[#161618] border border-[#28282b] rounded-2xl p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-4 -translate-y-4">
              <Shield className="w-48 h-48 text-white" />
            </div>

            <h3 className="text-lg font-semibold mb-6">System Architecture</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse mr-4 shadow-lg shadow-emerald-500/50"></div>
                <div>
                  <p className="text-sm font-bold text-emerald-400">JWT Authentication Active</p>
                  <p className="text-xs text-emerald-500/70">Secure session management with token rotation</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Method</p>
                  <p className="text-sm font-medium">Axios Interceptors</p>
                </div>
                <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                  <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-1">Persistence</p>
                  <p className="text-sm font-medium">Redux Persist</p>
                </div>
                <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl">
                  <p className="text-pink-400 text-xs font-bold uppercase tracking-widest mb-1">Storage</p>
                  <p className="text-sm font-medium">Local DB (SQLite)</p>
                </div>
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Encryption</p>
                  <p className="text-sm font-medium">@meebon/crypto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/unauthorized" element={
          <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-white p-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-400 max-w-xs text-center">You don't have the required permissions to view this resource.</p>
            <Link to="/" className="mt-8 bg-white text-black px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Return Home
            </Link>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
