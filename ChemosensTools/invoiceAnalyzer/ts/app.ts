class InvoiceAnalyzerApp extends Framework.App {

    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/invoiceAnalyzer';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
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
        requirements.Required = [] //TODO;

        
        //requirements.Extensions = ["Xlsx", "Tesseract"];
        return requirements;
    }

    constructor(isInTest: boolean = false) {
        super(InvoiceAnalyzerApp.GetRequirements(), isInTest);
        //this.start();
    }

    protected onError(error: string) {
        super.onError(error);
    }

    private btnBrowse: Framework.Form.Button;
    private divInvoiceContent: Framework.Form.TextElement;
    private divInvoiceItems: Framework.Form.TextElement;


    protected start(fullScreen: boolean = false) {

        super.start(fullScreen);

        let self = this;

        self.btnBrowse = Framework.Form.Button.Register("btnBrowse", () => { return true; }, () => {
            Framework.FileHelper.BrowseBinaries("pdf", (fileContent) => {
                this.uploadPDF(fileContent);
            });
        });

        self.divInvoiceContent = Framework.Form.TextElement.Register("divInvoiceContent");
        self.divInvoiceItems = Framework.Form.TextElement.Register("divInvoiceItems");

    }

    private uploadPDF(fileContent: string) {
        let self = this;
        self.CallWCF('UploadInvoice2', { fileContent: fileContent }, () => {

        }, (res) => {
            let json = res.Result;
            let invoice: InvoiceAnalyzerModels.Invoice = JSON.parse(json);
            InvoiceAnalyzerModels.Invoice.Render(invoice, self.divInvoiceContent, self.divInvoiceItems, "600px", 1200);
        });
    }


}

