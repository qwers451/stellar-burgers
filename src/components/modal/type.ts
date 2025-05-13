import { ReactNode } from 'react';

export type TModalProps = {
  title: string;
  //onClose: () => void;
  onClose?: () => void;
  children?: ReactNode;
};
