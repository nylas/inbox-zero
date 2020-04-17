import styles from "./InboxLayout.module.css";
import Router from "next/router";
import Link from "next/link";
import md5 from "md5";
import Button from "../../components/Button";
import nylasLogo from "../../assets/nylas.svg";
import inboxZeroLogo from "../../assets/inbox_zero.svg";

Router.events.on("routeChangeComplete", url => {
  const mainElement = document.querySelector(`.${styles.Content}`);

  if (mainElement) {
    mainElement.scrollTo(0, 0);
  }
});

export default function InboxLayout({ children }) {
  return <div className={styles.InboxLayout}>{children}</div>;
}

export function Content({ children }) {
  return <main className={styles.Content}>{children}</main>;
}

export function Sidebar({ children }) {
  return <aside className={styles.Sidebar}>{children}</aside>;
}

export function Header({ account }) {
  const avatar = `https://www.gravatar.com/avatar/${md5(account.emailAddress)}`;

  return (
    <header className={styles.Header}>
      <Link href="/">
        <a className={styles.Header__logos}>
          <img src={nylasLogo} alt="Nylas" />
          <div className={styles.Header__logosDivider} />
          <img src={inboxZeroLogo} alt="Inbox Zero" />
        </a>
      </Link>
      <div className={styles.Header__profile}>
        {account.emailAddress}
        <img className={styles.Header__avatar} src={avatar} alt="avatar" />
        <Button variant="secondary" href="/api/logout" prefetch={false}>
          Log out
        </Button>
      </div>
    </header>
  );
}
