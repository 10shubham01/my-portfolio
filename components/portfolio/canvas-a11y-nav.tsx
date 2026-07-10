import { getIndexableCanvasItemIds, getCanvasItemMeta } from "@/lib/canvas-meta"
import { SITE } from "@/lib/canvas-data"

// The portfolio is a pan/zoom canvas that only renders client-side (it returns
// null on the server until `ready`). That leaves the initial HTML almost empty,
// which is bad for both screen-reader users and crawlers. This server-rendered
// layer is visually hidden (sr-only) but carries the real, indexable content:
// an <h1> with the name, a short bio paragraph, and a <nav> of anchor links to
// every card's deeplink. Same content the canvas shows — just guaranteed to be
// in the HTML without JavaScript, so a name search reliably resolves here.
export function CanvasA11yNav() {
  const ids = getIndexableCanvasItemIds()

  return (
    <>
      <a
        href="#canvas-main"
        className="sr-only rounded bg-white px-3 py-2 font-mono text-sm text-[#18A0FB] shadow focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200]"
      >
        Skip to content
      </a>

      <header className="sr-only">
        <h1>{SITE.name}</h1>
        <p>
          {SITE.name} is a {SITE.title.toLowerCase()} at {SITE.company}, based in{" "}
          {SITE.location}, India. He builds fast, thoughtful web experiences with
          React, Next.js, Vue, and TypeScript, and was previously a senior
          engineer at novio.
        </p>
      </header>

      <nav aria-label="Portfolio sections" className="sr-only">
        <h2>Explore the portfolio</h2>
        <ul>
          {ids.map((id) => {
            const { title } = getCanvasItemMeta(id)
            return (
              <li key={id}>
                <a href={`/?to=${id}`}>{title.split(" · ")[0]}</a>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
