import React, { useEffect, useState } from 'react'
import './hero.css'
import quotes from "../../quotes";

const Hero = () => {

    const [quote, setQuote] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const dayOfYear = currentDate.getFullYear() * 1000 + currentDate.getDate();
        const randomIndex = dayOfYear % quotes.length;
        setQuote(quotes[randomIndex]);
      }, []);

      return (
        <div className='hero'>
          <img src='/nature.jpg' alt='' className='hero-image' />
          <div className='quote-container'>
            <h1 className='quote'><span style={{ fontSize: '36px', color:"white" }}>GUIDANCE WEBSITE </span><br/>{quote}</h1>
          </div>
        </div>
      );
      
}

export default Hero
