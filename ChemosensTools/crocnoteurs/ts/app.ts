declare var ScanditSDK
declare var chrome
declare var Dynamsoft
declare var Webcam

class DataSensInscriptionApp extends Framework.App {



    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/crocnoteurs';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
            requirements.AppUrl = 'https://www.chemosenstools.com/crocnoteurs';
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


        //requirements.Extensions = ["Rating", "Slider"];
        return requirements;
    }

    constructor(isInTest: boolean = false) {
        super(DataSensInscriptionApp.GetRequirements(), isInTest);
    }

    protected onError(error: string) {
        super.onError(error);
    }

    private showDiv(htmlPath: string, onLoaded: () => void) {

        let self = this;

        document.body.innerHTML = "";
        let path = DataSensInscriptionApp.GetRequirements().AppUrl + "/" + htmlPath;
        Framework.BaseView.Load(path, "body", (div) => {
            onLoaded();
        });
    }

    private inscription: Models.InscriptionSensas;
    //private questionnaire: Models.QuestionnaireSensas;

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);
        let self = this;

        self.inscription = new Models.InscriptionSensas();
        //self.questionnaire = new Models.QuestionnaireSensas();




        this.showDivInscription1a();
    }

    private showDivInscription1a() {
        let self = this;
        self.showDiv("html/divInscription1a.html", () => {
            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true
            }, () => {
                self.showDivInscription1b();
            })
        });
    }

    private showDivInscription1b() {
        let self = this;
        self.showDiv("html/divInscription1b.html", () => {
            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true
            }, () => {
                self.showDivInscription1c();
            })
        });
    }

    private showDivInscription1c() {
        let self = this;
        self.showDiv("html/divInscription1c.html", () => {
            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true
            }, () => {
                self.showDivInscription1d();
            })
        });
    }

    private showDivInscription1d() {
        let self = this;
        self.showDiv("html/divInscription1d.html", () => {
            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true
            }, () => {
                self.showDivInscription1e();
            })
        });
    }

    private showDivInscription1e() {
        let self = this;
        self.showDiv("html/divInscription1e.html", () => {
            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true
            }, () => {
                self.showDivInscription1f();
            })
        });
    }

    private showDivInscription1f() {
        let self = this;
        self.showDiv("html/divInscription1f.html", () => {

            let pTest = Framework.Form.TextElement.Register("pTest");

            let btnTest = Framework.Form.Button.Register("btnTest", () => {
                return true
            }, () => {
                self.inscription.TestNavigateur = 1;
                pTest.Show();
                btnTest.Hide();
            })

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true
            }, () => {
                self.showDivInscription1g();
            })
        });
    }

    private showDivInscription1g() {
        let self = this;
        self.showDiv("html/divInscription1g.html", () => {



            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true
            }, () => {
                self.showDivInscription2();
            })
        });
    }

    private showDivInscription2() {
        let self = this;
        self.showDiv("html/divInscription2.html", () => {

            let input18 = Framework.Form.CheckBox.Register("input18", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            //let inputInfos = Framework.Form.CheckBox.Register("inputInfos", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            //let inputInfos1 = Framework.Form.CheckBox.Register("inputInfos1", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            //let inputInfos2 = Framework.Form.CheckBox.Register("inputInfos2", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            let inputInfos3 = Framework.Form.CheckBox.Register("inputInfos3", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            let inputInfos4 = Framework.Form.CheckBox.Register("inputInfos4", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            //let inputInfos5 = Framework.Form.CheckBox.Register("inputInfos5", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            //let inputInfos6 = Framework.Form.CheckBox.Register("inputInfos6", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {

                return input18.IsChecked && inputInfos3.IsChecked == true && inputInfos4.IsChecked == true;
            }, () => {
                self.showDivInscription2a();
            })

        });
    }

    private showDivInscription2a() {
        let self = this;
        self.showDiv("html/divInscription2a.html", () => {

            let tConditions = Framework.Form.InputText.Register("tConditions", "", Framework.Form.Validator.NoValidation(), (txt: string) => {
                self.inscription.TexteConditions = txt;

                txt = txt.toLowerCase();
                if (txt.indexOf("cepte") > -1 && txt.indexOf("condition") > -1) {
                    self.inscription.AccepteConditions = 1;
                }
            });

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {
                self.showDivInscription4();
            })

        });
    }

    private showDivInscription2b() {
        let self = this;
        self.showDiv("html/divInscription2b.html", () => {

            let base64 = undefined;

            let recorder = new Framework.PhotoRecorder(document.getElementById("btnPhoto"), document.getElementById("video"));
            recorder.OnSave = (b64) => {
                base64 = b64;
                btnContinuer.CheckState();
            };

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return base64 != undefined;
            }, () => {

                //// Enregistrement

                let dt = new Date().getTime();
                self.inscription.UUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (dt + Math.random() * 16) % 16 | 0;
                    dt = Math.floor(dt / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });

                self.CallWCF('TeleverseImageDataSens', { base64string: base64, dir: "justificatifs", filename: self.inscription.UUID }, () => { }, (res) => {
                    if (res.Status == "success") {
                        self.showDivInscription3();
                    } else {
                        Framework.Modal.Alert("Erreur", "Le justificatif n'a pas été téléversé.");
                    }
                });


            });





        });
    }

    private showDivInscription3() {
        let self = this;
        self.showDiv("html/divInscription3.html", () => {

            //let divResultat = Framework.Form.TextElement.Register("divResultat");

            //let inputMail = Framework.Form.InputText.Register("inputMail", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), (mail) => { btnContinuer.CheckState(); });

            //let inputMail2 = Framework.Form.InputText.Register("inputMail2", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), (mail) => { btnContinuer.CheckState(); });

            let inputAdresse = Framework.Form.InputText.Register("inputAdresse", "", Framework.Form.Validator.MinLength(2, "Le champ Adresse est requis"), (adresse) => { self.inscription.Adresse = adresse; btnContinuer.CheckState(); });
            let inputCP = Framework.Form.InputText.Register("inputCP", "", Framework.Form.Validator.CodePostal("Le champ CP est requis"), (cp) => { self.inscription.CP = cp; btnContinuer.CheckState(); });
            let inputVille = Framework.Form.InputText.Register("inputVille", "", Framework.Form.Validator.MinLength(2, "Le champ Ville est requis"), (ville) => { self.inscription.Ville = ville; btnContinuer.CheckState(); });

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                //return inputMail.IsValid == true && inputMail2.IsValid == true && inputMail.Value == inputMail2.Value;
                return inputAdresse.IsValid == true && inputCP.IsValid == true && inputVille.IsValid == true;
            }, () => {

                    self.showDivEvaluationFoodChoice1();

                //self.CallWCF('VerifieMailDataSens', { mail: inputMail.Value }, () => {
                //    Framework.Progress.Show("Vérification en cours...");
                //}, (res) => {
                //    Framework.Progress.Hide();

                //    if (res.Status == 'success') {
                //        self.inscription.Mail = inputMail.Value;
                //        self.showDivInscription6a();
                //    } else {
                //        divResultat.SetHtml("<p>Vous êtes déjà inscrit(e).</p><p>Un e-mail avec un lien de connexion au questionnaire vous a été renvoyé.</p><p>Nous vous remercions par avance pour votre participation.</p>");
                //    }
                //});

            })

        });
    }

    private showDivInscription4() {
        let self = this;
        self.showDiv("html/divInscription4.html", () => {

            let divResultat = Framework.Form.TextElement.Register("divResultat");
            let g2 = Framework.Form.RadioGroup.Register();
            let inputCiviliteMme = Framework.Form.RadioElement.Register("inputCiviliteMme", g2, () => { self.inscription.Genre = "Feminin"; btnContinuer.CheckState(); });
            let inputCiviliteMr = Framework.Form.RadioElement.Register("inputCiviliteMr", g2, () => { self.inscription.Genre = "Masculin"; btnContinuer.CheckState(); });
            let inputNom = Framework.Form.InputText.Register("inputNom", "", Framework.Form.Validator.MinLength(2, "Le champ Nom est requis"), (nom) => { self.inscription.Nom = nom; btnContinuer.CheckState(); });
            let inputPrenom = Framework.Form.InputText.Register("inputPrenom", "", Framework.Form.Validator.MinLength(2, "Le champ Prénom est requis"), (prenom) => { self.inscription.Prenom = prenom; btnContinuer.CheckState(); });
            let inputDateNaissance = Framework.Form.InputText.Register("inputDateNaissance", "", Framework.Form.Validator.FrenchDate(2004, "Le champ Date est requis (format : JJ/MM/AAAA) et vous devez avoir plus de 18 ans."), (naissance: string) => {
                let y = Number(naissance.substr(6, 4));
                let m = Number(naissance.substr(3, 2));
                let d = Number(naissance.substr(0, 2));
                self.inscription.DateNaissance = new Date(y, m - 1, d); btnContinuer.CheckState();
            });

            let inputMail = Framework.Form.InputText.Register("inputMail", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), (mail) => { btnContinuer.CheckState(); });

            let inputMail2 = Framework.Form.InputText.Register("inputMail2", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), (mail) => { btnContinuer.CheckState(); });

            let inputInfos = Framework.Form.CheckBox.Register("inputInfos", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            //let inputAdresse = Framework.Form.InputText.Register("inputAdresse", "", Framework.Form.Validator.MinLength(2, "Le champ Adresse est requis"), (adresse) => { self.inscription.Adresse = adresse; btnContinuer.CheckState(); });
            //let inputCP = Framework.Form.InputText.Register("inputCP", "", Framework.Form.Validator.CodePostal("Le champ CP est requis"), (cp) => { self.inscription.CP = cp; btnContinuer.CheckState(); });
            //let inputVille = Framework.Form.InputText.Register("inputVille", "", Framework.Form.Validator.MinLength(2, "Le champ Ville est requis"), (ville) => { self.inscription.Ville = ville; btnContinuer.CheckState(); });

            let customValidator: Framework.Form.Validator.CustomValidator = Framework.Form.Validator.Custom((value: any) => {
                let res = "";

                if (value.replace(/\D/g, "").length != 10) {
                    res = Framework.LocalizationManager.Get("Numéro de téléphone : 10 chiffres attendus");
                }

                return res;
            });

            //let inputTelephone = Framework.Form.InputText.Register("inputTelephone", "", customValidator, (tel) => { self.inscription.Telephone = tel; btnContinuer.CheckState(); });
            //let inputNbMajeurs = Framework.Form.InputText.Register("inputNbMajeurs", "", Framework.Form.Validator.IsNumber("positiveInteger", "Le champ Nombre de personnes majeures est requis"), (nbMajeurs) => { self.inscription.NbMajeurs = nbMajeurs; btnContinuer.CheckState(); });
            //let inputNbMineurs = Framework.Form.InputText.Register("inputNbMineurs", "", Framework.Form.Validator.IsNumber("integer", "Le champ Nombre de personnes mineures est requis"), (nbMineurs) => { self.inscription.NbMineurs = nbMineurs; btnContinuer.CheckState(); });

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return inputInfos.IsChecked == true && self.inscription.Genre != "" && /*inputTelephone.IsValid &&*/ inputNom.IsValid && inputPrenom.IsValid && inputDateNaissance.IsValid && /*inputAdresse.IsValid && inputCP.IsValid && inputVille.IsValid &&*/ inputMail.IsValid == true && inputMail2.IsValid == true && inputMail.Value == inputMail2.Value /*&& inputNbMajeurs.IsValid && inputNbMineurs.IsValid*/;
            }, () => {
                var todayDate = new Date().getTime();
                var birthDate = self.inscription.DateNaissance.getTime();
                var age = (todayDate - birthDate) / (1000 * 60 * 60 * 24 * 365);
                if (age < 18) {
                    Framework.Modal.Alert("", "Vous devez avoir plus de 18 ans.")
                } else {

                    self.CallWCF('VerifieMailDataSens', { mail: inputMail.Value }, () => {
                        Framework.Progress.Show("Vérification en cours...");
                    }, (res) => {
                        Framework.Progress.Hide();

                        if (res.Status == 'success') {
                            self.inscription.Mail = inputMail.Value;
                            //self.showDivInscription6a();
                            self.showDivInscription5();
                        } else {
                            divResultat.SetHtml("<p>" + res.ErrorMessage + "</p>");
                        }
                    });

                }
            })

        })
    }

    private showDivInscription5() {
        let self = this;
        self.showDiv("html/divInscription5.html", () => {

            let g1 = Framework.Form.RadioGroup.Register();
            let inputCSPa = Framework.Form.RadioElement.Register("inputCSPa", g1, () => { self.inscription.CSP = "Agriculteurs exploitants"; btnContinuer.CheckState(); });
            let inputCSPb = Framework.Form.RadioElement.Register("inputCSPb", g1, () => { self.inscription.CSP = "Artisans, commerçants et chefs d'entreprise"; btnContinuer.CheckState(); });
            let inputCSPc = Framework.Form.RadioElement.Register("inputCSPc", g1, () => { self.inscription.CSP = "Cadres et professions intellectuelles supérieures"; btnContinuer.CheckState(); });
            let inputCSPd = Framework.Form.RadioElement.Register("inputCSPd", g1, () => { self.inscription.CSP = "Professions Intermédiaires"; btnContinuer.CheckState(); });
            let inputCSPe = Framework.Form.RadioElement.Register("inputCSPe", g1, () => { self.inscription.CSP = "Employés"; btnContinuer.CheckState(); });
            let inputCSPf = Framework.Form.RadioElement.Register("inputCSPf", g1, () => { self.inscription.CSP = "Ouvriers"; btnContinuer.CheckState(); });
            let inputCSPg = Framework.Form.RadioElement.Register("inputCSPg", g1, () => { self.inscription.CSP = "Sans activité professionnelle"; btnContinuer.CheckState(); });
            let inputCSPh = Framework.Form.RadioElement.Register("inputCSPh", g1, () => { self.inscription.CSP = "Etudiants"; btnContinuer.CheckState(); });
            let inputCSPi = Framework.Form.RadioElement.Register("inputCSPi", g1, () => { self.inscription.CSP = "Retraités"; btnContinuer.CheckState(); });

            let g2 = Framework.Form.RadioGroup.Register();
            let inputDiplomea = Framework.Form.RadioElement.Register("inputDiplomea", g2, () => { self.inscription.NiveauEtudes = "Aucun diplôme, brevet des collèges"; btnContinuer.CheckState(); });
            let inputDiplomeb = Framework.Form.RadioElement.Register("inputDiplomeb", g2, () => { self.inscription.NiveauEtudes = "CAP, BEP ou équivalent"; btnContinuer.CheckState(); });
            let inputDiplomec = Framework.Form.RadioElement.Register("inputDiplomec", g2, () => { self.inscription.NiveauEtudes = "Baccalauréat ou équivalent"; btnContinuer.CheckState(); });
            let inputDiplomed = Framework.Form.RadioElement.Register("inputDiplomed", g2, () => { self.inscription.NiveauEtudes = "Bac + 2"; btnContinuer.CheckState(); });
            let inputDiplomee = Framework.Form.RadioElement.Register("inputDiplomee", g2, () => { self.inscription.NiveauEtudes = "Bac + 2 à Bac + 5"; btnContinuer.CheckState(); });
            let inputDiplomef = Framework.Form.RadioElement.Register("inputDiplomef", g2, () => { self.inscription.NiveauEtudes = "Supérieur à Bac + 5"; btnContinuer.CheckState(); });

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return self.inscription.CSP != "" && self.inscription.NiveauEtudes != "";
            }, () => {
                self.showDivInscription6a();
            })

        })
    }

    private showDivInscription6a() {
        let self = this;
        self.showDiv("html/divInscription6a.html", () => {

            let consoPizza = 0;


            let g1 = Framework.Form.RadioGroup.Register();
            let inputConsoPizzaPlusieursFoisSemaine = Framework.Form.RadioElement.Register("inputConsoPizzaPlusieursFoisSemaine", g1, () => { self.inscription.FreqConsoPizza = "Plusieurs fos par semaine"; consoPizza = 1; btnContinuer.CheckState(); });
            let inputConsoPizzaPlusieursFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoPizzaEnvironUneFoisParSemaine", g1, () => { self.inscription.FreqConsoPizza = "Environ une fois par semaine"; consoPizza = 1; btnContinuer.CheckState(); });
            //let inputConsoPizzaUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoPizzaUneFoisParSemaine", g1, () => { self.inscription.FreqConsoPizza = "Au moins une fois par mois"; consoPizza = 1; btnContinuer.CheckState(); });
            let inputConsoPizzaEnvironUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoPizzaEnvironUneFoisParMois", g1, () => { self.inscription.FreqConsoPizza = "Environ une fois par mois"; consoPizza = 1; btnContinuer.CheckState(); });
            let inputConsoPizzaMoinsUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoPizzaMoinsUneFoisParMois", g1, () => { self.inscription.FreqConsoPizza = "Moins d'une fois par mois"; consoPizza = 1; btnContinuer.CheckState(); });
            let inputConsoPizzaJamais = Framework.Form.RadioElement.Register("inputConsoPizzaJamais", g1, () => { self.inscription.FreqConsoPizza = "Jamais"; consoPizza = 1; btnContinuer.CheckState(); });


            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return consoPizza==1;
            }, () => {
                // Raison d'achat pizza
                //if (self.inscription.FreqConsoPizza != "Jamais") {
                //    self.showDivEvaluationFoodChoice1("pizza");
                //} else {
                    self.showDivInscription6a1()
                //}

                //self.showDivInscription7();
            })

        })
    }

    private showDivInscription6a1() {
        let self = this;
        self.showDiv("html/divInscription6a1.html", () => {

            let consoPizza = 0;

            let inputConsoPizzabon = Framework.Form.CheckBox.Register("inputConsoPizzaPizzabon",
                () => { return true; },
                () => {
                    self.inscription.Pizzabon = inputConsoPizzabon.IsChecked ? 1 : 0;
                }, "");

            let inputConsoPizzaStromboli = Framework.Form.CheckBox.Register("inputConsoPizzaStromboli",
                () => { return true; },
                () => {
                    self.inscription.Stromboli = inputConsoPizzaStromboli.IsChecked ? 1 : 0;
                }, "");


            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {
                // Raison d'achat pizza
                //if (self.inscription.FreqConsoPizza != "Jamais") {
                //    self.showDivEvaluationFoodChoice1("pizza");
                //} else {
                self.showDivInscription6b()
                //}

                //self.showDivInscription7();
            })

        })
    }

    private showDivInscription6b1() {
        let self = this;
        self.showDiv("html/divInscription6b1.html", () => {

            let consoPizza = 0;

            let inputConsoCookicroc = Framework.Form.CheckBox.Register("inputConsoCookicroc",
                () => { return true; },
                () => {
                    self.inscription.Cookicroc = inputConsoCookicroc.IsChecked ? 1 : 0;
                }, "");

            let inputConsoTanteAdele = Framework.Form.CheckBox.Register("inputConsoTanteAdele",
                () => { return true; },
                () => {
                    self.inscription.TanteAdele = inputConsoTanteAdele.IsChecked ? 1 : 0;
                }, "");


            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {
                // Raison d'achat pizza
                //if (self.inscription.FreqConsoPizza != "Jamais") {
                //    self.showDivEvaluationFoodChoice1("pizza");
                //} else {
                self.showDivInscription6c()
                //}

                //self.showDivInscription7();
            })

        })
    }

    private showDivInscription6c1() {
        let self = this;
        self.showDiv("html/divInscription6c1.html", () => {

            let consoPizza = 0;

            let inputConsoToastinou = Framework.Form.CheckBox.Register("inputConsoToastinou",
                () => { return true; },
                () => {
                    self.inscription.Toastinou = inputConsoToastinou.IsChecked ? 1 : 0;
                }, "");

            let inputConsoMamieDouce = Framework.Form.CheckBox.Register("inputConsoMamieDouce",
                () => { return true; },
                () => {
                    self.inscription.MamieDouce = inputConsoMamieDouce.IsChecked ? 1 : 0;
                }, "");


            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {

                    if (((self.inscription.FreqConsoPizza == "Jamais") && (self.inscription.FreqConsoPainMie == "Jamais") && (self.inscription.FreqConsoCookie == "Jamais")) /*|| self.inscription.TestNavigateur == 0 || self.inscription.AccepteConditions == 0*/
                        || self.inscription.Pizzabon == 1 || self.inscription.Stromboli == 1 || self.inscription.Cookicroc == 1 || self.inscription.TanteAdele == 1 || self.inscription.Toastinou == 1 || self.inscription.MamieDouce == 1
                    ) {

                        self.inscription.Adresse = "";
                        self.inscription.Genre = "";
                        self.inscription.CP = "";
                        self.inscription.CSP = "";
                        self.inscription.DateNaissance = null;
                        self.inscription.Genre = "";
                        self.inscription.NiveauEtudes = "";
                        //self.inscription.Telephone = "";
                        self.inscription.Ville = "";

                        self.showDivMauvaisProfil();

                       

                    } else {
                        self.showDivInscription6d()
                    }

            })

        })
    }

    private showDivInscription6d() {
        let self = this;
        self.showDiv("html/divInscription6d.html", () => {
           
            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {
                self.showDivInscription2b();
            })

        })
    }

    private showDivEvaluationFoodChoice1(/*type: string*/) {
        let self = this;
        self.showDiv("html/divEvaluationFoodChoice1.html", () => {

            //let spanSain = Framework.Form.TextElement.Register("spanSain");
            //let spanNaturel = Framework.Form.TextElement.Register("spanNaturel");
            //let spanFamilier = Framework.Form.TextElement.Register("spanFamilier");
            //let spanProduit = Framework.Form.TextElement.Register("spanProduit");

            //if (type == "cookie") {
            //    spanProduit.Set("cookies");
            //    spanSain.Set("sains");
            //    spanNaturel.Set("naturels");
            //    spanFamilier.Set("familiers");
            //}
            //if (type == "pizza") {
            //    spanProduit.Set("pizzas");
            //    spanSain.Set("saines");
            //    spanNaturel.Set("naturelles");
            //    spanFamilier.Set("familières");
            //}
            //if (type == "pain de mie") {
            //    spanProduit.Set("pains de mie");
            //    spanSain.Set("sains");
            //    spanNaturel.Set("naturels");
            //    spanFamilier.Set("familiers");
            //}

            //let setIdeal = function (x: string, y: number) {
            //    self.inscription.ListeFoodChoice.filter(x => { return x.Type == type })[0][x] = y;
            //}

            let g1Checked: boolean = false;
            let g1 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("healthy1", g1, () => { self.inscription.Healthy = 1; g1Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("healthy2", g1, () => { self.inscription.Healthy = 2; g1Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("healthy3", g1, () => { self.inscription.Healthy = 3; g1Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("healthy4", g1, () => { self.inscription.Healthy = 4; g1Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("healthy5", g1, () => { self.inscription.Healthy = 5; g1Checked = true; btnContinuer.CheckState(); });

            let g2Checked: boolean = false;
            let g2 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("mood1", g2, () => { self.inscription.MoodMonitoring = 1; g2Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("mood2", g2, () => { self.inscription.MoodMonitoring = 2; g2Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("mood3", g2, () => { self.inscription.MoodMonitoring = 3; g2Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("mood4", g2, () => { self.inscription.MoodMonitoring = 4; g2Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("mood5", g2, () => { self.inscription.MoodMonitoring = 5; g2Checked = true; btnContinuer.CheckState(); });

            let g3Checked: boolean = false;
            let g3 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("convenient1", g3, () => { self.inscription.Convenient = 1; g3Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("convenient2", g3, () => { self.inscription.Convenient = 2; g3Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("convenient3", g3, () => { self.inscription.Convenient = 3; g3Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("convenient4", g3, () => { self.inscription.Convenient = 4; g3Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("convenient5", g3, () => { self.inscription.Convenient = 5; g3Checked = true; btnContinuer.CheckState(); });

            let g4Checked: boolean = false;
            let g4 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("pleasure1", g4, () => { self.inscription.Pleasure = 1; g4Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("pleasure2", g4, () => { self.inscription.Pleasure = 2; g4Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("pleasure3", g4, () => { self.inscription.Pleasure = 3; g4Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("pleasure4", g4, () => { self.inscription.Pleasure = 4; g4Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("pleasure5", g4, () => { self.inscription.Pleasure = 5; g4Checked = true; btnContinuer.CheckState(); });

            let g5Checked: boolean = false;
            let g5 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("natural1", g5, () => { self.inscription.Natural = 1; g5Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("natural2", g5, () => { self.inscription.Natural = 2; g5Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("natural3", g5, () => { self.inscription.Natural = 3; g5Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("natural4", g5, () => { self.inscription.Natural = 4; g5Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("natural5", g5, () => { self.inscription.Natural = 5; g5Checked = true; btnContinuer.CheckState(); });

            let g6Checked: boolean = false;
            let g6 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("affordable1", g6, () => { self.inscription.Affordable = 1; g6Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("affordable2", g6, () => { self.inscription.Affordable=2; g6Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("affordable3", g6, () => { self.inscription.Affordable = 3; g6Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("affordable4", g6, () => { self.inscription.Affordable = 4; g6Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("affordable5", g6, () => { self.inscription.Affordable = 5; g6Checked = true; btnContinuer.CheckState(); });

            let g7Checked: boolean = false;
            let g7 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("weight1", g7, () => { self.inscription.WeightControl = 1; g7Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("weight2", g7, () => { self.inscription.WeightControl = 2; g7Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("weight3", g7, () => { self.inscription.WeightControl = 3; g7Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("weight4", g7, () => { self.inscription.WeightControl = 4; g7Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("weight5", g7, () => { self.inscription.WeightControl = 5; g7Checked = true; btnContinuer.CheckState(); });

            let g8Checked: boolean = false;
            let g8 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("familiarity1", g8, () => { self.inscription.Familiar = 1; g8Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("familiarity2", g8, () => { self.inscription.Familiar = 2; g8Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("familiarity3", g8, () => { self.inscription.Familiar = 3; g8Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("familiarity4", g8, () => { self.inscription.Familiar = 4; g8Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("familiarity5", g8, () => { self.inscription.Familiar = 5; g8Checked = true; btnContinuer.CheckState(); });


            let btnContinuer = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return g1Checked == true && g2Checked == true && g3Checked == true && g4Checked == true && g5Checked == true && g6Checked == true && g7Checked == true && g8Checked == true /*&& g9Checked == true && g10Checked == true && g11Checked == true*/;
            }, () => {
                self.showDivEvaluationFoodChoice2(/*type*/);

            });

        });
    }

    private showDivEvaluationFoodChoice2(/*type: string*/) {
        let self = this;
        self.showDiv("html/divEvaluationFoodChoice2.html", () => {


            //let spanProduit = Framework.Form.TextElement.Register("spanProduit");
            //if (type == "cookie") {
            //    spanProduit.Set("cookies");
            //}
            //if (type == "pizza") {
            //    spanProduit.Set("pizzas");
            //}
            //if (type == "pain de mie") {
            //    spanProduit.Set("pains de mie");
            //}

            //let setIdeal = function (x: string, y: number) {
            //    self.inscription.ListeFoodChoice.filter(x => { return x.Type == type })[0][x] = y;
            //}


            let g9Checked: boolean = false;
            let g9 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("environment1", g9, () => { self.inscription.EnvironmentalFriendly = 1; g9Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("environment2", g9, () => { self.inscription.EnvironmentalFriendly = 2; g9Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("environment3", g9, () => { self.inscription.EnvironmentalFriendly = 3; g9Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("environment4", g9, () => { self.inscription.EnvironmentalFriendly = 4; g9Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("environment5", g9, () => { self.inscription.EnvironmentalFriendly = 5; g9Checked = true; btnContinuer.CheckState(); });

            let g10Checked: boolean = false;
            let g10 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("fairtrade1", g10, () => { self.inscription.FairlyTrade = 1; g10Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("fairtrade2", g10, () => { self.inscription.FairlyTrade = 2; g10Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("fairtrade3", g10, () => { self.inscription.FairlyTrade = 3; g10Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("fairtrade4", g10, () => { self.inscription.FairlyTrade = 4; g10Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("fairtrade5", g10, () => { self.inscription.FairlyTrade = 5; g10Checked = true; btnContinuer.CheckState(); });

            let g11Checked: boolean = false;
            let g11 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("animal1", g11, () => { self.inscription.AnimalFriendly = 1; g11Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("animal2", g11, () => { self.inscription.AnimalFriendly = 2; g11Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("animal3", g11, () => { self.inscription.AnimalFriendly = 3; g11Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("animal4", g11, () => { self.inscription.AnimalFriendly = 4; g11Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("animal5", g11, () => { self.inscription.AnimalFriendly = 5; g11Checked = true; btnContinuer.CheckState(); });

            let btnContinuer = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return /*g1Checked == true && g2Checked == true && g3Checked == true && g4Checked == true && g5Checked == true && g6Checked == true && g7Checked == true && g8Checked == true && */g9Checked == true && g10Checked == true && g11Checked == true;
            }, () => {
                //if (type == "cookie") {
                //    self.showDivInscription6c();
                //}
                //if (type == "pizza") {
                //    self.showDivInscription6b();
                //}
                //if (type == "pain de mie") {
                //    if ((self.inscription.FreqConsoPizza != "Jamais") || (self.inscription.FreqConsoPainMie != "Jamais") || (self.inscription.FreqConsoCookie != "Jamais")) {
                        self.showDivInscription7();
                //    } else {
                //        self.showDivMauvaisProfil();
                //    }
                //}

            });

        });
    }

    private showDivMauvaisProfil() {
        let self = this;
        self.showDiv("html/divMauvaisProfil.html", () => {
            
            self.CallWCF('InscriptionDataSens', { inscriptionJson: JSON.stringify(self.inscription), mail: self.inscription.Mail, sendMail: false, valid: false }, () => {
                Framework.Progress.Show("Enregistrement...");
            }, (res) => {
                Framework.Progress.Hide();

            });
        });
    }

    private showDivInscription6b() {
        let self = this;
        self.showDiv("html/divInscription6b.html", () => {


            let consoCookie = 0;

            let g2 = Framework.Form.RadioGroup.Register();
            let inputConsoCookiePlusieursFoisSemaine = Framework.Form.RadioElement.Register("inputConsoCookiePlusieursFoisSemaine", g2, () => { self.inscription.FreqConsoCookie = "Plusieurs fois par semaine"; consoCookie = 1; btnContinuer.CheckState(); });
            let inputConsoCookieEnvironUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoCookieEnvironUneFoisParSemaine", g2, () => { self.inscription.FreqConsoCookie = "Environ une fois par semaine"; consoCookie = 1; btnContinuer.CheckState(); });
            //let inputConsoCookieUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoCookieUneFoisParSemaine", g2, () => { self.inscription.FreqConsoCookie = "Au moins une fois par mois"; consoCookie = 1; btnContinuer.CheckState(); });
            let inputConsoCookieEnvironUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoCookieEnvironUneFoisParMois", g2, () => { self.inscription.FreqConsoCookie = "Environ une fois par mois"; consoCookie = 1; btnContinuer.CheckState(); });
            let inputConsoCookieMoinsUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoCookieMoinsUneFoisParMois", g2, () => { self.inscription.FreqConsoCookie = "Moins d'une fois par mois"; consoCookie = 1; btnContinuer.CheckState(); });
            let inputConsoCookieJamais = Framework.Form.RadioElement.Register("inputConsoCookieJamais", g2, () => { self.inscription.FreqConsoCookie = "Jamais"; consoCookie = 1; btnContinuer.CheckState(); });


            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return consoCookie==1;
            }, () => {
                //if (self.inscription.FreqConsoCookie != "Jamais") {
                //    self.showDivEvaluationFoodChoice1("cookie");
                //} else {
                //    self.showDivInscription6c()
                //}
                    self.showDivInscription6b1();
            })

        })
    }

    private showDivInscription6c() {
        let self = this;
        self.showDiv("html/divInscription6c.html", () => {


            let consoPainMie = 0;


            let g3 = Framework.Form.RadioGroup.Register();
            let inputConsoPainMiePlusieursFoisSemaine = Framework.Form.RadioElement.Register("inputConsoPlusieursFoisSemaine", g3, () => { self.inscription.FreqConsoPainMie = "Plusieurs fois par semaine"; consoPainMie = 1; btnContinuer.CheckState(); });
            let inputConsoPainMieEnvironUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoPainMieEnvironUneFoisParSemaine", g3, () => { self.inscription.FreqConsoPainMie = "Environ une fois par semaine"; consoPainMie = 1; btnContinuer.CheckState(); });
            //let inputConsoPainMieUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoPainMieUneFoisParSemaine", g3, () => { self.inscription.FreqConsoPainMie = "Au moins une fois par mois"; consoPainMie = 1; btnContinuer.CheckState(); });
            let inputConsoPainMieEnvironUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoPainMieEnvironUneFoisParMois", g3, () => { self.inscription.FreqConsoPainMie = "Environ une fois par mois"; consoPainMie = 1; btnContinuer.CheckState(); });
            let inputConsoPainMieMoinsUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoPainMieMoinsUneFoisParMois", g3, () => { self.inscription.FreqConsoPainMie = "Moins d'une fois par mois"; consoPainMie = 1; btnContinuer.CheckState(); });
            let inputConsoPainMieJamais = Framework.Form.RadioElement.Register("inputConsoPainMieJamais", g3, () => { self.inscription.FreqConsoPainMie = "Jamais"; consoPainMie = 1; btnContinuer.CheckState(); });

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return consoPainMie==1;
            }, () => {
                //if (self.inscription.FreqConsoPainMie != "Jamais") {
                //    self.showDivEvaluationFoodChoice1("pain de mie");
                //} else {


                    //if (((self.inscription.FreqConsoPizza == "Jamais") && (self.inscription.FreqConsoPainMie == "Jamais") && (self.inscription.FreqConsoCookie == "Jamais")) || self.inscription.TestNavigateur == 0 || self.inscription.AccepteConditions == 0
                    //    || self.inscription.Pizzabon == 1 || self.inscription.Stromboli == 1 || self.inscription.Cookicroc == 1 || self.inscription.TanteAdele == 1 || self.inscription.Toastinou == 1 || self.inscription.MamieDouce == 1
                    //) {
                       
                    //    self.inscription.Adresse = "";
                    //    self.inscription.Genre = "";
                    //    self.inscription.CP = "";
                    //    self.inscription.CSP = "";
                    //    self.inscription.DateNaissance = null;                        
                    //    self.inscription.Genre = "";
                    //    self.inscription.NiveauEtudes = "";
                    //    self.inscription.Telephone = "";
                    //    self.inscription.Ville = "";

                    //    self.showDivMauvaisProfil();

                    //    //self.CallWCF('InscriptionDataSens', { inscriptionJson: JSON.stringify(self.inscription), mail: self.inscription.Mail, sendMail: false, valid: false }, () => {
                    //    //    Framework.Progress.Show("Enregistrement...");
                    //    //}, (res) => {
                    //    //    Framework.Progress.Hide();
                    //    //});

                    //} else {
                        self.showDivInscription6c1();
                    //}
                    //self.showDivInscription7();
                //}

            })

        })
    }

    private showDivInscription7() {
        let self = this;
        self.showDiv("html/divInscription7.html", () => {


            //let selectConnaissanceEtude = Framework.Form.Select.Register("selectConnaissanceEtude", "",
            //    [
            //        new Framework.KeyValuePair("Par bouche-à-oreille", "Par bouche-à-oreille"),
            //        new Framework.KeyValuePair("Par un mail qui m'a été envoyé", "Par un mail qui m'a été envoyé"),
            //        new Framework.KeyValuePair("Par un flyer qui décrivait l’étude", "Par un flyer qui décrivait l’étude"),
            //        new Framework.KeyValuePair("Dans une émission de radio", "Dans une émission de radio"),
            //        new Framework.KeyValuePair("Dans le journal", "Dans le journal"),
            //        new Framework.KeyValuePair("Lors d’un évènement où l’application était présentée", "Lors d’un évènement où l’application était présentée"),
            //        new Framework.KeyValuePair("Par les réseaux sociaux (Twitter / Facebook / Instagram / TikTok et assimilés)", "Par les réseaux sociaux (Twitter / Facebook / Instagram / TikTok et assimilés)"),
            //        new Framework.KeyValuePair("Autre", "Autre")
            //    ],
            //    Framework.Form.Validator.NotEmpty(), (txt) => {

            //        self.inscription.ConnaissanceEtude = txt;

            //        btnContinuer.CheckState();
            //    }, true);
            //let inputInstitut = Framework.Form.InputText.Register("inputInstitut", "", Framework.Form.Validator.NoValidation(), (txt) => { self.inscription.Panel = txt; btnContinuer.CheckState(); });

            //let g1 = Framework.Form.RadioGroup.Register();
            //let inputContactOui = Framework.Form.RadioElement.Register("inputContactOui", g1, () => { self.inscription.InscriptionPanelSens = true; btnContinuer.CheckState(); });
            //let inputContactNon = Framework.Form.RadioElement.Register("inputContactNon", g1, () => { self.inscription.InscriptionPanelSens = false; btnContinuer.CheckState(); });

            //let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {

            //    return selectConnaissanceEtude.IsValid;
            //}, () => {

            //    let sendMail: boolean = self.inscription.FreqConsoCookie != "Jamais" || self.inscription.FreqConsoPizza != "Jamais" || self.inscription.FreqConsoPainMie != "Jamais";

                self.CallWCF('InscriptionDataSens', { inscriptionJson: JSON.stringify(self.inscription), mail: self.inscription.Mail, sendMail: false, valid: true }, () => {
                    Framework.Progress.Show("Enregistrement...");
                }, (res) => {
                    Framework.Progress.Hide();

                    //if (sendMail) {
                        if (res.Status == 'success') {
                            self.showDivInscription8("<p>Votre justificatif de domicile a été envoyé, il sera contrôlé et vous recevrez vos identifiants de connection par mail.</p>");
                        } else {
                            self.showDivInscription8("<p>" + res.ErrorMessage + "</p><p>Veuillez vérifier votre adresse mail et réessayer.</p>");
                        }
                    //} else {
                    //    self.showDivInscription8("<p>Désolé, vous n'êtes pas éligible pour cette étude.</p>");
                    //}


                });
            //})

        })
    }

    private showDivInscription8(txt: string) {
        let self = this;
        self.showDiv("html/divInscription8.html", () => {

            let divFin = Framework.Form.TextElement.Register("divFin");
            divFin.SetHtml(txt);

        })
    }
}

class DataSensApp extends Framework.App {

    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/crocnoteurs';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
            requirements.AppUrl = 'https://www.chemosenstools.com/crocnoteurs';
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


        //requirements.Extensions = ["Rating", "Slider"];
        return requirements;
    }

    private questionnaire: Models.QuestionnaireSensas;
    private key: string;
    private saveurATester: string = "";
    private demo: boolean = false;

    constructor(isInTest: boolean = false, demo: boolean = false) {
        super(DataSensApp.GetRequirements(), isInTest);
        this.demo = demo;
    }

    protected onError(error: string) {
        super.onError(error);
    }

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);



        //Dynamsoft.DBR.BarcodeReader.productKeys = "t0068NQAAAJkBsplpzibfp1Gddht8ByLAP5DOOc/3SDgDPIC5aXTUIixlL4BIyErwvBpklKiuqb/agEFu35ME0fiaK0HyL1A=";
        Dynamsoft.DBR.BarcodeReader.organizationID = "100866291";

        //if (window.location.hostname.indexOf("localhost") > -1) {
        //    this.key = "ATHhaTGTEPy2IbZGNz18VmwTvCL0BrRJvHmpMVJ4JBEJJ+akYmlG5kBRK5HkBuftKAaDUT9XtgikRd7hAmxPz4xv0qBbKIy1fUBkCnZP7BbBG1EXQQaRdWcHt2lKIHoEFuUD+XUb+oKzgNa/7OxYtC8yPN5jb7lg/sfdQUNRhg+cjz+X1A5/sD0OYNIo01QEFCrLaRe2rpb947H9HIfi+uhJ3qtDnSiq5AzxRWgQiXomIjQCzZ73tT+r/XKdCFjEQX8W/kXdsYyNHo8Lk5ef4TrxfeKqUn+1svg+M/+yhV+gbRv0H0JL5GxWCqH+zYgftDcIt0CQZGxR4miJHRfb5lsUV+SnoDE2Bff+NxdNV5Oolfjq/nuP9R5bw6sPgZKgaFgmiWOiGQ00ZPmuc0Y5KQlEcSu17Mpm9SGdPv33VrI1Qv6vCtFTqeAkiMAJKc5Ghkewa6MJBpmzypKyaJAfDJeEC14IR4s3my/OpqF5atMeLwvInh2JWfbhNDiLjlg/WnaP9z3F1TeFK4EB1cqwSChLzqR2J6XziS8Mq1LVHYrK4sAxPPohvMJHzgd1iI6jSxeCdAROA28FIyeJzgqDPU4tHYGYJZv7GbYQ47T0AR/0MvhisMcP+IhNZgu9Ug15dej5DCEgu48+3h2UzqvESLHxjx04T9B0EGxvmgSfe24olBWp8quqlanu+iTF+FkbGCw1iMiW68xQWnbR/qgmfbady/qnq1VJRuGWfcMpteGPvqzhsrOsPN1QxI8tsZx1kcIIq6a6x/s1X+d+dLjEU+g6QLgipBycFjtk5kbPtA=="
        //} else {
        //    this.key = "AWjRhj6TH2QuKd4clyAclO0HPe0zPEMNHzF6wMhvDi/dAZJvl2nzyFNiCAz5G65XW0Ppr9d4I4gzdPoxFib9pUZ9ovNmSLH2pGwrz65EK38icyjsCnpTLytbLpyrSNGkOihdHHA0EUkqfkdkUWF4f11c2VxKad+LyWSx5l5OPblNZ56V9FuHjxMtQdaaMjh2U1T0qp5oQdAQS1HfrlwCTTh8JT/dSxlLN3mwvptsadQOWZLNeV59a1903+OUaiHqd0gZ2SRH4Qn5X0ULeWF7wnFxxtjrQXTp93rIdhxDW9oRZYv4VEfpmz1H84o3IMeJuikooMBTchJ7UDfNq0IGYDt8TSdYb/PxD35HUUF0dhu8a2wbtHHqcPhx2aqmVb0k6UrDuVd6W3GOdmO39krS5f9U6PDtTARIYUhHOQtfCIPcexkyNSBP2fhwvCgVU6inN0fhzatbANg9AZR0qFJeT+Nu/5S1RFjgsAlEbnxO5iNNZuAvj3MrrbFOUVclUTCl+w+LKIsm+9MiC5PrODrYwzaIdk8L1AvNCVsmBeRraFTY92V5PzTw9PSExRrXoe+Oq7GXbKE1rD23GwA972+NsKfPfQESTY3ziTo7EYK0ZJU04XYMBg73IHQ1NYw4PTLDRXV37BHTT7GF11JAUqGyrBG9jPG74rPB4iBFye7rMcjiJ0aVpfXz3oIH5E9XPjWmA+F6Em2Ka3DQUMfMavuqBwAwZTBRPpJ9n0xrG8APMk9C/xORWSNu8L3+f6vUAA0yxfSZeV5vsJUb57qSFYJB590vNcCVZ0lAMrMHWm2FVERLp7HNfHOFZ7r11MQjuJI+bHyKqXJMZyLYcb5qPfIfeX+cfu4YX+id3lv91gt3tJZ/MqIqyRFuIW8qpruwkVa4c2/P47uzY587gm1PmLx+PaXMUJgR8DnvIUgGtwe9rsSxyEXNHY7zJ1rXcd7NOagEdbNMX3RyO+iivoNdpbA90A9iuRLbthnMISPXPr62xtov9t34bdT5IPSDYPZoM1lVetb03spb/Jsf2LpNIz5fJDSNz13Xy9gME6h5Zg4Rj2RgYWdP9qjLGjNBILvbhvbZd2lCJLkxUrO723Ihz7fDwDQHd/JTb4lWXxCecfvbAmw8S6CMllfB+U8cD4PAvNuzfGi5QFmQJEblFTzMxtg7vjyoUZMZSBEEtsg8VLXQ1w6L5l7w78FePBV88WRqnpdX";
        //}

        let id = "";
        let url = window.location.href;
        if (url.indexOf('?id=') > -1) {
            var hashes = url.slice(url.indexOf('?id=') + 4).split('&');
            if (hashes.length > 0) {
                id = hashes[0];
            }
        }

        if (this.demo == true) {
            id = "G0RjWDXEB5cLbyIJpeOYG8byEmUXbJt";
        }

        this.showDivAuthentification(id);
    }

    private showDiv(htmlPath: string, onLoaded: () => void) {

        let self = this;

        document.body.innerHTML = "";
        let path = DataSensApp.GetRequirements().AppUrl + "/" + htmlPath;
        Framework.BaseView.Load(path, "body", (div) => {
            onLoaded();
        });
    }

    private showDivAuthentification(id: string = "") {

        let self = this;

        this.showDiv("html/divAuthentification.html", () => {

            let aMotPasseOublie: HTMLElement = document.getElementById("aMotPasseOublie");
            aMotPasseOublie.onclick = () => {
                //if (inputId.IsValid) {
                let div = document.createElement("div");
                let inputText = Framework.Form.InputText.Create("", () => { btnOK.CheckState(); }, Framework.Form.Validator.Mail(), true, ["form-control"]);
                div.appendChild(inputText.HtmlElement);
                let btnOK = Framework.Form.Button.Create(() => { return inputText.IsValid; }, () => {

                    self.CallWCF('VerifieMailDataSens', { mail: inputText.Value }, () => {
                        Framework.Progress.Show("Vérification en cours...");
                    }, (res) => {
                        Framework.Progress.Hide();

                        if (res.Status == 'success' && JSON.parse(res.Result) == true) {
                            Framework.Modal.Alert("", "Un e-mail avec un lien de connexion au questionnaire vous a été renvoyé.");
                        } else {
                            Framework.Modal.Alert("", "Aucun compte n'est enregistré à cette adresse mail.");
                        }
                    });

                    mw.Close();
                }, "OK", ["btn", "btn-primary", "btn-lg"]);
                let btnCancel = Framework.Form.Button.Create(() => { return true; }, () => { mw.Close(); }, "Annuler", ["btn-primary", "btn", "btn-lg"]);
                let mw = new Framework.Modal.CustomModal(div, "Veuillez saisir votre adresse de messagerie associée à croc'noteurs", [btnCancel, btnOK]);
                mw.show();
                //}
            }

            let pIdError = Framework.Form.TextElement.Register("pIdError");
            pIdError.Hide();

            //let txt = "";

            if (id == "") {

                try {
                    id = Framework.LocalStorage.GetFromLocalStorage("crocnoteurs_id_new", true);
                    if (id == null) {
                        id = "";
                    }
                } catch {

                }
            } else {
                //let oldid = Framework.LocalStorage.GetFromLocalStorage("crocnoteurs_id2", true);
                //if (oldid != null && oldid != "" && id != null && id != "" && id != oldid && self.demo == false) {
                //    self.showDiv("html/divDejaUtilise.html", () => {
                //        self.CallWCF('SendMailCrocnoteurs', { title: "Tentative de compte multiple", txt: "Nouvel ID : " + id + "<br/>Ancien ID : " + oldid }, () => {
                //        }, (res) => {
                //        });
                //    });
                //    return;
                //}
            }

            //let inputId = Framework.Form.InputText.Register("inputId", txt, Framework.Form.Validator.MinLength(4, "Longueur minimale : 4 caractères."), (text: string) => {
            //    btnCheckId.CheckState();
            //});

            let login = (code: string) => {



                self.CallWCF('LoginDataSens', { id: code }, () => {
                    Framework.Progress.Show("Vérification du code...");
                }, (res) => {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        let json: string = res.Result;

                        try {
                            Framework.LocalStorage.SaveToLocalStorage("crocnoteurs_id_new", code, true);
                        } catch {

                        }

                        // Récupération de l'existant
                        self.questionnaire = JSON.parse(json);
                        self.questionnaire.Code = code;

                        if (self.questionnaire.DatesMauvaisesReponses == null) {
                            self.questionnaire.DatesMauvaisesReponses = [];
                        }

                        if (self.questionnaire.NbEval == null) {
                            self.questionnaire.NbEval = 0;
                        }

                        self.saveQuestionnaire(() => {
                            self.showDivMenu();
                        });

                    } else {
                        pIdError.Show();
                    }
                });
            }

            //let btnCheckId = Framework.Form.Button.Register("btnCheckId", () => { return inputId.Value.length >= 4; }, () => {
            //    //(<any>chrome).webview.postMessage('Hello .NET from JavaScript');
            //    login(inputId.Value);
            //});

            if (id != "") {
                login(id);
            }

        });


    }

    private showDivMenu() {

        let self = this;

        this.showDiv("html/divMenu.html", () => {

            let pIndemnisationMaxAtteinte = Framework.Form.TextElement.Register("pIndemnisationMaxAtteinte");
            pIndemnisationMaxAtteinte.Hide();

            let canContinue = false;

            self.CallWCF('VerifiePlafondIndemnisation', { id: self.questionnaire.Code }, () => {
                Framework.Progress.Show("Vérification du plafond d'indemnisation...");
            }, (res) => {
                Framework.Progress.Hide();
                if (res.Status == 'success') {

                    // Pas plus de 2 produits par jour                    
                    let dates = self.questionnaire.EvaluationProduit.filter(x => x.EvaluationTerminee == true && new Date(x.DateFin.toString()).toLocaleDateString() == new Date(Date.now()).toLocaleDateString());

                    if (self.demo == true) {
                        canContinue = true;
                        btnEvalueProduit.CheckState();
                    } else if (dates && dates.length >= 1) {
                        pIndemnisationMaxAtteinte.Set("Vous ne pouvez évaluer qu'un produit dans la même journée.");
                        pIndemnisationMaxAtteinte.Show();
                    } else {
                    canContinue = true;
                    btnEvalueProduit.CheckState();
                    }

                } else {
                    pIndemnisationMaxAtteinte.Set(res.ErrorMessage);
                    pIndemnisationMaxAtteinte.Show();
                }

            });


            let btnCagnotte = Framework.Form.Button.Register("btnCagnotte", () => { return true; }, () => {
                self.showDivCagnotte();
            });

            if (self.demo == true) {
                btnCagnotte.Hide();
            }

            let btnEvalueProduit = Framework.Form.Button.Register("btnEvalueProduit", () => { return canContinue; }, () => {
                self.showDivEvaluationProduit1();
            });

        });
    }

    private showDivCagnotte() {



        let self = this;
        self.showDiv("html/divCagnotte.html", () => {

            let btnMenu = Framework.Form.Button.Register("btnMenu", () => { return true; }, () => {
                self.showDivMenu();
            });

            let divTable1 = Framework.Form.TextElement.Register("divTable1");
            let divTable2 = Framework.Form.TextElement.Register("divTable2");

            self.CallWCF('TelechargerCagnotteDataSens', { id: self.questionnaire.Code }, () => {
                Framework.Progress.Show("Téléchargement...");
            }, (res) => {
                Framework.Progress.Hide();
                if (res.Status == 'success') {
                    let json: string = res.Result;
                    let cagnotte = JSON.parse(json);

                    let table: Framework.Form.Table<Models.Evaluation> = new Framework.Form.Table<Models.Evaluation>();
                    table.CanSelect = false;
                    table.ShowFooter = false;
                    table.ListData = cagnotte.Evaluations;
                    table.Height = "50vh";
                    table.FullWidth = false;
                    table.AddCol("Date", "Date", 150, "left");
                    table.AddCol("Designation", "Désignation", 150, "left");
                    table.AddCol("Type", "Type", 100, "left");
                    table.AddCol("Montant", "Montant", 100, "left");
                    table.AddCol("MultiplicateurTexte", "Bonus", 100, "left");
                    table.AddCol("Total", "Gain", 100, "left");
                    table.Render(divTable1.HtmlElement);

                    let table2: Framework.Form.Table<Models.Indemnisation> = new Framework.Form.Table<Models.Indemnisation>();
                    table2.CanSelect = false;
                    table2.ShowFooter = false;
                    table2.ListData = cagnotte.Indemnisations;
                    table2.Height = "20vh";
                    table2.FullWidth = false;
                    table2.AddCol("DateS", "Date", 150, "left");
                    //table2.AddCol("Code", "Code", 150, "left");
                    table2.AddCol("Montant", "Montant", 100, "left");
                    table2.Render(divTable2.HtmlElement);

                    let divSolde = Framework.Form.TextElement.Register("divSolde", cagnotte.Solde.toString() + " €");

                }


            });



        });
    }

    private getProduit(ean: string): Models.Produit {

        let produits: Models.Produit[] = [];
        //produits.push(Models.Produit.Create("7622300689124", "GRANOLA Gros éclats de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("3017760756198", "GRANOLA Gros éclats de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("3178530407396", "BONNE MAMAN petits cookies pépites de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("3178530412123", "BONNE MAMAN petits cookies pépites de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("34632352", "BONNE MAMAN petits cookies pépites de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("3178530407303", "BONNE MAMAN petits cookies pépites de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("0250014005908", "BONNE MAMAN petits cookies pépites de chocolat", "cookie"));

        //produits.push(Models.Produit.Create("3410280020532", "TOP BUDGET Cookies pépites de chocolat", "cookie"));
        produits.push(Models.Produit.Create("3256220210461", "U Cookies goût chocolat et pépites de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("3017760756297", "GRANOLA Gros éclats de Chocolat amandes caramélisées", "cookie"));
        //produits.push(Models.Produit.Create("7622300356767", "MILKA choco cookies", "cookie"));
        //produits.push(Models.Produit.Create("7622300766610", "MILKA choco cookies", "cookie"));
        //produits.push(Models.Produit.Create("20022297", "SONDEY GRANDINO Pépites de Chocolat & Nougatine", "cookie"));
        //produits.push(Models.Produit.Create("3270190114055", "CARREFOUR Cookies Choco, noisettes", "cookie"));
        //produits.push(Models.Produit.Create("7622300746742", "GRANOLA l'original gros éclats de chocolat et noisettes", "cookie"));
        //produits.push(Models.Produit.Create("3560071151423", "CARREFOUR DISCOUNT Cookies pepites de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("3116430213884", "BISCUITERIE DELACRE Pépites de chocolat - 150g", "cookie"));
        //produits.push(Models.Produit.Create("3564700000694", "PTIT DELI Le cookie pépites de chocolat  praliné nougatine", "cookie"));
        produits.push(Models.Produit.Create("3229820800455", "BJORG Cookies quinoa pépites de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("20147426", "SONDEY GRANDINO cookies aux pépites de chocolat", "cookie"));
        //produits.push(Models.Produit.Create("3250392259624", "CHABRIOR Cookies maxi pépites chocolat", "cookie"));
        //produits.push(Models.Produit.Create("3564700000717", "PTIT DELI Le cookie goût chocolat et pépites de chocolat", "cookie"));

        //produits.push(Models.Produit.Create("3228857000852", "HARRYS 100% mie nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3228857000913", "HARRYS 100% mie nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3228857000869", "HARRYS 100% mie nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3228850008244", "HARRYS 100% mie nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3228857000715", "HARRYS 100% mie nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3228851001695", "HARRYS 100% mie nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3228857000951", "HARRYS 100% mie nature", "pain de mie"));
        produits.push(Models.Produit.Create("3250390214694", "CHABRIOR Grand Mie Nature", "pain de mie"));
        //produits.push(Models.Produit.Create("4056489007166", "MAITRE JEAN PIERRE Pain de mie extra-moelleux nature", "pain de mie"));        
        produits.push(Models.Produit.Create("3760049790214", "LA BOULANGERE Bio Grandes Tranches à la farine complète", "pain de mie"));
        //produits.push(Models.Produit.Create("3228857000838", "HARRYS american sandwich nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3780471201805", "HARRYS american sandwich nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3029330022411", "JACQUET Maxi Tranches Sans sucre ajouté Nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3029330071204", "JACQUET Maxi Tranches Sans sucre ajouté Nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3029330071181", "JACQUET Maxi Tranches Sans sucre ajouté Nature", "pain de mie"));

        //produits.push(Models.Produit.Create("3228857000906", "HARRYS American sandwich complet", "pain de mie"));
        //produits.push(Models.Produit.Create("3228857000180", "HARRYS American sandwich complet", "pain de mie"));     
        //produits.push(Models.Produit.Create("4019641036398", "HARRYS American sandwich complet", "pain de mie"));     
        //produits.push(Models.Produit.Create("3688857000090", "HARRYS American sandwich complet", "pain de mie"));     
        //produits.push(Models.Produit.Create("3250390036692", "CHABRIOR extra moelleux nature", "pain de mie"));
        produits.push(Models.Produit.Create("4056489007173", "MAITRE JEAN PIERRE grandes tranches nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3250391697885", "CHABRIOR Coeur de mie nature", "pain de mie"));
        produits.push(Models.Produit.Create("3564700019320", "EPI D OR Pain de mie extra moelleux nature", "pain de mie"));
        produits.push(Models.Produit.Create("3564706576957", "EPI D OR Pain de mie extra moelleux nature", "pain de mie"));
        //produits.push(Models.Produit.Create("3029330022428", "JACQUET Maxi Tranches sans sucre ajouté Complet", "pain de mie"));
        //produits.push(Models.Produit.Create("3029330071198", "JACQUET Maxi Tranches sans sucre ajouté Complet", "pain de mie"));
        //produits.push(Models.Produit.Create("3029330071211", "JACQUET Maxi Tranches sans sucre ajouté Complet", "pain de mie"));


        //produits.push(Models.Produit.Create("3228857000883", "HARRYS extra moelleux nature sans sucres ajoutés", "pain de mie"));
        //produits.push(Models.Produit.Create("3228857000876", "HARRYS extra moelleux nature sans sucres ajoutés", "pain de mie"));
        //produits.push(Models.Produit.Create("3270190021070", "CARREFOUR pain de mie extra moelleux", "pain de mie"));
        //produits.push(Models.Produit.Create("3560070433063", "CARREFOUR Spécial mie Nature", "pain de mie"));
        //produits.push(Models.Produit.Create("4056489007180", "MAITRE JEAN PIERRE Pain de Mie Spécial Sandwich Complet", "pain de mie"));
        //produits.push(Models.Produit.Create("60544339", "MAITRE JEAN PIERRE Pain de Mie Spécial Sandwich Complet", "pain de mie"));
        //produits.push(Models.Produit.Create("3242272500056", "SODEBO La Pizz - Jambon Emmental", "pizza"));
        //produits.push(Models.Produit.Create("3242272500063", "SODEBO La Pizz - Jambon Emmental", "pizza"));
        //produits.push(Models.Produit.Create("3242272500261", "SODEBO La Pizz - Jambon Emmental", "pizza"));
        //produits.push(Models.Produit.Create("3242272500469", "SODEBO La Pizz - Jambon Emmental", "pizza"));
        //produits.push(Models.Produit.Create("3242272500162", "SODEBO La Pizz - Jambon Emmental", "pizza"));


        //produits.push(Models.Produit.Create("4001724036616", "RISTORANTE pizza royale", "pizza"));
        //produits.push(Models.Produit.Create("4001724006923", "RISTORANTE pizza royale", "pizza"));
        
        //produits.push(Models.Produit.Create("20928582", "TRATTORIA ALFREDO la pizza Royale cuite au feu de bois", "pizza"));
        //produits.push(Models.Produit.Create("4001724038870", "RISTORANTE Pizza Quattro Formaggi", "pizza"));
        //produits.push(Models.Produit.Create("4001724818908", "RISTORANTE Pizza Quattro Formaggi", "pizza"));
        //produits.push(Models.Produit.Create("8003000562600", "RISTORANTE Pizza Quattro Formaggi", "pizza"));

        //produits.push(Models.Produit.Create("3242272346050", "SODEBO Dolce pizza prosciutto Mozzarella & chiffonade de jambon", "pizza"));
        produits.push(Models.Produit.Create("3564700038284", "TURINI Pizza jambon emmental", "pizza"));
        //produits.push(Models.Produit.Create("3242273050253", "SODEBO Pizza Crust Cheesy 4 Fromage", "pizza"));
        //produits.push(Models.Produit.Create("3245412149085", "CARREFOUR Jambon - champignon", "pizza"));
        //produits.push(Models.Produit.Create("3242273050055", "SODEBO Pizza Crust - Classic jambon emmental", "pizza"));
        //produits.push(Models.Produit.Create("3242691140055", "SODEBO Pizza Crust - Classic jambon emmental", "pizza"));

        //produits.push(Models.Produit.Create("3242272347552", "SODEBO Dolce Pizza - Regina", "pizza"));
        //produits.push(Models.Produit.Create("8279272347584", "SODEBO Dolce Pizza - Regina", "pizza"));

        //produits.push(Models.Produit.Create("3560070593330", "CARREFOUR La pizza 4 fromages", "pizza"));
        produits.push(Models.Produit.Create("26028279", "CASA MORANDO Pizza 4 Fromage", "pizza"));
        //produits.push(Models.Produit.Create("20673659", "TOQUE DU CHEF Pizza Prosciutto Mozzarella & Jambon", "pizza"));
        //produits.push(Models.Produit.Create("3250390305699", "FIORINI Pizza royale cuite au feu de bois", "pizza"));
        produits.push(Models.Produit.Create("3564700465677", "TURINI Pizza jambon/fromage cuite sur pierre pâte fine", "pizza"));
        produits.push(Models.Produit.Create("3564700038291", "TURINI Pizza 4 Fromages", "pizza"));

        let p = produits.filter(x => x.EAN == ean);
        if (p.length > 0) {
            p[0].CodeBarre = ean;
            return p[0];
        } else {
            return undefined;
        }

    }

    private showDivEvaluationProduit1() {

        let self = this;

        let scan = undefined;

        self.showDiv("html/divEvaluationProduit1.html", () => {

            // Lecteur de code barre      
            let video: HTMLVideoElement = <HTMLVideoElement>document.getElementById("scandit-barcode-picker");

            try {
                scan.close();
            } catch {

            }

            let pScanner = null;
            try {
                Dynamsoft.DBR.BarcodeReader.loadWasm();
                startBarcodeScanner();
            } catch (ex) {
                alert(ex.message);
                throw ex;
            }

            async function startBarcodeScanner() {
                try {
                    let scanner = await (pScanner = pScanner || Dynamsoft.DBR.BarcodeScanner.createInstance());
                    scan = scanner;
                    scanner.onFrameRead = (_results) => {
                        let code: string = "";
                        for (let result of _results) {
                            inputCodeBarre.Set(result.barcodeText);
                            code = result.barcodeText;
                        }
                        if (code != "" && code.length > 7) {
                            verifieCodeBarre(code);
                        }
                    };
                    document.getElementById('UIElement').appendChild(scanner.getUIElement());

                    (<HTMLElement>document.querySelector('#UIElement div')).style.background = '';
                    (<HTMLElement>document.getElementsByClassName('dce-sel-camera')[0]).hidden = true;
                    (<HTMLElement>document.getElementsByClassName('dce-sel-resolution')[0]).hidden = true;
                    (<HTMLElement>document.getElementsByClassName('dce-btn-close')[0]).hidden = true;
                    await scanner.show();
                } catch (ex) {
                    Framework.Modal.Alert("", "Impossible d'initialiser le lecteur de code-barre. Veuillez saisir le code à la main ou redémarrer l'application.");
                    throw ex;
                }
            }


            let pIdError = Framework.Form.TextElement.Register("pIdError");
            pIdError.Hide();

            let customValidator: Framework.Form.Validator.CustomValidator = Framework.Form.Validator.Custom((value: any) => {
                let res = "";

                if (value.length < 8) {
                    res = "Longueur minimale : 8 chiffres";
                }

                function isNumber(value: string | number): boolean {
                    return ((value != null) &&
                        (value !== '') &&
                        !isNaN(Number(value.toString())));
                }

                if (isNumber(value) == false) {
                    res = "Chiffres uniquement";
                }

                return res;
            });

            let inputCodeBarre = Framework.Form.InputText.Register("inputCodeBarre", "", customValidator, (text: string) => {
                btnVerifierCodeBarre.CheckState();

                //TODO : déclencher la vérification quand longueur = 16 (pas besoin de bouton)
            });

            let produit: Models.Produit = undefined;

            let verifieCodeBarre = (code: string) => {

                pIdError.Hide();

                

                //scan.close();

                produit = self.getProduit(code);

                if (produit != undefined) {
                    let evaluations = self.questionnaire.EvaluationProduit.filter(x => { return x.Produit.CodeBarre == code });

                    //let produit: Models.Produit = new Models.Produit();                    
                    produit.CodeBarre = code;
                    if (evaluations.length == 0 || (evaluations.length > 0 && evaluations[0].EvaluationTerminee == false)) {
                        scan.close();
                        self.showDivEvaluationProduit1b(produit);
                
                    } else {
                        // Produit déjà évalué
                        scan.close();
                        pIdError.SetHtml("Vous avez déjà évalué ce produit.");
                        pIdError.Show();
                        produit = undefined;
                
                    }
                } else {
                    pIdError.SetHtml("Ce produit n'est pas éligible. Vous pouvez consulter la liste des produits éligibles sur le site www.crocnoteurs.fr");
                    pIdError.Show();
                    produit = undefined;
                
                }

                //self.CallWCF('VerifieCodeBarreDataSens', { code: code }, () => {
                //    Framework.Progress.Show("Vérification du code barre...");
                //}, (res) => {
                //    Framework.Progress.Hide();

                //    scan.close();

                //    if (res.Status == 'success') {
                //        let json: string = res.Result;
                //        produit = JSON.parse(json);

                //        if (produit.Valide == "Vérifié et non approuvé") {
                //            pIdError.SetHtml("Ce produit n'est pas éligible. Il y a trois catégories d'aliments à tester : les pizzas jambon-fromage (avec ou sans champignons), les cookies aux pépites de chocolat et les pains de mie blancs avec croûte");
                //            pIdError.Show();
                //            produit = undefined;
                //        } else {

                //            if (self.demo == true) {
                //                let dt = new Date(Date.now());
                //                produit.CodeBarre = code + "_" + dt.getFullYear()+dt.getMonth()+dt.getDay()+dt.getHours()+dt.getMinutes()+dt.getSeconds();
                //                self.showDivEvaluationProduit1b(produit);
                //            }
                //            else {
                //                let evaluations = self.questionnaire.EvaluationProduit.filter(x => { return x.Produit.CodeBarre == code });
                //                produit.CodeBarre = code;
                //                if (evaluations.length == 0 || (evaluations.length > 0 && evaluations[0].EvaluationTerminee == false)) {
                //                    self.showDivEvaluationProduit1b(produit);
                //                } else {
                //                    // Produit déjà évalué
                //                    pIdError.SetHtml("Vous avez déjà évalué ce produit.");
                //                    pIdError.Show();
                //                    produit = undefined;
                //                }
                //            }
                //        }

                //    } else {
                //        // Produit pas dans la liste
                //        produit = new Models.Produit();
                //        produit.Designation = res.ErrorMessage;
                //        produit.CodeBarre = code;
                //        produit.Valide = "Non vérifié";
                //        self.showDivEvaluationNouveauProduit(produit);
                //    }

                //});

            }

            let btnVerifierCodeBarre = Framework.Form.Button.Register("btnVerifierCodeBarre", () => { return inputCodeBarre.IsValid == true; }, () => {
                verifieCodeBarre(inputCodeBarre.Value.replace(" ", ""));
            });

            // 2 heures max
            //try {
            //    if (self.questionnaire.EvaluationProduit.length > 0) {
            //        //let dates = self.questionnaire.EvaluationProduit.map(x => { return x.Date }).sort((a, b) => b.getTime() - a.getTime());
            //        let dates = self.questionnaire.EvaluationProduit.map(x => { return x.Date });
            //        if (dates) {
            //            var maximumDate = dates[dates.length - 1];
            //            let ctime = new Date(Date.now()).getTime();
            //            var diff = Math.abs(ctime - new Date(maximumDate.toString()).getTime()) / 3600000;
            //            if (diff < 2) {
            //                //btnVerifierCodeBarre.Disable();
            //                Framework.Modal.Alert("", "Vous ne pouvez pas évaluer 2 produits à moins de 2 heures d'intervalle.")
            //            }
            //        }
            //    }
            //}
            //catch (ex) {}

            let btnMenu = Framework.Form.Button.Register("btnMenu", () => { return true; }, () => {
                self.showDivMenu();
            });
        });
    }

    private showDivEvaluationNouveauProduit(produit: Models.Produit) {
        let self = this;
        self.showDiv("html/divEvaluationNouveauProduit.html", () => {

            let g: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();

            Framework.Form.RadioElement.Register("inputNouveauProduitCookie", g, () => { produit.Type = "cookie"; btnContinuerEvaluation.CheckState(); });
            Framework.Form.RadioElement.Register("inputNouveauProduitPizza", g, () => { produit.Type = "pizza"; btnContinuerEvaluation.CheckState(); });
            Framework.Form.RadioElement.Register("inputNouveauProduitPainMie", g, () => { produit.Type = "pain de mie"; btnContinuerEvaluation.CheckState(); });
            Framework.Form.RadioElement.Register("inputNouveauProduitAutre", g, () => { produit.Type = ""; btnContinuerEvaluation.CheckState(); });

            let designation = "";
            if (produit.Designation && produit.Designation != null && produit.Designation != "") {
                designation = produit.Designation;
            }

            let inputDesignation = Framework.Form.InputText.Register("inputDesignation", designation, Framework.Form.Validator.MinLength(5, "Longueur minimale : 5 caractères."), (text: string) => {
                produit.Designation = text;
                btnContinuerEvaluation.CheckState();
            });

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnEvaluerProduit", () => { return inputDesignation.IsValid == true && produit.Type != undefined && produit.Type != ""; }, () => {
                self.CallWCF('AjouteCodeBarreDataSens', { code: produit.CodeBarre, famille: produit.Type, designation: produit.Designation }, () => {
                    Framework.Progress.Show("Téléversement en cours...");
                }, (res) => {
                    Framework.Progress.Hide();
                    self.evaluationProduit(produit);
                });


            });

            let btnMenu = Framework.Form.Button.Register("btnMenu", () => { return true; }, () => {
                self.showDivMenu();
            });
        });
    }

    private showDivEvaluationProduit1b(produitTrouve: Models.Produit) {
        let self = this;
        self.showDiv("html/divEvaluationProduit1b.html", () => {

            

            let divProduit = Framework.Form.TextElement.Register("divProduit")

            let produit: Models.Produit = undefined;

            // Test si produit déjà évalué
            let produits = self.questionnaire.EvaluationProduit.filter(x => { return x.Produit.CodeBarre == produitTrouve.CodeBarre });
            if (produits.length == 0) {
                divProduit.SetHtml("<h3>" + produitTrouve.Designation + "</h3><h4>Vous n'avez pas encore évalué ce produit.</h4>");
                produit = new Models.Produit();
                produit.CodeBarre = produitTrouve.CodeBarre;
                produit.Type = produitTrouve.Type;
                produit.Designation = produitTrouve.Designation;
            } else {
                if (produits[0].EvaluationTerminee == true) {
                    // Produit déjà évalué
                    divProduit.SetHtml("<h3>" + produitTrouve.Designation + "</h3><h4>Vous avez déjà évalué ce produit.</h4>");
                    produit = undefined;
                } else {
                    // Reprise là où le sujet s'était arrêté
                    divProduit.SetHtml("<h3>" + produitTrouve.Designation + "</h3><h4>Vous n'avez pas terminé d'évaluer ce produit.</h4>");
                    produit = produits[0].Produit;
                }
            }

            

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnEvaluerProduit", () => { return produit != undefined; }, () => {
            
                self.evaluationProduit(produit);
            });

            let btnMenu = Framework.Form.Button.Register("btnMenu", () => { return true; }, () => {
                
                self.showDivMenu();
            });
        });
    }

    private evaluationProduit(produit: Models.Produit) {

        let self = this;

        let evaluation: Models.EvaluationProduit = undefined;
        let evaluations = self.questionnaire.EvaluationProduit.filter(x => { return x.Produit.CodeBarre == produit.CodeBarre });
        if (evaluations.length > 0) {
            // Reprise
            evaluation = evaluations[0];
        } else {
            // Nouvelle évaluation
            evaluation = new Models.EvaluationProduit();
            evaluation.Produit = new Models.Produit();
            evaluation.Produit.CodeBarre = produit.CodeBarre;
            evaluation.Produit.Designation = produit.Designation;
            evaluation.Produit.Type = produit.Type;
            this.questionnaire.EvaluationProduit.push(evaluation);
        }

        evaluation.Produit.Rang = this.questionnaire.EvaluationProduit.filter(x => { return x.Produit.Type == evaluation.Produit.Type }).length;
        
        self.continuerEvaluation(evaluation);


        //Teste : photo récente
        //self.CallWCF('VerifiePhotoDataSens', { code: produit.CodeBarre }, () => {
        //    Framework.Progress.Show("Téléversement en cours...");
        //}, (res) => {
        //    Framework.Progress.Hide();



        //    let json: string = res.Result;


        //    let photoExiste = JSON.parse(json);


        //    if (photoExiste == true) {
        //        self.continuerEvaluation(evaluation);
        //    }
        //    else {
        //        self.saveQuestionnaire(() => { self.showDivAvantPhotoComposition(evaluation); });
        //    }

        //});



    }

    private showDivAvantPhotoComposition(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divAvantPhotoComposition.html", () => {


            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {
                self.saveQuestionnaire(() => { self.showDivPhotoComposition(evaluation); });
            })

        })
    }

    private showDivAvantPhotoIngredients(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divAvantPhotoIngredients.html", () => {


            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {
                //self.continuerEvaluation(evaluation);
                self.saveQuestionnaire(() => { self.showDivPhotoIngredients(evaluation); });
            })

        })
    }

    private showDivOuverturePaquet(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divOuverturePaquet.html", () => {


            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {
                //self.continuerEvaluation(evaluation);
                self.showDivPhotoEmballage(evaluation);
            })

        })
    }

    private showDivObservation(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divObservation.html", () => {

            let prefix = "";

            if (evaluation.Produit.Type == "pizza") {
                prefix = "la pizza sans la goûter";
            }

            if (evaluation.Produit.Type == "cookie") {
                prefix = "le cookie sans le goûter";
            }

            if (evaluation.Produit.Type == "pain de mie") {
                prefix = "le pain de mie sans le goûter";
            }


            let divProduit = Framework.Form.TextElement.Register("divProduit", prefix);

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {
                //self.continuerEvaluation(evaluation);
                self.showDivEvaluationDejaGoute(evaluation);
            })

        })
    }

    private showDivGoutage(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divGoutage.html", () => {

            let prefix = "le ";
            if (evaluation.Produit.Type == "pizza") {
                prefix = "la ";
            }

            let divProduit = Framework.Form.TextElement.Register("divProduit", prefix + evaluation.Produit.Type);
            let divPainMie = Framework.Form.TextElement.Register("divPainMie"); divPainMie.Hide();
            let divPizza = Framework.Form.TextElement.Register("divPizza"); divPizza.Hide();

            if (evaluation.Produit.Type == "pain de mie") {
                divPainMie.Show();
            }

            if (evaluation.Produit.Type == "pizza") {
                divPizza.Show();
            }

            let btnContinuer = Framework.Form.Button.Register("btnContinuer", () => {
                return true;
            }, () => {
                //self.continuerEvaluation(evaluation);
                self.showDivEvaluationStatedLiking(evaluation);
            })

        })
    }

    private continuerEvaluation(evaluation: Models.EvaluationProduit) {
        let self = this;

        if (evaluation.PhotoEmballage == false) {
            self.saveQuestionnaire(() => {
                self.showDivOuverturePaquet(evaluation);
                //self.showDivPhotoEmballage(evaluation);
            });
        } else if (evaluation.DejaGoute == "") {
            self.saveQuestionnaire(() => {
                self.showDivObservation(evaluation);
                //self.showDivEvaluationDejaGoute(evaluation);
            });
        }
        //else if (evaluation.PhotoComposition == false) {
        //    self.saveQuestionnaire(() => { self.showDivEvaluationProduit4(evaluation); });
        //}
        else if (evaluation.ExpectedLiking == undefined) {
            self.saveQuestionnaire(() => { self.showDivEvaluationExpectedLiking(evaluation); });
        }
        else if (evaluation.DescriptionApparence == "") {
            self.saveQuestionnaire(() => { self.showDivEvaluationApparence(evaluation); });
        }
        else if (evaluation.StatedLiking == undefined) {
            self.saveQuestionnaire(() => {
                self.showDivGoutage(evaluation);
                //self.showDivEvaluationStatedLiking(evaluation);
            });
        }
        else if (evaluation.DescriptionTexture == "") {
            self.saveQuestionnaire(() => { self.showDivEvaluationTexture(evaluation); });
        }
        else if (evaluation.DescriptionGout == "") {
            self.saveQuestionnaire(() => { self.showDivEvaluationGout(evaluation); });
        }
        else if (evaluation.AimeApparence == undefined) {
            if (evaluation.Produit.Type == "cookie") {
                self.saveurATester = Framework.Array.Shuffle(["sucré", "gras"])[0];
            }
            if (evaluation.Produit.Type == "pain de mie") {
                self.saveurATester = Framework.Array.Shuffle(["sucré", "salé"])[0];
            }
            if (evaluation.Produit.Type == "pizza") {
                self.saveurATester = Framework.Array.Shuffle(["gras", "salé"])[0];
            }
            self.saveQuestionnaire(() => { self.showDivEvaluationAime(evaluation); });
        }
        //else if (evaluation.DescriptionPasAime == "") {
        //    self.saveQuestionnaire(() => { self.showDivEvaluationPasAime(evaluation); });
        //}
        else if ((evaluation.Produit.Type == "cookie" || evaluation.Produit.Type == "pain de mie") && evaluation.JARSucre == undefined) {
            self.saveQuestionnaire(() => {
                self.showDivEvaluationJARSucre(evaluation);
            });
        }
        else if (self.saveurATester == "sucré") {
            self.saveQuestionnaire(() => {
                self.verifieReponsePrécédente("sucré", () => { self.continuerEvaluation(evaluation); })
            });
        }
        else if ((evaluation.Produit.Type == "pizza" || evaluation.Produit.Type == "pain de mie") && evaluation.JARSale == undefined) {
            self.saveQuestionnaire(() => {
                self.showDivEvaluationJARSale(evaluation);

            });
        }
        else if (self.saveurATester == "salé") {
            self.saveQuestionnaire(() => {

                self.verifieReponsePrécédente("salé", () => { self.continuerEvaluation(evaluation); })

            });
        }
        else if ((evaluation.Produit.Type == "pizza" || evaluation.Produit.Type == "cookie") && evaluation.JARGras == undefined) {
            self.saveQuestionnaire(() => {
                self.showDivEvaluationJARGras(evaluation);

            });
        }
        else if (self.saveurATester == "gras") {
            self.saveQuestionnaire(() => {

                self.verifieReponsePrécédente("gras", () => { self.continuerEvaluation(evaluation); })

            });
        }
        else if (evaluation.IntentionReachat == undefined) {
            self.saveQuestionnaire(() => {
                self.showDivEvaluationRachat(evaluation);
            });
        } else {
            if (self.demo == false) {

                

                // Fin de l'évaluation
                if (evaluation.Produit.Rang == 5) {

                    let p = new Models.ProduitIdeal();
                    p.Type = evaluation.Produit.Type;
                    self.questionnaire.ListeProduitIdeal.push(p);


                    self.saveQuestionnaire(() => { self.showDivIdeal(p, evaluation); });

                } else {
                    self.ajouteACagnotte(evaluation);
                }
            } else {

                

                self.showDivMenu();
            }
        }
    }

    private showDivIdeal(p: Models.ProduitIdeal, evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divIdeal.html", () => {



            let spanProduit = Framework.Form.TextElement.Register("spanProduit");
            let spanProduit2 = Framework.Form.TextElement.Register("spanProduit2");
            let spanPrix1 = Framework.Form.TextElement.Register("spanPrix1");
            let spanPrix2 = Framework.Form.TextElement.Register("spanPrix2");

            if (p.Type == "cookie") {
                spanProduit.SetHtml(evaluation.Produit.Rang + "<sup>ème</sup> cookie");
                spanPrix1.Set("2");
                spanPrix2.Set("4");
                spanProduit2.SetHtml("quel serait votre cookie idéal");

            }
            if (p.Type == "pizza") {
                spanProduit.SetHtml(evaluation.Produit.Rang + "<sup>ème</sup> pizza");
                spanPrix1.Set("3");
                spanPrix2.Set("6");
                spanProduit2.SetHtml("quelle serait votre pizza idéale");
            }
            if (p.Type == "pain de mie") {
                spanProduit.SetHtml(evaluation.Produit.Rang + "<sup>ème</sup> pain de mie");
                spanPrix1.Set("1.5");
                spanPrix2.Set("3");
                spanProduit2.SetHtml("quel serait votre pain de mie idéal");
            }

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return true;
            }, () => {
                self.saveQuestionnaire(() => { self.showDivEvaluationApparenceIdeal(p, evaluation); });
            });

        });
    }

    private ajouteACagnotte(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.saveQuestionnaire(() => {

            self.CallWCF('AjouteACagnotteDataSens', { id: self.questionnaire.Code, codebarre: evaluation.Produit.CodeBarre, type: evaluation.Produit.Type, designation: evaluation.Produit.Designation }, () => {
                Framework.Progress.Show("Mise à jour de la cagnotte...");
            }, (res) => {
                Framework.Progress.Hide();
                if (res.Status == 'success') {
                    let obj = JSON.parse(res.Result);
                    self.showDivVerificationCagnotte(evaluation, Number(res.Result));
                } else {
                    alert(res.ErrorMessage)
                }
            });


        });
    }

    private verifieReponsePrécédente(precedent: string, next: Function) {

        let self = this;

        self.showDiv("html/modalRandom.html", () => {

            self.saveurATester = "";

            let saveAndClose = (correctAnswer: boolean) => {
                if (correctAnswer == false) {
                    self.questionnaire.DatesMauvaisesReponses.push(new Date(Date.now()));
                }
                self.questionnaire.NbEval++;
                next();
            };


            let b1 = Framework.Form.Button.Register("btnSale", () => { return true }, () => { precedent == "salé" ? saveAndClose(true) : saveAndClose(false) });
            let b2 = Framework.Form.Button.Register("btnSucre", () => { return true }, () => { precedent == "sucré" ? saveAndClose(true) : saveAndClose(false) });
            let b3 = Framework.Form.Button.Register("btnGras", () => { return true }, () => { precedent == "gras" ? saveAndClose(true) : saveAndClose(false) });
            let b4 = Framework.Form.Button.Register("btnAmer", () => { return true }, () => { saveAndClose(false) });

        });



    }

    private showDivEvaluationDejaGoute(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationDejaGoute.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            let g: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();
            let dejaGoute: string = "";

            let inputDejaGouteOui = Framework.Form.RadioElement.Register("inputDejaGouteOui", g, () => { dejaGoute = "O"; btnContinuerEvaluation.CheckState(); });
            let inputDejaGouteNon = Framework.Form.RadioElement.Register("inputDejaGouteNon", g, () => { dejaGoute = "N"; btnContinuerEvaluation.CheckState(); });
            let inputDejaGouteNSP = Framework.Form.RadioElement.Register("inputDejaGouteNSP", g, () => { dejaGoute = "NSP"; btnContinuerEvaluation.CheckState(); });

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => { return dejaGoute != ""; }, () => {
                evaluation.DejaGoute = dejaGoute;
                self.continuerEvaluation(evaluation);
            });
        });
    }

    private showDivPhotoComposition(evaluation: Models.EvaluationProduit) {
        let self = this;

        self.showDiv("html/divPhotoComposition.html", function () {


            let base64 = undefined;
            let recorder = new Framework.PhotoRecorder(document.getElementById("btnPhoto"), document.getElementById("video"));
            recorder.OnSave = (b64) => {
                base64 = b64;
                btnContinuerEvaluation.CheckState();
            };

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return base64 != undefined;
            }, () => {

                // Enregistrement
                self.CallWCF('TeleverseImageDataSens', { base64string: base64, dir: "compositions", filename: evaluation.Produit.CodeBarre }, () => { }, (res) => {
                    if (res.Status == "success") {
                        //evaluation.PhotoComposition = true;
                        self.saveQuestionnaire(() => { self.showDivAvantPhotoIngredients(evaluation); });
                    } else {
                        Framework.Modal.Alert("Erreur", "La photo n'a pas été téléversée, veuillez réessayer.");
                    }
                });


            });
        });
    }

    private showDivPhotoIngredients(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divPhotoIngredients.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            let base64 = undefined;

            let recorder = new Framework.PhotoRecorder(document.getElementById("btnPhoto"), document.getElementById("video"));
            recorder.OnSave = (b64) => {
                base64 = b64;
                btnContinuerEvaluation.CheckState();
            };

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return base64 != undefined;
            }, () => {

                // Enregistrement
                self.CallWCF('TeleverseImageDataSens', { base64string: base64, dir: "ingredients", filename: evaluation.Produit.CodeBarre }, () => { }, (res) => {
                    if (res.Status == "success") {
                        //evaluation.PhotoEmballage = true;
                        self.continuerEvaluation(evaluation);
                    } else {
                        Framework.Modal.Alert("Erreur", "La photo n'a pas été téléversée, veuillez réessayer.");
                    }
                });


            });
        });
    }

    private showDivPhotoEmballage(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divPhotoEmballage.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            let base64 = undefined;

            let recorder = new Framework.PhotoRecorder(document.getElementById("btnPhoto"), document.getElementById("video"));
            recorder.OnSave = (b64) => {
                base64 = b64;
                btnContinuerEvaluation.CheckState();
            };

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return base64 != undefined;
            }, () => {

                // Enregistrement
                self.CallWCF('TeleverseImageDataSens', { base64string: base64, dir: "emballages", filename: self.questionnaire.Code + "_" + evaluation.Produit.CodeBarre }, () => { }, (res) => {
                    if (res.Status == "success") {
                        evaluation.PhotoEmballage = true;
                        self.continuerEvaluation(evaluation);
                    } else {
                        Framework.Modal.Alert("Erreur", "La photo n'a pas été téléversée, veuillez réessayer.");
                    }
                });


            });
        });
    }

    private showDivEvaluationExpectedLiking(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationExpectedLiking.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            let sliderChecked = false;

            let slider: HTMLInputElement = <HTMLInputElement>document.getElementById("slider");
            slider.onchange = (ev) => {
                sliderChecked = true;
                btnContinuerEvaluation.CheckState();
            }

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return sliderChecked == true;
            }, () => {
                evaluation.ExpectedLiking = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });

        });
    }

    private showDivEvaluationApparence(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationApparence.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            let txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(3), () => { btnContinuerEvaluation.CheckState(); });

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return txtDescription.IsValid == true;
            }, () => {
                evaluation.DescriptionApparence = txtDescription.Value;
                self.continuerEvaluation(evaluation);
            });

        });
    }

    private showDivEvaluationStatedLiking(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationStatedLiking.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            let sliderChecked = false;

            let slider: HTMLInputElement = <HTMLInputElement>document.getElementById("slider");
            slider.onchange = (ev) => {
                sliderChecked = true;
                btnContinuerEvaluation.CheckState();
            }

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return sliderChecked == true;
            }, () => {
                evaluation.StatedLiking = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });

        });
    }

    private showDivEvaluationTexture(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationTexture.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            let txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(3), () => { btnContinuerEvaluation.CheckState(); });

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return txtDescription.IsValid == true;
            }, () => {
                evaluation.DescriptionTexture = txtDescription.Value;
                self.continuerEvaluation(evaluation);
            });

        });
    }

    private showDivEvaluationAime(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationAime.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            //let txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(3), () => { btnContinuerEvaluation.CheckState(); });

            let radioChecked1 = false;
            let group1: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();
            let r1: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("inputApparenceOui", group1, () => { evaluation.AimeApparence = 1; radioChecked1 = true; btnContinuerEvaluation.CheckState(); })
            let r2: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("inputApparenceNon", group1, () => { evaluation.AimeApparence = -1; radioChecked1 = true; btnContinuerEvaluation.CheckState(); })
            let r3: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("inputApparenceIndifferent", group1, () => { evaluation.AimeApparence = 0; radioChecked1 = true; btnContinuerEvaluation.CheckState(); })

            let radioChecked2 = false;
            let group2: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();
            let r4: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("inputTextureOui", group2, () => { evaluation.AimeTexture = 1; radioChecked2 = true; btnContinuerEvaluation.CheckState(); })
            let r5: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("inputTextureNon", group2, () => { evaluation.AimeTexture = -1; radioChecked2 = true; btnContinuerEvaluation.CheckState(); })
            let r6: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("inputTextureIndifferent", group2, () => { evaluation.AimeTexture = 0; radioChecked2 = true; btnContinuerEvaluation.CheckState(); })

            let radioChecked3 = false;
            let group3: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();
            let r7: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("inputGoutOui", group3, () => { evaluation.AimeGout = 1; radioChecked3 = true; btnContinuerEvaluation.CheckState(); })
            let r8: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("inputGoutNon", group3, () => { evaluation.AimeGout = -1; radioChecked3 = true; btnContinuerEvaluation.CheckState(); })
            let r9: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("inputGoutIndifferent", group3, () => { evaluation.AimeGout = 0; radioChecked3 = true; btnContinuerEvaluation.CheckState(); })

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                //return txtDescription.IsValid == true;
                return radioChecked1 == true && radioChecked2 == true && radioChecked3 == true;
            }, () => {
                //evaluation.DescriptionAime = txtDescription.Value;
                self.continuerEvaluation(evaluation);
            });

        });
    }

    //private showDivEvaluationPasAime(evaluation: Models.EvaluationProduit) {
    //    let self = this;
    //    self.showDiv("html/divEvaluationPasAime.html", () => {
    //        let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

    //        let txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(3), () => { btnContinuerEvaluation.CheckState(); });

    //        let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
    //            return txtDescription.IsValid == true;
    //        }, () => {
    //            evaluation.DescriptionPasAime = txtDescription.Value;
    //            self.continuerEvaluation(evaluation);
    //        });

    //    });
    //}

    private showDivEvaluationGout(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationGout.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            let txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(3), () => { btnContinuerEvaluation.CheckState(); });

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return txtDescription.IsValid == true;
            }, () => {
                evaluation.DescriptionGout = txtDescription.Value;
                self.continuerEvaluation(evaluation);
            });

        });
    }

    private showDivEvaluationJARSucre(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationJARSucre.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            let radioChecked = false;

            let group: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();
            let r1: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check1", group, () => { evaluation.JARSucre = -2; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r2: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check2", group, () => { evaluation.JARSucre = -1; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r3: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check3", group, () => { evaluation.JARSucre = 0; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r4: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check4", group, () => { evaluation.JARSucre = 1; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r5: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check5", group, () => { evaluation.JARSucre = 2; radioChecked = true; btnContinuerEvaluation.CheckState(); })


            //let slider: HTMLInputElement = <HTMLInputElement>document.getElementById("slider");
            //slider.onchange = (ev) => {
            //    radioChecked = true;
            //    btnContinuerEvaluation.CheckState();
            //}

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return radioChecked == true;
            }, () => {
                //evaluation.JARSucre = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });

        });
    }

    private showDivEvaluationJARSale(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationJARSale.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            //let sliderChecked = false;

            //let slider: HTMLInputElement = <HTMLInputElement>document.getElementById("slider");
            //slider.onchange = (ev) => {
            //    sliderChecked = true;
            //    btnContinuerEvaluation.CheckState();
            //}

            let radioChecked = false;

            let group: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();
            let r1: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check1", group, () => { evaluation.JARSale = -2; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r2: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check2", group, () => { evaluation.JARSale = -1; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r3: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check3", group, () => { evaluation.JARSale = 0; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r4: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check4", group, () => { evaluation.JARSale = 1; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r5: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check5", group, () => { evaluation.JARSale = 2; radioChecked = true; btnContinuerEvaluation.CheckState(); })


            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return radioChecked == true;
            }, () => {
                //evaluation.JARSale = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });

        });
    }

    private showDivEvaluationJARGras(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationJARGras.html", () => {
            let divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");

            //let sliderChecked = false;

            //let slider: HTMLInputElement = <HTMLInputElement>document.getElementById("slider");
            //slider.onchange = (ev) => {
            //    sliderChecked = true;
            //    btnContinuerEvaluation.CheckState();
            //}


            let radioChecked = false;

            let group: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();
            let r1: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check1", group, () => { evaluation.JARGras = -2; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r2: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check2", group, () => { evaluation.JARGras = -1; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r3: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check3", group, () => { evaluation.JARGras = 0; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r4: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check4", group, () => { evaluation.JARGras = 1; radioChecked = true; btnContinuerEvaluation.CheckState(); })
            let r5: Framework.Form.RadioElement = Framework.Form.RadioElement.Register("check5", group, () => { evaluation.JARGras = 2; radioChecked = true; btnContinuerEvaluation.CheckState(); })


            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return radioChecked == true;
            }, () => {
                //evaluation.JARGras = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });

        });
    }

    private showDivEvaluationRachat(evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationRachat.html", () => {


            let g: Framework.Form.RadioGroup = new Framework.Form.RadioGroup();
            let rachat: string = "";

            let inputRachatOui = Framework.Form.RadioElement.Register("inputRachatOui", g, () => { rachat = "O"; btnContinuerEvaluation.CheckState(); });
            let inputRachatNon = Framework.Form.RadioElement.Register("inputRachatNon", g, () => { rachat = "N"; btnContinuerEvaluation.CheckState(); });
            let inputRachatNSP = Framework.Form.RadioElement.Register("inputRachatNSP", g, () => { rachat = "NSP"; btnContinuerEvaluation.CheckState(); });

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => { return rachat != ""; }, () => {
                evaluation.IntentionReachat = rachat;
                evaluation.DateFin = new Date(Date.now());
                evaluation.EvaluationTerminee = true;
                self.continuerEvaluation(evaluation);
            });

        });
    }

    private showDivVerificationCagnotte(evaluation: Models.EvaluationProduit, restant: number) {

        let self = this;
        self.showDiv("html/divVerificationCagnotte.html", () => {


            let divConfirmation = Framework.Form.TextElement.Register("divConfirmation");
            divConfirmation.Hide();

            let pIndemnisationOK = Framework.Form.TextElement.Register("pIndemnisationOK");
            let pIndemnisationKO = Framework.Form.TextElement.Register("pIndemnisationKO"); pIndemnisationKO.Hide();

            let canContinue = true;

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => { return canContinue; }, () => {
                self.showDivMenu();
            });
            btnContinuerEvaluation.Hide();

            if (restant >= 10) {


                self.saveQuestionnaire(() => {

                    self.CallWCF('IndemnisationDataSens', { id: self.questionnaire.Code }, () => {
                        Framework.Progress.Show("Mise à jour de la cagnotte...");
                    }, (res) => {
                        Framework.Progress.Hide();
                        if (res.Status == 'success') {
                            canContinue = false;
                            divConfirmation.Show();
                            btnContinuerEvaluation.CheckState();

                            let checkConfim = Framework.Form.CheckBox.Register("checkConfim", () => { return true; }, () => {
                                canContinue = checkConfim.IsChecked;
                                btnContinuerEvaluation.CheckState();
                                if (self.questionnaire.ListIndemnisations == null || self.questionnaire.ListIndemnisations == undefined) {
                                    self.questionnaire.ListIndemnisations = []; 
                                }
                                if (canContinue && self.questionnaire.ListIndemnisations.indexOf(res.Result) < 0) {
                                    self.questionnaire.ListIndemnisations.push(res.Result);
                                    self.saveQuestionnaire();
                                }
                            }, "");

                            pIndemnisationOK.SetHtml("Un mail contenant un lien vers votre indemnisation vous a été envoyé. Merci de confirmer sa bonne réception en cliquant sur la case ci-dessous.");
                        } else {
                            divConfirmation.Hide();
                            alert(res.ErrorMessage)
                        }
                    });
                    btnContinuerEvaluation.Show();

                });


                //pIndemnisationOK.Show();

            } else {
                pIndemnisationKO.Show();
                btnContinuerEvaluation.Show();
            }

        });
    }

    private showDivIndemnisation() {
        this.showDiv("html/divIndemnisation.html", () => {
        });
    }

    private showDivEvaluationApparenceIdeal(p: Models.ProduitIdeal, evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationApparenceIdeal.html", () => {



            let spanProduit = Framework.Form.TextElement.Register("spanProduit");
            if (p.Type == "cookie") {
                spanProduit.Set("cookie idéal");
            }
            if (p.Type == "pizza") {
                spanProduit.Set("pizza idéale");
            }
            if (p.Type == "pain de mie") {
                spanProduit.Set("pain de mie idéal");
            }

            let txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(6), () => { btnContinuerEvaluation.CheckState(); });

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return txtDescription.IsValid == true;
            }, () => {
                p.DescriptionApparence = txtDescription.Value;
                self.saveQuestionnaire(() => { self.showDivEvaluationTextureIdeal(p, evaluation); });
            });

        });
    }

    private showDivEvaluationTextureIdeal(p: Models.ProduitIdeal, evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationTextureIdeal.html", () => {

            let spanProduit = Framework.Form.TextElement.Register("spanProduit");
            if (p.Type == "cookie") {
                spanProduit.Set("cookie idéal");
            }
            if (p.Type == "pizza") {
                spanProduit.Set("pizza idéale");
            }
            if (p.Type == "pain de mie") {
                spanProduit.Set("pain de mie idéal");
            }

            let txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(6), () => { btnContinuerEvaluation.CheckState(); });

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return txtDescription.IsValid == true;
            }, () => {
                p.DescriptionTexture = txtDescription.Value;
                self.saveQuestionnaire(() => { self.showDivEvaluationGoutIdeal(p, evaluation); });
            });

        });
    }

    private showDivEvaluationGoutIdeal(p: Models.ProduitIdeal, evaluation: Models.EvaluationProduit) {
        let self = this;
        self.showDiv("html/divEvaluationGoutIdeal.html", () => {

            let spanProduit = Framework.Form.TextElement.Register("spanProduit");
            if (p.Type == "cookie") {
                spanProduit.Set("cookie idéal");
            }
            if (p.Type == "pizza") {
                spanProduit.Set("pizza idéale");
            }
            if (p.Type == "pain de mie") {
                spanProduit.Set("pain de mie idéal");
            }

            let txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(6), () => { btnContinuerEvaluation.CheckState(); });

            let btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", () => {
                return txtDescription.IsValid == true;
            }, () => {
                p.DescriptionGout = txtDescription.Value;
                p.DateFin = new Date(Date.now());
                p.Evalue = true;
                self.ajouteACagnotte(evaluation);

            });

        });
    }

    private saveQuestionnaire(onSuccess: () => void = () => { }) {
        let self = this;

        if (self.questionnaire.DatesAcces == undefined) {
            self.questionnaire.DatesAcces = [];
        }

        if (self.questionnaire.EvaluationProduit == undefined) {
            self.questionnaire.EvaluationProduit = [];
        }

        //if (self.questionnaire.ListeFoodChoice == undefined) {
        //    self.questionnaire.ListeFoodChoice = [];
        //}

        if (self.questionnaire.ListeProduitIdeal == undefined) {
            self.questionnaire.ListeProduitIdeal = [];
        }

        this.questionnaire.DatesAcces.push(new Date(Date.now()));
        self.CallWCF('SaveQuestionnaireDataSens', { code: self.questionnaire.Code, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, () => {
            Framework.Progress.Show("Enregistrement...");
        }, (res) => {
            Framework.Progress.Hide();

            if (res.Status == 'success') {
                onSuccess();
            } else {
                Framework.Modal.Alert("Erreur", "Une erreur a eu lieu pendant l'enregistrement du fichier.", () => { onSuccess(); })
            }
        });

    }

}

