class CodApproApp extends Framework.App {

    private config: CodApproModels.Config;
    private questionnaire: CodApproModels.Questionnaire;
    /*//private lieuTicket: string = "";*/
    private unite: string = "grammes";   
    //private dateTicket: string = new Date(Date.now()).toLocaleDateString('en-CA');
    private aliment: CodApproModels.Aliment;
    private ticket: CodApproModels.Ticket;
    private menu: string = "";
    private sn: string = "";    
    private login: string = "";
    private listTextes: Framework.KeyValuePair[] = [];

    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/codappro2';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
            requirements.AppUrl = 'https://www.chemosenstools.com/codappro2';
            requirements.FrameworkUrl = 'https://www.chemosenstools.com/framework';
            requirements.WcfServiceUrl = 'https://www.chemosenstools.com/WebService.svc/';
        }
        requirements.AuthorizedLanguages = ['en', 'fr'];
        requirements.DefaultLanguage = 'en';
        requirements.DisableGoBack = true;
        requirements.DisableRefresh = true;
        requirements.Recommanded = [];
        requirements.Required = [];
        requirements.JsFiles = ['/ts/models.js'];

        requirements.Extensions = ["Crypto", "Rating"];
        return requirements;
    }

    constructor(isInTest: boolean = false) {
        super(CodApproApp.GetRequirements(), isInTest);
    }

    protected onError(error: string) {
        super.onError(error);
    }

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);

        let self = this;
        this.sn = Framework.Browser.GetUrlParameter("sn"); // Code de l'étude
        let admin = Framework.Browser.GetUrlParameter("admin"); // Id admin
        this.login = Framework.Browser.GetUrlParameter("login"); // login

        self.CallWCF('TranslateCodAppro', { sn: self.sn }, () => {
            Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
        }, (res) => {
            Framework.Progress.Hide();
            if (res.Status == 'success') {
                self.listTextes = JSON.parse(res.Result);
            }
            if (self.sn == "") {
                self.showDivLogin();
            }

            if (admin != "") {
                self.showDivLoginAdmin(admin);
            } else {
                self.showDivLogin();
            }
        });

        

    }

    private saveQuestionnaire(f: Function) {
        let self = this;
        self.aliment.Date = self.ticket.Date;
        self.aliment.Lieu = self.ticket.Lieu;        
        self.aliment.Menu = self.menu;
        if (self.aliment.DateSaisie == undefined) {
            self.aliment.DateSaisie = new Date(Date.now()).toISOString().split('T')[0];
        }
        self.aliment.DateModif = new Date(Date.now()).toISOString().split('T')[0];
        self.questionnaire.Aliments.push(self.aliment);
        self.aliment = new CodApproModels.Aliment();
        self.aliment.Date = self.ticket.Date;
        self.aliment.Lieu = self.ticket.Lieu;
        self.aliment.Menu = self.menu;
        self.aliment.Unite = "grammes";
        self.aliment.TicketCode = self.ticket.Code;


        self.CallWCF('SaveQuestionnaireCodAppro', { code: self.questionnaire.Code, sn: self.sn, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, () => {
            Framework.Progress.Show(self.getTranslation("txtEnregistrement"));
        }, (res) => {
            Framework.Progress.Hide();
            if (res.Status == 'success') {
                f();                
            } else {
                Framework.Modal.Alert(self.getTranslation("txtErreur"), self.getTranslation("txtErreurEnregistrement"), () => {
                    f();                    
                })
            }

        });

    }

    private updateQuestionnaire(f: Function) {
        let self = this;

        self.CallWCF('SaveQuestionnaireCodAppro', { code: self.questionnaire.Code, sn: self.sn, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, () => {
            Framework.Progress.Show(self.getTranslation("txtEnregistrement"));
        }, (res) => {

            Framework.Progress.Hide();
            if (res.Status == 'success') {
                f();
            } else {
                Framework.Modal.Alert(self.getTranslation("txtErreur"), self.getTranslation("txtErreurEnregistrement"), () => {
                    f();
                })
            }

        });

    }

    private showDivLoginAdmin(admin: string) {
        let self = this;

        this.show("html/DivLoginAdmin.html", () => {

            // Enter
            document.onkeypress = (e) => {
                if (e.which == 10 || e.which == 13) {
                    btnTelecharger.Click();
                }
            }

            let inputPassword = Framework.Form.InputText.Register("inputPassword", "", Framework.Form.Validator.MinLength(4), () => {
                btnTelecharger.CheckState();
                btnImporter.CheckState();
            }, true);

            let btnTelecharger = Framework.Form.Button.Register("btnTelecharger", () => {
                return inputPassword.IsValid;
            }, () => {

                let obj = {
                    login: admin,
                    password: inputPassword.Value,
                    dir: self.sn
                }

                self.CallWCF('DownloadQuestionnaireCodAppro', obj, () => {
                    Framework.Progress.Show(self.getTranslation("txtConnexion"));
                }, (res) => {

                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        Framework.FileHelper.SaveBase64As(res.Result, "resultats_codappro.xlsx");
                    } else {
                        Framework.Modal.Alert(self.getTranslation("txtErreur"), res.ErrorMessage);
                    }

                });

                self.translate("h2Administration");
                self.translate("h3MotPasse");
                self.translate("btnTelecharger", btnTelecharger);
                self.translate("btnImporter", btnImporter);
            });

            let btnImporter = Framework.Form.Button.Register("btnImporter", () => { return inputPassword.IsValid; }, () => {
                Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {
                    self.CallWCF('ImportQuestionnaireCodAppro', { data: binaries, sn: self.sn, login: admin, password: inputPassword.Value }, () => {
                        Framework.Progress.Show(self.getTranslation("txtChargement"));
                    }, (res) => {
                        Framework.Progress.Hide();

                        if (res.Status == "success") {     
                            Framework.Modal.Alert(self.getTranslation("txtMessage"), self.getTranslation("txtTeleversementReussi"));
                        } else {
                            Framework.Modal.Alert(self.getTranslation("txtMessage"), self.getTranslation("txtErreurTeleversement"));
                        }
                    });
                });
            })



        });

    }

    private getTranslation(key: string) {
        let self = this;
        let vals: Framework.KeyValuePair[] = self.listTextes.filter(x => x.Key == key);
        if (vals.length > 0) {
            return(vals[0].Value);
        }
        return undefined;
    }

    private translate(key: string, elt: Framework.Form.BaseElement=undefined) {
        let transl = this.getTranslation(key);        
        if (transl==undefined) {
            return;
        }
        if (elt == undefined) {
            document.getElementById(key).innerText = transl;
            //Framework.Form.TextElement.Register(key, transl);
        }
        if (elt instanceof Framework.Form.TextElement) {
            (<Framework.Form.TextElement>elt).Set(transl);
        }
        if (elt instanceof Framework.Form.Button) {
            (<Framework.Form.Button>elt).SetInnerHTML(transl);
        }
        if (elt instanceof Framework.Form.InputText) {
            (<Framework.Form.InputText>elt).SetPlaceHolder(transl);
        }        
    }

    private showDivLogin() {
        let self = this;

        this.show("html/DivLogin.html", () => {
            
            // Enter
            document.onkeypress = (e) => {
                if (e.which == 10 || e.which == 13) {
                    btnLogin.Click();
                }
            }

            let login = "";

            if (self.login != null || self.login != undefined) {
                login = self.login
            }
            if (login == "") {
                login = Framework.LocalStorage.GetFromLocalStorage("codappro_id", true);
                if (login == null || login == undefined) {
                    login = "";
                }
            }
            
            let inputLoginId = Framework.Form.InputText.Register("inputLoginId", login, Framework.Form.Validator.MinLength(5), () => {
                btnLogin.CheckState();
            }, true);
            
            let divLoginError = Framework.Form.TextElement.Register("divLoginError");

            let btnLogin = Framework.Form.Button.Register("btnLogin", () => {
                return inputLoginId.IsValid;
            }, () => {

                let obj = {
                    code: inputLoginId.Value,
                    sn: self.sn
                }

                self.CallWCF('LoginCodAppro', obj, () => {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                }, (res) => {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        try {
                            Framework.LocalStorage.SaveToLocalStorage("codappro_id", inputLoginId.Value, true);
                        } catch {

                        }

                        self.config = JSON.parse(res.Result);
                        self.questionnaire = self.config.Questionnaire;
                        self.showDivDate();

                    } else {
                        divLoginError.SetHtml(res.ErrorMessage);
                        divLoginError.Show();
                    }
                });


            });

            if (self.login != "") {
                btnLogin.Click();
            }

            self.translate("h3Code");
            self.translate("inputLoginId", inputLoginId);
            self.translate("btnLogin", btnLogin);

        });

    }

    private showDivDate(aliment: CodApproModels.Aliment = undefined) {

        let self = this;
        
        if (aliment == undefined) {      

            self.ticket = new CodApproModels.Ticket();
            self.ticket.Code = self.questionnaire.Code + "_" + (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
            self.questionnaire.Tickets.push(self.ticket);
        }

        if (aliment == undefined) {      

            self.aliment = new CodApproModels.Aliment();
            self.aliment.TicketCode = self.ticket.Code;
            self.aliment.Unite = "grammes";
            self.aliment.Date = self.ticket.Date;
            self.aliment.LibelleCIQUAL = "";
            self.aliment.Menu = "";
        } else {
            self.aliment = aliment;
            self.ticket = self.questionnaire.Tickets.filter(x => x.Code == aliment.TicketCode)[0];
        }

        this.show("html/DivDate.html", () => {
                     
            let btnPhoto = Framework.Form.Button.Register("btnPhoto", () => { return true; }, () => {

                let divPhoto = Framework.Form.TextElement.Create("");
                let video = document.createElement("video");
                divPhoto.HtmlElement.appendChild(video);
                video.style.width = "100%";
                let btn = document.createElement("button");
                btn.textContent = "Photo";
                btn.style.width = "100%";
                divPhoto.HtmlElement.appendChild(btn);

                let mw = Framework.Modal.Alert("Photo du ticket", divPhoto.HtmlElement, () => {
                    
                    let fn = self.ticket.Code;
                    self.CallWCF('TeleverseImageCodAppro2', { base64string: base64, sn:self.sn, filename: fn }, () => { }, (res) => {                                                
                        if (res.ErrorMessage != "") {
                            self.ticket.Image = fn;
                            Framework.Modal.Alert(self.getTranslation("txtSucces"), self.getTranslation("txtPhotoTeleversee"), () => { mw.Close() });
                        } else {
                            Framework.Modal.Alert(self.getTranslation("txtEchec"), self.getTranslation("txtErreurTeleversement"), () => { mw.Close() });
                        }

                    });
                });

                mw.show();

                let base64 = undefined;
                let recorder = new Framework.PhotoRecorder(btn, video);
                recorder.OnSave = (b64) => {
                    base64 = b64;
                };

            });
            

            let btnUpload = Framework.Form.Button.Register("btnUpload", () => { return true; }, () => {

                Framework.FileHelper.BrowseBinaries("", (binaries, filename) => {
                    

                    let fn = self.ticket.Code;
                    self.CallWCF('TeleverseImageCodAppro2', { base64string: binaries, sn: self.sn, filename: fn }, () => { }, (res) => {                        
                        if (res.ErrorMessage != "") {
                            self.ticket.Image = fn;
                            Framework.Modal.Alert(self.getTranslation("txtSucces"), self.getTranslation("txtPhotoTeleversee"));
                        } else {
                            Framework.Modal.Alert(self.getTranslation("txtEchec"), self.getTranslation("txtErreurTeleversement"));
                        }
                    });
                });

            });
            

            let divTicketMenu = Framework.Form.TextElement.Register("divTicketMenu");
            divTicketMenu.Hide();
            let divTicketPrix = Framework.Form.TextElement.Register("divTicketPrix");
            divTicketPrix.Hide();

            let divChequeAlimentaire = Framework.Form.TextElement.Register("divChequeAlimentaire");
            divChequeAlimentaire.Hide();

            let inputChequeAlimentaire = Framework.Form.InputText.Register("inputChequeAlimentaire", "", Framework.Form.Validator.NumberPos("Nombre attendu.", 0), (prix: string) => {
                self.aliment.MontantChequeAlimentaire = Number(prix.replace(",", "."));
                btnContinuer.CheckState();
            });
            
            //if (this.ti == "1") {
            if (self.config.ListOptions.indexOf("SaisieChequeAlimentaire")>-1) {            
                divChequeAlimentaire.Show();
            }


            // Tab
            document.getElementById("lastSpan").onfocus = () => {
                document.getElementById("prevent-outside-tab").focus();
            };

            // Enter
            document.onkeypress = (e) => {
                if (e.which == 10 || e.which == 13) {
                    btnContinuer.Click();
                }
            }

            let btnLieuChecked = <HTMLButtonElement>document.getElementById("btnLieuChecked");
            btnLieuChecked.innerHTML = "!";
            btnLieuChecked.style.background = "red";

            let selectLieu = <HTMLDataListElement>document.getElementById("selectLieu");

            let inputDate = Framework.Form.InputText.Register("inputDate", self.ticket.Date, Framework.Form.Validator.NoValidation(), (date: string) => {
                self.ticket.Date = date;
                btnContinuer.CheckState();
            });
        
            
            self.config.ListLieuxAchats.forEach(x => {

                let o: HTMLOptionElement = document.createElement("option");
                o.value = x.Key;
                selectLieu.appendChild(o);
            });

            let inputLieu = Framework.Form.InputText.Register("inputLieu", self.ticket.Lieu, Framework.Form.Validator.NotEmpty(), (lieu: string) => {

                self.ticket.Lieu = "";
                btnLieuChecked.innerHTML = "!";
                btnLieuChecked.style.background = "red";
                btnContinuer.CheckState();

                for (var i = 0; i < self.config.ListLieuxAchats.length; i++) {
                    if (self.config.ListLieuxAchats[i].Key === lieu) {
                        self.ticket.Lieu = lieu;
                        btnLieuChecked.innerHTML = "<i class='fas fa-check-square'></i>";
                        btnLieuChecked.style.background = "green";

                        let typeCommerce = self.config.ListLieuxAchats.filter(x => x.Key == lieu)[0].Value;


                        if (["supermarché", "discount"].indexOf(typeCommerce) < 0) {
                            divTicketMenu.Show();
                        } else {
                            self.menu = "";
                            divTicketMenu.Hide();
                        }

                        btnContinuer.CheckState();
                        break;
                    }
                }

            });


            let inputTicketMenuO = Framework.Form.CheckBox.Register("inputTicketMenuO", () => { return true }, () => { self.menu = "Oui"; divTicketPrix.Show(); btnContinuer.CheckState(); }, "");
            let inputTicketMenuN = Framework.Form.CheckBox.Register("inputTicketMenuN", () => { return true }, () => { self.menu = ""; inputPrix.Set(""); divTicketPrix.Hide(); btnContinuer.CheckState(); }, "");

            let inputPrix = Framework.Form.InputText.Register("inputPrix", "", Framework.Form.Validator.NumberPos("Nombre attendu.", 0), (prix: string) => {
                self.aliment.PrixMenu = Number(prix.replace(",", "."));
                self.aliment.Prix = -1;
                btnContinuer.CheckState();
            });

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return self.ticket.Lieu && self.ticket.Lieu.length > 3 && (divTicketMenu.IsVisible == false || (divTicketMenu.IsVisible == true && (inputTicketMenuN.IsChecked == true || (inputTicketMenuO.IsChecked == true && inputPrix.IsValid))));
            }, () => {
                self.aliment.Date = self.ticket.Date;
                self.aliment.Lieu = self.ticket.Lieu;
                self.aliment.Menu = self.menu;
                self.showDivDesignation(aliment != undefined);
            })
            

            let btnVoirFactures = Framework.Form.Button.Register("btnVoirFactures", () => {
                return true;
            }, () => {
                self.showDivFactures();
            })            

            btnVoirFactures.Show();

            self.translate("h5Date");
            self.translate("h5Lieu");
            self.translate("h5Ticket");
            self.translate("h5TicketPrix");
            self.translate("h5MontantChequeAlimentaire");   
            self.translate("btnPhoto", btnPhoto);
            self.translate("btnUpload", btnUpload);
            self.translate("btnContinuer", btnContinuer);
            self.translate("btnVoirFactures", btnVoirFactures);
            self.translate("inputLieu", inputLieu);
            self.translate("inputPrix", inputPrix);
            self.translate("inputChequeAlimentaire", inputChequeAlimentaire);
            self.translate("labelO");
            self.translate("labelN");
        });
    }

    private showDivDetail(ticketCode:string) {
        let self = this;
        this.show("html/DivDetail.html", () => {

            let divTableFactures = Framework.Form.TextElement.Register("divTableFactures");
            let btnFin = Framework.Form.Button.Register("btnFin", () => { return true; }, () => { self.showDivFactures(); })

            let aliments = self.questionnaire.Aliments.filter(z => z.TicketCode == ticketCode)

            let btnSupprimerTicket = Framework.Form.Button.Register("btnSupprimerTicket", () => { return true; }, () => {

                Framework.Modal.Confirm(self.getTranslation("txtConfirmation"), self.getTranslation("txtSuppressionTicket"), () => {
                    Framework.Array.Remove(self.questionnaire.Tickets, self.questionnaire.Tickets.filter(x=>x.Code== ticketCode)[0]);
                    aliments.forEach(x => {
                        Framework.Array.Remove(self.questionnaire.Aliments, x)
                    });
                    self.updateQuestionnaire(() => { self.showDivFactures(); });
                })
            })

            let table: Framework.Form.Table<CodApproModels.Aliment> = new Framework.Form.Table<CodApproModels.Aliment>();
            table.CanSelect = false;
            table.ShowFooter = false;
            table.ListData = aliments;
            table.Height = "80vh";
            table.FullWidth = true;
            table.CanSelect = true;
            table.ShowFooter = true;
            table.RemoveFunction = () => {
                Framework.Modal.Confirm(self.getTranslation("txtConfirmationSuppression"), "", () => {

                    table.SelectedData.forEach(x => {
                        Framework.Array.Remove(self.questionnaire.Aliments, x)
                    });

                    table.Remove(table.SelectedData);

                    self.updateQuestionnaire(() => { });
                });
            };

            table.ListColumns = [];

            table.AddCol("Date", self.getTranslation("txtDate"), 100, "left");
            table.AddCol("Lieu", self.getTranslation("txtLieu"), 100, "left");
            table.AddCol("LibelleCIQUAL", self.getTranslation("txtLibelle"), 300, "left");
            table.AddCol("LibelleCustom", self.getTranslation("txtTexte"), 100, "left");
            if (self.questionnaire.Code.charAt(0) == "b") {
                table.AddCol("Categorie1", self.getTranslation("txtCategorie1"), 100, "left");
                table.AddCol("Categorie2", self.getTranslation("txtCategorie2"), 100, "left");
            }
            table.AddCol("Unite", self.getTranslation("txtUnite"), 75, "left");
            table.AddCol("Nb", self.getTranslation("txtQuantite"), 75, "left");
            table.AddCol("Prix", self.getTranslation("txtPrixUnitaire"), 75, "left");
            table.AddCol("PrixMenu", self.getTranslation("txtPrixMenu"), 75, "left");
            table.AddCol("MontantChequeAlimentaire", self.getTranslation("txtChequeAlimentaire"), 75, "left");
            table.AddCol("Labels", self.getTranslation("txtLabels"), 75, "left");

            table.AddCol("", "", 50, "left", undefined, undefined, (x, y) => {
                return Framework.Form.Button.Create(() => { return true }, () => {
                    self.showDivDate(y);
                }, "Edit", ["btn", "btn-sm", "btn-primary"]).HtmlElement;
            })
            table.Render(divTableFactures.HtmlElement);

            self.translate("h4EditionFacture");
            self.translate("btnSupprimerTicket", btnSupprimerTicket);
            self.translate("btnFin", btnFin);
        }

        

        );
    }

    private showDivFactures() {

        let self = this;

        this.show("html/DivFactures.html", () => {

            let divTableFactures = Framework.Form.TextElement.Register("divTableFactures");

            let table1: Framework.Form.Table<CodApproModels.Ticket> = new Framework.Form.Table<CodApproModels.Ticket>();

            self.CallWCF('DownloadDataCodAppro', { sn: self.sn, code: self.questionnaire.Code }, () => {
                Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
            }, (res) => {
                Framework.Progress.Hide();
                if (res.Status == 'success') {

                    self.questionnaire = JSON.parse(res.Result);

                    let tickets: CodApproModels.Ticket[] = self.questionnaire.Tickets;
                    
                    //self.questionnaire.Aliments.forEach((x) => {
                    //    let t = tickets.filter(y => y.Code == x.Code);
                    //    if (t.length == 0) {
                    //        let tt: CodApproModels.Ticket = new CodApproModels.Ticket();
                    //        tt.Date = x.Date;
                    //        tt.Lieu = x.Lieu;                            
                    //        tickets.push(new CodApproModels.Ticket());
                    //    }
                    //});

                    table1 = new Framework.Form.Table<CodApproModels.Ticket>();
                    table1.CanSelect = true;
                    table1.OnSelectionChanged = (sel => {
                        btnCopieTicket.CheckState();
                    });
                    table1.ShowFooter = false;
                    table1.ListData = tickets;
                    table1.Height = "80vh";
                    table1.FullWidth = true;
                    table1.CanSelect = true;
                    table1.ShowFooter = true;
                    table1.ListColumns = [];
                    table1.AddCol("Date", self.getTranslation("txtDate"), 100, "left");
                    table1.AddCol("Lieu", self.getTranslation("txtLieu"), 200, "left");
                    table1.AddCol("Image", self.getTranslation("txtPhoto"), 200, "left");
                    table1.AddCol("", "", 50, "left", undefined, undefined, (x, y) => {
                        return Framework.Form.Button.Create(() => { return true }, () => {
                            
                            //self.showDivDetail(self.questionnaire.Aliments.filter(z => z.TicketCode == y.Code));
                            self.showDivDetail(y.Code);
                        }, "Edit", ["btn", "btn-sm", "btn-primary"]).HtmlElement;
                    })
                    table1.Render(divTableFactures.HtmlElement);

                } else {
                    Framework.Modal.Alert(self.getTranslation("txtErreur"), res.ErrorMessage);
                }
                
            });

            let btnNouveauTicket2 = Framework.Form.Button.Register("btnNouveauTicket2", () => { return true; }, () => { self.showDivDate(); })
            let btnCopieTicket = Framework.Form.Button.Register("btnCopieTicket", () => { return table1.SelectedData.length==1; }, () => {
                //ICI TODO
                self.ticket = new CodApproModels.Ticket();
                self.ticket.Code = self.questionnaire.Code + "_" + (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
                self.questionnaire.Tickets.push(self.ticket);
                self.ticket.Lieu = table1.SelectedData[0].Lieu;
                self.ticket.Image = "copie de " + self.ticket.Code;
                
                let aliments = self.questionnaire.Aliments.filter(x => { return (x.TicketCode == table1.SelectedData[0].Code); });
                aliments.forEach(y => {
                    let al: CodApproModels.Aliment = new CodApproModels.Aliment();
                    al.Appreciation = y.Appreciation;
                    al.Categorie1 = y.Categorie1;
                    al.Categorie2 = y.Categorie2;
                    al.CodeCIQUAL = y.CodeCIQUAL;
                    al.Date = self.ticket.Date;
                    al.DateModif = self.ticket.Date;
                    al.DateSaisie = self.ticket.Date;
                    al.Labels = y.Labels;
                    al.LibelleCIQUAL = y.LibelleCIQUAL;
                    al.LibelleCustom = y.LibelleCustom;
                    al.Lieu = y.Lieu;
                    al.Menu = y.Menu;
                    al.MontantChequeAlimentaire = y.MontantChequeAlimentaire;
                    al.Nb = y.Nb;
                    al.PoidsUnitaire = y.PoidsUnitaire;
                    al.Prix = y.Prix;
                    al.PrixMax = y.PrixMax;
                    al.PrixMaxEpicerie = y.PrixMaxEpicerie;
                    al.PrixMenu = y.PrixMenu;
                    al.PrixMin = y.PrixMin;
                    al.PrixMinEpicerie = y.PrixMinEpicerie;
                    al.Unite = y.Unite;
                    al.TicketCode = self.ticket.Code;
                    self.questionnaire.Aliments.push(al);
                }
                
                );
                self.saveQuestionnaire(() => {
                    self.showDivFactures();
                });
                
                //self.showDivDate();
            })

            self.translate("h4Saisies");
            self.translate("btnNouveauTicket2", btnNouveauTicket2);
            self.translate("btnCopieTicket", btnCopieTicket);

        });

    }

    private testPrixKg() {
        let self = this;

        let divWarningPrix = Framework.Form.TextElement.Register("divWarningPrix");

        divWarningPrix.Hide();

        if (self.menu != "") {
            return;
        }

        let diviseur = 0;
        if (self.aliment.Unite == "kilos" || self.aliment.Unite == "litres") {
            diviseur = self.aliment.Nb;
        }
        if (self.aliment.Unite == "grammes") {
            diviseur = self.aliment.Nb / 1000;
        }
        if (self.aliment.Unite == "centilitres") {
            diviseur = self.aliment.Nb / 100;
        }

        if (self.aliment.Unite == "unités") {
            diviseur = self.aliment.Nb * self.aliment.PoidsUnitaire / 1000;
        }
        if (diviseur > 0) {
            let prixmax = undefined;
            let prixmin = undefined;
            if (self.aliment.Lieu == "Epicerie sociale") {
                prixmax = self.aliment.PrixMaxEpicerie;
                prixmin = self.aliment.PrixMinEpicerie;
            } else {
                prixmax = self.aliment.PrixMax;
                prixmin = self.aliment.PrixMin;
            }
            let prixKg = self.aliment.Prix / diviseur;
            if (prixKg > prixmax) {
                divWarningPrix.SetHtml('<p style="color:red">' + self.getTranslation("txtPrixKilo1") + '(' + Math.round(prixKg * 100) / 100 + ') ' + self.getTranslation("txtPrixKilo2") + '</p>')
                divWarningPrix.Show();
            }

            if (prixKg < prixmin) {
                divWarningPrix.SetHtml('<p style="color:red">' + self.getTranslation("txtPrixKilo1") + '(' + Math.round(prixKg * 100) / 100 + ') ' + self.getTranslation("txtPrixKilo3") + '</p>')
                divWarningPrix.Show();
            }
        }
    }

    private showDivDesignation(update = false) {

        let self = this;

        this.show("html/DivDesignation.html", () => {

            // Tab
            document.getElementById("lastSpan").onfocus = () => {
                document.getElementById("prevent-outside-tab").focus();
            };

            // Enter
            document.onkeypress = (e) => {
                if (e.which == 10 || e.which == 13) {
                    btnNouvelAliment.Click();
                }
            }

            //TODO
            //if (this.ti == "1") {
            if (self.config.ListOptions.indexOf("AffichageListeSimplifiee") > -1) {  
                let divListeSimplifiee = Framework.Form.TextElement.Register("divListeSimplifiee");
                divListeSimplifiee.Show();
            }

            let btnDesignationChecked = <HTMLButtonElement>document.getElementById("btnDesignationChecked");
            btnDesignationChecked.innerHTML = "!";
            btnDesignationChecked.style.background = "red";                      

            let selectFoodCategory = Framework.Form.Select.Register("selectFoodCategory", self.aliment.Categorie1, self.config.ListCategorie1, Framework.Form.Validator.NoValidation(), (val) => {
                if (val != "") {
                    self.aliment.LibelleCIQUAL = "";
                    self.aliment.CodeCIQUAL = "";
                    inputDesignation.Set("");
                }
                self.aliment.Categorie1 = val;
                self.aliment.Categorie2 = "";
                (<HTMLSelectElement>selectFoodCategory2.HtmlElement).value = "";

                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

            let selectFoodCategory2 = Framework.Form.Select.Register("selectFoodCategory2", self.aliment.Categorie2, self.config.ListCategorie2, Framework.Form.Validator.NoValidation(), (val) => {
                if (val != "") {
                    self.aliment.LibelleCIQUAL = "";
                    self.aliment.CodeCIQUAL = "";
                    inputDesignation.Set("");
                }
                self.aliment.Categorie1 = "";
                self.aliment.Categorie2 = val;
                (<HTMLSelectElement>selectFoodCategory.HtmlElement).value = "";

                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

            let selectAliment = <HTMLDataListElement>document.getElementById("selectAliment");

            self.config.ListAliments.filter(x => {
                let o: HTMLOptionElement = document.createElement("option");               
                //let txt: string = x.DesignationModifiee.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                //let arr = txt.split(" ");
                //let arr2 = [];
                //arr.forEach(x => {
                //    if (x.length > 2) {
                //        x = x.replace(/[^a-zA-Z]+/g, '') + "s"
                //    }
                //    arr2.push(x);
                //})
                //txt = arr2.join(" ");
                //o.value = x.DesignationModifiee + "------------------------------------------------------------------------------------------------------------------------------------------------------------|| " + txt;
                o.value = x.LibelleCustom;
                selectAliment.appendChild(o);
            });

            let lib = "";
            if (self.aliment.LibelleCIQUAL) {
                lib = self.aliment.LibelleCIQUAL;
            }

            let inputDesignation = Framework.Form.InputText.Register("inputDesignation", lib, Framework.Form.Validator.NotEmpty(), (designation: string) => {

                let realDesignation = designation;
                if (designation.indexOf("||") > -1) {
                    realDesignation = designation.substring(0, designation.indexOf("||")).split("--").join("").trim()
                }

                let sel = self.config.ListAliments.filter(x => { return x.LibelleCustom == realDesignation });
                if (sel.length > 0) {
                    inputDesignation.SetWithoutValidation(realDesignation);

                    self.aliment.LibelleCIQUAL = sel[0].LibelleCIQUAL;
                    self.aliment.CodeCIQUAL = sel[0].CodeCIQUAL;
                    self.aliment.PrixMin = sel[0].PrixMin;
                    self.aliment.PrixMax = sel[0].PrixMax;
                    self.aliment.PrixMinEpicerie = sel[0].PrixMinEpicerie;
                    self.aliment.PrixMaxEpicerie = sel[0].PrixMaxEpicerie;
                    self.aliment.PoidsUnitaire = sel[0].PoidsUnitaire;
                    self.aliment.Categorie1 = sel[0].Categorie1;
                    btnDesignationChecked.innerHTML = "<i class='fas fa-check-square'></i>";
                    btnDesignationChecked.style.background = "green";
                } else {
                    self.aliment.LibelleCIQUAL = "";
                    self.aliment.CodeCIQUAL = "";
                    self.aliment.PrixMin = undefined;
                    self.aliment.PrixMax = undefined;
                    self.aliment.PrixMinEpicerie = undefined;
                    self.aliment.PrixMaxEpicerie = undefined;
                    self.aliment.PoidsUnitaire = undefined;
                    self.aliment.Categorie1 = "";
                    btnDesignationChecked.innerHTML = "!";
                    btnDesignationChecked.style.background = "red";
                }


                self.aliment.Categorie2 = "";

                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();

            });

            let lib2 = "";
            if (self.aliment.LibelleCustom) {
                lib2 = self.aliment.LibelleCustom;
            }

            let inputDesignation2 = Framework.Form.InputText.Register("inputDesignation2", lib2, Framework.Form.Validator.MinLength(4), (designation: string) => {

                self.aliment.Categorie1 = "";
                self.aliment.Categorie2 = "";
                self.aliment.LibelleCustom = designation;
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });


            let divTexteAliment = Framework.Form.TextElement.Register("divTexteAliment");
            divTexteAliment.Hide();

            if (self.config.ListOptions.indexOf("AffichageChampsLibre") > -1) {  
                divTexteAliment.Show();
            }

            let setBtnUnite = (x, btn: HTMLElement) => {
                self.unite = x;
                self.aliment.Unite = x;
                self.testPrixKg();
                btnUnites.HtmlElement.classList.remove("btn-warning");
                btnGrammes.HtmlElement.classList.remove("btn-warning");
                btnLitres.HtmlElement.classList.remove("btn-warning");
                btnCentilitres.HtmlElement.classList.remove("btn-warning");
                btnKilos.HtmlElement.classList.remove("btn-warning");
                btn.classList.add("btn-warning");

            }

            let btnGrammes = Framework.Form.Button.Register("btnGrammes", () => {
                return true;
            }, () => {
                setBtnUnite("grammes", btnGrammes.HtmlElement);
            })
            btnGrammes.HtmlElement.classList.add("btn-warning");

            let btnUnites = Framework.Form.Button.Register("btnUnites", () => {
                return true;
            }, () => {
                setBtnUnite("unités", btnUnites.HtmlElement);
            })

            let btnLitres = Framework.Form.Button.Register("btnLitres", () => {
                return true;
            }, () => {
                setBtnUnite("litres", btnLitres.HtmlElement);
            })

            let btnKilos = Framework.Form.Button.Register("btnKilos", () => {
                return true;
            }, () => {
                setBtnUnite("kilos", btnKilos.HtmlElement);
            })

            let btnCentilitres = Framework.Form.Button.Register("btnCentilitres", () => {
                return true;
            }, () => {
                setBtnUnite("centilitres", btnCentilitres.HtmlElement);
            })

            let nb = "";
            if (self.aliment.Nb > 0) {
                nb = self.aliment.Nb.toString();
            }

            let inputPoids = Framework.Form.InputText.Register("inputPoids", nb, Framework.Form.Validator.NumberPos("Nombre attendu."), (poids: string) => {
                self.aliment.Nb = Number(poids.replace(",", "."));
                self.testPrixKg();
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

            let btnPrixChecked = <HTMLButtonElement>document.getElementById("btnPrixChecked");
            btnPrixChecked.innerHTML = "!";
            btnPrixChecked.style.background = "red";

            let prix = "";
            if (self.aliment.Prix > 0) {
                prix = self.aliment.Prix.toString();
            }

            let inputPrix = Framework.Form.InputText.Register("inputPrix", prix, Framework.Form.Validator.NumberPos("Nombre attendu.", 0), (prix: string) => {
                self.aliment.Prix = Number(prix.replace(",", "."));
                btnPrixChecked.innerHTML = "<i class='fas fa-check-square'></i>";
                btnPrixChecked.style.background = "green";
                if (Number(prix.replace(",", ".")) > 0) {
                    inputPasAchete.Uncheck();
                }
                self.testPrixKg();
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

            let divPrix = Framework.Form.TextElement.Register("divPrix");
            if (self.menu != "") {
                divPrix.Hide();
            }

            // Création tableau labels
            let tableLabels: HTMLTableElement = <HTMLTableElement>document.getElementById("tableLabels");
            
            for (let i = 0; i < self.config.ListLabels.length; i=i+2) {                
                let tr: HTMLTableRowElement = document.createElement("tr");
                tableLabels.appendChild(tr);
                let td1: HTMLTableCellElement = document.createElement("td");                
                td1.style.padding = "4px";
                tr.appendChild(td1);
                let input1 = Framework.Form.CheckBox.Create(() => { return true; }, (ev,cb) => {
                    if (cb.IsChecked) {
                        self.aliment.Labels.push(cb.Value)
                    }
                    else {
                        Framework.Array.Remove(self.aliment.Labels, cb.Value);
                    }
                }, self.config.ListLabels[i].Value, self.config.ListLabels[i].Value, self.aliment.Labels.indexOf(self.config.ListLabels[i].Value) > -1);
                input1.Value = self.config.ListLabels[i].Value;
                //input1.HtmlElement.children[0].classList.add("form-check-input");
                //input1.HtmlElement.children[1].classList.add("form-check-label");
                (<HTMLInputElement>input1.HtmlElement.children[0]).style.width = "32px";
                (<HTMLInputElement>input1.HtmlElement.children[1]).style.width = "130px";
                td1.appendChild(input1.HtmlElement);
                let td2: HTMLTableCellElement = document.createElement("td");
                tr.appendChild(td2);                
                if (i + 1 < self.config.ListLabels.length) {
                    let input2 = Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
                        if (cb.IsChecked) {
                            self.aliment.Labels.push(cb.Value)
                        }
                        else {
                            Framework.Array.Remove(self.aliment.Labels, cb.Value);
                        }
                    }, self.config.ListLabels[i + 1].Value, self.config.ListLabels[i + 1].Value, self.aliment.Labels.indexOf(self.config.ListLabels[i + 1].Value) > -1);
                    input2.Value = self.config.ListLabels[i+1].Value;
                    td2.appendChild(input2.HtmlElement);
                    td2.style.padding = "4px";
                    //input2.HtmlElement.children[0].classList.add("form-check-input");
                    //input2.HtmlElement.children[1].classList.add("form-check-label");
                    (<HTMLInputElement>input2.HtmlElement.children[0]).style.width = "32px";
                    (<HTMLInputElement>input2.HtmlElement.children[1]).style.width = "200px";
                }
            }

            let divLabels = Framework.Form.TextElement.Register("divLabels");
            if (self.config.ListOptions.indexOf("HideLabels") > -1) {
                divLabels.Hide();
            }
                   
            let inputJamaisGoute = Framework.Form.CheckBox.Register("inputJamaisGoute", () => { return true }, () => {
                rating.Clear();
                if (inputJamaisGoute.IsChecked) {
                    self.aliment.Appreciation = 0;
                } else {
                    self.aliment.Appreciation = -1;
                }
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");

            let inputPasAchete = Framework.Form.CheckBox.Register("inputPasAchete", () => { return true }, () => {
                if (inputPasAchete.IsChecked) {
                    inputPrix.Set("");
                    self.aliment.Prix = -1;
                }
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");

            let inputPasPoids = Framework.Form.CheckBox.Register("inputPasPoids", () => { return true }, () => {
                if (inputPasPoids.IsChecked) {
                    inputPoids.Set("");
                    self.aliment.PoidsUnitaire = -1;
                }
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");

            let rating = Framework.Rating.Render(document.getElementById("divLikingRank"), "", 1, 5, self.aliment.Appreciation, (x) => {
                self.aliment.Appreciation = x;
                inputJamaisGoute.Uncheck();
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

            let divLiking = Framework.Form.TextElement.Register("divLiking");            
            if (self.config.ListOptions.indexOf("HideLiking") > -1) {
                divLiking.Hide();
            }

            let btnNouvelAliment = Framework.Form.Button.Register("btnNouvelAliment", () => {
                return ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 != "" || self.aliment.Categorie2 != "" || (self.aliment.LibelleCustom && self.aliment.LibelleCustom.length > 3)) && (inputPoids.IsValid || inputPasPoids.IsChecked) && (inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") /*&& self.aliment.Appreciation >= 0*/;
            }, () => {

                self.aliment.Labels = [];
                self.aliment.DateModif = new Date(Date.now()).toISOString().split('T')[0];
                //if (inputBio.IsChecked) { self.aliment.Labels.push("Bio") };
                //if (inputAocAop.IsChecked) { self.aliment.Labels.push("AOC/AOP") };
                //if (inputLabelRouge.IsChecked) { self.aliment.Labels.push("Label rouge") };
                //if (inputPecheDurable.IsChecked) { self.aliment.Labels.push("Pêche durable") };
                //if (inputCommerceEquitable.IsChecked) { self.aliment.Labels.push("Commerce équitable") };
                //if (inputAutre.IsChecked) { self.aliment.Labels.push("Autre") };

                if (update == false) {
                    self.saveQuestionnaire(() => {
                        self.showEnregistrementConfirme(() => { self.showDivDesignation() })
                    });
                } else {
                    self.updateQuestionnaire(() => { self.showDivFactures(); });
                }
            })

            let btnNouveauTicket = Framework.Form.Button.Register("btnNouveauTicket", () => {
                return ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 != "" || self.aliment.Categorie2 != "" || (self.aliment.LibelleCustom && self.aliment.LibelleCustom.length > 3)) && (inputPoids.IsValid || inputPasPoids.IsChecked) && (inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") /*&& self.aliment.Appreciation >= 0*/;
            }, () => {
                //if (inputBio.IsChecked) { self.aliment.Labels.push("Bio") };
                //if (inputAocAop.IsChecked) { self.aliment.Labels.push("AOC/AOP") };
                //if (inputLabelRouge.IsChecked) { self.aliment.Labels.push("Label rouge") };
                //if (inputPecheDurable.IsChecked) { self.aliment.Labels.push("Pêche durable") };
                //if (inputCommerceEquitable.IsChecked) { self.aliment.Labels.push("Commerce équitable") };
                //if (inputAutre.IsChecked) { self.aliment.Labels.push("Autre") };
                self.saveQuestionnaire(() => {
                    self.showEnregistrementConfirme(() => {
                        self.ticket = undefined;
                        self.showDivDate();
                    })

                });
            })


            let btnTerminer = Framework.Form.Button.Register("btnTerminer", () => {
                return true;
            }, () => {

                if ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 || self.aliment.Categorie2 || self.aliment.LibelleCustom || inputPoids.IsValid || inputPasPoids.IsChecked || inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") {
                    Framework.Modal.Confirm(self.getTranslation("txtConfirmation"), self.getTranslation("txtChangementsNonEnregistres"), () => { self.showDivLogin() });
                } else {
                    self.showDivLogin();
                }
            })

            let btnTerminerEnregistrer = Framework.Form.Button.Register("btnTerminerEnregistrer", () => {
                return ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 != "" || self.aliment.Categorie2 != "" || (self.aliment.LibelleCustom && self.aliment.LibelleCustom.length > 3)) && (inputPoids.IsValid || inputPasPoids.IsChecked) && (inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") /*&& self.aliment.Appreciation >= 0*/;
            }, () => {

                self.saveQuestionnaire(() => {
                    self.showEnregistrementConfirme(() => { self.showDivLogin(); })

                });

            })
            
            self.translate("h5ChoixAliment");
            self.translate("h5NomAliment");
            self.translate("h5CategorieAliment");            
            self.translate("h5Quantite");
            self.translate("h5Prix");
            self.translate("h5Labels");
            self.translate("h5Gout");
            self.translate("inputDesignation", inputDesignation);
            self.translate("inputDesignation2", inputDesignation2);
            self.translate("inputPoids", inputPoids);
            self.translate("labelConnaisPasPoids");
            self.translate("btnGrammes", btnGrammes);
            self.translate("btnKilos", btnKilos);
            self.translate("btnLitres", btnLitres);
            self.translate("btnCentilitres", btnCentilitres);
            self.translate("btnUnites", btnUnites);
            self.translate("inputPrix", inputPrix);
            self.translate("labelConnaisPasPrix");
            self.translate("labelJamaisGoute");
            self.translate("pWarning");
            self.translate("btnNouveauTicket", btnNouveauTicket);
            self.translate("btnTerminerEnregistrer", btnTerminerEnregistrer);
            self.translate("btnTerminer", btnTerminer);
            self.translate("btnNouvelAliment", btnNouvelAliment);

            if (update == true) {
                self.translate("txtModifier", btnNouvelAliment);                
                btnNouveauTicket.Hide();
                btnTerminer.Hide();
                btnTerminerEnregistrer.Hide();
            }

        });
    }

    private showEnregistrementConfirme(action: () => void) {
        let self = this;
        this.show("html/DivEnregistre.html", () => {
            self.translate("h4AlimentEnregistre");
            setTimeout(() => {
                action();
            }, 1000);
        });

    }

}


