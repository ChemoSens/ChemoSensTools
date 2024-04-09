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
var CodApproApp = /** @class */ (function (_super) {
    __extends(CodApproApp, _super);
    function CodApproApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        var _this = _super.call(this, CodApproApp.GetRequirements(), isInTest) || this;
        /*//private lieuTicket: string = "";*/
        _this.unite = "grammes";
        _this.menu = "";
        _this.sn = "";
        _this.login = "";
        _this.listTextes = [];
        return _this;
    }
    CodApproApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/codappro2';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
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
    };
    CodApproApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    CodApproApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        var self = this;
        this.sn = Framework.Browser.GetUrlParameter("sn"); // Code de l'étude
        var admin = Framework.Browser.GetUrlParameter("admin"); // Id admin
        this.login = Framework.Browser.GetUrlParameter("login"); // login
        self.CallWCF('TranslateCodAppro', { sn: self.sn }, function () {
            Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
        }, function (res) {
            Framework.Progress.Hide();
            if (res.Status == 'success') {
                self.listTextes = JSON.parse(res.Result);
            }
            if (self.sn == "") {
                self.showDivLogin();
            }
            if (admin != "") {
                self.showDivLoginAdmin(admin);
            }
            else {
                self.showDivLogin();
            }
        });
    };
    CodApproApp.prototype.saveQuestionnaire = function (f) {
        var self = this;
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
        self.CallWCF('SaveQuestionnaireCodAppro', { code: self.questionnaire.Code, sn: self.sn, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, function () {
            Framework.Progress.Show(self.getTranslation("txtEnregistrement"));
        }, function (res) {
            Framework.Progress.Hide();
            if (res.Status == 'success') {
                f();
            }
            else {
                Framework.Modal.Alert(self.getTranslation("txtErreur"), self.getTranslation("txtErreurEnregistrement"), function () {
                    f();
                });
            }
        });
    };
    CodApproApp.prototype.updateQuestionnaire = function (f) {
        var self = this;
        self.CallWCF('SaveQuestionnaireCodAppro', { code: self.questionnaire.Code, sn: self.sn, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, function () {
            Framework.Progress.Show(self.getTranslation("txtEnregistrement"));
        }, function (res) {
            Framework.Progress.Hide();
            if (res.Status == 'success') {
                f();
            }
            else {
                Framework.Modal.Alert(self.getTranslation("txtErreur"), self.getTranslation("txtErreurEnregistrement"), function () {
                    f();
                });
            }
        });
    };
    CodApproApp.prototype.showDivLoginAdmin = function (admin) {
        var self = this;
        this.show("html/DivLoginAdmin.html", function () {
            // Enter
            document.onkeypress = function (e) {
                if (e.which == 10 || e.which == 13) {
                    btnTelecharger.Click();
                }
            };
            var inputPassword = Framework.Form.InputText.Register("inputPassword", "", Framework.Form.Validator.MinLength(4), function () {
                btnTelecharger.CheckState();
                btnImporter.CheckState();
            }, true);
            var btnTelecharger = Framework.Form.Button.Register("btnTelecharger", function () {
                return inputPassword.IsValid;
            }, function () {
                var obj = {
                    login: admin,
                    password: inputPassword.Value,
                    dir: self.sn
                };
                self.CallWCF('DownloadQuestionnaireCodAppro', obj, function () {
                    Framework.Progress.Show(self.getTranslation("txtConnexion"));
                }, function (res) {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        Framework.FileHelper.SaveBase64As(res.Result, "resultats_codappro.xlsx");
                    }
                    else {
                        Framework.Modal.Alert(self.getTranslation("txtErreur"), res.ErrorMessage);
                    }
                });
                self.translate("h2Administration");
                self.translate("h3MotPasse");
                self.translate("btnTelecharger", btnTelecharger);
                self.translate("btnImporter", btnImporter);
            });
            var btnImporter = Framework.Form.Button.Register("btnImporter", function () { return inputPassword.IsValid; }, function () {
                Framework.FileHelper.BrowseBinaries("xlsx", function (binaries) {
                    self.CallWCF('ImportQuestionnaireCodAppro', { data: binaries, sn: self.sn, login: admin, password: inputPassword.Value }, function () {
                        Framework.Progress.Show(self.getTranslation("txtChargement"));
                    }, function (res) {
                        Framework.Progress.Hide();
                        if (res.Status == "success") {
                            Framework.Modal.Alert(self.getTranslation("txtMessage"), self.getTranslation("txtTeleversementReussi"));
                        }
                        else {
                            Framework.Modal.Alert(self.getTranslation("txtMessage"), self.getTranslation("txtErreurTeleversement"));
                        }
                    });
                });
            });
        });
    };
    CodApproApp.prototype.getTranslation = function (key) {
        var self = this;
        var vals = self.listTextes.filter(function (x) { return x.Key == key; });
        if (vals.length > 0) {
            return (vals[0].Value);
        }
        return undefined;
    };
    CodApproApp.prototype.translate = function (key, elt) {
        if (elt === void 0) { elt = undefined; }
        var transl = this.getTranslation(key);
        if (transl == undefined) {
            return;
        }
        if (elt == undefined) {
            document.getElementById(key).innerText = transl;
            //Framework.Form.TextElement.Register(key, transl);
        }
        if (elt instanceof Framework.Form.TextElement) {
            elt.Set(transl);
        }
        if (elt instanceof Framework.Form.Button) {
            elt.SetInnerHTML(transl);
        }
        if (elt instanceof Framework.Form.InputText) {
            elt.SetPlaceHolder(transl);
        }
    };
    CodApproApp.prototype.showDivLogin = function () {
        var self = this;
        this.show("html/DivLogin.html", function () {
            // Enter
            document.onkeypress = function (e) {
                if (e.which == 10 || e.which == 13) {
                    btnLogin.Click();
                }
            };
            var login = "";
            if (self.login != null || self.login != undefined) {
                login = self.login;
            }
            if (login == "") {
                login = Framework.LocalStorage.GetFromLocalStorage("codappro_id", true);
                if (login == null || login == undefined) {
                    login = "";
                }
            }
            var inputLoginId = Framework.Form.InputText.Register("inputLoginId", login, Framework.Form.Validator.MinLength(5), function () {
                btnLogin.CheckState();
            }, true);
            var divLoginError = Framework.Form.TextElement.Register("divLoginError");
            var btnLogin = Framework.Form.Button.Register("btnLogin", function () {
                return inputLoginId.IsValid;
            }, function () {
                var obj = {
                    code: inputLoginId.Value,
                    sn: self.sn
                };
                self.CallWCF('LoginCodAppro', obj, function () {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                }, function (res) {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        try {
                            Framework.LocalStorage.SaveToLocalStorage("codappro_id", inputLoginId.Value, true);
                        }
                        catch (_a) {
                        }
                        self.config = JSON.parse(res.Result);
                        self.questionnaire = self.config.Questionnaire;
                        self.showDivDate();
                    }
                    else {
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
    };
    CodApproApp.prototype.showDivDate = function (aliment) {
        if (aliment === void 0) { aliment = undefined; }
        var self = this;
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
        }
        else {
            self.aliment = aliment;
            self.ticket = self.questionnaire.Tickets.filter(function (x) { return x.Code == aliment.TicketCode; })[0];
        }
        this.show("html/DivDate.html", function () {
            var btnPhoto = Framework.Form.Button.Register("btnPhoto", function () { return true; }, function () {
                var divPhoto = Framework.Form.TextElement.Create("");
                var video = document.createElement("video");
                divPhoto.HtmlElement.appendChild(video);
                video.style.width = "100%";
                var btn = document.createElement("button");
                btn.textContent = "Photo";
                btn.style.width = "100%";
                divPhoto.HtmlElement.appendChild(btn);
                var mw = Framework.Modal.Alert("Photo du ticket", divPhoto.HtmlElement, function () {
                    var fn = self.ticket.Code;
                    self.CallWCF('TeleverseImageCodAppro2', { base64string: base64, sn: self.sn, filename: fn }, function () { }, function (res) {
                        if (res.ErrorMessage != "") {
                            self.ticket.Image = fn;
                            Framework.Modal.Alert(self.getTranslation("txtSucces"), self.getTranslation("txtPhotoTeleversee"), function () { mw.Close(); });
                        }
                        else {
                            Framework.Modal.Alert(self.getTranslation("txtEchec"), self.getTranslation("txtErreurTeleversement"), function () { mw.Close(); });
                        }
                    });
                });
                mw.show();
                var base64 = undefined;
                var recorder = new Framework.PhotoRecorder(btn, video);
                recorder.OnSave = function (b64) {
                    base64 = b64;
                };
            });
            var btnUpload = Framework.Form.Button.Register("btnUpload", function () { return true; }, function () {
                Framework.FileHelper.BrowseBinaries("", function (binaries, filename) {
                    var fn = self.ticket.Code;
                    self.CallWCF('TeleverseImageCodAppro2', { base64string: binaries, sn: self.sn, filename: fn }, function () { }, function (res) {
                        if (res.ErrorMessage != "") {
                            self.ticket.Image = fn;
                            Framework.Modal.Alert(self.getTranslation("txtSucces"), self.getTranslation("txtPhotoTeleversee"));
                        }
                        else {
                            Framework.Modal.Alert(self.getTranslation("txtEchec"), self.getTranslation("txtErreurTeleversement"));
                        }
                    });
                });
            });
            var divTicketMenu = Framework.Form.TextElement.Register("divTicketMenu");
            divTicketMenu.Hide();
            var divTicketPrix = Framework.Form.TextElement.Register("divTicketPrix");
            divTicketPrix.Hide();
            var divChequeAlimentaire = Framework.Form.TextElement.Register("divChequeAlimentaire");
            divChequeAlimentaire.Hide();
            var inputChequeAlimentaire = Framework.Form.InputText.Register("inputChequeAlimentaire", "", Framework.Form.Validator.NumberPos("Nombre attendu.", 0), function (prix) {
                self.aliment.MontantChequeAlimentaire = Number(prix.replace(",", "."));
                btnContinuer.CheckState();
            });
            //if (this.ti == "1") {
            if (self.config.ListOptions.indexOf("SaisieChequeAlimentaire") > -1) {
                divChequeAlimentaire.Show();
            }
            // Tab
            document.getElementById("lastSpan").onfocus = function () {
                document.getElementById("prevent-outside-tab").focus();
            };
            // Enter
            document.onkeypress = function (e) {
                if (e.which == 10 || e.which == 13) {
                    btnContinuer.Click();
                }
            };
            var btnLieuChecked = document.getElementById("btnLieuChecked");
            btnLieuChecked.innerHTML = "!";
            btnLieuChecked.style.background = "red";
            var selectLieu = document.getElementById("selectLieu");
            var inputDate = Framework.Form.InputText.Register("inputDate", self.ticket.Date, Framework.Form.Validator.NoValidation(), function (date) {
                self.ticket.Date = date;
                btnContinuer.CheckState();
            });
            self.config.ListLieuxAchats.forEach(function (x) {
                var o = document.createElement("option");
                o.value = x.Key;
                selectLieu.appendChild(o);
            });
            var inputLieu = Framework.Form.InputText.Register("inputLieu", self.ticket.Lieu, Framework.Form.Validator.NotEmpty(), function (lieu) {
                self.ticket.Lieu = "";
                btnLieuChecked.innerHTML = "!";
                btnLieuChecked.style.background = "red";
                btnContinuer.CheckState();
                for (var i = 0; i < self.config.ListLieuxAchats.length; i++) {
                    if (self.config.ListLieuxAchats[i].Key === lieu) {
                        self.ticket.Lieu = lieu;
                        btnLieuChecked.innerHTML = "<i class='fas fa-check-square'></i>";
                        btnLieuChecked.style.background = "green";
                        var typeCommerce = self.config.ListLieuxAchats.filter(function (x) { return x.Key == lieu; })[0].Value;
                        if (["supermarché", "discount"].indexOf(typeCommerce) < 0) {
                            divTicketMenu.Show();
                        }
                        else {
                            self.menu = "";
                            divTicketMenu.Hide();
                        }
                        btnContinuer.CheckState();
                        break;
                    }
                }
            });
            var inputTicketMenuO = Framework.Form.CheckBox.Register("inputTicketMenuO", function () { return true; }, function () { self.menu = "Oui"; divTicketPrix.Show(); btnContinuer.CheckState(); }, "");
            var inputTicketMenuN = Framework.Form.CheckBox.Register("inputTicketMenuN", function () { return true; }, function () { self.menu = ""; inputPrix.Set(""); divTicketPrix.Hide(); btnContinuer.CheckState(); }, "");
            var inputPrix = Framework.Form.InputText.Register("inputPrix", "", Framework.Form.Validator.NumberPos("Nombre attendu.", 0), function (prix) {
                self.aliment.PrixMenu = Number(prix.replace(",", "."));
                self.aliment.Prix = -1;
                btnContinuer.CheckState();
            });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return self.ticket.Lieu && self.ticket.Lieu.length > 3 && (divTicketMenu.IsVisible == false || (divTicketMenu.IsVisible == true && (inputTicketMenuN.IsChecked == true || (inputTicketMenuO.IsChecked == true && inputPrix.IsValid))));
            }, function () {
                self.aliment.Date = self.ticket.Date;
                self.aliment.Lieu = self.ticket.Lieu;
                self.aliment.Menu = self.menu;
                self.showDivDesignation(aliment != undefined);
            });
            var btnVoirFactures = Framework.Form.Button.Register("btnVoirFactures", function () {
                return true;
            }, function () {
                self.showDivFactures();
            });
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
    };
    CodApproApp.prototype.showDivDetail = function (ticketCode) {
        var self = this;
        this.show("html/DivDetail.html", function () {
            var divTableFactures = Framework.Form.TextElement.Register("divTableFactures");
            var btnFin = Framework.Form.Button.Register("btnFin", function () { return true; }, function () { self.showDivFactures(); });
            var aliments = self.questionnaire.Aliments.filter(function (z) { return z.TicketCode == ticketCode; });
            var btnSupprimerTicket = Framework.Form.Button.Register("btnSupprimerTicket", function () { return true; }, function () {
                Framework.Modal.Confirm(self.getTranslation("txtConfirmation"), self.getTranslation("txtSuppressionTicket"), function () {
                    Framework.Array.Remove(self.questionnaire.Tickets, self.questionnaire.Tickets.filter(function (x) { return x.Code == ticketCode; })[0]);
                    aliments.forEach(function (x) {
                        Framework.Array.Remove(self.questionnaire.Aliments, x);
                    });
                    self.updateQuestionnaire(function () { self.showDivFactures(); });
                });
            });
            var table = new Framework.Form.Table();
            table.CanSelect = false;
            table.ShowFooter = false;
            table.ListData = aliments;
            table.Height = "80vh";
            table.FullWidth = true;
            table.CanSelect = true;
            table.ShowFooter = true;
            table.RemoveFunction = function () {
                Framework.Modal.Confirm(self.getTranslation("txtConfirmationSuppression"), "", function () {
                    table.SelectedData.forEach(function (x) {
                        Framework.Array.Remove(self.questionnaire.Aliments, x);
                    });
                    table.Remove(table.SelectedData);
                    self.updateQuestionnaire(function () { });
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
            table.AddCol("", "", 50, "left", undefined, undefined, function (x, y) {
                return Framework.Form.Button.Create(function () { return true; }, function () {
                    self.showDivDate(y);
                }, "Edit", ["btn", "btn-sm", "btn-primary"]).HtmlElement;
            });
            table.Render(divTableFactures.HtmlElement);
            self.translate("h4EditionFacture");
            self.translate("btnSupprimerTicket", btnSupprimerTicket);
            self.translate("btnFin", btnFin);
        });
    };
    CodApproApp.prototype.showDivFactures = function () {
        var self = this;
        this.show("html/DivFactures.html", function () {
            var divTableFactures = Framework.Form.TextElement.Register("divTableFactures");
            var table1 = new Framework.Form.Table();
            self.CallWCF('DownloadDataCodAppro', { sn: self.sn, code: self.questionnaire.Code }, function () {
                Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
            }, function (res) {
                Framework.Progress.Hide();
                if (res.Status == 'success') {
                    self.questionnaire = JSON.parse(res.Result);
                    var tickets = self.questionnaire.Tickets;
                    //self.questionnaire.Aliments.forEach((x) => {
                    //    let t = tickets.filter(y => y.Code == x.Code);
                    //    if (t.length == 0) {
                    //        let tt: CodApproModels.Ticket = new CodApproModels.Ticket();
                    //        tt.Date = x.Date;
                    //        tt.Lieu = x.Lieu;                            
                    //        tickets.push(new CodApproModels.Ticket());
                    //    }
                    //});
                    table1 = new Framework.Form.Table();
                    table1.CanSelect = true;
                    table1.OnSelectionChanged = (function (sel) {
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
                    table1.AddCol("", "", 50, "left", undefined, undefined, function (x, y) {
                        return Framework.Form.Button.Create(function () { return true; }, function () {
                            //self.showDivDetail(self.questionnaire.Aliments.filter(z => z.TicketCode == y.Code));
                            self.showDivDetail(y.Code);
                        }, "Edit", ["btn", "btn-sm", "btn-primary"]).HtmlElement;
                    });
                    table1.Render(divTableFactures.HtmlElement);
                }
                else {
                    Framework.Modal.Alert(self.getTranslation("txtErreur"), res.ErrorMessage);
                }
            });
            var btnNouveauTicket2 = Framework.Form.Button.Register("btnNouveauTicket2", function () { return true; }, function () { self.showDivDate(); });
            var btnCopieTicket = Framework.Form.Button.Register("btnCopieTicket", function () { return table1.SelectedData.length == 1; }, function () {
                //ICI TODO
                self.ticket = new CodApproModels.Ticket();
                self.ticket.Code = self.questionnaire.Code + "_" + (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
                self.questionnaire.Tickets.push(self.ticket);
                self.ticket.Lieu = table1.SelectedData[0].Lieu;
                self.ticket.Image = "copie de " + self.ticket.Code;
                var aliments = self.questionnaire.Aliments.filter(function (x) { return (x.TicketCode == table1.SelectedData[0].Code); });
                aliments.forEach(function (y) {
                    var al = new CodApproModels.Aliment();
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
                });
                self.saveQuestionnaire(function () {
                    self.showDivFactures();
                });
                //self.showDivDate();
            });
            self.translate("h4Saisies");
            self.translate("btnNouveauTicket2", btnNouveauTicket2);
            self.translate("btnCopieTicket", btnCopieTicket);
        });
    };
    CodApproApp.prototype.testPrixKg = function () {
        var self = this;
        var divWarningPrix = Framework.Form.TextElement.Register("divWarningPrix");
        divWarningPrix.Hide();
        if (self.menu != "") {
            return;
        }
        var diviseur = 0;
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
            var prixmax = undefined;
            var prixmin = undefined;
            if (self.aliment.Lieu == "Epicerie sociale") {
                prixmax = self.aliment.PrixMaxEpicerie;
                prixmin = self.aliment.PrixMinEpicerie;
            }
            else {
                prixmax = self.aliment.PrixMax;
                prixmin = self.aliment.PrixMin;
            }
            var prixKg = self.aliment.Prix / diviseur;
            if (prixKg > prixmax) {
                divWarningPrix.SetHtml('<p style="color:red">' + self.getTranslation("txtPrixKilo1") + '(' + Math.round(prixKg * 100) / 100 + ') ' + self.getTranslation("txtPrixKilo2") + '</p>');
                divWarningPrix.Show();
            }
            if (prixKg < prixmin) {
                divWarningPrix.SetHtml('<p style="color:red">' + self.getTranslation("txtPrixKilo1") + '(' + Math.round(prixKg * 100) / 100 + ') ' + self.getTranslation("txtPrixKilo3") + '</p>');
                divWarningPrix.Show();
            }
        }
    };
    CodApproApp.prototype.showDivDesignation = function (update) {
        if (update === void 0) { update = false; }
        var self = this;
        this.show("html/DivDesignation.html", function () {
            // Tab
            document.getElementById("lastSpan").onfocus = function () {
                document.getElementById("prevent-outside-tab").focus();
            };
            // Enter
            document.onkeypress = function (e) {
                if (e.which == 10 || e.which == 13) {
                    btnNouvelAliment.Click();
                }
            };
            //TODO
            //if (this.ti == "1") {
            if (self.config.ListOptions.indexOf("AffichageListeSimplifiee") > -1) {
                var divListeSimplifiee = Framework.Form.TextElement.Register("divListeSimplifiee");
                divListeSimplifiee.Show();
            }
            var btnDesignationChecked = document.getElementById("btnDesignationChecked");
            btnDesignationChecked.innerHTML = "!";
            btnDesignationChecked.style.background = "red";
            var selectFoodCategory = Framework.Form.Select.Register("selectFoodCategory", self.aliment.Categorie1, self.config.ListCategorie1, Framework.Form.Validator.NoValidation(), function (val) {
                if (val != "") {
                    self.aliment.LibelleCIQUAL = "";
                    self.aliment.CodeCIQUAL = "";
                    inputDesignation.Set("");
                }
                self.aliment.Categorie1 = val;
                self.aliment.Categorie2 = "";
                selectFoodCategory2.HtmlElement.value = "";
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
            var selectFoodCategory2 = Framework.Form.Select.Register("selectFoodCategory2", self.aliment.Categorie2, self.config.ListCategorie2, Framework.Form.Validator.NoValidation(), function (val) {
                if (val != "") {
                    self.aliment.LibelleCIQUAL = "";
                    self.aliment.CodeCIQUAL = "";
                    inputDesignation.Set("");
                }
                self.aliment.Categorie1 = "";
                self.aliment.Categorie2 = val;
                selectFoodCategory.HtmlElement.value = "";
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
            var selectAliment = document.getElementById("selectAliment");
            self.config.ListAliments.filter(function (x) {
                var o = document.createElement("option");
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
            var lib = "";
            if (self.aliment.LibelleCIQUAL) {
                lib = self.aliment.LibelleCIQUAL;
            }
            var inputDesignation = Framework.Form.InputText.Register("inputDesignation", lib, Framework.Form.Validator.NotEmpty(), function (designation) {
                var realDesignation = designation;
                if (designation.indexOf("||") > -1) {
                    realDesignation = designation.substring(0, designation.indexOf("||")).split("--").join("").trim();
                }
                var sel = self.config.ListAliments.filter(function (x) { return x.LibelleCustom == realDesignation; });
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
                }
                else {
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
            var lib2 = "";
            if (self.aliment.LibelleCustom) {
                lib2 = self.aliment.LibelleCustom;
            }
            var inputDesignation2 = Framework.Form.InputText.Register("inputDesignation2", lib2, Framework.Form.Validator.MinLength(4), function (designation) {
                self.aliment.Categorie1 = "";
                self.aliment.Categorie2 = "";
                self.aliment.LibelleCustom = designation;
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
            var divTexteAliment = Framework.Form.TextElement.Register("divTexteAliment");
            divTexteAliment.Hide();
            if (self.config.ListOptions.indexOf("AffichageChampsLibre") > -1) {
                divTexteAliment.Show();
            }
            var setBtnUnite = function (x, btn) {
                self.unite = x;
                self.aliment.Unite = x;
                self.testPrixKg();
                btnUnites.HtmlElement.classList.remove("btn-warning");
                btnGrammes.HtmlElement.classList.remove("btn-warning");
                btnLitres.HtmlElement.classList.remove("btn-warning");
                btnCentilitres.HtmlElement.classList.remove("btn-warning");
                btnKilos.HtmlElement.classList.remove("btn-warning");
                btn.classList.add("btn-warning");
            };
            var btnGrammes = Framework.Form.Button.Register("btnGrammes", function () {
                return true;
            }, function () {
                setBtnUnite("grammes", btnGrammes.HtmlElement);
            });
            btnGrammes.HtmlElement.classList.add("btn-warning");
            var btnUnites = Framework.Form.Button.Register("btnUnites", function () {
                return true;
            }, function () {
                setBtnUnite("unités", btnUnites.HtmlElement);
            });
            var btnLitres = Framework.Form.Button.Register("btnLitres", function () {
                return true;
            }, function () {
                setBtnUnite("litres", btnLitres.HtmlElement);
            });
            var btnKilos = Framework.Form.Button.Register("btnKilos", function () {
                return true;
            }, function () {
                setBtnUnite("kilos", btnKilos.HtmlElement);
            });
            var btnCentilitres = Framework.Form.Button.Register("btnCentilitres", function () {
                return true;
            }, function () {
                setBtnUnite("centilitres", btnCentilitres.HtmlElement);
            });
            var nb = "";
            if (self.aliment.Nb > 0) {
                nb = self.aliment.Nb.toString();
            }
            var inputPoids = Framework.Form.InputText.Register("inputPoids", nb, Framework.Form.Validator.NumberPos("Nombre attendu."), function (poids) {
                self.aliment.Nb = Number(poids.replace(",", "."));
                self.testPrixKg();
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
            var btnPrixChecked = document.getElementById("btnPrixChecked");
            btnPrixChecked.innerHTML = "!";
            btnPrixChecked.style.background = "red";
            var prix = "";
            if (self.aliment.Prix > 0) {
                prix = self.aliment.Prix.toString();
            }
            var inputPrix = Framework.Form.InputText.Register("inputPrix", prix, Framework.Form.Validator.NumberPos("Nombre attendu.", 0), function (prix) {
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
            var divPrix = Framework.Form.TextElement.Register("divPrix");
            if (self.menu != "") {
                divPrix.Hide();
            }
            // Création tableau labels
            var tableLabels = document.getElementById("tableLabels");
            for (var i = 0; i < self.config.ListLabels.length; i = i + 2) {
                var tr = document.createElement("tr");
                tableLabels.appendChild(tr);
                var td1 = document.createElement("td");
                td1.style.padding = "4px";
                tr.appendChild(td1);
                var input1 = Framework.Form.CheckBox.Create(function () { return true; }, function (ev, cb) {
                    if (cb.IsChecked) {
                        self.aliment.Labels.push(cb.Value);
                    }
                    else {
                        Framework.Array.Remove(self.aliment.Labels, cb.Value);
                    }
                }, self.config.ListLabels[i].Value, self.config.ListLabels[i].Value, self.aliment.Labels.indexOf(self.config.ListLabels[i].Value) > -1);
                input1.Value = self.config.ListLabels[i].Value;
                //input1.HtmlElement.children[0].classList.add("form-check-input");
                //input1.HtmlElement.children[1].classList.add("form-check-label");
                input1.HtmlElement.children[0].style.width = "32px";
                input1.HtmlElement.children[1].style.width = "130px";
                td1.appendChild(input1.HtmlElement);
                var td2 = document.createElement("td");
                tr.appendChild(td2);
                if (i + 1 < self.config.ListLabels.length) {
                    var input2 = Framework.Form.CheckBox.Create(function () { return true; }, function (ev, cb) {
                        if (cb.IsChecked) {
                            self.aliment.Labels.push(cb.Value);
                        }
                        else {
                            Framework.Array.Remove(self.aliment.Labels, cb.Value);
                        }
                    }, self.config.ListLabels[i + 1].Value, self.config.ListLabels[i + 1].Value, self.aliment.Labels.indexOf(self.config.ListLabels[i + 1].Value) > -1);
                    input2.Value = self.config.ListLabels[i + 1].Value;
                    td2.appendChild(input2.HtmlElement);
                    td2.style.padding = "4px";
                    //input2.HtmlElement.children[0].classList.add("form-check-input");
                    //input2.HtmlElement.children[1].classList.add("form-check-label");
                    input2.HtmlElement.children[0].style.width = "32px";
                    input2.HtmlElement.children[1].style.width = "200px";
                }
            }
            var divLabels = Framework.Form.TextElement.Register("divLabels");
            if (self.config.ListOptions.indexOf("HideLabels") > -1) {
                divLabels.Hide();
            }
            var inputJamaisGoute = Framework.Form.CheckBox.Register("inputJamaisGoute", function () { return true; }, function () {
                rating.Clear();
                if (inputJamaisGoute.IsChecked) {
                    self.aliment.Appreciation = 0;
                }
                else {
                    self.aliment.Appreciation = -1;
                }
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");
            var inputPasAchete = Framework.Form.CheckBox.Register("inputPasAchete", function () { return true; }, function () {
                if (inputPasAchete.IsChecked) {
                    inputPrix.Set("");
                    self.aliment.Prix = -1;
                }
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");
            var inputPasPoids = Framework.Form.CheckBox.Register("inputPasPoids", function () { return true; }, function () {
                if (inputPasPoids.IsChecked) {
                    inputPoids.Set("");
                    self.aliment.PoidsUnitaire = -1;
                }
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");
            var rating = Framework.Rating.Render(document.getElementById("divLikingRank"), "", 1, 5, self.aliment.Appreciation, function (x) {
                self.aliment.Appreciation = x;
                inputJamaisGoute.Uncheck();
                btnNouvelAliment.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
            var divLiking = Framework.Form.TextElement.Register("divLiking");
            if (self.config.ListOptions.indexOf("HideLiking") > -1) {
                divLiking.Hide();
            }
            var btnNouvelAliment = Framework.Form.Button.Register("btnNouvelAliment", function () {
                return ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 != "" || self.aliment.Categorie2 != "" || (self.aliment.LibelleCustom && self.aliment.LibelleCustom.length > 3)) && (inputPoids.IsValid || inputPasPoids.IsChecked) && (inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") /*&& self.aliment.Appreciation >= 0*/;
            }, function () {
                self.aliment.Labels = [];
                self.aliment.DateModif = new Date(Date.now()).toISOString().split('T')[0];
                //if (inputBio.IsChecked) { self.aliment.Labels.push("Bio") };
                //if (inputAocAop.IsChecked) { self.aliment.Labels.push("AOC/AOP") };
                //if (inputLabelRouge.IsChecked) { self.aliment.Labels.push("Label rouge") };
                //if (inputPecheDurable.IsChecked) { self.aliment.Labels.push("Pêche durable") };
                //if (inputCommerceEquitable.IsChecked) { self.aliment.Labels.push("Commerce équitable") };
                //if (inputAutre.IsChecked) { self.aliment.Labels.push("Autre") };
                if (update == false) {
                    self.saveQuestionnaire(function () {
                        self.showEnregistrementConfirme(function () { self.showDivDesignation(); });
                    });
                }
                else {
                    self.updateQuestionnaire(function () { self.showDivFactures(); });
                }
            });
            var btnNouveauTicket = Framework.Form.Button.Register("btnNouveauTicket", function () {
                return ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 != "" || self.aliment.Categorie2 != "" || (self.aliment.LibelleCustom && self.aliment.LibelleCustom.length > 3)) && (inputPoids.IsValid || inputPasPoids.IsChecked) && (inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") /*&& self.aliment.Appreciation >= 0*/;
            }, function () {
                //if (inputBio.IsChecked) { self.aliment.Labels.push("Bio") };
                //if (inputAocAop.IsChecked) { self.aliment.Labels.push("AOC/AOP") };
                //if (inputLabelRouge.IsChecked) { self.aliment.Labels.push("Label rouge") };
                //if (inputPecheDurable.IsChecked) { self.aliment.Labels.push("Pêche durable") };
                //if (inputCommerceEquitable.IsChecked) { self.aliment.Labels.push("Commerce équitable") };
                //if (inputAutre.IsChecked) { self.aliment.Labels.push("Autre") };
                self.saveQuestionnaire(function () {
                    self.showEnregistrementConfirme(function () {
                        self.ticket = undefined;
                        self.showDivDate();
                    });
                });
            });
            var btnTerminer = Framework.Form.Button.Register("btnTerminer", function () {
                return true;
            }, function () {
                if ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 || self.aliment.Categorie2 || self.aliment.LibelleCustom || inputPoids.IsValid || inputPasPoids.IsChecked || inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") {
                    Framework.Modal.Confirm(self.getTranslation("txtConfirmation"), self.getTranslation("txtChangementsNonEnregistres"), function () { self.showDivLogin(); });
                }
                else {
                    self.showDivLogin();
                }
            });
            var btnTerminerEnregistrer = Framework.Form.Button.Register("btnTerminerEnregistrer", function () {
                return ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 != "" || self.aliment.Categorie2 != "" || (self.aliment.LibelleCustom && self.aliment.LibelleCustom.length > 3)) && (inputPoids.IsValid || inputPasPoids.IsChecked) && (inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") /*&& self.aliment.Appreciation >= 0*/;
            }, function () {
                self.saveQuestionnaire(function () {
                    self.showEnregistrementConfirme(function () { self.showDivLogin(); });
                });
            });
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
    };
    CodApproApp.prototype.showEnregistrementConfirme = function (action) {
        var self = this;
        this.show("html/DivEnregistre.html", function () {
            self.translate("h4AlimentEnregistre");
            setTimeout(function () {
                action();
            }, 1000);
        });
    };
    return CodApproApp;
}(Framework.App));
//# sourceMappingURL=app.js.map