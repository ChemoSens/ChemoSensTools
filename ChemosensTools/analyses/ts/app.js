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
var AnalysesApp = /** @class */ (function (_super) {
    __extends(AnalysesApp, _super);
    function AnalysesApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        return _super.call(this, AnalysesApp.GetRequirements(), isInTest) || this;
    }
    AnalysesApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/analyses';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
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
        requirements.Required = []; //TODO;
        //requirements.Extensions = ["Crypto"];
        return requirements;
    };
    AnalysesApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    AnalysesApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        //let self = this;
        this.showModalLogin();
    };
    AnalysesApp.prototype.showModalLogin = function () {
        var self = this;
        this.showAsModal("html/ModalLogin.html", "Identification", function (mw) {
            var inputLoginId = Framework.Form.InputText.Register("inputLoginId", "", Framework.Form.Validator.MinLength(4), function () {
                btnLogin.CheckState();
            }, true);
            var inputLoginPassword = Framework.Form.InputText.Register("inputLoginPassword", "", Framework.Form.Validator.MinLength(4), function () {
                btnLogin.CheckState();
            }, true);
            var divLoginError = Framework.Form.TextElement.Register("divLoginError");
            var btnLogin = Framework.Form.Button.Create(function () {
                return inputLoginId.IsValid && inputLoginPassword.IsValid;
            }, function () {
                var obj = {
                    login: inputLoginId.Value,
                    password: inputLoginPassword.Value
                };
                self.CallWCF('Login', obj, function () {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                }, function (res) {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        self.login = inputLoginId.Value;
                        self.password = inputLoginPassword.Value;
                        mw.Close();
                        self.showMain();
                    }
                    else {
                        divLoginError.SetHtml(res.ErrorMessage);
                        divLoginError.Show();
                    }
                });
            }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Login"));
            mw.AddButton(btnLogin);
        });
    };
    AnalysesApp.prototype.showMain = function () {
        var self = this;
        this.show("html/Main.html", function () {
            var btnAnalysesTDS = Framework.Form.Button.Register("btnAnalysesTDS", function () { return true; }, function () {
                Framework.FileHelper.BrowseBinaries("xlsx", function (binaries) {
                    self.CallWCF('RAnalyze', { login: self.login, password: self.password, analysis: "tds", data: binaries }, function () {
                        Framework.Progress.Show(Framework.LocalizationManager.Get("Computation..."));
                    }, function (res) {
                        Framework.Progress.Hide();
                        if (res.Status == 'success') {
                            var result = JSON.parse(res.Result);
                            var URL_1 = result.URL;
                            Framework.Browser.OpenNew(URL_1);
                            //let log = result.Log;
                            //Framework.Modal.Alert("Log", log, () => {
                            //    Framework.FileHelper.SaveBase64As(result.PPTasString, "report.pptx");
                            //})
                        }
                        else {
                            Framework.Modal.Alert("Erreur", res.ErrorMessage);
                        }
                    });
                });
            });
        });
    };
    return AnalysesApp;
}(Framework.App));
//# sourceMappingURL=app.js.map