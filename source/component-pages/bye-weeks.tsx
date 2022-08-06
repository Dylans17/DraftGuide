import { For, Show } from "solid-js";
import { getTeams } from "../util";
import classes from "./css/table.module.css";


//literally don't even need reactivity (byeWeeks is not a signal)
export default function() {
  let teams = getTeams();
  return <>
    <h1>Bye Weeks</h1>
    <Show
    when={teams}
    fallback={<p>You have not set your sheet key yet. Go to settings and set your sheet key!</p>}
    >
      <table class={classes.table}>
        <thead style={ {top: "50px"} }>
          <tr>
            <th>Team</th>
            <th>Abbreviation</th>
            <th>Bye Week</th>
          </tr>
        </thead>
        <tbody>
          <For each={Object.entries(teams)}>{ ([abbr, {name, bye}], index) => 
            <tr>
              <td>{name}</td>
              <td>{abbr}</td>
              <td>{bye}</td>
            </tr>
          }
          </For>
        </tbody>
      </table>
    </Show>
  </>
};