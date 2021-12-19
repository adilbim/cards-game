//import "./styles.css";
import CardSection from "./components/Game";
import React, { useState, useEffect } from "react";
import Home from "./components/Home";

export default function App() {
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    console.log("roomCode", roomCode);
  }, [roomCode]);

  return (
    <div className="App">
      <CardSection room={roomCode} />
      <Home setRoomCode={setRoomCode} />
    </div>
  );
}
