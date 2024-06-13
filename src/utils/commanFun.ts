import moment from "moment";



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

  export const convertToDate = (dateStr: any) => {
      const year = dateStr.toString().substring(0, 4);
      const month = dateStr.toString().substring(4, 6);
      const day = dateStr.toString().substring(6, 8);
      const date = new Date(`${year}/${month}/${day}`);
      // const date = new Date(`${year}/${month}/${day}`);
      console.log("data", date)
      return date;
};

export const convertDate = ()=>{
  
}


  