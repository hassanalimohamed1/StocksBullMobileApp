  //Function that chagnes server message colour, depending on success or failure
  export default function messageColour(message) {
    if (
      message === "Please enter a valid email address or password." ||
      message ===
        "The email address entered is already connected to an account."
    ) {
      return "#8b0000";
    } else {
      return "#3e9c35";
    }
  }