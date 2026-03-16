import { World } from "@/types/tab";
import world1Level1 from "@/data/levels/world1-level1";
import world1Level2 from "@/data/levels/world1-level2";
import world1Level3 from "@/data/levels/world1-level3";
import world1Level4 from "@/data/levels/world1-level4";
import world1Level5 from "@/data/levels/world1-level5";
import world1Level6 from "@/data/levels/world1-level6";

const world1: World = {
  id: "world1",
  number: 1,
  title: "The Fundamentals",
  description: "Four essential pentatonic exercises — 4-note groups, pedal tone, diatonic 3rds, descending sequences. The techniques that turn a scale shape into something you can actually play.",
  accentColor: "#f5a623",
  levels: [
    world1Level1,
    world1Level2,
    world1Level3,
    world1Level4,
    world1Level5,
    world1Level6,
  ],
};

export default world1;
