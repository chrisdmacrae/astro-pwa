import type { AstroGlobal } from "astro"
import type { DehydratedRouter } from "../routing/router"
import { DehydratedStores, dehydrateStores } from "../stores/hydration"

export type DehydratedData = Partial<DehydratedRouter> & {
  output: "server" | "static"
  data: DehydratedStores
}

export const getRoute = async (path: string, frame?: HTMLElement) => {
  const islands = document.body.querySelectorAll('astro-island')
  const dehydratedData = getAllDehydratedData(islands)
  const dehydratedStores = dehydrateStores(Array.from(islands).flatMap(island => (island as any).stores).filter(s => s !== undefined))

  const page = await sendClientStoreData(path, { ...dehydratedData, data: dehydratedStores, output: "server" })
  const body = await page.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(body, 'text/html')

  const oldParentFrame = frame || document.querySelector('astro-frame')

  if (!oldParentFrame) return window.location.href = path

  const newParentFrame = doc.getElementById(oldParentFrame.id)

  if (!newParentFrame) return window.location.href = path

  let importedFrame
  if (oldParentFrame && newParentFrame) {
    importedFrame = document.importNode(newParentFrame, true)
  }

  oldParentFrame.replaceChildren(...Array.from(newParentFrame.childNodes))
  hydrateScripts(Array.from(document.head.querySelectorAll('script')))
  hydrateScripts(Array.from(newParentFrame.querySelectorAll('script')))
  hydrateAstroIslands(document, doc)
}

// This is nasty
const ASTRO_ISLAND_STYLE = 'astro-island,astro-slot{display:contents}'
export const hydrateAstroIslands = (oldDocument: Document, newDocument: Document) => {
  const oldStyle = Array.from(oldDocument.body.querySelectorAll('style')).find(style => style.textContent === ASTRO_ISLAND_STYLE)
  const newStyle = Array.from(newDocument.body.querySelectorAll('style')).find(style => style.textContent === ASTRO_ISLAND_STYLE)
  const getSiblings = function (element: Element) {
    let siblings: HTMLElement[] = []; 

    if(!element.parentNode) {
        return siblings
    }

    let sibling  = element.parentNode.firstChild
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== element) {
            siblings.push(sibling as HTMLElement)
        }

        sibling = sibling.nextSibling;
    }

    return siblings as HTMLElement[];
  }

  if (!oldStyle && !newStyle) return

  let newScripts: HTMLElement[] = []
  if (newStyle) {
    newScripts = Array.from(getSiblings(newStyle).filter((node) => node.tagName === 'SCRIPT'))
  }

  let oldScripts: HTMLElement[] = []
  if (oldStyle) {
    newScripts = Array.from(getSiblings(oldStyle).filter((node) => node.tagName === 'SCRIPT'))
  }

  const style = oldStyle ? oldStyle : newStyle
  if (!oldStyle && newStyle) document.body.prepend(newStyle)
  if (newScripts && style) {
    newScripts.forEach(script => {
      const existing = oldScripts?.find(s => s.textContent === script.textContent)

      if (!existing) style.after(script)

      return script
    })

    hydrateScripts(Array.from(getSiblings(style).filter((node) => node.tagName === 'SCRIPT')) as HTMLScriptElement[])
  }
}

export const hydrateScripts = (scripts: HTMLScriptElement[]) => {
  scripts.forEach(script => {
    const el = document.createElement('script')

    if (script.textContent) el.textContent = script.textContent
    Array.from(script.attributes).forEach(attr => {
      el.setAttribute(attr.name, attr.value)
    })

    script.replaceWith(el)
  })
}

export const getAllDehydratedData = (elements: NodeListOf<Element>) => {
  const merge = (target: Record<string, any>, source: Record<string, any>) => {
    // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
    }
  
    // Join `target` and modified `source`
    Object.assign(target || {}, source)
    return target
  }

  return Array.from(elements).reduce((data, el) => {
    const dehydratedData = getDehydratedData(el)

    return merge(data, dehydratedData)
  }, {})
}

export const getDehydratedData = (el?: Element | null) => {
  const dataEl = el?.querySelector(':scope > script[data-astro]') as HTMLScriptElement | null | undefined

  if (!dataEl) return {} as DehydratedData

  return JSON.parse(dataEl.textContent || '{}') as DehydratedData
}

export const getClientStoreData = (request: AstroGlobal['request']) => {
  return JSON.parse(request.headers.get('__astro-data') || '{}') as DehydratedData
}

export const sendClientStoreData = async (href: string, dehydratedData: DehydratedData) => {
  const isServer = dehydratedData.output === "server"
  const headers = isServer ? { '__astro-data': JSON.stringify(dehydratedData) } : undefined

  return await fetch(href, { headers: headers })
}
