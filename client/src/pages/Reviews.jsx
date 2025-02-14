import React from 'react';
import './Reviews.css';  // Make sure this CSS file exists and is styled as you need

const reviews = [
  { id: 1, customer: 'Neha', comment: 'Absolutely loved the earrings! Great quality and fast service.' },
  { id: 2, customer: 'Ananya', comment: 'The necklace was stunning and matched my outfit perfectly.' },
  { id: 3, customer: 'Shivangi', comment: 'Very elegant bracelet, got lots of compliments!' }
];

const Review = () => (
  <section className="reviews-section">
    <h2>Customer Reviews</h2>
    <div className="reviews-grid">
      {reviews.map(review => (
        <div key={review.id} className="review-card">
          <h3>{review.customer}</h3>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Review;