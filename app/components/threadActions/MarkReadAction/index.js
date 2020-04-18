import NProgress from "nprogress";
import PropTypes from "prop-types";
import { Action } from "../../Actions";
import flagIcon from "../../../assets/flag.svg";
import request from "../../../utils/request";

/**
 * Action component that when clicked marks the given thread
 * as read.
 */
function MarkReadAction({ thread, onChange }) {
  return (
    <Action
      icon={flagIcon}
      disabled={thread.unread === false}
      onClick={async () => {
        NProgress.start();
        try {
          const updatedThread = await request(`/threads/${thread.id}`, {
            method: "PUT",
            body: { unread: false }
          });

          onChange({ unread: false });
        } catch (e) {
          console.log(e);
          alert("Something went wrong");
        }
        NProgress.done();
      }}
    >
      Mark as Read »
    </Action>
  );
}

MarkReadAction.propTypes = {
  thread: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default MarkReadAction;
