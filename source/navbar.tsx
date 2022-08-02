import { NavLink } from "@solidjs/router";
import "./navbar.css";

export default function() {
    return <nav class="navbar">
        <div class="navbar-container container">
            <input type="checkbox" name="" id="" />
            <div class="hamburger-lines">
                <span class="line line1"></span>
                <span class="line line2"></span>
                <span class="line line3"></span>
            </div>
            <ul class="menu-items">
                <li><NavLink href="/">Home</NavLink></li>
                <li><NavLink href="/settings">Settings</NavLink></li>
                <li><NavLink href="/bye-weeks">NFL Bye Weeks</NavLink></li>
                <li><NavLink href="/my-team">My Team</NavLink></li>
            </ul>
            <h1 class="logo">Draft Guide</h1>
        </div>
      </nav>
}