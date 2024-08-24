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
exports.OpenDataCatelogUtil = void 0;
class OpenDataCatelogUtil {
    getOpenDataEntryDocuments(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = yield this.getHTML(url);
            const parser = new DOMParser();
            let parsed = parser.parseFromString(content, "text/html");
            let resourceSelector = "#dataset-resources > ul > li > a";
            let els = Array.from(parsed.querySelectorAll(resourceSelector));
            let results = els.map(el => {
                var _a;
                let title = el.getAttribute("title");
                let label = el.querySelector(`[property="dc:format"]`);
                let url = el.getAttribute("href");
                if (!label)
                    return null;
                return {
                    title,
                    url,
                    type: (_a = label === null || label === void 0 ? void 0 : label.getAttribute("data-format")) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()
                };
            }).filter(Boolean);
            return results;
        });
    }
    getHTML(url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error("Load html of", url);
            let res = yield fetch(url);
            return res.text();
        });
    }
    getResourceBinaryViaProxy(url) {
        return __awaiter(this, void 0, void 0, function* () {
            url = url + "/proxy";
            console.error("Load resource of", url);
            let res = yield fetch(url);
            return res.arrayBuffer();
        });
    }
}
exports.OpenDataCatelogUtil = OpenDataCatelogUtil;
