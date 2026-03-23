import { Github, Linkedin, Mail, Send } from "lucide-react";

import type { ContactInfo } from "@/lib/types";

const EMAIL = "youcanfindbenjamin@gmail.com";

export const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    link: `mailto:${EMAIL}`,
    title: "Email",
    value: EMAIL,
  },
  {
    icon: Send,
    link: "https://t.me/benjaminwjy",
    title: "Telegram",
    value: "@benjaminwjy",
  },
  {
    icon: Linkedin,
    link: "https://www.linkedin.com/in/benjaminwang-sg/",
    title: "LinkedIn",
  },
  {
    icon: Github,
    link: "https://github.com/Benjam11n",
    title: "Github",
  },
];
