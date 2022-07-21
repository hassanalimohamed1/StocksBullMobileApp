  //Function that chagnes server message colour, depending on success or failure
  export function LoginMessageColour(message) {
    if (
      message ===
        "The email address or password you entered isn't connected to an account." ||
      message === "Please enter a valid email address or password."
    ) {
      return "#8b0000";
    } else {
      return "#3e9c35";
    }
  }