import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  selectOrdersAll,
  useDispatch,
  useSelector
} from '../../services/store';
import { fetchOrdersAll } from '../../services/ordersSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrdersAll);
  const handleGetFeeds = () => {
    dispatch(fetchOrdersAll());
  };

  useEffect(() => {
    dispatch(fetchOrdersAll());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
