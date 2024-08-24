export class ElementEnhancement<T extends Record<string, HTMLElement> = {}> {
    constructor(public option: {
        selector?: string
        el?: HTMLElement
    }) {
        if (option.selector) {
            this.el = document.querySelector(option.selector)
        } else {
            this.el = option.el
        }
    }
    isAvailable() {
        return !!this.el
    }
    el: HTMLElement = null
    selectors: {
        [key in keyof T]?: string
    } = {}
    define<TKey extends string>(option: {
        name: TKey,
        selector: string
    }): ElementEnhancement<T & { [key in TKey]: HTMLElement
    }> {
        this.selectors[option.name] = option.selector
        return this
    }
    get(name: keyof T): HTMLElement {
        return this.el.querySelector(this.selectors[name])
    }
    gets(name: keyof T): HTMLElement[] {
        return Array.from(this.el.querySelectorAll(this.selectors[name]))
    }
    static fromSelector(selector: string, Cons = ElementEnhancement) {
        return Array.from(document.querySelectorAll(selector)).map(el => new Cons({ el: el as HTMLElement }))
    }
    static firstFromSelector(selector: string, Cons = ElementEnhancement) {
        return new Cons({ el: document.querySelector(selector) as HTMLElement })
    }
}