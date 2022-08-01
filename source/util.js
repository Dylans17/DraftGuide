function getGetParameters() {
  const result = {};
  for (let pair of window.location.search.substr(1).split("&")) {
    let [key, value] = pair.split("=");
    result[key] = decodeURIComponent(value);
  }
  return result;
}

async function getSheet(sheetName, key) {
  if (key == undefined) {
    key = getGetParameters().key;
  }
  if (key == undefined) {throw new Error("Google sheet key not defined!");}
  let tqx = "out:json";
  tqx += ";responseHandler:";
  //todo: add signature and no new data response
  //tqx += `;sig:${signature}`
  let response = await fetch(`https://docs.google.com/spreadsheets/d/${key}/gviz/tq?tqx=${tqx}&sheet=${sheetName}`);
  let text = await response.text();
  let innerContent = /^[/O_o*\n]+a\((.*)\);$/.exec(text)[1];
  return JSON.parse(innerContent);
}

async function getAllData(forceReset) {
  const key = getGetParameters().key;
  return Promise.all([getByeWeeks(forceReset, key), getDepthCharts(forceReset, key), getRankings(forceReset, key)]);
}

async function getByeWeeks(forceReset, key) {

}

async function getDepthCharts(forceReset, key) {

}

async function getRankings(forceReset, key) {

}
