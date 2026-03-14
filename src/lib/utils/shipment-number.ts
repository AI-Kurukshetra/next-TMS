function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function generateShipmentNumber(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `SHP-${year}${month}${day}-${hours}${minutes}${seconds}`;
}
