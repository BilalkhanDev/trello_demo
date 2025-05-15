import React from 'react';
import { Button } from 'antd';
import styles from './Button.module.css';
import clsx from 'clsx';

const CustomButton = ({ children, variant = 'primary', className, ...props }) => {
  return (
    <Button className={clsx(styles.button, styles[variant], className)} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
