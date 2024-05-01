import React, { createContext, useState } from 'react';

// Criação do contexto global para o nome do time e emblema
const GlobalContext = createContext();

// Provedor do contexto global
export const GlobalProvider = ({ children }) => {
  const [teamName, setTeamName] = useState('');
  const [selectedEmblem, setSelectedEmblem] = useState(null);

  return (
    <GlobalContext.Provider value={{ teamName, setTeamName, selectedEmblem, setSelectedEmblem }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
