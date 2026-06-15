"use client"

type NavItem = {
  id: string
  label: string
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 4h12M2 8h12M2 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DashedRule() {
  return (
    <svg width="100%" height="1" className="my-3 overflow-visible" shapeRendering="crispEdges">
      <line
        x1="0"
        y1="0.5"
        x2="100%"
        y2="0.5"
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray="4 4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function CanvasMenu({
  open,
  onOpenChange,
  selectedId,
  items,
  onNavigateToItem,
  onResetCanvas,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedId: string | null
  items: NavItem[]
  onNavigateToItem: (id: string) => void
  onResetCanvas?: () => void
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          onPointerDown={() => onOpenChange(false)}
        />
      )}

      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-[color,box-shadow,border-color] hover:border-gray-300 hover:text-gray-900 hover:shadow"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          className={`w-64 origin-top-right rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-[opacity,transform] duration-200 ease-out ${
            open
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-[0.98] opacity-0"
          }`}
        >
          <p className="font-mono text-[11px] font-medium tracking-widest text-gray-400 uppercase">
            Navigate
          </p>

          <nav className="mt-3 flex flex-col" aria-label="Canvas navigation">
            {items.map((item) => {
              const active = selectedId === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateToItem(item.id)}
                  className="group flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition-colors hover:bg-gray-50"
                >
                  <span
                    className={`font-mono text-[12px] ${
                      active ? "font-medium text-[#18A0FB]" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`font-mono text-[11px] transition-colors ${
                      active
                        ? "text-[#18A0FB]"
                        : "text-gray-400 group-hover:text-gray-700"
                    }`}
                  >
                    {active ? "[ HERE ]" : "[ GO ]"}
                  </span>
                </button>
              )
            })}
          </nav>

          <DashedRule />

          <button
            type="button"
            onClick={() => onResetCanvas?.()}
            className="group flex w-full items-center justify-center rounded-md px-2 py-2 font-mono text-[11px] text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            [ RESET CANVAS ]
          </button>
        </div>
      </div>
    </>
  )
}
