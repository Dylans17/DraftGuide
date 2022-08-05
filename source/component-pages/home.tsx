import { createSignal, For, onCleanup, Signal } from "solid-js";
import { getByeWeeks, getRankings, Player, Position } from "../util";
import classes from "./css/table.module.css";
import controlbar from "./css/controlbar.module.css";

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
  let pD = getRankings();
  let bW = getByeWeeks();
  let home = <h1>Main Page</h1>;
  if (!pD || !bW) {
    return <>
      {home}
      <p>You have not set your sheet key yet. Go to settings and set your sheet key!</p>;
    </>
  }

  let playerData = pD;
  let byeWeeks = bW;
  let userSelection: string[] = JSON.parse(localStorage.getItem("userSelection") || "[]");
  let otherSelection: string[] = JSON.parse(localStorage.getItem("otherSelection") || "[]");
  let playerSelectionSignals: {[name:string]: Signal<Selected>} = {};

  //This *could* be in one loop but would be a lot less efficient O(n^2) vs O(n)
  for (let name of userSelection) {
    playerSelectionSignals[name] = createSignal(Selected.user);
  }
  for (let name of otherSelection) {
    playerSelectionSignals[name] = createSignal(Selected.other);
  }
  for (let player of playerData) {
    if (player.name in playerSelectionSignals) {continue;}
    playerSelectionSignals[player.name] = createSignal(Selected.unselected);
  }

  let [userSelecting, setUserSelecting] = createSignal(false);
  let [selectedHidden, setSelectedHidden] = createSignal(false);
  let [positionSelected, setPositionSelected] = createSignal("ANY");
  let [searchValue, setSearchValue] = createSignal("");

  function userSelectionRemove(player: Player):boolean {
    // you should only be able to remove the last user selected player without a warning
    if (userSelection[userSelection.length - 1] === player.name) {
      userSelection.pop();
      return true;
    }
    let index = userSelection.findIndex((name) => name === player.name);
    let cnfrm = confirm.bind(null, `Are you sure that you want to remove ${player.name} [pick ${index + 1} of ${userSelection.length}] from your selection?`);
    if (index !== -1 && cnfrm()) {
      userSelection.splice(index, 1);
      return true;
    }
    return false;
  }

  function toggleSelection(player: Player) {
    let [selected, setSelected] = playerSelectionSignals[player.name];
    // remove player from old list if already on one
    if (selected() !== Selected.unselected) {
      if (selected() === Selected.other) {
        otherSelection = otherSelection.filter((name)=>name !== player.name);
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
      userSelection.push(player.name);
    }
    else {
      setSelected(Selected.other);
      otherSelection.push(player.name);
    }
  }

  function selectedStyle(arg: Selected | Player) {
    let selected = arg.hasOwnProperty("name")? playerSelectionSignals[(arg as Player).name][0]() : arg as Selected;
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
    let playerSelection = playerSelectionSignals[player.name][0]()
    let selectedFilterVal = !selectedHidden() || playerSelection === Selected.unselected;
    let nameFilterVal = searchValue() === "" || player.name.toUpperCase().replace(/[^A-Z ]/g, "").split(" ").some((name)=>name.startsWith(searchValue().toUpperCase()));
    return posFilterVal && selectedFilterVal && nameFilterVal;
  }

  function filterAllInvalid(e: InputEvent) {
    if (/^[^a-zA-Z]*$/.test(e.data || "")) {e.preventDefault();}
  }

  onCleanup(saveSelected)
  addEventListener("beforeunload", saveSelected)
  function saveSelected() {
    removeEventListener("beforeunload", saveSelected);
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
          <button>Clear</button>
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
            <td>{player.team}</td>
            <td>{byeWeeks.get(player.team)}</td>
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