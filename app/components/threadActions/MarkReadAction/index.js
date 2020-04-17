import NProgress from "nprogress";
import { Action, Slot } from "../../Actions";
import flagIcon from "../../../assets/flag.svg";
import request from "../../../utils/request";

export default ({ thread, disabled, onChange }) => (
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
