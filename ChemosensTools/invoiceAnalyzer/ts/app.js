var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var InvoiceAnalyzerApp = /** @class */ (function (_super) {
    __extends(InvoiceAnalyzerApp, _super);
    function InvoiceAnalyzerApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        return _super.call(this, InvoiceAnalyzerApp.GetRequirements(), isInTest) || this;
        //this.start();
    }
    InvoiceAnalyzerApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/invoiceAnalyzer';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
            requirements.AppUrl = 'https://www.chemosenstools.com/invoiceAnalyzer';
            requirements.FrameworkUrl = 'https://www.chemosenstools.com/framework';
            requirements.WcfServiceUrl = 'https://www.chemosenstools.com/WebService.svc/';
        }
        requirements.AuthorizedLanguages = ['en', 'fr'];
        //requirements.CssFiles = ['consodrive.css'];
        requirements.DefaultLanguage = 'en';
        requirements.DisableGoBack = true;
        requirements.DisableRefresh = true;
        //panelLeaderRequirements.VersionPath = 'panelleader/html/changelog.html';
        requirements.JsFiles = ['/ts/models.js'];
        //panelLeaderRequirements.JsonResources = ['/panelleader/resources/panelleader.json', '/panelleader/resources/analysis.json', '/screenreader/resources/screenreader.json'];
        requirements.Recommanded = []; //TODO
        requirements.Required = []; //TODO;
        //requirements.Extensions = ["Xlsx", "Tesseract"];
        return requirements;
    };
    InvoiceAnalyzerApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    InvoiceAnalyzerApp.prototype.start = function (fullScreen) {
        var _this = this;
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        var self = this;
        self.btnBrowse = Framework.Form.Button.Register("btnBrowse", function () { return true; }, function () {
            Framework.FileHelper.BrowseBinaries("pdf", function (fileContent) {
                _this.uploadPDF(fileContent);
            });
        });
        self.divInvoiceContent = Framework.Form.TextElement.Register("divInvoiceContent");
        self.divInvoiceItems = Framework.Form.TextElement.Register("divInvoiceItems");
    };
    InvoiceAnalyzerApp.prototype.uploadPDF = function (fileContent) {
        var self = this;
        self.CallWCF('UploadInvoice2', { fileContent: fileContent }, function () {
        }, function (res) {
            var json = res.Result;
            var invoice = JSON.parse(json);
            InvoiceAnalyzerModels.Invoice.Render(invoice, self.divInvoiceContent, self.divInvoiceItems, "600px", 1200);
        });
    };
    return InvoiceAnalyzerApp;
}(Framework.App));
//# sourceMappingURL=app.js.map