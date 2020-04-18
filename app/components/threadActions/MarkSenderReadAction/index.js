import NProgress from "nprogress";
import PropTypes from "prop-types";
import { Action } from "../../Actions";
import doubleFlagIcon from "../../../assets/double_flag.svg";
import request from "../../../utils/request";

/**
 * Action component that when clicked marks all threads sent by the
 * sender of the given thread as read.
 */
function MarkSenderReadAction({ thread, onChange }) {
  return (
    <Action
      icon={doubleFlagIcon}
      disabled={thread.senderUnread === false}
      onClick={async () => {
        NProgress.start();
        try {
          const updatedThread = await request(`/threads/${thread.id}`, {
            method: "PUT",
            body: { senderUnread: false }
          });

          onChange({ senderUnread: false });
        } catch (e) {
          console.log(e);
          alert("Something went wrong");
        }
        NProgress.done();
      }}
    >
      Mark All Emails From Sender as Read »
    </Action>
  );
}

MarkSenderReadAction.propTypes = {
  thread: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default MarkSenderReadAction;
