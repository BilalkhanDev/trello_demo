import React from 'react';
import { Input } from 'antd';
import styles from './Input.module.css';

const CustomInput = ({ label, ...props }) => (
  <div className={styles.inputWrapper}>
    {label && <label className={styles.label}>{label}</label>}
    <Input className={styles.custom_input} {...props} />
  </div>
);

export default CustomInput;
