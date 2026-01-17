import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus, User, Lock, Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] text-white p-4">
      <div className="w-full max-w-md bg-[#161618] border border-[#28282b] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
            <UserPlus className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-400 text-sm mt-1">Get started with our template</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[#1c1c1e] border border-[#28282b] rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="johndoe"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1c1c1e] border border-[#28282b] rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#1c1c1e] border border-[#28282b] rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#1c1c1e] border border-[#28282b] rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl mt-4 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#28282b] text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
