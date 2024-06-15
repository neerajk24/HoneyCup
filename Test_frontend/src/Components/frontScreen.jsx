import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Users(props) {
    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/socketChat/chats/getUsernames');
                props.setusers(response.data.usernames);
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        };
        fetchUsernames();
    }, []); // Empty dependency array means this effect runs once after the initial render

    const changeUsername = async(name) => {
        const response = await axios.get(`http://localhost:3000/api/socketChat/chats/getUnreadmsg/${name}`);
        console.log(response);
        props.setUnreadmsg(response.data);
        props.Setusername(name);
    }
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center  vh-100">
            <div>
                <h1>Select your username : </h1>
                <div className="d-flex flex-column mt-5">
                    {props.participants.map((username, index) => (
                        <button key={index} className="btn btn-primary m-2" onClick={() => { changeUsername(username); navigate('/chatNow'); }}>
                            {username}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
