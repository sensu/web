import { Md5 } from "ts-md5";

enum NamespaceIcon {
  BRIEFCASE = "BRIEFCASE",
  DONUTSM = "DONUTSM",
  DONUT = "DONUT",
  EMOTICON = "EMOTICON",
  EXPLORE = "EXPLORE",
  FIRE = "FIRE",
  HEART = "HEART",
  HALFHEART = "HALFHEART",
  MUG = "MUG",
  ESPRESSO = "ESPRESSO",
  POLYGON = "POLYGON",
  VISIBILITY = "VISIBILITY",
}

export const findIcon = (name: string) => {
  const hash = Md5.hashStr(name, true) as Int32Array;
  const iconIds = Object.keys(NamespaceIcon);
  return iconIds[Math.abs(hash[0]) % iconIds.length];
};
