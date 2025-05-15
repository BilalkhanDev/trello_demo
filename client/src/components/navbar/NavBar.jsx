// src/components/layout/Navbar.jsx
import React from 'react';
import { Menu, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './Navbar.module.css';

const Navbar = () => {
  const menu = (
    <Menu
      items={[
        { label: 'Profile', key: '1' },
        { label: 'Logout', key: '2' },
      ]}
    />
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>MyApp</div>
      <Dropdown overlay={menu} trigger={['click']}>
        <div className={styles.user}>
          <UserOutlined />
        </div>
      </Dropdown>
    </div>
  );
};

export default Navbar;
