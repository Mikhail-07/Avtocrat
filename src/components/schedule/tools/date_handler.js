export default function(date, days) {
  const extDate = new Date(date);

  if (days) extDate.setDate(extDate.getDate() + days);
  
  const d = ("0" + extDate.getDate()).slice(-2);
  const m = ("0" + (extDate.getMonth() + 1)).slice(-2);
  const y = extDate.getFullYear();
  return { d, m, y }
}