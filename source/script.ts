import * as util from "./util.js";
import { depths } from "./depthChart.js";
import { players, version } from "./rankings.js";
import { byeweek } from "./byeweek.js";

let array = players
let position = "Overall"
//todo: change checkedList to a Set
let checkedList = JSON.parse(localStorage.checkedList || "[]");

//verify that all elements exist and place into new object (should also prevent duplicate searches)
let doc = {
  namebox: document.getElementById("namebox"),
  version: document.getElementById("version"),
  clear: document.getElementById("clear"),
  search: document.getElementById("search") as HTMLInputElement,
  position: document.getElementById("position") as HTMLSelectElement,
  hideP: document.getElementById("hideP") as HTMLInputElement
};

// now null assertions are justified
if (Object.values(doc).some(property => property === null)) {
  throw new Error("Missing html element in doc defintion!");
}

doc.position.addEventListener("change", () => {
  position = doc.position.value;
  display();
});

//version: number, localStorage.draftVersion: string
if (version != localStorage.draftVersion) {
  localStorage.draftVersion = version;
  localStorage.checkedList = "[]";
  document.location.reload();
}



doc.version!.innerHTML = version;

doc.clear!.addEventListener("click", () => {search("");doc.search.value = ""})
doc.clear!.addEventListener("dblclick", clearLocal);

doc.search.addEventListener("input", () => {search(doc.search.value)})

function search(txt: string) {
  if (txt == "") {
    array = players
    display()
    return;
  }
  array = [];
  let toSearch = txt.toUpperCase();
  for (let obj of players) {
    for (let str of obj.name.split(" ")){
      if (str.toUpperCase().startsWith(toSearch))  {
        array.push(obj)
        break;
      }
    }
  }
  display()
}

function display() {
  doc.namebox!.innerHTML = '';
  let div = document.createElement('div')
  let p = document.createElement('p');
  let inj = document.createElement('strong');
  let documentFragment = document.createDocumentFragment();
  for (let obj of array) {
    if (obj.pos === position || position === "Overall" || rbwr(obj)) {
      let cloneDiv = div.cloneNode(true) as typeof div;
      let cloneP = p.cloneNode(true) as typeof p;
      let depth = findDepthStatus(obj.name) + 1;
      cloneP.innerText = `${obj.id+1}: ${obj.name} (${obj.pos}${bracketNum(depth)} - ${obj.team}${byeweek[obj.team]})`;
      cloneP.addEventListener("click", toggle.bind(null, obj.id));

      if (obj.checked) {
        cloneP.className = "checked";
        cloneDiv.className = "checked";
      }
      cloneDiv.appendChild(cloneP);
      if (obj.inj) {
        let cloneInj = inj.cloneNode(true) as typeof inj;
        cloneInj.innerHTML = "?";
        cloneInj.addEventListener("click", () => {alert(obj.inj)})
        cloneDiv.appendChild(cloneInj);
      }
      documentFragment.appendChild(cloneDiv)
    }
  }
  doc.namebox!.appendChild(documentFragment);
}

//todo: this is horrible
//make it O(1) with lookup table
function findDepthStatus(player: string) {
  for (let list of depths) {
    let temp = list.indexOf(player)
    if (temp + 1)//returns true for all numbers except -1 where nothing is found
      return temp;
  }
}

function bracketNum(num: number) {
  if (isNaN(num)) return ""
  else return `[${num}]`
}

//todo: remove this
function rbwr(obj: any) { //returns if position is running back or wide reciever
  return (position == "RB/WR" && (obj.pos == "RB" || obj.pos == "WR"))
}
function init() {
  let i: string | number;
  for (i in players) {
    i = parseInt(i);
    players[i].id = i
    if (checkedList.indexOf(i)+1) { //returns true for all numbers except -1 where nothing is found
      players[i].checked = true;
    }
    else {
      players[i].checked = false;
    }
  }
  display()
}
init()

function toggle(id: number) {
  players[id].checked = !players[id].checked
  if (checkedList.indexOf(id)+1) { //returns true for all numbers except -1 where nothing is found
    checkedList.splice(checkedList.indexOf(id), 1)
  }
  else {
    checkedList.push(id)
  }
  localStorage.checkedList = JSON.stringify(checkedList)
  display()
}

doc.hideP!.addEventListener("change", hideP)
let hide: boolean;
function hideP(e: Event) {
  hide = doc.hideP!.checked
  if (hide) {
    let sheet = document.createElement('style')
    sheet.innerHTML = ".checked { display: none; }";
    document.head.appendChild(sheet);
  }
  else {
    document.head.removeChild(document.head.getElementsByTagName('style')[1])
  }
}

function clearLocal() {
  const response = prompt("Enter 'clear' to confirm you want to reset.");
  if (response && response.toLowerCase() === "clear") {
    localStorage.checkedList = "[]";
    document.location.reload();
  }
}
