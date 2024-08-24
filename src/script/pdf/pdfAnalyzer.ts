import { CommonUI } from "@branch-ts/web/src/ui/commonUI/commonUI";
import * as Leaf from "leaf-ts"
import * as pdfjsLib from 'pdfjs-dist';
import type { TextContent, TextItem } from "pdfjs-dist/types/src/display/api"

export class PdfAnalyzer {
    constructor() {
        this.situation.events.on("error", (e) => {
            if (e) {
                CommonUI.error(e as Error)
            }
        })
    }
    reset() {
        this.situation.set("pdfProxy", null)
        this.situation.set("error", null)
        this.situation.set("finish", false)
    }
    @Leaf.lock()
    load(data: ArrayBuffer) {
        this.reset()
        let task = pdfjsLib.getDocument({ data });
        task.promise.then(pdf => {
            this.situation.set("pdfProxy", pdf)
            this.situation.set("finish", true)
        })
        task.promise.catch(error => {
            this.situation.set("error", error)
            this.situation.set("finish", true)
        })

    }
    situation = new Leaf.Situations<{
        pdfProxy: pdfjsLib.PDFDocumentProxy
        error: Error
        finish: boolean
    }>({
        pdfProxy: null,
        error: null,
        finish: false,
    })
    async wait() {
        await this.situation.wait("finish", true)
    }
    get pdf() {
        return this.situation.get("pdfProxy")
    }
    scale = 1.5
    private searchContext: PdfSearcherContext
    private async ensureSearchContext() {
        if (this.searchContext) {
            return
        }
        let contents: TextContent[] = []
        for (let i = 1; i <= this.pdf.numPages; i++) {
            let page = await this.getPage(i)
            let content = await page.getTextContent()
            contents.push(content)
        }
        this.searchContext = new PdfSearcherContext(contents)
        this.searchContext.build()
    }
    async search(keyword: string): Promise<PdfSearchResult[]> {
        await this.ensureSearchContext()
        return this.searchContext.search({ keyword, max: 10 })
    }
    private pageCache: {
        [pageNum: number]: pdfjsLib.PDFPageProxy
    } = {}
    async getPage(pageNum: number) {
        console.error("Get page", pageNum, this.pdf.numPages)
        await this.wait()
        let page = this.pageCache[pageNum]
        if (!page) {
            page = await this.pdf.getPage(pageNum)
            this.pageCache[pageNum] = page
        }
        return page
    }
    async getPageImage(pageNum: number): Promise<{
        url: string
        width: number
        height: number
        scale: number
    }> {
        let page = await this.getPage(pageNum)
        const viewport = page.getViewport({ scale: this.scale });

        // Prepare canvas using PDF page dimensions
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        let renderTask = page.render(renderContext);
        await renderTask.promise
        let imageUrl = canvas.toDataURL("image/png")
        return { url: imageUrl, width: viewport.width, height: viewport.height, scale: this.scale }
    }
}
export type PdfSearchResult = {
    pageNum: number
    match: string
    boundingBoxes: {
        x: number
        y: number
        width: number
        height: number
    }[]
}

export class PdfSearcherContext {
    constructor(public readonly contents: TextContent[]) {
    }
    search(option: {
        keyword: string
        max: number
    }): PdfSearchResult[] {
        let max = 10
        this.build()
        let reg = new RegExp(option.keyword, "ig")
        let matches = Array.from(this.fullText.matchAll(reg) || [])
        let result: PdfSearchResult[] = []
        for (let [index, item] of matches.entries()) {
            if (index >= max) break
            let start = item.index
            let end = start + item[0].length
            let sourceMaps = this.getSourceMapBetween(start, end)
            result.push({
                pageNum: sourceMaps[0].textContentIndex + 1,
                match: item[0],
                boundingBoxes: sourceMaps.map(item => {
                    let content = this.contents[item.textContentIndex].items[item.textContentItemIndex] as TextItem
                    let transform = (content as any).transform
                    return {
                        x: transform[4],
                        y: transform[5],
                        width: content.width,
                        height: content.height,
                        content,
                    }
                })
            })

        }
        return result

    }
    build() {
        if (this.fullText) return
        let fullText = ""
        let sourceMap: PdfSearchSourceMap[] = []
        for (let [textContentIndex, content] of this.contents.entries()) {
            for (let [textContentItemIndex, item] of content.items.entries()) {
                let textItem = item as TextItem
                let content = textItem.str.trim()
                if (content.length == 0) continue
                sourceMap.push({
                    offset: fullText.length,
                    textContentIndex,
                    textContentItemIndex,
                    content
                })
                fullText += content
            }
        }
        this.fullText = fullText
        this.sourceMap = sourceMap
    }
    fullText: string
    sourceMap: PdfSearchSourceMap[] = []
    getSourceMapBetween(start: number, end: number) {
        return this.sourceMap.filter(item => {
            let itemStart = item.offset
            let itemEnd = item.offset + item.content.length
            return itemEnd > start && itemStart < end
        })
    }
}
export type PdfSearchSourceMap = {
    offset: number
    textContentIndex: number
    textContentItemIndex: number
    content: string
}