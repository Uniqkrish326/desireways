// src/pages/ProductDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import products from '../data/products.json';
import ProductInfo from '../components/ProductInfo';
import UserReviews from '../components/UserReviews';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find((p) => p.id === parseInt(productId));
  const navigate = useNavigate();

  const [userRating, setUserRating] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('Anonymous');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.profileName || 'Anonymous');
          if (userData.wishlist && userData.wishlist.some(item => item.productId === productId)) {
            setIsWishlisted(true);
          }
        } else {
          await setDoc(userRef, { reviews: [], wishlist: [] });
        }
      } else {
        navigate('/login');
      }
    };
    fetchUserDetails();
  }, [navigate, productId]);

  const fetchReviews = async () => {
    if (!userId) return;
    setLoading(true);
    const reviewsRef = doc(db, 'users', userId);
    const userDoc = await getDoc(reviewsRef);
    const fetchedReviews = userDoc.exists() ? userDoc.data().reviews?.filter(review => review.productId === productId) || [] : [];
    setReviews(fetchedReviews);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [userId, productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewText.trim() && userRating !== null) {
      const reviewData = {
        productId,
        text: reviewText,
        rating: userRating,
        userName,
        timestamp: new Date(),
      };

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        reviews: arrayUnion(reviewData),
      });

      await fetchReviews();
      setReviewText('');
      setUserRating(null);
    }
  };

  const handleReviewEdit = (review) => {
    setEditingReviewId(review.timestamp); // Use timestamp for unique identification
    setReviewText(review.text);
    setUserRating(review.rating);
  };

  const handleReviewUpdate = async (e) => {
    e.preventDefault();
    if (reviewText.trim() && userRating !== null && editingReviewId) {
      const updatedReviewData = {
        productId,
        text: reviewText,
        rating: userRating,
        userName,
        timestamp: editingReviewId,
      };

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        reviews: arrayRemove(reviews.find(r => r.timestamp === editingReviewId)), // Remove old review
      });
      await updateDoc(userRef, {
        reviews: arrayUnion(updatedReviewData), // Add updated review
      });

      await fetchReviews();
      setReviewText('');
      setUserRating(null);
      setEditingReviewId(null);
    }
  };

  const handleReviewDelete = async (review) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      reviews: arrayRemove(review),
    });
    await fetchReviews();
  };

  const handleWishlistToggle = async () => {
    const userRef = doc(db, 'users', userId);
    if (isWishlisted) {
      await updateDoc(userRef, {
        wishlist: arrayRemove({ productId }),
      });
      setIsWishlisted(false);
    } else {
      await updateDoc(userRef, {
        wishlist: arrayUnion({ productId }),
      });
      setIsWishlisted(true);
    }
  };

  const overallRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-4 text-blue-500 hover:text-blue-700 ml-40 mt-2" // Add left margin to position it slightly to the right
      >
        &lt; Back
      </button>
      {product ? (
        <>
          <ProductInfo product={product} overallRating={overallRating} isWishlisted={isWishlisted} handleWishlistToggle={handleWishlistToggle} />
          <UserReviews
            reviews={reviews}
            loading={loading}
            userRating={userRating}
            setUserRating={setUserRating}
            reviewText={reviewText}
            setReviewText={setReviewText}
            handleReviewSubmit={handleReviewSubmit}
            editingReviewId={editingReviewId}
            handleReviewUpdate={handleReviewUpdate}
            handleReviewEdit={handleReviewEdit}
            handleReviewDelete={handleReviewDelete}
          />
        </>
      ) : (
        <h1 className="text-center text-3xl">Product not found</h1>
      )}
    </div>
  );
};

export default ProductDetail;
