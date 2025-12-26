"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Magnetic } from "@/components/effects/magnetic";
import { BorderedImage } from "@/components/shared/bordered-image";
import { ROUTES } from "@/constants/navigation";
import type { Project } from "@/types";

export const ProjectCard = ({ project }: { project: Project }) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const { contextSafe } = useGSAP({ scope: cardRef });

	const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;
		const { left, top, width, height } =
			cardRef.current.getBoundingClientRect();
		const x = e.clientX - left;
		const y = e.clientY - top;
		const xPercent = (x / width - 0.5) * 2; // -1 to 1
		const yPercent = (y / height - 0.5) * 2; // -1 to 1

		gsap.to(cardRef.current, {
			rotateY: xPercent * 5,
			rotateX: -yPercent * 5,
			transformPerspective: 1000,
			duration: 0.5,
			ease: "power2.out",
		});
	});

	const handleMouseLeave = contextSafe(() => {
		gsap.to(cardRef.current, {
			rotateY: 0,
			rotateX: 0,
			duration: 0.5,
			ease: "power2.out",
		});
	});

	return (
		<div
			className="project-card-item group block w-full cursor-pointer rounded-xl bg-card p-2 shadow-sm transition-shadow duration-500 hover:shadow-2xl sm:p-2 sm:pb-4"
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
			ref={cardRef}
		>
			<Link href={ROUTES.PROJECT_DETAIL(project.id)}>
				{/* Visual Part */}
				<div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
					{project.texture ? (
						<video
							autoPlay
							className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							loop
							muted
							playsInline
							src={project.texture}
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-muted-foreground">
							No Preview
						</div>
					)}

					{project.logo && (
						<div className="absolute top-4 left-4">
							<Magnetic>
								<div
									className="rounded-xl bg-card/90 p-2 shadow-sm backdrop-blur-sm"
									style={project.logoStyle}
								>
									<Image
										alt="logo"
										className="h-6 w-6 object-contain"
										height={24}
										src={project.logo}
										width={24}
									/>
								</div>
							</Magnetic>
						</div>
					)}
				</div>

				{/* Content Part */}
				<div className="mt-4 flex flex-col items-center gap-4 px-2">
					<h3 className="font-semibold text-foreground text-lg leading-snug">
						{project.title.split(" - ")[0]}
						{project.title.split(" - ")[1] && (
							<span className="font-semibold text-muted-foreground">
								{" - "}
								{project.title.split(" - ")[1]}
							</span>
						)}
					</h3>

					{!!project.techStack.length && (
						<div className="flex flex-wrap items-center justify-center gap-2 pb-2">
							{project.techStack.map((tech) => (
								<Magnetic key={tech.name}>
									<div className="cursor-pointer">
										<BorderedImage
											alt={tech.name}
											colorDark={tech.colorDark}
											colorLight={tech.colorLight}
											containerClassName="h-10 w-10 shrink-0"
											height={20}
											imageClassName="p-[6px]"
											src={tech.path}
											width={20}
										/>
									</div>
								</Magnetic>
							))}
						</div>
					)}
				</div>
			</Link>
		</div>
	);
};
