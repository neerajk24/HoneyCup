import { useState } from 'react'
import Chat from './Components/Chat'
import Users from './Components/frontScreen'
import './App.css'
import User from '../../src/models/user.model'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function App() {
  const [participants, Setparticipants] = useState([]);
  const [user, Setuser] = useState("");
  const setusers = (people) => {
    Setparticipants(people);
  }
  const Setusername = (username) => {
    Setuser(username);
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Users setusers={setusers} participants={participants} Setusername={Setusername} />
        }/>
        <Route path="/chatNow" element={<Chat participants={participants} user={user}/>} />
      </Routes>
    </Router>
  );
}

export default App
