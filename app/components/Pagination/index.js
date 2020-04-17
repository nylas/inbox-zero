import Router from "next/router";
import PropTypes from "prop-types";
import styles from "./Pagination.module.css";
import chevronLeftIcon from "../../assets/chevron_left.svg";
import chevronRightIcon from "../../assets/chevron_right.svg";

function Pagination({ label, previous, next, variant = "offset" }) {
  return (
    <div className={styles.Pagination}>
      <button
        className={styles.Pagination__button}
        disabled={!previous}
        onClick={() => Router.push(previous.href, previous.as)}
      >
        <img
          src={chevronLeftIcon}
          className={styles.Pagination__icon}
          alt="previous"
        />
        {variant === "cursor" && "Previous"}
      </button>
      {variant === "offset" && label && <div>{label}</div>}
      <button
        className={styles.Pagination__button}
        disabled={!next}
        onClick={() => Router.push(next.href, next.as)}
      >
        {variant === "cursor" && "Next"}
        <img
          src={chevronRightIcon}
          className={styles.Pagination__icon}
          alt="next"
        />
      </button>
    </div>
  );
}

Pagination.propTypes = {
  label: PropTypes.string,
  previous: PropTypes.shape({
    href: PropTypes.string.isRequired,
    as: PropTypes.string
  }),
  next: PropTypes.shape({
    href: PropTypes.string.isRequired,
    as: PropTypes.string
  }),
  variant: PropTypes.oneOf(["offset", "cursor"])
};

export default Pagination;
