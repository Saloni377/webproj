import React, { useEffect, useRef } from 'react';
import './Home.css';
import earringImage from '../assets/earing.png';
import necklaceImage from '../assets/jwel.png';
import braceletImage from '../assets/braclet.png';
import Reviews from './Reviews';

const products = [
  {
    id: 1,
    name: 'Elegant Earrings',
    description: 'Beautifully crafted earrings perfect for any occasion.',
    price: '100/day',
    image: earringImage
  },
  {
    id: 2,
    name: 'Classic Necklace',
    description: 'A timeless necklace to complement your style.',
    price: '200/day',
    image: necklaceImage
  },
  {
    id: 3,
    name: 'Stylish Bracelet',
    description: 'Add a touch of elegance with this stylish bracelet.',
    price: '150/day',
    image: braceletImage
  }
];

const Home = ({ aboutSectionRef, highlightSection }) => {
  const productsSectionRef = useRef(null);
  const reviewsSectionRef = useRef(null);

  useEffect(() => {
    if (highlightSection === 'features' && productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      productsSectionRef.current.classList.add('highlight-border');

      setTimeout(() => {
        productsSectionRef.current.classList.remove('highlight-border');
      }, 2000);
    }

    if (highlightSection === 'reviews' && reviewsSectionRef.current) {
      reviewsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      reviewsSectionRef.current.classList.add('highlight-border');

      setTimeout(() => {
        reviewsSectionRef.current.classList.remove('highlight-border');
      }, 2000);
    }
  }, [highlightSection]);

  return (
    <div className="main-content">
      <section ref={aboutSectionRef} className="about-section">
        <h2>About Our Website</h2>
        <p>
          Our Accessories Rental System offers a seamless platform where users can rent and lend various accessories. Whether you need gear for a short trip or gadgets for an event, our system ensures easy access, reliable service, and affordable prices.
        </p>
      </section>

      <section ref={productsSectionRef} className="products-section">
        <h2>Available Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">{product.price}</p>
              <button className="rent-button">Rent Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* Render the Review component */}
      <section ref={reviewsSectionRef}>
        <Reviews />
      </section>
    </div>
  );
};

export default Home;