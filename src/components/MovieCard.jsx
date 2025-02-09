import React from "react";
import { useTheme } from "../context/ThemeContext";

function MovieCard({ movie, onClick }) {
  const { isDarkMode } = useTheme();

  // Calculate the rating to display
  const displayRating = movie.averageRating || movie.rating || 0;
  const reviewCount = movie.numReviews || movie.reviews?.length || 0;

  return (
    <div
      style={{
        ...styles.card,
        backgroundColor: isDarkMode ? "var(--bg-primary)" : "white",
        boxShadow: isDarkMode
          ? "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.15)"
          : "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
      }}
      onClick={onClick}
    >
      <div style={styles.imageContainer}>
        <img src={movie.poster} alt={movie.title} style={styles.image} />
        <div style={styles.overlay}>
          <button style={styles.button}>View Details</button>
        </div>
      </div>
      <div style={styles.content}>
        <h3
          style={{
            ...styles.title,
            color: "var(--text-primary)",
          }}
        >
          {movie.title}
        </h3>
        <div style={styles.ratingContainer}>
          <div style={styles.ratingStars}>
            {"★".repeat(Math.floor(displayRating))}
            {"☆".repeat(5 - Math.floor(displayRating))}
          </div>
          <span
            style={{
              ...styles.ratingNumber,
              color: "var(--text-secondary)",
            }}
          >
            {displayRating.toFixed(1)}/5
          </span>
          <span style={styles.reviewCount}>
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>
        <div style={styles.metadata}>
          <span>{movie.year}</span>
          <span style={styles.dot}>•</span>
          <span>{movie.duration} min</span>
        </div>
        <div style={styles.genres}>
          {movie.genres.map((genre, index) => (
            <span key={index} style={styles.genre}>
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "320px",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    "&:hover": {
      transform: "translateY(-8px)",
    },
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "400px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
    "&:hover": {
      opacity: 1,
    },
  },
  content: {
    padding: "1.5rem",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    lineHeight: "1.2",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
    gap: "0.5rem",
  },
  ratingStars: {
    color: "#ffd700",
    fontSize: "1.2rem",
    letterSpacing: "2px",
  },
  ratingNumber: {
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  description: {
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: "1.5",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#5753e0",
      transform: "scale(1.05)",
    },
    ratingContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "0.75rem",
      gap: "0.5rem",
    },
    ratingStars: {
      color: "#ffd700",
      fontSize: "1.2rem",
      letterSpacing: "2px",
    },
    ratingNumber: {
      fontSize: "0.9rem",
      fontWeight: "500",
    },
    reviewCount: {
      fontSize: "0.9rem",
      color: "var(--text-secondary)",
    },
    metadata: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.75rem",
      color: "var(--text-secondary)",
      fontSize: "0.9rem",
    },
    dot: {
      color: "var(--text-secondary)",
    },
    genres: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginBottom: "0.75rem",
    },
    genre: {
      padding: "0.25rem 0.75rem",
      backgroundColor: "#646cff",
      color: "white",
      borderRadius: "20px",
      fontSize: "0.8rem",
    },
  },
};

export default MovieCard;
