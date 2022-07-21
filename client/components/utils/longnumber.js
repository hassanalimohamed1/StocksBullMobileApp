export default function longnumber(number) {
    let a = String(number);
    //For erros
    if (a === NaN) {
      //If error occurs
      return "-";
    } else if (a.length == 7 || a.length < 10) {
      return String((Number(number) / 1000000).toFixed(2) + "M");
    } else if (a.length >= 10) {
      return String((Number(number) / 1000000000).toFixed(2) + "B");
    } else {
      return String((Number(number) / 1000).toFixed(2) + "K");
    }
  }