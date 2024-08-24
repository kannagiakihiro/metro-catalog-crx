type OpenDataDocument = {
    title: string
    type: "pdf" | "csv" | "json" | "xml" | "html"
    url: string
}
export class OpenDataCatelogUtil {
    async getOpenDataEntryDocuments(url: string): Promise<OpenDataDocument[]> {
        let content = await this.getHTML(url)
        const parser = new DOMParser()
        let parsed = parser.parseFromString(content, "text/html")
        let resourceSelector = "#dataset-resources > ul > li > a"
        let els = Array.from(parsed.querySelectorAll(resourceSelector))
        let results = els.map(el => {
            let title = el.getAttribute("title")
            let label = el.querySelector(`[property="dc:format"]`)
            let url = el.getAttribute("href")
            if (!label) return null
            return {
                title,
                url,
                type: label?.getAttribute("data-format")?.toLocaleLowerCase()
            }
        }).filter(Boolean)
        return results as any
    }
    async getHTML(url: string) {
        console.error("Load html of", url)
        let res = await fetch(url)
        return res.text()
    }
    async getResourceBinaryViaProxy(url: string) {
        url = url + "/proxy"
        console.error("Load resource of", url)
        let res = await fetch(url)
        return res.arrayBuffer()
    }
}