import { ReactNode, useEffect } from "react";
import styled from "styled-components";

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  width: string;
  height: string;
  overflow?: boolean;
  toggle: () => void;
}

interface ButtonProps {
  comp?: ModalType;
}
const ModalOverlay = styled.div`
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 250px; */
`;

const ModalBox = styled.div<ButtonProps>`
  display: block;
  background: white;
  width: ${(props) => props?.comp?.width};
  height: ${(props) => props?.comp?.height};
  ::-webkit-scrollbar {
    display: none;
  }
  overflow: ${(props) => (props.comp?.overflow ? "auto" : "none")};
  /* padding: 1rem; */
  border-radius: 1rem;

  @media screen and (max-width: 875px) {
    width: 90%;
    /* height: fit-content; */
  }
`;
export default function Modal(props: ModalType) {
  return (
    <>
      {props.isOpen && (
        <ModalOverlay onClick={props.toggle}>
          <ModalBox comp={props} onClick={(e) => e.stopPropagation()}>
            {props.children}
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  );
}
