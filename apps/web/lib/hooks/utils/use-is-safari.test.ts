import { isSafariUserAgent } from "@/lib/hooks/utils/use-is-safari";

describe(isSafariUserAgent, () => {
  it("detects Safari without matching Chromium browsers", () => {
    expect(
      isSafariUserAgent(
        "Mozilla/5.0 AppleWebKit/605.1.15 Version/18.5 Safari/605.1.15"
      )
    ).toBeTruthy();
    expect(
      isSafariUserAgent(
        "Mozilla/5.0 AppleWebKit/537.36 Chrome/136.0 Safari/537.36"
      )
    ).toBeFalsy();
    expect(
      isSafariUserAgent(
        "Mozilla/5.0 AppleWebKit/537.36 Chrome/136.0 Safari/537.36 Edg/136.0"
      )
    ).toBeFalsy();
  });
});
