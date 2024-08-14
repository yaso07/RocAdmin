import { FC } from "react";
import "../../App.css";
import styled from "styled-components";

interface InputProps {
  title: string;
  showCouter?: any;
  DescriptionTitle?: string;
  handleDescriptionTitle?: any;
  name?: string;
  error?: any;
  touch?: any;
  handleBlur?: any;
}

const InputBox: FC<InputProps> = ({
  title,
  showCouter, DescriptionTitle, handleDescriptionTitle, name, handleBlur, error, touch }) => {
  const maxLength = 50;


  return (
    <div className="App">
      <div className="input-container">
        <TitleText>{title}</TitleText>
        <input
          type="text"
          className="custom-input"
          value={DescriptionTitle}
          onChange={handleDescriptionTitle}
          onBlur={handleBlur}

          maxLength={maxLength}
          name={name}

        />
        {showCouter && (
          <div className="char-counter">
            {DescriptionTitle?.length} / {maxLength}
          </div>
        )}
        {touch ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : null}
      </div>
    </div>
  );
};

export default InputBox;

const TitleText = styled.p`
  display: block;
  line-height: 1;
  margin-bottom: 0.625rem;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
`;
