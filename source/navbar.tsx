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
                <li><a href="/">Home</a></li>
                <li><a href="/settings">Settings</a></li>
                <li><a href="/bye-weeks">NFL Bye Weeks</a></li>
                <li><a href="/my-team">My Team</a></li>
            </ul>
            <h1 class="logo">Draft Guide</h1>
        </div>
      </nav>
}