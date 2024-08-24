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
exports.PaginatorEnhancement = exports.FormEnhancement = exports.DatasetItemEnhancement = exports.DatasetListEnhancement = exports.PreviewButtonEnhancement = exports.SearchBoxEnhancement = exports.PreviewFeature = void 0;
const elementEnhancement_1 = require("../elementEnhancement");
const pdfAnalyzer_1 = require("../pdf/pdfAnalyzer");
const pdfInstantPreview_1 = require("./pdfInstantPreview");
const util_1 = require("./util");
class PreviewFeature {
    constructor() {
        this.splitterReg = new RegExp("[:：]");
        this.splitter = ":";
        this.previewButtonEnhancement = new PreviewButtonEnhancement(this);
        this.datalistEnhancement = new DatasetListEnhancement(this);
        this.formEnhancement = new FormEnhancement(this);
        this.searchBoxEnhancement = new SearchBoxEnhancement(this);
        this.paginatorEnhancement = new PaginatorEnhancement(this);
    }
    parseFullKeyword(content) {
        let parts = content.split(this.splitterReg);
        if (parts.length == 1)
            return { base: content, inline: "" };
        return {
            base: parts[0],
            inline: parts.slice(1).join(":")
        };
    }
    genFullKeyword(option) {
        var _a;
        let base = (_a = option.base) === null || _a === void 0 ? void 0 : _a.replace(/\+/ig, " ");
        if (!option.inline)
            return base;
        return base + this.splitter + option.inline;
    }
    get baseSearchKeywords() {
        let info = this.parseFullKeyword(this.searchBoxEnhancement.el.value);
        return info.base;
    }
    set baseSearchKeywords(value) {
        let info = this.parseFullKeyword(this.searchBoxEnhancement.el.value);
        info.base = value;
        this.searchBoxEnhancement.el.value = this.genFullKeyword(info);
    }
    get inlineSearchKeywords() {
        let info = this.parseFullKeyword(this.searchBoxEnhancement.el.value);
        return info.inline;
    }
    set inlineSearchKeywords(value) {
        let info = this.parseFullKeyword(this.searchBoxEnhancement.el.value);
        info.inline = value;
        this.searchBoxEnhancement.el.value = this.genFullKeyword(info);
    }
    enhance() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.previewButtonEnhancement.enhance();
            yield this.formEnhancement.enhance();
            if (window.location.hash.startsWith("#inline=")) {
                yield this.datalistEnhancement.enhance();
                yield this.paginatorEnhancement.enhance();
            }
        });
    }
}
exports.PreviewFeature = PreviewFeature;
class SearchBoxEnhancement extends elementEnhancement_1.ElementEnhancement {
    constructor(preview) {
        super({
            selector: "#field-giant-search"
        });
        this.preview = preview;
    }
}
exports.SearchBoxEnhancement = SearchBoxEnhancement;
class PreviewButtonEnhancement extends elementEnhancement_1.ElementEnhancement {
    constructor(preview) {
        let selector = "#dataset-search-form > div.input-group.search-input-group > .input-group-btn";
        super({
            selector
        });
        this.preview = preview;
        this.previewButton = null;
        this.events = new Leaf.EventEmitter();
    }
    enhance() {
        //this.ensurePreviewButton()
    }
    ensurePreviewButton() {
        if (this.previewButton)
            return;
        let button = document.createElement("button");
        button.classList.add("btn", "btn-default", "btn-lg");
        button.textContent = "プレビュ";
        this.previewButton = button;
        this.el.prepend(button);
        this.previewButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.onClickPreviewButton();
        });
    }
    onClickPreviewButton() {
        return __awaiter(this, void 0, void 0, function* () {
            this.events.emit("trigger");
        });
    }
}
exports.PreviewButtonEnhancement = PreviewButtonEnhancement;
class DatasetListEnhancement extends elementEnhancement_1.ElementEnhancement {
    constructor(preview) {
        const selector = ".dataset-list";
        super({
            selector
        });
        this.preview = preview;
        this.datasetListItemEnhancements = null;
        this.define({ name: "items", selector: ".dataset-item" });
    }
    enhance() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = this.preview.inlineSearchKeywords) === null || _a === void 0 ? void 0 : _a.trim())) {
                return;
            }
            this.ensureEnhancements();
            yield Promise.all(this.datasetListItemEnhancements.map(item => item.enhance()));
        });
    }
    ensureEnhancements() {
        if (this.datasetListItemEnhancements)
            return;
        this.datasetListItemEnhancements = this.gets("items").map(el => {
            return new DatasetItemEnhancement(this, el);
        });
    }
}
exports.DatasetListEnhancement = DatasetListEnhancement;
class DatasetItemEnhancement extends elementEnhancement_1.ElementEnhancement {
    constructor(list, el) {
        super({
            el
        });
        this.list = list;
        this.previewContainer = null;
        this.define({
            name: "resources", selector: ".dataset-resources li a",
        }).define({
            name: "meta", selector: ".dataset-meta"
        }).define({
            name: "url", selector: "a"
        }).define({
            name: "title",
            selector: ".dataset-heading a"
        });
        this.ensurePreviewSection();
    }
    get url() {
        return this.get("url").getAttribute("href");
    }
    enhance() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let formats = this.gets("resources").map(el => {
                return el.getAttribute("data-format");
            });
            let title = (_a = this.get("title")) === null || _a === void 0 ? void 0 : _a.textContent;
            console.error("Titlte enc", title);
            this.ensurePreviewSection();
            if (!formats.includes("pdf")) {
                let text = document.createElement("div");
                text.classList.add("ttj-not-supported");
                text.textContent = `PDF以外のファイルはプレビュできません`;
                this.previewContainer.appendChild(text);
                return;
            }
            let openDataCatelogUtil = new util_1.OpenDataCatelogUtil();
            let url = this.url;
            let docs = yield openDataCatelogUtil.getOpenDataEntryDocuments(url);
            let pdfs = docs.filter(doc => doc.type == "pdf");
            let hint = document.createElement("div");
            this.previewContainer.appendChild(hint);
            pdfs.reverse();
            let all = [];
            let previews = [];
            for (let [index, doc] of pdfs.entries()) {
                hint.textContent = `${index + 1}/${pdfs.length}検索中...`;
                let pdfPreview = new pdfInstantPreview_1.PdfInstantPreview();
                let binary = yield openDataCatelogUtil.getResourceBinaryViaProxy(doc.url);
                let title = doc.title;
                this.previewContainer.prepend(pdfPreview.node);
                let analyzer = new pdfAnalyzer_1.PdfAnalyzer();
                analyzer.load(binary);
                all.push(pdfPreview.preview({ title, analyzer, keywords: this.list.preview.inlineSearchKeywords }));
                previews.push(pdfPreview);
            }
            yield Promise.all(all);
            if (previews.find(item => item.hasPreview)) {
                hint.parentElement.removeChild(hint);
                for (let preview of previews) {
                    if (!preview.hasPreview) {
                        preview.node.parentElement.removeChild(preview.node);
                    }
                }
            }
            else {
                for (let preview of previews) {
                    preview.node.parentElement.removeChild(preview.node);
                }
                hint.textContent = `"${this.list.preview.inlineSearchKeywords}" が見つかりませんでした`;
                hint.style.color = "red";
            }
        });
    }
    ensurePreviewSection() {
        if (this.previewContainer) {
            this.previewContainer.innerHTML = "";
            return;
        }
        let previewContainer = document.createElement("dd");
        previewContainer.classList.add("dataset-meta-item");
        let title = document.createElement("dt");
        title.classList.add("dataset-meta-item", "dataset-meta-item-title");
        title.textContent = "プレビュ";
        let meta = this.get("meta");
        meta.appendChild(title);
        meta.appendChild(previewContainer);
        this.previewContainer = previewContainer;
    }
}
exports.DatasetItemEnhancement = DatasetItemEnhancement;
class FormEnhancement extends elementEnhancement_1.ElementEnhancement {
    constructor(preview) {
        super({
            selector: "#dataset-search-form"
        });
        this.preview = preview;
    }
    enhance() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let hash = (_a = window.location.hash) === null || _a === void 0 ? void 0 : _a.replace("#", "");
            hash.split("&").forEach(item => {
                let [k, v] = item.split("=");
                if (k == "inline") {
                    this.preview.inlineSearchKeywords = decodeURIComponent(v);
                }
            });
            console.error(hash, "enh??");
            this.el.addEventListener("submit", (e) => {
                console.error("submit???");
                let currentUrl = new URL(window.location.toString());
                e.preventDefault(); // Prevent the original form submission
                const form = e.target;
                let url = new URL(form.action);
                let q = this.preview.baseSearchKeywords.split(/\s+/).filter(Boolean).join("+");
                url.searchParams.set("q", q);
                // Modify the URL or add a hash
                url.hash = `#inline=${encodeURIComponent(this.preview.inlineSearchKeywords)}`;
                window.location.href = url.toString();
                if (currentUrl.searchParams.get("q") == q) {
                    window.location.reload();
                }
            });
        });
    }
}
exports.FormEnhancement = FormEnhancement;
class PaginatorEnhancement extends elementEnhancement_1.ElementEnhancement {
    constructor(preview) {
        let selector = "#content > div.row.wrapper > div  div.pagination-wrapper > ul";
        super({ selector });
        this.preview = preview;
        this.define({ name: "pageItem", selector: "li a" });
    }
    enhance() {
        var _a;
        let hash = (_a = window.location.hash) === null || _a === void 0 ? void 0 : _a.replace("#", "");
        this.gets("pageItem").map(item => {
            let url = new URL(item.getAttribute("href"), window.location.toString());
            url.hash = hash;
            item.setAttribute("href", url.toString());
        });
    }
}
exports.PaginatorEnhancement = PaginatorEnhancement;
