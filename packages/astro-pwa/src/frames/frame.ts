import type { Store } from '../stores/store'
import { getClientStoreRegistryStore } from '../stores/clientStoreRegistry'
import { dehydrateStores, hydrateClientStore } from '../stores/hydration'
import { fetchWithClientStoreData } from '../session/temporary'

export class AstroFrame extends HTMLElement {
  public src: string = window.location.href
  public stores: Store[] = []
  private listeners: Function[] = []

  constructor() {
    super()
  }

  public connectedCallback() {
    const registry = getClientStoreRegistryStore()

    if (registry) {
      registry.listen(stores => {
        const myStores = this.getAttribute('stores')?.split(',') || []

        stores.forEach(store => {
          if (myStores.includes(store.name) && !this.stores.includes(store)) {
            hydrateClientStore(this, store)

            this.stores.push(store)
          }
        })
      })
    }

    const src = this.getAttribute('src')
    if (src && src !== this.src) {
      this.reload(src)
    }
  }

  // TODO: handle loading data from src
  static get observedAttributes() { return ['src', 'server:isolate', 'server:only']; }
  public attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    const serverOnly = this.getAttribute('server:only') === 'true'

    if (!serverOnly && name === 'src' && oldValue !== newValue && newValue !== this.src) {
        this.reload(newValue)
    }

    if (!serverOnly && name === 'server:isolate' && newValue !== 'false') {
      this.isolate(newValue)
    }
  }

  public disconnectedCallback() {
    this.listeners.forEach((cb, i) => {
      cb()
    })
  }

  private async reload(src?: string, init: RequestInit = {}) {
    const dehydratedStores = dehydrateStores(this.stores)
    const url = src || this.src

    const response = await fetchWithClientStoreData(url, { data: dehydratedStores, output: "server" }, init)
    const page = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(page, "text/html")
    const newFrame = doc.getElementById(this.id) as AstroFrame

    if (newFrame && this.innerHTML !== newFrame?.innerHTML) {
      this.replaceChildren(...newFrame.childNodes)
    }

    this.src = url
    this.setAttribute('src', url)
  }

  private isolate(value?: "true" | "form" | "a") {
    if (value === 'true' || value === 'a') {
      this.querySelectorAll('a').forEach(a => {
        const url = new URL(a.href)

        if (url.origin === window.location.origin) {
          const newA = a.cloneNode(true)
          
          a.replaceWith(newA)
          
          newA.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()

            this.setAttribute('src', url.href)
          })
        }
      })
    }

    if (value === "true" || value === 'form') {
      this.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
          if (form.method === "post") {
            e.preventDefault()
            e.stopImmediatePropagation()
            e.stopPropagation()

            const formData = new FormData(form)
            const data = Object.fromEntries(formData)
            const frame = form.closest('astro-frame') as AstroFrame

            if (!frame) return

            const dehydratedStores = dehydrateStores(frame.stores)
            const response = await fetchWithClientStoreData(this.src, { data: dehydratedStores, output: "server" }, {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json"
              }
            })
            const page = await response.text()
            const parser = new DOMParser()
            const doc = parser.parseFromString(page, "text/html")
            const newFrame = doc.getElementById(this.id) as Node

            if (newFrame) {
              this.replaceWith(newFrame)
            }
          }
        })
      })
    }
  }
}