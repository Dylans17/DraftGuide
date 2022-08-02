import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import Navbar from "./navbar";
import Routes from "./routes";

let c: string | undefined = import.meta.env.VITE_ROUTER_BASE
console.log(c);

function Index() {
  return <Router base={c}>
    <Navbar />
    <Routes />
  </Router>
}

const root = document.getElementById("root") as HTMLElement;
render(() => <Index />, root);