import React, { useEffect, useState } from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  height: 150px;

  width: 100px;

  .card {
    margin-top: 1rem;
    width: 100%;
    position: relative;
  }

  .cardFront,
  .cardBack {
    border-radius: 0.25rem;

    padding-left: 0.5rem;
    padding-right: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    position: absolute;
    backface-visibility: hidden;
    transition: transform 0.5s ease;
  }

  .cardBack {
    transform: perspective(600px) rotateY(180deg);
    background-color: #ebf4ff;
  }

  .cardBack.flipped {
    transform: perspective(600px) rotateY(0deg);
  }

  .cardFront {
    transform: perspective(600px) rotateY(0deg);
  }

  .cardFront.flipped {
    transform: perspective(600px) rotateY(-180deg);
  }

  .imgContainer {
    width: 100%;
    height: 100%;
    margin: 5px 0;
  }
`;

const Card = ({ cardImg, id, selectCard, canFlip, disabled, isFliped }) => {

  const cardBack =
    "https://media.istockphoto.com/photos/bicycle-rider-back-playing-card-design-picture-id157772536?k=20&m=157772536&s=170667a&w=0&h=46bM0a2wuwcddiOzNOHTfS9PcUzjXwNTTCy33SrkC_0=";

  const handleClick = () => {
    if (disabled) return;
    if (!canFlip || isFliped) return;
    selectCard(id);
  };

  return (
    <CardContainer>
      <div className="card" onClick={handleClick}>
        <div id="back" className={!isFliped ? "cardBack flipped" : "cardBack"}>
          <img alt="" src={cardBack} className="imgContainer " />
        </div>
        <div
          id="front"
          className={!isFliped ? " cardFront flipped" : "cardFront"}
        >
          {" "}
          <img alt="" src={cardImg} className="imgContainer" />
        </div>
      </div>
    </CardContainer>
  );
};

export default Card;
