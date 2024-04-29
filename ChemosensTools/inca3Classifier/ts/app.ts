class Inca3ClassifierApp extends Framework.App {

    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/inca3Classifier';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
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
        requirements.Required = [] //TODO;

        requirements.Extensions = ["Crypto"];
        //requirements.Extensions = ["Xlsx", "Tesseract"];
        return requirements;
    }

    constructor(isInTest: boolean = false) {
        super(Inca3ClassifierApp.GetRequirements(), isInTest);
        //this.start();
    }

    protected onError(error: string) {
        super.onError(error);
    }

    private modeRecherche: string = "exact";

    private textareaDesignation: Framework.Form.InputText;

    private divResultat: Framework.Form.TextElement;

    private spanMotsCles: Framework.Form.TextElement;

    private inputModeRechercheTous: Framework.Form.RadioElement;
    private inputModeRechercheConsomme: Framework.Form.RadioElement;
    private inputModeRechercheCommercialise: Framework.Form.RadioElement;

    private btnRefresh: Framework.Form.Button;
    private btnCIQUAL: Framework.Form.Button;
    private btnNettoieDesignationFichierExcel: Framework.Form.Button;
    private btnUploadFichierExcel: Framework.Form.Button;

    private login: string = "common";
    private password: string;

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);
        this.showModalLogin();
        //this.showMain();
        let self = this;
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

            let divEtapes23 = Framework.Form.TextElement.Register("divEtapes23");

            let divResultats1 = Framework.Form.TextElement.Register("divResultats1");
            let divResultats2 = Framework.Form.TextElement.Register("divResultats2");

            // Telechargement des données
            let btnTeleverseTableReference = Framework.Form.Button.Register("btnTeleverseTableReference", () => { return true; }, () => {
                Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Téléversement en cours..."));
                    self.CallWCF('UploadReferentiel', { data: binaries, login: self.login }, () => {
                    }, (res) => {
                        Framework.Progress.Hide();

                            if (res.Status == "success") {
                                let obj = JSON.parse(res.Result);
                            spanTableReference.SetHtml(self.login + ".xlsx chargée le " + new Date(Date.now()).toLocaleString() + ", " + obj.CountBefore + " lignes (" + obj.CountAfter + " sans doublon)");
                            divEtapes23.Show();
                        } else {
                            Framework.Modal.Alert("Erreur", res.ErrorMessage);
                        }
                    });
                });
            });
            // modal d'information
            let btnInfoTeleversement = Framework.Form.Button.Register("btnInfoTeleversement", () => { return true; }, () => {
                Framework.Popup.Show(btnInfoTeleversement.HtmlElement, div, "right");
            });


            let btnInfoUpload = Framework.Form.Button.Register("btnInfoUpload", () => { return true; }, () => {
                Framework.Popup.Show(btnInfoUpload.HtmlElement, div2, "right");
            });
            // lancement du script de catégorisation
            let btnGo = Framework.Form.Button.Register("btnGo", () => { return true; }, () => {
                getDesignation();
            });

            let div2 = document.createElement("div");
            div2.innerHTML = "<p>Format attendu</p>";
            div2.innerHTML += "<p>- Fichier xlsx</p>";
            div2.innerHTML += "<p>- 1 onglet</p>";
            div2.innerHTML += "<p>- Colonne 1 : items</p>";
            Framework.Popup.Create(btnInfoUpload.HtmlElement, div2, "right", "hover");

            let pills1 = document.getElementById("pills-1-tab");
            pills1.onclick = () => { divResultats1.Hide(); divResultats2.Hide(); }
            let pills2 = document.getElementById("pills-profile1-tab");
            pills2.onclick = () => { divResultats1.Hide(); divResultats2.Hide(); }

            let div = document.createElement("div");
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

            let btnSupprimeTableReference = Framework.Form.Button.Register("btnSupprimeTableReference", () => { return true; }, () => {
                Framework.Progress.Show(Framework.LocalizationManager.Get("Suppression en cours..."));
                self.CallWCF('SupprimeReferentiel', { login: self.login }, () => {
                }, (res) => {
                    Framework.Progress.Hide();

                    if (res.Status == "success") {
                        spanTableReference.SetHtml("aucune");
                        divEtapes23.Hide();
                    } else {
                        Framework.Modal.Alert("Erreur", res.ErrorMessage);
                    }
                });
            });

            let spanTableReference = Framework.Form.TextElement.Register("spanTableReference");

            let textareaPourcentage = Framework.Form.InputText.Register("textareaPourcentage", "45", undefined, (newValue: string) => {
                //getDesignation();
            }, false);

            let textareaTroncature = Framework.Form.InputText.Register("textareaTroncature", "200", undefined, (newValue: string) => {
                //getDesignation();
            }, false);

            let textareaDifferenceCorrespondance = Framework.Form.InputText.Register("textareaDifferenceCorrespondance", "50", undefined, (newValue: string) => {
                //getDesignation();
            }, false);

            self.textareaDesignation = Framework.Form.InputText.Register("textareaDesignation", "", undefined, (newValue: string) => {
                //getDesignation();
            });

            let inputMatchExact = Framework.Form.CheckBox.Register("inputMatchExact", () => { return true; }, () => {
                //getDesignation();
            }, "");

            let inputSupprimeDoublons = Framework.Form.CheckBox.Register("inputSupprimeDoublons", () => { return true; }, () => {
                //getDesignation();
            }, "");

            inputSupprimeDoublons.Check();


            let inputTauxCorrespondancePondere = Framework.Form.CheckBox.Register("inputTauxCorrespondancePondere", () => { return true; }, () => {
                //getDesignation();
            }, "");


            let stat = "mode";
            let group: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();
            let checkStatMode = Framework.Form.RadioElement.Register("checkStatMode", group, () => {
                stat = "mode";
                //getDesignation();
            });
            let checkStatFreq = Framework.Form.RadioElement.Register("checkStatFreq", group, () => {
                stat = "freq";
                //getDesignation();
            });
            let checkStatMoy = Framework.Form.RadioElement.Register("checkStatMoy", group, () => {
                stat = "moy";
                //getDesignation();
            });


            let textareaDesignationNettoyee = Framework.Form.TextElement.Register("textareaDesignationNettoyee");
            //let divCIQUAL = Framework.Form.TextElement.Register("divCIQUAL");
            //let divKeywordsCIQUAL = Framework.Form.TextElement.Register("divKeywordsCIQUAL");

            self.divResultat = Framework.Form.TextElement.Register("divResultat");
            let divCategorie = Framework.Form.TextElement.Register("divCategorie");
            let divCorrespondance = Framework.Form.TextElement.Register("divCorrespondance");

            let getDesignation = () => {

                if (self.textareaDesignation.Value.length > 2) {
                    //Framework.Progress.Show("Recherche en cours...");
                    divResultats1.Hide();
                    textareaDesignationNettoyee.Set("");
                    console.time("execution");
                    self.CallWCF('ClassifieurFamilleFoodEx', { designation: self.textareaDesignation.Value, login: self.login, pourcentage: Number(textareaPourcentage.Value), matchExact: inputMatchExact.IsChecked, supprimeDoublons: inputSupprimeDoublons.IsChecked, troncature: Number(textareaTroncature.Value), differenceCorrespondance: Number(textareaDifferenceCorrespondance.Value), tauxCorrespondancePondere: inputTauxCorrespondancePondere.IsChecked }, () => {

                    }, (res) => {

                        let json = res.Result;
                        let result = JSON.parse(json);

                        divResultats2.Hide();
                        divResultats1.Show();
                        textareaDesignationNettoyee.Set(result.DesignationNettoyee);
                        divCorrespondance.SetHtml("Recherche en cours...");
                        divCategorie.SetHtml("Recherche en cours...");
                        self.divResultat.SetHtml("Recherche en cours...");

                        let table: Framework.Form.Table<object> = new Framework.Form.Table<object>();
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
                        } else {
                            divCategorie.Set("Aucune catégorie trouvée");
                        }

                        let table2: Framework.Form.Table<object> = new Framework.Form.Table<object>();
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
            }

            //self.btnRefresh = Framework.Form.Button.Register("btnRefresh", () => { return true; }, () => {
            //    getDesignation();

            //});
            let btnUpload = Framework.Form.Button.Register("btnUpload", () => { return true; }, () => {
                Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {
                    divResultats2.Hide();
                    divResultats1.Hide();
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Calcul en cours..."));
                    console.time("execution_fichier");
                    self.CallWCF('ClassifieurFamilleFoodExExcel', { data: binaries, login: self.login, pourcentage: Number(textareaPourcentage.Value), matchExact: inputMatchExact.IsChecked, supprimeDoublons: inputSupprimeDoublons.IsChecked, troncature: Number(textareaTroncature.Value), stat: stat, differenceCorrespondance: Number(textareaDifferenceCorrespondance.Value), tauxCorrespondancePondere: inputTauxCorrespondancePondere.IsChecked }, () => {
                    }, (res) => {
                        Framework.Progress.Hide();

                        if (res.Status == "success") {
                            divResultats2.Show();
                            Framework.FileHelper.SaveBase64As(res.Result, "Resultat" + new Date(Date.now()).toLocaleString() + ".xlsx");
                            console.timeEnd("execution_fichier");
                        } else {
                            alert("error : " + res.ErrorMessage);
                        }
                    });
                });
            });




        });


    }


}


