import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { apiClient } from "../config/api";

function AdminDashboard() {
  const { isDarkMode } = useTheme();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    poster: "",
    genres: [],
    rating: 0,
    director: "",
    year: new Date().getFullYear(),
    duration: "",
  });

  const [editingMovie, setEditingMovie] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const availableGenres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Western",
  ];

  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await apiClient.getMovies();
        // Check if response has a movies property (based on your backend response)
        const moviesData = response.movies || response;
        // Ensure moviesData is an array
        setMovies(Array.isArray(moviesData) ? moviesData : []);
      } catch (err) {
        setError("Failed to load movies");
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMovies();
      setMovies(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreToggle = (genre) => {
    const target = isEditing ? editingMovie : newMovie;
    const setTarget = isEditing ? setEditingMovie : setNewMovie;

    setTarget((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updatedMovie = await apiClient.updateMovie(
          editingMovie._id,
          editingMovie
        );
        setMovies((prev) =>
          prev.map((movie) =>
            movie._id === updatedMovie._id ? updatedMovie : movie
          )
        );
        setIsEditing(false);
        setEditingMovie(null);
      } else {
        const createdMovie = await apiClient.createMovie(newMovie);
        setMovies((prev) => [...prev, createdMovie]);
        setNewMovie({
          title: "",
          description: "",
          poster: "",
          genres: [],
          rating: 0,
          director: "",
          year: new Date().getFullYear(),
          duration: "",
        });
      }
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Error saving movie:", error);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setIsEditing(true);
    setTimeout(() => scrollToForm(), 100);
  };

  const handleDelete = async (movieId) => {
    try {
      await apiClient.deleteMovie(movieId);
      setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Error deleting movie:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: isDarkMode
          ? "var(--bg-secondary)"
          : "var(--bg-primary)",
      }}
    >
      <div style={styles.content}>
        <h1 style={{ ...styles.title, color: "var(--text-primary)" }}>
          Admin
        </h1>

        {error && <div style={styles.error}>{error}</div>}

        {/* Movie List */}
        <div
          style={{
            ...styles.card,
            backgroundColor: isDarkMode ? "var(--bg-primary)" : "white",
            boxShadow: isDarkMode
              ? "0 4px 6px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ ...styles.subtitle, color: "var(--text-primary)" }}>
            Movie List
          </h2>
          <div style={styles.movieList}>
            {movies.map((movie) => (
              <div
                key={movie._id}
                style={{
                  ...styles.movieItem,
                  backgroundColor: isDarkMode
                    ? "var(--bg-secondary)"
                    : "#f8f9fa",
                }}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={styles.moviePoster}
                />
                <div style={styles.movieInfo}>
                  <h3 style={{ color: "var(--text-primary)" }}>
                    {movie.title}
                  </h3>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {movie.director} • {movie.year}
                  </p>
                  {/* Add rating and review count */}
                  <div style={styles.ratingInfo}>
                    <span style={styles.rating}>
                      ★{" "}
                      {movie.averageRating?.toFixed(1) ||
                        movie.rating?.toFixed(1) ||
                        "0.0"}
                    </span>
                    <span style={styles.reviewCount}>
                      ({movie.numReviews || movie.reviews?.length || 0} reviews)
                    </span>
                  </div>
                  <div style={styles.genres}>
                    {movie.genres.map((genre) => (
                      <span key={genre} style={styles.genre}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleEdit(movie)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(movie._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Movie Form */}
        <div
          style={{
            ...styles.card,
            backgroundColor: isDarkMode ? "var(--bg-primary)" : "white",
            boxShadow: isDarkMode
              ? "0 4px 6px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ ...styles.subtitle, color: "var(--text-primary)" }}>
            {isEditing ? "Edit Movie" : "Add New Movie"}
          </h2>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={styles.form}
          >
            {/* Form fields */}
            <div style={styles.formGroup}>
              <label style={{ ...styles.label, color: "var(--text-primary)" }}>
                Movie Title
              </label>
              <input
                type="text"
                value={isEditing ? editingMovie.title : newMovie.title}
                onChange={(e) =>
                  isEditing
                    ? setEditingMovie({
                        ...editingMovie,
                        title: e.target.value,
                      })
                    : setNewMovie({ ...newMovie, title: e.target.value })
                }
                style={{
                  ...styles.input,
                  backgroundColor: isDarkMode ? "var(--bg-secondary)" : "white",
                  color: "var(--text-primary)",
                }}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={{ ...styles.label, color: "var(--text-primary)" }}>
                Director
              </label>
              <input
                type="text"
                value={isEditing ? editingMovie.director : newMovie.director}
                onChange={(e) =>
                  isEditing
                    ? setEditingMovie({
                        ...editingMovie,
                        director: e.target.value,
                      })
                    : setNewMovie({ ...newMovie, director: e.target.value })
                }
                style={{
                  ...styles.input,
                  backgroundColor: isDarkMode ? "var(--bg-secondary)" : "white",
                  color: "var(--text-primary)",
                }}
                placeholder="Enter director name"
                required
              />
            </div>

            {/* Year, Duration, Rating Row */}
            <div style={styles.row}>
              {/* Year */}
              <div style={styles.formGroup}>
                <label
                  style={{ ...styles.label, color: "var(--text-primary)" }}
                >
                  Year
                </label>
                <input
                  type="number"
                  value={isEditing ? editingMovie.year : newMovie.year}
                  onChange={(e) =>
                    isEditing
                      ? setEditingMovie({
                          ...editingMovie,
                          year: parseInt(e.target.value),
                        })
                      : setNewMovie({
                          ...newMovie,
                          year: parseInt(e.target.value),
                        })
                  }
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode
                      ? "var(--bg-secondary)"
                      : "white",
                    color: "var(--text-primary)",
                  }}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  placeholder="Enter year"
                  required
                />
              </div>

              {/* Duration */}
              <div style={styles.formGroup}>
                <label
                  style={{ ...styles.label, color: "var(--text-primary)" }}
                >
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={isEditing ? editingMovie.duration : newMovie.duration}
                  onChange={(e) =>
                    isEditing
                      ? setEditingMovie({
                          ...editingMovie,
                          duration: parseInt(e.target.value),
                        })
                      : setNewMovie({
                          ...newMovie,
                          duration: parseInt(e.target.value),
                        })
                  }
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode
                      ? "var(--bg-secondary)"
                      : "white",
                    color: "var(--text-primary)",
                  }}
                  min="1"
                  placeholder="e.g., 120"
                  required
                />
              </div>

              {/* Rating */}
              <div style={styles.formGroup}>
                <label
                  style={{ ...styles.label, color: "var(--text-primary)" }}
                >
                  Rating
                </label>
                <input
                  type="number"
                  value={isEditing ? editingMovie.rating : newMovie.rating}
                  onChange={(e) =>
                    isEditing
                      ? setEditingMovie({
                          ...editingMovie,
                          rating: parseFloat(e.target.value),
                        })
                      : setNewMovie({
                          ...newMovie,
                          rating: parseFloat(e.target.value),
                        })
                  }
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode
                      ? "var(--bg-secondary)"
                      : "white",
                    color: "var(--text-primary)",
                  }}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="Enter rating (0-5)"
                  required
                />
              </div>
            </div>

            {/* Poster URL */}
            <div style={styles.formGroup}>
              <label style={{ ...styles.label, color: "var(--text-primary)" }}>
                Movie Poster URL
              </label>
              <input
                type="url"
                value={isEditing ? editingMovie.poster : newMovie.poster}
                onChange={(e) =>
                  isEditing
                    ? setEditingMovie({
                        ...editingMovie,
                        poster: e.target.value,
                      })
                    : setNewMovie({ ...newMovie, poster: e.target.value })
                }
                style={{
                  ...styles.input,
                  backgroundColor: isDarkMode ? "var(--bg-secondary)" : "white",
                  color: "var(--text-primary)",
                }}
                placeholder="Enter poster image URL"
                required
              />
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={{ ...styles.label, color: "var(--text-primary)" }}>
                Description
              </label>
              <textarea
                value={
                  isEditing ? editingMovie.description : newMovie.description
                }
                onChange={(e) =>
                  isEditing
                    ? setEditingMovie({
                        ...editingMovie,
                        description: e.target.value,
                      })
                    : setNewMovie({ ...newMovie, description: e.target.value })
                }
                style={{
                  ...styles.textarea,
                  backgroundColor: isDarkMode ? "var(--bg-secondary)" : "white",
                  color: "var(--text-primary)",
                  borderColor: isDarkMode ? "var(--border-color)" : "#ddd",
                }}
                placeholder="Enter movie description"
                rows="4"
                required
              />
            </div>

            {/* Genres */}
            <div style={styles.formGroup}>
              <label style={{ ...styles.label, color: "var(--text-primary)" }}>
                Genres
              </label>
              <div style={styles.genreGrid}>
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    style={{
                      ...styles.genreButton,
                      backgroundColor: (isEditing
                        ? editingMovie.genres
                        : newMovie.genres
                      ).includes(genre)
                        ? "#646cff"
                        : "transparent",
                      color: (isEditing
                        ? editingMovie.genres
                        : newMovie.genres
                      ).includes(genre)
                        ? "white"
                        : "var(--text-primary)",
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitButton}>
                {isEditing ? "Update Movie" : "Add Movie"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingMovie(null);
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div style={styles.loading}>
    <div style={styles.spinner}></div>
    Loading...
  </div>
);

const styles = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "var(--text-primary)",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #646cff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "10px",
  },
  error: {
    padding: "1rem",
    backgroundColor: "#dc3545",
    color: "white",
    borderRadius: "8px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  card: {
    borderRadius: "12px",
    padding: "2rem",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "2rem",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
  },
  movieList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  movieItem: {
    display: "flex",
    padding: "1rem",
    borderRadius: "8px",
    gap: "1rem",
    alignItems: "center",
  },
  moviePoster: {
    width: "80px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  movieInfo: {
    flex: 1,
  },
  genres: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginTop: "0.5rem",
  },
  genre: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#646cff",
    color: "white",
    borderRadius: "20px",
    fontSize: "0.8rem",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  editButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "500",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    fontSize: "1rem",
  },
  genreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "0.5rem",
  },
  genreButton: {
    padding: "0.5rem 1rem",
    border: "2px solid #646cff",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
  },
  submitButton: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  cancelButton: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "500",
  },
};

export default AdminDashboard;
