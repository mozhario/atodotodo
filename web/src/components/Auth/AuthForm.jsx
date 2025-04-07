import { useState } from 'react';
import './AuthForm.css';

function AuthForm({ onLogin, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await onRegister(username, password);
      } else {
        await onLogin(username, password);
      }
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-form">
      {error && <p className="error">{error}</p>}
      {isRegistering ? (
        <>
          <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="input mb-2"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input mb-2"
            />
            <button type="submit" className="btn btn-primary mb-2">Register</button>
          </form>
          <p className="text-center">
            Already have an account?{' '}
            <button 
              onClick={() => setIsRegistering(false)}
              className="btn-link"
            >
              Login here
            </button>
          </p>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="input mb-2"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input mb-2"
            />
            <button type="submit" className="btn btn-primary mb-2">Login</button>
          </form>
          <p className="text-center">
            Don't have an account?{' '}
            <button 
              onClick={() => setIsRegistering(true)}
              className="btn-link"
            >
              Register here
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default AuthForm; 