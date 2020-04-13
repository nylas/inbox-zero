import styles from "./InboxContainer.module.css";

export default function InboxContainer({ children }) {
  return <div className={styles.InboxContainer}>{children}</div>;
}
