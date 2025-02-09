import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { apiClient } from "../config/api";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";

function Home() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await apiClient.getMovies();
        const moviesData = response.movies || response;

        // Debug log
        console.log("Movies data:", moviesData);

        if (!Array.isArray(moviesData)) {
          throw new Error("Invalid movies data format");
        }

        setMovies(moviesData);
      } catch (err) {
        setError("Failed to load movies");
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Safe genres calculation
  const genres = React.useMemo(() => {
    if (!Array.isArray(movies) || movies.length === 0) return [];
    const allGenres = movies
      .filter((movie) => Array.isArray(movie.genres))
      .flatMap((movie) => movie.genres);
    return [...new Set(allGenres)].sort();
  }, [movies]);

  // Safe filtering
  const filteredMovies = React.useMemo(() => {
    if (!Array.isArray(movies)) return [];

    return movies.filter((movie) => {
      if (!movie) return false;

      const matchesSearch =
        searchTerm === "" ||
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre =
        selectedGenre === "all" ||
        (Array.isArray(movie.genres) && movie.genres.includes(selectedGenre));

      return matchesSearch && matchesGenre;
    });
  }, [movies, searchTerm, selectedGenre]);

  const handleMovieClick = (movieId) => {
    if (movieId) {
      navigate(`/movie/${movieId}`);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorMessage}>{error}</div>
      </div>
    );
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
      <h1 style={styles.title}>Latest Movies</h1>

      <div style={styles.filters}>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <GenreFilter
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          genres={genres}
        />
      </div>

      {filteredMovies.length === 0 ? (
        <div style={styles.noMovies}>
          No movies found matching your criteria
        </div>
      ) : (
        <div style={styles.movieGrid}>
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie._id || movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie._id || movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    
    margin: "0 auto",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "2rem",
    textAlign: "center",
    color: "var(--text-primary)",
    fontSize: "2.5rem",
    fontWeight: "700",
  },
  filters: {
    marginBottom: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  movieGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "2rem",
    justifyItems: "center",
    padding: "1rem",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  loadingText: {
    fontSize: "1.2rem",
    color: "var(--text-primary)",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  errorMessage: {
    color: "#dc3545",
    fontSize: "1.2rem",
    padding: "1rem",
    backgroundColor: "#ffe6e6",
    borderRadius: "8px",
  },
};

export default Home;
