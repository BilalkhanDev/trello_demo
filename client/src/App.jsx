import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './auth/login/Login';
import styles from './App.module.css';
import SignUp from './auth/signup/SignUp';
import Protected from './routes/Protected';
import Dashboard from './pages/dashboard/Dashboard';
import Board from './pages/boards';
import AdminBoard from './pages/boards/adminBoard/AdminBoard';

function App() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <div className={styles.mainLayout}>
      
          <div className={styles.content}>
            <Routes>
             
              <Route path="/login" element={<Login/>} />
              <Route path="/signUp" element={<SignUp />} />
              <Route element={<Protected/>}>
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/boards/:boardId" element={<Board/>} />
              </Route>
              <Route path="*" element={<Login/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
