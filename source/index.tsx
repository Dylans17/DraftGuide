import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import Navbar from "./navbar";
import Routes from "./routes";


function Index() {
  return <Router>
    <Navbar />
    <Routes />
  </Router>
}

const root = document.getElementById("root") as HTMLElement;
render(() => <Index />, root);