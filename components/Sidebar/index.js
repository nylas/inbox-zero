import styles from "./Sidebar.module.css";
import Button from "../Button";

export default function Sidebar({ children }) {
  return <aside className={styles.Sidebar}>{children}</aside>;
}
