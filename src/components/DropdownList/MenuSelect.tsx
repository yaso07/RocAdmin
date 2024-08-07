import { useState, FC } from "react";
import styled from "styled-components";
import DatePicker from "../DateAndTimePicker/DatePicker";
import TimePicker from "../DateAndTimePicker/TimePicker";
import Checkbox from "../InputBox/Checkbox";

interface InputProps {
  dateTimeComponents?: any;
  WeeklyDaysData?: any;
  selectedItems?: any;
  handleCheckboxChange?: any;
  setCustomTime: any;
  removeDateTimeComponent: any;
  setCustomEndTime: any;
  setSelectedDate: any;
  name?: string;
  addDate: any;
  dateState: any;
  setDateState: any;
  timeState: any;
  setTimeState: any;
  selectedOption: any;
  handleChange: any;
}

const MenuField: FC<InputProps> = ({
  dateState,
  setDateState,
  timeState,
  setTimeState,
  removeDateTimeComponent,
  addDate,
  dateTimeComponents,
  WeeklyDaysData,
  selectedItems,
  handleCheckboxChange,
  setCustomTime,
  setCustomEndTime,
  setSelectedDate,
  selectedOption,
  handleChange
}) => {
  // const [selectedOption, setSelectedOption] = useState("");

  // const handleChange = (event: any) => {
  //   setSelectedOption(event.target.value);
  // };

  const renderContent = () => {
    switch (selectedOption) {
      case "option1":
        return (
          <div>
            <TimeContainer>
              <div>
                <TitleText>Start Time</TitleText>
                <TitleTextMain>Leave blank for all-day events.</TitleTextMain>
                <TimePicker
                  value={timeState.startTimeDaily}
                  onChange={(time: any) => setTimeState("startTimeDaily")(time)}
                />
              </div>
              <div>
                <TitleText>End Time</TitleText>
                <TitleTextMain>Leave blank for all-day events.</TitleTextMain>
                <TimePicker
                  value={timeState.endTimeDaily}
                  onChange={(time: any) => setTimeState("endTimeDaily")(time)}
                />
              </div>
            </TimeContainer>
            <TimeContainer>
              <div>
                <TitleText>Start Date</TitleText>
                <DatePicker
                  value={dateState.startDateDaily}
                  onchange={(date: any) => setDateState("startDateDaily")(date)}
                />
              </div>
              <div>
                <TitleText>End Date</TitleText>
                <DatePicker
                  value={dateState.endDateDaily}
                  onchange={(date: any) => setDateState("endDateDaily")(date)}
                />
              </div>
            </TimeContainer>
            <GenerateButton>Generate</GenerateButton>
          </div>
        );
      case "option2":
        return (
          <div>
            <TitleText>On which days the week:</TitleText>
            <div>
              {WeeklyDaysData.map((item: any, index: any) => {
                return (
                  <div style={{ marginBottom: 10 }} key={index}>
                    <Checkbox
                      title={item.title}
                      value={item.value}
                      isChecked={selectedItems.WeekDays.some(
                        (items: any) => items.value === item.value
                      )}
                      onCheckboxChange={(value, checked) =>
                        handleCheckboxChange("WeekDays", value, checked)
                      }
                    />
                  </div>
                );
              })}
            </div>
            <TimeContainer>
              <div>
                <TitleText>Start Time</TitleText>
                <TitleTextMain>Leave blank for all-day events.</TitleTextMain>
                <TimePicker
                  value={timeState.startTimeWeekly}
                  onChange={(time: any) =>
                    setTimeState("startTimeWeekly")(time)
                  }
                />
              </div>
              <div>
                <TitleText>End Time</TitleText>
                <TitleTextMain>Leave blank for all-day events.</TitleTextMain>
                <TimePicker
                  value={timeState.endTimeWeekly}
                  onChange={(time: any) => setTimeState("endTimeWeekly")(time)}
                />
              </div>
            </TimeContainer>
            <TimeContainer>
              <div>
                <TitleText>Start Date</TitleText>
                <DatePicker
                  value={dateState.startDateWeekly}
                  onchange={(date: any) =>
                    setDateState("startDateWeekly")(date)
                  }
                />
              </div>
              <div>
                <TitleText>End Date</TitleText>
                <DatePicker
                  value={dateState.endDateWeekly}
                  onchange={(date: any) => setDateState("endDateWeekly")(date)}
                />
              </div>
            </TimeContainer>
            <GenerateButton>Generate</GenerateButton>
          </div>
        );
      case "option3":
        return (
          <div>
            <TitleText>On which days the week:</TitleText>
            <div>
            {WeeklyDaysData.map((item: any, index: any) => {
                return (
                  <div style={{ marginBottom: 10 }} key={index}>
                    <Checkbox
                      title={item.title}
                      value={item.value}
                      isChecked={selectedItems.MonthDays.some(
                        (items: any) => items.value === item.value
                      )}
                      onCheckboxChange={(value, checked) =>
                        handleCheckboxChange("MonthDays", value, checked)
                      }
                    />
                  </div>
                );
              })}
            </div>
            <TimeContainer>
              <div>
                <TitleText>Start Time</TitleText>
                <TitleTextMain>Leave blank for all-day events.</TitleTextMain>
                <TimePicker
                  value={timeState.startTimeMonth}
                  onChange={(time: any) => setTimeState("startTimeMonth")(time)}
                />
              </div>
              <div>
                <TitleText>End Time</TitleText>
                <TitleTextMain>Leave blank for all-day events.</TitleTextMain>
                <TimePicker
                  value={timeState.endTimeMonth}
                  onChange={(time: any) => setTimeState("endTimeMonth")(time)}
                />
              </div>
            </TimeContainer>
            <TimeContainer>
              <div>
                <TitleText>Start Date</TitleText>
                <DatePicker
                  value={dateState.startDateMonth}
                  onchange={(date: any) => setDateState("startDateMonth")(date)}
                />
              </div>
              <div>
                <TitleText>End Date</TitleText>
                <DatePicker
                  value={dateState.endDateMonth}
                  onchange={(date: any) => setDateState("endDateMonth")(date)}
                />
              </div>
            </TimeContainer>
            <GenerateButton>Generate</GenerateButton>
          </div>
        );
      case "option4":
        return (
          <div>
            <TitleText>Dates & Times</TitleText>
            <CustomDate>
              {dateTimeComponents.map((component: any, index: any) => (
                <CustomContainer key={index}>
                  <DatePicker
                    value={component.selectedDate}
                    onchange={(date: any) => setSelectedDate(index, date)}
                  />
                  <CustomTimeWraaper>
                    <TimePicker
                      value={component.customStartTime}
                      onChange={(time) => setCustomTime(index, time)}
                    />
                    to
                    <TimePicker
                      value={component.customEndTime}
                      onChange={(time) => setCustomEndTime(index, time)}
                    />
                    <button onClick={()=>removeDateTimeComponent(index)}>(X)</button>
                  </CustomTimeWraaper>
                </CustomContainer>
              ))}
            </CustomDate>

            <div style={{ textAlign: "end", marginTop: 20 }}>
              <GenerateButton onClick={addDate}>Add A Date</GenerateButton>
            </div>
          </div>
        );
      default:
        return "";
    }
  };

  return (
    <div className="App">
      <Select value={selectedOption} onChange={handleChange}>
        <option value="">Please select</option>
        <option value="option1">Daily</option>
        <option value="option2">Weekly</option>
        <option value="option3">Monthly</option>
        <option value="option4">Custom</option>
      </Select>
      <div>{renderContent()}</div>
    </div>
  );
};

export default MenuField;

const Select = styled.select`
  width: 100%;
  padding: 0.625rem;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  border-width: 1px;
  color: var(--grey-dark);
  border-color: #ccc;
  border-radius: 2px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAxNCI+PHBvbHlsaW5lIHBvaW50cz0iNCA2IDcgOSAxMCA2IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMDAwO3N0cm9rZS13aWR0aDowLjVweDsiIC8+PC9zdmc+")
    no-repeat right 10px center;
  background-size: 28px;
  /* padding-right: 35px; */
  accent-color: var(--brand-primary);
`;

const TimeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  margin-top: 20px;
`;

const TitleText = styled.p`
  display: block;
  line-height: 1;
  margin-bottom: 0.625rem;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
`;

const TitleTextMain = styled.p`
  font-size: 0.875rem;
  color: #757575;
  margin-bottom: 20px;
`;

const GenerateButton = styled.p`
  display: inline-block;
  border-width: 2px;
  border-color: #4965a7;
  width: auto;
  padding: 1rem 1.5rem;
  background-color: #4965a7;
  font-size: 0.875rem;
  color: #fff;
  font-weight: 700;
  line-height: 1;
  border-radius: 2px;
  cursor: pointer;
  border-style: solid;
  white-space: nowrap;
  transition: all 0.3s ease;
  margin-top: 20px;
`;

const CustomDate = styled.div`
  border: 1px solid #ccc;
  padding: 1.25rem 0.5rem !important;
  gap: 14px;
  overflow: scroll;
  resize: vertical;
  height: 400px;
  min-height: 400px;
`;

const CustomContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  margin-bottom: 20px;
`;

const CustomTimeWraaper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
