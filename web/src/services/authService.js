import api from './api';

export const authService = {
  async signIn(username, password) {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async signUp(username, password) {
    const response = await api.post('/auth/register', { username, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  signOut() {
    localStorage.removeItem('token');
  },

  isSignedIn() {
    return !!localStorage.getItem('token');
  }
}; 