import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "./time.css";

interface TimePickerProps {
  onChange: (time: string) => void;
  value?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ onChange, value = "" }) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(value || "00:00");
  const timePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedTime(value || "00:00");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [timePickerRef]);

  const hours = [...Array(24).keys()].map((n) => n.toString().padStart(2, "0"));
  const minutes = [...Array(60).keys()].map((n) => n.toString().padStart(2, "0"));

  const handleTimeSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    let [hour, minute] = selectedTime.split(":");

    if (name === "hour") {
      hour = value;
    } else if (name === "minute") {
      minute = value;
    }

    const newTime = `${hour}:${minute}`;
    setSelectedTime(newTime);
    onChange(newTime);
  };

  const handleNowTime = () => {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const nowTime = `${hour}:${minute}`;
    setSelectedTime(nowTime);
    onChange(nowTime);
    setShowTimePicker(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div ref={timePickerRef}>
      <input
        type="text"
        value={selectedTime}
        onFocus={() => setShowTimePicker(true)}
        onChange={handleInputChange}
        className="DateAndTimeInput"
      />
      {showTimePicker && (
        <div className="time-picker">
          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              fontWeight: "500",
              marginBottom: 20,
            }}
          >
            Choose Time
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: 14 }}>Time</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div className="time-picker-section">
                <Select
                  name="hour"
                  value={selectedTime.split(":")[0]}
                  onChange={handleTimeSelection}
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </Select>
              </div>
              :
              <div className="time-picker-section">
                <Select
                  name="minute"
                  value={selectedTime.split(":")[1]}
                  onChange={handleTimeSelection}
                >
                  {minutes.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="time-picker-buttons">
            <button onClick={handleNowTime}>Now</button>
            <button style={{ color: "black" }} onClick={() => setShowTimePicker(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;

const Select = styled.select`
  width: 100%;
  padding: 0.625rem;
  border-width: 1px;
  border: 1px solid #f0f0f0;
  background: #f9f9f9;
  font-weight: normal;
  color: #444;
  border-radius: 2px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  accent-color: var(--brand-primary);
`;
