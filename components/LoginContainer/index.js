import styles from "./LoginContainer.module.css";
import nylasLogo from "../../assets/nylas_vertical.svg";
import inboxZeroLogo from "../../assets/inbox_zero_vertical.svg";

export default function LoginContainer({ children }) {
  return (
    <div className={styles.LoginContainer}>
      <div className={styles.Sidebar}>
        <img src={inboxZeroLogo} alt="Inbox Zero" />
        <div className={styles.LogosDivider} />
        <img src={nylasLogo} alt="Nylas" />
      </div>
      <main className={styles.Main}>
        <div className={styles.Main__content}>{children}</div>
      </main>
    </div>
  );
}
