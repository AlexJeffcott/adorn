import { TextNodesFromDOM, Match, annotateDOM } from "annotate";
function getRandomInt(min, max) {
  return Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)
  ); //The maximum is exclusive and the minimum is inclusive
}

function getRndString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * charactersLength)];
  }
  return result;
}

function createListForMap(len) {
  return Array(len)
    .fill("")
    .map((v, i) => [i.toString(10), [getRndString(getRandomInt(4, 15))]]);
}

const ipsumCS = new Map(createListForMap(9999));
const ipsumCI = new Map(createListForMap(1));

const opts = { tag: "x-annotate" };
const match = new Match(ipsumCI, ipsumCS, opts);
console.log(match.getDetails())
