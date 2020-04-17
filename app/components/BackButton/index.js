import Router from "next/router";
import styles from "./BackButton.module.css";
import { useReferrer } from "../Referrer";
import chevronLeftIcon from "../../assets/chevron_left.svg";

export default function BackButton({ onClick }) {
  const referrer = useReferrer();

  const defaultOnClick = () => {
    const isOutsideReferrer =
      referrer === null || new URL(referrer).origin !== window.location.origin;

    const fromListPage =
      !isOutsideReferrer && new URL(referrer).pathname === "/";

    if (isOutsideReferrer || !fromListPage) {
      Router.push("/");
    } else {
      Router.back();
    }
  };

  return (
    <button className={styles.BackButton} onClick={onClick || defaultOnClick}>
      <img
        src={chevronLeftIcon}
        alt="Back"
        className={styles.BackButton__icon}
      />{" "}
      <span>Back</span>
    </button>
  );
}
