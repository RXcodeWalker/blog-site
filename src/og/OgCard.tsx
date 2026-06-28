import type { OgSpec } from "./spec";
import { getCategoryColors } from "./categoryColors";
import { prepareText } from "./fallbackGlyphs";

const BG = "#1b1922";
const FG = "#f0ede6";
const MUTED = "#8b8a99";
const SITE_NAME = "Beyond the Basics";

// 64×64 Perlin noise PNG baked as base64, tiled as subtle texture overlay
const NOISE_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAA" +
  "CXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AUVDxYwBVQLfwAAAGpJREFUeNrt0DEBAAAIAzD9S7fGwCLBBgAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe" +
  "AMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAJQAA2AEIAAGm+BEAAAAASUVORK5CYII=";

const CHARS_PER_LINE = 22;

function estimateLines(text: string, fontSize: number): number {
  const charsPerLine = fontSize === 68 ? CHARS_PER_LINE : Math.round(CHARS_PER_LINE * 68 / 52);
  return Math.ceil(text.length / charsPerLine);
}

interface CardProps {
  spec: OgSpec;
}

export function OgCard({ spec }: CardProps) {
  if (spec.type === "post") {
    return <PostCard spec={spec} />;
  }
  if (spec.type === "category") {
    return <CategoryCard spec={spec} />;
  }
  return <DefaultCard siteName={SITE_NAME} subtitle={spec.type === "home" ? "Personal blog by Om Jhamvar" : ""} />;
}

function PostCard({ spec }: { spec: Extract<OgSpec, { type: "post" }> }) {
  const colors = getCategoryColors(spec.category);
  const title = prepareText(spec.title, 120);
  const excerpt = prepareText(spec.excerpt, 100);
  const titleLines = estimateLines(title, 68);
  const titleFontSize = titleLines >= 3 ? 52 : 68;
  const showExcerpt = titleLines <= 2;

  return (
    <div
      style={{
        display: "flex",
        width: 1200,
        height: 630,
        backgroundColor: BG,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${NOISE_URI})`,
          backgroundRepeat: "repeat",
          opacity: 0.04,
        }}
      />

      {/* Radial glow top-right */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}14 0%, transparent 70%)`,
        }}
      />

      {/* Left accent stripe */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: colors.accent,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "72px 72px 0 84px",
          flex: 1,
        }}
      >
        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              border: `1px solid ${colors.accent}`,
              borderRadius: 2,
              padding: "6px 14px",
              color: colors.accent,
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {spec.category.toUpperCase()}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "Fraunces",
            fontWeight: 300,
            fontSize: titleFontSize,
            lineHeight: 1.05,
            color: FG,
            maxWidth: 900,
            wordBreak: "break-word",
          }}
        >
          {title}
        </div>

        {/* Excerpt */}
        {showExcerpt && excerpt && (
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontFamily: "Fraunces",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: 22,
              color: MUTED,
              maxWidth: 820,
            }}
          >
            {excerpt}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 75,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 84px",
          gap: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 13,
            color: FG,
          }}
        >
          {spec.author}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 12,
            color: colors.accent,
          }}
        >
          · {spec.readingTimeMinutes} min read ·
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            fontFamily: "Fraunces",
            fontWeight: 300,
            fontSize: 15,
            color: `${FG}99`,
          }}
        >
          {SITE_NAME}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ spec }: { spec: Extract<OgSpec, { type: "category" }> }) {
  const colors = getCategoryColors(spec.category);

  return (
    <div
      style={{
        display: "flex",
        width: 1200,
        height: 630,
        backgroundColor: BG,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Noise */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${NOISE_URI})`,
          backgroundRepeat: "repeat",
          opacity: 0.04,
        }}
      />

      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}18 0%, transparent 70%)`,
        }}
      />

      {/* Left stripe */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: colors.accent,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "72px 72px 0 84px",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 11,
            color: MUTED,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          SECTION
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontFamily: "Fraunces",
            fontWeight: 300,
            fontSize: 96,
            lineHeight: 0.9,
            color: FG,
          }}
        >
          {spec.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "Fraunces",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: 24,
            color: MUTED,
            maxWidth: 800,
          }}
        >
          {prepareText(spec.tagline, 120)}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 75,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 84px",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            fontFamily: "Fraunces",
            fontWeight: 300,
            fontSize: 15,
            color: `${FG}99`,
          }}
        >
          {SITE_NAME}
        </div>
      </div>
    </div>
  );
}

function DefaultCard({ siteName, subtitle }: { siteName: string; subtitle: string }) {
  return (
    <div
      style={{
        display: "flex",
        width: 1200,
        height: 630,
        backgroundColor: BG,
        position: "relative",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Noise */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${NOISE_URI})`,
          backgroundRepeat: "repeat",
          opacity: 0.04,
        }}
      />

      {/* Subtle center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, #8891c414 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Fraunces",
            fontWeight: 300,
            fontSize: 80,
            color: FG,
            letterSpacing: "-0.02em",
          }}
        >
          {siteName}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 18,
              color: MUTED,
              letterSpacing: "0.05em",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
