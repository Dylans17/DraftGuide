let arr = []
let names = document.getElementsByClassName("CheatSheetPlayerName")
let posTeam = document.getElementsByClassName("CheatSheetPlayerPosTeam")
let injData = document.getElementsByClassName("PlayerAlert PlayerPopOver")
for (let i=0;i<534;i++) {
  let split = posTeam[i].innerText.split(" - ")
  arr.push({name:names[i].innerHTML,pos:split[0],team:split[1]})
}
for (let i=0;i<26;i++) {
  let inj = injData[i].dataset.content
  let player = parseInt(injData[i].parentElement.children[0].innerText)-1
  arr[player].inj = inj
  arr[player].team = arr[player].team.slice(0,-1)
}
