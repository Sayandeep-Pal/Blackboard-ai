import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const URL = import.meta.env.VITE_BE_URL;
  // const URL = "http://localhost:3000";
  // const URL = "https://blackboard-ai-be.vercel.app";

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users

  useEffect(() => {
    axios.get(`${URL}/log`)
      .then(res => {
        setUsers(res.data);
        setFilteredUsers(res.data); // Initially show all users
      })
      .catch(err => console.log(err));
  }, []);

  // Update filtered users when the search term changes
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(lowercasedSearchTerm) ||
      user.email.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className='container'>
      <div className='table-container'>
        <h1 style={{ color: 'whitesmoke' }}>User Table</h1>
        <input
          type="text"
          placeholder="Search by name or email"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className='user-table'>
          <thead>
            <tr>
              <th>#</th> {/* Serial number column header */}
              <th>Name</th>
              <th>Email</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td> {/* Display serial number */}
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No matching users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
