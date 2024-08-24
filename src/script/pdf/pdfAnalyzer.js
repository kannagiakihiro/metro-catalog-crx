"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.PdfSearcherContext = exports.PdfAnalyzer = void 0;
const commonUI_1 = require("@branch-ts/web/src/ui/commonUI/commonUI");
const Leaf = __importStar(require("leaf-ts"));
const pdfjsLib = __importStar(require("pdfjs-dist"));
let PdfAnalyzer = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _load_decorators;
    return _a = class PdfAnalyzer {
            constructor() {
                this.situation = (__runInitializers(this, _instanceExtraInitializers), new Leaf.Situations({
                    pdfProxy: null,
                    error: null,
                    finish: false,
                }));
                this.scale = 1.5;
                this.pageCache = {};
                this.situation.events.on("error", (e) => {
                    if (e) {
                        commonUI_1.CommonUI.error(e);
                    }
                });
            }
            reset() {
                this.situation.set("pdfProxy", null);
                this.situation.set("error", null);
                this.situation.set("finish", false);
            }
            load(data) {
                this.reset();
                let task = pdfjsLib.getDocument({ data });
                task.promise.then(pdf => {
                    this.situation.set("pdfProxy", pdf);
                    this.situation.set("finish", true);
                });
                task.promise.catch(error => {
                    this.situation.set("error", error);
                    this.situation.set("finish", true);
                });
            }
            wait() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.situation.wait("finish", true);
                });
            }
            get pdf() {
                return this.situation.get("pdfProxy");
            }
            ensureSearchContext() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.searchContext) {
                        return;
                    }
                    let contents = [];
                    for (let i = 1; i <= this.pdf.numPages; i++) {
                        let page = yield this.getPage(i);
                        let content = yield page.getTextContent();
                        contents.push(content);
                    }
                    this.searchContext = new PdfSearcherContext(contents);
                    this.searchContext.build();
                });
            }
            search(keyword) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.ensureSearchContext();
                    return this.searchContext.search({ keyword, max: 10 });
                });
            }
            getPage(pageNum) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.error("Get page", pageNum, this.pdf.numPages);
                    yield this.wait();
                    let page = this.pageCache[pageNum];
                    if (!page) {
                        page = yield this.pdf.getPage(pageNum);
                        this.pageCache[pageNum] = page;
                    }
                    return page;
                });
            }
            getPageImage(pageNum) {
                return __awaiter(this, void 0, void 0, function* () {
                    let page = yield this.getPage(pageNum);
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
                    yield renderTask.promise;
                    let imageUrl = canvas.toDataURL("image/png");
                    return { url: imageUrl, width: viewport.width, height: viewport.height, scale: this.scale };
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _load_decorators = [Leaf.lock()];
            __esDecorate(_a, null, _load_decorators, { kind: "method", name: "load", static: false, private: false, access: { has: obj => "load" in obj, get: obj => obj.load }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PdfAnalyzer = PdfAnalyzer;
class PdfSearcherContext {
    constructor(contents) {
        this.contents = contents;
        this.sourceMap = [];
    }
    search(option) {
        let max = 10;
        this.build();
        let reg = new RegExp(option.keyword, "ig");
        let matches = Array.from(this.fullText.matchAll(reg) || []);
        let result = [];
        for (let [index, item] of matches.entries()) {
            if (index >= max)
                break;
            let start = item.index;
            let end = start + item[0].length;
            let sourceMaps = this.getSourceMapBetween(start, end);
            result.push({
                pageNum: sourceMaps[0].textContentIndex + 1,
                match: item[0],
                boundingBoxes: sourceMaps.map(item => {
                    let content = this.contents[item.textContentIndex].items[item.textContentItemIndex];
                    let transform = content.transform;
                    return {
                        x: transform[4],
                        y: transform[5],
                        width: content.width,
                        height: content.height,
                        content,
                    };
                })
            });
        }
        return result;
    }
    build() {
        if (this.fullText)
            return;
        let fullText = "";
        let sourceMap = [];
        for (let [textContentIndex, content] of this.contents.entries()) {
            for (let [textContentItemIndex, item] of content.items.entries()) {
                let textItem = item;
                let content = textItem.str.trim();
                if (content.length == 0)
                    continue;
                sourceMap.push({
                    offset: fullText.length,
                    textContentIndex,
                    textContentItemIndex,
                    content
                });
                fullText += content;
            }
        }
        this.fullText = fullText;
        this.sourceMap = sourceMap;
    }
    getSourceMapBetween(start, end) {
        return this.sourceMap.filter(item => {
            let itemStart = item.offset;
            let itemEnd = item.offset + item.content.length;
            return itemEnd > start && itemStart < end;
        });
    }
}
exports.PdfSearcherContext = PdfSearcherContext;
