import { HTMLAttributes } from "react";

interface props extends HTMLAttributes<HTMLInputElement> {

  label: string,
  name: string,
  type: string,
  value?: string,
  error?: any,
  touch?: any,
  handleChange?: any,
  handleBlur?: any,
  helperText?: any,

}

const EventField = ({ label, name, type, value, handleChange, className, handleBlur, error, touch }: props) => {

  return (
    <div className="w-[45%]">
      <label htmlFor={name} className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full p-2 block ${className}`}
        required
      />
        {touch ? (
          <div style={{color:'red'}}>{error}</div>
        ) : null}
    </div>
  );
};
export default EventField;
