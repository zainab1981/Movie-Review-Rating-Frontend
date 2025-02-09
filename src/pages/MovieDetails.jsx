import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { apiClient } from "../config/api";

function MovieDetails() {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMovieAndReviews = async () => {
      try {
        const movieData = await apiClient.getMovie(id);
        setMovie(movieData);
        // Reviews are now part of the movie data
        setReviews(movieData.reviews || []);
      } catch (err) {
        setError("Failed to load movie details");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await apiClient.createReview(id, {
        rating,
        reviewText: review, // Changed from 'comment' to 'reviewText' to match backend
      });

      // Update reviews state with the new review
      if (response.review) {
        setReviews((prev) => [...prev, response.review]);
        setReview("");
        setRating(5);
      }
    } catch (err) {
      setError(err.message || "Failed to submit review");
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading movie details...</div>
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

  if (!movie) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorMessage}>Movie not found</div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: isDarkMode ? "var(--bg-secondary)" : "#f8f9fa",
      }}
    >
      <div style={styles.heroSection}>
        <div
          style={{
            ...styles.backdrop,
            backgroundColor: isDarkMode ? "#0a0a0a" : "#1a1a1a",
          }}
        ></div>
        <div style={styles.heroContent}>
          <img src={movie.poster} alt={movie.title} style={styles.poster} />
          <div style={styles.movieInfo}>
            <h1 style={styles.title}>{movie.title}</h1>
            <div style={styles.metadata}>
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.duration} min</span>
              <span>•</span>
              <span>{movie.genres.join(", ")}</span>
            </div>
            <div style={styles.ratingContainer}>
              <div style={styles.ratingStars}>
                {"★".repeat(Math.floor(movie.rating))}
                {"☆".repeat(5 - Math.floor(movie.rating))}
              </div>
              <span style={styles.ratingNumber}>
                {movie.rating.toFixed(1)}/5
              </span>
            </div>
            <p style={styles.description}>{movie.description}</p>
            <div style={styles.director}>
              <strong>Director:</strong> {movie.director}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div
          style={{
            ...styles.reviewSection,
            backgroundColor: isDarkMode ? "var(--bg-primary)" : "white",
            boxShadow: isDarkMode
              ? "0 2px 4px rgba(0, 0, 0, 0.2)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              ...styles.sectionTitle,
              color: "var(--text-primary)",
            }}
          >
            Write a Review
          </h2>
          <form onSubmit={handleSubmitReview} style={styles.form}>
            <div style={styles.ratingInput}>
              <label
                style={{
                  ...styles.ratingLabel,
                  color: "var(--text-primary)",
                }}
              >
                Your Rating:
              </label>
              <div style={styles.ratingSelect}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    style={{
                      ...styles.starButton,
                      color:
                        num <= rating
                          ? "#ffd700"
                          : isDarkMode
                          ? "#444"
                          : "#ddd",
                      transform:
                        hoveredStar === num ? "scale(1.1)" : "scale(1)",
                    }}
                    onClick={() => setRating(num)}
                    onMouseEnter={() => setHoveredStar(num)}
                    onMouseLeave={() => setHoveredStar(null)}
                    disabled={submitting}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about the movie..."
              style={{
                ...styles.textarea,
                backgroundColor: isDarkMode ? "var(--bg-secondary)" : "white",
                borderColor: isDarkMode ? "var(--border-color)" : "#ddd",
                color: "var(--text-primary)",
              }}
              required
              disabled={submitting}
            />
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                opacity: submitting ? 0.7 : 1,
              }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        <div
          style={{
            ...styles.reviewsContainer,
            backgroundColor: isDarkMode ? "var(--bg-primary)" : "white",
            boxShadow: isDarkMode
              ? "0 2px 4px rgba(0, 0, 0, 0.2)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              ...styles.sectionTitle,
              color: "var(--text-primary)",
            }}
          >
            User Reviews
          </h2>
          {reviews.map((review, index) => (
            <div
              key={review._id} // Changed from review.id to review._id
              style={{
                ...styles.reviewCard,
                backgroundColor: isDarkMode ? "var(--bg-secondary)" : "#f8f9fa",
                marginBottom: index === reviews.length - 1 ? 0 : "1rem",
              }}
            >
              <div style={styles.reviewHeader}>
                <div
                  style={{
                    ...styles.reviewUser,
                    color: "var(--text-primary)",
                  }}
                >
                  {review.name}{" "}
                  {/* Changed from review.user.name to review.name */}
                </div>
                <div
                  style={{
                    ...styles.reviewDate,
                    color: "var(--text-secondary)",
                  }}
                >
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={styles.reviewRating}>
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
                <span
                  style={{
                    ...styles.reviewRatingNumber,
                    color: "var(--text-secondary)",
                  }}
                >
                  {review.rating}/5
                </span>
              </div>
              <p
                style={{
                  ...styles.reviewComment,
                  color: "var(--text-secondary)",
                }}
              >
                {review.reviewText}{" "}
                {/* Changed from review.comment to review.reviewText */}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
  },
  heroSection: {
    position: "relative",
    height: "500px",
    width: "100%",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(20px)",
    opacity: 0.3,
  },
  heroContent: {
    position: "relative",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    display: "flex",
    gap: "2rem",
    alignItems: "flex-start",
    height: "100%",
  },
  poster: {
    width: "300px",
    height: "450px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  movieInfo: {
    flex: 1,
    color: "var(--text-primary)",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "var(--text-primary)",
  },
  metadata: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    fontSize: "1.1rem",
    color: "var(--text-secondary)",
    marginBottom: "1.5rem",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  ratingStars: {
    color: "#ffd700",
    fontSize: "1.5rem",
    letterSpacing: "2px",
  },
  ratingNumber: {
    fontSize: "1.2rem",
    color: "var(--text-secondary)",
  },
  description: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
    color: "var(--text-secondary)",
  },
  director: {
    fontSize: "1.1rem",
    color: "var(--text-secondary)",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem 2rem",
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "2rem",
  },
  reviewSection: {
    padding: "2rem",
    borderRadius: "12px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  ratingInput: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  ratingLabel: {
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  ratingSelect: {
    display: "flex",
    gap: "0.5rem",
  },
  starButton: {
    background: "none",
    border: "none",
    fontSize: "2rem",
    cursor: "pointer",
    padding: "0.25rem",
    transition: "transform 0.2s ease, color 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.7,
    },
  },
  textarea: {
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid",
    minHeight: "150px",
    fontSize: "1rem",
    resize: "vertical",
    transition: "border-color 0.3s ease",
    "&:focus": {
      outline: "none",
      borderColor: "#646cff",
    },
  },
  submitButton: {
    padding: "1rem",
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#535bf2",
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.7,
    },
  },
  reviewsContainer: {
    padding: "2rem",
    borderRadius: "12px",
  },
  reviewCard: {
    padding: "1.5rem",
    borderRadius: "8px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  reviewUser: {
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  reviewDate: {
    fontSize: "0.9rem",
  },
  reviewRating: {
    color: "#ffd700",
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    letterSpacing: "2px",
  },
  reviewRatingNumber: {
    marginLeft: "0.5rem",
    fontSize: "1rem",
  },
  reviewComment: {
    fontSize: "1rem",
    lineHeight: "1.5",
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
  // Add responsive styles
  "@media (max-width: 1024px)": {
    content: {
      gridTemplateColumns: "1fr",
    },
    heroContent: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    poster: {
      width: "250px",
      height: "375px",
    },
  },
  "@media (max-width: 768px)": {
    heroSection: {
      height: "auto",
    },
    title: {
      fontSize: "2.5rem",
    },
    content: {
      padding: "0 1rem 1rem",
    },
  },
};

export default MovieDetails;
