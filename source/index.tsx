import { render } from "solid-js/web";
import style from "./style.module.css";
import Navbar from "./navbar";
import "./navbar.css";


function Index() {
    return <Navbar></Navbar>
}

const root = document.getElementById("root") as HTMLElement;
render(() => <Index />, root);