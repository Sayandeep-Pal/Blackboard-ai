import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react';

function App() {
  const URL = "https://blackboard-ai-be.vercel.app";
  // const URL = "http://localhost:3000";

    const [users, setUsers] = useState([])

    useEffect(() => {
        axios.get(`${URL}/userLog`)
            .then(res => setUsers(res.data))
            .catch(err => console.log(err))
    })

    return (
        <div className='container'>
            <div className='table-container'>
                <h1 style={{color: 'whitesmoke'}}>User Table</h1>
                <table className='user-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user) => {
                                return <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.age}</td>
                                    <td>{user.email}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
         </div>

  )
}

export default App
