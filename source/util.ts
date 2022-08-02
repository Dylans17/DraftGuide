export function getFileName(sourceFile: string, extension: string):string {
  let regex = new RegExp(`[a-z-]+(?=\\.${extension}$)`);
  let result = regex.exec(sourceFile);
  if (result === null) {
    throw new Error(`Unable to detect file name from sourceFile: ${sourceFile}`);
  }
  return result[0];
}

export async function getSheet(sheetName:string, key:string) {
  if (key == undefined) {throw new Error("Google sheet key not defined!");}
  let tqx = "out:json";
  tqx += ";responseHandler:a";
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

export async function getAllData(forceReset:boolean | undefined, key: string) {
  //todo: if forceReset == false, check cache first!
  if (forceReset === undefined) {
    forceReset = false;
  }
  return Promise.all([getByeWeeks(forceReset, key), getDepthCharts(forceReset, key), getRankings(forceReset, key)]);
}

async function getByeWeeks(forceReset:boolean, key:string) {

}

async function getDepthCharts(forceReset:boolean, key:string) {

}

async function getRankings(forceReset:boolean, key:string) {

}
