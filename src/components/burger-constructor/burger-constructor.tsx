import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectOrderInfo,
  useSelector,
  useDispatch,
  selectUser
} from '../../services/store';
import {
  orderBurger,
  ordersBurgerProfile,
  resetOrder
} from '../../services/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { reset } from '../../services/constructorSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectConstructorItems);
  const { orderRequest, orderModalData } = useSelector(selectOrderInfo);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
    }
    if (
      !constructorItems.bun ||
      orderRequest ||
      !constructorItems.ingredients.length
    )
      return;
    dispatch(
      orderBurger([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ])
    )
      .unwrap()
      .then(() => {
        dispatch(reset());
        dispatch(ordersBurgerProfile());
      });
  };
  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
