import { World } from "@/types/tab";
import world2Level1 from "@/data/levels/world2-level1";
import world2Level2 from "@/data/levels/world2-level2";
import world2Level3 from "@/data/levels/world2-level3";
import world2Level4 from "@/data/levels/world2-level4";
import world2Level5 from "@/data/levels/world2-level5";
import world2Level6 from "@/data/levels/world2-level6";

const world2: World = {
  id: "world2",
  number: 2,
  title: "Beyond the Box",
  description: "Am pentatonic 4-note groups, ascending and descending sequences, string skipping, position linking. All at higher BPM. The gap between knowing the scale and using it.",
  accentColor: "#3a7a6b",
  levels: [
    world2Level1,
    world2Level2,
    world2Level3,
    world2Level4,
    world2Level5,
    world2Level6,
  ],
};

export default world2;
