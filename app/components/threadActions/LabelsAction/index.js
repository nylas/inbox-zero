import { Fragment, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import NProgress from "nprogress";
import styles from "./LabelsAction.module.css";
import { Action, Slot } from "../../Actions";
import Input from "../..//Input";
import request from "../../../utils/request";
import checkIcon from "../../../assets/check.svg";
import addIcon from "../../../assets/add.svg";
import checkboxUncheckedIcon from "../../../assets/checkbox_unchecked.svg";
import checkboxCheckedIcon from "../../../assets/checkbox_checked.svg";
import useScript from "../../../utils/useScript";
import onRemove from "../../../utils/onRemove";

/**
 * Action components to add, remove, and create labels
 */
function LabelsAction({ thread, onAdd, onRemove, onCreate }) {
  const [showLabels, setShowLabels] = useState(false);

  async function updateThread(update) {
    NProgress.start();
    try {
      const updatedThread = await request(`/threads/${thread.id}`, {
        method: "PUT",
        body: update
      });
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
    }
    NProgress.done();
  }

  async function addLabel(newLabel) {
    await updateThread({
      labels: thread.labels.map(label => {
        return newLabel.id === label.id ? { ...label, checked: true } : label;
      })
    });

    onAdd({ ...newLabel, checked: true });
  }

  async function removeLabel(oldLabel) {
    await updateThread({
      labels: thread.labels.map(label => {
        return oldLabel.id === label.id ? { ...label, checked: false } : label;
      })
    });

    onRemove({ ...oldLabel, checked: false });
  }

  async function createLabel(displayName) {
    NProgress.start();
    try {
      const label = await request("/labels", {
        body: { displayName }
      });

      onCreate(label);
    } catch (e) {
      alert("Something went wrong");
    }
    NProgress.done();
  }

  return (
    <Fragment>
      <Action icon={checkIcon} onClick={() => setShowLabels(!showLabels)}>
        Add to List »
      </Action>
      {showLabels && (
        <Slot>
          <Labels>
            {thread.labels.map(label => (
              <Label
                key={label.id}
                {...label}
                onClick={() => {
                  if (label.checked) {
                    removeLabel(label);
                  } else {
                    addLabel(label);
                  }
                }}
              />
            ))}
            <CreateLabelForm createLabel={createLabel} />
          </Labels>
        </Slot>
      )}
    </Fragment>
  );
}

LabelsAction.propTypes = {
  thread: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

function Labels({ children }) {
  return <ul className={styles.Labels}>{children}</ul>;
}

function Label({ id, displayName, checked, onClick }) {
  return (
    <li className={styles.Label} key={id}>
      <button className={styles.Label__button} onClick={onClick}>
        <span className={styles.Label__icon}>
          <img src={checked ? checkboxCheckedIcon : checkboxUncheckedIcon} />
        </span>
        <span>{displayName}</span>
      </button>
    </li>
  );
}

function CreateLabelForm({ createLabel }) {
  const [labelInput, setLabelInput] = useState("");
  const [showCreateLabelForm, setShowCreateLabelForm] = useState(false);
  const labelInputRef = useRef(null);

  /** Focus input when form is shown */
  useEffect(() => {
    if (showCreateLabelForm) {
      labelInputRef.current.focus();
    }
  }, [showCreateLabelForm]);

  async function handleSubmit(e) {
    e.preventDefault();
    await createLabel(labelInput);
    setLabelInput("");
    setShowCreateLabelForm(false);
  }

  return (
    <Fragment>
      {showCreateLabelForm && (
        <li className={styles.CreateLabelInputWrapper}>
          <span className={styles.Label__icon}>
            <img src={checkboxUncheckedIcon} />
          </span>
          <form onSubmit={handleSubmit}>
            <Input
              ref={labelInputRef}
              onChange={e => setLabelInput(e.target.value)}
            />
          </form>
        </li>
      )}
      <li>
        <button
          className={styles.CreateLabelButton}
          onClick={() => {
            setShowCreateLabelForm(!showCreateLabelForm);
          }}
        >
          <span className={styles.CreateLabelButton__icon}>
            <img src={addIcon} />
          </span>
          Create List
        </button>
      </li>
    </Fragment>
  );
}

export default LabelsAction;
