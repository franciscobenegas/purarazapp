export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(date));
}
