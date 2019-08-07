import HatchOut from "./hatchOut";

async function main(){
  const hatch = HatchOut.createFromConfig();
  console.log(await hatch.methods.getGhost('0'));
}

main()