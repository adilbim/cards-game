import React, { useState } from "react";
import _ from 'lodash';

const Home = ({ setRoomCode, room }) => {
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

  return (<div>
    { !room ?
    <div className="homepage-menu" style={{ margin: '5% auto', width: '500px', textAlign: 'center' }}>
      <h1>The Cards Game</h1>
      <div className="homepage-form">
        <div className="homepage-join">
          <input type="text" placeholder="Game Code" onChange={handleChange} />
          <button onClick={handleSubmit} className="game-button green">
            JOIN GAME
          </button>
        </div>
        <h1>OR</h1>
        <div className="homepage-create">
          <button onClick={createRoom} className="game-button orange">
            CREATE GAME
          </button>
        </div>
      </div>
    </div>
    : ''}
    </div>
  );
};

export default Home;
