"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Laptop2, Search, Smartphone, X } from "lucide-react"

import devicesData from "@/data/esimDevices.json"
import { cn } from "@/lib/utils"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const deviceEntries = Object.entries(devicesData).map(([brand, models]) => ({
  brand,
  models,
  type: brand.toLowerCase().includes("laptop") ? "laptop" : "smartphone"
}))

const buildTitle = (entry, query) => {
  if (entry.type === "laptop") {
    return `Laptops${query ? ` (${query})` : ""}`
  }
  return entry.brand
}

const DeviceSection = ({ entry, query }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
      {entry.type === "laptop" ? (
        <Laptop2 className="h-4 w-4 text-green-600" />
      ) : (
        <Smartphone className="h-4 w-4 text-green-600" />
      )}
      <p className="text-base font-semibold text-gray-900">
        {buildTitle(entry, query)}
      </p>
      <span className="text-xs font-normal text-gray-500">({entry.brand})</span>
    </div>
    <div className="space-y-2">
      {entry.models.map((model, index) => (
        <div
          key={`${entry.brand}-${model}-${index}`}
          className="flex items-center gap-2 text-sm text-gray-800"
        >
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="leading-tight">{model}</span>
        </div>
      ))}
    </div>
  </div>
)

export function DeviceCompatibilityDialog({
  children,
  triggerClassName
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (open) {
      setQuery("")
    }
  }, [open])

  const filteredDevices = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return deviceEntries

    return deviceEntries
      .map((entry) => ({
        ...entry,
        models: entry.models.filter(
          (model) =>
            model.toLowerCase().includes(normalized) ||
            entry.brand.toLowerCase().includes(normalized)
        )
      }))
      .filter((entry) => entry.models.length > 0)
  }, [query])

  const laptops = filteredDevices.filter((entry) => entry.type === "laptop")
  const smartphones = filteredDevices.filter((entry) => entry.type !== "laptop")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button
            type="button"
            className={cn(
              "flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900",
              triggerClassName
            )}
          >
            <Smartphone className="h-4 w-4" />
            <span>Check Device Compatibility</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-[min(720px,calc(100vw-2rem))] max-w-3xl translate-y-[-50%] overflow-hidden rounded-3xl border border-gray-200 p-0 shadow-xl"
      >
        <div className="relative bg-white px-5 py-4 sm:px-6 sm:py-5">
          <DialogTitle className="text-center text-lg font-semibold text-gray-900 sm:text-xl">
            eSIM - Compatible Devices
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <div className="mt-4 flex items-center gap-2 rounded-full border border-gray-300 bg-white px-1 shadow-sm focus-within:border-gray-500 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 border-gray-300 text-gray-500">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="search"
              inputMode="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Samsung Galaxy"
              aria-label="Search devices"
              className="h-12 flex-1 border-none bg-transparent px-0 text-base font-medium text-gray-900 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="bg-white px-5 pb-6 sm:px-6">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
            <div className="space-y-5 overflow-y-auto pr-1" style={{ maxHeight: "50vh" }}>
              {laptops.map((entry) => (
                <DeviceSection key={entry.brand} entry={entry} query={query} />
              ))}

              {smartphones.map((entry) => (
                <DeviceSection key={entry.brand} entry={entry} query={query} />
              ))}

              {filteredDevices.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center">
                  <p className="text-base font-semibold text-gray-900">No devices found</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Try a different model or clear your search to see all compatible devices.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-3 text-sm font-semibold text-green-600 underline underline-offset-4"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-center">
              <Link
                href="/compatible-devices"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                View Full Device Lists
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


