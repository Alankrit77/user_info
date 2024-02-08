import React, { useState, useEffect } from "react";
import axios from "axios";
import "./User.css";

function User() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pastSearchTerms, setPastSearchTerms] = useState([]);

  useEffect(() => {
    // Fetch users from API
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });

    // Load past search terms from local storage
    const storedSearchTerms = localStorage.getItem("pastSearchTerms");
    if (storedSearchTerms) {
      setPastSearchTerms(JSON.parse(storedSearchTerms));
    }
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const debouncedHandleSearch = debounce((newSearchTerm) => {
    setSearchTerm(newSearchTerm);

    // Update past search terms
    if (newSearchTerm.trim() !== "") {
      setPastSearchTerms((prevTerms) => {
        const newTerms = [...prevTerms, newSearchTerm];
        const uniqueTerms = Array.from(new Set(newTerms));
        localStorage.setItem("pastSearchTerms", JSON.stringify(uniqueTerms));
        return uniqueTerms;
      });
    }
  }, 1000);

  // for search
  const handleSearch = (event) => {
    debouncedHandleSearch(event.target.value);
  };

  // for sorting the names
  const handleSort = () => {
    setUsers([...users].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-container">
      <h1>User Info</h1>
      <input type="text" placeholder="Search by name" onChange={handleSearch} />
      <button className="btn-action" onClick={handleSort}>
        Sort by Name
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {/* table to show all user info  */}
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Past Search Terms</h2>
      <ul>
        {pastSearchTerms.map((term, index) => (
          <li key={index}>{term}</li>
        ))}
      </ul>
    </div>
  );
}

export default User;
