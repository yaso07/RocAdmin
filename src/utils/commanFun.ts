import moment from "moment";

import fallback from '../assets/fallbackimage.png'
import { opnintHoursData } from "./data";

export const fallbackImage = fallback

export function formatDate(timestamp: Date): string {
  return moment(timestamp).format("DD");
}
export function formatFullDate(timestamp: Date): string {
  return moment(timestamp).format("Do MMMM YYYY");
}

export function formatCalenderTime(timestamp: Date): string {
  return moment(timestamp).format("DD/MM/YYYY");
}

export function formatDay(timestamp: Date): string {
  return moment(timestamp).format("dddd");
}

export function formatMonth(timestamp: Date): string {
  return moment(timestamp).format("MMM");
}

export function formatTime(timestamp: Date): string {
  return moment(timestamp).format("LT");
}

export const skeletonItems = new Array(10).fill(null);

export const sideWidth = "480px";

export const categoryCreationDate = () => {
  const date = new Date();
  const day = date.getDate(); // Gets the day as a number (1-31)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()]; // Gets the month name
  const year = date.getFullYear().toString().slice(2); // Gets the last two digits of the year

  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
};





export function convertTo12HourTime(time24Hour: any) {
  // Extract hours and minutes from the 24-hour time string
  if (time24Hour) {
    const hours24 = parseInt(time24Hour.substring(0, 2));
    const minutes = time24Hour.substring(2);

    // Convert to 12-hour format
    let hours12 = hours24 % 12 || 12; // Convert 0 or 24 to 12
    const period = hours24 < 12 ? 'AM' : 'PM';

    // Format the time as HH:MM AM/PM
    const formattedTime = `${hours12}:${minutes} ${period}`;

    return formattedTime;
  }
}

export function isOpen(periods: any) {
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split('T')[0]; // Extracting current date in yyyy-mm-dd format
  const currentTime: any = currentDate.getHours() * 100 + currentDate.getMinutes(); // Extracting current time in HHMM format

  for (const period of periods) {
    if (period.open.date === currentDateString) {
      if (parseInt(currentTime) >= parseInt(period.open.time)) {
        return `Open: ${convertTo12HourTime(period.open.time)} to ${convertTo12HourTime(period.close.time)}`;
      } else {
        return `Close: Opens at ${convertTo12HourTime(period.open.time)}`;
      }
    }
  }
  return "Close";
}


// WE NOT USE THIS IN CODE 
export const convertToDate = (dateStr: any) => {
  const year = dateStr.toString().substring(0, 4);
  const month = dateStr.toString().substring(4, 6);
  const day = dateStr.toString().substring(6, 8);
  const date = new Date(`${year}/${month}/${day}`);
  // const date = new Date(`${year}/${month}/${day}`);
  return date;
};


export const getImgeUrl = (arr: any) => {
  if (arr) {
    const imgArray = arr !== undefined ? JSON.parse(arr) : [{ url: fallback }];
    return imgArray[0].url
  }
  else {
    return ""
  }

}


export function updateOpenHours(newObj: any) {
  let count = 0
  for (const day in opnintHoursData) {
    if (newObj.hasOwnProperty(day)) {
      opnintHoursData[day] = { ...opnintHoursData[day], ...newObj[day] }
    } else {
      // Reset other days to default values
      opnintHoursData[day] = { closes: '', opens: '', is_open: "0" };
    }
    if (opnintHoursData[day].is_open === "0") count += 1
  }
  return count === 7 ? {} : opnintHoursData;
}


export const checkEndData = (start: any, curr: any, setDateState: any, dateState: any) => {
  if (curr === "startDateDaily") {
    if (moment(start).isAfter(dateState?.endDateDaily)) {
      setDateState((prevState: any) => ({
        ...prevState,
        endDateDaily: start, startDateDaily: start
      }));
    } else {
      setDateState((prevState: any) => ({
        ...prevState,
        [curr]: start
      }));
    }

  } else if (curr === "startDateWeekly") {
    if (moment(start).isAfter(dateState?.endDateWeekly)) {
      setDateState((prevState: any) => ({
        ...prevState,
        endDateWeekly: start, startDateWeekly: start
      }));
    } else {
      setDateState((prevState: any) => ({
        ...prevState,
        [curr]: start
      }));
    }
  } else if (curr === "startDateMonth") {
    if (moment(start).isAfter(dateState?.endDateWeekly)) {
      setDateState((prevState: any) => ({
        ...prevState,
        endDateWeekly: start, startDateMonth: start
      }));
    } else {
      setDateState((prevState: any) => ({
        ...prevState,
        [curr]: start
      }));
    }
  } else {
    setDateState((prevState: any) => ({
      ...prevState,
      [curr]: start
    }));
  }
}


export const eventDateValidation = (selectOption: any, DateData: any, setIsDateValid: any, date?: any, time?: any) => {

  if (selectOption === "option4") {

    if (DateData) {
      setIsDateValid(false)
    } else {
      setIsDateValid(true)
    }
  } else if (selectOption === "option3") {
    if (DateData.length && date?.startDateMonth && date?.endDateMonth && time?.startTimeMonth && time?.endTimeMonth) {

      setIsDateValid(false)
    } else {
      setIsDateValid(true)
    }
  } else if (selectOption === "option2") {
    if (DateData.length && date?.startDateWeekly && date?.endDateWeekly && time?.startTimeWeekly && time?.endTimeWeekly) {

      setIsDateValid(false)
    } else {
      setIsDateValid(true)
    }
  } else if (selectOption === "option1") {
    if (DateData?.startDateDaily && DateData?.endDateDaily && date?.startTimeDaily && date?.endTimeDaily) {
      setIsDateValid(false)
    } else {
      setIsDateValid(true)
    }
  } else {
    setIsDateValid(true)
  }
}


export const checkFields = (dataArray: any[]) => {
  const emptyFields: any[] = [];

  dataArray.forEach((item, index) => {
    const fieldsToCheck = ['title', 'short_description', 'types', 'header_image_url'];

    fieldsToCheck.forEach(field => {
      // Check if the field is empty or undefined
      if (!item[field] || (Array.isArray(item[field]) && item[field].length === 0)) {
        emptyFields.push(`Row ${index + 1}: '${field}' is required`);
      }
    });
  });


  return { result: emptyFields.length ? false : true, error: emptyFields.length > 0 ? emptyFields : ["All required fields are filled."] };
};

export const getInitials = (fullName: string | any) => {
  // Split the name into words
  if (!fullName) return "";
  const words = fullName.split(' ');

  // Take the first letter of each word, limiting to 2 words
  const initials = words.slice(0, 2).map((word: any) => word.charAt(0).toUpperCase()).join('');

  return initials;
};



// const arr = [
//   "Monday: Closed",
//   "Tuesday: 6:00 PM – 8:00 PM",
//   "Wednesday: 6:00 PM – 8:00 PM",
//   "Thursday: Closed",
//   "Friday: Closed",
//   "Saturday: Closed",
//   "Sunday: Closed"
// ];

export function convertHours(arr: any[]) {
  const openingHours: any = {};

  arr.forEach(entry => {
    const [day, hours] = entry.split(': ').map((str: any) => str.trim());
    const dayEntry = {
      closes: "",
      opens: "",
      is_open: "0"
    };

    if (hours !== "Closed") {
      const [openTime, closeTime] = hours.split('–').map((str: any) => str.trim());
      dayEntry.opens = convertTo24HourFormat(openTime);
      dayEntry.closes = convertTo24HourFormat(closeTime);
      dayEntry.is_open = "1";
    }

    openingHours[day] = dayEntry;
  });

  return openingHours;
}

function convertTo24HourFormat(time: any) {
  const [timePart, modifier] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// const result = convertHours(arr);
// console.log(result);

