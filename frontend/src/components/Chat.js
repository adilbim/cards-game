import { useState } from "react";
import styled from "styled-components";

const ChatBoxWrapper = styled.div`
  .chat-box {
    position: absolute;
    bottom: 0px;
    background: white;
    width: 355px;
    border-radius: 5px 5px 0px 0px;
    z-index: 100;
  }
  .chat-box-player1 {
    right: 20px;
  }
  .chat-box-player2 {
    left: 20px;
  }
  .chat-head {
    width: inherit;
    height: 45px;
    background: #2c3e50;
    border-radius: 5px 5px 0px 0px;
  }
  .chat-head h3 {
    color: white;
    padding-top: 5px;
    display: inline-block;
    margin: 0 5px;
  }
  .chat-head span {
    cursor: pointer;
    float: right;
    width: 25px;
    margin: 10px;
  }
  .chat-body {
    display: none;
    height: 205px;
    width: inherit;
    overflow: hidden auto;
    margin-bottom: 45px;
  }
  .chat-text {
    position: fixed;
    bottom: 0px;
    height: 45px;
    width: inherit;
  }
  .chat-text input {
    width: inherit;
    height: inherit;
    box-sizing: border-box;
    border: 1px solid #bdc3c7;
    padding: 10px;
    resize: none;
    outline: none;
  }
  .chat-text input:active,
  .chat-text input:focus,
  .chat-text input:hover {
    border-color: royalblue;
  }
  .msg-send {
    background: #406a4b;
  }
  .msg-receive {
    background: #595080;
  }
  .msg-send,
  .msg-receive {
    width: 285px;
    height: 35px;
    padding: 5px 5px 5px 10px;
    margin: 5px auto;
    border-radius: 3px;
    line-height: 30px;
    position: relative;
    color: white;
  }
  .msg-receive:before {
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    border: 15px solid;
    border-color: transparent #595080 transparent transparent;
    left: -29px;
    top: 7px;
  }
  .msg-send:after {
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    border: 15px solid;
    border-color: transparent transparent transparent #406a4b;
    right: -29px;
    top: 7px;
  }
  .msg-receive:hover,
  .msg-send:hover {
    opacity: 0.9;
  }
`;

const Chat = ({ messages, sendMessage }) => {
  const [message, setMessage] = useState("");
  const [isChatBoxHidden, setChatBoxHidden] = useState(true);

  const toggleChatBox = () => {
    const chatBody = document.querySelector(".chat-body");
    setChatBoxHidden(!isChatBoxHidden);
    if (isChatBoxHidden) {
      chatBody.style.display = "block";
    } else {
      chatBody.style.display = "none";
    }
  };
  const handleClickEnter = (event) => {
    event.preventDefault();
    if (message) {
      sendMessage(message, setMessage);
    }
  };

  return (
    <ChatBoxWrapper>
      <div className="chat-box chat-box-player1">
        <div className="chat-head">
          <h3>Chat Box</h3>
          {isChatBoxHidden ? (
            <span onClick={toggleChatBox} className="material-icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#fff"
                className="bi bi-chevron-up"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                />
              </svg>
            </span>
          ) : (
            <span onClick={toggleChatBox} className="material-icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#fff"
                className="bi bi-chevron-down"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </span>
          )}
        </div>
        <div className="chat-body">
          <div className="msg-insert">
            {messages.map((msg) => {
              if (msg.user === "Player 2")
                return <div className="msg-receive">{msg.text}</div>;
              if (msg.user === "Player 1")
                return <div className="msg-send">{msg.text}</div>;
            })}
          </div>
          <div className="chat-text">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyPress={(event) =>
                event.key === "Enter" && handleClickEnter(event)
              }
            />
          </div>
        </div>
      </div>
    </ChatBoxWrapper>
  );
};

export default Chat;
