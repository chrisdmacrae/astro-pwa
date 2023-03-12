import type { Store } from '../stores/store'
import { getClientStoreRegistryStore } from '../stores/clientStoreRegistry'
import { dehydrateStores, hydrateClientStore } from '../stores/hydration'
import { fetchWithClientStoreData } from '../session/temporary'

export class AstroFrame extends HTMLElement {
  public src: string = this.getAttribute('src') || window.location.href
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

  // TODO: handle loading data from src
  static get observedAttributes() { return ['src']; }
  public attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === 'src' && oldValue && oldValue !== newValue) {
        this.reload(newValue)
    }
  }

  public async reload(src?: string, init: RequestInit = {}) {
    const dehydratedStores = dehydrateStores(this.stores)
    const url = src || this.src

    const response = await fetchWithClientStoreData(url, { data: dehydratedStores, output: "server" }, init)
    const page = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(page, "text/html")
    const newFrame = doc.getElementById(this.id) as AstroFrame

    if (newFrame && this.innerHTML !== newFrame?.innerHTML) {
      this.replaceWith(newFrame)
    }

    this.src = url
  }

  public disconnectedCallback() {
    this.listeners.forEach((cb, i) => {
      cb()
    })
  }
}