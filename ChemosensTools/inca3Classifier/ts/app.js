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
var Inca3ClassifierApp = /** @class */ (function (_super) {
    __extends(Inca3ClassifierApp, _super);
    function Inca3ClassifierApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        var _this = _super.call(this, Inca3ClassifierApp.GetRequirements(), isInTest) || this;
        _this.modeRecherche = "exact";
        _this.login = "common";
        return _this;
        //this.start();
    }
    Inca3ClassifierApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/inca3Classifier';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
            requirements.AppUrl = 'https://www.chemosenstools.com/inca3Classifier';
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
        requirements.Extensions = ["Crypto"];
        //requirements.Extensions = ["Xlsx", "Tesseract"];
        return requirements;
    };
    Inca3ClassifierApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    Inca3ClassifierApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        this.showModalLogin();
        //this.showMain();
        var self = this;
    };
    Inca3ClassifierApp.prototype.showModalLogin = function () {
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
    Inca3ClassifierApp.prototype.showMain = function () {
        var self = this;
        this.show("html/Main.html", function () {
            var divEtapes23 = Framework.Form.TextElement.Register("divEtapes23");
            var divResultats1 = Framework.Form.TextElement.Register("divResultats1");
            var divResultats2 = Framework.Form.TextElement.Register("divResultats2");
            // Telechargement des données
            var btnTeleverseTableReference = Framework.Form.Button.Register("btnTeleverseTableReference", function () { return true; }, function () {
                Framework.FileHelper.BrowseBinaries("xlsx", function (binaries) {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Téléversement en cours..."));
                    self.CallWCF('UploadReferentiel', { data: binaries, login: self.login }, function () {
                    }, function (res) {
                        Framework.Progress.Hide();
                        if (res.Status == "success") {
                            var obj = JSON.parse(res.Result);
                            spanTableReference.SetHtml(self.login + ".xlsx chargée le " + new Date(Date.now()).toLocaleString() + ", " + obj.CountBefore + " lignes (" + obj.CountAfter + " sans doublon)");
                            divEtapes23.Show();
                        }
                        else {
                            Framework.Modal.Alert("Erreur", res.ErrorMessage);
                        }
                    });
                });
            });
            // modal d'information
            var btnInfoTeleversement = Framework.Form.Button.Register("btnInfoTeleversement", function () { return true; }, function () {
                Framework.Popup.Show(btnInfoTeleversement.HtmlElement, div, "right");
            });
            var btnInfoUpload = Framework.Form.Button.Register("btnInfoUpload", function () { return true; }, function () {
                Framework.Popup.Show(btnInfoUpload.HtmlElement, div2, "right");
            });
            // lancement du script de catégorisation
            var btnGo = Framework.Form.Button.Register("btnGo", function () { return true; }, function () {
                getDesignation();
            });
            var div2 = document.createElement("div");
            div2.innerHTML = "<p>Format attendu</p>";
            div2.innerHTML += "<p>- Fichier xlsx</p>";
            div2.innerHTML += "<p>- 1 onglet</p>";
            div2.innerHTML += "<p>- Colonne 1 : items</p>";
            Framework.Popup.Create(btnInfoUpload.HtmlElement, div2, "right", "hover");
            var pills1 = document.getElementById("pills-1-tab");
            pills1.onclick = function () { divResultats1.Hide(); divResultats2.Hide(); };
            var pills2 = document.getElementById("pills-profile1-tab");
            pills2.onclick = function () { divResultats1.Hide(); divResultats2.Hide(); };
            var div = document.createElement("div");
            div.innerHTML = "<p>Format attendu</p>";
            div.innerHTML += "<p>- Fichier xlsx</p>";
            div.innerHTML += "<p>- Onglet 1</p>";
            div.innerHTML += "<p>--- Colonne 1 : catégorie</p>";
            div.innerHTML += "<p>--- Colonne 2 : item</p>";
            div.innerHTML += "<p>- Onglet 2 (facultatif)</p>";
            div.innerHTML += "<p>--- Colonne 1 : mots de 2 lettres à ne pas supprimer (ligne 1 non prise en compte)</p>";
            div.innerHTML += "<p>- Onglet 3 (facultatif)</p>";
            div.innerHTML += "<p>--- Colonne 1 : mots à supprimer (ligne 1 non prise en compte)</p>";
            div.innerHTML += "<p>Rq: le téléchargement d’une nouvelle table écrase la précédente.</p>";
            Framework.Popup.Create(btnInfoTeleversement.HtmlElement, div, "right", "hover");
            var btnSupprimeTableReference = Framework.Form.Button.Register("btnSupprimeTableReference", function () { return true; }, function () {
                Framework.Progress.Show(Framework.LocalizationManager.Get("Suppression en cours..."));
                self.CallWCF('SupprimeReferentiel', { login: self.login }, function () {
                }, function (res) {
                    Framework.Progress.Hide();
                    if (res.Status == "success") {
                        spanTableReference.SetHtml("aucune");
                        divEtapes23.Hide();
                    }
                    else {
                        Framework.Modal.Alert("Erreur", res.ErrorMessage);
                    }
                });
            });
            var spanTableReference = Framework.Form.TextElement.Register("spanTableReference");
            var textareaPourcentage = Framework.Form.InputText.Register("textareaPourcentage", "45", undefined, function (newValue) {
                //getDesignation();
            }, false);
            var textareaTroncature = Framework.Form.InputText.Register("textareaTroncature", "200", undefined, function (newValue) {
                //getDesignation();
            }, false);
            var textareaDifferenceCorrespondance = Framework.Form.InputText.Register("textareaDifferenceCorrespondance", "50", undefined, function (newValue) {
                //getDesignation();
            }, false);
            self.textareaDesignation = Framework.Form.InputText.Register("textareaDesignation", "", undefined, function (newValue) {
                //getDesignation();
            });
            var inputMatchExact = Framework.Form.CheckBox.Register("inputMatchExact", function () { return true; }, function () {
                //getDesignation();
            }, "");
            var inputSupprimeDoublons = Framework.Form.CheckBox.Register("inputSupprimeDoublons", function () { return true; }, function () {
                //getDesignation();
            }, "");
            inputSupprimeDoublons.Check();
            var inputTauxCorrespondancePondere = Framework.Form.CheckBox.Register("inputTauxCorrespondancePondere", function () { return true; }, function () {
                //getDesignation();
            }, "");
            var stat = "mode";
            var group = new Framework.Form.RadioGroup();
            var checkStatMode = Framework.Form.RadioElement.Register("checkStatMode", group, function () {
                stat = "mode";
                //getDesignation();
            });
            var checkStatFreq = Framework.Form.RadioElement.Register("checkStatFreq", group, function () {
                stat = "freq";
                //getDesignation();
            });
            var checkStatMoy = Framework.Form.RadioElement.Register("checkStatMoy", group, function () {
                stat = "moy";
                //getDesignation();
            });
            var textareaDesignationNettoyee = Framework.Form.TextElement.Register("textareaDesignationNettoyee");
            //let divCIQUAL = Framework.Form.TextElement.Register("divCIQUAL");
            //let divKeywordsCIQUAL = Framework.Form.TextElement.Register("divKeywordsCIQUAL");
            self.divResultat = Framework.Form.TextElement.Register("divResultat");
            var divCategorie = Framework.Form.TextElement.Register("divCategorie");
            var divCorrespondance = Framework.Form.TextElement.Register("divCorrespondance");
            var getDesignation = function () {
                if (self.textareaDesignation.Value.length > 2) {
                    //Framework.Progress.Show("Recherche en cours...");
                    divResultats1.Hide();
                    textareaDesignationNettoyee.Set("");
                    console.time("execution");
                    self.CallWCF('ClassifieurFamilleFoodEx', { designation: self.textareaDesignation.Value, login: self.login, pourcentage: Number(textareaPourcentage.Value), matchExact: inputMatchExact.IsChecked, supprimeDoublons: inputSupprimeDoublons.IsChecked, troncature: Number(textareaTroncature.Value), differenceCorrespondance: Number(textareaDifferenceCorrespondance.Value), tauxCorrespondancePondere: inputTauxCorrespondancePondere.IsChecked }, function () {
                    }, function (res) {
                        var json = res.Result;
                        var result = JSON.parse(json);
                        divResultats2.Hide();
                        divResultats1.Show();
                        textareaDesignationNettoyee.Set(result.DesignationNettoyee);
                        divCorrespondance.SetHtml("Recherche en cours...");
                        divCategorie.SetHtml("Recherche en cours...");
                        self.divResultat.SetHtml("Recherche en cours...");
                        var table = new Framework.Form.Table();
                        table.CanSelect = false;
                        table.ShowFooter = false;
                        table.ListData = result.ListeReferenceOFF;
                        table.Height = "300px";
                        table.FullWidth = false;
                        table.AddCol("Famille", "Catégorie", 400, "left");
                        table.AddCol("Designation", "Désignation", 400, "left");
                        table.AddCol("DesignationNettoyee", "Designation nettoyée", 400, "left");
                        table.AddCol("Pourcentage", "Taux de correspondance (%)", 200, "left");
                        table.AddCol("PourcentagePondere", "Taux de correspondance pondéré (%)", 200, "left");
                        table.AddCol("DifferenceCorrespondance", "Différence de correspondance pondéré (%)", 200, "left");
                        table.Render(divCorrespondance.HtmlElement);
                        if (result.ListeReferenceOFF.length > 0) {
                            if (stat == "mode") {
                                divCategorie.Set(result.Mode);
                            }
                            if (stat == "freq") {
                                divCategorie.Set(result.Freq);
                            }
                            if (stat == "moy") {
                                divCategorie.Set(result.TauxCorrespondanceMoyen);
                            }
                        }
                        else {
                            divCategorie.Set("Aucune catégorie trouvée");
                        }
                        var table2 = new Framework.Form.Table();
                        table2.CanSelect = false;
                        table2.ShowFooter = false;
                        table2.ListData = result.ListeFamilleFoodEx;
                        table2.Height = "100px";
                        table2.FullWidth = false;
                        table2.AddCol("Famille", "Catégorie", 500, "left");
                        table2.AddCol("Pourcentage", "Fréquence d'occurrence (%)", 300, "left");
                        table2.AddCol("PourcentageMoyen", "Taux pondéré moyen", 300, "left");
                        table2.Render(self.divResultat.HtmlElement);
                        //Framework.Progress.Hide();
                    });
                    console.timeEnd("execution"); //mesure du temps
                }
            };
            //self.btnRefresh = Framework.Form.Button.Register("btnRefresh", () => { return true; }, () => {
            //    getDesignation();
            //});
            var btnUpload = Framework.Form.Button.Register("btnUpload", function () { return true; }, function () {
                Framework.FileHelper.BrowseBinaries("xlsx", function (binaries) {
                    divResultats2.Hide();
                    divResultats1.Hide();
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Calcul en cours..."));
                    console.time("execution_fichier");
                    self.CallWCF('ClassifieurFamilleFoodExExcel', { data: binaries, login: self.login, pourcentage: Number(textareaPourcentage.Value), matchExact: inputMatchExact.IsChecked, supprimeDoublons: inputSupprimeDoublons.IsChecked, troncature: Number(textareaTroncature.Value), stat: stat, differenceCorrespondance: Number(textareaDifferenceCorrespondance.Value), tauxCorrespondancePondere: inputTauxCorrespondancePondere.IsChecked }, function () {
                    }, function (res) {
                        Framework.Progress.Hide();
                        if (res.Status == "success") {
                            divResultats2.Show();
                            Framework.FileHelper.SaveBase64As(res.Result, "Resultat" + new Date(Date.now()).toLocaleString() + ".xlsx");
                            console.timeEnd("execution_fichier");
                        }
                        else {
                            alert("error : " + res.ErrorMessage);
                        }
                    });
                });
            });
        });
    };
    return Inca3ClassifierApp;
}(Framework.App));
//# sourceMappingURL=app.js.map