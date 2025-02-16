import React, { useEffect, useRef } from 'react';
import './Home.css';
import bgImage from '../assets/bg.png';
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

const Home = ({ highlightSection }) => {
  const aboutSectionRef = useRef(null);
  const productsSectionRef = useRef(null);
  const reviewsSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  useEffect(() => {
    const scrollToSection = (ref) => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth' });
        ref.current.classList.add('highlight-border');
        setTimeout(() => ref.current.classList.remove('highlight-border'), 2000);
      }
    };
    if (highlightSection === 'about') scrollToSection(aboutSectionRef);
    if (highlightSection === 'features') scrollToSection(productsSectionRef);
    if (highlightSection === 'reviews') scrollToSection(reviewsSectionRef);
    if (highlightSection === 'contact') scrollToSection(contactSectionRef);

  }, [highlightSection]);

  return (
    <div className="main-content">
      {/* About Section */}
      <section ref={aboutSectionRef} className="about-section">
        <div className='about-content'>
          <h2>About Us</h2>
          <p>
            Welcome to <strong>GlamGear</strong>, your go-to accessories rental platform!<br />
          </p>
          <p>
            Whether you need a stunning piece for a special occasion or want <br />
            to try different styles before making a purchase, we’ve got you covered.<br />
            <br />
            Our platform offers a wide selection of earrings, necklaces, <br />
            bracelets, and more—ensuring you always find the <br />
            perfect match for any event.<br />
            <br />
          </p>
          
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsSectionRef} className="products-section">
        <h2>Available Products</h2>
        <div className="products-grid">
          {products.map((product) => (
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

      {/* Reviews Section */}
      <section ref={reviewsSectionRef}>
        <Reviews />
      </section>

      {/* Contact Section */}
      <section ref={contactSectionRef} className="contact-section">
        <div className="contact-content">
          <h2>Contact Us</h2>
          <p>
            Have any questions or need assistance? Reach out to us!  
            We’d love to hear from you and help in any way we can.
          </p>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
