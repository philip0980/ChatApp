import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState([]);
  const [search, setSearch] = useState("");
  const [socket, setSocket] = useState(null);
  const [me, setMe] = useState("");
  const [opponent, setOpponent] = useState("");
  const [groupChat, setGroupChat] = useState([]);
  const [activeGroup, setActiveGroup] = useState();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("message", ({ message, fromSocketId }) => {
      console.log(`Received message: ${message} from ${fromSocketId}`);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: fromSocketId, text: message },
      ]);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection Error: ", err.message);
    });

    return () => {
      // Cleanup on component unmount
      newSocket.disconnect();
    };
  }, []);

  // Fetch user data once on component mount
  useEffect(() => {
    const getMyData = async () => {
      const token = localStorage.getItem("chattu-token");
      try {
        const response = await axios.get("http://localhost:3000/user/me", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        setMe(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMyData();
  }, []);

  useEffect(() => {
    const getGroupChat = async () => {
      const token = localStorage.getItem("chattu-token");
      try {
        const response = await axios.get("http://localhost:3000/chat/my", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });

        console.log(response.data.chats);
        setGroupChat(response.data.chats);
      } catch (error) {
        console.log(error);
      }
    };
    getGroupChat();
  }, []);

  // Register user with socket after fetching user data
  useEffect(() => {
    if (socket && me) {
      socket.emit("register", me);
    }
  }, [socket, me]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (socket && opponent) {
      socket.emit("sent-message", { message, toSocketId: opponent });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: me, text: message },
      ]);
      console.log(messages);
    }

    if (activeGroup) {
      socket.emit("send-group-message", {
        groupId: activeGroup,
        sender: "UserId",
        content: message,
      });
    }

    setMessage("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("chattu-token");
    try {
      const response = await axios.get(
        `http://localhost:3000/user/search?name=${search}`,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      const oneUser = response.data.message;
      setUser(oneUser);
      console.log(response.data.me);
    } catch (error) {
      console.log(error);
    }
  };

  const startChat = (id) => {
    console.log(`Starting chat with user ID: ${id}`);
    setOpponent(id);
  };

  const handleGroupChat = (id) => {
    console.log(`Starting group chat with group id ${id}`);
    setActiveGroup(id);
  };

  return (
    <div>
      <h2>Search User</h2>
      <div>
        <input
          value={search}
          type="text"
          placeholder="Search for User"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {user.map((Ujer) => (
          <div key={Ujer._id} style={{ border: "1px solid black" }}>
            <div onClick={() => startChat(Ujer._id)}>
              <p>{Ujer._id}</p>
              <p>{Ujer.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2>Group Chats</h2>
        <div>
          {groupChat.map((groups, index) => (
            <div
              style={{ border: "1px solid black" }}
              key={index}
              onClick={() => handleGroupChat(groups._id)}
            >
              <p>{groups.name}</p>
              <p>
                Members :{" "}
                {groups.members.map((member) => (
                  <span style={{ margin: "0.4rem" }}>{member.name}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
      <h1>Chat</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type here a message...."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input type="submit" />
        </form>
      </div>
      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>
              <strong>{msg.sender === me ? "Me" : "Opponent"}:</strong>{" "}
              {msg.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
