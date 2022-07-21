import React, { useState } from "react";

const TokenContext = React.createContext();
export default TokenContext;

// store jwt in conext provider in state -> aynsce later use

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  return (
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  );
};
