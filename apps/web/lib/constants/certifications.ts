import type { Certification } from "@/lib/types";
import { certificationsArraySchema } from "@/lib/validations/constants";

const rawCertifications: Certification[] = [
  {
    description:
      "Advanced program on building **generative AI systems** with **RAG**, **multimodal AI**, and **autonomous multiagent frameworks**.",
    image: "/certifications/rag-agentic-ai.avif",
    issuedAt: { month: 10, year: 2025 },
    name: "IBM RAG and Agentic AI",
    organization: "IBM",
  },
  {
    description:
      "Foundational 5-course series covering **neural networks**, **CNNs**, **RNNs**, and **Transformers** for real-world AI applications.",
    image: "/certifications/deep-learning-specialization.png",
    issuedAt: { month: 11, year: 2025 },
    name: "Deep Learning Specialization",
    organization: "Deeplearning.AI",
  },
  {
    description:
      "Practical guide to deploying and orchestrating web applications using **Docker containers** and **Kubernetes clusters**.",
    image: "/certifications/docker-kubernetes.png",
    issuedAt: { month: 4, year: 2025 },
    name: "Docker and Kubernetes: The Complete Guide",
    organization: "Udemy",
  },
  {
    description:
      "Hands-on bootcamp for building and deploying **neural networks** for **image classification** and **time series** using **PyTorch**.",
    image: "/certifications/pytorch-deep-learning.png",
    issuedAt: { month: 4, year: 2025 },
    name: "PyTorch for Deep Learning Bootcamp",
    organization: "Udemy",
  },
  {
    description:
      "Comprehensive introduction to **supervised learning**, **advanced neural networks**, and **unsupervised recommender systems**.",
    image: "/certifications/machine-learning.avif",
    issuedAt: { month: 1, year: 2025 },
    name: "Machine Learning Specialization",
    organization: "Deeplearning.AI",
  },
  {
    description:
      "Project-based mastery of **React**, **Next.js**, and **modern state management** for building professional web applications.",
    image: "/certifications/react-ultimate.png",
    issuedAt: { month: 12, year: 2023 },
    name: "The Ultimate React Course 2024: React, Next.js, Redux & More",
    organization: "Udemy",
  },
];

const validatedCertifications =
  certificationsArraySchema.parse(rawCertifications);

export const CERTIFICATIONS: Certification[] = validatedCertifications;
