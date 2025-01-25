"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function ProjectCard({ title, description, image, link }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-full"
      whileHover={{ scale: 1.05, rotateY: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
          />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          <a
            href={link}
            className="inline-block mt-4 text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project →
          </a>
        </div>
      </Card>
    </motion.div>
  );
}