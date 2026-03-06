import React from "react";
import styled from "styled-components";

const Button4 = ({ children = "Architecture",onClick }) => {
  return (
    <StyledWrapper>
      <button
        className="btn-github"
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px) scale(1)";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "translateY(2px) scale(0.98)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
        }}
      >
        <span>{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .btn-github {
    cursor: pointer;
    display: flex;
    gap: 0.5rem;
    border: none;

    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    border-radius: 100px;
    font-weight: 800;
    place-content: center;

    padding: 1.3em 3em;
    font-size: 0.825rem;
    line-height: 1rem;

    background: linear-gradient(
      to bottom right,
      #2e8eff 0%,
      rgba(46, 142, 255, 0) 30%
    );
    background-color: rgba(46, 142, 255, 0.2);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.04),
      inset 0 0 0 1px rgba(255, 255, 255, 0.04);
    color: #fff;
  }

  .btn-github:hover {
    color: #fff;
    transform: translate(0, -0.25rem);
    background-color: rgba(46, 142, 255, 0.7);
    box-shadow: 0 0 10px rgba(46, 142, 255, 0.5);
    outline: none;
  }
`;

export default Button4;
