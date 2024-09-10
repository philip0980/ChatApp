import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => {
          navigate("/chat");
        }}
      >
        Go to chat
      </button>
    </div>
  );
};

export default Home;
