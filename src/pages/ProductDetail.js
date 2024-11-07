import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import ProductInfo from '../components/ProductInfo';
import UserReviews from '../components/UserReviews';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('Anonymous');
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false); // Wishlist state

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
        } else {
          console.error('Product not found in Firebase.');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch user details, check if the product is wishlisted, and handle reviews
  useEffect(() => {
    const fetchUserDetailsAndWishlist = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.profileName || 'Anonymous');
          
          // Check if the product is in the wishlist
          const wishlist = userData?.wishlist || [];
          const isProductWishlisted = wishlist.some(item => item.productId === productId);
          setIsWishlisted(isProductWishlisted);
        } else {
          // If user doesn't exist, create a new document
          await setDoc(userRef, { profileName: 'Anonymous' });
        }
      } else {
        navigate('/login');
      }
    };
    fetchUserDetailsAndWishlist();
  }, [navigate, productId]);

  // Fetch reviews for the product
  const fetchReviews = async () => {
    setLoading(true);
    const reviewsRef = collection(db, 'products', productId, 'reviews');
    const reviewSnapshot = await getDocs(reviewsRef);
    const fetchedReviews = reviewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReviews(fetchedReviews);
    setLoading(false);
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewText.trim() && userRating !== null) {
      const reviewData = {
        text: reviewText,
        rating: userRating,
        userName,
        userId,
        timestamp: new Date(),
      };

      const reviewsRef = collection(db, 'products', productId, 'reviews');
      await addDoc(reviewsRef, reviewData);

      await fetchReviews();
      setReviewText('');
      setUserRating(null);
    }
  };

  // Handle review deletion
  const handleReviewDelete = async (reviewId) => {
    const reviewRef = doc(db, 'products', productId, 'reviews', reviewId);
    await deleteDoc(reviewRef);
    await fetchReviews();
  };

  // Calculate overall rating for the product
  const overallRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Handle Add/Remove from Wishlist
  const handleWishlistToggle = async () => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    const wishlist = userData?.wishlist || [];
    const productExists = wishlist.some(item => item.productId === productId);

    if (productExists) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item.productId !== productId);
      await updateDoc(userRef, { wishlist: updatedWishlist });
      setIsWishlisted(false);
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlist, { productId }];
      await updateDoc(userRef, { wishlist: updatedWishlist });
      setIsWishlisted(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:text-blue-700 ml-40 mt-2"
      >
        &lt; Back
      </button>
      {product ? (
        <>
          <ProductInfo
            product={product}
            overallRating={overallRating}
            isWishlisted={isWishlisted}
            handleWishlistToggle={handleWishlistToggle} // Pass the wishlist toggle handler
          />
          <UserReviews
            reviews={reviews}
            loading={loading}
            userRating={userRating}
            setUserRating={setUserRating}
            reviewText={reviewText}
            setReviewText={setReviewText}
            handleReviewSubmit={handleReviewSubmit}
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
