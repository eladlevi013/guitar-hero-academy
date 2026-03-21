import world1 from "@/data/world1";
import world2 from "@/data/world2";
import world3 from "@/data/world3";

export const ALL_WORLDS = [world1, world2, world3];

export const WORLDS_BY_NUM = Object.fromEntries(
  ALL_WORLDS.map((world) => [world.number, world] as const),
) as Record<number, (typeof ALL_WORLDS)[number]>;
