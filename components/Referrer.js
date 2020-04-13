import Router from "next/router";
import React, { useState, useEffect, useContext } from "react";

const ReferrerContext = React.createContext(null);

export default function Provider(props) {
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

export function useReferrer() {
  return useContext(ReferrerContext);
}
