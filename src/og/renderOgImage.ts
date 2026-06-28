import satori from "satori";
import sharp from "sharp";
import { createElement } from "react";
import { OgCard } from "./OgCard";
import { loadFonts } from "./fonts";
import type { OgSpec } from "./spec";

export async function renderOgImage(spec: OgSpec): Promise<Buffer> {
  const fonts = loadFonts();

  const svg = await satori(createElement(OgCard, { spec }), {
    width: 1200,
    height: 630,
    fonts,
  });

  return sharp(Buffer.from(svg)).png({ compressionLevel: 8 }).toBuffer();
}
