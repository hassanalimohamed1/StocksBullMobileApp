import React, { useState } from "react";

const EmailContext = React.createContext();
export default EmailContext;

export const EmailProvider = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <EmailContext.Provider value={[state, setState]}>
      {children}
    </EmailContext.Provider>
  );
};
