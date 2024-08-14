import { FC } from "react";
import "./input.css";
import styled from "styled-components";

interface InputProps {
  title: string;
  description: string;
  maxLength?: any;
  letterValueShow?: boolean;
  value?: string;
  onchange?: any;
  name?: string;
}

const TextField: FC<InputProps> = ({
  title,
  description,
  maxLength,
  letterValueShow = true,
  value,
  onchange,
  name,
}) => {
  //   const maxLength = 250;

  return (
    <div className="App">
      <div className="textarea-container">
        <TitleText>{title}</TitleText>
        <p
          style={{
            fontSize: ".875em",
            color: "#757575",
            margin: "20px 0px",
          }}>
          {description}
        </p>
        <textarea
          className="custom-textarea"
          placeholder="Enter your text..."
          value={value}
          onChange={onchange}
          maxLength={maxLength}
          name={name}
          style={{ marginTop: 20 }}
        />
        {letterValueShow && (
          <div className="char-counterTextarea">
            {value?.length} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextField;

const TitleText = styled.p`
  display: block;
  line-height: 1;
  margin-bottom: 0.625rem;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
`;
