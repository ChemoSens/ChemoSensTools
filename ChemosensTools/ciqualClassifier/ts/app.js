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
var CiqualClassifierApp = /** @class */ (function (_super) {
    __extends(CiqualClassifierApp, _super);
    function CiqualClassifierApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        var _this = _super.call(this, CiqualClassifierApp.GetRequirements(), isInTest) || this;
        _this.modeRecherche = "exact";
        return _this;
        //this.start();
    }
    CiqualClassifierApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/ciqualClassifier';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
            requirements.AppUrl = 'https://www.chemosenstools.com/ciqualClassifier';
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
    CiqualClassifierApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    CiqualClassifierApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        if (this.requirements.AppUrl == 'http://localhost:44301/ciqualClassifier') {
            this.showMain();
        }
        else {
            this.showModalLogin();
        }
        var self = this;
    };
    //private cleanDescription(description: string) {
    //    let self = this;
    //    self.CallWCF('CalculeSurTexte', { txt: description }, () => {
    //    }, (res) => {
    //        let json = res.Result;
    //        let result: Models.CleanDescriptionResult = JSON.parse(json);
    //        //self.textareaTexteNettoye.Set(result.DescriptionNettoyee);
    //        let display: string = "";
    //        display += result.Detail.join("\n") + "\n\n";
    //        display += "UT : " + result.UT + " (" + result.NbMarqueursUT + " marqueur(s)), Naturalite : " + result.Naturalite + "\n";
    //        display += "Nb ingredients : " + result.NbIngredients + ", Nb additifs : " + result.NbAdditifs + "\n\n";
    //        display += "Pourcentage ingredients renseigne : " + result.PourcentageIngredientsRenseigne + "%\n\n";
    //        display += "Marqueur(s) UT : " + result.MarqueursUT.join(", ") + "\n\n";
    //        display += "Regex(s) : " + result.Regex.join(", ") + "\n\n";
    //        //self.textareaIngredients.Set(result.Detail.join("\n") + "\n\nMarqueur(s) UT : " + result.MarqueursUT.join(", ") + "\n\nRegex : " + result.Regex.join("\n"));
    //        self.textareaIngredients.Set(display);
    //        self.textareaIngredients2.Set(result.Detail.join(", "));
    //    });
    //}
    CiqualClassifierApp.prototype.showModalLogin = function () {
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
    CiqualClassifierApp.prototype.showMain = function () {
        var self = this;
        this.show("html/Main.html", function () {
            self.CallWCF('ClassifieurCiqual', { txt: "", modeRecherche: "" }, function () {
                Framework.Progress.Show("Chargement en cours");
            }, function (res) {
                Framework.Progress.Hide();
                self.textareaDesignation = Framework.Form.InputText.Register("textareaDesignation", "", undefined, function (newValue) {
                    classify();
                });
                var inputRechercheConsomme = Framework.Form.CheckBox.Register("inputRechercheConsomme", function () { return true; }, function () {
                    modeRecherche = "";
                    if (inputRechercheConsomme.IsChecked == true) {
                        modeRecherche = "consomme";
                    }
                    classify();
                }, "");
                //let textareaDesignationNettoyee = Framework.Form.TextElement.Register("textareaDesignationNettoyee");
                var divCIQUAL = Framework.Form.TextElement.Register("divCIQUAL");
                var divCIQUAL2 = Framework.Form.TextElement.Register("divCIQUAL2");
                var divCIQUAL3 = Framework.Form.TextElement.Register("divCIQUAL3");
                var divCIQUAL4 = Framework.Form.TextElement.Register("divCIQUAL4");
                var divKeywordsCIQUAL = Framework.Form.TextElement.Register("divKeywordsCIQUAL");
                var modeRecherche = "";
                self.btnCIQUAL = Framework.Form.Button.Register("btnCIQUAL", function () { return true; }, function () {
                    classify(true);
                });
                var classify = function (reload) {
                    if (reload === void 0) { reload = false; }
                    divCIQUAL.Set("Recherche en cours...");
                    divCIQUAL2.Set("Recherche en cours...");
                    divCIQUAL3.Set("Recherche en cours...");
                    divCIQUAL4.Set("Recherche en cours...");
                    divKeywordsCIQUAL.Set("Recherche en cours...");
                    self.CallWCF('ClassifieurCiqual', { txt: self.textareaDesignation.Value, modeRecherche: modeRecherche, reload: reload }, function () {
                    }, function (res) {
                        if (res.Status == "success") {
                            var json = res.Result;
                            var obj = JSON.parse(json);
                            //divCIQUAL.
                            divKeywordsCIQUAL.Set(obj.MotsCles);
                            var txt_1 = "";
                            var txt2_1 = "";
                            var txt3_1 = "";
                            var txt4_1 = "";
                            obj.Matches.filter(function (x) {
                                if (x.MeilleurMatch == 1) {
                                    txt_1 += x.DesignationCIQUAL + "\n";
                                }
                                else if (x.NbMots == -1) {
                                    txt4_1 += x.DesignationCIQUAL + "\n";
                                }
                                else if (x.MatchApproximatif == 1) {
                                    if (x.MeilleurMatchApproximatif == 1) {
                                        txt2_1 += x.DesignationCIQUAL + "\n";
                                    }
                                    else {
                                    }
                                }
                                else {
                                    txt3_1 += x.DesignationCIQUAL + "\n";
                                }
                            });
                            divCIQUAL.Set(txt_1);
                            divCIQUAL2.Set(txt2_1);
                            divCIQUAL3.Set(txt3_1);
                            divCIQUAL4.Set(txt4_1);
                        }
                        else {
                            alert("error");
                        }
                    });
                };
                //let btnUpload = Framework.Form.Button.Register("btnUpload", () => { return true; }, () => {
                //    //getDesignation(self.textareaDesignation.Value, Number(textareaPourcentage.Value));
                //    Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {
                //        Framework.Progress.Show(Framework.LocalizationManager.Get("Calcul en cours..."));
                //        self.CallWCF('ClassifieurFamilleFoodExExcel', { data: binaries, pourcentage: Number(textareaPourcentage.Value) }, () => {
                //        }, (res) => {
                //            Framework.Progress.Hide();
                //            if (res.Status == "success") {
                //                Framework.FileHelper.SaveBase64As(res.Result, "ResultatFoodEx.xlsx");
                //            } else {
                //                alert("error : " + res.ErrorMessage);
                //            }
                //        });
                //    });
                //});
                var btnUpload2 = Framework.Form.Button.Register("btnUpload2", function () { return true; }, function () {
                    Framework.FileHelper.BrowseBinaries("xlsx", function (binaries) {
                        Framework.Progress.Show(Framework.LocalizationManager.Get("Calcul en cours..."));
                        self.CallWCF('ClassifieurCiqualXlsIn', { data: binaries, modeRecherche: modeRecherche }, function () {
                        }, function (res) {
                            Framework.Progress.Hide();
                            if (res.Status == "success") {
                                Framework.FileHelper.SaveBase64As(res.Result, "ResultatCIQUAL.xlsx");
                            }
                            else {
                                alert("error");
                            }
                        });
                    });
                });
            });
        });
    };
    //private showMain() {
    //    let self = this;
    //    this.show("html/Main.html", () => {
    //        self.textareaDesignation = Framework.Form.InputText.Register("textareaDesignation", "", undefined, (newValue: string) => {
    //            self.cleanDesignation(newValue);
    //        });
    //        //self.pDesignationNettoyee = Framework.Form.TextElement.Register("pDesignationNettoyee");
    //        //self.pMotsClesLogigramme = Framework.Form.TextElement.Register("pMotsClesLogigramme");
    //        //self.pMotsClesCiqual = Framework.Form.TextElement.Register("pMotsClesCiqual");
    //        //self.pLogigramme = Framework.Form.TextElement.Register("pLogigramme");
    //        //self.pAlternatives = Framework.Form.TextElement.Register("pAlternatives");
    //        //self.pMotsCles = Framework.Form.TextElement.Register("pMotsCles");
    //        //self.pAllegations = Framework.Form.TextElement.Register("pAllegations");
    //        self.spanMotsCles = Framework.Form.TextElement.Register("spanMotsCles");
    //        let radioGroup: Framework.Form.RadioGroup = Framework.Form.RadioGroup.Register();
    //        self.inputModeRechercheTous = Framework.Form.RadioElement.Register("inputModeRechercheTous", radioGroup, () => {
    //            self.modeRecherche = ""; self.cleanDesignation(self.textareaDesignation.Value);
    //        })
    //        self.inputModeRechercheConsomme = Framework.Form.RadioElement.Register("inputModeRechercheConsomme", radioGroup, () => {
    //            self.modeRecherche = "consomme"; self.cleanDesignation(self.textareaDesignation.Value);
    //        })
    //        self.inputModeRechercheCommercialise = Framework.Form.RadioElement.Register("inputModeRechercheCommercialise", radioGroup, () => {
    //            self.modeRecherche = "commercialise"; self.cleanDesignation(self.textareaDesignation.Value);
    //        })
    //        self.divResultat = Framework.Form.TextElement.Register("divResultat");
    //        //self.pNutriscore = Framework.Form.TextElement.Register("pNutriscore");
    //        //self.pTLSucre = Framework.Form.TextElement.Register("pTLSucre");
    //        //self.pTLSodium = Framework.Form.TextElement.Register("pTLSodium");
    //        //self.pTLLipide = Framework.Form.TextElement.Register("pTLLipide");
    //        //self.pTLAGSature = Framework.Form.TextElement.Register("pTLAGSature");
    //        //self.pEF = Framework.Form.TextElement.Register("pEF");
    //        //self.pGES = Framework.Form.TextElement.Register("pGES");
    //        //self.divResultatAlgorithme = Framework.Form.TextElement.Register("divResultatAlgorithme");
    //        //self.textareaDesignationNettoyee = Framework.Form.InputText.Register("textareaDesignationNettoyee", "");
    //        //self.textareaResultatDesignation = Framework.Form.InputText.Register("textareaResultatDesignation", "");
    //        //self.textareaDescription = Framework.Form.InputText.Register("textareaDescription", "", undefined, (newValue: string) => { self.cleanDescription(newValue); });
    //        //self.textareaTexteNettoye = Framework.Form.InputText.Register("textareaTexteNettoye", "");
    //        //self.textareaIngredients = Framework.Form.InputText.Register("textareaIngredients", "");
    //        //self.textareaIngredients2 = Framework.Form.InputText.Register("textareaIngredients2", "");
    //        //self.btnUploadFichierExcel = Framework.Form.Button.Register("btnUploadFichierExcel", () => { return true; }, () => {
    //        //    Framework.FileHelper.BrowseBinaries("xlsx", (file) => {
    //        //        self.uploadFichierExcel(file);
    //        //    });
    //        //});
    //        //self.btnUploadFichierExcel2 = Framework.Form.Button.Register("btnUploadFichierExcel2", () => { return true; }, () => {
    //        //    self.CallWCF('CalculeSurFichierExcel2', {}, () => {
    //        //    }, (res) => {
    //        //        let json = res.Result;
    //        //    });
    //        //});
    //        self.btnNettoieDesignationFichierExcel = Framework.Form.Button.Register("btnNettoieDesignationFichierExcel", () => { return true; }, () => {
    //            self.CallWCF('ClassifieurCiqualXls', {}, () => {
    //            }, (res) => {
    //                let json = res.Result;
    //            });
    //        });
    //        self.btnUploadFichierExcel = Framework.Form.Button.Register("btnUploadFichierExcel", () => { return true; }, () => {
    //            Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {
    //                Framework.Progress.Show(Framework.LocalizationManager.Get("Computation..."));
    //                self.CallWCF('ClassifieurCiqualXlsIn', { data: binaries }, () => {
    //                }, (res) => {
    //                    Framework.Progress.Hide();
    //                    if (res.Status == "success") {
    //                        Framework.FileHelper.SaveBase64As(res.Result, "result.xlsx");
    //                    } else {
    //                        alert("error");
    //                    }
    //                });
    //            });
    //        });
    //        //self.btnUploadImage = Framework.Form.Button.Register("btnUploadImage", () => { return true; }, () => {
    //        //    Tesseract.recognize(
    //        //        'http://localhost:44301/labelExtractor/data/ingredients_fr.425.full.jpg',
    //        //        'fra'
    //        //    ).then(({ data: { text } }) => {
    //        //        self.textareaDescription.Set(text);
    //        //    }).catch((x) => {
    //        //        alert(x);
    //        //    });
    //        //});
    //        //self.btnRefresh = Framework.Form.Button.Register("btnRefresh", () => { return true; }, () => {
    //        //    self.cleanDescription(self.textareaDescription.Value);
    //        //});
    //        self.btnRefresh = Framework.Form.Button.Register("btnRefresh", () => { return true; }, () => {
    //            self.cleanDesignation(self.textareaDesignation.Value);
    //        });
    //        //self.btnCopy = Framework.Form.Button.Register("btnCopy", () => { return true; }, () => {
    //        //    var copyText = document.getElementById("textareaIngredients2");
    //        //    (<HTMLTextAreaElement>copyText).select();
    //        //    (<HTMLTextAreaElement>copyText).setSelectionRange(0, 99999);
    //        //    document.execCommand("copy");
    //        //});
    //        //self.btnCopy2 = Framework.Form.Button.Register("btnCopy2", () => { return true; }, () => {
    //        //    var copyText = document.getElementById("textareaDesignationNettoyee");
    //        //    (<HTMLTextAreaElement>copyText).select();
    //        //    (<HTMLTextAreaElement>copyText).setSelectionRange(0, 99999);
    //        //    document.execCommand("copy");
    //        //});
    //    });
    //}
    CiqualClassifierApp.prototype.cleanDesignation = function (description) {
        var self = this;
        self.CallWCF('ClassifieurCiqual', { txt: description, modeRecherche: self.modeRecherche }, function () {
        }, function (res) {
            if (res.Status == "success") {
                var json_1 = res.Result;
                var obj = JSON.parse(json_1);
                if (obj.Matches.length == 0) {
                    self.divResultat.SetHtml("<p style='color:red'>Aucun résultat</p>");
                }
                else {
                    var txt1 = "";
                    var txt2 = "";
                    //obj.Matches.filter(x => {
                    //    if (x.MeilleurMatch == 1) {
                    //        txt1 += "";
                    //        let o: HTMLOptionElement = document.createElement("option");
                    //        o.value = x.Designation + "                                                                                                                                                                                                                                               " + designation;
                    //        o.setAttribute("designation", x.Designation)
                    //        o.setAttribute("code", x.alim_code)
                    //        selectAliment.appendChild(o);
                    //    }
                    //    if (x.MeilleurMatch == 0 && x.MatchApproximatif == 1) {
                    //        let o: HTMLOptionElement = document.createElement("option");
                    //        o.value = x.Designation + "                                                                                                                                                                                                                                        " + designation;
                    //        o.setAttribute("designation", x.Designation)
                    //        o.setAttribute("code", x.alim_code)
                    //        selectAliment.appendChild(o);
                    //    }
                    //});
                    self.divResultat;
                }
            }
            else {
                //alert("error");
            }
            var json = res.Result;
            var result = JSON.parse(json);
            if (result.MotsCles != "") {
                self.spanMotsCles.SetHtml(result.MotsCles.join(","));
            }
            if (result.Matches.length == 0) {
                self.divResultat.SetHtml("<p style='color:red'>Aucun résultat</p>");
            }
            else {
                //// Meilleur match
                //// 1. tous les mots impératifs + tous les mots suggérés + max de mots facultatifs
                //// 2. tous les mots impératifs + max de mots suggérés + max de mots facultatifs
                //// 3. max de mots impératifs + max de mots suggérés + max de mots facultatifs
                //meilleurMatches1 = result.Matches.filter(x => x.MeilleurMatch == 1);
                ////let meilleurMatches2 = result.Matches.filter(x => x.MeilleurMatch == 2);
                ////let meilleurMatches3 = result.Matches.filter(x => x.MeilleurMatch == 3);
                ////let alimentsMoyens = result.Matches.filter(x => x.AlimentMoyen == 1);
                ////if (alimentsMoyens.length > 0) {
                ////    let max = Math.max.apply(Math, alimentsMoyens.map(function (o) { return o.NbMotsImperatifs }))
                ////    alimentsMoyens = alimentsMoyens.filter(x => x.NbMotsImperatifs == max);
                ////}
                //let text = "";
                //if (meilleurMatches1.length > 0) {
                //    //text += "<h4 style='color:blue'>Meilleure(s) correspondances - Niveau de confiance 1 (tous les mots impératifs + tous les mots suggérés + max de mots facultatifs)</h3>";
                //    text += "<h4>Meilleure(s) correspondances</h3>";
                //    meilleurMatches1.forEach(x => {
                //        if (x.MatchApproximatif == 1) {
                //            text += "<p style='color:orange'>";
                //        } else {
                //            text += "<p style='color:green'>";
                //        }
                //        //text += x.Designation + " (" + x.Match + " : " + x.NiveauCorrespondance + ", " + x.NombreCorrespondances + ")" + "</p>";
                //        text += x.Designation + " (" + x.Match + " : niveau " + x.NiveauCorrespondance + "/" + x.NiveauMax + ", mots clés " + x.NombreCorrespondances + "/" + x.NbMots + ")" + "</p>";
                //    });
                //}
                ////if (meilleurMatches2.length > 0) {
                ////    text += "<h4 style='color:green'>Meilleure(s) correspondances - Niveau de confiance 2 (tous les mots impératifs + max de mots suggérés + max de mots facultatifs)</h3>";
                ////    meilleurMatches2.forEach(x => {
                ////        text += "<p style='color:green'>" + x.Designation + "</p>";
                ////    });
                ////}
                ////if (meilleurMatches3.length > 0) {
                ////    text += "<h4 style='color:orange'>Meilleure(s) correspondances - Niveau de confiance 3 (max de mots impératifs + max de mots suggérés + max de mots facultatifs)</h3>";
                ////    meilleurMatches3.forEach(x => {
                ////        text += "<p style='color:orange'>" + x.Designation + "</p>";
                ////    });
                ////}
                ////text += "<h4>Correspondances - aliments moyens</h3>";                
                ////alimentsMoyens.forEach(x => {
                ////    text += "<p>" + x.Designation + "</p>";
                ////});
                ////text += "<h4>Toutes les correspondances - Tri par : Nb mots impératifs décroissant (gras si tous les mots impératifs) puis par Nb mot suggeres décroissant (italique si tous les mots suggérés) puis par Nb mots facultatifs décroissants puis par Nb mots croissants puis par Désignation </h4>";                
                //text += "<h4>Toutes les correspondances</h4>";
                //result.Matches.forEach(x => {
                //    //text += "<p style='";
                //    //if (x.MatchExact == 1 && x.NbMotsImperatifs > 0) {
                //    //    text += "font-weight:bold;";
                //    //}
                //    //if (x.MatchSuggere == 1 && x.NbMotsSuggeres > 0) {
                //    //    text += "font-style: italic";
                //    //}                                                    
                //    text += "<p>" + x.Designation + " (" + x.Match + " : niveau " + x.NiveauCorrespondance + "/" + x.NiveauMax + ", mots clés " + x.NombreCorrespondances + "/" + x.NbMots + ")" + "</p>";
                //});
                ////let designations = result.Matches.map(x => {
                ////    let text = "<p style='color:";
                ////    if (x.MeilleurMatch == 1) {
                ////        text += "blue";
                ////    } else if (x.MatchExact == 1) {
                ////        text += "green";
                ////    } else {
                ////        text += "orange";
                ////    }
                ////    text += "'>" + x.Designation + "</p>";
                ////    return text;
                ////});
                ////self.divResultat.SetHtml(designations.join(""));
                //let meilleurMatches = result.Matches.filter(x => x.MeilleurMatch > 0);
                //let text = "<h4>Meilleure(s) correspondances</h4>";
                //meilleurMatches.forEach(x => {
                //    if (x.MatchApproximatif == 1) {
                //        text += "<p style='color:orange'>";
                //    } else {
                //        text += "<p style='color:green'>";
                //    }
                //    text += x.aliment_libelle_INCA3 + "</p>";
                //});
                //self.divResultat.SetHtml(text);
            }
            //self.pDesignationNettoyee.Set(result.MotsCles.join(", "));
            //self.pMotsClesLogigramme.Set(result.MotsClesLogigramme.join(", "));
            //self.pLogigramme.Set(result.Logigramme);
            //self.pMotsClesCiqual.Set(result.MotsClesCiqual.join(", "));
            //if (result.DesignationCiqual == null) {
            //    self.pDesignationCIQUAL.SetHtml("<span style='color:red'>Aucune correspondance</span>");
            //} else {
            //    self.pDesignationCIQUAL.SetHtml(result.DesignationCiqual.join("<br/>"));
            //}
            //let result: Models.CleanDesignationResult = JSON.parse(json);
            //self.pAlternatives.Set(result.Alternatives.toString());
            //self.pDesignationNettoyee.Set(result.Result);
            //self.pMotsCles.Set(result.Tags.join(", "));
            //self.pAllegations.Set(result.Allegations.join(", "));
            //self.pDesignationCIQUAL.Set(result.Ciqual);
            //self.pNutriscore.Set(result.Nutriscore);
            //self.pTLSucre.Set(result.TL_Sucres);
            //self.pTLSodium.Set(result.TL_Sodium);
            //self.pTLLipide.Set(result.TL_Lipides);
            //self.pTLAGSature.Set(result.TL_AGSatures);
            //self.pEF.Set("");
            //self.pGES.Set("");
            //if (result.EF != null) {
            //    self.pEF.Set(Framework.Maths.Round(result.EF,2).toString());
            //}
            //if (result.GES != null) {
            //    self.pGES.Set(Framework.Maths.Round(result.GES,2).toString());
            //}
            //Models.CleanDesignationResult.RenderResultAsDataTable(result.CiqualAll, <HTMLDivElement>self.divResultatAlgorithme.HtmlElement,"200px",1200)
        });
    };
    return CiqualClassifierApp;
}(Framework.App));
//# sourceMappingURL=app.js.map