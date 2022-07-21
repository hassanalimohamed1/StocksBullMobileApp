export default function pctcolour(price) {
    if (price > 0) {
      return "#3e9c35";
    } else if (price < 0) {
      return "#8b0000";
    } else {
      return "black";
    }
  }
