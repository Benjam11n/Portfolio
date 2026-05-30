interface CardDepthProps {
  primaryEdgeColor: string;
  secondaryEdgeColor: string;
  thickness: number;
}

export const CardDepth = ({
  primaryEdgeColor,
  secondaryEdgeColor,
  thickness,
}: CardDepthProps) => {
  const halfThickness = thickness / 2;

  return (
    <>
      <div
        className="pointer-events-none absolute bottom-0"
        style={{
          backfaceVisibility: "hidden",
          background: `linear-gradient(to bottom, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
          height: thickness,
          left: halfThickness,
          right: halfThickness,
          transform: `translateY(${halfThickness}px) rotateX(-90deg)`,
        }}
      />
      <div
        className="pointer-events-none absolute top-0"
        style={{
          backfaceVisibility: "hidden",
          background: `linear-gradient(to top, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
          height: thickness,
          left: halfThickness,
          right: halfThickness,
          transform: `translateY(-${halfThickness}px) rotateX(90deg)`,
        }}
      />
      <div
        className="pointer-events-none absolute top-0 right-0 h-full rounded-r-xl"
        style={{
          backfaceVisibility: "hidden",
          background: `linear-gradient(to right, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
          transform: `translateX(${halfThickness}px) rotateY(90deg)`,
          width: thickness,
        }}
      />
      <div
        className="pointer-events-none absolute top-0 left-0 h-full rounded-l-xl"
        style={{
          backfaceVisibility: "hidden",
          background: `linear-gradient(to left, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
          transform: `translateX(-${halfThickness}px) rotateY(-90deg)`,
          width: thickness,
        }}
      />
      <div
        className="pointer-events-none absolute top-0 left-0 h-full w-full rounded-xl bg-muted"
        style={{
          backfaceVisibility: "hidden",
          transform: `translateZ(-${halfThickness}px) rotateY(180deg)`,
        }}
      />
    </>
  );
};
