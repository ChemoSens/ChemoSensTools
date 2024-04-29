class FcLexiconApp extends Framework.App {



    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/consotextplorer';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
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
        requirements.Required = [] //TODO;

        requirements.Extensions = ["Crypto"];
        //requirements.Extensions = ["Xlsx", "Tesseract"];
        return requirements;
    }

    constructor(isInTest: boolean = false) {
        super(FcLexiconApp.GetRequirements(), isInTest);        
    }

    protected onError(error: string) {
        super.onError(error);
    }



    private textareaDesignation: Framework.Form.InputText;

    //private spanMotsRetenus: Framework.Form.TextElement;
    //private spanDesignationNettoyee: Framework.Form.TextElement;
    //private spanMotsNonRetenus: Framework.Form.TextElement;
    private divTableau: Framework.Form.TextElement;
    private divModalitesAExclure: Framework.Form.TextElement;

    private btnRefresh: Framework.Form.Button;
    //private btnUploadFichierExcel: Framework.Form.Button;
    private btnUploadFichierExcelForAnalysis: Framework.Form.Button;
    private btnUploadFichierLexique: Framework.Form.Button;

    private selectCategoriesProduit: Framework.Form.Select;
    private selectLexique: Framework.Form.Select;

    private selectAlpha: Framework.Form.Select;
    private checkMRCA: Framework.Form.CheckBox;
    private checkCorrection: Framework.Form.CheckBox;
    private checkTestDescripteur: Framework.Form.CheckBox;

    private login: string;
    private password: string;
    //private lexicon: string = "lexicon";
    //private categorieProduit: string = "";
    //private correction: string = "oui";
    private analysisOptions: FcLexiconModels.AnalysisOption;

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);
        if (this.requirements.AppUrl == 'http://localhost:44301/consotextplorer') {
            this.login = "test";
            this.password = "test";
            this.showMain();
        } else {
            this.showModalLogin();
        }
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

    private setSelectCategoriesProduit(produits: string[]) {
        let self = this;
        this.selectCategoriesProduit = Framework.Form.Select.Register("selectCategoriesProduit", "", Framework.KeyValuePair.FromArray(produits), Framework.Form.Validator.NoValidation(), (x) => { self.analysisOptions.CategorieProduit = x; });
    }

    private setModalites(modalites: string[]) {
        let self = this;
        self.divModalitesAExclure.Set("");
        modalites.forEach(x => {
            if (x != "" && x.indexOf("localisation") == -1 && x.indexOf("quantifieur") == -1) {
                let cb: Framework.Form.CheckBox = Framework.Form.CheckBox.Create(() => { return true }, (ev, cb) => {
                    if (cb.IsChecked) {
                        self.analysisOptions.ExcludedModalities.push(cb.Value);
                    } else {
                        Framework.Array.Remove(self.analysisOptions.ExcludedModalities, cb.Value);
                    }

                }, x, x);
                cb.Value = x;
                self.divModalitesAExclure.Append(cb);
            }
        });

    }

    private showMain() {

        let self = this;

        self.analysisOptions = new FcLexiconModels.AnalysisOption();

        self.CallWCF('TesteLexique', { name: self.login }, () => {
            Framework.Progress.Show("");
        }, (res) => {
            Framework.Progress.Hide();

            let lexique = ["Défaut"];
            let ress = JSON.parse(res.Result);
            if (ress.Exist == true) {
                lexique.push("Perso");
            }



            // TODO : par défaut charger un des lexiques et donner les stats dessus

            self.show("html/Main.html", () => {

                self.textareaDesignation = Framework.Form.InputText.Register("textareaDesignation", "", undefined, (newValue: string) => {
                    //self.cleanDesignation(newValue);
                });


                //self.spanMotsRetenus = Framework.Form.TextElement.Register("spanMotsRetenus");
                //self.spanMotsNonRetenus = Framework.Form.TextElement.Register("spanMotsNonRetenus");

                self.checkMRCA = Framework.Form.CheckBox.Register("checkMRCA", () => { return true; }, (ev, cb) => {
                    self.analysisOptions.MRCA = cb.IsChecked;
                }, "");
                self.checkMRCA.Uncheck;

                self.checkTestDescripteur = Framework.Form.CheckBox.Register("checkTestDescripteur", () => { return true; }, (ev, cb) => {
                    self.analysisOptions.TableauDescripteur = cb.IsChecked;
                }, "");
                self.checkTestDescripteur.Uncheck();

                self.checkCorrection = Framework.Form.CheckBox.Register("checkCorrection", () => { return true; }, (ev, cb) => {
                    self.analysisOptions.Correction = cb.IsChecked;
                }, "");
                self.checkCorrection.Check();

                self.divTableau = Framework.Form.TextElement.Register("divTableau");
                self.divModalitesAExclure = Framework.Form.TextElement.Register("divModalitesAExclure");

                self.setModalites(ress.Modalities);
                self.setSelectCategoriesProduit(ress.Products);

                //self.selectCategoriesProduit = Framework.Form.Select.Register("selectCategoriesProduit", "", [], Framework.Form.Validator.NoValidation(), (x) => { self.categorieProduit = x; });
                self.selectLexique = Framework.Form.Select.Register("selectLexique", "Défaut", Framework.KeyValuePair.FromArray(lexique), Framework.Form.Validator.NoValidation(), (x) => {
                    if (x == "Perso") {
                        self.analysisOptions.Lexicon = self.login;
                    } else {
                        self.analysisOptions.Lexicon = "lexicon";
                    }
                });



                self.selectAlpha = Framework.Form.Select.Register("selectAlpha", 0.05, Framework.KeyValuePair.FromArray(["0.01", "0.05", "0.10"]), Framework.Form.Validator.NoValidation(), (x) => {
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

                self.btnUploadFichierExcelForAnalysis = Framework.Form.Button.Register("btnUploadFichierExcelForAnalysis", () => { return true; }, () => {

                    Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {
                        Framework.Progress.Show(Framework.LocalizationManager.Get("Computation..."));
                        //self.CallWCF('GetSensoryWordsInXlsForAnalysis', { login: self.login, password: self.password, data: binaries, lexicon: self.lexicon, productCategory: self.categorieProduit, correction: self.correction == "oui", analysisOptions: JSON.stringify(self.analysisOptions) }, () => {
                        self.CallWCF('GetSensoryWordsInXlsForAnalysis', { login: self.login, password: self.password, data: binaries, options: JSON.stringify(self.analysisOptions) }, () => {
                        }, (res) => {
                            Framework.Progress.Hide();
                            if (res.Status == 'success') {
                                Framework.FileHelper.SaveBase64As(res.Result, "result.xlsx");
                                //let result = JSON.parse(res.Result);
                                //let URL = result.URL;

                                //Framework.Browser.OpenNew(URL);

                            } else {
                                Framework.Modal.Alert("Erreur", res.ErrorMessage);
                            }
                        });
                    });
                });

                self.btnUploadFichierLexique = Framework.Form.Button.Register("btnUploadFichierLexique", () => { return true; }, () => {
                    Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {

                        self.CallWCF('UploadLexicon', { login: self.login, password: self.password, data: binaries }, () => {
                            Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                        }, (res) => {
                            Framework.Progress.Hide();
                            if (res.Status == 'success') {
                                self.analysisOptions.Lexicon = self.login;
                                Framework.Modal.Alert("", "Lexique téléversé et choisi comme lexique par défaut.");
                                //TODO : renvoi nombre concepts, catégories produit, modalités senso
                            } else {
                                Framework.Modal.Alert("Erreur", res.ErrorMessage);
                            }
                        });

                    })
                });

                self.btnRefresh = Framework.Form.Button.Register("btnRefresh", () => { return true; }, () => {
                    self.cleanDesignation(self.textareaDesignation.Value);
                });

            });

        });




    }

    private cleanDesignation(description: string) {
        let self = this;
        //self.CallWCF('GetSensoryWords', { txt: description, lexicon: self.lexicon, productCategory: self.categorieProduit, correction: self.correction == "oui" }, () => {
        self.CallWCF('GetSensoryWords', { txt: description, options: JSON.stringify(self.analysisOptions) }, () => {
            Framework.Progress.Show(Framework.LocalizationManager.Get("Analyse..."));
            self.divTableau.Set("");
        }, (res) => {

            let json = res.Result;


                let result:FcLexiconModels.Result = JSON.parse(json);
            let MotsRetenus = "";

            Framework.Progress.Hide();

            self.setSelectCategoriesProduit(result.CategoriesProduit);
            //self.selectCategoriesProduit = Framework.Form.Select.Register("selectCategoriesProduit", "", Framework.KeyValuePair.FromArray(result.CategoriesProduit), Framework.Form.Validator.NoValidation(), (x) => { self.categorieProduit = x; });

            result.Concepts.forEach(m => {
                MotsRetenus += m.Word + " ";
            });

                let txt: string = "<p>" + result.TexteNettoye + "</p>";

                txt+= "<p>contexte/descripteur/quantifieur (non agrégé) ==> contexte/modalité/concept/quantifieur/descripteur (agrégé)</p>";

                result.Concepts.forEach(m => {
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


    }

    //private uploadFichierExcel(file: any) {

    //    let self = this;

    //    self.CallWCF('GetSensoryWordsInXlsIn', { fileContent: file, lexicon: self.lexicon, productCategory: self.categorieProduit, correction: self.correction == "oui" }, () => {
    //    }, (res) => {
    //        let r = res;
    //        if (res.Status == "success") {
    //            Framework.FileHelper.SaveBase64As(res.Result, "test.xlsx");
    //        } else {
    //            alert("error");
    //        }
    //    });

    //}
}

