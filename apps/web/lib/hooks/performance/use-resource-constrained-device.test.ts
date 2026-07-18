import { isResourceConstrainedDevice } from "./use-resource-constrained-device";

describe(isResourceConstrainedDevice, () => {
  it("detects conservative resource constraints", () => {
    expect(
      isResourceConstrainedDevice({ hardwareConcurrency: 2 })
    ).toBeTruthy();
    expect(isResourceConstrainedDevice({ deviceMemory: 4 })).toBeTruthy();
    expect(isResourceConstrainedDevice({ saveData: true })).toBeTruthy();
  });

  it("accepts capable or unknown devices", () => {
    expect(
      isResourceConstrainedDevice({
        deviceMemory: 8,
        hardwareConcurrency: 4,
        saveData: false,
      })
    ).toBeFalsy();
    expect(isResourceConstrainedDevice({})).toBeFalsy();
  });
});
