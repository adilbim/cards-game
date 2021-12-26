import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";
import _ from "lodash";
import Card from "./Card";
import Chat from './Chat';
const ENDPOINT = "http://localhost:8080";

const CardSectionContainer = styled.div`
  height: 300px;
  display: flex;
  justify-content: space-around;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  .cards-table {
    background-image: url(https://www.pngkey.com/png/full/929-9295997_88-colorfulness.png);
    background-repeat: no-repeat;
    background-position: center;
    backgroud-size: cover;
    min-width: 945px;
    margin: 0 auto;
    height: 464px;
  }
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

  const [roomFull, setRoomFull] = useState(false);
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
  const [messages, setMessages] = useState([]);
  const [canFlipCard, setCanFlipCard] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [selectedShowCards, setSelectedShowCards] = useState([]);
  const [player1Timer, setPlayer1Timer] = useState(30);
  const [player2Timer, setPlayer2Timer] = useState(30);
  const [turnTimer, setTurnTimer] = useState(5);
  const [winner, setWinner] = useState(null);

  const selectCard = (cardId) => {
    if (selectedCards.length >= 2) {
      return;
    } else {
      setSelectedCards([...selectedCards, cardId]);
      setSelectedShowCards([...selectedCards, cardId]);
    }
  };

  const sendMessage = (message, callback) => {
    socket.emit('sendMessage', { message: message }, () => {
      callback('');
      console.log('Send message');
    });
  }

  const player1Cards = player1Deck.map((card, i) => {
    return <Card disabled={turn !== currentUser?.name} canFlip={canFlipCard} selectCard={selectCard} isFliped={selectedShowCards[0] === card.id} key={i} cardImg={card.img} id={card.id} />;
  });

  const player2Cards = player2Deck.map((card, i) => {
    return <Card disabled={turn !== currentUser?.name} canFlip={!canFlipCard} selectCard={selectCard} isFliped={selectedShowCards[1] === card.id} key={i} cardImg={card.img} id={card.id} />;
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
      setUsers(data.users);
    });
    socket.on("currentUserData", function (data) {
      console.log("currentUserData", data, turn === data.name);
      setCurrentUser(data);
      setCanFlipCard('Player 1' === data.name);
    });
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);

      const chatBody = document.querySelector('.chat-body');
      chatBody.scrollTop = chatBody.scrollHeight;
    });
  }, [room]);

  useEffect(() => {
    socket.on('updateGameState', ({ turn, gameOver, player1Deck, player2Deck, selectedCards, player1points, player2points, selectedShowCards, player1Timer, player2Timer, turnTimer, seconds, winner }) => {
      console.log('updateGameState');
      turn && setTurn(turn);
      gameOver && setGameOver(gameOver);
      player1Deck && setPlayer1Deck(player1Deck);
      player2Deck && setPlayer2Deck(player2Deck);
      selectedCards && setSelectedCards(selectedCards);
      player1points && setPlayer1points(player1points);
      player2points && setPlayer2points(player2points);
      selectedShowCards && setSelectedShowCards(selectedShowCards);
      player1Timer && setPlayer1Timer(player1Timer);
      player2Timer && setPlayer2Timer(player2Timer);
      turnTimer && setTurnTimer(turnTimer);
      seconds && setSeconds(seconds);
      winner && setWinner(winner);
    });
  }, [room]);

  useEffect(() => {
    if(winner){
      socket.emit('updateGameState', {
        turn:"player 1",
        gameOver: false,
        player1Deck,
        player2Deck,
        selectedCards: [],
        player1points: 0,
        player2points: 0,
        selectedShowCards: [],
        player1Timer: 30,
        player2Timer: 30,
        turnTimer: 5,
        seconds: 1,
        winner: null,
      });
    }
},[winner])

  useEffect(async () => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    if (selectedCards.length === 0) {
      return
    } else if (selectedCards.length === 1) {
      setCanFlipCard(!canFlipCard);console.log('selcted card1', turn);

    } else if (selectedCards.length === 2) {
      //point logic calulations
      if (selectedCards[0] === selectedCards[1]) {console.log('match!');
        if (turn === 'Player 1') {
          setCanFlipCard(!canFlipCard);
          await delay(1000);
          socket.emit('updateGameState', {selectedCards: [], player1Deck: _.shuffle(cards), player2Deck: _.shuffle(cards), selectedShowCards: [], player1points: player1points + 2});
        } else {
          setCanFlipCard(!canFlipCard);
          await delay(1000);
          socket.emit('updateGameState', {selectedCards: [], player1Deck: _.shuffle(cards), player2Deck: _.shuffle(cards), selectedShowCards: [], player2points: player2points + 2});
        }
      } else {
        const newPlayerTurn = turn === 'Player 1' ? 'Player 2' : 'Player 1';
        console.log('not match new Player turn is', newPlayerTurn);
        if (turn === 'Player 1') {
          socket.emit('updateGameState', { player2Timer: player2Timer + 5 - turnTimer, player1Timer: player1Timer - turnTimer });
        }
        if (turn === 'Player 2') {
          socket.emit('updateGameState', { player1Timer: player1Timer + 5 - turnTimer, player2Timer: player2Timer - turnTimer });
        }
        await delay(1000);
        socket.emit('updateGameState', {turn: newPlayerTurn, selectedCards: [], selectedShowCards: [], player1Deck: _.shuffle(cards), player2Deck: _.shuffle(cards) });
      }
    }

  }, [selectedCards])

  useEffect(() => {
    if (gameOver && winner) {
      alert('The game is over the winer is ' + winner);
    }
  }, [gameOver, winner])

  useEffect(() => {
    if (player1points === 10) {
      socket.emit('updateGameState', {winner: 'Player 1', gameOver: true} );
    }
    if (player2points === 10) {
      socket.emit('updateGameState', {winner: 'Player 2', gameOver: true} );
    }
    if (player1Timer <= 1) {
      if (player1points > player2points) {
        socket.emit('updateGameState', { winner: 'Player 1', gameOver: true } );
      } else {
        socket.emit('updateGameState', { winner: 'Player 2', gameOver: true } );
      }
    }
    if (player2Timer <= 1) {
      if (player2points > player1points) {
        socket.emit('updateGameState', { winner: 'Player 2', gameOver: true } );
      } else {
        socket.emit('updateGameState', { winner: 'Player 1', gameOver: true } );
      }
    }
  }, [player1points, player2points, player1Timer, player2Timer]);

  useEffect(() => {
    if (gameStarted) {
      const myInterval = setInterval(() => {
        if (seconds > 0) {
          socket.emit('updateGameState', { seconds: seconds - 1 });
        }
        if (seconds === 1) {
          clearInterval(myInterval);
          setGameOver(true);
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    }
  });

  useEffect(() => {
    console.log(seconds);
    if (turn === 'Player 1') {
      socket.emit('updateGameState', { player1Timer: player1Timer - 1, turnTimer: turnTimer - 1 });
    }
    
    if (turn === 'Player 2') {
      socket.emit('updateGameState', { player2Timer: player2Timer - 1, turnTimer: turnTimer - 1 });
    }

    if (turnTimer === 1) {
      const newPlayerTurn = turn === 'Player 1' ? 'Player 2' : 'Player 1';
      socket.emit('updateGameState', { turn: newPlayerTurn });
      console.log('switch turn after turnTimer === 0', newPlayerTurn);
    }
  }, [seconds]);

  useEffect(() => {
    if (gameStarted && turn === 'Player 1') {
      if (player1Timer - 5 < 1) {
        socket.emit('updateGameState', { turnTimer: player1Timer });
      } else {
        socket.emit('updateGameState', { turnTimer: 5 });
      }
    } 
    if (gameStarted && turn === 'Player 2') {
      if (player2Timer - 5 < 1) {
        socket.emit('updateGameState', { turnTimer: player2Timer });
      } else {
        socket.emit('updateGameState', { turnTimer: 5 });
      }
    }
  }, [turn])

  useEffect(() => {
    if(selectedCards.length === 1) {
      socket.emit('updateGameState', { selectedCards:[],selectedShowCards:[], player1Deck: _.shuffle(cards), player2Deck: _.shuffle(cards) });
    }
  }, [turn]);

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
    if (turn) {
      setCanFlipCard(turn === currentUser?.name);
    }
  }, [turn, currentUser]);

  return (users.length === 2 && gameStarted & !gameOver ?
    <Container>
      <div className="card text-white bg-primary mb-3" >
        <div className="card-header">Room: {room}</div>
        <div className="card-body">
          <h5 className="card-title">{currentUser?.name}</h5>
          <h5 className="card-title">Points: {gameStarted && (currentUser?.name === 'Player 1' ? player1points : player2points) || 0}</h5>
          <h5 className="card-title">Time: {gameStarted && (currentUser?.name === 'Player 1' ? player1Timer : player2Timer) || 0}</h5>
          <h5 className="card-title">Turn Time: {gameStarted && turnTimer || 0}</h5>
          {users.length === 2 ? <div className={room && currentUser?.name === turn ? 'text-success spinner-grow' : 'text-danger spinner-grow' } role="status">
            <span className="sr-only">Loading...</span>
          </div> : ''}
        </div>
      </div>
      <div className="cards-table">
        <CardSectionContainer>{player2Cards}</CardSectionContainer>
        <CardSectionContainer>{player1Cards}</CardSectionContainer>
      </div>
      <Chat messages={messages} sendMessage={sendMessage} />
    </Container>
  : <>
    <div>
      <h1>{room && users.length === 1 && !winner ? `Room: ${room} Waiting for the second player to join the game...` : ''}</h1>
      <div>
        <h1>{winner ? `The winner is ${winner}` : ''}</h1>
        <div>
          { winner ?
            <button onClick={() =>  window.location.reload(false)}>New Game</button>
            : ''
          }
        </div>
      </div>
    </div>
  </>);
};

export default Game;
