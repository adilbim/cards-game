import React, { useEffect, useState } from "react";
import styled from "styled-components";
//import { useSelector } from "react-redux";
const CardContainer = styled.div`
  height: 150px;
  width: 100px;
  .imgContainer {
    width: 100%;
    height: 100%;
  }
`;

const Card = ({ cardImg, id, selectCard, canFlip, disabled, isFliped }) => {
  //const [isFliped, setIsFliped] = useState(false);
  // const state = useSelector((state) => state);
  // console.log(state);
  const cardBack =
    "https://media.istockphoto.com/photos/bicycle-rider-back-playing-card-design-picture-id157772536?k=20&m=157772536&s=170667a&w=0&h=46bM0a2wuwcddiOzNOHTfS9PcUzjXwNTTCy33SrkC_0=";

  // const handleFlip = () => {
  //   setIsFliped(!isFliped);
  // };

  const handleClick = () => {
    if (disabled) return;
    if (!canFlip || isFliped) return;
    // handleFlip();
    selectCard(id);
  }

  // useEffect(() => {
  //   if (initiateFlip) {
  //     setIsFliped(false);
  //   }
  // }, [initiateFlip])

  let card = isFliped ? (
    <img alt="" src={cardImg} className="imgContainer" />
  ) : (
    <img alt="" src={cardBack} className="imgContainer" />
  );

  return <CardContainer onClick={handleClick}>{card}</CardContainer>;
};

export default Card;
