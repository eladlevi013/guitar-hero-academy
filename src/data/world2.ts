import { World } from "@/types/tab";
import {
  world2Level1,
  world2Level2,
  world2Level3,
  world2Level4,
  world2Level5,
  world2Level6,
  world2Level7,
  world2Level8,
} from "@/data/levelLibrary";

const world2: World = {
  id: "world2",
  number: 2,
  title: "Song Weight",
  description: "The middle world keeps familiar songs in play but adds roots, march feel, and study-style motion so the guitar parts feel fuller.",
  accentColor: "#4B9BE8",
  levels: [
    world2Level1,
    world2Level2,
    world2Level3,
    world2Level4,
    world2Level5,
    world2Level6,
    world2Level7,
    world2Level8,
  ],
};

export default world2;
