import { getIndexableCanvasItemIds, getCanvasItemMeta } from "@/lib/canvas-meta"

// The portfolio is a pan/zoom canvas — invisible to keyboard and screen-reader
// users, and thin for crawlers. This renders a visually-hidden but fully
// accessible skip link + a real <nav> of anchor links to every card's deeplink,
// so the content is reachable without a pointer (and gives crawlers internal
// links to each ?to= URL).
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
