import "normalize.css";
import "../assets/style.css";
import App from "next/app";
import NProgress from "nprogress";
import Router from "next/router";
import { Provider as ReferrerProvider } from '../components/referrer'

Router.events.on("routeChangeStart", url => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());


export default function InboxZero({ Component, pageProps }) {
  return <ReferrerProvider><Component {...pageProps} /></ReferrerProvider>
}