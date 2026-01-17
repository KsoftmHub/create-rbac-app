import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setCredentials, logout } from '../store/slices/authSlice';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  const login = async (credentials: any) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      dispatch(setCredentials(response.data));
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await axios.post('/auth/register', userData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const hasPermission = (resource: string, action: string) => {
    if (!user || !user.roles) return false;
    return user.roles.some((role: any) =>
      role.permissions.some(
        (p: any) => p.resource === resource && p.action === action
      )
    );
  };

  return {
    user,
    isAuthenticated: !!accessToken,
    login,
    register,
    logout: handleLogout,
    hasPermission,
  };
};
