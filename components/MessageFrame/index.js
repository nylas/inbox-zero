import { useState, useEffect } from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";

export default ({ content }) => {
  const [count, setCount] = useState(0);
  const [iframeHeight, setIframeHeight] = useState(0);

  // refresh iframe when content changes
  useEffect(() => {
    setCount(0);
    setIframeHeight(0);
  }, [content]);

  return (
    <Frame
      style={{
        width: "100%",
        border: 0,
        height: `${iframeHeight}px`
      }}
    >
      <FrameContextConsumer>
        {({ document, window }) => {
          if (count === 0) {
            document.open();
            document.write(content);
            document.close();
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
          }

          // retry getting the frame height 10 times .5 second apart to give images time to load
          if (count < 10) {
            setTimeout(() => {
              setIframeHeight(window.document.documentElement.scrollHeight);
            }, 500 * count);

            setCount(count + 1);
          }
        }}
      </FrameContextConsumer>
    </Frame>
  );
};
