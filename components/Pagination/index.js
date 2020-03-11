import classnames from "classnames";
import styles from "./Pagination.module.css";
import chevronLeft from "../../assets/chevron_left.svg";
import chevronRight from "../../assets/chevron_right.svg";

export default function Pagination() {
  return (
    <div className={styles.Pagination}>
      <button className={classnames(styles.Button, styles.disabled)}>
        <img src={chevronLeft} alt="previous" />
      </button>
      <div>Page 1</div>
      <button className={classnames(styles.Button)}>
        <img src={chevronRight} alt="next" />
      </button>
    </div>
  );
}
