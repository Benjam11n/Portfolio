export const EMPTY_SEARCH_TERMS: string[] = [];

export const itemSizeConfig = {
  large: {
    cardClass: "gap-3 p-3",
    imageClass: "h-14 w-14",
    imagePadding: "p-1",
    imageSize: 56,
    nameClass: "text-base",
    textOffset: "ml-3",
  },
  small: {
    cardClass: "gap-2 p-2",
    imageClass: "h-10 w-10",
    imagePadding: "p-1.5",
    imageSize: 40,
    nameClass: "text-sm",
    textOffset: "ml-2",
  },
} as const;
