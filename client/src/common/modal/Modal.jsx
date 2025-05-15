// src/components/common/modal/CustomModal.jsx
import React from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './Modal.module.css';

const CustomModal = ({ visible, onClose, title, children, width = 600 }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      width={width}
      className={styles.customModal}
 
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <CloseOutlined className={styles.closeIcon} onClick={onClose} />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
