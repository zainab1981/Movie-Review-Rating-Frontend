import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../config/api";

function Profile() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient.getProfile();
        setProfile(data);
        setEditedProfile(data);
      } catch (err) {
        setError("Failed to load profile");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Validate passwords if changing
      if (editedProfile.newPassword) {
        if (!editedProfile.currentPassword) {
          throw new Error("Current password is required to change password");
        }
        if (editedProfile.newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters long");
        }
        if (editedProfile.newPassword !== editedProfile.confirmPassword) {
          throw new Error("New passwords do not match");
        }
      }

      // Prepare update data
      const updateData = {
        name: editedProfile.name,
        email: editedProfile.email,
        bio: editedProfile.bio,
        avatar: editedProfile.avatar,
      };

      // Add password data if changing password
      if (editedProfile.newPassword) {
        updateData.currentPassword = editedProfile.currentPassword;
        updateData.newPassword = editedProfile.newPassword;
      }

      const updatedProfile = await apiClient.updateProfile(updateData);

      // If password was changed, update the token
      if (editedProfile.newPassword && updatedProfile.token) {
        localStorage.setItem("token", updatedProfile.token);
      }

      setProfile(updatedProfile);
      setIsEditing(false);

      // Clear password fields
      setEditedProfile((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading profile...</div>
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

  if (!profile) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorMessage}>Profile not found</div>
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
      <div style={styles.content}>
        <div
          style={{
            ...styles.card,
            backgroundColor: isDarkMode ? "var(--bg-primary)" : "white",
            boxShadow: isDarkMode
              ? "0 4px 6px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={styles.header}>
            <img
              src={
                profile.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`
              }
              alt="Profile"
              style={styles.avatar}
            />
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.editButton}
              >
                Edit Profile
              </button>
            ) : null}
          </div>

          {!isEditing ? (
            <div style={styles.profileInfo}>
              <h1
                style={{
                  ...styles.name,
                  color: "var(--text-primary)",
                }}
              >
                {profile.name}
              </h1>
              <p
                style={{
                  ...styles.email,
                  color: "var(--text-secondary)",
                }}
              >
                {profile.email}
              </p>
              <p
                style={{
                  ...styles.bio,
                  color: "var(--text-primary)",
                }}
              >
                {profile.bio}
              </p>
              <div style={styles.genres}>
                {profile.favoriteGenres?.map((genre) => (
                  <span key={genre} style={styles.genre}>
                    {genre}
                  </span>
                ))}
              </div>
              <p
                style={{
                  ...styles.joinDate,
                  color: "var(--text-secondary)",
                }}
              ></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              {error && <div style={styles.error}>{error}</div>}
              <div style={styles.formGroup}>
                <label
                  style={{
                    ...styles.label,
                    color: "var(--text-primary)",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      name: e.target.value,
                    })
                  }
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode
                      ? "var(--bg-secondary)"
                      : "white",
                    color: "var(--text-primary)",
                  }}
                  required
                  disabled={saving}
                />
              </div>

              <div style={styles.formGroup}>
                <label
                  style={{
                    ...styles.label,
                    color: "var(--text-primary)",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      email: e.target.value,
                    })
                  }
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode
                      ? "var(--bg-secondary)"
                      : "white",
                    color: "var(--text-primary)",
                  }}
                  required
                  disabled={saving}
                />
              </div>

              {/* Password Change Section */}
              <div style={styles.passwordSection}>
                <h3
                  style={{
                    ...styles.sectionTitle,
                    color: "var(--text-primary)",
                  }}
                >
                  Change Password
                </h3>

                <div style={styles.formGroup}>
                  <label
                    style={{
                      ...styles.label,
                      color: "var(--text-primary)",
                    }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={editedProfile.currentPassword || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        currentPassword: e.target.value,
                      })
                    }
                    style={{
                      ...styles.input,
                      backgroundColor: isDarkMode
                        ? "var(--bg-secondary)"
                        : "white",
                      color: "var(--text-primary)",
                    }}
                    placeholder="Enter current password"
                    disabled={saving}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label
                    style={{
                      ...styles.label,
                      color: "var(--text-primary)",
                    }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    value={editedProfile.newPassword || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        newPassword: e.target.value,
                      })
                    }
                    style={{
                      ...styles.input,
                      backgroundColor: isDarkMode
                        ? "var(--bg-secondary)"
                        : "white",
                      color: "var(--text-primary)",
                    }}
                    placeholder="Enter new password"
                    disabled={saving}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label
                    style={{
                      ...styles.label,
                      color: "var(--text-primary)",
                    }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={editedProfile.confirmPassword || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        confirmPassword: e.target.value,
                      })
                    }
                    style={{
                      ...styles.input,
                      backgroundColor: isDarkMode
                        ? "var(--bg-secondary)"
                        : "white",
                      color: "var(--text-primary)",
                    }}
                    placeholder="Confirm new password"
                    disabled={saving}
                  />
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    opacity: saving ? 0.7 : 1,
                  }}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditedProfile(profile);
                    setIsEditing(false);
                    setError("");
                  }}
                  style={{
                    ...styles.cancelButton,
                    opacity: saving ? 0.7 : 1,
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
  },
  content: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  card: {
    borderRadius: "12px",
    padding: "2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2rem",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #646cff",
  },
  editButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  name: {
    fontSize: "2rem",
    fontWeight: "700",
    margin: 0,
  },
  email: {
    fontSize: "1.1rem",
    margin: 0,
  },
  bio: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    margin: "1rem 0",
  },
  genres: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  genre: {
    padding: "0.5rem 1rem",
    backgroundColor: "#646cff",
    color: "white",
    borderRadius: "20px",
    fontSize: "0.9rem",
  },
  joinDate: {
    fontSize: "0.9rem",
    marginTop: "1rem",
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
  textarea: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    fontSize: "1rem",
    minHeight: "100px",
    resize: "vertical",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  submitButton: {
    flex: 1,
    padding: "0.75rem",
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
  },
  cancelButton: {
    flex: 1,
    padding: "0.75rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
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
  error: {
    color: "#dc3545",
    padding: "0.75rem",
    backgroundColor: "#ffe6e6",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
};

export default Profile;
