import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VideoSlot } from "@/components/site/ui-bits";
import { videos } from "@/lib/media";

// The video spots must stay clearly marked until a real film is linked,
// and must become a real player the moment one is.
describe("VideoSlot", () => {
  it("shows the marked placeholder while no film is linked", () => {
    const { container } = render(<VideoSlot label="How it works — 15 sec video" />);

    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector('[data-video-slot="How it works — 15 sec video"]')).not.toBeNull();
  });

  it("plays the linked film once a source is set", () => {
    const { container } = render(<VideoSlot label="Product film" src="https://cdn.example/vitaday.mp4" poster="https://cdn.example/teaser.jpg" />);

    const video = container.querySelector("video");
    expect(video?.getAttribute("src")).toBe("https://cdn.example/vitaday.mp4");
    expect(video?.getAttribute("poster")).toBe("https://cdn.example/teaser.jpg");
    expect(video?.hasAttribute("controls")).toBe(true);
  });

  it("plays the supplied how-it-works film and leaves the product slot empty", () => {
    expect(videos.howItWorks).toMatch(/^\/__l5e\/assets-v1\/.+vitaday_how_it_works\.mp4$/);
    expect(videos.product).toBeNull();
  });
});
