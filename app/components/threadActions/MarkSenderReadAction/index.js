import NProgress from "nprogress";
import { Action, Slot } from "../../Actions";
import doubleFlagIcon from "../../../assets/double_flag.svg";
import request from "../../../utils/request";

export default ({ thread, disabled, onChange }) => (
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
