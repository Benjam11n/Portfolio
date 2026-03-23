import type { Certification } from "@/lib/types";
import { certificationsArraySchema } from "@/lib/validations/constants";

const rawCertifications: Certification[] = [
  {
    date: "Oct 2025",
    description:
      "Advanced program on building **generative AI systems** with **RAG**, **multimodal AI**, and **autonomous multiagent frameworks**.",
    image: "/certifications/rag-agentic-ai.png",
    name: "IBM RAG and Agentic AI",
    organization: "IBM",
  },
  {
    date: "Nov 2025",
    description:
      "Foundational 5-course series covering **neural networks**, **CNNs**, **RNNs**, and **Transformers** for real-world AI applications.",
    image: "/certifications/deep-learning-specialization.png",
    name: "Deep Learning Specialization",
    organization: "Deeplearning.AI",
  },
  {
    date: "Apr 2025",
    description:
      "Practical guide to deploying and orchestrating web applications using **Docker containers** and **Kubernetes clusters**.",
    image: "/certifications/docker-kubernetes.png",
    name: "Docker and Kubernetes: The Complete Guide",
    organization: "Udemy",
  },
  {
    date: "Apr 2025",
    description:
      "Hands-on bootcamp for building and deploying **neural networks** for **image classification** and **time series** using **PyTorch**.",
    image: "/certifications/pytorch-deep-learning.png",
    name: "PyTorch for Deep Learning Bootcamp",
    organization: "Udemy",
  },
  {
    date: "Jan 2025",
    description:
      "Comprehensive introduction to **supervised learning**, **advanced neural networks**, and **unsupervised recommender systems**.",
    image: "/certifications/machine-learning.png",
    name: "Machine Learning Specialization",
    organization: "Deeplearning.AI",
  },
  {
    date: "Dec 2023",
    description:
      "Project-based mastery of **React**, **Next.js**, and **modern state management** for building professional web applications.",
    image: "/certifications/react-ultimate.png",
    name: "The Ultimate React Course 2024: React, Next.js, Redux & More",
    organization: "Udemy",
  },
];

const validatedCertifications =
  certificationsArraySchema.parse(rawCertifications);

export const CERTIFICATIONS: Certification[] = validatedCertifications;
