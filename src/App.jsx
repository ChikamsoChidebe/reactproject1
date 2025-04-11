import React, { useEffect, useState } from 'react';
import AnimalCard from './AnimalCard';
import ControlPanel from './ControlPanel';



export const getRandomHealthReduction = () => {
  return Math.random() * 20; // Random value between 0 and 20
};

export const getRandomHealthIncrease = () => {
  return 10 + Math.random() * 15; // Random value between 10 and 25
};

export const capHealth = (health) => {
  return Math.min(health, 100); // Cap health at 100%
};                                                      

const App = () => {
  // Initialize 15 animals (5 of each type)
  const initialAnimals = [
    ...Array(5).fill({
      name: "Monkey",
      species: "Monkey",
      health: 100,
      dead: false,
      image: "https://th.bing.com/th/id/OIP.pgL-sTqAtbdQoMhWXTlJJAHaHa?rs=1&pid=ImgDetMain",
    }),
    ...Array(5).fill({
      name: "Giraffe",
      species: "Giraffe",
      health: 100,
      dead: false,
      image: "https://th.bing.com/th/id/OIP.eAYvsQFvozagLMATqPk-tAHaIe?w=202&h=231&c=7&r=0&o=5&dpr=1.5&pid=1.7"
    }),
    ...Array(5).fill({
      name: "Elephant",
      species: "Elephant",
      health: 100,
      dead: false,
      image: "https://th.bing.com/th/id/R.801652fb42aa091cb903be09aa725d7d?rik=C6VBWhfiYL7zdw&pid=ImgRaw&r=0"
    }),
  ].map((animal, index) => ({
    ...animal,
    name: `${animal.species} ${index + 1}`, // Give each animal a unique name
  }));

  const [animals, setAnimals] = useState(initialAnimals);

  // Initialize custom zoo time (e.g., starting at 8:00 AM)
  const [zooTime, setZooTime] = useState(() => {
    const initialTime = new Date();
    initialTime.setHours(8, 0, 0, 0); // Set to 8:00:00 AM
    return initialTime;
  });

  const handleFeed = () => {
    const feedValues = {
      Monkey: Math.random() * (25 - 10) + 10,
      Giraffe: Math.random() * (25 - 10) + 10,
      Elephant: Math.random() * (25 - 10) + 10,
    };

    const updatedAnimals = animals.map((animal) => {
      if (animal.dead) return animal;
      const healthIncrease = (feedValues[animal.species] / 100) * animal.health;
      return {
        ...animal,
        health: Math.min(100, animal.health + healthIncrease),
      };
    });

    setAnimals(updatedAnimals);
  };

  const handleTimePass = () => {
    const updatedAnimals = animals.map((animal) => {
      if (animal.dead) return animal;
      const healthDecrease = Math.random() * 20;
      const newHealth = animal.health - healthDecrease;

      if (animal.species === "Elephant" && newHealth < 70) {
        return { ...animal, health: newHealth, dead: true };
      } else if (animal.species === "Monkey" && newHealth < 30) {
        return { ...animal, health: newHealth, dead: true };
      } else if (animal.species === "Giraffe" && newHealth < 50) {
        return { ...animal, health: newHealth, dead: true };
      }

      return { ...animal, health: newHealth };
    });

    setAnimals(updatedAnimals);

    // Subtract one hour from the zoo time
    setZooTime((prevTime) => {
      const newTime = new Date(prevTime);
      newTime.setHours(newTime.getHours() - 1);
      return newTime;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setZooTime((prevTime) => {
        const newTime = new Date(prevTime);
        newTime.setSeconds(newTime.getSeconds() + 1); // Increment zoo time by 1 second
        return newTime;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="zoo-simulator"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        padding: '1rem',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: '#FF5722',
          fontFamily: 'Georgia, serif',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        Zoo Simulator
      </h1>
      <ControlPanel onPassTime={handleTimePass} onFeed={handleFeed} currentTime={zooTime} />
      <div
        className="animal-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '1200px',
          marginTop: '2rem',
        }}
      >
        {animals.map((animal, index) => (
          <AnimalCard key={index} animal={animal} />
        ))}
      </div>
    </div>
  );
};

export default App;