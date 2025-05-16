// src/components/layout/Navbar.jsx

import React from 'react';
import { Dropdown} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './Navbar.module.css';
import { logoutUser } from '../../services/userServices';

const Navbar = () => {

  const handleMenuClick = ({ key }) => {
    if (key === '2') {
      logoutUser()
    }
  };

  const menuItems = [
    {
      label: 'Profile',
      key: '1',
    },
    {
      label: 'Logout',
      key: '2',
    },
  ];

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>MyApp</div>
      <Dropdown
        menu={{
          items: menuItems,
          onClick: handleMenuClick,
        }}
        trigger={['click']}
      >
        <div className={styles.user} style={{ cursor: 'pointer' }}>
          <UserOutlined />
        </div>
      </Dropdown>
    </div>
  );
};

export default Navbar;
