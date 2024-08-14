import { useState, FC } from "react";
import fallbackimage from "../../assets/fallbackimage.png";

interface InputProps {
  value?: string;
  onchange?: any;
  name?: string;
}

const SearchInput: FC<InputProps> = ({ value, onchange, name }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      style={{
        ...styles.container,
        borderColor: isFocused ? "#4965a7" : "#ccc",
        marginTop: 20,
        // Change border color on focus
      }}>
      <img src={fallbackimage} style={styles.icon} alt="" />
      <input
        type="text"
        value={value}
        onChange={onchange}
        name={name}
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "5px 10px",
    transition: "border-color 0.3s", // Smooth transition for border color
    width: "100%",
  },
  icon: {
    marginRight: "10px",
    color: "#888",
    width: "20px",
    height: "20px",
  },
  input: {
    border: "none",
    outline: "none",
    width: "100%",
  },
};

export default SearchInput;
