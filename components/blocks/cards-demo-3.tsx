"use client";
import { animate, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  DiscordLogoIcon,
  EnvelopeClosedIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { RiFileDownloadFill } from "react-icons/ri";
export default function CardDemo() {
  return <Skeleton />;
}

const Skeleton = () => {
  const scale = [1, 1.1, 1];
  const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
  const sequence = [
    [
      ".circle-1",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-2",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-3",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-4",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-5",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ];

  useEffect(() => {
    animate(sequence, {
      //@ts-ignore
      repeat: Infinity,
      repeatDelay: 1,
    });
  }, []);
  return (
    <div className="overflow-hidden h-full relative flex items-center py-4">
      <div className="flex flex-row flex-shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <a href="https://x.com/10Shubham01" target="_blank">
            <TwitterLogoIcon className="h-4 w-4 " />
          </a>
        </Container>
        <Container className="h-12 w-12 circle-2">
          <a
            href="https://www.linkedin.com/in/shubhamgupta001/"
            target="_blank"
          >
            <LinkedInLogoIcon className="h-6 w-6 dark:text-white" />
          </a>
        </Container>
        <Container className="circle-3">
          <a href="https://github.com/10shubham01" target="_blank">
            <GitHubLogoIcon className="h-8 w-8 dark:text-white" />
          </a>
        </Container>
        <Container className="h-12 w-12 circle-4">
          <a href="mailto:shubhamedu.01@email.com" target="_blank">
            <EnvelopeClosedIcon className="h-6 w-6 " />
          </a>
        </Container>
        <Container className="h-8 w-8 circle-5">
          <a
            href="https://pub-37e1aa402ba24ef28ab68650caa7a432.r2.dev/SHUBHAM_GUPTA_RESUME.pdf"
            download
            target="_blank"
          >
            <RiFileDownloadFill className="h-4 w-4 " />
          </a>
        </Container>
      </div>
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    dark:shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] shadow-[0px_0px_8px_0px_lightgrey_inset,0px_32px_24px_-32px_rgba(0,0,0,0.40)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};
