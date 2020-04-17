import dynamic from "next/dynamic";
import styles from "./Editor.module.css";

const Quill = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <div className={styles.EditorPlaceholder} />
});

export default function Editor(props) {
  return (
    <div className={styles.Editor}>
      <Quill theme="snow" {...props} />
    </div>
  );
}
