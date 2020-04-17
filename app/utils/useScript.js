import { useEffect } from "react";

export default function useScript(src) {
  useEffect(() => {
    const body = document.querySelector("body");
    const script = document.createElement("script");
    script.src = src;

    body.appendChild(script);
  }, []);
}
