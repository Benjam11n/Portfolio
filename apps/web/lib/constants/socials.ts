import { Github, Linkedin, Mail, Send } from "lucide-react";
import type { ContactInfo } from "@/lib/types";

const EMAIL = "youcanfindbenjamin@gmail.com";

export const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    title: "Email",
    value: EMAIL,
    link: `mailto:${EMAIL}`,
  },
  {
    icon: Send,
    title: "Telegram",
    value: "@benjaminwjy",
    link: "https://t.me/benjaminwjy",
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/benjaminwang-sg/",
  },
  {
    icon: Github,
    title: "Github",
    link: "https://github.com/Benjam11n",
  },
];
