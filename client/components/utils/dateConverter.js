export default function dateConverter(days) {
    const date = new Date()
    let newDate = date.setDate(date.getDate() - days);
    let change = new Date(newDate);
    return String(change.toISOString().split("T")[0]);
  }