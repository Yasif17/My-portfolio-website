import styled from "styled-components";
import Button1 from "./Button1";

const GitHubButton = styled(Button1)`
  button {
    background: transparent !important;
    border: 2px solid #23c483;
    color: #fff !important;
    padding: 8.2em 3.5em; /* your custom padding */
    box-shadow: none !important;
  }

  button:hover {
    background: #23c483 !important;
    color: #fff !important;
  }
`;

export default GitHubButton;