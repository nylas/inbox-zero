import { Fragment, useState, useRef, useEffect } from "react";
import NProgress from "nprogress";
import styles from "./LabelsAction.module.css";
import { Action, Slot } from "../../Actions";
import Input from "../..//Input";
import request from "../../../utils/request";
import checkIcon from "../../../assets/check.svg";
import addIcon from "../../../assets/add.svg";
import checkboxUncheckedIcon from "../../../assets/checkbox_unchecked.svg";
import checkboxCheckedIcon from "../../../assets/checkbox_checked.svg";
import schedulePageIcon from "../../../assets/schedule_page.svg";
import useScript from "../../../utils/useScript";
import onRemove from "../../../utils/onRemove";

export default function LabelsAction({ thread, onAdd, onRemove, onCreate }) {
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
        if (newLabel.id === label.id) {
          return {
            ...label,
            checked: true
          };
        }

        return label;
      })
    });

    onAdd(newLabel);
  }

  async function removeLabel(oldLabel) {
    await updateThread({
      labels: thread.labels.map(label => {
        if (oldLabel.id === label.id) {
          return {
            ...label,
            checked: false
          };
        }

        return label;
      })
    });

    onRemove(oldLabel);
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
        Add to ToDo List »
      </Action>
      {showLabels && (
        <Slot>
          <Labels
            labels={thread.labels}
            addLabel={addLabel}
            removeLabel={removeLabel}
            createLabel={createLabel}
          />
        </Slot>
      )}
    </Fragment>
  );
}

function Labels({ labels, addLabel, removeLabel, createLabel }) {
  const labelInputRef = useRef(null);
  const [labelInput, setLabelInput] = useState("");
  const [showCreateLabelForm, setShowCreateLabelForm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await createLabel(labelInput);
    setLabelInput("");
    setShowCreateLabelForm(false);
  }

  useEffect(() => {
    if (showCreateLabelForm) {
      labelInputRef.current.focus();
    }
  }, [showCreateLabelForm]);

  return (
    <ul className={styles.Labels}>
      {labels.map(label => (
        <li className={styles.Label} key={label.id}>
          <button
            className={styles.Label__button}
            onClick={() => {
              if (label.checked) {
                removeLabel(label);
              } else {
                addLabel(label);
              }
            }}
          >
            <span className={styles.Label__icon}>
              <img
                src={
                  label.checked ? checkboxCheckedIcon : checkboxUncheckedIcon
                }
              />
            </span>
            <span>{label.displayName}</span>
          </button>
        </li>
      ))}
      {showCreateLabelForm ? (
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
      ) : (
        ""
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
    </ul>
  );
}
