import { useRouter } from "next/router";
import Link from "next/link";
import md5 from "md5";
import styles from "./Header.module.css";
import nylasLogo from "../../assets/nylas.svg";
import inboxZeroLogo from "../../assets/inbox_zero.svg";
import Button from "../Button";

export default function Header({ account }) {
  const avatar = `https://www.gravatar.com/avatar/${md5(account.emailAddress)}`;

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
        {account.emailAddress}
        <img className={styles.Avatar} src={avatar} alt="avatar" />
        <Button variant="secondary" href="/api/revoke">
          Log out
        </Button>
      </div>
    </header>
  );
}
