import * as Leaf from "leaf-ts"
import * as pdfjsLib from 'pdfjs-dist';
import { PdfInstantPreview } from "../ttjh/pdfInstantPreview";
import { PdfAnalyzer } from "../pdf/pdfAnalyzer";
import { PreviewFeature } from "../ttjh/previewFeature";
import { StylingFeature } from "../ttjh/stylingFeature";

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.js');


async function main() {
    const title = document.querySelector('title');
    if (title) {
        console.log('Page Title:', title.innerText);
    }
    let preview = new PreviewFeature()
    let styling = new StylingFeature()
    await styling.enhance()
    await preview.enhance()
}
if (document.readyState === 'complete') {
    main()
} else {
    document.addEventListener("readystatechange", () => {
        if (document.readyState === 'complete') {
            main()
        }
    });
}