import '../../index.css';
import styles from './app.module.css';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import {
  selectIsAuthenticated,
  useDispatch,
  useSelector
} from '../../services/store';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { ProtectedRoute } from '@components';
import { checkUserAuth } from '../../services/userSlice';
import { fetchIngredients } from '../../services/ingredientsSlice';
import {
  fetchOrdersAll,
  ordersBurgerProfile
} from '../../services/ordersSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const backgroundLocation = location.state?.backgroundLocation;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchIngredients());
    dispatch(fetchOrdersAll());
  }, []);

  useEffect(() => {
    dispatch(ordersBurgerProfile());
  }, [isAuthenticated]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation?.background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
      {backgroundLocation?.background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа'>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента'>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа'>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

/*
<Route
              path=':number'
              element={
                <Modal title='' onClose={() => {}}>
                  <OrderInfo />
                </Modal>
              }
            />*/
