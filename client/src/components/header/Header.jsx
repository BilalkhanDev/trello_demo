// components/Header.jsx

import styles from './Header.module.css';
import { Card, Col, Row, Typography } from 'antd';

const { Title, Text } = Typography;

const Header = (props) => (
 <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <Title level={2} className={styles.title}>Welcome {props?.title || ""} to Your Dashboard</Title>
            <Text className={styles.subtitle}>Monitor and manage your projects effectively.</Text>
          </div>
        </div>
);

export default Header;
