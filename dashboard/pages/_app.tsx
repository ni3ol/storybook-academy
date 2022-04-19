import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'semantic-ui-css/semantic.min.css'
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <RecoilRoot>
        <Head>
          <title>Storybook Academy</title>
          <meta name="description" content="Welcome to Storybook Academy" />
        </Head>
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  );
}
