import { Fragment, useState } from "react";
import styles from "./SchedulerAction.module.css";
import { Action, Slot } from "../../Actions";
import request from "../../../utils/request";
import calendarIcon from "../../../assets/calendar.svg";
import schedulePageIcon from "../../../assets/schedule_page.svg";
import useScript from "../../../utils/useScript";
import onRemove from "../../../utils/onRemove";

export default function SchedulerAction({
  accessToken,
  schedulerPages: serverSchedulerPages,
  onSchedule
}) {
  useScript(
    "https://schedule.nylas.com/schedule-editor/v1.0/schedule-editor.js"
  );

  const [showSchedulerPages, setShowSchedulerPages] = useState(false);
  const [schedulerPages, setSchedulerPages] = useState(serverSchedulerPages);

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
      {showSchedulerPages ? (
        <Slot>
          <ul className={styles.SchedulePages}>
            {schedulerPages.map(page => (
              <li className={styles.SchedulePage} key={page.slug}>
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
                    auth: {
                      accessToken: accessToken
                    },
                    style: {
                      // Style the schedule editor
                      tintColor: "#32325d",
                      backgroundColor: "white"
                    },
                    defaults: {
                      event: {
                        title: "30-min Coffee Meeting",
                        duration: 30
                      }
                    }
                  });

                  onRemove(
                    document.querySelector(".nylas-backdrop"),
                    async () => {
                      const newSchedulerPages = await fetch(
                        "https://schedule.api.nylas.com/manage/pages",
                        {
                          headers: { Authorization: `Bearer ${accessToken}` }
                        }
                      ).then(response => response.json());

                      setSchedulerPages(newSchedulerPages);
                    }
                  );
                }}
              >
                Open Schedule Editor »
              </button>
            </li>
          </ul>
        </Slot>
      ) : (
        ""
      )}
    </Fragment>
  );
}
