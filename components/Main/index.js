import { useRef } from "react";
import Router from "next/router";
import styles from "./Main.module.css";

Router.events.on("routeChangeComplete", url => {
  const mainElement = document.querySelector(`.${styles.Main}`);

  if (mainElement) {
    mainElement.scrollTo(0, 0);
  }
});

export default function Main({ children }) {
  return <main className={styles.Main}>{children}</main>;
}
