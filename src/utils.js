// Utility functions for Echo Brain

export function scrollToBottom(ref) {
  ref.current?.scrollIntoView({ behavior: "smooth" });
}

export function formatTime(date) {
  if (!date) return "";
  if (typeof date === "object" && date.toDate) {
    date = date.toDate();
  }
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
