import { createSignal, splitProps } from "solid-js";
import { fetchSheetAll, getSheetKey, setSheetKey } from "../util";
import { reset } from "./home";
import styles from "./css/form.module.css";

const sheetRegEx = /^(?:https:)?\/?\/?docs.google.com\/spreadsheets(?:\/u\/\d+)?\/d\/([\w-]*)\//

export default function() {
  let [sheetKeyLocal, setSheetKeyLocal] = createSignal(getSheetKey());
  let [sheetValid, setSheetValid] = createSignal((sheetKeyLocal() !== null) as boolean | null)

  let checkNewId = async () => {
    let sIdLocal = sheetKeyLocal()
    if (sIdLocal === null) {
      setSheetValid(false);
      return;
    }
    let extract = sheetURLextract(sIdLocal);
    if (extract !== null) {
      sIdLocal = extract;
      setSheetKeyLocal(sIdLocal);
    }
    setSheetValid(await setSheetKey(sIdLocal));
  }

  function fetchAll() {
    confirm("Are you sure you want to fetch the new data?\nThis will also reset your selections!");
    fetchSheetAll(sheetKeyLocal()!);
    reset();
  }

  let sheetURLextractClipboard = (e: ClipboardEvent) => {
    let clipboard = e.clipboardData?.getData("text/plain");
    let replacement: string | null;
    if (clipboard !== undefined && (replacement = sheetURLextract(clipboard)) != null) {
      e.preventDefault();
      setSheetValid(null);
      setSheetKeyLocal(replacement);
      checkNewId()
    }
  }
  let sheetURLextract = (s: string):string | null => {
    let execResults = sheetRegEx.exec(s);
    if (execResults !== null) {
      return execResults[1];
    }
    return null;
  }
  let sIdElm: HTMLInputElement;

  return <>
    <h1>Settings Page</h1>
    <h2>Draft Info (optional)</h2>
    <ul class={styles.formul}>
      <li>
        <label for="nTs">Number of Teams: </label><LocalStorageInput id="nTs" type="number" LSkey="numTeams"/>
      </li>
      <li>
        <label for="dPs">Draft Position: </label><LocalStorageInput id="dPs" type="number" LSkey="draftPos"/>
      </li>
      <li>
        <label for="nRs">Number of rounds: </label><LocalStorageInput id="nRs" type="number" LSkey="numRounds"/>
      </li>
      <li>
        <label for="bWl">Bye Week Limit: </label><LocalStorageInput id="bWl" type="number" LSkey="byeWeekLimit"/>
      </li>
    </ul>
    <h2>Data Management</h2>
    <ul class={styles.formul}>
      <li>
        <label for="sId">Sheet ID: </label>
        <input id="sId" 
          ref={(elm)=>sIdElm = elm} 
          onpaste={sheetURLextractClipboard} 
          oninput={()=>{setSheetKeyLocal(sIdElm.value); setSheetValid(null)}} 
          onchange={checkNewId} 
          value={sheetKeyLocal()? sheetKeyLocal() as string: ""} 
        />
        <span style={`color: ${sheetValid()?"green":"red"};`}>{sheetValid() === null? "" : sheetValid()? '✓' : '✗'}</span>
      </li>
      <li>
        <span class={styles.lblock}>
          <button onclick={()=> confirm("Are you sure you want to reset?") && reset()}>Reset Selections</button>
        </span>
        <button disabled={!sheetValid()} onclick={fetchAll}>Fetch Sheet Data</button>
      </li>
    </ul>
  </>
};

let LocalStorageInput = (props:any) => {
    const [local, others] = splitProps(props, ["LSkey"]);
    let self: HTMLInputElement;
    return <input ref={el => self = el} {...others} oninput={() => localStorage.setItem(local.LSkey, self.value)} value={localStorage.getItem(local.LSkey) || ""}/>
};