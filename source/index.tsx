import { render } from "solid-js/web";
import { hashIntegration, Router } from "@solidjs/router";
import Navbar from "./navbar";
import Routes from "./routes";
import RouterMessages from "./serviceWorkerManager";

function Index() {
  return <Router source={hashIntegration()}>
    <RouterMessages />
    <Navbar />
    <Routes />
  </Router>
}

const root = document.getElementById("root") as HTMLElement;
render(() => <Index />, root);