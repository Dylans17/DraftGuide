#warn
SetWorkingDir %A_ScriptDir%

InputBox, CsvFile, File Selection, What is the name of the rankings file?, , 250, 150
if CsvFile not contains .csv
  CsvFile := CsvFile . ".csv"

if (!FileExist(CsvFile)) {
  MsgBox File Not Found
  ExitApp
}
version := A_YDay . A_Hour . A_Min . A_Sec
FileDelete rankings.js
FileAppend let version = %version%;`nlet players = [, rankings.js

firstLine := true
Loop, read, %CsvFile%, rankings.js
{
  if (firstLine) {
    firstLine := false
    continue
  }
  line := Trim(A_LoopReadLine)
  StringReplace line, line, ' , \' , 1
  line := StrSplit(line,","," `t", 4)
  FileAppend % "{name: '" . line[1] . "'`, pos:'" . line[2] . "'`, team:'" . line[3] . "'"
  if (line[4]) {
    FileAppend % "`, inj:'" . line[4] . "'"
  }
  FileAppend }`,
}
FileAppend ], rankings.js

MsgBox Conversion Complete`nVersion: %version%
