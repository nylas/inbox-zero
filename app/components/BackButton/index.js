import chevronLeftIcon from "../../assets/chevron_left.svg";
import styles from "./BackButton.module.css";

export default function BackButton({ onClick }) {
  return (
    <button className={styles.BackButton} onClick={onClick}>
      <img
        src={chevronLeftIcon}
        alt="Back"
        className={styles.BackButton__icon}
      />{" "}
      <span>Back</span>
    </button>
  );
}
