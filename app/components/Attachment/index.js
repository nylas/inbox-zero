import styles from "./Attachment.module.css";

export default function Attachment({ filename, id }) {
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
