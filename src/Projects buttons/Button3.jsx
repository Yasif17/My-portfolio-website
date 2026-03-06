import React from "react";
import styled from "styled-components";

const Button3 = ({ children, variant = "primary", ...props }) => {
  return (
    <StyledWrapper $variant={variant}>
      <button {...props}>{children}</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    padding: 1.3em 3em;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-weight: 600;
    border-radius: 45px;
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;

    background-color: ${({ $variant }) =>
      $variant === "transparent" ? "transparent" : "#fff"};

    color: ${({ $variant }) =>
      $variant === "transparent" ? "#fff" : "#000"};

    border: ${({ $variant }) =>
      $variant === "transparent" ? "2px solid #23c483" : "none"};

    box-shadow: ${({ $variant }) =>
      $variant === "transparent"
        ? "none"
        : "0px 8px 15px rgba(0, 0, 0, 0.1)"};
  }

  button:hover {
    background-color: #23c483;
    box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
    color: #fff;
    transform: translateY(-7px);
  }

  button:active {
    transform: translateY(-1px);
  }
`;

export default Button3;