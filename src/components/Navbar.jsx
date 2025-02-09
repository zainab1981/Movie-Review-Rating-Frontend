import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      ...styles.nav,
      backgroundColor: isDarkMode ? 'var(--bg-secondary)' : 'var(--bg-primary)',
      borderBottom: `1px solid var(--border-color)`,
    }}>
      <div style={styles.logo}>FlixSaga</div>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/" style={{
              ...styles.link,
              color: 'var(--text-primary)',
            }}>Home</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{
                ...styles.link,
                color: 'var(--text-primary)',
              }}>Admin</Link>
            )}
            <Link to="/profile" style={{
              ...styles.link,
              color: 'var(--text-primary)',
            }}>Profile</Link>
            <ThemeToggle />
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              ...styles.link,
              color: 'var(--text-primary)',
            }}>Login</Link>
            <Link to="/register" style={{
              ...styles.link,
              color: 'var(--text-primary)',
            }}>Register</Link>
            <ThemeToggle />
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    color: 'var(--text-primary)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Navbar;