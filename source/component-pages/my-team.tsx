export default function() {
  let pD = getRankings();
  let bW = getByeWeeks();
  if (!pD || !bW) {
      return <>
      <h1>Team Page</h1>
      <p>You have not set your sheet key yet. Go to settings and set your sheet key!</p>;
      </>
  }

  let playerData = pD;
  let byeWeeks = bW;
  let userSelection: string[] = JSON.parse(localStorage.getItem("userSelection") || "[]");
  return <h1>Team Page</h1>
};