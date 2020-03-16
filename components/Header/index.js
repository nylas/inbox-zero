import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Header.module.css";
import nylasLogo from "../../assets/nylas.svg";
import inboxZeroLogo from "../../assets/inbox_zero.svg";
import Button from "../Button";

const avatar =
  "https://www.gravatar.com/avatar/934d996cf24665d1db48e173596b8988";

export default function Header() {
  const logout = e => {
    e.preventDefault();
  };

  return (
    <header className={styles.Header}>
      <Link href="/">
        <a className={styles.Logos}>
          <img src={nylasLogo} alt="Nylas" />
          <div className={styles.LogosDivider} />
          <img src={inboxZeroLogo} alt="Inbox Zero" />
        </a>
      </Link>
      <div className={styles.Profile}>
        avigoldmankid@gmail.com
        <img className={styles.Avatar} src={avatar} alt="avatar" />
        <Button variant="secondary" href="/api/revoke">
          Log out
        </Button>
      </div>
    </header>
  );
}
