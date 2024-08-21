import React, { createContext, useState } from 'react';

// Criação do contexto global para o username
const GlobalContext = createContext();

// Provedor do contexto global
export const GlobalProvider = ({ children }) => {
  const [userName, setuserName] = useState('');
  

  return (
    <GlobalContext.Provider value={{ userName,setuserName }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
