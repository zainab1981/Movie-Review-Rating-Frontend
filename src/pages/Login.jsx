import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(formData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      ...styles.container,
      backgroundColor: isDarkMode ? 'var(--bg-secondary)' : '#f5f5f5',
    }}>
      <div style={{
        ...styles.formCard,
        backgroundColor: isDarkMode ? 'var(--bg-primary)' : 'white',
        boxShadow: isDarkMode 
          ? '0 2px 4px rgba(0, 0, 0, 0.2)'
          : '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{
          ...styles.title,
          color: 'var(--text-primary)',
        }}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              ...styles.input,
              backgroundColor: isDarkMode ? 'var(--bg-secondary)' : 'white',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{
              ...styles.input,
              backgroundColor: isDarkMode ? 'var(--bg-secondary)' : 'white',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{
          ...styles.text,
          color: 'var(--text-secondary)',
        }}>
          Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    transition: 'background-color 0.3s ease',
  },
  formCard: {
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    transition: 'color 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
    '&::placeholder': {
      color: 'var(--text-secondary)',
    },
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#646cff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
    opacity: props => props.disabled ? 0.7 : 1,
    transition: 'opacity 0.3s ease',
  },
  text: {
    textAlign: 'center',
    marginTop: '1rem',
    transition: 'color 0.3s ease',
  },
  link: {
    color: '#646cff',
    textDecoration: 'none',
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#ffe6e6',
    borderRadius: '4px',
  },
};

export default Login;