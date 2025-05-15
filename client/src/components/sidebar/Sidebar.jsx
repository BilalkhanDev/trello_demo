import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  MenuOutlined,
  CloseOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import CustomButton from '../../common/button/Button';
import CustomModal from '../../common/modal/Modal';
import BoardForm from '../../pages/boards/createBoard/createBoard';
import styles from './Sidebar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { createBoard, fetchBoard, fetchUserBoard } from '../../services/boardServices';
import { setBoard } from '../../store/slices/boardSlice';
import { toast } from 'react-toastify';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); 
  const board= useSelector((state) => state.boards.boards); 
  const [listOpen, setListOpen] = useState(false);

useEffect(() => {
}, [board]);  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

 const fetchBoards = async () => {

  if (user?.role == 1) {
    const resp = await fetchBoard();
    if (resp?.boards) {
      dispatch(setBoard(resp.boards));
    }
  } else {
    const resp = await fetchUserBoard();
    if (resp?.boards) {
      dispatch(setBoard(resp.boards));
    }
  }
};

  const isBoard=useRef(true)
  useEffect(()=>{
    if(isBoard){
      isBoard.current=false
      fetchBoards()
    }
  },[isBoard])
const handleNestedToggle=()=>{
  setListOpen((prev) => !prev)
  setIsOpen(true)
}
const handleBoardSubmit=async(data)=>{
   try{
       const resp=await createBoard(data)
       if(resp){
        await  fetchBoards()
        toast.success("Board Created")
        setOpen(false)
       }
   }
   catch(err){
      console.log(err, "EROR on PAGE")
      toast.error(err?.message || 'Internal Server Error');
       setOpen(false)
   }
}
  return (
    <>
      <nav className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.toggleButton} onClick={toggleSidebar}>
          {isOpen ? <CloseOutlined /> : <MenuOutlined />}
        </div>

        <ul className={styles.menu}>
          <li className={location.pathname === '/dashboard' ? styles.active : ''}>
            <DashboardOutlined />
            {isOpen && <Link to="/dashboard">Dashboard</Link>}
          </li>
          <li className={location.pathname === '/profile' ? styles.active : ''}>
            <UserOutlined />
            {isOpen && <Link to="/dashboard">Profile</Link>}
          </li>

          {/* Custom collapsible menu for Boards */}
          <li className={styles.customCollapseLi} onClick={handleNestedToggle}>
            <AppstoreAddOutlined className={`${styles.collapseIcon} ${listOpen ? styles.open : ''}`} />
            {isOpen && "Boards"}
          </li>
        
              {listOpen && (
              <ul className={styles.customSubMenu}>
                {board && board?.length >=1 && board?.map((item, index) => (
                  <li key={index} className={styles.subMenuItem}>
                    <Link to={`/boards/${item.id}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            )}
        

          <li className={location.pathname === '/settings' ? styles.active : ''}>
            <SettingOutlined />
            {isOpen && <Link to="/dashboard">Settings</Link>}
          </li>
        </ul>
        {
          user&& user?.role==1 &&
           <div className={styles.bottomButton}>
          <CustomButton htmlType="submit" variant="primary" block onClick={() => setOpen(true)}>
            {isOpen ? 'Create Board' : <PlusIcon />}
          </CustomButton>
        </div>
        }
       
      </nav>

      <CustomModal visible={open} onClose={() => setOpen(false)} title="Create Board">
        <BoardForm onClose={() => setOpen(false)}     onSubmit={handleBoardSubmit} />
      </CustomModal>
    </>
  );
};

const PlusIcon = () => <span style={{ fontSize: '18px' }}>➕</span>;

export default Sidebar;
