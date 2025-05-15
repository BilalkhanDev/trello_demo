import React, { useState } from 'react';
import styles from './Layout.module.css';
import Footer from '../footer/Footer';
import Navbar from '../navBar/NavBar';
import Sidebar from '../sideBar/Sidebar';
import useBoardSocketListeners from '../../hooks/useBoardSocketListeners';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
    useBoardSocketListeners();
  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div
        className={styles.main}
        style={{
          marginLeft: sidebarOpen ? '220px' : '90px',
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <div className={styles.content}>{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
