//https://www.fantasypros.com/nfl/depth-charts.php
let arr = [];
for (let i=0;i<128;i++) {
  arr[i] = []
  for (let j of document.body.getElementsByClassName("position-list")[i].getElementsByTagName("a")) {
    arr[i].push(j.innerText)
  }
}
