import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

function CountdownTimer({ initialInterval = 24 * 60 * 60 * 1000 }) { // Intervalo padrão de 24 horas
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + initialInterval)); // Define data-alvo com base no intervalo
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeDifference = targetDate - now;

      if (timeDifference > 0) {
        const hours = String(Math.floor((timeDifference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((timeDifference / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((timeDifference / 1000) % 60)).padStart(2, '0');

        setRemainingTime(`${hours}:${minutes}:${seconds}`); // Formato HH:MM:SS
      } else {
        setRemainingTime("00:00:00"); // Exibe 00:00:00 quando acaba
        clearInterval(interval); // Para o contador quando o tempo acaba
        restartCountdown(); // Reinicia o contador
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]); // Reexecuta quando a data-alvo muda

  const restartCountdown = () => {
    // Define uma nova data-alvo adicionando o intervalo inicial ao tempo atual
    setTargetDate(new Date(Date.now() + initialInterval));
  };

  return <Text>{remainingTime}</Text>;
}

export default CountdownTimer;
