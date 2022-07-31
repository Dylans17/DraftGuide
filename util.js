async function getSheet(sheetName, key) {
  if (key == undefined) {
    key = getGetParameters().key
  }
  if (key == undefined) {throw new Error("Google sheet key not defined!");}
  let tqx = "out:json";
  tqx += ";responseHandler:JSON.parse"
  //todo: add signature and no new data response
  //tqx += `;sig:${signature}`
  return fetch(`https://docs.google.com/spreadsheets/d/${key}/gviz/tq?tqx=${tqx}&sheet=${sheetName}`)
}

function getGetParameters() {
  const result = {};
  for (let pair of window.location.search.substr(1).split("&")) {
    let [key, value] = pair.split("=");
    result[key] = decodeURIComponent(value);
  }
  return result;
}
