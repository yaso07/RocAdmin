import moment from "moment";

export function formatTimestamp(timestamp: Date): string {
  return moment(timestamp).format("MMMM D, YYYY");
}

export function formatDate(timestamp: Date): string {
  return moment(timestamp).format("YYYY-MM-DD");
}

export function formatTime(timestamp: Date): string {
  return moment(timestamp).format("LT");
}
