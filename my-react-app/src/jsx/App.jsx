import React, { useState, useEffect } from 'react';
import '../css/weather.css';

function App() {
  const [weather, setWeather] = useState({
    location: { name: '' },
    current: { temp_c: '', condition: { icon: '' } },
    forecast: { forecastday: Array(7).fill({ day: { condition: { icon: '' } } }) }
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    getWeather();
  }, []); 

  useEffect(() => {
    renderWeather();
  }, [weather]);

  async function getWeather(location = 'Trebbin') {
    if (location === '') {
      location = 'Trebbin';
    }
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=1ad2b9ceb4a9417082580031242609&q=${location}&days=7&aqi=no&alerts=no`);
    const data = await response.json();
    console.log(data);
    setWeather(data);
  }

  function renderWeather() {
    const weatherComponents = [];
    const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const today = new Date().toDateString();
    
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(weather.forecast.forecastday[i].date);
      const dateString = date.toDateString();

      const displayDay = dateString === today ? 'Heute' : weekdays[date.getDay()];

      const weatherIcon = weather.forecast.forecastday[i].day.condition.icon;

      const displayTemp = dateString === today ? weather.current.temp_c : weather.forecast.forecastday[i].day.maxtemp_c;
      
      weatherComponents.push(
        <div className='currentInfo' key={i}>
          <p className='day'>{displayDay}</p>
          <img src={weatherIcon} alt="" />
          <p className='temp'>{displayTemp}°C</p>
        </div>
      );
    }
  
    return weatherComponents;
  }

  function handleSubmit(e) {
    e.preventDefault();
    getWeather(inputValue);
    setInputValue('');
  }

  function handleKeyUp(e) {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }

  return (
    <>
      <div className="container">
        <h1>{weather.location.name}</h1>
        <div className="location">
          <input 
          type="text" 
          id='input' 
          placeholder='Gib deinen Ortsnamen ein...' value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={handleKeyUp} 
          />
          <button type="submit" onClick={handleSubmit}>Send</button>
        </div>
        <div className="forecast">
          {renderWeather()}
        </div>
      </div>
    </>
  )
}

export default App
