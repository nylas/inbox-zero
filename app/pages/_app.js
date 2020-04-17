import NProgress from "nprogress";
import Router from "next/router";
import Head from "next/head";
import Referrer from "../components/Referrer";

import "normalize.css";
import "react-quill/dist/quill.snow.css";
import "../assets/style.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function InboxZeroApp({ Component, pageProps }) {
  return (
    <Referrer>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </Referrer>
  );
}
