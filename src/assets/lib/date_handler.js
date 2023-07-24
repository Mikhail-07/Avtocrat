export default function(day, month, year) {
  const date = new Date (year, month, day);
  const d = ("0" + date.getDate()).slice(-2);
  const m = ("0" + date.getMonth()).slice(-2);
  const y = year;
  return {d, m, y}
}