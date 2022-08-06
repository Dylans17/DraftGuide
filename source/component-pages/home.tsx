import { createSignal, For, onCleanup, Signal } from "solid-js";
import { getTeams, getPlayers, Player, Position } from "../util";
import classes from "./css/table.module.css";
import controlbar from "./css/controlbar.module.css";
import lifecycle from "@socheatsok78/page-lifecycle";

export function reset() {
    localStorage.removeItem("userSelection");
    localStorage.removeItem("otherSelection");
}

enum Selected {
  unselected,
  user,
  other
}

export default function() {
  let pD = getPlayers();
  let bW = getTeams();
  let home = <h1>Main Page</h1>;
  if (!pD || !bW) {
    return <>
      {home}
      <p>You have not set your sheet key yet. Go to settings and set your sheet key!</p>
    </>
  }

  let playerData = pD;
  let teamData = bW;
  let userSelection: number[] = JSON.parse(localStorage.getItem("userSelection") || "[]");
  let otherSelection: number[] = JSON.parse(localStorage.getItem("otherSelection") || "[]");
  let playerSelectionSignals: {[rank:number]: Signal<Selected>} = {};

  //This *could* be in one loop but would be a lot less efficient O(n^2) vs O(n)
  for (let ranking of userSelection) {
    playerSelectionSignals[ranking] = createSignal(Selected.user);
  }
  for (let ranking of otherSelection) {
    playerSelectionSignals[ranking] = createSignal(Selected.other);
  }
  for (let player of playerData) {
    if (player.ranking in playerSelectionSignals) {continue;}
    playerSelectionSignals[player.ranking] = createSignal(Selected.unselected);
  }

  let [userSelecting, setUserSelecting] = createSignal(false);
  let [selectedHidden, setSelectedHidden] = createSignal(false);
  let [positionSelected, setPositionSelected] = createSignal("ANY");
  let [searchValue, setSearchValue] = createSignal("");

  function userSelectionRemove(player: Player):boolean {
    // you should only be able to remove the last user selected player without a warning
    if (userSelection[userSelection.length - 1] === player.ranking) {
      userSelection.pop();
      return true;
    }
    let index = userSelection.findIndex((ranking) => ranking === player.ranking);
    let cnfrm = confirm.bind(null, `Are you sure that you want to remove ${player.name} [pick ${index + 1} of ${userSelection.length}] from your selection?`);
    if (index !== -1 && cnfrm()) {
      userSelection.splice(index, 1);
      return true;
    }
    return false;
  }

  function toggleSelection(player: Player) {
    let [selected, setSelected] = playerSelectionSignals[player.ranking];
    // remove player from old list if already on one
    if (selected() !== Selected.unselected) {
      if (selected() === Selected.other) {
        otherSelection = otherSelection.filter((ranking)=>ranking !== player.ranking);
      }
      else {
        let removed = userSelectionRemove(player);
        if (!removed) {return;}
      }
    }
    // if currently selected, set to unselected
    if (selected() === Selected.other && !userSelecting() || selected() === Selected.user && userSelecting()) {
      setSelected(Selected.unselected);
      return;
    }
    // otherwise, set to current selection mode
    if (userSelecting()) {
      setSelected(Selected.user);
      userSelection.push(player.ranking);
    }
    else {
      setSelected(Selected.other);
      otherSelection.push(player.ranking);
    }
  }

  function selectedStyle(arg: Selected | Player) {
    let selected = arg.hasOwnProperty("name")? playerSelectionSignals[(arg as Player).ranking][0]() : arg as Selected;
    switch (selected) {
      case Selected.user:
        return classes.selectedUser
      case Selected.other:
        return classes.selectedOther;
      case Selected.unselected:
        return classes.selectedUnselected;
    }
  }

  function filterPlayers(player: Player) {
    //searching works by the START of any part of anyone's name. 
    //filter of any non alpha characters of people's names and split by spaces
    //no spaces in search box.
    let posFilterVal = positionSelected() === "ANY" || positionSelected().includes(Position[player.position]);
    let playerSelection = playerSelectionSignals[player.ranking][0]()
    let selectedFilterVal = !selectedHidden() || playerSelection === Selected.unselected;
    let nameFilterVal = searchValue() === "" || player.name.toUpperCase().replace(/[^A-Z ]/g, "").split(" ").some((name)=>name.startsWith(searchValue().toUpperCase()));
    return posFilterVal && selectedFilterVal && nameFilterVal;
  }

  function filterAllInvalid(e: InputEvent) {
    if (/^[^a-zA-Z]*$/.test(e.data || "")) {e.preventDefault();}
  }

  onCleanup(saveSelected)
  lifecycle.addEventListener("statechange", (stateEvent) => {if (stateEvent.oldState === "active" && stateEvent.newState === "passive") {saveSelected()}});
  function saveSelected() {
    localStorage.setItem("userSelection", JSON.stringify(userSelection));
    localStorage.setItem("otherSelection", JSON.stringify(otherSelection));
  }

  return <>
    {home}
    <ul class={controlbar.controlbar}>
      <li>
        <span>
          <select onchange={(e)=>setPositionSelected((e.target as HTMLSelectElement).value)}>
            {
              ["ANY", "RB/WR", ...positionsArray()].map(position => 
                <option value={position}>{position}</option>
              )
            }
          </select>
          <label for="search"> Search: </label>
          <input id="search" type="text" 
            value={searchValue()}
            onbeforeinput={(e) => /^[^a-zA-Z]+$/.test(e.data || "") && e.preventDefault()}
            oninput={(e)=>setSearchValue((e.target as HTMLInputElement).value.replace(/[^a-zA-Z]/g,""))}
          />
          <button onclick={()=>setSearchValue("")}>Clear</button>
        </span>
        <span style={{float: "right"}}>
          <label>Hide<span class={controlbar.hideSmall}> Selected</span>: <input type="checkbox" checked={selectedHidden()} onchange={()=>setSelectedHidden(!selectedHidden())}/></label>
          <label>Select<span class={controlbar.hideSmall}> for Self</span>: <input type="checkbox" checked={userSelecting()} onchange={()=>setUserSelecting(!userSelecting())} /></label>
        </span>
      </li>
    </ul>
    <table class={classes.table}>
      <thead class={controlbar.thead}>
        <tr>
          <th>Player Name</th>
          <th>Position</th>
          <th>Depth</th>
          <th>Team</th>
          <th>Bye</th>
          <th>ADP</th>
        </tr>
      </thead>
      <tbody class={"ontouchstart" in document.documentElement? "": classes.tbodyClickable}>
        <For each={playerData.filter(filterPlayers)}>{ (player) =>
          <tr onclick={[toggleSelection, player]} class={selectedStyle(player)}>
            <td>{player.name}</td>
            <td>{Position[player.position]}</td>
            <td>{player.depth}</td>
            <td title={teamData[player.team]?.name}>{player.team}</td>
            <td>{teamData[player.team]?.bye}</td>
            <td>{player.adp}</td>
          </tr>
        }</For>
      </tbody>
    </table>
  </>
};


function positionsArray() {
  let result = [];
  for (let i=0; Position[i]; i++) {
    result.push(Position[i]);
  }
  return result;
}