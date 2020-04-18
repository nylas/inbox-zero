import { Fragment, useRef } from "react";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import { Action } from "../../Actions";
import Attachment from "../../Attachment";
import addAttachmentIcon from "../../../assets/add_attachment.svg";
import removeIcon from "../../../assets/remove.svg";
import request from "../../../utils/request";

/**
 * Action components to upload, download, and delete attachments
 */
function AttachmentsAction({ files, onUpload, onDelete }) {
  return (
    <Fragment>
      <UploadAction onUpload={onUpload} />
      {files.map(file => (
        <FileAction key={file.id} onDelete={onDelete} file={file} />
      ))}
    </Fragment>
  );
}

AttachmentsAction.propTypes = {
  files: PropTypes.array.isRequired,
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

function UploadAction({ onUpload }) {
  const fileInputRef = useRef(null);

  async function handleFileChange(event) {
    NProgress.start();
    const formData = new FormData();
    formData.append("upload", event.target.files[0]);

    const response = await fetch("/api/files", {
      method: "POST",
      body: formData
    });

    const file = await response.json();
    onUpload(file);
    NProgress.done();
  }

  return (
    <Action
      icon={addAttachmentIcon}
      onClick={() => {
        fileInputRef.current.click();
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      Add Attachment »
    </Action>
  );
}

function FileAction({ onDelete, file }) {
  async function deleteFile({ filename, id }) {
    NProgress.start();

    await request(`/files/${filename}?id=${id}`, {
      method: "DELETE"
    });

    onDelete({ filename, id });
    NProgress.done();
  }

  return (
    <Action
      icon={removeIcon}
      onClickIcon={() => {
        deleteFile(file);
      }}
    >
      <Attachment {...file} />
    </Action>
  );
}

export default AttachmentsAction;
