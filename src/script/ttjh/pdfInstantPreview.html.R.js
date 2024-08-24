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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.R = void 0;
const Leaf = __importStar(require("leaf-ts"));
var R;
(function (R) {
    class PdfInstantPreview extends Leaf.GeneratedWidget {
        constructor() {
            super(function () {
                var _e = this._e.bind(this);
                var _t = this._t.bind(this);
                return _e("div", { "class": { "name": "class", "templates": [{ "type": "raw", "content": "pdf-instant-preview-573cc1" }] } }, [_t({ "templates": [{ "type": "raw", "content": "\n    " }] }), _e("span", { "class": { "name": "class", "templates": [{ "type": "raw", "content": "hint" }] } }, [_t({ "templates": [{ "type": "value", "content": "hint", "reverse": false }] })]), _t({ "templates": [{ "type": "raw", "content": "\n    " }] }), _e("div", { "data-list": { "name": "data-list", "templates": [{ "type": "raw", "content": "previewList" }] } }, [_t({ "templates": [{ "type": "raw", "content": "\n\n    " }] })]), _t({ "templates": [{ "type": "raw", "content": "\n" }] })]);
            }, "PdfInstantPreview", ["hint"]);
            this.TestDatas = PdfInstantPreview.TestDatas;
            this.BindedLists = PdfInstantPreview.BindedLists;
            this.BindedWidgets = PdfInstantPreview.BindedWidgets;
            this.InitialData = PdfInstantPreview.InitialData;
            this.path = PdfInstantPreview.path;
            this.GeneratedConstructor = PdfInstantPreview;
            if (PdfInstantPreview.InitialData) {
                this.renderRecursive(PdfInstantPreview.InitialData);
            }
        }
    }
    PdfInstantPreview.TestDatas = [];
    PdfInstantPreview.BindedLists = [{ "name": "previewList", "type": "void", "reference": null }];
    PdfInstantPreview.BindedWidgets = [];
    PdfInstantPreview.path = "/ttjh/pdfInstantPreview";
    PdfInstantPreview.widgetName = "PdfInstantPreview";
    PdfInstantPreview.InitialData = null;
    R.PdfInstantPreview = PdfInstantPreview;
    PdfInstantPreview["prototype"].widgetName = "PdfInstantPreview";
    (function (PdfInstantPreview) {
        class PreviewListItem extends Leaf.GeneratedWidget {
            constructor() {
                super(function () {
                    var _e = this._e.bind(this);
                    var _t = this._t.bind(this);
                    return _e("div", { "class": { "name": "class", "templates": [{ "type": "raw", "content": "preview-list-item-bcfe96" }] } }, [_t({ "templates": [{ "type": "raw", "content": "\n        " }] }), _e("img", { "data-id": { "name": "data-id", "templates": [{ "type": "raw", "content": "previewImage" }] } }, []), _t({ "templates": [{ "type": "raw", "content": "\n    " }] })]);
                }, "PreviewListItem", []);
                this.TestDatas = PreviewListItem.TestDatas;
                this.BindedLists = PreviewListItem.BindedLists;
                this.BindedWidgets = PreviewListItem.BindedWidgets;
                this.InitialData = PreviewListItem.InitialData;
                this.path = PreviewListItem.path;
                this.GeneratedConstructor = PreviewListItem;
                if (PreviewListItem.InitialData) {
                    this.renderRecursive(PreviewListItem.InitialData);
                }
            }
        }
        PreviewListItem.TestDatas = [];
        PreviewListItem.BindedLists = [];
        PreviewListItem.BindedWidgets = [];
        PreviewListItem.path = "/ttjh/pdfInstantPreview/previewListItem";
        PreviewListItem.widgetName = "PreviewListItem";
        PreviewListItem.InitialData = null;
        PdfInstantPreview.PreviewListItem = PreviewListItem;
        PreviewListItem["prototype"].widgetName = "PreviewListItem";
    })(PdfInstantPreview = R.PdfInstantPreview || (R.PdfInstantPreview = {}));
})(R || (exports.R = R = {}));
