export default function pctColour(number) {
    if (number > 0) {
      return "#3e9c35";
    } else if (number < 0) {
      return "#8b0000";
    } else {
      return "black";
    }
  }