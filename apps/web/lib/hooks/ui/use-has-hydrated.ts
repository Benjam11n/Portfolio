"use client";

import { useSyncExternalStore } from "react";

const unsubscribeFromHydration = () => {
  // useSyncExternalStore needs a cleanup function; no subscription is opened.
};
const subscribeToHydration = () => unsubscribeFromHydration;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const useHasHydrated = () =>
  useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );
