import React, { useState } from 'react';
import styles from './Layout.module.css';
import Footer from '../footer/Footer';
import Navbar from '../navBar/NavBar';
import Sidebar from '../sidebar/Sidebar';
import useBoardSocketListeners from '../../hooks/useBoardSocketListeners';
import useTicketSocketListeners from '../../hooks/useTicketSocketListener';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = useSelector((state) => state.user.user);
  useBoardSocketListeners();
  useTicketSocketListeners();


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
