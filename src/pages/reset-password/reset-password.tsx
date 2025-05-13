import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { resetPasswordUser } from '../../services/userSlice';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    dispatch(resetPasswordUser({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
