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

export function formatDateSingle(date: Date | string) {
  if (!date) return "";
  const fecha = new Date(date);
  const day = fecha.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const month = monthNames[fecha.getMonth()];
  const year = fecha.getFullYear();
  return `${day}-${month}-${year}`;
}
