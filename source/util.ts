function getGetParameters() {
    const result: {[key:string]: string} = {};
    for (let pair of window.location.search.substring(1).split("&")) {
      let [key, value] = pair.split("=");
      result[key] = decodeURIComponent(value);
    }
    return result;
  }
  
  async function getSheet(sheetName:string, key:string) {
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
    let search = /^[/O_o*\n]+a\((.*)\);$/.exec(text);
    let innerContent: string;
    if (search != null && search[1] != undefined) {
        innerContent = search[1];
    }
    else {
        throw new Error(`Unexpected response from spreadsheet does not match parsing pattern:\n${text}`);
    }
    return JSON.parse(innerContent);
  }
  
  async function getAllData(forceReset:boolean) {
    const key = getGetParameters().key;
    return Promise.all([getByeWeeks(forceReset, key), getDepthCharts(forceReset, key), getRankings(forceReset, key)]);
  }
  
  async function getByeWeeks(forceReset:boolean, key:string) {
  
  }
  
  async function getDepthCharts(forceReset:boolean, key:string) {
  
  }
  
  async function getRankings(forceReset:boolean, key:string) {
  
  }
  