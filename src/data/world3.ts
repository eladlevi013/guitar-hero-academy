import { World } from "@/types/tab";
import {
  world3Level1,
  world3Level2,
  world3Level3,
  world3Level4,
  world3Level5,
  world3Level6,
  world3Level7,
  world3Level8,
} from "@/data/levelLibrary";

const world3: World = {
  id: "world3",
  number: 3,
  title: "Stage Lift",
  description: "The payoff world: hooky lead lines, harder accents, wider movement, and short solo moments that make progress feel earned.",
  accentColor: "#C84B4B",
  levels: [
    world3Level1,
    world3Level2,
    world3Level3,
    world3Level4,
    world3Level5,
    world3Level6,
    world3Level7,
    world3Level8,
  ],
};

export default world3;
