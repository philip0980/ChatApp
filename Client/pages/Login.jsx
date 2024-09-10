import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        username,
        password,
      });
      if (response.status === 200) {
        console.log("User login successfully");
        localStorage.setItem("chattu-token", response.data.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="password">password</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Login;
