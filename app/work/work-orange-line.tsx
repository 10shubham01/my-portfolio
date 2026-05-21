"use client";

import { useEffect, useState } from "react";

import { OrangeMidLine } from "@/components/orange-mid-line";

export function WorkOrangeLine() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const syncFromBody = () => {
      setIsVideoModalOpen(document.body.getAttribute("data-work-video-modal-open") === "true");
    };

    syncFromBody();

    const observer = new MutationObserver(syncFromBody);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-work-video-modal-open"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <OrangeMidLine
      data-work-orange-line="true"
      className={`transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVideoModalOpen ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}
