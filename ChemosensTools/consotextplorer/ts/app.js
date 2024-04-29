var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FcLexiconApp = /** @class */ (function (_super) {
    __extends(FcLexiconApp, _super);
    function FcLexiconApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        return _super.call(this, FcLexiconApp.GetRequirements(), isInTest) || this;
    }
    FcLexiconApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/consotextplorer';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
            requirements.AppUrl = 'https://www.chemosenstools.com/consotextplorer';
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
        requirements.Extensions = ["Crypto"];
        //requirements.Extensions = ["Xlsx", "Tesseract"];
        return requirements;
    };
    FcLexiconApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    FcLexiconApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        if (this.requirements.AppUrl == 'http://localhost:44301/consotextplorer') {
            this.login = "test";
            this.password = "test";
            this.showMain();
        }
        else {
            this.showModalLogin();
        }
    };
    FcLexiconApp.prototype.showModalLogin = function () {
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
    FcLexiconApp.prototype.setSelectCategoriesProduit = function (produits) {
        var self = this;
        this.selectCategoriesProduit = Framework.Form.Select.Register("selectCategoriesProduit", "", Framework.KeyValuePair.FromArray(produits), Framework.Form.Validator.NoValidation(), function (x) { self.analysisOptions.CategorieProduit = x; });
    };
    FcLexiconApp.prototype.setModalites = function (modalites) {
        var self = this;
        self.divModalitesAExclure.Set("");
        modalites.forEach(function (x) {
            if (x != "" && x.indexOf("localisation") == -1 && x.indexOf("quantifieur") == -1) {
                var cb = Framework.Form.CheckBox.Create(function () { return true; }, function (ev, cb) {
                    if (cb.IsChecked) {
                        self.analysisOptions.ExcludedModalities.push(cb.Value);
                    }
                    else {
                        Framework.Array.Remove(self.analysisOptions.ExcludedModalities, cb.Value);
                    }
                }, x, x);
                cb.Value = x;
                self.divModalitesAExclure.Append(cb);
            }
        });
    };
    FcLexiconApp.prototype.showMain = function () {
        var self = this;
        self.analysisOptions = new FcLexiconModels.AnalysisOption();
        self.CallWCF('TesteLexique', { name: self.login }, function () {
            Framework.Progress.Show("");
        }, function (res) {
            Framework.Progress.Hide();
            var lexique = ["Défaut"];
            var ress = JSON.parse(res.Result);
            if (ress.Exist == true) {
                lexique.push("Perso");
            }
            // TODO : par défaut charger un des lexiques et donner les stats dessus
            self.show("html/Main.html", function () {
                self.textareaDesignation = Framework.Form.InputText.Register("textareaDesignation", "", undefined, function (newValue) {
                    //self.cleanDesignation(newValue);
                });
                //self.spanMotsRetenus = Framework.Form.TextElement.Register("spanMotsRetenus");
                //self.spanMotsNonRetenus = Framework.Form.TextElement.Register("spanMotsNonRetenus");
                self.checkMRCA = Framework.Form.CheckBox.Register("checkMRCA", function () { return true; }, function (ev, cb) {
                    self.analysisOptions.MRCA = cb.IsChecked;
                }, "");
                self.checkMRCA.Uncheck;
                self.checkTestDescripteur = Framework.Form.CheckBox.Register("checkTestDescripteur", function () { return true; }, function (ev, cb) {
                    self.analysisOptions.TableauDescripteur = cb.IsChecked;
                }, "");
                self.checkTestDescripteur.Uncheck();
                self.checkCorrection = Framework.Form.CheckBox.Register("checkCorrection", function () { return true; }, function (ev, cb) {
                    self.analysisOptions.Correction = cb.IsChecked;
                }, "");
                self.checkCorrection.Check();
                self.divTableau = Framework.Form.TextElement.Register("divTableau");
                self.divModalitesAExclure = Framework.Form.TextElement.Register("divModalitesAExclure");
                self.setModalites(ress.Modalities);
                self.setSelectCategoriesProduit(ress.Products);
                //self.selectCategoriesProduit = Framework.Form.Select.Register("selectCategoriesProduit", "", [], Framework.Form.Validator.NoValidation(), (x) => { self.categorieProduit = x; });
                self.selectLexique = Framework.Form.Select.Register("selectLexique", "Défaut", Framework.KeyValuePair.FromArray(lexique), Framework.Form.Validator.NoValidation(), function (x) {
                    if (x == "Perso") {
                        self.analysisOptions.Lexicon = self.login;
                    }
                    else {
                        self.analysisOptions.Lexicon = "lexicon";
                    }
                });
                self.selectAlpha = Framework.Form.Select.Register("selectAlpha", 0.05, Framework.KeyValuePair.FromArray(["0.01", "0.05", "0.10"]), Framework.Form.Validator.NoValidation(), function (x) {
                    self.analysisOptions.Alpha = Number(x);
                });
                //self.spanDesignationNettoyee = Framework.Form.TextElement.Register("spanDesignationNettoyee");
                //self.btnUploadFichierExcel = Framework.Form.Button.Register("btnUploadFichierExcel", () => { return true; }, () => {
                //    Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {
                //        Framework.Progress.Show(Framework.LocalizationManager.Get("Computation..."));
                //        //self.CallWCF('GetSensoryWordsInXls', { data: binaries, lexicon: self.lexicon, productCategory: self.categorieProduit, correction: self.correction == "oui" }, () => {
                //        self.CallWCF('GetSensoryWordsInXls', { data: binaries, options: JSON.stringify(self.analysisOptions)}, () => {
                //        }, (res) => {
                //            Framework.Progress.Hide();
                //            if (res.Status == "success") {
                //                Framework.FileHelper.SaveBase64As(res.Result, "result.xlsx");
                //            } else {
                //                alert("error");
                //            }
                //        });
                //    });
                //});
                self.btnUploadFichierExcelForAnalysis = Framework.Form.Button.Register("btnUploadFichierExcelForAnalysis", function () { return true; }, function () {
                    Framework.FileHelper.BrowseBinaries("xlsx", function (binaries) {
                        Framework.Progress.Show(Framework.LocalizationManager.Get("Computation..."));
                        //self.CallWCF('GetSensoryWordsInXlsForAnalysis', { login: self.login, password: self.password, data: binaries, lexicon: self.lexicon, productCategory: self.categorieProduit, correction: self.correction == "oui", analysisOptions: JSON.stringify(self.analysisOptions) }, () => {
                        self.CallWCF('GetSensoryWordsInXlsForAnalysis', { login: self.login, password: self.password, data: binaries, options: JSON.stringify(self.analysisOptions) }, function () {
                        }, function (res) {
                            Framework.Progress.Hide();
                            if (res.Status == 'success') {
                                Framework.FileHelper.SaveBase64As(res.Result, "result.xlsx");
                                //let result = JSON.parse(res.Result);
                                //let URL = result.URL;
                                //Framework.Browser.OpenNew(URL);
                            }
                            else {
                                Framework.Modal.Alert("Erreur", res.ErrorMessage);
                            }
                        });
                    });
                });
                self.btnUploadFichierLexique = Framework.Form.Button.Register("btnUploadFichierLexique", function () { return true; }, function () {
                    Framework.FileHelper.BrowseBinaries("xlsx", function (binaries) {
                        self.CallWCF('UploadLexicon', { login: self.login, password: self.password, data: binaries }, function () {
                            Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                        }, function (res) {
                            Framework.Progress.Hide();
                            if (res.Status == 'success') {
                                self.analysisOptions.Lexicon = self.login;
                                Framework.Modal.Alert("", "Lexique téléversé et choisi comme lexique par défaut.");
                                //TODO : renvoi nombre concepts, catégories produit, modalités senso
                            }
                            else {
                                Framework.Modal.Alert("Erreur", res.ErrorMessage);
                            }
                        });
                    });
                });
                self.btnRefresh = Framework.Form.Button.Register("btnRefresh", function () { return true; }, function () {
                    self.cleanDesignation(self.textareaDesignation.Value);
                });
            });
        });
    };
    FcLexiconApp.prototype.cleanDesignation = function (description) {
        var self = this;
        //self.CallWCF('GetSensoryWords', { txt: description, lexicon: self.lexicon, productCategory: self.categorieProduit, correction: self.correction == "oui" }, () => {
        self.CallWCF('GetSensoryWords', { txt: description, options: JSON.stringify(self.analysisOptions) }, function () {
            Framework.Progress.Show(Framework.LocalizationManager.Get("Analyse..."));
            self.divTableau.Set("");
        }, function (res) {
            var json = res.Result;
            var result = JSON.parse(json);
            var MotsRetenus = "";
            Framework.Progress.Hide();
            self.setSelectCategoriesProduit(result.CategoriesProduit);
            //self.selectCategoriesProduit = Framework.Form.Select.Register("selectCategoriesProduit", "", Framework.KeyValuePair.FromArray(result.CategoriesProduit), Framework.Form.Validator.NoValidation(), (x) => { self.categorieProduit = x; });
            result.Concepts.forEach(function (m) {
                MotsRetenus += m.Word + " ";
            });
            var txt = "<p>" + result.TexteNettoye + "</p>";
            txt += "<p>contexte/descripteur/quantifieur (non agrégé) ==> contexte/modalité/concept/quantifieur/descripteur (agrégé)</p>";
            result.Concepts.forEach(function (m) {
                txt += "<p><span style='color:blue'>" + m.ExtractedText + "</span> ==> <span style='color:green'>" + m.HandledText + "</span></p>";
            });
            self.divTableau.SetHtml(txt);
            //let table: Framework.Form.Table<FcLexiconModels.Pretraitement> = new Framework.Form.Table<FcLexiconModels.Pretraitement>();
            //table.CanSelect = false;
            //table.ShowFooter = false;
            //table.ListData = result.Concepts;
            //table.Height = "40vh";
            //table.FullWidth = true;
            //table.AddCol("Word", "Mot(s)", 100, "left");
            //table.AddCol("Type", "Type", 200, "left");
            //table.AddCol("Corrected", "Correction", 100, "left");
            //table.AddCol("Modality", "Modalité", 100, "left");
            //table.AddCol("Descriptor", "Descripteur", 100, "left");
            //table.AddCol("RootConcept", "Root concept", 100, "left");
            //table.AddCol("PredecessorConcept", "Predecessor concept", 100, "left");
            //table.AddCol("Quantifier", "Quantifieur", 100, "left");
            //table.AddCol("QuantifierConcept", "Quantifieur agrégé", 100, "left");
            //table.Render(self.divTableau.HtmlElement);
        });
    };
    return FcLexiconApp;
}(Framework.App));
//# sourceMappingURL=app.js.map