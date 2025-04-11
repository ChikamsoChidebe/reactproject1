// AnimalCard.js
import React from 'react';

const AnimalCard = ({ animal, onFeed }) => (
  <div className="animal-card">
    <h3>{animal.name} the {animal.species}</h3>
    <p>Health: {animal.health}</p>
    <button onClick={onFeed} className=' border-2 active:scale-[0.9]'>Feed</button>
  </div>
);

export default AnimalCard;
