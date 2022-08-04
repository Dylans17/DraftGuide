import { render } from "solid-js/web";
import { hashIntegration, Router } from "@solidjs/router";
import Navbar from "./navbar";
import Routes from "./routes";

let routerBase: string = import.meta.env.VITE_ROUTER_BASE || "/";

function Index() {
  return <Router base={routerBase} source={hashIntegration()}>
    <Navbar />
    <Routes />
  </Router>
}

const root = document.getElementById("root") as HTMLElement;
render(() => <Index />, root);