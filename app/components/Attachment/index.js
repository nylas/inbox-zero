import PropTypes from "prop-types";
import styles from "./Attachment.module.css";

function Attachment({ filename, id }) {
  return (
    <a
      href={`/api/files/${filename}?id=${id}`}
      className={styles.Attachment}
      download
    >
      {filename}
    </a>
  );
}
Attachment.propTypes = {
  id: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired
};

export default Attachment;
