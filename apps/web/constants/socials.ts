import { Linkedin, Mail, MapPin, Send } from "lucide-react";
import type { ContactInfo } from "@/types";

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
    icon: MapPin,
    title: "Location",
    value: "Singapore, Singapore",
    link: "https://www.google.com/maps?sca_esv=be29cc62fc8e0244&output=search&q=singapore&source=lnms&fbs=ABzOT_CWdhQLP1FcmU5B0fn3xuWpmDtIGL1r84kuKz6yAcD_ivAVmKZxU_UoutG-TG5lqbs6lRwhrq5ZB_F86GMJ9ziSEjGRiIlIm49QFZ29HJnTOtclbEBLRvQNU_hFpwv3LwPOP_-zf-eYJHllGGkzKgeHQLdB6B3-VlFzSxJCns_CBWmxXgHXIh2DMBlpTcTUYuIudKaBVuiYfrixm0RVLzkD2wC-zA&entry=mc&ved=1t:200715&ictx=111",
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/benjaminwang-sg/",
  },
];
