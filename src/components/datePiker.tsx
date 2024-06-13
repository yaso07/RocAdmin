import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';

interface DateTime {
  id: number;
  date: any;
  start_time: string;
  end_time: string;
}
interface DateTimeProps {
  dateTimes: any;
  setDateTimes: any;
  showDateTime: any;
  setShowDateTime: any;
}


const DateTimePicker: React.FC<DateTimeProps> = ({ dateTimes, setDateTimes, showDateTime, setShowDateTime }) => {

  const [idCounter, setIdCounter] = useState<any>(0);

  const addDateTime = (e: any) => {
    e.preventDefault()
    const newDateTime: DateTime = { id: idCounter, date: (new Date()), start_time: '10:00', end_time: '10:00' };
    setIdCounter(idCounter + 1);
    setDateTimes([...dateTimes, newDateTime]);
    setShowDateTime([...showDateTime, newDateTime]);
  };

  const updateDate = (id: number, date: Date) => {
    const updatedDateTimes = dateTimes.map((dt: any) => {
      if (dt.id === id) {
        return { ...dt, date };
      }
      return dt;
    });
    setDateTimes(updatedDateTimes);
    setShowDateTime(updatedDateTimes);
  };

  const updateTime = (id: number, time: any, name: string) => {
    const updatedDateTimes = dateTimes.map((dt: any) => {
      if (name === "start_time") {
        if (dt.id === id) {
          return { ...dt, start_time: time };
        } else {
          return dt;
        }
      } else {
        if (dt.id === id) {
          return { ...dt, end_time: time };
        } else {
          return dt;
        }
      }
    });
    setDateTimes(updatedDateTimes);
    setShowDateTime(updatedDateTimes);
  };

  const removeDateTime = (id: number) => {
    const filteredDateTimes = dateTimes.filter((dt: any) => dt.id !== id);
    setDateTimes(filteredDateTimes);
    setShowDateTime(filteredDateTimes);
  };

  

  return (
    <div className="w-full mx-auto mt-2">
      <h1 className="text-2xl font-bold mb-2">Select Event Dates and Times</h1>
      {showDateTime.map((dt: any, index: number) => (
        <div key={index} className="w-full mb-2 flex items-center">
          <div className="">
            <p className="">Event Date</p>
            <DatePicker
              selected={dt.date}
              onChange={(date: Date) => updateDate(dt.id, date)}
              dateFormat="yyyy/MM/dd"
              className="border p-2 w-full"
            />
          </div>
          <div className="">
            <p className="ml-4">Start time</p>
            <TimePicker
              value={dt.start_time}
              clockIcon={null}
              onChange={(time) => updateTime(dt.id, time, "start_time")}
              className="border p-2 ml-4"

            />
          </div>

          <div className="">
            <p className="ml-4">End time</p>
            <TimePicker
              value={dt.end_time}
              clockIcon={null}
              onChange={(time) => updateTime(dt.id, time, "end_time")}
              className="border p-2 ml-4"

            />
          </div>
          <button
            onClick={() => removeDateTime(dt.id)}
            className="bg-red-500 text-white p-2 rounded ml-4 w-1/6"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addDateTime}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Add Date and Time
      </button>
    </div>
  );
};

export default DateTimePicker;
