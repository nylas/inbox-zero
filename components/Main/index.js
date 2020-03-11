import styles from "./Main.module.css";

export default function Main({ children }) {
  return <main className={styles.Main}>{children}</main>;
}
