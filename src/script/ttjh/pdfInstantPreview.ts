import * as Leaf from "leaf-ts";
import { R } from "./pdfInstantPreview.html.R";
import { PdfAnalyzer, PdfSearchResult } from "../pdf/pdfAnalyzer";

export class PdfInstantPreview extends R.PdfInstantPreview {
    constructor() {
        super()
    }
    async previewFirstPage(option: {
        analyzer: PdfAnalyzer
    }) {
        await option.analyzer.wait()
        let info = await option.analyzer.getPageImage(1)
        let item = new PreviewListItem({
            pageNum: 1,
            imageSrc: info.url,
            matches: [],
            width: info.width,
            height: info.height,
            scale: info.scale,
        })
        this.previewList.push(item)
    }
    clearHint() {
        this.VM.hint = ""
    }
    async preview(option: {
        title: string
        analyzer: PdfAnalyzer
        keywords: string
    }): Promise<boolean> {
        this.clearHint()
        await option.analyzer.wait()
        let keywords = option.keywords.trim()
        if (keywords.length == 0) {
            return false
        }
        let result = await option.analyzer.search(keywords)
        let pages: {
            [pageNum: string]: PdfSearchResult[]
        } = {}
        this.previewList.empty()
        if (result.length == 0) {
            this.VM.hint = `${option.title}に　"${keywords}" が見つかりませんでした`
            return false
        }
        for (let item of result) {
            let matches = pages[item.pageNum]
            if (!matches) {
                matches = []
                pages[item.pageNum] = matches
            }
            matches.push(item)
        }
        for (let pageNum in pages) {
            let info = await option.analyzer.getPageImage(+pageNum)
            let item = new PreviewListItem({
                pageNum: +pageNum,
                imageSrc: info.url,
                width: info.width,
                height: info.height,
                matches: pages[pageNum],
                scale: info.scale,
            })
            this.previewList.push(item)
        }
        this.hasPreview = true
        return true
    }
    hasPreview = false
    declare previewList: Leaf.List<PreviewListItem>
}

export class PreviewListItem extends R.PdfInstantPreview.PreviewListItem {
    constructor(public readonly option: {
        pageNum: number
        imageSrc: string
        matches: PdfSearchResult[]
        width: number
        height: number
        scale: number
    }) {
        super()
        let canvas = this.canvas
        canvas.width = option.width
        canvas.height = option.height
        this.UI.previewImage.src = option.imageSrc
        if (this.UI.previewImage.complete) {
            this.setupCanvas()
        } else {
            this.UI.previewImage.onload = () => {
                this.setupCanvas()
            }
        }
    }
    canvas: HTMLCanvasElement = document.createElement("canvas")
    setupCanvas() {
        this.UI.previewImage.style.display = "none"
        this.node.appendChild(this.canvas)
        let context = this.canvas.getContext("2d")
        context.drawImage(this.UI.previewImage, 0, 0)
        context.strokeStyle = "red"
        console.error(this.option.matches)
        let scale = this.option.scale
        let height = this.option.height
        console.error(height, "Setup canvas")
        for (let match of this.option.matches) {
            for (let box of match.boundingBoxes) {
                context.beginPath()
                console.error(height, box.y, match)
                context.moveTo(box.x * scale, height - box.y * scale)
                context.lineTo((box.x + box.width) * scale, height - box.y * scale)
                context.closePath()
                context.stroke()
            }
        }
    }
}