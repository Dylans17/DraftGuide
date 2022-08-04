import { For, JSXElement, Show } from "solid-js";
import { getByeWeeks, getRankings, Player, Position } from "../util";
import classes from "./css/table.module.css";


export default function() {
  let pD = getRankings();
  let bW = getByeWeeks();
  if (!pD || !bW) {
    return <>
      <h1>Team Page</h1>
      <p>You have not set your sheet key yet. Go to settings and set your sheet key!</p>;
    </>
  }

  let playerData = pD;
  let byeWeeks = bW;
  let userSelection: string[] = JSON.parse(localStorage.getItem("userSelection") || "[]");
  let numTeams = parseInt(localStorage.getItem("numTeams") || "0");
  let draftPos = parseInt(localStorage.getItem("draftPos") || "0");
  let numRounds = parseInt(localStorage.getItem("numTeams") || "0");
  let showPick = numTeams > 0 && draftPos > 0 && numRounds > 0;
  if (showPick) {
    draftPos = (draftPos - 1) % numTeams + 1;
  }
  //this filter is technically O(nm) and a better method would be O(n+m) but this is easy & fast enough since userSelection is often O(1)
  let userTeam = playerData.filter(p => userSelection.includes(p.name));


  return <>
    <h1>Team Page</h1>
    <table class={classes.table}>
      <thead style={ {top: "50px"} }>
        <tr>
          <th>Selection</th>
          <th>Player</th>
          <th>Position</th>
          <th>Depth</th>
          <th>Team</th>
          <th>Bye</th>
          <Show when={showPick}>
            <th>Pick</th>
          </Show>
          
        </tr>
      </thead>
      <tbody>
        {() => {
          let result: JSXElement[] = [];
          let i: number;
          for (i = 0; i < userTeam.length; i++) {
            let player = userTeam[i];
            result.push(<tr>
              <td>{i+1}</td>
              <td>{player.name}</td>
              <td>{Position[player.position]}</td>
              <td>{player.depth}</td>
              <td>{player.team}</td>
              <td>{byeWeeks.get(player.team)}</td>
              <Show when={showPick}>
                <td>{i % 2 === 0 ? draftPos + i * numTeams : numTeams + 1 - draftPos + numTeams * i}</td>
              </Show>
            </tr>);
          }
          if (!showPick) {return result;}
          for (; i < numRounds; i++) {
            result.push(<tr>
              <td>{i+1}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{i % 2 === 0 ? draftPos + i * numTeams : numTeams + 1 - draftPos + numTeams * i}</td>
            </tr>)
          }
          return result;
        }}
      </tbody>
    </table>
  </>
};