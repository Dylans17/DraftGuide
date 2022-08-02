import { render } from "solid-js/web";


function Index() {
    return <></>
}

const root = document.getElementById("root");
if (root == null) {
    throw new Error("Could not find root on index!");
}
render(() => <Index />, root);