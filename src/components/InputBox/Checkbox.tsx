import React, { FC } from "react";
import "./input.css"; // Import the CSS file for styling

interface InputProps {
  title: string;
  value: string;
  isChecked: boolean;
  onCheckboxChange: (value: string, checked: boolean) => void;
}

const checkBox: FC<InputProps> = ({ title, value, isChecked, onCheckboxChange }) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(value, event.target.checked);
  };

  return (
    <label className="custom-checkbox">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <span className="checkmark"></span>
      {title}
    </label>
  );
};

export default checkBox;
