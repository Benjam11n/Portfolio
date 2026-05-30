import { BadgeCheck } from "lucide-react";

interface HeroTitleProps {
  characters: { char: string; key: string }[];
}

export const HeroTitle = ({ characters }: HeroTitleProps) => (
  <div className="mb-2 flex items-center gap-2">
    <h1 className="hero-name flex overflow-hidden font-bold text-foreground text-xl tracking-tight sm:text-2xl">
      {characters.map(({ char, key }) => (
        <span
          className="char inline-block translate-y-full opacity-0"
          key={key}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
    <div className="hero-badge opacity-0">
      <BadgeCheck
        className="size-6"
        strokeWidth={2.5}
        style={{
          color: "white",
          fill: "#1DA1F2",
        }}
      />
    </div>
  </div>
);
