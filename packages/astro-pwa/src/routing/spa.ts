import diff from 'micromorph'
import { fetchWithClientStoreData } from "../session/temporary"
import { getAllStoreData } from "../stores/hydration"
import type { Router } from './router'

export const listen = (router: Router, frame: HTMLElement = document.body) => {
  if (window && 'navigation' in window && frame === document.documentElement) {
    const navigation = window.navigation as any

    navigation.addEventListener('navigate', async (e: any) => {
      if (!e.canTransition || e.hashChange || e.downloadRequest !== null) {
        return;
      }
      
      const from = new URL(location.toString())
      const to = new URL(e.destination.url)
      const isValidRoute = router.routes.find(route => route.match(to.pathname)) !== undefined && to.origin === window.location.origin

      if (from === to || !isValidRoute) return

      await getUrl(to.pathname, frame)
      router.go(to.pathname)
      window.scrollTo({ top: 0 })
    })
  }
  else {
    frame.addEventListener('click', async (e) => {
      const el = e.target as HTMLAnchorElement

      if (el.nodeType !== 1) return

      const anchor: HTMLAnchorElement | null = el.tagName === 'A' ? el : el.closest('a')

      if (!anchor) return

      const from = new URL(location.toString())
      const to = new URL(anchor.href)
      const isValidRoute = router.routes.find(route => route.match(to.pathname)) !== undefined && to.origin === window.location.origin

      if (from === to || !isValidRoute || to.hash) return

      e.preventDefault()
      e.stopPropagation()
      await getUrl(to.pathname, frame)
      router.go(to.pathname)

      const shouldScroll = anchor.getAttribute('data-scroll') !== 'false'
      if (shouldScroll) {
        window.scrollTo({ top: 0 })
      }
    })
  }

  window.addEventListener('popstate', function(event) {
    if (window.location.hash) return

    event.preventDefault()

    getUrl(window.location.pathname)
    router.go(window.location.pathname)
  }, false)
}

export const getUrl = async (path: string, frame: HTMLElement = document.body) => {
    const output = document.getElementById('__astro')?.getAttribute('output') as "server" | "static" || "static"
    const dehydratedStores = getAllStoreData()
    const isDocument = frame == document.body

    if (!frame || !isDocument && !frame.id) return window.location.href = path

    const page = await fetchWithClientStoreData(path, { data: dehydratedStores, output: output })
    const body = await page.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(body, 'text/html')
    const newFrame = isDocument ? doc.body : doc.getElementById(frame.id)

    if (!newFrame) return window.location.href = path

    diff(frame, newFrame)
    diff(document.head, doc.head)
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
      oldScripts = Array.from(getSiblings(oldStyle).filter((node) => node.tagName === 'SCRIPT'))
    }
  
    const style = oldStyle ? oldStyle : newStyle
    if (!oldStyle && newStyle) document.body.prepend(newStyle)
    if (newScripts && style) {
      newScripts.forEach(script => {
        const existing = oldScripts?.find(s => s.innerText === script.innerText)
        const node = document.createElement('script')

        if (script.innerText) node.innerText = script.innerText
        Array.from(script.attributes).forEach(attr => {
          node.setAttribute(attr.name, attr.value)
        })

        if (!existing) {
          style.after(node)
        }
        else {
          existing.replaceWith(node)
        }
      })
    }
  }
