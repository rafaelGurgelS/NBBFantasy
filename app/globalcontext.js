import React, { createContext, useState } from 'react';

// Criação do contexto global para o username
const GlobalContext = createContext();

// Provedor do contexto global
export const GlobalProvider = ({ children }) => {
  const [userName, setuserName] = useState('');
  const [ip, setIP] = useState(' ');
  const [porta, setPorta] = useState(5000);
  const [senha, setSenha] = useState('');
  const [lineupComplete, setLineupComplete] = useState('');
  

  return (
    <GlobalContext.Provider value={{ userName,setuserName,ip, setIP, porta, setPorta, senha, setSenha, lineupComplete, setLineupComplete  }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
