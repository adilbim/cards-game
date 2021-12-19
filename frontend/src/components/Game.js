import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";
import _ from "lodash";
import Card from "./Card";
const ENDPOINT = "http://localhost:8080";

//////////////////////
const CardSectionContainer = styled.div`
  height: 300px;
  width: 800px;
  display: flex;
  justify-content: space-around;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

let socket;
const cards = [
  {
    img:
      "https://previews.123rf.com/images/pandawild/pandawild1509/pandawild150900125/45128572-poker-carte-%C3%A0-jouer-10-de-diamant.jpg",
    id: "10-heart"
  },
  {
    img:
      "https://upload.wikimedia.org/wikipedia/commons/c/ce/Poker-sm-224-Jh.png",
    id: "valets-heart"
  },
  {
    img:
      "https://st.depositphotos.com/2127699/2238/i/950/depositphotos_22389279-stock-photo-playing-card-queen-of-hearts.jpg",
    id: "reine-heart"
  },
  {
    img:
      "https://images.freeimages.com/images/premium/previews/1783/17837166-playing-card-king-of-hearts.jpg",
    id: "roi-heart"
  },
  {
    img:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Ace_of_hearts.svg/1200px-Ace_of_hearts.svg.png",
    id: "as-heart"
  }
];

const CardSection = ({ room }) => {
  const [gameState, setGameState] = useState({
    room: "roomId",
    gameOver: false,
    gameStarted: false,
    turn: "Player 1", //id
    globalTimer: 60,
    player1Timer: 0,
    player2Timer: 0,
    player1Deck: _.shuffle(cards),
    player2Deck: _.shuffle(cards),
    player1points: 0,
    player2points: 0
  });

  const [roomFull, setRoomFull] = useState(false);

  const player1Cards = gameState.player1Deck.map((card, i) => {
    return <Card key={i} cardImg={card.img} val={card.id} />;
  });

  const player2Cards = gameState.player2Deck.map((card, i) => {
    return <Card key={i} cardImg={card.img} val={card.id} />;
  });

  useEffect(() => {
    const connectionOptions = {
      forceNew: true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
      transports: ["websocket"]
    };
    socket = io.connect(ENDPOINT, connectionOptions);

    if (room) {
      socket.emit("join", { room: room }, (error) => {
        if (error) setRoomFull(true);
      });
      socket.emit("initGameState", gameState);
    }

    //cleanup on component unmount
    // return function cleanup() {
    //   socket.emit("disconnect");
    //   //shut down connnection instance
    //   socket.off();
    // };
  }, [room]);

  
  useEffect(() => {
    return function cleanup() {
        socket.emit("disconnect");
        //shut down connnection instance
        socket.off();
      };
  }, []);

  useEffect(() => {
    socket.on("initGameState", (data) => {
      console.log(data);
      setGameState(data);
    });
  }, [room]);

  return (
    <Container>
      <CardSectionContainer>{player1Cards}</CardSectionContainer>
      <CardSectionContainer>{player2Cards}</CardSectionContainer>
    </Container>
  );
};

export default CardSection;
