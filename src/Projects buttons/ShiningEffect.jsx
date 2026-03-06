import styled, { keyframes } from "styled-components";

const shine = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const ShinySpan = styled.span`
  font-weight: 600;
  font-size: 1.1rem;

  background: linear-gradient(
    110deg,
    #ffffff 0%,
    #ffffff 40%,
    #ff1e1e 50%,
    #ffffff 60%,
    #ffffff 100%
  );

  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  animation: ${shine} 3s linear infinite;

  /* subtle glow */
  text-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
`;

export default ShinySpan;
