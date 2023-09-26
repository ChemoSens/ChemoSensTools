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
var CodAchatsApp = /** @class */ (function (_super) {
    __extends(CodAchatsApp, _super);
    function CodAchatsApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        var _this = _super.call(this, CodAchatsApp.GetRequirements(), isInTest) || this;
        _this.lieuTicket = "";
        _this.unite = "grammes";
        _this.dateTicket = new Date(Date.now()).toLocaleDateString('en-CA');
        _this.menu = "";
        _this.sn = "";
        _this.ti = "";
        _this.login = "";
        return _this;
    }
    CodAchatsApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/codappro';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
            requirements.AppUrl = 'https://www.chemosenstools.com/codappro';
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
    CodAchatsApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    CodAchatsApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        this.sn = Framework.Browser.GetUrlParameter("sn"); // Code de l'étude
        this.ti = Framework.Browser.GetUrlParameter("v"); // Affichage spécifique valentin
        var admin = Framework.Browser.GetUrlParameter("admin"); // Id admin
        this.login = Framework.Browser.GetUrlParameter("login"); // login
        if (this.sn == "") {
            this.sn = "a";
        }
        if (admin != "") {
            this.showDivLoginAdmin(admin);
        }
        else {
            this.showDivLogin();
        }
    };
    CodAchatsApp.prototype.saveQuestionnaire = function (f) {
        var self = this;
        self.aliment.Date = self.dateTicket;
        self.aliment.Lieu = self.lieuTicket;
        self.aliment.Menu = self.menu;
        if (self.aliment.DateSaisie == undefined) {
            self.aliment.DateSaisie = new Date(Date.now()).toLocaleDateString('en-CA');
        }
        self.aliment.DateModif = new Date(Date.now()).toLocaleDateString('en-CA');
        self.questionnaire.Aliments.push(self.aliment);
        self.aliment = new CodAchatsModels.Aliment();
        self.aliment.Date = self.dateTicket;
        self.aliment.Lieu = self.lieuTicket;
        self.aliment.Menu = self.menu;
        self.aliment.Unite = "grammes";
        self.CallWCF('SaveQuestionnaireCodAchats', { code: self.questionnaire.Code, dir: self.sn, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, function () {
            Framework.Progress.Show("Enregistrement...");
        }, function (res) {
            Framework.Progress.Hide();
            if (res.Status == 'success') {
                f();
                //self.showDivChoix();
                //self.showDivDesignation();
            }
            else {
                Framework.Modal.Alert("Erreur", "Une erreur a eu lieu pendant l'enregistrement du fichier.", function () {
                    f();
                    //self.showDivChoix();
                    //self.showDivDesignation();
                });
            }
        });
    };
    CodAchatsApp.prototype.updateQuestionnaire = function (f) {
        var self = this;
        self.CallWCF('SaveQuestionnaireCodAchats', { code: self.questionnaire.Code, dir: self.sn, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, function () {
            Framework.Progress.Show("Enregistrement...");
        }, function (res) {
            Framework.Progress.Hide();
            if (res.Status == 'success') {
                f();
            }
            else {
                Framework.Modal.Alert("Erreur", "Une erreur a eu lieu pendant l'enregistrement du fichier.", function () {
                    f();
                });
            }
        });
    };
    CodAchatsApp.prototype.showDivLoginAdmin = function (admin) {
        var self = this;
        this.show("html/DivLoginAdmin.html", function () {
            // Enter
            document.onkeypress = function (e) {
                if (e.which == 10 || e.which == 13) {
                    btnLogin.Click();
                }
            };
            var inputPassword = Framework.Form.InputText.Register("inputPassword", "", Framework.Form.Validator.MinLength(4), function () {
                btnLogin.CheckState();
                btnImporter.CheckState();
            }, true);
            var btnLogin = Framework.Form.Button.Register("btnLogin", function () {
                return inputPassword.IsValid;
            }, function () {
                var obj = {
                    login: admin,
                    password: inputPassword.Value,
                    dir: self.sn
                };
                self.CallWCF('DownloadQuestionnaireCodAchats', obj, function () {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                }, function (res) {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        Framework.FileHelper.SaveBase64As(res.Result, "resultats_codachats.xlsx");
                    }
                    else {
                        Framework.Modal.Alert("Erreur", res.ErrorMessage);
                    }
                });
            });
            var btnImporter = Framework.Form.Button.Register("btnImporter", function () { return inputPassword.IsValid; }, function () {
                Framework.FileHelper.BrowseBinaries("xlsx", function (binaries) {
                    self.CallWCF('ImportQuestionnaireCodAchats', { data: binaries, sn: self.sn, login: admin, password: inputPassword.Value }, function () {
                        Framework.Progress.Show("Import en cours");
                    }, function (res) {
                        Framework.Progress.Hide();
                        if (res.Status == "success") {
                            //let aliments = JSON.parse(res.Result);
                            //aliments.forEach(x => {
                            //    self.questionnaire.Aliments.push(x);
                            //});
                            //self.updateQuestionnaire(() => {
                            //    self.showDivFactures();
                            //})
                            Framework.Modal.Alert("Message", "Téléversement réussi");
                        }
                        else {
                            Framework.Modal.Alert("Message", "Erreur pendant le téléversement");
                        }
                    });
                });
            });
        });
    };
    CodAchatsApp.prototype.showDivLogin = function () {
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
                login = Framework.LocalStorage.GetFromLocalStorage("codachats_id", true);
                if (login == null || login == undefined) {
                    login = "";
                }
            }
            var inputLoginId = Framework.Form.InputText.Register("inputLoginId", login, Framework.Form.Validator.MinLength(5), function () {
                btnLogin.CheckState();
            }, true);
            //let inputLoginPassword = Framework.Form.InputText.Register("inputLoginPassword", "", Framework.Form.Validator.MinLength(4), () => {
            //    btnLogin.CheckState();
            //}, true);
            var divLoginError = Framework.Form.TextElement.Register("divLoginError");
            var btnLogin = Framework.Form.Button.Register("btnLogin", function () {
                return inputLoginId.IsValid /*&& inputLoginPassword.IsValid*/;
            }, function () {
                var obj = {
                    code: inputLoginId.Value,
                    sn: self.sn
                };
                self.CallWCF('LoginCodAchats', obj, function () {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                }, function (res) {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        try {
                            Framework.LocalStorage.SaveToLocalStorage("codachats_id", inputLoginId.Value, true);
                        }
                        catch (_a) {
                        }
                        self.questionnaire = JSON.parse(res.Result);
                        self.CallWCF('ClassifieurCiqualCodachats', { txt: "" }, function () {
                            Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                        }, function (res) {
                            Framework.Progress.Hide();
                            var json = res.Result;
                            self.aliments = JSON.parse(json);
                            self.showDivDate();
                        });
                        //
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
        });
    };
    CodAchatsApp.prototype.showDivDate = function (aliment) {
        var _this = this;
        if (aliment === void 0) { aliment = undefined; }
        var self = this;
        if (aliment == undefined) {
            self.aliment = new CodAchatsModels.Aliment();
            self.aliment.Unite = "grammes";
            self.aliment.Date = self.dateTicket;
            self.aliment.LibelleCIQUAL = "";
            self.aliment.Menu = "";
        }
        else {
            self.aliment = aliment;
            self.dateTicket = self.aliment.Date;
            self.lieuTicket = self.aliment.Lieu;
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
                    var timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
                    var fn = self.questionnaire.Code + "_" + timeStamp;
                    self.CallWCF('TeleverseImageCodAppro', { base64string: base64, filename: fn }, function () { }, function (res) {
                        self.aliment.Image = fn;
                        if (res.Status == "success") {
                            mw.Close();
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
            if (_this.ti == "1") {
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
            var inputDate = Framework.Form.InputText.Register("inputDate", self.dateTicket, Framework.Form.Validator.NoValidation(), function (date) {
                self.dateTicket = date;
                btnContinuer.CheckState();
            });
            //let lieux: string[] = [
            //    "Action",
            //    "Aldi",
            //    "Auchan",
            //    "Auchan drive",
            //    "Carrefour",
            //    "Carrefour drive",
            //    "Casino",
            //    "Casino drive",
            //    "Colruyt",
            //    "Cora",
            //    "Cora drive",
            //    "Coccimarket",
            //    "CROUS",
            //    "Grand frais",
            //    "Intermarché",
            //    "Leader Price",
            //    "Leclerc",
            //    "Leclerc drive",
            //    "LidL",
            //    "Super U",
            //    "Super U drive",
            //    "Marché du bonheur",
            //    "Netto",
            //    "Autre supermarché",
            //    "Autre supermarché bio",
            //    "Epicerie sociale",
            //    "Boulangerie",
            //    "Boucherie",
            //    "Fromager",
            //    "Autre petit commerce",
            //    "Marché",
            //    "Restos du cœur",
            //    "Secours populaire",
            //    "Secours catholique",
            //    "Croix rouge",
            //    "Autre association",
            //    "Don voisin/ami/famille",
            //    "Jardin",
            //    "Autres dons",
            //    "Fins de marchés ou poubelles",
            //    "Cantine",
            //    "Restaurant/bar/café (sur place)",
            //    "Restaurant d'entreprise (sur place)",
            //    "Fast-Food (sur place)",
            //    "Vente à emporter",
            //    "Livraison à domicile",
            //    "Distributeur",
            //    "Cinéma",
            //    "Autre"
            //];
            var lieux = ["ACTION",
                "AHUY FRUITS - Ahuy ",
                "AJ MARKET - Dijon (Rue d'York)",
                "ALDI",
                "ALDI - Chenôve",
                "ALDI - Dijon (Avenue Raymond Poincaré)",
                "ALDI - Fontaine-Lès-Dijon",
                "ALDI - Quetigny ",
                "ALIMENTATION D'EL KSIBA",
                "AU PETIT MARCHE - Dijon (Rue Joseph Bellesoeur)",
                "AUCHAN",
                "AUCHAN DRIVE",
                "Boucherie",
                "BOUCHERIE CHENU DANIEL - Dijon",
                "BOUCHERIE CINAR - Chenôve (Rue Jean Moulin)",
                "BOUCHERIE CINAR - Quétigny ",
                "BOUCHERIE DE LA MEDITERRANEE - Dijon (Rue Docteur Julie)",
                "BOUCHERIE DE LA MEDITERRANEE - Quetigny ",
                "BOUCHERIE LA COTE D'OR - Chenôve ",
                "BOUCHERIE MARRAKECH - Dijon (Avenue Gustave Eiffel) ",
                "BOUCHERIE SAINT SAUVEUR - Chevigny-saint-sauveur",
                "BOUCHERIE-CHARCUTERIE GAUTHIER - Longvic ",
                "Boulangerie",
                "BOULANGERIE DE MARIE BLACHERE - Longvic",
                "BOULANGERIE DE MARIE BLACHERE - Marsannay",
                "BOULANGERIE DE MARIE BLACHERE - Quetigny",
                "Cantine",
                "CARREFOUR",
                "CARREFOUR - Dijon ( Rue Charles Dumont)",
                "CARREFOUR - Dijon (Route de Langres)",
                "CARREFOUR - Dijon (Rue Colonel Charles Flamand)",
                "CARREFOUR - Quetigny ",
                "CARREFOUR - Talant",
                "CARREFOUR CITY - Chevigny-saint-sauveur",
                "CARREFOUR CITY - Dijon (Rue du Transvaal)",
                "CARREFOUR CITY - Dijon (Rue Paul Cabet)",
                "CARREFOUR CITY - Dijon (Rue Bannelier)",
                "CARREFOUR CITY - Dijon (Rue Charles Dumont)",
                "CARREFOUR DRIVE",
                "CARREFOUR EXPRESS - Chenôve",
                "CARREFOUR EXPRESS - Dijon (Avenue Jean Jaures)",
                "CARREFOUR EXPRESS - Dijon (Boulevard Colonel Charles Flamand)",
                "CARREFOUR EXPRESS - Dijon (Rue Angelique Ducoudray)",
                "CARREFOUR EXPRESS - Dijon (Rue Chabot Charny)",
                "CARREFOUR EXPRESS - Dijon (Rue de Longvic)",
                "CARREFOUR EXPRESS - Dijon (Rue de Mirande)",
                "CARREFOUR EXPRESS - Dijon (Rue Devosge)",
                "CARREFOUR EXPRESS - Marsannay",
                "CARREFOUR MARKET - Chevigny-saint-sauveur",
                "CASINO",
                "CASINO - Dijon (Avenue du Drapeau)",
                "CASINO - Dijon (Boulevard Clemenceau)",
                "CASINO - Dijon (Boulevard de Strasbourg)",
                "CASINO - Dijon (Rue D'Auxonne)",
                "CASINO - Dijon (Rue de Jouvence)",
                "CASINO - Dijon (Rue Monge)",
                "CASINO - Dijon (Rue Oderbet)",
                "CASINO DRIVE",
                "CASINO SHOP - Dijon (Avenue de Langres)",
                "CASINO SHOP - Dijon (Rue Jean Jacques Rousseau)",
                "CINEMA",
                "COCCIMARKET",
                "COCCIMARKET - Dijon (Rue Daubenton)",
                "COCCIMARKET - Dijon (Avenue des Gresilles)",
                "COLRUYT",
                "CORA",
                "CORA - Perrigny-Lès-Dijon",
                "CORA DRIVE",
                "COTE & FRAIS - Dijon (Rue Chabot Charny)",
                "Croix rouge",
                "CROUS",
                "CUT MARKET - Dijon (Rue coupée de longvic)",
                "DAY BY DAY MON EPICERIE EN VRAC - Dijon (Place Notre Dame)",
                "DIJON FRUITS - Marsannay ",
                "DIJON PRIMEURS - Dijon (Rue Quentin)",
                "DISTRIBFOODS MARKET - Saint-Apollinaire",
                "Distributeur",
                "Don voisin/ami/famille",
                "EPICAGE 21 (EPICERIE ET CUISINE ANTI-GASPILLAGE) - Fontaine-Lès-Dijon",
                "EPICERIE DE NUIT - Dijon (Rue Monge)",
                "EPICERIE DU LAC - Dijon (Avenue du Lac)",
                "EPICERIE DU QUAI - Dijon (Quai Nicolas Rolin)",
                "EPICERIE MONGE - Dijon (Rue Monge)",
                "Epicerie sociale",
                "EPICERIE VANNERIE - Dijon (Rue Vannerie)",
                "EPIMUT - Quetigny ",
                "EPI'SOURIRE - Dijon(Place Jeacques Prévert)",
                "ESPRIT FRAICHEUR - Dijon (Avenue de l'Ouche) ",
                "EXOTIQUE 21 PONA-BISO - Dijon (Fontaine D'Ouche)",
                "Fast-food",
                "Fins de marché ou poubelles",
                "FRAIS D'ICI - Chenôve",
                "FRANPRIX - Dijon (Rue du Bourg) ",
                "FROMAGER",
                "GEANT",
                "GEANT - Chenôve",
                "GEANT - Fontaine les Dijon",
                "GRAND FRAIS",
                "GRAND FRAIS - Ahuy",
                "GRAND FRAIS - Longvic",
                "GRAND FRAIS - Marsannay ",
                "GRAND FRAIS - Quetigny ",
                "INTERMARCHE",
                "INTERMARCHE - Dijon (Avenue du Drapeau)",
                "INTERMARCHE - Dijon (Avenue Jean Jaurès)",
                "INTERMARCHE - Dijon (Rue Gaston Bachelard)",
                "INTERMARCHE - Dijon Université",
                "INTERMARCHE - Fontaine-Les-Dijon",
                "INTERMARCHE - Longvic",
                "Jardin",
                "LA CORBEILLE AUX SAVEURS - Chevigny-saint-sauveur",
                "LA FONTAINE AUX FRUITS - Fontaine-Les-Dijon",
                "LA RESERVE BIO - Dijon (Avenue Jean Jaures)",
                "LA VIE CLAIRE - Dijon (Rue Pasteur)",
                "LE CŒUR DIJONNAIS - Dijon (Rue Clément Desormes) ",
                "LE FRUITIER SAINT MARTIN - Fontaine-Lès-Dijon",
                "LE GARCON BOUCHER - Chenove",
                "LE GARCON BOUCHER - Dijon (Avenue du Drapeau)",
                "LE MAG - Dijon (Avenue les Grésilles)",
                "LE PETIT MARCHE - Dijon (Avenue du Lac)",
                "LE PETIT MARCHE - Dijon (Boulevard des Martyrs de la Résistance)",
                "LEADER PRICE",
                "L'EAU VIVE - Quétigny ",
                "LECLERC",
                "LECLERC - Dijon (Rue de Cravovie)",
                "LECLERC - Fontaine-Lès-Dijon",
                "LECLERC - Marsannay",
                "LECLERC DRIVE",
                "LECLERC DRIVE - Cap Nord",
                "LECLERC DRIVE - Longvic",
                "LECLERC DRIVE - Quétigny",
                "L'EPICERIE A CARO - Dijon (Avenue Victor Hugo)",
                "LIDL",
                "LIDL - Chevigny-Saint-Sauveur",
                "LIDL - Ahuy",
                "LIDL - Chenôve",
                "LIDL - Daix",
                "LIDL - Neuilly-Crimolois",
                "LIDL - Saint-Apollinaire",
                "LIDL-Dijon (Route de Gray)",
                "LIDL-Dijon (Rue Marcel Sembat)",
                "Livraison à domicile",
                "Marché",
                "Marché de Chenôve",
                "Marché des Grésilles - Dijon",
                "Marché des Halles - Dijon ",
                "Marché du bonheur",
                "Marché du canal - Dijon",
                "MARCHE U - Dijon (Rue Albert et André Claudot)",
                "MAXI MARCHE - Plombières-Lès-Dijon",
                "MES BONNES COURSES - Marsannay",
                "MINI MARKET - Dijon (Rue Berbisey)",
                "MONOPRIX - Dijon (Rue Piron)",
                "NETTO",
                "NIGHT MARKET BERBISEY - Dijon (Rue Berbisey)",
                "O'CAZ BY CASINO - Chenôve ",
                "O'MARKET - Chenôve ",
                "O'MARKET - Dijon (Avenue du lac)",
                "OPEN MARKET - Dijon (Avenue Maréchal Foch)",
                "PETIT CASINO",
                "PETIT CASINO - Dijon (Boulevard de Strasbourg)",
                "PETIT CASINO - Dijon (Rue Barbe)",
                "PETIT CASINO - Dijon (Rue Montchapet)",
                "PETIT CASINO - Dijon (Rue Odebert)",
                "PICARD",
                "PICARD - Chenôve",
                "PICARD - Dijon (Rue Odebert)",
                "PICARD - Fontaine-Lès-Dijon",
                "PICARD - Quetigny",
                "PLACE DU MARCHE - Chevigny-saint-sauveur",
                "PROXI - Dijon (Rue de Mirande)",
                "PROXI - Dijon (Rue Diderot)",
                "PROXIMARCHE - Dijon (Rue Antoine Auguste Cournot)",
                "PROXIMARCHE - Dijon (Rue du Faubourg Raines)",
                "RAMIN MARKET - Dijon (Rue Monge)",
                "Restaurant d'entreprise (sur place)",
                "Restaurant/bar/café (sur place)",
                "Restos du cœur",
                "ROUSSEAU MARKET - Dijon (Rue Jean-Jacques Rousseau)",
                "Secours catholique",
                "Secours populaire",
                "SHOP NIGHT - Dijon (Rue d'Auxonne)",
                "SO.BIO - Perrigny-Les-Dijon",
                "SOVIAL - Dijon (Avenue du Lac)",
                "SPAR",
                "SPAR - Dijon (Avenue Gustave Eiffel)",
                "SPAR - Dijon (Rue de Talant)",
                "SPAR - Dijon (Rue Jacques Cellerier)",
                "SUPECO - Chenôve",
                "SUPER U",
                "SUPER U - Chenôve",
                "SUPER U - Talant",
                "SUPER U DRIVE",
                "SUPERETTE - Dijon (Rue de la Préfecture)",
                "SUPERETTE BERBISEY - Dijon (Rue Berbisey)",
                "SUPERETTE DE DIJON - Dijon (Avenue Jean Jeaures)",
                "SUPERMARCHE CASINO - Quétigny",
                "TERRES BIO - BIOCOOP - Ahuy",
                "TOUPARGEL - Chevigny-saint-sauveur",
                "U EXPRESS - Dijon (Rue Albert et André Claudot)",
                "Vente à emporter",
                "VIVAL",
                "VIVAL - Dijon (Avenue gustave Eiffel)",
                "VIVAL - Dijon (Rue Maurice Ravel)",
                "VIVAL CASINO - Dijon (Avenue Eiffel)",
                "VIVAL CASINO - Dijon (Rue Marceau)",
                "Autre association",
                "Autre don",
                "Autre petit commerce",
                "Autre supermarché",
                "Autre supermarché bio",
                "Autre"
            ];
            lieux.forEach(function (x) {
                var o = document.createElement("option");
                o.value = x;
                selectLieu.appendChild(o);
            });
            var inputLieu = Framework.Form.InputText.Register("inputLieu", self.lieuTicket, Framework.Form.Validator.NotEmpty(), function (lieu) {
                self.lieuTicket = "";
                btnLieuChecked.innerHTML = "!";
                btnLieuChecked.style.background = "red";
                btnContinuer.CheckState();
                for (var i = 0; i < lieux.length; i++) {
                    if (lieux[i] === lieu) {
                        self.lieuTicket = lieu;
                        btnLieuChecked.innerHTML = "<i class='fas fa-check-square'></i>";
                        btnLieuChecked.style.background = "green";
                        //if (["Boulangerie", "Livraison à domicile", "Vente à emporter", "Restos du cœur", "Secours populaire", "Secours catholique", "Croix rouge", "CROUS", "Restaurant/bar/café (sur place)", "Fast-Food (sur place)", "Restaurant d'entreprise (sur place)", "Colis alimentaire en grande surface"].indexOf(lieu) > -1) {
                        divTicketMenu.Show();
                        //} else {
                        //    self.menu = "";
                        //    divTicketMenu.Hide();
                        //}
                        btnContinuer.CheckState();
                        break;
                    }
                }
                //selectLieu.innerHTML = "";
                //let lieuSel = lieux.filter(x => { return x.toLowerCase().indexOf(lieu.toLowerCase()) > -1 });
                //lieuSel.forEach(x => {
                //    let o: HTMLOptionElement = document.createElement("option");
                //    o.value = x;
                //    selectLieu.appendChild(o);
                //});
            });
            var inputTicketMenuO = Framework.Form.CheckBox.Register("inputTicketMenuO", function () { return true; }, function () { self.menu = "Oui"; divTicketPrix.Show(); btnContinuer.CheckState(); }, "");
            var inputTicketMenuN = Framework.Form.CheckBox.Register("inputTicketMenuN", function () { return true; }, function () { self.menu = ""; inputPrix.Set(""); divTicketPrix.Hide(); btnContinuer.CheckState(); }, "");
            var inputPrix = Framework.Form.InputText.Register("inputPrix", "", Framework.Form.Validator.NumberPos("Nombre attendu.", 0), function (prix) {
                self.aliment.PrixMenu = Number(prix.replace(",", "."));
                self.aliment.Prix = -1;
                btnContinuer.CheckState();
            });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return self.dateTicket && self.lieuTicket.length > 3 && (divTicketMenu.IsVisible == false || (divTicketMenu.IsVisible == true && (inputTicketMenuN.IsChecked == true || (inputTicketMenuO.IsChecked == true && inputPrix.IsValid))));
            }, function () {
                self.aliment.Date = self.dateTicket;
                self.aliment.Lieu = self.lieuTicket;
                self.aliment.Menu = self.menu;
                self.showDivDesignation(aliment != undefined);
            });
            var btnVoirFactures = Framework.Form.Button.Register("btnVoirFactures", function () {
                return true;
            }, function () {
                self.showDivFactures();
            });
            //btnVoirFactures.Hide();
            //if (self.questionnaire.Code.charAt(0) == "b") {
            btnVoirFactures.Show();
            //}
        });
    };
    CodAchatsApp.prototype.showDivDetail = function (aliments) {
        var self = this;
        this.show("html/DivDetail.html", function () {
            var divTableFactures = Framework.Form.TextElement.Register("divTableFactures");
            var btnNouveauTicket = Framework.Form.Button.Register("btnFin", function () { return true; }, function () { self.showDivFactures(); });
            var btnSupprimerTicket = Framework.Form.Button.Register("btnSupprimerTicket", function () { return true; }, function () {
                Framework.Modal.Confirm("Confirmation requise", "Etes-vous sûr(e) de vouloir supprimer le ticket ? Tous les aliments seront supprimés.", function () {
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
                Framework.Modal.Confirm("Confirmez vous la suppression ?", "", function () {
                    table.SelectedData.forEach(function (x) {
                        Framework.Array.Remove(self.questionnaire.Aliments, x);
                    });
                    table.Remove(table.SelectedData);
                    self.updateQuestionnaire(function () { });
                });
            };
            table.ListColumns = [];
            table.AddCol("Date", "Date", 100, "left");
            table.AddCol("Lieu", "Lieu", 100, "left");
            table.AddCol("LibelleCIQUAL", "Libellé", 300, "left");
            table.AddCol("LibelleCustom", "Texte libre", 100, "left");
            if (self.questionnaire.Code.charAt(0) == "b") {
                table.AddCol("Categorie1", "Catégorie 1", 100, "left");
                table.AddCol("Categorie2", "Catégorie 2", 100, "left");
            }
            table.AddCol("Unite", "Unité", 75, "left");
            table.AddCol("Nb", "Quantité", 75, "left");
            table.AddCol("Prix", "Prix unitaire", 75, "left");
            table.AddCol("PrixMenu", "Prix (menu)", 75, "left");
            table.AddCol("MontantChequeAlimentaire", "Chèque alimentaire", 75, "left");
            table.AddCol("Labels", "Labels", 75, "left");
            table.AddCol("", "", 50, "left", undefined, undefined, function (x, y) {
                return Framework.Form.Button.Create(function () { return true; }, function () {
                    self.showDivDate(y);
                }, "Edit", ["btn", "btn-sm", "btn-primary"]).HtmlElement;
            });
            table.Render(divTableFactures.HtmlElement);
        });
    };
    CodAchatsApp.prototype.showDivFactures = function () {
        var self = this;
        this.show("html/DivFactures.html", function () {
            var divTableFactures = Framework.Form.TextElement.Register("divTableFactures");
            self.CallWCF('DownloadDataCodAchats', { dir: self.sn, code: self.questionnaire.Code }, function () {
                Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
            }, function (res) {
                Framework.Progress.Hide();
                if (res.Status == 'success') {
                    self.questionnaire = JSON.parse(res.Result);
                    var tickets_1 = [];
                    self.questionnaire.Aliments.forEach(function (x) {
                        var t = tickets_1.filter(function (y) { return y.Date == x.Date && y.Lieu == x.Lieu; });
                        if (t.length == 0) {
                            tickets_1.push(new CodAchatsModels.Ticket(x.Date, x.Lieu));
                        }
                    });
                    var table1 = new Framework.Form.Table();
                    table1.CanSelect = false;
                    table1.ShowFooter = false;
                    table1.ListData = tickets_1;
                    table1.Height = "80vh";
                    table1.FullWidth = true;
                    table1.CanSelect = true;
                    table1.ShowFooter = true;
                    table1.ListColumns = [];
                    table1.AddCol("Date", "Date", 100, "left");
                    table1.AddCol("Lieu", "Lieu", 200, "left");
                    table1.AddCol("", "", 50, "left", undefined, undefined, function (x, y) {
                        return Framework.Form.Button.Create(function () { return true; }, function () {
                            self.showDivDetail(self.questionnaire.Aliments.filter(function (z) { return z.Date == y.Date && z.Lieu == y.Lieu; }));
                        }, "Edit", ["btn", "btn-sm", "btn-primary"]).HtmlElement;
                    });
                    table1.Render(divTableFactures.HtmlElement);
                }
                else {
                    Framework.Modal.Alert("Erreur", res.ErrorMessage);
                }
            });
            var btnNouveauTicket = Framework.Form.Button.Register("btnNouveauTicket", function () { return true; }, function () { self.showDivDate(); });
        });
    };
    CodAchatsApp.prototype.testPrixKg = function () {
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
            if (prixKg > prixmax || prixKg < prixmin) {
                divWarningPrix.SetHtml('<p style="color:red">Le prix au kilo (' + Math.round(prixKg * 100) / 100 + ') est en dehors des bornes habituellement constatées. Veuillez vérifier la quantité, la mesure ou le prix saisi.</p>');
                divWarningPrix.Show();
            }
        }
    };
    CodAchatsApp.prototype.showDivDesignation = function (update) {
        var _this = this;
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
                    btnContinuer.Click();
                }
            };
            if (_this.ti == "1") {
                var valentin = Framework.Form.TextElement.Register("valentin");
                valentin.Show();
            }
            var btnDesignationChecked = document.getElementById("btnDesignationChecked");
            btnDesignationChecked.innerHTML = "!";
            btnDesignationChecked.style.background = "red";
            var kvp = [];
            kvp.push(new Framework.KeyValuePair("Alcool", "Alcool"));
            kvp.push(new Framework.KeyValuePair("Café, thé", "Café, thé"));
            kvp.push(new Framework.KeyValuePair("Céréales pour petit déjeuner", "Céréales pour petit déjeuner"));
            kvp.push(new Framework.KeyValuePair("Charcuterie (hors jambon blanc)", "Charcuterie (hors jambon blanc)"));
            kvp.push(new Framework.KeyValuePair("Dessert lacté", "Dessert lacté"));
            kvp.push(new Framework.KeyValuePair("Eau", "Eau"));
            kvp.push(new Framework.KeyValuePair("Epice ou condiment", "Epice ou condiment"));
            kvp.push(new Framework.KeyValuePair("Féculent non raffiné", "Féculent non raffiné"));
            kvp.push(new Framework.KeyValuePair("Féculent raffiné", "Féculent raffiné"));
            kvp.push(new Framework.KeyValuePair("Fromage", "Fromage"));
            kvp.push(new Framework.KeyValuePair("Fruit", "Fruit"));
            kvp.push(new Framework.KeyValuePair("Fruit sec", "Fruit sec"));
            kvp.push(new Framework.KeyValuePair("Jus de fruit", "Jus de fruit"));
            kvp.push(new Framework.KeyValuePair("Jambon blanc", "Jambon blanc"));
            kvp.push(new Framework.KeyValuePair("Lait", "Lait"));
            kvp.push(new Framework.KeyValuePair("Laitage", "Laitage"));
            kvp.push(new Framework.KeyValuePair("Légume", "Légume"));
            kvp.push(new Framework.KeyValuePair("Légume sec", "Légume sec"));
            kvp.push(new Framework.KeyValuePair("Matière grasse animale", "Matière grasse animale"));
            kvp.push(new Framework.KeyValuePair("Matière grasse végétale", "Matière grasse végétale"));
            kvp.push(new Framework.KeyValuePair("Noix", "Noix"));
            kvp.push(new Framework.KeyValuePair("Oeuf", "Oeuf"));
            kvp.push(new Framework.KeyValuePair("Plat préparé carné", "Plat préparé carné"));
            kvp.push(new Framework.KeyValuePair("Plat préparé végétarien", "Plat préparé végétarien"));
            kvp.push(new Framework.KeyValuePair("Poisson", "Poisson"));
            kvp.push(new Framework.KeyValuePair("Porc", "Porc"));
            kvp.push(new Framework.KeyValuePair("Poulet", "Poulet"));
            kvp.push(new Framework.KeyValuePair("Produit sucré", "Produit sucré"));
            kvp.push(new Framework.KeyValuePair("Quiche, pizza, tarte salée", "Quiche, pizza, tarte salée"));
            kvp.push(new Framework.KeyValuePair("Sauce", "Sauce"));
            kvp.push(new Framework.KeyValuePair("Snack", "Snack"));
            kvp.push(new Framework.KeyValuePair("Soda light", "Soda light"));
            kvp.push(new Framework.KeyValuePair("Soda sucré", "Soda sucré"));
            kvp.push(new Framework.KeyValuePair("Viande rouge", "Viande rouge"));
            kvp.push(new Framework.KeyValuePair("Autre", "Autre"));
            var kvp2 = [];
            kvp2.push(new Framework.KeyValuePair("Produits frais", "Produits frais"));
            kvp2.push(new Framework.KeyValuePair("Viande", "Viande"));
            kvp2.push(new Framework.KeyValuePair("Surgelés", "Surgelés"));
            kvp2.push(new Framework.KeyValuePair("Conserves", "Conserves"));
            kvp2.push(new Framework.KeyValuePair("Epicerie", "Epicerie"));
            kvp2.push(new Framework.KeyValuePair("Epicerie salée", "Epicerie salée"));
            kvp2.push(new Framework.KeyValuePair("Epicerie sucrée", "Epicerie sucrée"));
            kvp2.push(new Framework.KeyValuePair("Produits laitiers", "Produits laitiers"));
            kvp2.push(new Framework.KeyValuePair("Fruits et légumes", "Fruits et légumes"));
            kvp2.push(new Framework.KeyValuePair("Divers", "Divers"));
            var selectFoodCategory = Framework.Form.Select.Register("selectFoodCategory", self.aliment.Categorie1, kvp, Framework.Form.Validator.NoValidation(), function (val) {
                if (val != "") {
                    self.aliment.LibelleCIQUAL = "";
                    self.aliment.CodeCIQUAL = "";
                    inputDesignation.Set("");
                }
                self.aliment.Categorie1 = val;
                self.aliment.Categorie2 = "";
                selectFoodCategory2.HtmlElement.value = "";
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
            var selectFoodCategory2 = Framework.Form.Select.Register("selectFoodCategory2", self.aliment.Categorie2, kvp2, Framework.Form.Validator.NoValidation(), function (val) {
                if (val != "") {
                    self.aliment.LibelleCIQUAL = "";
                    self.aliment.CodeCIQUAL = "";
                    inputDesignation.Set("");
                }
                self.aliment.Categorie1 = "";
                self.aliment.Categorie2 = val;
                selectFoodCategory.HtmlElement.value = "";
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
            var selectAliment = document.getElementById("selectAliment");
            self.aliments.filter(function (x) {
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
                o.value = x.DesignationModifiee;
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
                var sel = self.aliments.filter(function (x) { return x.DesignationModifiee == realDesignation; });
                if (sel.length > 0) {
                    inputDesignation.SetWithoutValidation(realDesignation);
                    self.aliment.LibelleCIQUAL = sel[0].DesignationModifiee;
                    self.aliment.CodeCIQUAL = sel[0].alim_code_codachats;
                    self.aliment.PrixMin = sel[0].min_5_magasins;
                    self.aliment.PrixMax = sel[0].max_95_magasins;
                    self.aliment.PrixMinEpicerie = sel[0].min_5_magasins_sol;
                    self.aliment.PrixMaxEpicerie = sel[0].max_95_magasins_sol;
                    self.aliment.PoidsUnitaire = sel[0].poids_unitaire;
                    self.aliment.Categorie1 = sel[0].gpe_TI;
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
                //self.aliment.LibelleCustom = "";
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
            });
            var lib2 = "";
            if (self.aliment.LibelleCustom) {
                lib2 = self.aliment.LibelleCustom;
            }
            var inputDesignation2 = Framework.Form.InputText.Register("inputDesignation2", lib2, Framework.Form.Validator.MinLength(4), function (designation) {
                self.aliment.Categorie1 = "";
                self.aliment.Categorie2 = "";
                //self.aliment.LibelleCIQUAL = "";
                self.aliment.LibelleCustom = designation;
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
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
                btnContinuer.CheckState();
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
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
            var divPrix = Framework.Form.TextElement.Register("divPrix");
            if (self.menu != "") {
                divPrix.Hide();
            }
            var inputBio = Framework.Form.CheckBox.Register("inputBio", function () { return true; }, function () { }, "");
            var inputAocAop = Framework.Form.CheckBox.Register("inputAocAop", function () { return true; }, function () { }, "");
            var inputLabelRouge = Framework.Form.CheckBox.Register("inputLabelRouge", function () { return true; }, function () { }, "");
            var inputPecheDurable = Framework.Form.CheckBox.Register("inputPecheDurable", function () { return true; }, function () { }, "");
            var inputCommerceEquitable = Framework.Form.CheckBox.Register("inputCommerceEquitable", function () { return true; }, function () { }, "");
            var inputAutre = Framework.Form.CheckBox.Register("inputAutre", function () { return true; }, function () { }, "");
            var inputJamaisGoute = Framework.Form.CheckBox.Register("inputJamaisGoute", function () { return true; }, function () {
                rating.Clear();
                if (inputJamaisGoute.IsChecked) {
                    self.aliment.Appreciation = 0;
                }
                else {
                    self.aliment.Appreciation = -1;
                }
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");
            var inputPasAchete = Framework.Form.CheckBox.Register("inputPasAchete", function () { return true; }, function () {
                if (inputPasAchete.IsChecked) {
                    inputPrix.Set("");
                    self.aliment.Prix = -1;
                }
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");
            var inputPasPoids = Framework.Form.CheckBox.Register("inputPasPoids", function () { return true; }, function () {
                if (inputPasPoids.IsChecked) {
                    inputPoids.Set("");
                    self.aliment.PoidsUnitaire = -1;
                }
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");
            var rating = Framework.Rating.Render(document.getElementById("divLikingRank"), "", 1, 5, self.aliment.Appreciation, function (x) {
                self.aliment.Appreciation = x;
                inputJamaisGoute.Uncheck();
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 != "" || self.aliment.Categorie2 != "" || (self.aliment.LibelleCustom && self.aliment.LibelleCustom.length > 3)) && (inputPoids.IsValid || inputPasPoids.IsChecked) && (inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") /*&& self.aliment.Appreciation >= 0*/;
            }, function () {
                self.aliment.Labels = [];
                self.aliment.DateModif = new Date(Date.now()).toLocaleDateString('en-CA');
                if (inputBio.IsChecked) {
                    self.aliment.Labels.push("Bio");
                }
                ;
                if (inputAocAop.IsChecked) {
                    self.aliment.Labels.push("AOC/AOP");
                }
                ;
                if (inputLabelRouge.IsChecked) {
                    self.aliment.Labels.push("Label rouge");
                }
                ;
                if (inputPecheDurable.IsChecked) {
                    self.aliment.Labels.push("Pêche durable");
                }
                ;
                if (inputCommerceEquitable.IsChecked) {
                    self.aliment.Labels.push("Commerce équitable");
                }
                ;
                if (inputAutre.IsChecked) {
                    self.aliment.Labels.push("Autre");
                }
                ;
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
                if (inputBio.IsChecked) {
                    self.aliment.Labels.push("Bio");
                }
                ;
                if (inputAocAop.IsChecked) {
                    self.aliment.Labels.push("AOC/AOP");
                }
                ;
                if (inputLabelRouge.IsChecked) {
                    self.aliment.Labels.push("Label rouge");
                }
                ;
                if (inputPecheDurable.IsChecked) {
                    self.aliment.Labels.push("Pêche durable");
                }
                ;
                if (inputCommerceEquitable.IsChecked) {
                    self.aliment.Labels.push("Commerce équitable");
                }
                ;
                if (inputAutre.IsChecked) {
                    self.aliment.Labels.push("Autre");
                }
                ;
                self.saveQuestionnaire(function () {
                    self.showEnregistrementConfirme(function () { self.showDivDate(); });
                });
            });
            var btnTerminer = Framework.Form.Button.Register("btnTerminer", function () {
                return true;
            }, function () {
                if ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 || self.aliment.Categorie2 || self.aliment.LibelleCustom || inputPoids.IsValid || inputPasPoids.IsChecked || inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") {
                    Framework.Modal.Confirm("Confirmation requise", "Les changements ne seront pas enregistrés.<br/>Etes-vous sûr(e) de vouloir quitter cet écran ?<br/>Si non, cliquez sur le bouton 'Nouvel aliment' pour enregister les changements.", function () { self.showDivLogin(); });
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
            if (update == true) {
                btnContinuer.SetInnerHTML("Modifier");
                btnNouveauTicket.Hide();
                btnTerminer.Hide();
            }
        });
    };
    CodAchatsApp.prototype.showEnregistrementConfirme = function (action) {
        this.show("html/DivEnregistre.html", function () {
            setTimeout(function () {
                action();
            }, 1000);
        });
    };
    return CodAchatsApp;
}(Framework.App));
//# sourceMappingURL=app.js.map