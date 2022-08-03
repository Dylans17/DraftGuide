import { For, Show } from "solid-js"
import { getByeWeeks } from "../util"
import classes from "./css/table.module.css";


//literally don't even need reactivity (byeWeeks is not a signal)
export default function() {
  let byeWeeks = getByeWeeks();
  return <>
    <h1>Bye Weeks</h1>
    <Show
    when={byeWeeks}
    fallback={<p>You have not added a sheet yet. Go to settings and add a sheet!</p>}
    >
      <table class={classes.table}>
        <thead style={ {top: "50px"} }>
          <tr>
            <th>Team</th>
            <th>Bye Week</th>
          </tr>
        </thead>
        <tbody>
          <For each={[...byeWeeks as Map<string, number>]}>{ ([team, byeWeek], index) => 
            <tr>
              <td>{team}</td>
              <td>{byeWeek}</td>
            </tr>
          }
          </For>
        </tbody>
      </table>
    </Show>
  </>
};