import { HTMLAttributes } from "react";

interface props extends HTMLAttributes<HTMLInputElement>{

    label:string,
    name:string,
    type:string,
    defaultValue?:string,

}

const FormInput = ({ label, name, type, defaultValue,...rest}:props) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className={`w-full p-2 block ${rest.className}`}
        required
      />
    </div>
  );
};
export default FormInput;
