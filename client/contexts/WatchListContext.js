import React, { useState} from "react";

const WatchListContext = React.createContext();
export default WatchListContext;


export const WatchListProvider = ({ children }) => {
    const [state, setState] = useState([]);
  
    return (
      <WatchListContext.Provider value={[state, setState]}>
        {children}
      </WatchListContext.Provider>
    );
  };