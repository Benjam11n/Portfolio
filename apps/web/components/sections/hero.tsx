"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BadgeCheck } from "lucide-react";
import { useRef } from "react";
import { Magnetic } from "@/components/effects/magnetic";
import { BorderedImage } from "@/components/shared/bordered-image";
import { SectionCard } from "@/components/shared/section-card";
import { ShiftButton } from "@/components/shared/shift-button";
import { ROUTES } from "@/constants/navigation";

export const Hero = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

			mm.add(
				{
					isDesktop: "(min-width: 768px)",
					isMobile: "(max-width: 767px)",
				},
				(context) => {
					const { isDesktop } = context.conditions as { isDesktop: boolean };
					const offset = isDesktop ? -220 : -40;

					// Image: Scale up from center, smooth pop
					tl.fromTo(
						imageRef.current,
						{
							scale: 0,
							x: offset,
							autoAlpha: 0,
							rotate: -15,
						},
						{
							scale: 1,
							x: 0,
							autoAlpha: 1,
							rotate: 0,
							duration: 1.2,
							ease: "elastic.out(1, 0.75)",
						},
					);

					// Name: Character-by-character reveal
					tl.to(
						".char",
						{
							y: 0,
							autoAlpha: 1,
							duration: 0.8,
							stagger: 0.03,
							ease: "power4.out",
						},
						"-=0.6",
					);

					// Badge: Snap pop after name
					tl.fromTo(
						".hero-badge",
						{ scale: 0, autoAlpha: 0 },
						{
							scale: 1,
							autoAlpha: 1,
							duration: 0.5,
							ease: "back.out(2)",
						},
						"-=0.4",
					);

					tl.fromTo(
						".hero-text",
						{
							y: 40,
							autoAlpha: 0,
						},
						{
							y: 0,
							autoAlpha: 1,
							duration: 1,
							stagger: 0.15,
							ease: "power4.out",
						},
						"-=0.8",
					);

					tl.fromTo(
						buttonsRef.current?.children || [],
						{
							y: 20,
							autoAlpha: 0,
						},
						{
							y: 0,
							autoAlpha: 1,
							duration: 0.8,
							stagger: 0.1,
							ease: "power3.out",
						},
						"-=0.6",
					);
				},
			);
		},
		{ scope: containerRef },
	);

	return (
		<SectionCard id="hero">
			<div ref={containerRef}>
				{/* Profile Image */}
				<div ref={imageRef} className="inline-block">
					<Magnetic strength={0.4}>
						<BorderedImage
							alt="Benjamin Wang"
							containerClassName="mb-6 h-[72px] w-[72px]"
							height={72}
							src="/benjamin.png"
							colorLight="#3f3f3fff"
							colorDark="#838383ff"
							width={72}
						/>
					</Magnetic>
				</div>

				{/* Name and Badge */}
				<div className="mb-2 flex items-center gap-2">
					<h1 className="hero-name flex overflow-hidden font-bold text-foreground text-xl tracking-tight sm:text-2xl">
						{"Benjamin Wang".split("").map((char, i) => (
							<span
								className="char inline-block translate-y-full opacity-0"
								key={`${char}-${i}`}
							>
								{char === " " ? "\u00A0" : char}
							</span>
						))}
					</h1>
					<div className="hero-badge opacity-0">
						<BadgeCheck
							className="h-6 w-6"
							strokeWidth={2.5}
							style={{
								fill: "#1DA1F2",
								color: "white",
							}}
						/>
					</div>
				</div>

				{/* Role */}
				<h2 className="hero-text mb-6 font-medium text-md text-muted-foreground">
					Web Designer
				</h2>

				{/* Description */}
				<p className="hero-text mb-8 max-w-sm font-sans text-foreground text-md leading-relaxed">
					Crafting interactive, user-centered experiences that bring ideas to
					life through thoughtful design and seamless digital execution.
				</p>

				{/* Buttons */}
				<div className="flex flex-wrap gap-4" ref={buttonsRef}>
					<Magnetic strength={0.2}>
						<ShiftButton href={ROUTES.CONTACT} variant="primary">
							Contact Me
						</ShiftButton>
					</Magnetic>
					<Magnetic strength={0.2}>
						<ShiftButton href={ROUTES.PROJECTS} variant="secondary">
							View Projects
						</ShiftButton>
					</Magnetic>
				</div>
			</div>
		</SectionCard>
	);
};
