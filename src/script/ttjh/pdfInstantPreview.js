"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewListItem = exports.PdfInstantPreview = void 0;
const pdfInstantPreview_html_R_1 = require("./pdfInstantPreview.html.R");
class PdfInstantPreview extends pdfInstantPreview_html_R_1.R.PdfInstantPreview {
    constructor() {
        super();
        this.hasPreview = false;
    }
    previewFirstPage(option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield option.analyzer.wait();
            let info = yield option.analyzer.getPageImage(1);
            let item = new PreviewListItem({
                pageNum: 1,
                imageSrc: info.url,
                matches: [],
                width: info.width,
                height: info.height,
                scale: info.scale,
            });
            this.previewList.push(item);
        });
    }
    clearHint() {
        this.VM.hint = "";
    }
    preview(option) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearHint();
            yield option.analyzer.wait();
            let keywords = option.keywords.trim();
            if (keywords.length == 0) {
                return false;
            }
            let result = yield option.analyzer.search(keywords);
            let pages = {};
            this.previewList.empty();
            if (result.length == 0) {
                this.VM.hint = `${option.title}に　"${keywords}" が見つかりませんでした`;
                return false;
            }
            for (let item of result) {
                let matches = pages[item.pageNum];
                if (!matches) {
                    matches = [];
                    pages[item.pageNum] = matches;
                }
                matches.push(item);
            }
            for (let pageNum in pages) {
                let info = yield option.analyzer.getPageImage(+pageNum);
                let item = new PreviewListItem({
                    pageNum: +pageNum,
                    imageSrc: info.url,
                    width: info.width,
                    height: info.height,
                    matches: pages[pageNum],
                    scale: info.scale,
                });
                this.previewList.push(item);
            }
            this.hasPreview = true;
            return true;
        });
    }
}
exports.PdfInstantPreview = PdfInstantPreview;
class PreviewListItem extends pdfInstantPreview_html_R_1.R.PdfInstantPreview.PreviewListItem {
    constructor(option) {
        super();
        this.option = option;
        this.canvas = document.createElement("canvas");
        let canvas = this.canvas;
        canvas.width = option.width;
        canvas.height = option.height;
        this.UI.previewImage.src = option.imageSrc;
        if (this.UI.previewImage.complete) {
            this.setupCanvas();
        }
        else {
            this.UI.previewImage.onload = () => {
                this.setupCanvas();
            };
        }
    }
    setupCanvas() {
        this.UI.previewImage.style.display = "none";
        this.node.appendChild(this.canvas);
        let context = this.canvas.getContext("2d");
        context.drawImage(this.UI.previewImage, 0, 0);
        context.strokeStyle = "red";
        console.error(this.option.matches);
        let scale = this.option.scale;
        let height = this.option.height;
        console.error(height, "Setup canvas");
        for (let match of this.option.matches) {
            for (let box of match.boundingBoxes) {
                context.beginPath();
                console.error(height, box.y, match);
                context.moveTo(box.x * scale, height - box.y * scale);
                context.lineTo((box.x + box.width) * scale, height - box.y * scale);
                context.closePath();
                context.stroke();
            }
        }
    }
}
exports.PreviewListItem = PreviewListItem;
