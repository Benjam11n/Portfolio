"use client";

import { useSyncExternalStore } from "react";

const MAX_CONSTRAINED_LOGICAL_CORES = 6;
const MAX_CONSTRAINED_DEVICE_MEMORY_GB = 4;

interface DevicePerformanceSignals {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  saveData?: boolean;
}

interface NetworkInformation {
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
  saveData?: boolean;
}

interface NavigatorWithPerformanceSignals extends Navigator {
  connection?: NetworkInformation;
  deviceMemory?: number;
}

export const isResourceConstrainedDevice = ({
  deviceMemory,
  hardwareConcurrency,
  saveData,
}: DevicePerformanceSignals) =>
  saveData === true ||
  (typeof hardwareConcurrency === "number" &&
    hardwareConcurrency <= MAX_CONSTRAINED_LOGICAL_CORES) ||
  (typeof deviceMemory === "number" &&
    deviceMemory <= MAX_CONSTRAINED_DEVICE_MEMORY_GB);

const getNavigator = () => navigator as NavigatorWithPerformanceSignals;

const getSnapshot = () => {
  const deviceNavigator = getNavigator();

  return isResourceConstrainedDevice({
    deviceMemory: deviceNavigator.deviceMemory,
    hardwareConcurrency: deviceNavigator.hardwareConcurrency,
    saveData: deviceNavigator.connection?.saveData,
  });
};

const subscribe = (onStoreChange: () => void) => {
  const { connection } = getNavigator();
  connection?.addEventListener?.("change", onStoreChange);

  return () => connection?.removeEventListener?.("change", onStoreChange);
};

export const useIsResourceConstrainedDevice = () =>
  useSyncExternalStore(subscribe, getSnapshot, () => true);
