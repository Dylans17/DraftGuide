import { createSignal, JSX, mergeProps, Show, splitProps } from "solid-js";
import { classList } from "solid-js/web";
import { registerSW } from "virtual:pwa-register";
import style from "./message.module.css";

export default function() {
  let [offlineReady, setOfflineReady] = createSignal(false);
  let [needRefresh, setNeedRefresh] = createSignal(false);
  let updateSW = registerSW({
    onNeedRefresh: () => {setNeedRefresh(true);},
    onOfflineReady: () => {
      setOfflineReady(true);
    },
  })
  return <>
    <Message show={offlineReady()} color="green" class="test" ondismiss={()=>setOfflineReady(false)}>
      <p>You are ready to go offline!</p>
    </Message>
    <Message show={needRefresh()} color="blue" class="test" ondismiss={()=>setNeedRefresh(false)}>
      <p>An update has been detected!</p>
      <button onclick={()=>updateSW()}>Update</button>
    </Message>
  </>

}

export interface MessageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  color: string,
  ondismiss?: ()=>{},
  show?:boolean
} 

export function Message(props: MessageProps):JSX.Element {
  if (props.show === undefined) {
    props.show = true;
  }
  let [selected, other] = splitProps(props, ["color", "children", "show", "ondismiss"]);
  
  return <div {...other} style={{"background-color": selected.color}} classList={{[style.popup]: true, [style.hidden]: !selected.show}}>
      <span class={style.close} onclick={selected.ondismiss}>&times;</span>
      {selected.children}
    </div>
}