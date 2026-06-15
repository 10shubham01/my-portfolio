import Link from "next/link"
import { SITE } from "@/lib/canvas-data"

export default function NotFound() {
  return (
    <main
      className="flex min-h-full flex-col items-center justify-center px-6 text-center"
      style={{
        background: "#f5f5f5",
        backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <p className="font-mono text-xs tracking-[0.28em] text-gray-400 uppercase">404</p>
      <h1 className="mt-4 font-geist text-3xl font-medium tracking-tight text-gray-900">
        Lost on the canvas
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">
        This frame doesn&apos;t exist. Maybe Spidey webbed it away — head back to{" "}
        {SITE.name}&apos;s portfolio.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md border border-gray-200 bg-white px-5 py-2.5 font-mono text-xs font-medium tracking-wide text-[#18A0FB] shadow-sm transition-colors hover:bg-gray-50"
      >
        Return home
      </Link>
    </main>
  )
}
