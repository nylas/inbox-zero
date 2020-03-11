import styles from "./Sidebar.module.css";
import Button from "../Button";

export default function Sidebar() {
  return (
    <aside className={styles.Sidebar}>
      <p className={styles.InboxOverview}>
        <span className={styles.UnreadCount}>5,429</span>
        <br />
        unread emails <br />
        from <span className={styles.SenderCount}>2,439</span> <br />
        senders.
      </p>
      <Button variant="primary">Refresh</Button>
    </aside>
  );
}
