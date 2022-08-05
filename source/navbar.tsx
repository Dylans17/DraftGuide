import { NavLink } from "@solidjs/router";
import { createSignal } from "solid-js";
import "./navbar.css";
import { getFileName } from "./util";


// glob import all components in ./component-pages
// since these are imported dynamically, we can choose to not import at all
// and just get the file names
const pages = Object.keys(import.meta.glob('./component-pages/*.tsx')).sort((a:string, b:string) => {
  if (a.includes("home")) {return -1;}
  if (b.includes("home")) {return 1;}
  return a.localeCompare(b)
});

export default function() {
  let [checked, setChecked] = createSignal(false);
  let NavLinkFromPages = () => {
    return pages.map((sourceFile, _) => {
      let fileName = getFileName(sourceFile, "tsx");
      let title = fileName.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
      return <li><NavLink href={fileName} onclick={()=>setChecked(false)}>{title}</NavLink></li>
    });
  }
  return <nav class="navbar">
    <div class="navbar-container container">
      <input type="checkbox" checked={checked()} onclick={()=>setChecked(!checked())} />
      <div class="hamburger-lines">
        <span class="line line1"></span>
        <span class="line line2"></span>
        <span class="line line3"></span>
      </div>
      <ul class="menu-items">
        <NavLinkFromPages />
      </ul>
      {/* Placeholder div so the links are fomatted correctly. */}
      <div />
      <img class="logo" src="/assets/android-chrome-192x192.png" />
    </div>
  </nav>
}