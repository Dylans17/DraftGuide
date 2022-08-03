import { createSignal, splitProps } from "solid-js";
import { fetchSheetAll, getSheetKey, setSheetKey } from "../util";
import { reset } from "./home";
import styles from "./css/form.module.css";

export default function() {
  let [sheetKeyLocal, setSheetKeyLocal] = createSignal(getSheetKey());
  let [sheetValid, setSheetValid] = createSignal((sheetKeyLocal() !== null) as boolean | null)

  let checkNewId = async () => {
    let sIdLocal = sheetKeyLocal()
    if (sIdLocal === null) {
      setSheetValid(false);
      return;
    }
    setSheetValid(await setSheetKey(sIdLocal));
  }

  function fetchAll() {
    confirm("Are you sure you want to fetch the new data?\nThis will also reset your selections!");
    fetchSheetAll(sheetKeyLocal()!);

  }

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
    </ul>
    <h2>Data Management</h2>
    <ul class={styles.formul}>
      <li>
        <label for="sId">Sheet ID: </label><input id="sId" oninput={(e)=>{setSheetKeyLocal((e.target as HTMLInputElement).value); setSheetValid(null)}} onchange={checkNewId} value={sheetKeyLocal()? sheetKeyLocal() as string: ""} />
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