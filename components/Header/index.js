import styles from "./Header.module.css";
import nylasLogo from "../../assets/nylas.svg";
import inboxZeroLogo from "../../assets/inbox_zero.svg";
import Button from "../Button";

const avatar =
  "https://www.gravatar.com/avatar/934d996cf24665d1db48e173596b8988";

export default function Header() {
  return (
    <header className={styles.Header}>
      <div className={styles.Logos}>
        <img src={nylasLogo} alt="Nylas" />
        <div className={styles.LogosDivider} />
        <img src={inboxZeroLogo} alt="Inbox Zero" />
      </div>
      <div className={styles.Profile}>
        avigoldmankid@gmail.com
        <img className={styles.Avatar} src={avatar} alt="avatar" />
        <Button variant="secondary">Log out</Button>
      </div>
    </header>
  );
}
