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
  title: "The 5 Positions",
  description: "All five Em pentatonic positions, full 6-string range each. Same scale from open to fret 12 — five different hand shapes. Finish with the Grand Sweep at 100 BPM.",
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
