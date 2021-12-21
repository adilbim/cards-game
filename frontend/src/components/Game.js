import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";
import _ from "lodash";
import Card from "./Card";
const ENDPOINT = "http://localhost:8080";

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

const Game = ({ room }) => {
  // const [gameState, setGameState] = useState({
  //   room: "roomId",
  //   gameOver: false,
  //   gameStarted: false,
  //   turn: "Player 1", //id
  //   globalTimer: 60,
  //   player1Timer: 0,
  //   player2Timer: 0,
  //   player1Deck: _.shuffle(cards),
  //   player2Deck: _.shuffle(cards),
  //   player1points: 0,
  //   player2points: 0
  // });

  const [roomFull, setRoomFull] = useState(false);//To-Do
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null);

  //Game states
  const [gameStarted, setGameStarted] = useState(false);
  const [turn, setTurn] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [player1Deck, setPlayer1Deck] = useState(_.shuffle(cards));
  const [player2Deck, setPlayer2Deck] = useState(_.shuffle(cards));
  const [player1points, setPlayer1points] = useState(0);
  const [player2points, setPlayer2points] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [canFlipCard, setCanFlipCard] = useState(false);
  const [initiateFlip, setInitiateFlip] = useState(false);
  const [selectedShowCards, setSelectedShowCards] = useState([]);

  const selectCard = (cardId) => {
    if (selectedCards.length >= 2) {
      //alert('You cant select more than 2 cards!');
      return;
    } else {
      setSelectedCards([...selectedCards, cardId]);
      setSelectedShowCards([...selectedCards, cardId]);
    }
  };

  const shuffleCards = () => {
    setPlayer1Deck(_.shuffle(cards));
    setPlayer2Deck(_.shuffle(cards));
    //setInitiateFlip(true);
    //setInitiateFlip(false);
  }

  const player1Cards = player1Deck.map((card, i) => {
    return <Card disabled={turn !== currentUser?.name} canFlip={canFlipCard} selectCard={selectCard} isFliped={selectedShowCards[1] === card.id} key={i} cardImg={card.img} id={card.id} />;
  });

  const player2Cards = player2Deck.map((card, i) => {
    return <Card disabled={turn !== currentUser?.name} canFlip={!canFlipCard} selectCard={selectCard} isFliped={selectedShowCards[0] === card.id} key={i} cardImg={card.img} id={card.id} />;
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
      socket.emit("initGameState", {
        player1Deck,
        player2Deck
      });
    }

    //cleanup on component unmount
    // return function cleanup() {
    //   socket.emit("disconnect");
    //   //shut down connnection instance
    //   socket.off();
    // };
  }, [room]);

  useEffect(() => {
    if (roomFull) alert('The room is Full');
  }, [roomFull]);

  useEffect(() => {
    return function cleanup() {
        socket.emit("disconnect");
        //shut down connnection instance
        socket.off();
      };
  }, []);

  useEffect(() => {
    socket.on("initGameState", (data) => {
      console.log('game state', data);
      const { player1Deck, player2Deck } = data;
      setTurn('Player 1');
      setPlayer1Deck(player1Deck);
      setPlayer2Deck(player2Deck);
    });

    socket.on("roomData", function (data) {
      //console.log("roomData", data);
      setUsers(data.users);
    });
    socket.on("currentUserData", function (data) {
      //console.log("currentUserData", data);
      setCurrentUser(data);
      setCanFlipCard(turn === data.name);
    });
  }, [room]);

  useEffect(() => {
    socket.on('updateGameState', ({ turn, gameOver, player1Deck, player2Deck, selectedCards, player1points, player2points, selectedShowCards }) => {
      //console.log('updateGameState', turn, gameOver, player1Deck, player2Deck, selectedCards, player1points, player2points);
      console.log('updateGameState');
      turn && setTurn(turn);
      gameOver && setGameOver(gameOver);
      player1Deck && setPlayer1Deck(player1Deck);
      player2Deck && setPlayer2Deck(player2Deck);
      selectedCards && setSelectedCards(selectedCards);
      player1points && setPlayer1points(player1points);
      player2points && setPlayer1points(player2points);
      selectedShowCards && setSelectedShowCards(selectedShowCards);
    });
  }, [room]);

  useEffect(() => {
    const currentPlayer = currentUser?.name;
    if (selectedCards.length === 0) {
      return
    } else if (selectedCards.length === 1) {
      setCanFlipCard(!canFlipCard);console.log('selcted card1', turn);
      //socket.emit('updateGameState',{});
    } else if (selectedCards.length === 2) {
      //point logic calulations
      if (selectedCards[0] === selectedCards[1]) {console.log('match!');
        if (turn === 'Player 1') {
          //setPlayer1points(player1points + 2);
          //setTurn('Player 2');
          //setSelectedCards([]);
          //shuffleCards();
          socket.emit('updateGameState', {selectedCards: [], player1Deck, player2Deck, player1points: player1points + 2});
        } else {
          //setPlayer2points(player2points + 2);
          //setTurn('Player 1');
          //setSelectedCards([]);
          //shuffleCards();
          socket.emit('updateGameState', {selectedCards: [], player1Deck, player2Deck, player2points: player2points + 2});
        }
      } else {
        const newPlayerTurn = turn === 'Player 1' ? 'Player 2' : 'Player 1';
        console.log('not match new Player turn is', newPlayerTurn);
        //setTurn(newPlayerTurn);
        //setSelectedCards([]);
        //shuffleCards();
        socket.emit('updateGameState', {turn: newPlayerTurn, selectedCards: [], player1Deck, player2Deck });
      }
      
      //a delay to make stuff not quick
      // setCanFlipCard(!canFlipCard);
      // shuffleCards();
      //emit the stuff
      //socket.emit('updateGameState', {player1Deck, player2Deck});
    }

  }, [selectedCards])

  useEffect(() => {
    if (selectedCards.length === 0) return;
    socket.emit('updateGameState', { selectedShowCards });
  }, [selectedCards]);

  useEffect(() => {
    if (users.length === 2) {
      setGameStarted(true);
    }
  }, [users]);

  useEffect(() => {
    if (gameStarted && currentUser?.name === turn) {
      alert(`it's your turn ${currentUser.name}`);
    }
  }, [gameStarted]);

  return (
    <Container>
      <h1>{currentUser?.name}</h1>
      <CardSectionContainer>{player1Cards}</CardSectionContainer>
      <CardSectionContainer>{player2Cards}</CardSectionContainer>
    </Container>
  );
};

export default Game;
