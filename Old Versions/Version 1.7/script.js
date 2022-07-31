let array = players
let namebox = document.getElementById("namebox")
let position = "Overall"
let checkedList = JSON.parse(localStorage.checkedList || "[]");
document.getElementById("position").addEventListener("change",(e)=>{
  position = e.srcElement.value;
  display();
})
document.getElementById("clear").addEventListener("click",()=>{search("");document.getElementById("search").value = ""})
document.getElementById("search").addEventListener("input",(e)=>{search(e.srcElement.value)})
function search(txt) {
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
  namebox.innerHTML = '';
  let div = document.createElement('div')
  let a = document.createElement('a');
  let inj = document.createElement('strong');
  let documentFragment = document.createDocumentFragment();
  for (let obj of array) {
    if (obj.pos == position || position == "Overall" || rbwr(obj)) {
      let cloneDiv= div.cloneNode(true)
      let cloneA = a.cloneNode(true);
      let depth = findDepthStatus(obj.name) + 1;
      cloneA.text = `${obj.id+1}: ${obj.name} (${obj.pos}${bracketNum(depth)} - ${obj.team}${byeweek[obj.team]})`;
      cloneA.href = `javascript:toggle(${obj.id});`
      if (obj.checked) {
        cloneA.className = "checked";
      }
      cloneDiv.appendChild(cloneA);
      if (obj.inj) {
        let cloneInj = inj.cloneNode(true);
        cloneInj.innerHTML = "?";
        cloneInj.addEventListener("click",()=>{alert(obj.inj)})
        cloneDiv.appendChild(cloneInj);
      }
      documentFragment.appendChild(cloneDiv)
    }
  }
  namebox.appendChild(documentFragment);
}

function findDepthStatus(player) {
  for (let list of depths) {
    let temp = list.indexOf(player)
    if (temp + 1)//returns true for all numbers except -1 where nothing is found
    return temp;
  }
}

function bracketNum(num) {
  if (isNaN(num)) return ""
  else return `[${num}]`
}
function rbwr(obj) { //returns if position is running back or wide reciever
  return (position == "RB/WR" && (obj.pos == "RB" || obj.pos == "WR"))
}
function init() {
  for (let i in players) {
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

function toggle(id) {
  players[id].checked = !players[id].checked
  if (checkedList.indexOf(id)+1) { //returns true for all numbers except -1 where nothing is found
    checkedList.splice(checkedList.indexOf(id),1)
  }
  else {
    checkedList.push(id)
  }
  localStorage.checkedList = JSON.stringify(checkedList)
  display()
}

document.getElementById("hideP").addEventListener("change",hideP)
function hideP(e) {
  hide = e.srcElement.checked
  if (hide) {
    let sheet = document.createElement('style')
    sheet.innerHTML = ".checked {display:none;}";
    document.head.appendChild(sheet);
  }
  else {
    document.head.removeChild(document.head.getElementsByTagName('style')[1])
  }
}

function clearLocal() {
  if (confirm("are you sure?")) {
    localStorage.checkedList = "[]";
    document.location.reload();
  }
}
