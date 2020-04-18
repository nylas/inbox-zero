import { useEffect } from "react";

/**
 * React hook to include a script tag with the given URL
 * at the end of the document.
 */
export default function useScript(src) {
  useEffect(() => {
    const body = document.querySelector("body");
    const script = document.createElement("script");
    script.src = src;

    body.appendChild(script);
  }, []);
}
