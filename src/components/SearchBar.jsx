import React from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div style={styles.container}>
      <FaSearch style={styles.icon} />
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
  input: {
    width: '100%',
    padding: '12px 40px',
    fontSize: '1rem',
    border: '2px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  icon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
  },
};

export default SearchBar;