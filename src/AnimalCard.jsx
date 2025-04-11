import React from 'react';

const AnimalCard = ({ animal }) => {
  const { name, species, health, dead, image } = animal;

  const renderStatus = () => {
    if (dead) {
      return <span style={{ color: 'red' }}>Dead</span>;
    }
    if (species === 'Elephant' && health < 70) {
      return <span style={{ color: 'orange' }}>Cannot Walk</span>;
    }
    return <span style={{ color: 'green' }}>Healthy</span>;
  };

  return (
    <div
      className="animal-card"
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'center',
        backgroundColor: dead ? '#f8d7da' : '#fff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <img
        src={image}
        alt={species}
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}
      />
      <h3 style={{ margin: '0.5rem 0', color: dead ? '#721c24' : '#333' }}>{name}</h3>
      <p style={{ margin: '0.5rem 0', color: '#555' }}>Species: {species}</p>
      <p style={{ margin: '0.5rem 0', color: dead ? '#721c24' : '#555' }}>
        Status: {renderStatus()}
      </p>
      <div
        style={{
          height: '10px',
          width: '100%',
          backgroundColor: '#e0e0e0',
          borderRadius: '5px',
          overflow: 'hidden',
          marginTop: '0.5rem',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${health}%`,
            backgroundColor: health > 50 ? '#4CAF50' : health > 30 ? '#FFC107' : '#F44336',
            transition: 'width 0.3s ease',
          }}
        ></div>
      </div>
      <p style={{ marginTop: '0.5rem', color: '#555' }}>Health: {health.toFixed(1)}%</p>
    </div>
  );
};

export default AnimalCard;