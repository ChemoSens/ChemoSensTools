class CodAchatsApp extends Framework.App {

    private questionnaire: CodAchatsModels.QuestionnaireCodAchats;
    private lieuTicket: string = "";
    private unite: string = "grammes";
    private aliments;

    private dateTicket: string = new Date(Date.now()).toLocaleDateString('en-CA');
    private aliment: CodAchatsModels.Aliment;
    private menu: string = "";

    private sn: string = "";
    private ti: string = "";
    private login: string = "";

    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/codappro';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
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
    }

    constructor(isInTest: boolean = false) {
        super(CodAchatsApp.GetRequirements(), isInTest);
    }

    protected onError(error: string) {
        super.onError(error);
    }

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);

        this.sn = Framework.Browser.GetUrlParameter("sn"); // Code de l'étude
        this.ti = Framework.Browser.GetUrlParameter("v"); // Affichage spécifique valentin
        let admin = Framework.Browser.GetUrlParameter("admin"); // Id admin
        this.login = Framework.Browser.GetUrlParameter("login"); // login

        if (this.sn == "") {
            this.sn = "a";
        }


        if (admin != "") {
            this.showDivLoginAdmin(admin);
        } else {
            this.showDivLogin();
        }

    }

    private saveQuestionnaire(f: Function) {
        let self = this;
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


        self.CallWCF('SaveQuestionnaireCodAchats', { code: self.questionnaire.Code, dir: self.sn, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, () => {
            Framework.Progress.Show("Enregistrement...");
        }, (res) => {
            Framework.Progress.Hide();
            if (res.Status == 'success') {
                f();
                //self.showDivChoix();
                //self.showDivDesignation();
            } else {
                Framework.Modal.Alert("Erreur", "Une erreur a eu lieu pendant l'enregistrement du fichier.", () => {
                    f();
                    //self.showDivChoix();
                    //self.showDivDesignation();
                })
            }

        });

    }

    private updateQuestionnaire(f: Function) {
        let self = this;

        self.CallWCF('SaveQuestionnaireCodAchats', { code: self.questionnaire.Code, dir: self.sn, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, () => {
            Framework.Progress.Show("Enregistrement...");
        }, (res) => {

            Framework.Progress.Hide();
            if (res.Status == 'success') {
                f();
            } else {
                Framework.Modal.Alert("Erreur", "Une erreur a eu lieu pendant l'enregistrement du fichier.", () => {
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
                    btnLogin.Click();
                }
            }

            let inputPassword = Framework.Form.InputText.Register("inputPassword", "", Framework.Form.Validator.MinLength(4), () => {
                btnLogin.CheckState();
                btnImporter.CheckState();
            }, true);



            let btnLogin = Framework.Form.Button.Register("btnLogin", () => {
                return inputPassword.IsValid;
            }, () => {

                let obj = {
                    login: admin,
                    password: inputPassword.Value,
                    dir: self.sn
                }

                self.CallWCF('DownloadQuestionnaireCodAchats', obj, () => {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                }, (res) => {

                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        Framework.FileHelper.SaveBase64As(res.Result, "resultats_codachats.xlsx");
                    } else {
                        Framework.Modal.Alert("Erreur", res.ErrorMessage);
                    }

                });


            });

            let btnImporter = Framework.Form.Button.Register("btnImporter", () => { return inputPassword.IsValid; }, () => {
                Framework.FileHelper.BrowseBinaries("xlsx", (binaries: string) => {
                    self.CallWCF('ImportQuestionnaireCodAchats', { data: binaries, sn: self.sn, login: admin, password: inputPassword.Value }, () => {
                        Framework.Progress.Show("Import en cours");
                    }, (res) => {
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
                        } else {
                            Framework.Modal.Alert("Message", "Erreur pendant le téléversement");
                        }
                    });
                });
            })



        });

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
                login = Framework.LocalStorage.GetFromLocalStorage("codachats_id", true);
                if (login == null || login == undefined) {
                    login = "";
                }                
            }

            let inputLoginId = Framework.Form.InputText.Register("inputLoginId", login, Framework.Form.Validator.MinLength(5), () => {
                btnLogin.CheckState();
            }, true);

            //let inputLoginPassword = Framework.Form.InputText.Register("inputLoginPassword", "", Framework.Form.Validator.MinLength(4), () => {
            //    btnLogin.CheckState();
            //}, true);

            let divLoginError = Framework.Form.TextElement.Register("divLoginError");

            let btnLogin = Framework.Form.Button.Register("btnLogin", () => {
                return inputLoginId.IsValid /*&& inputLoginPassword.IsValid*/;
            }, () => {

                let obj = {
                    code: inputLoginId.Value,
                    sn: self.sn
                }

                self.CallWCF('LoginCodAchats', obj, () => {
                    Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                }, (res) => {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        try {
                            Framework.LocalStorage.SaveToLocalStorage("codachats_id", inputLoginId.Value, true);
                        } catch {

                        }
                        self.questionnaire = JSON.parse(res.Result);

                        self.CallWCF('ClassifieurCiqualCodachats', { txt: "" }, () => {
                            Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
                        }, (res) => {
                            Framework.Progress.Hide();
                            let json = res.Result;
                            self.aliments = JSON.parse(json);
                            self.showDivDate();
                        });


                        //
                    } else {
                        divLoginError.SetHtml(res.ErrorMessage);
                        divLoginError.Show();
                    }
                });


            });

            if (self.login != "") {
                btnLogin.Click();
            }

        });

    }

    private showDivDate(aliment: CodAchatsModels.Aliment = undefined) {

        let self = this;

        if (aliment == undefined) {
            self.aliment = new CodAchatsModels.Aliment();
            self.aliment.Unite = "grammes";
            self.aliment.Date = self.dateTicket;
            self.aliment.LibelleCIQUAL = "";
            self.aliment.Menu = "";
        } else {
            self.aliment = aliment;
            self.dateTicket = self.aliment.Date;
            self.lieuTicket = self.aliment.Lieu;
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

                    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)

                    let fn = self.questionnaire.Code + "_" + timeStamp;                    
                    self.CallWCF('TeleverseImageCodAppro', { base64string: base64, filename: fn }, () => { }, (res) => {
                        self.aliment.Image = fn;
                        if (res.Status == "success") {
                            mw.Close();
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


            if (this.ti == "1") {
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

            let inputDate = Framework.Form.InputText.Register("inputDate", self.dateTicket, Framework.Form.Validator.NoValidation(), (date: string) => {
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

            let lieux: string[] = ["ACTION",
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
]
            lieux.forEach(x => {

                let o: HTMLOptionElement = document.createElement("option");
                o.value = x;
                selectLieu.appendChild(o);
            });

            let inputLieu = Framework.Form.InputText.Register("inputLieu", self.lieuTicket, Framework.Form.Validator.NotEmpty(), (lieu: string) => {

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


            let inputTicketMenuO = Framework.Form.CheckBox.Register("inputTicketMenuO", () => { return true }, () => { self.menu = "Oui"; divTicketPrix.Show(); btnContinuer.CheckState(); }, "");
            let inputTicketMenuN = Framework.Form.CheckBox.Register("inputTicketMenuN", () => { return true }, () => { self.menu = ""; inputPrix.Set(""); divTicketPrix.Hide(); btnContinuer.CheckState(); }, "");

            let inputPrix = Framework.Form.InputText.Register("inputPrix", "", Framework.Form.Validator.NumberPos("Nombre attendu.", 0), (prix: string) => {
                self.aliment.PrixMenu = Number(prix.replace(",", "."));
                self.aliment.Prix = -1;
                btnContinuer.CheckState();
            });

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return self.dateTicket && self.lieuTicket.length > 3 && (divTicketMenu.IsVisible == false || (divTicketMenu.IsVisible == true && (inputTicketMenuN.IsChecked == true || (inputTicketMenuO.IsChecked == true && inputPrix.IsValid))));
            }, () => {
                self.aliment.Date = self.dateTicket;
                self.aliment.Lieu = self.lieuTicket;
                self.aliment.Menu = self.menu;
                self.showDivDesignation(aliment != undefined);
            })

            let btnVoirFactures = Framework.Form.Button.Register("btnVoirFactures", () => {
                return true;
            }, () => {
                self.showDivFactures();
            })

            //btnVoirFactures.Hide();
            //if (self.questionnaire.Code.charAt(0) == "b") {
            btnVoirFactures.Show();
            //}

        });
    }

    private showDivDetail(aliments: CodAchatsModels.Aliment[]) {
        let self = this;
        this.show("html/DivDetail.html", () => {

            let divTableFactures = Framework.Form.TextElement.Register("divTableFactures");
            let btnNouveauTicket = Framework.Form.Button.Register("btnFin", () => { return true; }, () => { self.showDivFactures(); })

            let btnSupprimerTicket = Framework.Form.Button.Register("btnSupprimerTicket", () => { return true; }, () => {

                Framework.Modal.Confirm("Confirmation requise", "Etes-vous sûr(e) de vouloir supprimer le ticket ? Tous les aliments seront supprimés.", () => {
                    aliments.forEach(x => {
                        Framework.Array.Remove(self.questionnaire.Aliments, x)
                    });
                    self.updateQuestionnaire(() => { self.showDivFactures(); });
                })
            })





            let table: Framework.Form.Table<CodAchatsModels.Aliment> = new Framework.Form.Table<CodAchatsModels.Aliment>();
            table.CanSelect = false;
            table.ShowFooter = false;
            table.ListData = aliments;
            table.Height = "80vh";
            table.FullWidth = true;
            table.CanSelect = true;
            table.ShowFooter = true;
            table.RemoveFunction = () => {
                Framework.Modal.Confirm("Confirmez vous la suppression ?", "", () => {

                    table.SelectedData.forEach(x => {
                        Framework.Array.Remove(self.questionnaire.Aliments, x)
                    });

                    table.Remove(table.SelectedData);

                    self.updateQuestionnaire(() => { });
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

            table.AddCol("", "", 50, "left", undefined, undefined, (x, y) => {
                return Framework.Form.Button.Create(() => { return true }, () => {
                    self.showDivDate(y);
                }, "Edit", ["btn", "btn-sm", "btn-primary"]).HtmlElement;
            })
            table.Render(divTableFactures.HtmlElement);
        }
        );
    }

    private showDivFactures() {

        let self = this;

        this.show("html/DivFactures.html", () => {

            let divTableFactures = Framework.Form.TextElement.Register("divTableFactures");

            self.CallWCF('DownloadDataCodAchats', { dir: self.sn, code: self.questionnaire.Code }, () => {
                Framework.Progress.Show(Framework.LocalizationManager.Get("Connexion..."));
            }, (res) => {
                Framework.Progress.Hide();
                if (res.Status == 'success') {

                    self.questionnaire = JSON.parse(res.Result);

                    let tickets: CodAchatsModels.Ticket[] = [];

                    self.questionnaire.Aliments.forEach((x) => {
                        let t = tickets.filter(y => y.Date == x.Date && y.Lieu == x.Lieu);
                        if (t.length == 0) {
                            tickets.push(new CodAchatsModels.Ticket(x.Date, x.Lieu));
                        }
                    });




                    let table1: Framework.Form.Table<CodAchatsModels.Ticket> = new Framework.Form.Table<CodAchatsModels.Ticket>();
                    table1.CanSelect = false;
                    table1.ShowFooter = false;
                    table1.ListData = tickets;
                    table1.Height = "80vh";
                    table1.FullWidth = true;
                    table1.CanSelect = true;
                    table1.ShowFooter = true;
                    table1.ListColumns = [];
                    table1.AddCol("Date", "Date", 100, "left");
                    table1.AddCol("Lieu", "Lieu", 200, "left");
                    table1.AddCol("", "", 50, "left", undefined, undefined, (x, y) => {
                        return Framework.Form.Button.Create(() => { return true }, () => {
                            self.showDivDetail(self.questionnaire.Aliments.filter(z => z.Date == y.Date && z.Lieu == y.Lieu));
                        }, "Edit", ["btn", "btn-sm", "btn-primary"]).HtmlElement;
                    })
                    table1.Render(divTableFactures.HtmlElement);




                } else {
                    Framework.Modal.Alert("Erreur", res.ErrorMessage);
                }
            });

            let btnNouveauTicket = Framework.Form.Button.Register("btnNouveauTicket", () => { return true; }, () => { self.showDivDate(); })

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
            if (prixKg > prixmax || prixKg < prixmin) {
                divWarningPrix.SetHtml('<p style="color:red">Le prix au kilo (' + Math.round(prixKg * 100) / 100 + ') est en dehors des bornes habituellement constatées. Veuillez vérifier la quantité, la mesure ou le prix saisi.</p>')
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
                    btnContinuer.Click();
                }
            }

            if (this.ti == "1") {
                let valentin = Framework.Form.TextElement.Register("valentin");
                valentin.Show();
            }

            let btnDesignationChecked = <HTMLButtonElement>document.getElementById("btnDesignationChecked");
            btnDesignationChecked.innerHTML = "!";
            btnDesignationChecked.style.background = "red";

            let kvp: Framework.KeyValuePair[] = [];
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

            let kvp2: Framework.KeyValuePair[] = [];
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

            let selectFoodCategory = Framework.Form.Select.Register("selectFoodCategory", self.aliment.Categorie1, kvp, Framework.Form.Validator.NoValidation(), (val) => {
                if (val != "") {
                    self.aliment.LibelleCIQUAL = "";
                    self.aliment.CodeCIQUAL = "";
                    inputDesignation.Set("");
                }
                self.aliment.Categorie1 = val;
                self.aliment.Categorie2 = "";
                (<HTMLSelectElement>selectFoodCategory2.HtmlElement).value = "";

                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

            let selectFoodCategory2 = Framework.Form.Select.Register("selectFoodCategory2", self.aliment.Categorie2, kvp2, Framework.Form.Validator.NoValidation(), (val) => {
                if (val != "") {
                    self.aliment.LibelleCIQUAL = "";
                    self.aliment.CodeCIQUAL = "";
                    inputDesignation.Set("");
                }
                self.aliment.Categorie1 = "";
                self.aliment.Categorie2 = val;
                (<HTMLSelectElement>selectFoodCategory.HtmlElement).value = "";

                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

            let selectAliment = <HTMLDataListElement>document.getElementById("selectAliment");

            self.aliments.filter(x => {
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
                o.value = x.DesignationModifiee;
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

                let sel = self.aliments.filter(x => { return x.DesignationModifiee == realDesignation });
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
                //self.aliment.LibelleCustom = "";
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();

            });

            let lib2 = "";
            if (self.aliment.LibelleCustom) {
                lib2 = self.aliment.LibelleCustom;
            }

            let inputDesignation2 = Framework.Form.InputText.Register("inputDesignation2", lib2, Framework.Form.Validator.MinLength(4), (designation: string) => {

                self.aliment.Categorie1 = "";
                self.aliment.Categorie2 = "";
                //self.aliment.LibelleCIQUAL = "";
                self.aliment.LibelleCustom = designation;
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

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
                btnContinuer.CheckState();
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
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

            let divPrix = Framework.Form.TextElement.Register("divPrix");
            if (self.menu != "") {
                divPrix.Hide();
            }

            let inputBio = Framework.Form.CheckBox.Register("inputBio", () => { return true }, () => { }, "");
            let inputAocAop = Framework.Form.CheckBox.Register("inputAocAop", () => { return true }, () => { }, "");
            let inputLabelRouge = Framework.Form.CheckBox.Register("inputLabelRouge", () => { return true }, () => { }, "");
            let inputPecheDurable = Framework.Form.CheckBox.Register("inputPecheDurable", () => { return true }, () => { }, "");
            let inputCommerceEquitable = Framework.Form.CheckBox.Register("inputCommerceEquitable", () => { return true }, () => { }, "");
            let inputAutre = Framework.Form.CheckBox.Register("inputAutre", () => { return true }, () => { }, "");

            let inputJamaisGoute = Framework.Form.CheckBox.Register("inputJamaisGoute", () => { return true }, () => {
                rating.Clear();
                if (inputJamaisGoute.IsChecked) {
                    self.aliment.Appreciation = 0;
                } else {
                    self.aliment.Appreciation = -1;
                }
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");

            let inputPasAchete = Framework.Form.CheckBox.Register("inputPasAchete", () => { return true }, () => {
                if (inputPasAchete.IsChecked) {
                    inputPrix.Set("");
                    self.aliment.Prix = -1;
                }
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");

            let inputPasPoids = Framework.Form.CheckBox.Register("inputPasPoids", () => { return true }, () => {
                if (inputPasPoids.IsChecked) {
                    inputPoids.Set("");
                    self.aliment.PoidsUnitaire = -1;
                }
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            }, "");

            let rating = Framework.Rating.Render(document.getElementById("divLikingRank"), "", 1, 5, self.aliment.Appreciation, (x) => {
                self.aliment.Appreciation = x;
                inputJamaisGoute.Uncheck();
                btnContinuer.CheckState();
                btnNouveauTicket.CheckState();
                btnTerminerEnregistrer.CheckState();
            });

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 != "" || self.aliment.Categorie2 != "" || (self.aliment.LibelleCustom && self.aliment.LibelleCustom.length > 3)) && (inputPoids.IsValid || inputPasPoids.IsChecked) && (inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") /*&& self.aliment.Appreciation >= 0*/;
            }, () => {

                self.aliment.Labels = [];
                self.aliment.DateModif = new Date(Date.now()).toLocaleDateString('en-CA');
                if (inputBio.IsChecked) { self.aliment.Labels.push("Bio") };
                if (inputAocAop.IsChecked) { self.aliment.Labels.push("AOC/AOP") };
                if (inputLabelRouge.IsChecked) { self.aliment.Labels.push("Label rouge") };
                if (inputPecheDurable.IsChecked) { self.aliment.Labels.push("Pêche durable") };
                if (inputCommerceEquitable.IsChecked) { self.aliment.Labels.push("Commerce équitable") };
                if (inputAutre.IsChecked) { self.aliment.Labels.push("Autre") };

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
                if (inputBio.IsChecked) { self.aliment.Labels.push("Bio") };
                if (inputAocAop.IsChecked) { self.aliment.Labels.push("AOC/AOP") };
                if (inputLabelRouge.IsChecked) { self.aliment.Labels.push("Label rouge") };
                if (inputPecheDurable.IsChecked) { self.aliment.Labels.push("Pêche durable") };
                if (inputCommerceEquitable.IsChecked) { self.aliment.Labels.push("Commerce équitable") };
                if (inputAutre.IsChecked) { self.aliment.Labels.push("Autre") };
                self.saveQuestionnaire(() => {
                    self.showEnregistrementConfirme(() => { self.showDivDate(); })

                });
            })


            let btnTerminer = Framework.Form.Button.Register("btnTerminer", () => {
                return true;
            }, () => {

                if ((self.aliment.LibelleCIQUAL && self.aliment.LibelleCIQUAL.length > 0) || self.aliment.Categorie1 || self.aliment.Categorie2 || self.aliment.LibelleCustom || inputPoids.IsValid || inputPasPoids.IsChecked || inputPrix.IsValid || inputPasAchete.IsChecked || self.menu != "") {
                    Framework.Modal.Confirm("Confirmation requise", "Les changements ne seront pas enregistrés.<br/>Etes-vous sûr(e) de vouloir quitter cet écran ?<br/>Si non, cliquez sur le bouton 'Nouvel aliment' pour enregister les changements.", () => { self.showDivLogin() });
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

            if (update == true) {
                btnContinuer.SetInnerHTML("Modifier");
                btnNouveauTicket.Hide();
                btnTerminer.Hide();
            }

        });
    }

    private showEnregistrementConfirme(action: () => void) {

        this.show("html/DivEnregistre.html", () => {
            setTimeout(() => {
                action();
            }, 1000);
        });

    }

}


