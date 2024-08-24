import * as Leaf from "leaf-ts"
export namespace R{
    
    export class PdfInstantPreview extends Leaf.GeneratedWidget<{},{
        hint?: any
    },{
        onClickNode(e?:MouseEvent)
        onMouseupNode(e?:MouseEvent)
        onMousedownNode(e?:MouseEvent)
        onMousemoveNode(e?:MouseEvent)
        onMouseleaveNode(e?:MouseEvent)
        onMouseenterNode(e?:MouseEvent)
        onMouseoverNode(e?:MouseEvent)
        onTouchstartNode(e?:TouchEvent)
        onTouchendNode(e?:TouchEvent)
        onTouchmoveNode(e?:TouchEvent)
        onChildAddPreviewList(child:any)
        onChildRemovePreviewList(child:any)
    }>{
        constructor() {
            super(function(){
        var _e = this._e.bind(this)
        var _t = this._t.bind(this)
        return _e("div", {"class":{"name":"class","templates":[{"type":"raw","content":"pdf-instant-preview-573cc1"}]}},[_t({"templates":[{"type":"raw","content":"\n    "}]}),_e("span", {"class":{"name":"class","templates":[{"type":"raw","content":"hint"}]}},[_t({"templates":[{"type":"value","content":"hint","reverse":false}]})]),_t({"templates":[{"type":"raw","content":"\n    "}]}),_e("div", {"data-list":{"name":"data-list","templates":[{"type":"raw","content":"previewList"}]}},[_t({"templates":[{"type":"raw","content":"\n\n    "}]})]),_t({"templates":[{"type":"raw","content":"\n"}]})])
    } , "PdfInstantPreview",["hint"] as any)
            if(PdfInstantPreview.InitialData){
                this.renderRecursive(PdfInstantPreview.InitialData)
            }
        }
        previewList: Leaf.List<Leaf.WidgetAny>

        static TestDatas = []
        static BindedLists = [{"name":"previewList","type":"void","reference":null}]
        static BindedWidgets = []
        static path = "/ttjh/pdfInstantPreview"
        static widgetName = "PdfInstantPreview"
        static InitialData = null
        public TestDatas = PdfInstantPreview.TestDatas
        public BindedLists = PdfInstantPreview.BindedLists
        public BindedWidgets = PdfInstantPreview.BindedWidgets
        public InitialData = PdfInstantPreview.InitialData
        public path = PdfInstantPreview.path
        public GeneratedConstructor = PdfInstantPreview

    /*    onClickNode(e?:MouseEvent)
        onMouseupNode(e?:MouseEvent)
        onMousedownNode(e?:MouseEvent)
        onMousemoveNode(e?:MouseEvent)
        onMouseleaveNode(e?:MouseEvent)
        onMouseenterNode(e?:MouseEvent)
        onMouseoverNode(e?:MouseEvent)
        onTouchstartNode(e?:TouchEvent)
        onTouchendNode(e?:TouchEvent)
        onTouchmoveNode(e?:TouchEvent)
        onChildAddPreviewList(child:any)
        onChildRemovePreviewList(child:any)*/
    }
    (PdfInstantPreview["prototype"] as any).widgetName = "PdfInstantPreview"
    export namespace PdfInstantPreview{    
        export class PreviewListItem extends Leaf.GeneratedWidget<{previewImage:HTMLImageElement},{

        },{
            onClickPreviewImage(e?:MouseEvent)
            onMouseupPreviewImage(e?:MouseEvent)
            onMousedownPreviewImage(e?:MouseEvent)
            onMousemovePreviewImage(e?:MouseEvent)
            onMouseleavePreviewImage(e?:MouseEvent)
            onMouseenterPreviewImage(e?:MouseEvent)
            onMouseoverPreviewImage(e?:MouseEvent)
            onTouchstartPreviewImage(e?:TouchEvent)
            onTouchendPreviewImage(e?:TouchEvent)
            onTouchmovePreviewImage(e?:TouchEvent)
            onClickNode(e?:MouseEvent)
            onMouseupNode(e?:MouseEvent)
            onMousedownNode(e?:MouseEvent)
            onMousemoveNode(e?:MouseEvent)
            onMouseleaveNode(e?:MouseEvent)
            onMouseenterNode(e?:MouseEvent)
            onMouseoverNode(e?:MouseEvent)
            onTouchstartNode(e?:TouchEvent)
            onTouchendNode(e?:TouchEvent)
            onTouchmoveNode(e?:TouchEvent)

        }>{
            constructor() {
                super(function(){
            var _e = this._e.bind(this)
            var _t = this._t.bind(this)
            return _e("div", {"class":{"name":"class","templates":[{"type":"raw","content":"preview-list-item-bcfe96"}]}},[_t({"templates":[{"type":"raw","content":"\n        "}]}),_e("img", {"data-id":{"name":"data-id","templates":[{"type":"raw","content":"previewImage"}]}},[]),_t({"templates":[{"type":"raw","content":"\n    "}]})])
        } , "PreviewListItem",[] as any)
                if(PreviewListItem.InitialData){
                    this.renderRecursive(PreviewListItem.InitialData)
                }
            }

            static TestDatas = []
            static BindedLists = []
            static BindedWidgets = []
            static path = "/ttjh/pdfInstantPreview/previewListItem"
            static widgetName = "PreviewListItem"
            static InitialData = null
            public TestDatas = PreviewListItem.TestDatas
            public BindedLists = PreviewListItem.BindedLists
            public BindedWidgets = PreviewListItem.BindedWidgets
            public InitialData = PreviewListItem.InitialData
            public path = PreviewListItem.path
            public GeneratedConstructor = PreviewListItem

        /*    onClickPreviewImage(e?:MouseEvent)
            onMouseupPreviewImage(e?:MouseEvent)
            onMousedownPreviewImage(e?:MouseEvent)
            onMousemovePreviewImage(e?:MouseEvent)
            onMouseleavePreviewImage(e?:MouseEvent)
            onMouseenterPreviewImage(e?:MouseEvent)
            onMouseoverPreviewImage(e?:MouseEvent)
            onTouchstartPreviewImage(e?:TouchEvent)
            onTouchendPreviewImage(e?:TouchEvent)
            onTouchmovePreviewImage(e?:TouchEvent)
            onClickNode(e?:MouseEvent)
            onMouseupNode(e?:MouseEvent)
            onMousedownNode(e?:MouseEvent)
            onMousemoveNode(e?:MouseEvent)
            onMouseleaveNode(e?:MouseEvent)
            onMouseenterNode(e?:MouseEvent)
            onMouseoverNode(e?:MouseEvent)
            onTouchstartNode(e?:TouchEvent)
            onTouchendNode(e?:TouchEvent)
            onTouchmoveNode(e?:TouchEvent)
        */
        }
        (PreviewListItem["prototype"] as any).widgetName = "PreviewListItem"
        }
}