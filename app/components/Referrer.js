import Router from "next/router";
import React, { useState, useEffect, useContext } from "react";

const ReferrerContext = React.createContext(null);

/**
 * React hook and context which retrieves the page that the visitor
 * came from to get to the current pages
 */
function Provider(props) {
  const [referrer, setReferrer] = useState(null);
  useEffect(() => {
    setReferrer(document.referrer || null);

    const handleHistoryChange = url => {
      setReferrer(window.location.href);
    };

    Router.events.on("beforeHistoryChange", handleHistoryChange);
    return () => {
      Router.events.off("beforeHistoryChange", handleHistoryChange);
    };
  }, []);

  return <ReferrerContext.Provider {...props} value={referrer} />;
}

function useReferrer() {
  return useContext(ReferrerContext);
}

export default Provider;
export { useReferrer };
