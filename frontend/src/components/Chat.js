import { useState } from "react";
import styled from "styled-components";

const ChatBoxWrapper = styled.div`
    .chat-box{
        position: absolute;
        bottom: 0px;
        background: white;
        width: 355px;
        border-radius: 5px 5px 0px 0px;
    z-index: 100;
    }
    .chat-box-player1{
    right: 20px;
    }
    .chat-box-player2{
    left: 20px;
    }
    .chat-head{
        width: inherit;
        height: 45px;
        background: #2c3e50;
        border-radius: 5px 5px 0px 0px;
    }
    .chat-head h2{
        color: white;
        padding-top: 5px;
        display: inline-block;
        margin: 0;
    }
    .chat-head span{
        cursor: pointer;
        float: right;
        width: 25px;
        margin: 10px;
    }
    .chat-body{
       
        height: 205px;
        width: inherit;
        overflow: hidden auto;
        margin-bottom: 45px;
    }
    .chat-text{
        position: fixed;
        bottom: 0px;
        height: 45px;
        width: inherit;
    }
    .chat-text input{
        width: inherit;
        height: inherit; 
        box-sizing: border-box;
        border: 1px solid #bdc3c7;
        padding: 10px;
        resize: none;
    outline: none;
    }
    .chat-text input:active, .chat-text input:focus, .chat-text input:hover{
        border-color: royalblue;
    }
    .msg-send{
        background: #406a4b;
    }
    .msg-receive{
        background: #595080;
    }
    .msg-send, .msg-receive{
        width: 285px;
        height: 35px;
        padding: 5px 5px 5px 10px;
        margin: 5px auto;
        border-radius: 3px;
        line-height: 30px;
        position: relative;
        color: white;
    }
    .msg-receive:before{
        content: '';
        width: 0px;
        height: 0px;
        position: absolute;
        border: 15px solid;
        border-color: transparent #595080 transparent transparent;
        left: -29px;
        top: 7px;
    }
    .msg-send:after{
        content: '';
        width: 0px;
        height: 0px;
        position: absolute;
        border: 15px solid;
        border-color: transparent transparent transparent #406a4b;
        right: -29px;
        top: 7px;
    }
    .msg-receive:hover, .msg-send:hover{
        opacity: .9;
    }
`;

const Chat = ({messages, sendMessage }) => {
  const [message, setMessage] = useState('');
  const [isChatBoxHidden, setChatBoxHidden] = useState(true);

  const toggleChatBox = () => {
    const chatBody = document.querySelector('.chat-body')
    if(isChatBoxHidden) {
        chatBody.style.display = 'block'
        setChatBoxHidden(false)
    }
    else {
        chatBody.style.display = 'none'
        setChatBoxHidden(true)
    }
  }
  const handleClickEnter = (event) => {
    event.preventDefault();
    if(message) {
       sendMessage(message, setMessage);
    }
  }

  return (
    <ChatBoxWrapper>
      <div className="chat-box chat-box-player1">
        <div className="chat-head">
          <h2>Chat Box</h2>
          {!isChatBoxHidden ? (
            <span onClick={toggleChatBox} className="material-icons">
              keyboard_arrow_down
            </span>
          ) : (
            <span onClick={toggleChatBox} className="material-icons">
              keyboard_arrow_up
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
