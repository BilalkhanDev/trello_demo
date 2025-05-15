import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import styles from './Dashboard.module.css';
import { UserOutlined, AppstoreOutlined, FileDoneOutlined } from '@ant-design/icons';
import Layout from '../../components/layout/Layout';
import Header from '../../components/header/Header';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const Dashboard = ({ stats = {} }) => {
  const {
    totalBoards = 0,
    totalTickets = 0,
    totalUsers = 0,
  } = stats;
  const user = useSelector((state) => state.user.user);
  return (
    <Layout>
      <div>
        <Header title={user?.username}/>

        <div className={styles.statsSection}>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <div className={styles.statCard} style={{ background: 'linear-gradient(135deg, #6dd5fa, #2980b9)' }}>
                <AppstoreOutlined className={styles.icon} />
                <Title level={4} className={styles.statTitle}>Boards</Title>
                <Text className={styles.statNumber}>{totalBoards}</Text>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <div className={styles.statCard} style={{ background: 'linear-gradient(135deg, #f6d365, #fda085)' }}>
                <FileDoneOutlined className={styles.icon} />
                <Title level={4} className={styles.statTitle}>Tickets</Title>
                <Text className={styles.statNumber}>{totalTickets}</Text>
              </div>
            </Col>
             {user && user?.role == 1 &&
             <Col xs={24} sm={12} md={8}>
              <div className={styles.statCard} style={{ background: 'linear-gradient(135deg, #84fab0, #8fd3f4)' }}>
                <UserOutlined className={styles.icon} />
                <Title level={4} className={styles.statTitle}>Users</Title>
                <Text className={styles.statNumber}>{totalUsers}</Text>
              </div>
            </Col>}
            
          </Row>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
