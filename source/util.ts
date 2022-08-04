import { assert } from "console";
import { type } from "os";
import { Primitive, ValueOf } from "type-fest";


export function getFileName(sourceFile: string, extension: string): string {
  let regex = new RegExp(`[a-z-]+(?=\\.${extension}$)`);
  let result = regex.exec(sourceFile);
  if (result === null) {
    throw new Error(`Unable to detect file name from sourceFile: ${sourceFile}`);
  }
  return result[0];
}

export type Sheet = {
  reqId: number,
  sig: string,
  status: string,
  version: string,
  table: {
    parseNumHeaders: number,
    cols: Column[],
    rows: Row[]
  }
}

export type Column = {
  id: string,
  label: string,
  type: string,
  pattern?: string
}

export type Row = {
  c : ({
    v: string | number | null,
    f?: string
  } | null)[]
}

/**
 * fetches a google sheet
 * @see {@link Sheet} for return type
 * @see {@link getSheetKey} for getting the key
 * @param sheetName The name of the sheet on the google sheet. (Bottom of page)
 * @param key The key of the google doc
 * @returns sheet
 */
//@see {@link https://developers.google.com/chart/interactive/docs/querylanguage | Google Query Docs} for extending this function.
export async function fetchSheet(sheetName: string, key: string): Promise<Sheet> {
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

/**
 * gets the stored sheet key
 * @returns sheet key if stored, otherwise null
 */
export function getSheetKey():string | null {
  return localStorage.getItem("sheet-key");
}

/**
 * gets or sets the sheet key
 * @param newSheetKey if passed as string, replace the stored sheet key
 * @returns if the sheet key was successfully changed
 * @see {@link fetchSheetAll} for fetching all information after updating the key.
 * @example
 * For `https://docs.google.com/spreadsheets/d/KEY-NAME-HERE/edit`,
 * you would use 
 * ```ts
 * setSheetKey("KEY-NAME-HERE"); //returns false since that key is not valid
 * ```
 */
export async function setSheetKey(newSheetKey: string):Promise<boolean> {
  if (!navigator.onLine) {return false;}
  try {
    let response = await fetch(`https://docs.google.com/spreadsheets/d/${newSheetKey}/edit`);
    if (!response.ok) {throw new Error()}
  } catch {
    return false;
  }
  localStorage.setItem("sheet-key", newSheetKey);
  return true;
}

export type Player = {
  readonly name: string,
  readonly position: Position,
  readonly team: string,
  readonly ranking: number,
  readonly adp: number | undefined,
  readonly depth: number | undefined
}

export enum Position {WR, TE, RB, QB, K, DST}

//local definition of columns for verification
const byeWeeksCols:Column[] = [
  {
      id: "A",
      label: "Team",
      type: "string"
  },
  {
      id: "B",
      label: "Week",
      type: "number"
  }
];

/**
 * Fetch and ignore return result of all sheet data.
 * @see {@link getSheetKey} for getting the key
 * @param key The key of the google doc
 */
export async function fetchSheetAll(key: string) {
  await Promise.all([fetchByeWeeks(key), fetchRankings(key)]);
  return;
}

/**
 * gets the bye weeks if stored
 * @returns bye week for each team in a Map or false if not stored
 */
export function getByeWeeks(): Map<string, number> | false {
  let ls = localStorage.getItem("byeWeeks");
  if (ls !== null) {
    return new Map(JSON.parse(ls));
  }
  return false;
}

/**
 * fetches and stores the bye weeks from google doc
 * uses "bye-week" as sheet name
 * @see {@link getSheetKey} for getting the key
 * @param key The key of the google doc
 * @returns bye week for each team in a Map
 */
export async function fetchByeWeeks(key: string): Promise<Map<string, number>> {
  let sheetResult = await fetchSheet("bye-week", key);
  // verify that the columns are correct
  let cols = sheetResult.table.cols;
  for (let i=0; i<2; i++) {
    let colLocal = byeWeeksCols[i];
    let colRemote = cols[i];
    let keys: (keyof Column)[] = Object.keys(colLocal) as (keyof Column)[];
    if (keys.some((key)=>colLocal[key] !== colRemote[key])) {
      throw new Error("Columns fetched from bye-week sheet do not match expected format!");
    }
  }
  let rows = sheetResult.table.rows;
  let rowMapArr = rows.map((row):[string, number] => {
    let team = row.c[0]?.v;
    let byeWeek = row.c[1]?.v;
    if (!team) {
      team = "UNKNOWN ENTRY"
    }
    if (!byeWeek) {
      byeWeek = -1;
    }
    if (typeof team === "number" || typeof byeWeek === "string") {
      // would be very unexpected since verifying the columns should do the job
      throw new Error("Highly unexpected type error from bye-week columns!\nMake a new issue with your sheet id on GitHub!");
    }
    return [team, byeWeek];
  });

  localStorage.setItem("byeWeeks", JSON.stringify(rowMapArr));
  return new Map(rowMapArr);
}

//local definition of columns for verification
const rankingsCols:Column[] = [
  {
      id: "A",
      label: "Name",
      type: "string"
  },
  {
      id: "B",
      label: "Position",
      type: "string"
  },
  {
      id: "C",
      label: "Team",
      type: "string"
  },
  {
      id: "D",
      label: "ADP",
      type: "number"
  },
  {
      id: "E",
      label: "Depth",
      type: "number"
  }
]

/**
 * gets player rankings if stored
 * @returns Array of every player or false if not stored
 * @see {@link Player} for information about players
 */
export function getRankings(): Player[] | false {
  let ls = localStorage.getItem("rankings");
  if (ls !== null) {
    return JSON.parse(ls);
  }
  return false;
}

/**
 * fetches and stores the player rankings from google doc
 * uses "rankings" as sheet name
 * @see {@link getSheetKey} for getting the key
 * @param key The key of the google doc
 * @returns Array of every player
 * @see {@link Player} for information about players
 */
export async function fetchRankings(key: string): Promise<Player[]> {
    
  let sheetResult = await fetchSheet("rankings", key);
  // verify that the columns are correct
  let cols = sheetResult.table.cols;
  for (let i=0; i<2; i++) {
    let colLocal = rankingsCols[i];
    let colRemote = cols[i];
    let keys: (keyof Column)[] = Object.keys(colLocal) as (keyof Column)[];
    if (keys.some((key)=>colLocal[key] !== colRemote[key])) {
      throw new Error("Columns fetched from rankings sheet do not match expected format!");
    }
  }
  let rows = sheetResult.table.rows;
  let playerArr = rows.map((row, index):Player => {
    let [name, positionStr, team, adp, depth] = row.c.map(i => {
      if (i === null || i.v === null) {return undefined;}
      return i.v;
    });
    if (typeof name !== "string" 
      || typeof positionStr !== "string"
      || !(positionStr in Position)
      || typeof team !== "string"
      || typeof adp === "string"
      || typeof depth === "string") {
      // would be very unexpected since verifying the columns should do the job
      throw new Error("Highly unexpected type error from rankings columns!\nMake a new issue with your sheet id on GitHub!");
    }
    let position = Position[positionStr as keyof typeof Position];
    return {
      name,
      position,
      team,
      ranking: index + 1, //index 0 is #1 player
      adp,
      depth
    };
  });

  localStorage.setItem("rankings", JSON.stringify(playerArr));
  return playerArr;
}