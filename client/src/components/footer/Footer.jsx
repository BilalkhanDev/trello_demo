
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} MyApp. All rights reserved.
    </footer>
  );
};

export default Footer;
