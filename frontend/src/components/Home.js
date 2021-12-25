import React, { useState } from "react";
import _ from 'lodash';
//import { Link } from "react-router-dom";

const Home = ({ setRoomCode }) => {
  const [roomId, setRoomId] = useState("");
  const handleChange = (e) => {
    setRoomId(e.target.value);
  };
  const handleSubmit = () => {
    setRoomCode(roomId);
  };
  const createRoom = () => {
    const randomId = `${_.random(1000, 9999)}`;
    setRoomCode(randomId);
  };

  return (
    <div className="homepage-menu">
      <div className="homepage-form">
        <div className="homepage-join">
          <input type="text" placeholder="Game Code" onChange={handleChange} />
          {/* <Link to={`/play?roomCode=${roomCode}`}> */}
          <button onClick={handleSubmit} className="game-button green">
            JOIN GAME
          </button>
          {/* </Link> */}
        </div>
        <h1>OR</h1>
        <div className="homepage-create">
          {/* <Link to={`/play?roomCode=${randomCodeGenerator(5)}`}> */}
          <button onClick={createRoom} className="game-button orange">
            CREATE GAME
          </button>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
