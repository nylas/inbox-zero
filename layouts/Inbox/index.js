import styles from "./InboxLayout.module.css";
import Router from "next/router";

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
