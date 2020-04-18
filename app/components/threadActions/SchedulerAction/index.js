import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import styles from "./SchedulerAction.module.css";
import { Action, Slot } from "../../Actions";
import calendarIcon from "../../../assets/calendar.svg";
import schedulePageIcon from "../../../assets/schedule_page.svg";
import request from "../../../utils/request";
import useScript from "../../../utils/useScript";
import onRemove from "../../../utils/onRemove";

const schedulerConfig = {
  style: {
    tintColor: "#32325d",
    backgroundColor: "white"
  },
  defaults: {
    event: {
      title: "30-min Coffee Meeting",
      duration: 30
    }
  }
};

/**
 * Action components to manage scheduler pages and quick-start a reply with a
 * scheduler link.
 */
function SchedulerAction({
  accessToken,
  schedulerPages: defaultSchedulerPages,
  onSchedule
}) {
  /** Load Nylas Scheduler */
  useScript(
    "https://schedule.nylas.com/schedule-editor/v1.0/schedule-editor.js"
  );

  const [showSchedulerPages, setShowSchedulerPages] = useState(false);
  const [schedulerPages, setSchedulerPages] = useState(defaultSchedulerPages);
  const refreshSchedulerPages = async () => {
    const newSchedulerPages = await request(
      "https://schedule.api.nylas.com/manage/pages",
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    setSchedulerPages(newSchedulerPages);
  };

  return (
    <Fragment>
      <Action
        icon={calendarIcon}
        onClick={() => {
          setShowSchedulerPages(!showSchedulerPages);
        }}
      >
        Schedule Meeting »
      </Action>
      {showSchedulerPages && (
        <Slot>
          <ul className={styles.SchedulePages}>
            {schedulerPages.map(page => (
              <li key={page.slug} className={styles.SchedulePage}>
                <span className={styles.SchedulePage__icon}>
                  <img src={schedulePageIcon} />
                </span>
                <span>
                  <button
                    className={styles.SchedulePage__button}
                    onClick={() => {
                      onSchedule(page);
                    }}
                  >
                    {page.name}
                  </button>
                  <a
                    className={styles.SchedulePage__link}
                    target="_blank"
                    href={`https://schedule.nylas.com/${page.slug}`}
                  >
                    schedule.nylas.com/{page.slug}
                  </a>
                </span>
              </li>
            ))}
            <li>
              <button
                className={styles.ScheduleEditorButton}
                onClick={() => {
                  nylas.scheduler.show({
                    auth: { accessToken },
                    ...schedulerConfig
                  });

                  /**
                   * When the Nylas Scheduler is hidden, refresh
                   * the list of scheduler pages
                   */
                  onRemove(
                    document.querySelector(".nylas-backdrop"),
                    refreshSchedulerPages
                  );
                }}
              >
                Open Schedule Editor »
              </button>
            </li>
          </ul>
        </Slot>
      )}
    </Fragment>
  );
}

SchedulerAction.propTypes = {
  accessToken: PropTypes.string.isRequired,
  schedulerPages: PropTypes.array.isRequired,
  onSchedule: PropTypes.func.isRequired
};

export default SchedulerAction;
