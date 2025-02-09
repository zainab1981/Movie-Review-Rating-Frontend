import React from 'react';

function GenreFilter({ selectedGenre, onGenreChange, genres }) {
  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.genreButton,
          backgroundColor: selectedGenre === 'all' ? '#646cff' : 'transparent',
          color: selectedGenre === 'all' ? 'white' : '#666',
        }}
        onClick={() => onGenreChange('all')}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          style={{
            ...styles.genreButton,
            backgroundColor: selectedGenre === genre ? '#646cff' : 'transparent',
            color: selectedGenre === genre ? 'white' : '#666',
          }}
          onClick={() => onGenreChange(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '2rem',
    justifyContent: 'center',
  },
  genreButton: {
    padding: '0.5rem 1rem',
    border: '2px solid #646cff',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
};

export default GenreFilter;