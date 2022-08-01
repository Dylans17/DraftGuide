import main from "./script.ts";
import { render } from "solid-js/web";


function Index() {
    return <>
        <select id="position">
            <option selected value="Overall">Overall</option>
            <option value="QB">QB</option>
            <option value="RB/WR">RB/WR</option>
            <option value="RB">RB</option>
            <option value="WR">WR</option>
            <option value="TE">TE</option>
            <option value="K">K</option>
            <option value="DST">DST</option>
        </select>
        <input type="text" id="search"></input> <button id="clear">Clear</button>
        Hide Chosen Players:<input id="hideP" type="checkbox"></input>
        <div style="float:right">Version: <span id="version"></span></div><br />
        <div id="namebox"></div>
    </>;
}

const root = document.getElementById("root");
if (root == null) {
    throw new Error("Could not find root on index!");
}
render(() => <Index />, root);
main();