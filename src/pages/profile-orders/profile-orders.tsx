import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import {
  selectOrdersProfile,
  selectUser,
  useSelector
} from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrdersProfile);

  return <ProfileOrdersUI orders={orders} />;
};
