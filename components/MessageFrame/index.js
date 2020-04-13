import { useState } from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";

export default ({ content }) => {
  const [count, setCount] = useState(0);
  const [iframeHeight, setIframeHeight] = useState(0);

  return (
    <Frame
      style={{
        width: "100%",
        border: 0,
        height: `${iframeHeight}px`
      }}
      initialContent={content}
    >
      <FrameContextConsumer>
        {({ document, window }) => {
          // retry getting the frame height 3 times 1 second apart to give images time to load
          if (count < 3) {
            setTimeout(() => {
              setIframeHeight(window.document.documentElement.scrollHeight);
            }, 1000 * count);

            setCount(count + 1);
          }

          // add default styling
          const style = document.createElement("style");
          style.innerHTML = `
          body {
            font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
          }

          .gmail_quote {
            display: none;
          }
        `;
          document.head.appendChild(style);

          // force all links to open in a new tab
          [...document.links].forEach(link => {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          });
        }}
      </FrameContextConsumer>
    </Frame>
  );
};
