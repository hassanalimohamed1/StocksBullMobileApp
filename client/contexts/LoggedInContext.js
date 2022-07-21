import React, { useState } from "react";

const LoggedInContext = React.createContext();
export default LoggedInContext;

export const LoggedInProvider = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <LoggedInContext.Provider value={[state, setState]}>
      {children}
    </LoggedInContext.Provider>
  );
};
