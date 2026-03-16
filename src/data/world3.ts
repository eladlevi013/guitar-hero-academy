import { World } from "@/types/tab";
import world3Level1 from "@/data/levels/world3-level1";
import world3Level2 from "@/data/levels/world3-level2";
import world3Level3 from "@/data/levels/world3-level3";
import world3Level4 from "@/data/levels/world3-level4";
import world3Level5 from "@/data/levels/world3-level5";
import world3Level6 from "@/data/levels/world3-level6";

const world3: World = {
  id: "world3",
  number: 3,
  title: "Technique Forge",
  description: "Higher positions, faster tempos, and new scale shapes — this is where real technique is forged.",
  accentColor: "#a83a1e",
  levels: [
    world3Level1,
    world3Level2,
    world3Level3,
    world3Level4,
    world3Level5,
    world3Level6,
  ],
};

export default world3;
