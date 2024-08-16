import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./time.css"

interface InputProps {
  value?:any;
  onchange?:any;
  name?:string;
  today?: any;
}

const DateTimePicker: React.FC<InputProps> = ({value,onchange, today}) => {

  

  return (
    <div>
      <div>
        <DatePicker
          id="datePicker"
          selected={value}
          className='DateAndTimeInput'
          onChange={onchange}
          dateFormat="MMMM d, yyyy"
          minDate={today}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
