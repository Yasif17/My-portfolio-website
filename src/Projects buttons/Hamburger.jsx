import React from "react";
import styled from "styled-components";

const Hamburger = ({ open, setOpen }) => {
  return (
    <StyledWrapper>
      <div className="hamburger">
        <input
          className="checkbox"
          type="checkbox"
          checked={open}
          onChange={() => setOpen(!open)}
        />
        <svg fill="none" viewBox="0 0 50 50" height={42} width={42}>
          <path
            className="lineTop line"
            strokeLinecap="round"
            strokeWidth={4}
            stroke="white"
            d="M6 11L44 11"
          />
          <path
            strokeLinecap="round"
            strokeWidth={4}
            stroke="white"
            d="M6 24H43"
            className="lineMid line"
          />
          <path
            strokeLinecap="round"
            strokeWidth={4}
            stroke="white"
            d="M6 37H43"
            className="lineBottom line"
          />
        </svg>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .hamburger {
    height: 36px;
    width: 36px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hamburger .checkbox {
    position: absolute;
    opacity: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
    z-index: 5;
  }

  .line {
    transition: 0.5s ease;
    stroke-width: 6px;
  }

  .lineTop {
    stroke-dasharray: 40 40;
    stroke-dashoffset: 25;
  }

  .lineBottom {
    stroke-dasharray: 40 40;
    stroke-dashoffset: 60;
  }

  .lineMid {
    stroke-dasharray: 40 40;
  }

  .hamburger .checkbox:checked + svg .lineTop {
    stroke-dashoffset: 0;
    transform-origin: center;
    transform: rotate(45deg) translate(2px, -4px);
  }

  .hamburger .checkbox:checked + svg .lineMid {
    stroke-dashoffset: 40;
  }

  .hamburger .checkbox:checked + svg .lineBottom {
    stroke-dashoffset: 0;
    transform-origin: center;
    transform: rotate(-45deg) translate(2px, 4px);
  }
`;

export default Hamburger;