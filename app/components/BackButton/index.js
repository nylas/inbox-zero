import PropTypes from "prop-types";
import Router from "next/router";
import styles from "./BackButton.module.css";
import { useReferrer } from "../Referrer";
import chevronLeftIcon from "../../assets/chevron_left.svg";

function BackButton({ onClick }) {
  const referrer = useReferrer();
  const defaultOnClick = () => backToListPage(referrer);

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

BackButton.propTypes = {
  onClick: PropTypes.func
};

/**
 * Navigate to the previous page if it is a list page. Otherwise,
 * go to the home page.
 */
const backToListPage = referrer => {
  const isOutsideReferrer =
    referrer === null || new URL(referrer).origin !== window.location.origin;

  const fromListPage = !isOutsideReferrer && new URL(referrer).pathname === "/";

  if (isOutsideReferrer || !fromListPage) {
    Router.push("/");
  } else {
    Router.back();
  }
};

export default BackButton;
