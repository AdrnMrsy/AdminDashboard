import React from "react";
import { testimonial } from "../../dummydata"; // assuming this is your correct data import
import "./testimonials.css";

const Testimonial = () => {
  return (
    <>
      <section className='testimonial padding'> 
        <div className='container'>
          <h2>
            INSPIRATIONAL SPEAKERS
          </h2>

          <div className='content grid2'>
            {testimonial.map((val, index) => ( 
              <div className='items shadow' key={index}>
                <div className='box flex'>
                  <div className='img'>
                    <img src={val.cover} alt='' />
                    <i className='fa fa-quote-left icon'></i>
                  </div>
                  <div className='name'>
                    <h2>{val.name}</h2>
                    <span>{val.post}</span>
                  </div>
                </div>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonial;
