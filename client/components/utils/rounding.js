export default function rounding (number) {
    if (number === NaN) {
        return "-";
    }
    if (number != "None") {
        return parseFloat(number).toFixed(2);
    } else {
        return "-";
    }
}