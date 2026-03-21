import { World } from "@/types/tab";
import {
  world1Level1,
  world1Level2,
  world1Level3,
  world1Level4,
  world1Level5,
  world1Level6,
  world1Level7,
  world1Level8,
} from "@/data/levelLibrary";

const world1: World = {
  id: "world1",
  number: 1,
  title: "First Songs",
  description: "The opening world is now built around familiar public-domain songs so new players hear something real before the path gets more demanding.",
  accentColor: "#E8B84B",
  levels: [
    world1Level1,
    world1Level2,
    world1Level3,
    world1Level4,
    world1Level5,
    world1Level6,
    world1Level7,
    world1Level8,
  ],
};

export default world1;
