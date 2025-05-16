import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Install this package for JWT decoding
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/slices/userSlice';
import { authUser } from '../services/userServices';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);  // Access user from Redux store

 
 useEffect(() => {
  const token = sessionStorage.getItem('token');


  const checkAuth = async () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp > currentTime) {
          setIsAuthenticated(true);

          if (!user) {
            try {
              const resp = await authUser(); // Await the promise
              if (resp) {
                dispatch(setUser(resp));
              }
            } catch (err) {
              console.error("authUser failed", err);
            }
          }
        } else {
          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  };

  checkAuth();
}, [dispatch, user]);

  return { isAuthenticated, loading };
};

export default useAuth;
