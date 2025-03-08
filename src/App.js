import React, { useState } from "react";
import axios from "axios";
import "./GitHubUserFinder.css"; // Import CSS file for styling

const GitHubUserFinder = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    setLoading(true);
    setError("");
    setUserData(null);
    setRepos([]);

    try {
      const userResponse = await axios.get(`https://api.github.com/users/${username}`);
      const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`);

      setUserData(userResponse.data);
      setRepos(reposResponse.data);
    } catch (err) {
      setError("User not found or API limit exceeded. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>GitHub User Finder</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={fetchUserData}>Search</button>
      </div>

      {loading && <p className="loading">Fetching data...</p>}
      {error && <p className="error">{error}</p>}

      {userData && (
        <div className="profile-card">
          <img src={userData.avatar_url} alt="Profile" />
          <h2>{userData.name || "No Name"}</h2>
          <p className="bio">{userData.bio || "No bio available."}</p>
          <p className="followers">Followers: {userData.followers}</p>
        </div>
      )}

      {repos.length > 0 && (
        <div className="repos-container">
          <h3>Top 5 Repositories</h3>
          <ul>
            {repos.map((repo) => (
              <li key={repo.id} className="repo-card">
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
                <p>{repo.description || "No description available."}</p>
                <p className="stars">⭐ {repo.stargazers_count} stars</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GitHubUserFinder;
