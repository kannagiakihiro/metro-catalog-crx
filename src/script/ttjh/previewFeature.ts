import { CommonUI } from "@branch-ts/web/src/ui/commonUI/commonUI"
import { ElementEnhancement } from "../elementEnhancement"
import { PdfAnalyzer } from "../pdf/pdfAnalyzer"
import { PdfInstantPreview } from "./pdfInstantPreview"
import { OpenDataCatelogUtil } from "./util"

export class PreviewFeature {
    constructor() {
    }
    parseFullKeyword(content: string): {
        base: string
        inline: string
    } {
        let parts = content.split(this.splitterReg)
        if (parts.length == 1) return { base: content, inline: "" }
        return {
            base: parts[0],
            inline: parts.slice(1).join(":")
        }
    }
    splitterReg = new RegExp("[:：]")
    splitter = ":"
    genFullKeyword(option: {
        base: string
        inline: string
    }) {
        let base = option.base?.replace(/\+/ig, " ")
        if (!option.inline) return base
        return base + this.splitter + option.inline
    }
    get baseSearchKeywords() {
        let info = this.parseFullKeyword(this.searchBoxEnhancement.el.value)
        return info.base
    }
    set baseSearchKeywords(value: string) {
        let info = this.parseFullKeyword(this.searchBoxEnhancement.el.value)
        info.base = value
        this.searchBoxEnhancement.el.value = this.genFullKeyword(info)
    }
    get inlineSearchKeywords() {
        let info = this.parseFullKeyword(this.searchBoxEnhancement.el.value)
        return info.inline
    }
    set inlineSearchKeywords(value: string) {
        let info = this.parseFullKeyword(this.searchBoxEnhancement.el.value)
        info.inline = value
        this.searchBoxEnhancement.el.value = this.genFullKeyword(info)
    }
    async enhance() {
        await this.previewButtonEnhancement.enhance()
        await this.formEnhancement.enhance()
        if (window.location.hash.startsWith("#inline=")) {
            await this.datalistEnhancement.enhance()
            await this.paginatorEnhancement.enhance()
        }
    }
    previewButtonEnhancement: PreviewButtonEnhancement = new PreviewButtonEnhancement(this)
    datalistEnhancement: DatasetListEnhancement = new DatasetListEnhancement(this)
    formEnhancement: FormEnhancement = new FormEnhancement(this)
    searchBoxEnhancement: SearchBoxEnhancement = new SearchBoxEnhancement(this)
    paginatorEnhancement: PaginatorEnhancement = new PaginatorEnhancement(this)
}
export class SearchBoxEnhancement extends ElementEnhancement {
    constructor(public readonly preview: PreviewFeature) {
        super({
            selector: "#field-giant-search"
        })
    }
    declare el: HTMLInputElement
}
export class PreviewButtonEnhancement extends ElementEnhancement {
    constructor(public readonly preview: PreviewFeature) {
        let selector = "#dataset-search-form > div.input-group.search-input-group > .input-group-btn"
        super({
            selector
        })
    }
    enhance() {
        //this.ensurePreviewButton()
    }
    previewButton: HTMLButtonElement = null
    ensurePreviewButton() {
        if (this.previewButton) return
        let button = document.createElement("button")
        button.classList.add("btn", "btn-default", "btn-lg")
        button.textContent = "プレビュー"
        this.previewButton = button
        this.el.prepend(button)
        this.previewButton.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
            this.onClickPreviewButton()
        })
    }
    events = new Leaf.EventEmitter<{
        trigger
    }>()
    async onClickPreviewButton() {
        this.events.emit("trigger")
    }
}

export class DatasetListEnhancement extends ElementEnhancement<{
    items: HTMLElement
    url: HTMLAnchorElement
}> {
    constructor(public readonly preview: PreviewFeature) {
        const selector = ".dataset-list"
        super({
            selector
        })
        this.define({ name: "items", selector: ".dataset-item" })
    }
    async enhance() {
        if (!this.preview.inlineSearchKeywords?.trim()) {
            return
        }
        this.ensureEnhancements()
        await Promise.all(this.datasetListItemEnhancements.map(item => item.enhance()))
    }
    private datasetListItemEnhancements: DatasetItemEnhancement[] = null
    private ensureEnhancements() {
        if (this.datasetListItemEnhancements) return
        this.datasetListItemEnhancements = this.gets("items").map(el => {
            return new DatasetItemEnhancement(this, el)
        })
    }
}
export class DatasetItemEnhancement extends ElementEnhancement<{
    resources: HTMLAnchorElement
    meta: HTMLDivElement
    url: HTMLAnchorElement
    title: HTMLAnchorElement
}> {
    constructor(public readonly list: DatasetListEnhancement, el: HTMLElement) {
        super({
            el
        })
        this.define({
            name: "resources", selector: ".dataset-resources li a",
        }).define({
            name: "meta", selector: ".dataset-meta"
        }).define({
            name: "url", selector: "a"
        }).define({
            name: "title",
            selector: ".dataset-heading a"
        })
        this.ensurePreviewSection()
    }
    get url() {
        return this.get("url").getAttribute("href")
    }
    async enhance() {
        let formats = this.gets("resources").map(el => {
            return el.getAttribute("data-format")
        })
        let title = this.get("title")?.textContent
        console.error("Titlte enc", title)
        this.ensurePreviewSection()
        if (!formats.includes("pdf")) {
            let text = document.createElement("div")
            text.classList.add("ttj-not-supported")
            text.textContent = `PDF以外のファイルはプレビュできません`
            this.previewContainer.appendChild(text)
            return
        }
        let openDataCatelogUtil = new OpenDataCatelogUtil()
        let url = this.url
        let docs = await openDataCatelogUtil.getOpenDataEntryDocuments(url)
        let pdfs = docs.filter(doc => doc.type == "pdf")
        let hint = document.createElement("div")
        this.previewContainer.appendChild(hint)
        pdfs.reverse()
        let all: Promise<boolean>[] = []
        let previews: PdfInstantPreview[] = []
        for (let [index, doc] of pdfs.entries()) {
            hint.textContent = `${index + 1}/${pdfs.length}検索中...`
            let pdfPreview = new PdfInstantPreview()
            let binary = await openDataCatelogUtil.getResourceBinaryViaProxy(doc.url)
            let title = doc.title
            this.previewContainer.prepend(pdfPreview.node)
            let analyzer = new PdfAnalyzer()
            analyzer.load(binary)
            all.push(pdfPreview.preview({ title, analyzer, keywords: this.list.preview.inlineSearchKeywords }))
            previews.push(pdfPreview)
        }
        await Promise.all(all)
        if (previews.find(item => item.hasPreview)) {
            hint.parentElement.removeChild(hint)
            for (let preview of previews) {
                if (!preview.hasPreview) {
                    preview.node.parentElement.removeChild(preview.node)
                }
            }
        } else {
            for (let preview of previews) {
                preview.node.parentElement.removeChild(preview.node)
            }
            hint.textContent = `"${this.list.preview.inlineSearchKeywords}" が見つかりませんでした`
            hint.style.color = "red"
        }
    }
    previewContainer: HTMLElement = null
    ensurePreviewSection() {
        if (this.previewContainer) {
            this.previewContainer.innerHTML = ""
            return
        }
        let previewContainer = document.createElement("dd")
        previewContainer.classList.add("dataset-meta-item")
        let title = document.createElement("dt")
        title.classList.add("dataset-meta-item", "dataset-meta-item-title")
        title.textContent = "プレビュー"
        let meta = this.get("meta")
        meta.appendChild(title)
        meta.appendChild(previewContainer)
        this.previewContainer = previewContainer
    }
}

export class FormEnhancement extends ElementEnhancement {
    constructor(public readonly preview: PreviewFeature) {
        super({
            selector: "#dataset-search-form"
        })
    }
    async enhance() {
        let hash = window.location.hash?.replace("#", "")
        hash.split("&").forEach(item => {
            let [k, v] = item.split("=")
            if (k == "inline") {
                this.preview.inlineSearchKeywords = decodeURIComponent(v)
            }
        })
        this.el.addEventListener("submit", (e) => {
            let currentUrl = new URL(window.location.toString())
            e.preventDefault(); // Prevent the original form submission

            const form = e.target as HTMLFormElement
            let url = new URL(form.action);

            let q = this.preview.baseSearchKeywords.split(/\s+/).filter(Boolean).join("+")
            url.searchParams.set("q", q)

            // Modify the URL or add a hash
            url.hash = `#inline=${encodeURIComponent(this.preview.inlineSearchKeywords)}`;
            window.location.href = url.toString();
            if (currentUrl.searchParams.get("q") == q) {
                window.location.reload()
            }
        });
    }
}

export class PaginatorEnhancement extends ElementEnhancement<{
    pageItem: HTMLAnchorElement
}> {
    constructor(public readonly preview: PreviewFeature) {
        let selector = "#content > div.row.wrapper > div  div.pagination-wrapper > ul"
        super({ selector })
        this.define({ name: "pageItem", selector: "li a" })
    }
    enhance() {
        let hash = window.location.hash?.replace("#", "")
        this.gets("pageItem").map(item => {
            let url = new URL(item.getAttribute("href"), window.location.toString())
            url.hash = hash
            item.setAttribute("href", url.toString())
        })
    }
}