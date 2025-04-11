// App.js
import React, { useEffect, useState } from 'react';
import AnimalCard from './AnimalCard';
import ControlPanel from './ControlPanel';

const App = () => {
  const [animals, setAnimals] = useState([
    { name: "George", species: "Monkey", health: 100},
    { name: "Gina", species: "Giraffe", health: 100 },
    { name: "Ella", species: "Elephant", health: 100 },
  ]);

  const handleFeed = (index) => {
    // Update animal's health
    const updatedAnimals = [...animals];
    updatedAnimals[index].health += 10;
    setAnimals(updatedAnimals);
  };

  const handleTimePass = () => {
    // Decrease health over time
    const updatedAnimals = animals.map(animal => ({
      ...animal,
      health: animal.health - 5 
    }));
    setAnimals(updatedAnimals);
  };

  let [boy, setBoy] = useState(new Date)
  
     useEffect(()=>{
      setInterval(() => {

        setBoy(new Date)    
  
      }, 1000);
     },[])


  return (
    <div className='height-[100px] bg-red-500 flex flex-col gap-[2rem]' style={{textAlign: 'center'}}>
      <h1>{boy.getHours()} : {boy.getMinutes() < 10 ? "0"+ boy.getMinutes() : boy.getMinutes()} : {boy.getSeconds() < 10 ? "0"+ boy.getSeconds() : boy.getSeconds()} {boy.getHours >= 12 ? "am" : "pm"}</h1>
      <h1>Zoo Simulator</h1>
      <ControlPanel onPassTime={handleTimePass}/>
      <div className="flex flex-row items-center justify-center gap-[2rem]">
        {animals.map((animal, index) => (
          <AnimalCard 
            key={index}
            animal={animal}
            onFeed={() => handleFeed(index)}
          />
        ))}
      </div>
      <div className="flex flex-row items-center justify-center gap-[2rem]">
        {animals.map((animal, index) => (
          <AnimalCard
            key={index}
            animal={animal}
            onFeed={() => handleFeed(index)}
          />
        ))}
      </div>
      <div className="flex flex-row items-center justify-center gap-[2rem]">
        {animals.map((animal, index) => (
          <AnimalCard
            key={index}
            animal={animal}
            onFeed={() => handleFeed(index)}
          />
        ))}
      </div>
    </div>
  );
};



export default App;