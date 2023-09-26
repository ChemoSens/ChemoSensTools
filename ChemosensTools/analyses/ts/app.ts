class AnalysesApp extends Framework.App {

    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/analyses';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
            requirements.AppUrl = 'https://www.chemosenstools.com/analyses';
            requirements.FrameworkUrl = 'https://www.chemosenstools.com/framework';
            requirements.WcfServiceUrl = 'https://www.chemosenstools.com/WebService.svc/';
        }
        requirements.AuthorizedLanguages = ['en', 'fr'];
        //requirements.CssFiles = ['consodrive.css'];
        requirements.DefaultLanguage = 'en';
        requirements.DisableGoBack = true;
        requirements.DisableRefresh = true;
        //panelLeaderRequirements.VersionPath = 'panelleader/html/changelog.html';
        //requirements.JsFiles = ['/ts/models.js'];
        //panelLeaderRequirements.JsonResources = ['/panelleader/resources/panelleader.json', '/panelleader/resources/analysis.json', '/screenreader/resources/screenreader.json'];
        requirements.Recommanded = []; //TODO
        requirements.Required = [] //TODO;

        //requirements.Extensions = ["Crypto"];
        return requirements;
    }

    private login: string;
    private password: string;

    constructor(isInTest: boolean = false) {
        super(AnalysesApp.GetRequirements(), isInTest);
    }

    protected onError(error: string) {
        super.onError(error);
    }



    protected start(fullScreen: boolean = false) {

        super.start(fullScreen);

        //let self = this;
        this.showModalLogin();


    }

    private showModalLogin() {
        let self = this;

        this.showAsModal("html/ModalLogin.html", "Identification", (mw: Framework.Modal.Modal) => {

            let inputLoginId = Framework.Form.InputText.Register("inputLoginId", "", Framework.Form.Validator.MinLength(4), () => {
                btnLogin.CheckState();
            }, true);

            let inputLoginPassword = Framework.Form.InputText.Register("inputLoginPassword", "", Framework.Form.Validator.MinLength(4), () => {
                btnLogin.CheckState();
            }, true);

            let divLoginError = Framework.Form.TextElement.Register("divLoginError");

            let btnLogin = Framework.Form.Button.Create(() => {
                return inputLoginId.IsValid && inputLoginPassword.IsValid;
            }, () => {

                let obj = {
                    login: inputLoginId.Value,
                    password: inputLoginPassword.Value
                }

                self.CallWCF('Login', obj, () => {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                }, (res) => {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        self.login = inputLoginId.Value;
                        self.password = inputLoginPassword.Value;
                        mw.Close();
                        self.showMain();
                    } else {
                        divLoginError.SetHtml(res.ErrorMessage);
                        divLoginError.Show();
                    }
                });


            }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Login"));


            mw.AddButton(btnLogin);

        });

    }

    private showMain() {
        let self = this;

        this.show("html/Main.html", () => {
            let btnAnalysesTDS = Framework.Form.Button.Register("btnAnalysesTDS", () => { return true; }, () => {

                Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {

                    self.CallWCF('RAnalyze', { login: self.login, password: self.password, analysis: "tds", data:binaries }, () => {
                        Framework.Progress.Show(Framework.LocalizationManager.Get("Computation..."));
                    }, (res) => {
                        Framework.Progress.Hide();
                            if (res.Status == 'success') {
                                let result = JSON.parse(res.Result);
                                let URL = result.URL;

                                Framework.Browser.OpenNew(URL);

                                //let log = result.Log;
                                //Framework.Modal.Alert("Log", log, () => {
                                //    Framework.FileHelper.SaveBase64As(result.PPTasString, "report.pptx");
                                //})
                                
                        } else {
                            Framework.Modal.Alert("Erreur", res.ErrorMessage);
                        }
                    });

                });


                
            });

            
        });
    }

    

}


