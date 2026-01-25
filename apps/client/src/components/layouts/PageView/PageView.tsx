import type { JSX } from "react";
import styles from './PageView.module.css';
import type React from "react";
import Footer from "../Footer/Footer";

interface PageViewProps {
  children: React.ReactNode;
}

export default function PageView({children}: PageViewProps): JSX.Element {
  return <div className={styles.pageView}>
    {children}
    <Footer />
  </div>
}