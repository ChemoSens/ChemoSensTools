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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var DataSensInscriptionApp = /** @class */ (function (_super) {
    __extends(DataSensInscriptionApp, _super);
    function DataSensInscriptionApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        return _super.call(this, DataSensInscriptionApp.GetRequirements(), isInTest) || this;
    }
    DataSensInscriptionApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/crocnoteurs';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
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
        requirements.Required = []; //TODO;
        //requirements.Extensions = ["Rating", "Slider"];
        return requirements;
    };
    DataSensInscriptionApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    DataSensInscriptionApp.prototype.showDiv = function (htmlPath, onLoaded) {
        var self = this;
        document.body.innerHTML = "";
        var path = DataSensInscriptionApp.GetRequirements().AppUrl + "/" + htmlPath;
        Framework.BaseView.Load(path, "body", function (div) {
            onLoaded();
        });
    };
    //private questionnaire: Models.QuestionnaireSensas;
    DataSensInscriptionApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        var self = this;
        self.inscription = new Models.InscriptionSensas();
        //self.questionnaire = new Models.QuestionnaireSensas();
        this.showDivInscription1a();
    };
    DataSensInscriptionApp.prototype.showDivInscription1a = function () {
        var self = this;
        self.showDiv("html/divInscription1a.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.showDivInscription1b();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription1b = function () {
        var self = this;
        self.showDiv("html/divInscription1b.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.showDivInscription1c();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription1c = function () {
        var self = this;
        self.showDiv("html/divInscription1c.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.showDivInscription1d();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription1d = function () {
        var self = this;
        self.showDiv("html/divInscription1d.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.showDivInscription1e();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription1e = function () {
        var self = this;
        self.showDiv("html/divInscription1e.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.showDivInscription1f();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription1f = function () {
        var self = this;
        self.showDiv("html/divInscription1f.html", function () {
            var pTest = Framework.Form.TextElement.Register("pTest");
            var btnTest = Framework.Form.Button.Register("btnTest", function () {
                return true;
            }, function () {
                self.inscription.TestNavigateur = 1;
                pTest.Show();
                btnTest.Hide();
            });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.showDivInscription1g();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription1g = function () {
        var self = this;
        self.showDiv("html/divInscription1g.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.showDivInscription2();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription2 = function () {
        var self = this;
        self.showDiv("html/divInscription2.html", function () {
            var input18 = Framework.Form.CheckBox.Register("input18", function () { return true; }, function (ev, cb) { btnContinuer.CheckState(); }, "");
            //let inputInfos = Framework.Form.CheckBox.Register("inputInfos", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            //let inputInfos1 = Framework.Form.CheckBox.Register("inputInfos1", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            //let inputInfos2 = Framework.Form.CheckBox.Register("inputInfos2", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            var inputInfos3 = Framework.Form.CheckBox.Register("inputInfos3", function () { return true; }, function (ev, cb) { btnContinuer.CheckState(); }, "");
            var inputInfos4 = Framework.Form.CheckBox.Register("inputInfos4", function () { return true; }, function (ev, cb) { btnContinuer.CheckState(); }, "");
            //let inputInfos5 = Framework.Form.CheckBox.Register("inputInfos5", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            //let inputInfos6 = Framework.Form.CheckBox.Register("inputInfos6", () => { return true }, (ev, cb) => { btnContinuer.CheckState(); }, "");
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return input18.IsChecked && inputInfos3.IsChecked == true && inputInfos4.IsChecked == true;
            }, function () {
                self.showDivInscription2a();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription2a = function () {
        var self = this;
        self.showDiv("html/divInscription2a.html", function () {
            var tConditions = Framework.Form.InputText.Register("tConditions", "", Framework.Form.Validator.NoValidation(), function (txt) {
                self.inscription.TexteConditions = txt;
                txt = txt.toLowerCase();
                if (txt.indexOf("cepte") > -1 && txt.indexOf("condition") > -1) {
                    self.inscription.AccepteConditions = 1;
                }
            });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.showDivInscription4();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription2b = function () {
        var self = this;
        self.showDiv("html/divInscription2b.html", function () {
            var base64 = undefined;
            var recorder = new Framework.PhotoRecorder(document.getElementById("btnPhoto"), document.getElementById("video"));
            recorder.OnSave = function (b64) {
                base64 = b64;
                btnContinuer.CheckState();
            };
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return base64 != undefined;
            }, function () {
                //// Enregistrement
                var dt = new Date().getTime();
                self.inscription.UUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (dt + Math.random() * 16) % 16 | 0;
                    dt = Math.floor(dt / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                self.CallWCF('TeleverseImageDataSens', { base64string: base64, dir: "justificatifs", filename: self.inscription.UUID }, function () { }, function (res) {
                    if (res.Status == "success") {
                        self.showDivInscription3();
                    }
                    else {
                        Framework.Modal.Alert("Erreur", "Le justificatif n'a pas été téléversé.");
                    }
                });
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription3 = function () {
        var self = this;
        self.showDiv("html/divInscription3.html", function () {
            //let divResultat = Framework.Form.TextElement.Register("divResultat");
            //let inputMail = Framework.Form.InputText.Register("inputMail", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), (mail) => { btnContinuer.CheckState(); });
            //let inputMail2 = Framework.Form.InputText.Register("inputMail2", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), (mail) => { btnContinuer.CheckState(); });
            var inputAdresse = Framework.Form.InputText.Register("inputAdresse", "", Framework.Form.Validator.MinLength(2, "Le champ Adresse est requis"), function (adresse) { self.inscription.Adresse = adresse; btnContinuer.CheckState(); });
            var inputCP = Framework.Form.InputText.Register("inputCP", "", Framework.Form.Validator.CodePostal("Le champ CP est requis"), function (cp) { self.inscription.CP = cp; btnContinuer.CheckState(); });
            var inputVille = Framework.Form.InputText.Register("inputVille", "", Framework.Form.Validator.MinLength(2, "Le champ Ville est requis"), function (ville) { self.inscription.Ville = ville; btnContinuer.CheckState(); });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                //return inputMail.IsValid == true && inputMail2.IsValid == true && inputMail.Value == inputMail2.Value;
                return inputAdresse.IsValid == true && inputCP.IsValid == true && inputVille.IsValid == true;
            }, function () {
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
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription4 = function () {
        var self = this;
        self.showDiv("html/divInscription4.html", function () {
            var divResultat = Framework.Form.TextElement.Register("divResultat");
            var g2 = Framework.Form.RadioGroup.Register();
            var inputCiviliteMme = Framework.Form.RadioElement.Register("inputCiviliteMme", g2, function () { self.inscription.Genre = "Feminin"; btnContinuer.CheckState(); });
            var inputCiviliteMr = Framework.Form.RadioElement.Register("inputCiviliteMr", g2, function () { self.inscription.Genre = "Masculin"; btnContinuer.CheckState(); });
            var inputNom = Framework.Form.InputText.Register("inputNom", "", Framework.Form.Validator.MinLength(2, "Le champ Nom est requis"), function (nom) { self.inscription.Nom = nom; btnContinuer.CheckState(); });
            var inputPrenom = Framework.Form.InputText.Register("inputPrenom", "", Framework.Form.Validator.MinLength(2, "Le champ Prénom est requis"), function (prenom) { self.inscription.Prenom = prenom; btnContinuer.CheckState(); });
            var inputDateNaissance = Framework.Form.InputText.Register("inputDateNaissance", "", Framework.Form.Validator.FrenchDate(2004, "Le champ Date est requis (format : JJ/MM/AAAA) et vous devez avoir plus de 18 ans."), function (naissance) {
                var y = Number(naissance.substr(6, 4));
                var m = Number(naissance.substr(3, 2));
                var d = Number(naissance.substr(0, 2));
                self.inscription.DateNaissance = new Date(y, m - 1, d);
                btnContinuer.CheckState();
            });
            var inputMail = Framework.Form.InputText.Register("inputMail", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), function (mail) { btnContinuer.CheckState(); });
            var inputMail2 = Framework.Form.InputText.Register("inputMail2", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), function (mail) { btnContinuer.CheckState(); });
            var inputInfos = Framework.Form.CheckBox.Register("inputInfos", function () { return true; }, function (ev, cb) { btnContinuer.CheckState(); }, "");
            //let inputAdresse = Framework.Form.InputText.Register("inputAdresse", "", Framework.Form.Validator.MinLength(2, "Le champ Adresse est requis"), (adresse) => { self.inscription.Adresse = adresse; btnContinuer.CheckState(); });
            //let inputCP = Framework.Form.InputText.Register("inputCP", "", Framework.Form.Validator.CodePostal("Le champ CP est requis"), (cp) => { self.inscription.CP = cp; btnContinuer.CheckState(); });
            //let inputVille = Framework.Form.InputText.Register("inputVille", "", Framework.Form.Validator.MinLength(2, "Le champ Ville est requis"), (ville) => { self.inscription.Ville = ville; btnContinuer.CheckState(); });
            var customValidator = Framework.Form.Validator.Custom(function (value) {
                var res = "";
                if (value.replace(/\D/g, "").length != 10) {
                    res = Framework.LocalizationManager.Get("Numéro de téléphone : 10 chiffres attendus");
                }
                return res;
            });
            //let inputTelephone = Framework.Form.InputText.Register("inputTelephone", "", customValidator, (tel) => { self.inscription.Telephone = tel; btnContinuer.CheckState(); });
            //let inputNbMajeurs = Framework.Form.InputText.Register("inputNbMajeurs", "", Framework.Form.Validator.IsNumber("positiveInteger", "Le champ Nombre de personnes majeures est requis"), (nbMajeurs) => { self.inscription.NbMajeurs = nbMajeurs; btnContinuer.CheckState(); });
            //let inputNbMineurs = Framework.Form.InputText.Register("inputNbMineurs", "", Framework.Form.Validator.IsNumber("integer", "Le champ Nombre de personnes mineures est requis"), (nbMineurs) => { self.inscription.NbMineurs = nbMineurs; btnContinuer.CheckState(); });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return inputInfos.IsChecked == true && self.inscription.Genre != "" && /*inputTelephone.IsValid &&*/ inputNom.IsValid && inputPrenom.IsValid && inputDateNaissance.IsValid && /*inputAdresse.IsValid && inputCP.IsValid && inputVille.IsValid &&*/ inputMail.IsValid == true && inputMail2.IsValid == true && inputMail.Value == inputMail2.Value /*&& inputNbMajeurs.IsValid && inputNbMineurs.IsValid*/;
            }, function () {
                var todayDate = new Date().getTime();
                var birthDate = self.inscription.DateNaissance.getTime();
                var age = (todayDate - birthDate) / (1000 * 60 * 60 * 24 * 365);
                if (age < 18) {
                    Framework.Modal.Alert("", "Vous devez avoir plus de 18 ans.");
                }
                else {
                    self.CallWCF('VerifieMailDataSens', { mail: inputMail.Value }, function () {
                        Framework.Progress.Show("Vérification en cours...");
                    }, function (res) {
                        Framework.Progress.Hide();
                        if (res.Status == 'success') {
                            self.inscription.Mail = inputMail.Value;
                            //self.showDivInscription6a();
                            self.showDivInscription5();
                        }
                        else {
                            divResultat.SetHtml("<p>" + res.ErrorMessage + "</p>");
                        }
                    });
                }
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription5 = function () {
        var self = this;
        self.showDiv("html/divInscription5.html", function () {
            var g1 = Framework.Form.RadioGroup.Register();
            var inputCSPa = Framework.Form.RadioElement.Register("inputCSPa", g1, function () { self.inscription.CSP = "Agriculteurs exploitants"; btnContinuer.CheckState(); });
            var inputCSPb = Framework.Form.RadioElement.Register("inputCSPb", g1, function () { self.inscription.CSP = "Artisans, commerçants et chefs d'entreprise"; btnContinuer.CheckState(); });
            var inputCSPc = Framework.Form.RadioElement.Register("inputCSPc", g1, function () { self.inscription.CSP = "Cadres et professions intellectuelles supérieures"; btnContinuer.CheckState(); });
            var inputCSPd = Framework.Form.RadioElement.Register("inputCSPd", g1, function () { self.inscription.CSP = "Professions Intermédiaires"; btnContinuer.CheckState(); });
            var inputCSPe = Framework.Form.RadioElement.Register("inputCSPe", g1, function () { self.inscription.CSP = "Employés"; btnContinuer.CheckState(); });
            var inputCSPf = Framework.Form.RadioElement.Register("inputCSPf", g1, function () { self.inscription.CSP = "Ouvriers"; btnContinuer.CheckState(); });
            var inputCSPg = Framework.Form.RadioElement.Register("inputCSPg", g1, function () { self.inscription.CSP = "Sans activité professionnelle"; btnContinuer.CheckState(); });
            var inputCSPh = Framework.Form.RadioElement.Register("inputCSPh", g1, function () { self.inscription.CSP = "Etudiants"; btnContinuer.CheckState(); });
            var inputCSPi = Framework.Form.RadioElement.Register("inputCSPi", g1, function () { self.inscription.CSP = "Retraités"; btnContinuer.CheckState(); });
            var g2 = Framework.Form.RadioGroup.Register();
            var inputDiplomea = Framework.Form.RadioElement.Register("inputDiplomea", g2, function () { self.inscription.NiveauEtudes = "Aucun diplôme, brevet des collèges"; btnContinuer.CheckState(); });
            var inputDiplomeb = Framework.Form.RadioElement.Register("inputDiplomeb", g2, function () { self.inscription.NiveauEtudes = "CAP, BEP ou équivalent"; btnContinuer.CheckState(); });
            var inputDiplomec = Framework.Form.RadioElement.Register("inputDiplomec", g2, function () { self.inscription.NiveauEtudes = "Baccalauréat ou équivalent"; btnContinuer.CheckState(); });
            var inputDiplomed = Framework.Form.RadioElement.Register("inputDiplomed", g2, function () { self.inscription.NiveauEtudes = "Bac + 2"; btnContinuer.CheckState(); });
            var inputDiplomee = Framework.Form.RadioElement.Register("inputDiplomee", g2, function () { self.inscription.NiveauEtudes = "Bac + 2 à Bac + 5"; btnContinuer.CheckState(); });
            var inputDiplomef = Framework.Form.RadioElement.Register("inputDiplomef", g2, function () { self.inscription.NiveauEtudes = "Supérieur à Bac + 5"; btnContinuer.CheckState(); });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return self.inscription.CSP != "" && self.inscription.NiveauEtudes != "";
            }, function () {
                self.showDivInscription6a();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription6a = function () {
        var self = this;
        self.showDiv("html/divInscription6a.html", function () {
            var consoPizza = 0;
            var g1 = Framework.Form.RadioGroup.Register();
            var inputConsoPizzaPlusieursFoisSemaine = Framework.Form.RadioElement.Register("inputConsoPizzaPlusieursFoisSemaine", g1, function () { self.inscription.FreqConsoPizza = "Plusieurs fos par semaine"; consoPizza = 1; btnContinuer.CheckState(); });
            var inputConsoPizzaPlusieursFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoPizzaEnvironUneFoisParSemaine", g1, function () { self.inscription.FreqConsoPizza = "Environ une fois par semaine"; consoPizza = 1; btnContinuer.CheckState(); });
            //let inputConsoPizzaUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoPizzaUneFoisParSemaine", g1, () => { self.inscription.FreqConsoPizza = "Au moins une fois par mois"; consoPizza = 1; btnContinuer.CheckState(); });
            var inputConsoPizzaEnvironUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoPizzaEnvironUneFoisParMois", g1, function () { self.inscription.FreqConsoPizza = "Environ une fois par mois"; consoPizza = 1; btnContinuer.CheckState(); });
            var inputConsoPizzaMoinsUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoPizzaMoinsUneFoisParMois", g1, function () { self.inscription.FreqConsoPizza = "Moins d'une fois par mois"; consoPizza = 1; btnContinuer.CheckState(); });
            var inputConsoPizzaJamais = Framework.Form.RadioElement.Register("inputConsoPizzaJamais", g1, function () { self.inscription.FreqConsoPizza = "Jamais"; consoPizza = 1; btnContinuer.CheckState(); });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return consoPizza == 1;
            }, function () {
                // Raison d'achat pizza
                //if (self.inscription.FreqConsoPizza != "Jamais") {
                //    self.showDivEvaluationFoodChoice1("pizza");
                //} else {
                self.showDivInscription6a1();
                //}
                //self.showDivInscription7();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription6a1 = function () {
        var self = this;
        self.showDiv("html/divInscription6a1.html", function () {
            var consoPizza = 0;
            var inputConsoPizzabon = Framework.Form.CheckBox.Register("inputConsoPizzaPizzabon", function () { return true; }, function () {
                self.inscription.Pizzabon = inputConsoPizzabon.IsChecked ? 1 : 0;
            }, "");
            var inputConsoPizzaStromboli = Framework.Form.CheckBox.Register("inputConsoPizzaStromboli", function () { return true; }, function () {
                self.inscription.Stromboli = inputConsoPizzaStromboli.IsChecked ? 1 : 0;
            }, "");
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                // Raison d'achat pizza
                //if (self.inscription.FreqConsoPizza != "Jamais") {
                //    self.showDivEvaluationFoodChoice1("pizza");
                //} else {
                self.showDivInscription6b();
                //}
                //self.showDivInscription7();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription6b1 = function () {
        var self = this;
        self.showDiv("html/divInscription6b1.html", function () {
            var consoPizza = 0;
            var inputConsoCookicroc = Framework.Form.CheckBox.Register("inputConsoCookicroc", function () { return true; }, function () {
                self.inscription.Cookicroc = inputConsoCookicroc.IsChecked ? 1 : 0;
            }, "");
            var inputConsoTanteAdele = Framework.Form.CheckBox.Register("inputConsoTanteAdele", function () { return true; }, function () {
                self.inscription.TanteAdele = inputConsoTanteAdele.IsChecked ? 1 : 0;
            }, "");
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                // Raison d'achat pizza
                //if (self.inscription.FreqConsoPizza != "Jamais") {
                //    self.showDivEvaluationFoodChoice1("pizza");
                //} else {
                self.showDivInscription6c();
                //}
                //self.showDivInscription7();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription6c1 = function () {
        var self = this;
        self.showDiv("html/divInscription6c1.html", function () {
            var consoPizza = 0;
            var inputConsoToastinou = Framework.Form.CheckBox.Register("inputConsoToastinou", function () { return true; }, function () {
                self.inscription.Toastinou = inputConsoToastinou.IsChecked ? 1 : 0;
            }, "");
            var inputConsoMamieDouce = Framework.Form.CheckBox.Register("inputConsoMamieDouce", function () { return true; }, function () {
                self.inscription.MamieDouce = inputConsoMamieDouce.IsChecked ? 1 : 0;
            }, "");
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                if (((self.inscription.FreqConsoPizza == "Jamais") && (self.inscription.FreqConsoPainMie == "Jamais") && (self.inscription.FreqConsoCookie == "Jamais")) /*|| self.inscription.TestNavigateur == 0 || self.inscription.AccepteConditions == 0*/
                    || self.inscription.Pizzabon == 1 || self.inscription.Stromboli == 1 || self.inscription.Cookicroc == 1 || self.inscription.TanteAdele == 1 || self.inscription.Toastinou == 1 || self.inscription.MamieDouce == 1) {
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
                }
                else {
                    self.showDivInscription6d();
                }
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription6d = function () {
        var self = this;
        self.showDiv("html/divInscription6d.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.showDivInscription2b();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivEvaluationFoodChoice1 = function ( /*type: string*/) {
        var self = this;
        self.showDiv("html/divEvaluationFoodChoice1.html", function () {
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
            var g1Checked = false;
            var g1 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("healthy1", g1, function () { self.inscription.Healthy = 1; g1Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("healthy2", g1, function () { self.inscription.Healthy = 2; g1Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("healthy3", g1, function () { self.inscription.Healthy = 3; g1Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("healthy4", g1, function () { self.inscription.Healthy = 4; g1Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("healthy5", g1, function () { self.inscription.Healthy = 5; g1Checked = true; btnContinuer.CheckState(); });
            var g2Checked = false;
            var g2 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("mood1", g2, function () { self.inscription.MoodMonitoring = 1; g2Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("mood2", g2, function () { self.inscription.MoodMonitoring = 2; g2Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("mood3", g2, function () { self.inscription.MoodMonitoring = 3; g2Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("mood4", g2, function () { self.inscription.MoodMonitoring = 4; g2Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("mood5", g2, function () { self.inscription.MoodMonitoring = 5; g2Checked = true; btnContinuer.CheckState(); });
            var g3Checked = false;
            var g3 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("convenient1", g3, function () { self.inscription.Convenient = 1; g3Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("convenient2", g3, function () { self.inscription.Convenient = 2; g3Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("convenient3", g3, function () { self.inscription.Convenient = 3; g3Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("convenient4", g3, function () { self.inscription.Convenient = 4; g3Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("convenient5", g3, function () { self.inscription.Convenient = 5; g3Checked = true; btnContinuer.CheckState(); });
            var g4Checked = false;
            var g4 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("pleasure1", g4, function () { self.inscription.Pleasure = 1; g4Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("pleasure2", g4, function () { self.inscription.Pleasure = 2; g4Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("pleasure3", g4, function () { self.inscription.Pleasure = 3; g4Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("pleasure4", g4, function () { self.inscription.Pleasure = 4; g4Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("pleasure5", g4, function () { self.inscription.Pleasure = 5; g4Checked = true; btnContinuer.CheckState(); });
            var g5Checked = false;
            var g5 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("natural1", g5, function () { self.inscription.Natural = 1; g5Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("natural2", g5, function () { self.inscription.Natural = 2; g5Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("natural3", g5, function () { self.inscription.Natural = 3; g5Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("natural4", g5, function () { self.inscription.Natural = 4; g5Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("natural5", g5, function () { self.inscription.Natural = 5; g5Checked = true; btnContinuer.CheckState(); });
            var g6Checked = false;
            var g6 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("affordable1", g6, function () { self.inscription.Affordable = 1; g6Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("affordable2", g6, function () { self.inscription.Affordable = 2; g6Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("affordable3", g6, function () { self.inscription.Affordable = 3; g6Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("affordable4", g6, function () { self.inscription.Affordable = 4; g6Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("affordable5", g6, function () { self.inscription.Affordable = 5; g6Checked = true; btnContinuer.CheckState(); });
            var g7Checked = false;
            var g7 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("weight1", g7, function () { self.inscription.WeightControl = 1; g7Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("weight2", g7, function () { self.inscription.WeightControl = 2; g7Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("weight3", g7, function () { self.inscription.WeightControl = 3; g7Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("weight4", g7, function () { self.inscription.WeightControl = 4; g7Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("weight5", g7, function () { self.inscription.WeightControl = 5; g7Checked = true; btnContinuer.CheckState(); });
            var g8Checked = false;
            var g8 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("familiarity1", g8, function () { self.inscription.Familiar = 1; g8Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("familiarity2", g8, function () { self.inscription.Familiar = 2; g8Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("familiarity3", g8, function () { self.inscription.Familiar = 3; g8Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("familiarity4", g8, function () { self.inscription.Familiar = 4; g8Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("familiarity5", g8, function () { self.inscription.Familiar = 5; g8Checked = true; btnContinuer.CheckState(); });
            var btnContinuer = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return g1Checked == true && g2Checked == true && g3Checked == true && g4Checked == true && g5Checked == true && g6Checked == true && g7Checked == true && g8Checked == true /*&& g9Checked == true && g10Checked == true && g11Checked == true*/;
            }, function () {
                self.showDivEvaluationFoodChoice2( /*type*/);
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivEvaluationFoodChoice2 = function ( /*type: string*/) {
        var self = this;
        self.showDiv("html/divEvaluationFoodChoice2.html", function () {
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
            var g9Checked = false;
            var g9 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("environment1", g9, function () { self.inscription.EnvironmentalFriendly = 1; g9Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("environment2", g9, function () { self.inscription.EnvironmentalFriendly = 2; g9Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("environment3", g9, function () { self.inscription.EnvironmentalFriendly = 3; g9Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("environment4", g9, function () { self.inscription.EnvironmentalFriendly = 4; g9Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("environment5", g9, function () { self.inscription.EnvironmentalFriendly = 5; g9Checked = true; btnContinuer.CheckState(); });
            var g10Checked = false;
            var g10 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("fairtrade1", g10, function () { self.inscription.FairlyTrade = 1; g10Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("fairtrade2", g10, function () { self.inscription.FairlyTrade = 2; g10Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("fairtrade3", g10, function () { self.inscription.FairlyTrade = 3; g10Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("fairtrade4", g10, function () { self.inscription.FairlyTrade = 4; g10Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("fairtrade5", g10, function () { self.inscription.FairlyTrade = 5; g10Checked = true; btnContinuer.CheckState(); });
            var g11Checked = false;
            var g11 = Framework.Form.RadioGroup.Register();
            Framework.Form.RadioElement.Register("animal1", g11, function () { self.inscription.AnimalFriendly = 1; g11Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("animal2", g11, function () { self.inscription.AnimalFriendly = 2; g11Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("animal3", g11, function () { self.inscription.AnimalFriendly = 3; g11Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("animal4", g11, function () { self.inscription.AnimalFriendly = 4; g11Checked = true; btnContinuer.CheckState(); });
            Framework.Form.RadioElement.Register("animal5", g11, function () { self.inscription.AnimalFriendly = 5; g11Checked = true; btnContinuer.CheckState(); });
            var btnContinuer = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return /*g1Checked == true && g2Checked == true && g3Checked == true && g4Checked == true && g5Checked == true && g6Checked == true && g7Checked == true && g8Checked == true && */ g9Checked == true && g10Checked == true && g11Checked == true;
            }, function () {
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
    };
    DataSensInscriptionApp.prototype.showDivMauvaisProfil = function () {
        var self = this;
        self.showDiv("html/divMauvaisProfil.html", function () {
            self.CallWCF('InscriptionDataSens', { inscriptionJson: JSON.stringify(self.inscription), mail: self.inscription.Mail, sendMail: false, valid: false }, function () {
                Framework.Progress.Show("Enregistrement...");
            }, function (res) {
                Framework.Progress.Hide();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription6b = function () {
        var self = this;
        self.showDiv("html/divInscription6b.html", function () {
            var consoCookie = 0;
            var g2 = Framework.Form.RadioGroup.Register();
            var inputConsoCookiePlusieursFoisSemaine = Framework.Form.RadioElement.Register("inputConsoCookiePlusieursFoisSemaine", g2, function () { self.inscription.FreqConsoCookie = "Plusieurs fois par semaine"; consoCookie = 1; btnContinuer.CheckState(); });
            var inputConsoCookieEnvironUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoCookieEnvironUneFoisParSemaine", g2, function () { self.inscription.FreqConsoCookie = "Environ une fois par semaine"; consoCookie = 1; btnContinuer.CheckState(); });
            //let inputConsoCookieUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoCookieUneFoisParSemaine", g2, () => { self.inscription.FreqConsoCookie = "Au moins une fois par mois"; consoCookie = 1; btnContinuer.CheckState(); });
            var inputConsoCookieEnvironUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoCookieEnvironUneFoisParMois", g2, function () { self.inscription.FreqConsoCookie = "Environ une fois par mois"; consoCookie = 1; btnContinuer.CheckState(); });
            var inputConsoCookieMoinsUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoCookieMoinsUneFoisParMois", g2, function () { self.inscription.FreqConsoCookie = "Moins d'une fois par mois"; consoCookie = 1; btnContinuer.CheckState(); });
            var inputConsoCookieJamais = Framework.Form.RadioElement.Register("inputConsoCookieJamais", g2, function () { self.inscription.FreqConsoCookie = "Jamais"; consoCookie = 1; btnContinuer.CheckState(); });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return consoCookie == 1;
            }, function () {
                //if (self.inscription.FreqConsoCookie != "Jamais") {
                //    self.showDivEvaluationFoodChoice1("cookie");
                //} else {
                //    self.showDivInscription6c()
                //}
                self.showDivInscription6b1();
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription6c = function () {
        var self = this;
        self.showDiv("html/divInscription6c.html", function () {
            var consoPainMie = 0;
            var g3 = Framework.Form.RadioGroup.Register();
            var inputConsoPainMiePlusieursFoisSemaine = Framework.Form.RadioElement.Register("inputConsoPlusieursFoisSemaine", g3, function () { self.inscription.FreqConsoPainMie = "Plusieurs fois par semaine"; consoPainMie = 1; btnContinuer.CheckState(); });
            var inputConsoPainMieEnvironUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoPainMieEnvironUneFoisParSemaine", g3, function () { self.inscription.FreqConsoPainMie = "Environ une fois par semaine"; consoPainMie = 1; btnContinuer.CheckState(); });
            //let inputConsoPainMieUneFoisParSemaine = Framework.Form.RadioElement.Register("inputConsoPainMieUneFoisParSemaine", g3, () => { self.inscription.FreqConsoPainMie = "Au moins une fois par mois"; consoPainMie = 1; btnContinuer.CheckState(); });
            var inputConsoPainMieEnvironUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoPainMieEnvironUneFoisParMois", g3, function () { self.inscription.FreqConsoPainMie = "Environ une fois par mois"; consoPainMie = 1; btnContinuer.CheckState(); });
            var inputConsoPainMieMoinsUneFoisParMois = Framework.Form.RadioElement.Register("inputConsoPainMieMoinsUneFoisParMois", g3, function () { self.inscription.FreqConsoPainMie = "Moins d'une fois par mois"; consoPainMie = 1; btnContinuer.CheckState(); });
            var inputConsoPainMieJamais = Framework.Form.RadioElement.Register("inputConsoPainMieJamais", g3, function () { self.inscription.FreqConsoPainMie = "Jamais"; consoPainMie = 1; btnContinuer.CheckState(); });
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return consoPainMie == 1;
            }, function () {
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
            });
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription7 = function () {
        var self = this;
        self.showDiv("html/divInscription7.html", function () {
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
            self.CallWCF('InscriptionDataSens', { inscriptionJson: JSON.stringify(self.inscription), mail: self.inscription.Mail, sendMail: false, valid: true }, function () {
                Framework.Progress.Show("Enregistrement...");
            }, function (res) {
                Framework.Progress.Hide();
                //if (sendMail) {
                if (res.Status == 'success') {
                    self.showDivInscription8("<p>Votre justificatif de domicile a été envoyé, il sera contrôlé et vous recevrez vos identifiants de connection par mail.</p>");
                }
                else {
                    self.showDivInscription8("<p>" + res.ErrorMessage + "</p><p>Veuillez vérifier votre adresse mail et réessayer.</p>");
                }
                //} else {
                //    self.showDivInscription8("<p>Désolé, vous n'êtes pas éligible pour cette étude.</p>");
                //}
            });
            //})
        });
    };
    DataSensInscriptionApp.prototype.showDivInscription8 = function (txt) {
        var self = this;
        self.showDiv("html/divInscription8.html", function () {
            var divFin = Framework.Form.TextElement.Register("divFin");
            divFin.SetHtml(txt);
        });
    };
    return DataSensInscriptionApp;
}(Framework.App));
var DataSensApp = /** @class */ (function (_super) {
    __extends(DataSensApp, _super);
    function DataSensApp(isInTest, demo) {
        if (isInTest === void 0) { isInTest = false; }
        if (demo === void 0) { demo = false; }
        var _this = _super.call(this, DataSensApp.GetRequirements(), isInTest) || this;
        _this.saveurATester = "";
        _this.demo = false;
        _this.demo = demo;
        return _this;
    }
    DataSensApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/crocnoteurs';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
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
        requirements.Required = []; //TODO;
        //requirements.Extensions = ["Rating", "Slider"];
        return requirements;
    };
    DataSensApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    DataSensApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        //Dynamsoft.DBR.BarcodeReader.productKeys = "t0068NQAAAJkBsplpzibfp1Gddht8ByLAP5DOOc/3SDgDPIC5aXTUIixlL4BIyErwvBpklKiuqb/agEFu35ME0fiaK0HyL1A=";
        Dynamsoft.DBR.BarcodeReader.organizationID = "100866291";
        //if (window.location.hostname.indexOf("localhost") > -1) {
        //    this.key = "ATHhaTGTEPy2IbZGNz18VmwTvCL0BrRJvHmpMVJ4JBEJJ+akYmlG5kBRK5HkBuftKAaDUT9XtgikRd7hAmxPz4xv0qBbKIy1fUBkCnZP7BbBG1EXQQaRdWcHt2lKIHoEFuUD+XUb+oKzgNa/7OxYtC8yPN5jb7lg/sfdQUNRhg+cjz+X1A5/sD0OYNIo01QEFCrLaRe2rpb947H9HIfi+uhJ3qtDnSiq5AzxRWgQiXomIjQCzZ73tT+r/XKdCFjEQX8W/kXdsYyNHo8Lk5ef4TrxfeKqUn+1svg+M/+yhV+gbRv0H0JL5GxWCqH+zYgftDcIt0CQZGxR4miJHRfb5lsUV+SnoDE2Bff+NxdNV5Oolfjq/nuP9R5bw6sPgZKgaFgmiWOiGQ00ZPmuc0Y5KQlEcSu17Mpm9SGdPv33VrI1Qv6vCtFTqeAkiMAJKc5Ghkewa6MJBpmzypKyaJAfDJeEC14IR4s3my/OpqF5atMeLwvInh2JWfbhNDiLjlg/WnaP9z3F1TeFK4EB1cqwSChLzqR2J6XziS8Mq1LVHYrK4sAxPPohvMJHzgd1iI6jSxeCdAROA28FIyeJzgqDPU4tHYGYJZv7GbYQ47T0AR/0MvhisMcP+IhNZgu9Ug15dej5DCEgu48+3h2UzqvESLHxjx04T9B0EGxvmgSfe24olBWp8quqlanu+iTF+FkbGCw1iMiW68xQWnbR/qgmfbady/qnq1VJRuGWfcMpteGPvqzhsrOsPN1QxI8tsZx1kcIIq6a6x/s1X+d+dLjEU+g6QLgipBycFjtk5kbPtA=="
        //} else {
        //    this.key = "AWjRhj6TH2QuKd4clyAclO0HPe0zPEMNHzF6wMhvDi/dAZJvl2nzyFNiCAz5G65XW0Ppr9d4I4gzdPoxFib9pUZ9ovNmSLH2pGwrz65EK38icyjsCnpTLytbLpyrSNGkOihdHHA0EUkqfkdkUWF4f11c2VxKad+LyWSx5l5OPblNZ56V9FuHjxMtQdaaMjh2U1T0qp5oQdAQS1HfrlwCTTh8JT/dSxlLN3mwvptsadQOWZLNeV59a1903+OUaiHqd0gZ2SRH4Qn5X0ULeWF7wnFxxtjrQXTp93rIdhxDW9oRZYv4VEfpmz1H84o3IMeJuikooMBTchJ7UDfNq0IGYDt8TSdYb/PxD35HUUF0dhu8a2wbtHHqcPhx2aqmVb0k6UrDuVd6W3GOdmO39krS5f9U6PDtTARIYUhHOQtfCIPcexkyNSBP2fhwvCgVU6inN0fhzatbANg9AZR0qFJeT+Nu/5S1RFjgsAlEbnxO5iNNZuAvj3MrrbFOUVclUTCl+w+LKIsm+9MiC5PrODrYwzaIdk8L1AvNCVsmBeRraFTY92V5PzTw9PSExRrXoe+Oq7GXbKE1rD23GwA972+NsKfPfQESTY3ziTo7EYK0ZJU04XYMBg73IHQ1NYw4PTLDRXV37BHTT7GF11JAUqGyrBG9jPG74rPB4iBFye7rMcjiJ0aVpfXz3oIH5E9XPjWmA+F6Em2Ka3DQUMfMavuqBwAwZTBRPpJ9n0xrG8APMk9C/xORWSNu8L3+f6vUAA0yxfSZeV5vsJUb57qSFYJB590vNcCVZ0lAMrMHWm2FVERLp7HNfHOFZ7r11MQjuJI+bHyKqXJMZyLYcb5qPfIfeX+cfu4YX+id3lv91gt3tJZ/MqIqyRFuIW8qpruwkVa4c2/P47uzY587gm1PmLx+PaXMUJgR8DnvIUgGtwe9rsSxyEXNHY7zJ1rXcd7NOagEdbNMX3RyO+iivoNdpbA90A9iuRLbthnMISPXPr62xtov9t34bdT5IPSDYPZoM1lVetb03spb/Jsf2LpNIz5fJDSNz13Xy9gME6h5Zg4Rj2RgYWdP9qjLGjNBILvbhvbZd2lCJLkxUrO723Ihz7fDwDQHd/JTb4lWXxCecfvbAmw8S6CMllfB+U8cD4PAvNuzfGi5QFmQJEblFTzMxtg7vjyoUZMZSBEEtsg8VLXQ1w6L5l7w78FePBV88WRqnpdX";
        //}
        var id = "";
        var url = window.location.href;
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
    };
    DataSensApp.prototype.showDiv = function (htmlPath, onLoaded) {
        var self = this;
        document.body.innerHTML = "";
        var path = DataSensApp.GetRequirements().AppUrl + "/" + htmlPath;
        Framework.BaseView.Load(path, "body", function (div) {
            onLoaded();
        });
    };
    DataSensApp.prototype.showDivAuthentification = function (id) {
        if (id === void 0) { id = ""; }
        var self = this;
        this.showDiv("html/divAuthentification.html", function () {
            var aMotPasseOublie = document.getElementById("aMotPasseOublie");
            aMotPasseOublie.onclick = function () {
                //if (inputId.IsValid) {
                var div = document.createElement("div");
                var inputText = Framework.Form.InputText.Create("", function () { btnOK.CheckState(); }, Framework.Form.Validator.Mail(), true, ["form-control"]);
                div.appendChild(inputText.HtmlElement);
                var btnOK = Framework.Form.Button.Create(function () { return inputText.IsValid; }, function () {
                    self.CallWCF('VerifieMailDataSens', { mail: inputText.Value }, function () {
                        Framework.Progress.Show("Vérification en cours...");
                    }, function (res) {
                        Framework.Progress.Hide();
                        if (res.Status == 'success' && JSON.parse(res.Result) == true) {
                            Framework.Modal.Alert("", "Un e-mail avec un lien de connexion au questionnaire vous a été renvoyé.");
                        }
                        else {
                            Framework.Modal.Alert("", "Aucun compte n'est enregistré à cette adresse mail.");
                        }
                    });
                    mw.Close();
                }, "OK", ["btn", "btn-primary", "btn-lg"]);
                var btnCancel = Framework.Form.Button.Create(function () { return true; }, function () { mw.Close(); }, "Annuler", ["btn-primary", "btn", "btn-lg"]);
                var mw = new Framework.Modal.CustomModal(div, "Veuillez saisir votre adresse de messagerie associée à croc'noteurs", [btnCancel, btnOK]);
                mw.show();
                //}
            };
            var pIdError = Framework.Form.TextElement.Register("pIdError");
            pIdError.Hide();
            //let txt = "";
            if (id == "") {
                try {
                    id = Framework.LocalStorage.GetFromLocalStorage("crocnoteurs_id_new", true);
                    if (id == null) {
                        id = "";
                    }
                }
                catch (_a) {
                }
            }
            else {
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
            var login = function (code) {
                self.CallWCF('LoginDataSens', { id: code }, function () {
                    Framework.Progress.Show("Vérification du code...");
                }, function (res) {
                    Framework.Progress.Hide();
                    if (res.Status == 'success') {
                        var json = res.Result;
                        try {
                            Framework.LocalStorage.SaveToLocalStorage("crocnoteurs_id_new", code, true);
                        }
                        catch (_a) {
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
                        self.saveQuestionnaire(function () {
                            self.showDivMenu();
                        });
                    }
                    else {
                        pIdError.Show();
                    }
                });
            };
            //let btnCheckId = Framework.Form.Button.Register("btnCheckId", () => { return inputId.Value.length >= 4; }, () => {
            //    //(<any>chrome).webview.postMessage('Hello .NET from JavaScript');
            //    login(inputId.Value);
            //});
            if (id != "") {
                login(id);
            }
        });
    };
    DataSensApp.prototype.showDivMenu = function () {
        var self = this;
        this.showDiv("html/divMenu.html", function () {
            var pIndemnisationMaxAtteinte = Framework.Form.TextElement.Register("pIndemnisationMaxAtteinte");
            pIndemnisationMaxAtteinte.Hide();
            var canContinue = false;
            self.CallWCF('VerifiePlafondIndemnisation', { id: self.questionnaire.Code }, function () {
                Framework.Progress.Show("Vérification du plafond d'indemnisation...");
            }, function (res) {
                Framework.Progress.Hide();
                if (res.Status == 'success') {
                    // Pas plus de 2 produits par jour                    
                    var dates = self.questionnaire.EvaluationProduit.filter(function (x) { return x.EvaluationTerminee == true && new Date(x.DateFin.toString()).toLocaleDateString() == new Date(Date.now()).toLocaleDateString(); });
                    if (self.demo == true) {
                        canContinue = true;
                        btnEvalueProduit.CheckState();
                    }
                    else if (dates && dates.length >= 1) {
                        pIndemnisationMaxAtteinte.Set("Vous ne pouvez évaluer qu'un produit dans la même journée.");
                        pIndemnisationMaxAtteinte.Show();
                    }
                    else {
                        canContinue = true;
                        btnEvalueProduit.CheckState();
                    }
                }
                else {
                    pIndemnisationMaxAtteinte.Set(res.ErrorMessage);
                    pIndemnisationMaxAtteinte.Show();
                }
            });
            var btnCagnotte = Framework.Form.Button.Register("btnCagnotte", function () { return true; }, function () {
                self.showDivCagnotte();
            });
            if (self.demo == true) {
                btnCagnotte.Hide();
            }
            var btnEvalueProduit = Framework.Form.Button.Register("btnEvalueProduit", function () { return canContinue; }, function () {
                self.showDivEvaluationProduit1();
            });
        });
    };
    DataSensApp.prototype.showDivCagnotte = function () {
        var self = this;
        self.showDiv("html/divCagnotte.html", function () {
            var btnMenu = Framework.Form.Button.Register("btnMenu", function () { return true; }, function () {
                self.showDivMenu();
            });
            var divTable1 = Framework.Form.TextElement.Register("divTable1");
            var divTable2 = Framework.Form.TextElement.Register("divTable2");
            self.CallWCF('TelechargerCagnotteDataSens', { id: self.questionnaire.Code }, function () {
                Framework.Progress.Show("Téléchargement...");
            }, function (res) {
                Framework.Progress.Hide();
                if (res.Status == 'success') {
                    var json = res.Result;
                    var cagnotte = JSON.parse(json);
                    var table = new Framework.Form.Table();
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
                    var table2 = new Framework.Form.Table();
                    table2.CanSelect = false;
                    table2.ShowFooter = false;
                    table2.ListData = cagnotte.Indemnisations;
                    table2.Height = "20vh";
                    table2.FullWidth = false;
                    table2.AddCol("DateS", "Date", 150, "left");
                    //table2.AddCol("Code", "Code", 150, "left");
                    table2.AddCol("Montant", "Montant", 100, "left");
                    table2.Render(divTable2.HtmlElement);
                    var divSolde = Framework.Form.TextElement.Register("divSolde", cagnotte.Solde.toString() + " €");
                }
            });
        });
    };
    DataSensApp.prototype.getProduit = function (ean) {
        var produits = [];
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
        var p = produits.filter(function (x) { return x.EAN == ean; });
        if (p.length > 0) {
            p[0].CodeBarre = ean;
            return p[0];
        }
        else {
            return undefined;
        }
    };
    DataSensApp.prototype.showDivEvaluationProduit1 = function () {
        var self = this;
        var scan = undefined;
        self.showDiv("html/divEvaluationProduit1.html", function () {
            // Lecteur de code barre      
            var video = document.getElementById("scandit-barcode-picker");
            try {
                scan.close();
            }
            catch (_a) {
            }
            var pScanner = null;
            try {
                Dynamsoft.DBR.BarcodeReader.loadWasm();
                startBarcodeScanner();
            }
            catch (ex) {
                alert(ex.message);
                throw ex;
            }
            function startBarcodeScanner() {
                return __awaiter(this, void 0, void 0, function () {
                    var scanner, ex_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, (pScanner = pScanner || Dynamsoft.DBR.BarcodeScanner.createInstance())];
                            case 1:
                                scanner = _a.sent();
                                scan = scanner;
                                scanner.onFrameRead = function (_results) {
                                    var code = "";
                                    for (var _i = 0, _results_1 = _results; _i < _results_1.length; _i++) {
                                        var result = _results_1[_i];
                                        inputCodeBarre.Set(result.barcodeText);
                                        code = result.barcodeText;
                                    }
                                    if (code != "" && code.length > 7) {
                                        verifieCodeBarre(code);
                                    }
                                };
                                document.getElementById('UIElement').appendChild(scanner.getUIElement());
                                document.querySelector('#UIElement div').style.background = '';
                                document.getElementsByClassName('dce-sel-camera')[0].hidden = true;
                                document.getElementsByClassName('dce-sel-resolution')[0].hidden = true;
                                document.getElementsByClassName('dce-btn-close')[0].hidden = true;
                                return [4 /*yield*/, scanner.show()];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                ex_1 = _a.sent();
                                Framework.Modal.Alert("", "Impossible d'initialiser le lecteur de code-barre. Veuillez saisir le code à la main ou redémarrer l'application.");
                                throw ex_1;
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            var pIdError = Framework.Form.TextElement.Register("pIdError");
            pIdError.Hide();
            var customValidator = Framework.Form.Validator.Custom(function (value) {
                var res = "";
                if (value.length < 8) {
                    res = "Longueur minimale : 8 chiffres";
                }
                function isNumber(value) {
                    return ((value != null) &&
                        (value !== '') &&
                        !isNaN(Number(value.toString())));
                }
                if (isNumber(value) == false) {
                    res = "Chiffres uniquement";
                }
                return res;
            });
            var inputCodeBarre = Framework.Form.InputText.Register("inputCodeBarre", "", customValidator, function (text) {
                btnVerifierCodeBarre.CheckState();
                //TODO : déclencher la vérification quand longueur = 16 (pas besoin de bouton)
            });
            var produit = undefined;
            var verifieCodeBarre = function (code) {
                pIdError.Hide();
                //scan.close();
                produit = self.getProduit(code);
                if (produit != undefined) {
                    var evaluations = self.questionnaire.EvaluationProduit.filter(function (x) { return x.Produit.CodeBarre == code; });
                    //let produit: Models.Produit = new Models.Produit();                    
                    produit.CodeBarre = code;
                    if (evaluations.length == 0 || (evaluations.length > 0 && evaluations[0].EvaluationTerminee == false)) {
                        scan.close();
                        self.showDivEvaluationProduit1b(produit);
                    }
                    else {
                        // Produit déjà évalué
                        scan.close();
                        pIdError.SetHtml("Vous avez déjà évalué ce produit.");
                        pIdError.Show();
                        produit = undefined;
                    }
                }
                else {
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
            };
            var btnVerifierCodeBarre = Framework.Form.Button.Register("btnVerifierCodeBarre", function () { return inputCodeBarre.IsValid == true; }, function () {
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
            var btnMenu = Framework.Form.Button.Register("btnMenu", function () { return true; }, function () {
                self.showDivMenu();
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationNouveauProduit = function (produit) {
        var self = this;
        self.showDiv("html/divEvaluationNouveauProduit.html", function () {
            var g = new Framework.Form.RadioGroup();
            Framework.Form.RadioElement.Register("inputNouveauProduitCookie", g, function () { produit.Type = "cookie"; btnContinuerEvaluation.CheckState(); });
            Framework.Form.RadioElement.Register("inputNouveauProduitPizza", g, function () { produit.Type = "pizza"; btnContinuerEvaluation.CheckState(); });
            Framework.Form.RadioElement.Register("inputNouveauProduitPainMie", g, function () { produit.Type = "pain de mie"; btnContinuerEvaluation.CheckState(); });
            Framework.Form.RadioElement.Register("inputNouveauProduitAutre", g, function () { produit.Type = ""; btnContinuerEvaluation.CheckState(); });
            var designation = "";
            if (produit.Designation && produit.Designation != null && produit.Designation != "") {
                designation = produit.Designation;
            }
            var inputDesignation = Framework.Form.InputText.Register("inputDesignation", designation, Framework.Form.Validator.MinLength(5, "Longueur minimale : 5 caractères."), function (text) {
                produit.Designation = text;
                btnContinuerEvaluation.CheckState();
            });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnEvaluerProduit", function () { return inputDesignation.IsValid == true && produit.Type != undefined && produit.Type != ""; }, function () {
                self.CallWCF('AjouteCodeBarreDataSens', { code: produit.CodeBarre, famille: produit.Type, designation: produit.Designation }, function () {
                    Framework.Progress.Show("Téléversement en cours...");
                }, function (res) {
                    Framework.Progress.Hide();
                    self.evaluationProduit(produit);
                });
            });
            var btnMenu = Framework.Form.Button.Register("btnMenu", function () { return true; }, function () {
                self.showDivMenu();
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationProduit1b = function (produitTrouve) {
        var self = this;
        self.showDiv("html/divEvaluationProduit1b.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit");
            var produit = undefined;
            // Test si produit déjà évalué
            var produits = self.questionnaire.EvaluationProduit.filter(function (x) { return x.Produit.CodeBarre == produitTrouve.CodeBarre; });
            if (produits.length == 0) {
                divProduit.SetHtml("<h3>" + produitTrouve.Designation + "</h3><h4>Vous n'avez pas encore évalué ce produit.</h4>");
                produit = new Models.Produit();
                produit.CodeBarre = produitTrouve.CodeBarre;
                produit.Type = produitTrouve.Type;
                produit.Designation = produitTrouve.Designation;
            }
            else {
                if (produits[0].EvaluationTerminee == true) {
                    // Produit déjà évalué
                    divProduit.SetHtml("<h3>" + produitTrouve.Designation + "</h3><h4>Vous avez déjà évalué ce produit.</h4>");
                    produit = undefined;
                }
                else {
                    // Reprise là où le sujet s'était arrêté
                    divProduit.SetHtml("<h3>" + produitTrouve.Designation + "</h3><h4>Vous n'avez pas terminé d'évaluer ce produit.</h4>");
                    produit = produits[0].Produit;
                }
            }
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnEvaluerProduit", function () { return produit != undefined; }, function () {
                self.evaluationProduit(produit);
            });
            var btnMenu = Framework.Form.Button.Register("btnMenu", function () { return true; }, function () {
                self.showDivMenu();
            });
        });
    };
    DataSensApp.prototype.evaluationProduit = function (produit) {
        var self = this;
        var evaluation = undefined;
        var evaluations = self.questionnaire.EvaluationProduit.filter(function (x) { return x.Produit.CodeBarre == produit.CodeBarre; });
        if (evaluations.length > 0) {
            // Reprise
            evaluation = evaluations[0];
        }
        else {
            // Nouvelle évaluation
            evaluation = new Models.EvaluationProduit();
            evaluation.Produit = new Models.Produit();
            evaluation.Produit.CodeBarre = produit.CodeBarre;
            evaluation.Produit.Designation = produit.Designation;
            evaluation.Produit.Type = produit.Type;
            this.questionnaire.EvaluationProduit.push(evaluation);
        }
        evaluation.Produit.Rang = this.questionnaire.EvaluationProduit.filter(function (x) { return x.Produit.Type == evaluation.Produit.Type; }).length;
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
    };
    DataSensApp.prototype.showDivAvantPhotoComposition = function (evaluation) {
        var self = this;
        self.showDiv("html/divAvantPhotoComposition.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                self.saveQuestionnaire(function () { self.showDivPhotoComposition(evaluation); });
            });
        });
    };
    DataSensApp.prototype.showDivAvantPhotoIngredients = function (evaluation) {
        var self = this;
        self.showDiv("html/divAvantPhotoIngredients.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                //self.continuerEvaluation(evaluation);
                self.saveQuestionnaire(function () { self.showDivPhotoIngredients(evaluation); });
            });
        });
    };
    DataSensApp.prototype.showDivOuverturePaquet = function (evaluation) {
        var self = this;
        self.showDiv("html/divOuverturePaquet.html", function () {
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                //self.continuerEvaluation(evaluation);
                self.showDivPhotoEmballage(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivObservation = function (evaluation) {
        var self = this;
        self.showDiv("html/divObservation.html", function () {
            var prefix = "";
            if (evaluation.Produit.Type == "pizza") {
                prefix = "la pizza sans la goûter";
            }
            if (evaluation.Produit.Type == "cookie") {
                prefix = "le cookie sans le goûter";
            }
            if (evaluation.Produit.Type == "pain de mie") {
                prefix = "le pain de mie sans le goûter";
            }
            var divProduit = Framework.Form.TextElement.Register("divProduit", prefix);
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                //self.continuerEvaluation(evaluation);
                self.showDivEvaluationDejaGoute(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivGoutage = function (evaluation) {
        var self = this;
        self.showDiv("html/divGoutage.html", function () {
            var prefix = "le ";
            if (evaluation.Produit.Type == "pizza") {
                prefix = "la ";
            }
            var divProduit = Framework.Form.TextElement.Register("divProduit", prefix + evaluation.Produit.Type);
            var divPainMie = Framework.Form.TextElement.Register("divPainMie");
            divPainMie.Hide();
            var divPizza = Framework.Form.TextElement.Register("divPizza");
            divPizza.Hide();
            if (evaluation.Produit.Type == "pain de mie") {
                divPainMie.Show();
            }
            if (evaluation.Produit.Type == "pizza") {
                divPizza.Show();
            }
            var btnContinuer = Framework.Form.Button.Register("btnContinuer", function () {
                return true;
            }, function () {
                //self.continuerEvaluation(evaluation);
                self.showDivEvaluationStatedLiking(evaluation);
            });
        });
    };
    DataSensApp.prototype.continuerEvaluation = function (evaluation) {
        var self = this;
        if (evaluation.PhotoEmballage == false) {
            self.saveQuestionnaire(function () {
                self.showDivOuverturePaquet(evaluation);
                //self.showDivPhotoEmballage(evaluation);
            });
        }
        else if (evaluation.DejaGoute == "") {
            self.saveQuestionnaire(function () {
                self.showDivObservation(evaluation);
                //self.showDivEvaluationDejaGoute(evaluation);
            });
        }
        //else if (evaluation.PhotoComposition == false) {
        //    self.saveQuestionnaire(() => { self.showDivEvaluationProduit4(evaluation); });
        //}
        else if (evaluation.ExpectedLiking == undefined) {
            self.saveQuestionnaire(function () { self.showDivEvaluationExpectedLiking(evaluation); });
        }
        else if (evaluation.DescriptionApparence == "") {
            self.saveQuestionnaire(function () { self.showDivEvaluationApparence(evaluation); });
        }
        else if (evaluation.StatedLiking == undefined) {
            self.saveQuestionnaire(function () {
                self.showDivGoutage(evaluation);
                //self.showDivEvaluationStatedLiking(evaluation);
            });
        }
        else if (evaluation.DescriptionTexture == "") {
            self.saveQuestionnaire(function () { self.showDivEvaluationTexture(evaluation); });
        }
        else if (evaluation.DescriptionGout == "") {
            self.saveQuestionnaire(function () { self.showDivEvaluationGout(evaluation); });
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
            self.saveQuestionnaire(function () { self.showDivEvaluationAime(evaluation); });
        }
        //else if (evaluation.DescriptionPasAime == "") {
        //    self.saveQuestionnaire(() => { self.showDivEvaluationPasAime(evaluation); });
        //}
        else if ((evaluation.Produit.Type == "cookie" || evaluation.Produit.Type == "pain de mie") && evaluation.JARSucre == undefined) {
            self.saveQuestionnaire(function () {
                self.showDivEvaluationJARSucre(evaluation);
            });
        }
        else if (self.saveurATester == "sucré") {
            self.saveQuestionnaire(function () {
                self.verifieReponsePrécédente("sucré", function () { self.continuerEvaluation(evaluation); });
            });
        }
        else if ((evaluation.Produit.Type == "pizza" || evaluation.Produit.Type == "pain de mie") && evaluation.JARSale == undefined) {
            self.saveQuestionnaire(function () {
                self.showDivEvaluationJARSale(evaluation);
            });
        }
        else if (self.saveurATester == "salé") {
            self.saveQuestionnaire(function () {
                self.verifieReponsePrécédente("salé", function () { self.continuerEvaluation(evaluation); });
            });
        }
        else if ((evaluation.Produit.Type == "pizza" || evaluation.Produit.Type == "cookie") && evaluation.JARGras == undefined) {
            self.saveQuestionnaire(function () {
                self.showDivEvaluationJARGras(evaluation);
            });
        }
        else if (self.saveurATester == "gras") {
            self.saveQuestionnaire(function () {
                self.verifieReponsePrécédente("gras", function () { self.continuerEvaluation(evaluation); });
            });
        }
        else if (evaluation.IntentionReachat == undefined) {
            self.saveQuestionnaire(function () {
                self.showDivEvaluationRachat(evaluation);
            });
        }
        else {
            if (self.demo == false) {
                // Fin de l'évaluation
                if (evaluation.Produit.Rang == 5) {
                    var p_1 = new Models.ProduitIdeal();
                    p_1.Type = evaluation.Produit.Type;
                    self.questionnaire.ListeProduitIdeal.push(p_1);
                    self.saveQuestionnaire(function () { self.showDivIdeal(p_1, evaluation); });
                }
                else {
                    self.ajouteACagnotte(evaluation);
                }
            }
            else {
                self.showDivMenu();
            }
        }
    };
    DataSensApp.prototype.showDivIdeal = function (p, evaluation) {
        var self = this;
        self.showDiv("html/divIdeal.html", function () {
            var spanProduit = Framework.Form.TextElement.Register("spanProduit");
            var spanProduit2 = Framework.Form.TextElement.Register("spanProduit2");
            var spanPrix1 = Framework.Form.TextElement.Register("spanPrix1");
            var spanPrix2 = Framework.Form.TextElement.Register("spanPrix2");
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
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return true;
            }, function () {
                self.saveQuestionnaire(function () { self.showDivEvaluationApparenceIdeal(p, evaluation); });
            });
        });
    };
    DataSensApp.prototype.ajouteACagnotte = function (evaluation) {
        var self = this;
        self.saveQuestionnaire(function () {
            self.CallWCF('AjouteACagnotteDataSens', { id: self.questionnaire.Code, codebarre: evaluation.Produit.CodeBarre, type: evaluation.Produit.Type, designation: evaluation.Produit.Designation }, function () {
                Framework.Progress.Show("Mise à jour de la cagnotte...");
            }, function (res) {
                Framework.Progress.Hide();
                if (res.Status == 'success') {
                    var obj = JSON.parse(res.Result);
                    self.showDivVerificationCagnotte(evaluation, Number(res.Result));
                }
                else {
                    alert(res.ErrorMessage);
                }
            });
        });
    };
    DataSensApp.prototype.verifieReponsePrécédente = function (precedent, next) {
        var self = this;
        self.showDiv("html/modalRandom.html", function () {
            self.saveurATester = "";
            var saveAndClose = function (correctAnswer) {
                if (correctAnswer == false) {
                    self.questionnaire.DatesMauvaisesReponses.push(new Date(Date.now()));
                }
                self.questionnaire.NbEval++;
                next();
            };
            var b1 = Framework.Form.Button.Register("btnSale", function () { return true; }, function () { precedent == "salé" ? saveAndClose(true) : saveAndClose(false); });
            var b2 = Framework.Form.Button.Register("btnSucre", function () { return true; }, function () { precedent == "sucré" ? saveAndClose(true) : saveAndClose(false); });
            var b3 = Framework.Form.Button.Register("btnGras", function () { return true; }, function () { precedent == "gras" ? saveAndClose(true) : saveAndClose(false); });
            var b4 = Framework.Form.Button.Register("btnAmer", function () { return true; }, function () { saveAndClose(false); });
        });
    };
    DataSensApp.prototype.showDivEvaluationDejaGoute = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationDejaGoute.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            var g = new Framework.Form.RadioGroup();
            var dejaGoute = "";
            var inputDejaGouteOui = Framework.Form.RadioElement.Register("inputDejaGouteOui", g, function () { dejaGoute = "O"; btnContinuerEvaluation.CheckState(); });
            var inputDejaGouteNon = Framework.Form.RadioElement.Register("inputDejaGouteNon", g, function () { dejaGoute = "N"; btnContinuerEvaluation.CheckState(); });
            var inputDejaGouteNSP = Framework.Form.RadioElement.Register("inputDejaGouteNSP", g, function () { dejaGoute = "NSP"; btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () { return dejaGoute != ""; }, function () {
                evaluation.DejaGoute = dejaGoute;
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivPhotoComposition = function (evaluation) {
        var self = this;
        self.showDiv("html/divPhotoComposition.html", function () {
            var base64 = undefined;
            var recorder = new Framework.PhotoRecorder(document.getElementById("btnPhoto"), document.getElementById("video"));
            recorder.OnSave = function (b64) {
                base64 = b64;
                btnContinuerEvaluation.CheckState();
            };
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return base64 != undefined;
            }, function () {
                // Enregistrement
                self.CallWCF('TeleverseImageDataSens', { base64string: base64, dir: "compositions", filename: evaluation.Produit.CodeBarre }, function () { }, function (res) {
                    if (res.Status == "success") {
                        //evaluation.PhotoComposition = true;
                        self.saveQuestionnaire(function () { self.showDivAvantPhotoIngredients(evaluation); });
                    }
                    else {
                        Framework.Modal.Alert("Erreur", "La photo n'a pas été téléversée, veuillez réessayer.");
                    }
                });
            });
        });
    };
    DataSensApp.prototype.showDivPhotoIngredients = function (evaluation) {
        var self = this;
        self.showDiv("html/divPhotoIngredients.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            var base64 = undefined;
            var recorder = new Framework.PhotoRecorder(document.getElementById("btnPhoto"), document.getElementById("video"));
            recorder.OnSave = function (b64) {
                base64 = b64;
                btnContinuerEvaluation.CheckState();
            };
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return base64 != undefined;
            }, function () {
                // Enregistrement
                self.CallWCF('TeleverseImageDataSens', { base64string: base64, dir: "ingredients", filename: evaluation.Produit.CodeBarre }, function () { }, function (res) {
                    if (res.Status == "success") {
                        //evaluation.PhotoEmballage = true;
                        self.continuerEvaluation(evaluation);
                    }
                    else {
                        Framework.Modal.Alert("Erreur", "La photo n'a pas été téléversée, veuillez réessayer.");
                    }
                });
            });
        });
    };
    DataSensApp.prototype.showDivPhotoEmballage = function (evaluation) {
        var self = this;
        self.showDiv("html/divPhotoEmballage.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            var base64 = undefined;
            var recorder = new Framework.PhotoRecorder(document.getElementById("btnPhoto"), document.getElementById("video"));
            recorder.OnSave = function (b64) {
                base64 = b64;
                btnContinuerEvaluation.CheckState();
            };
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return base64 != undefined;
            }, function () {
                // Enregistrement
                self.CallWCF('TeleverseImageDataSens', { base64string: base64, dir: "emballages", filename: self.questionnaire.Code + "_" + evaluation.Produit.CodeBarre }, function () { }, function (res) {
                    if (res.Status == "success") {
                        evaluation.PhotoEmballage = true;
                        self.continuerEvaluation(evaluation);
                    }
                    else {
                        Framework.Modal.Alert("Erreur", "La photo n'a pas été téléversée, veuillez réessayer.");
                    }
                });
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationExpectedLiking = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationExpectedLiking.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            var sliderChecked = false;
            var slider = document.getElementById("slider");
            slider.onchange = function (ev) {
                sliderChecked = true;
                btnContinuerEvaluation.CheckState();
            };
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return sliderChecked == true;
            }, function () {
                evaluation.ExpectedLiking = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationApparence = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationApparence.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            var txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(3), function () { btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return txtDescription.IsValid == true;
            }, function () {
                evaluation.DescriptionApparence = txtDescription.Value;
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationStatedLiking = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationStatedLiking.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            var sliderChecked = false;
            var slider = document.getElementById("slider");
            slider.onchange = function (ev) {
                sliderChecked = true;
                btnContinuerEvaluation.CheckState();
            };
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return sliderChecked == true;
            }, function () {
                evaluation.StatedLiking = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationTexture = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationTexture.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            var txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(3), function () { btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return txtDescription.IsValid == true;
            }, function () {
                evaluation.DescriptionTexture = txtDescription.Value;
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationAime = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationAime.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            //let txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(3), () => { btnContinuerEvaluation.CheckState(); });
            var radioChecked1 = false;
            var group1 = new Framework.Form.RadioGroup();
            var r1 = Framework.Form.RadioElement.Register("inputApparenceOui", group1, function () { evaluation.AimeApparence = 1; radioChecked1 = true; btnContinuerEvaluation.CheckState(); });
            var r2 = Framework.Form.RadioElement.Register("inputApparenceNon", group1, function () { evaluation.AimeApparence = -1; radioChecked1 = true; btnContinuerEvaluation.CheckState(); });
            var r3 = Framework.Form.RadioElement.Register("inputApparenceIndifferent", group1, function () { evaluation.AimeApparence = 0; radioChecked1 = true; btnContinuerEvaluation.CheckState(); });
            var radioChecked2 = false;
            var group2 = new Framework.Form.RadioGroup();
            var r4 = Framework.Form.RadioElement.Register("inputTextureOui", group2, function () { evaluation.AimeTexture = 1; radioChecked2 = true; btnContinuerEvaluation.CheckState(); });
            var r5 = Framework.Form.RadioElement.Register("inputTextureNon", group2, function () { evaluation.AimeTexture = -1; radioChecked2 = true; btnContinuerEvaluation.CheckState(); });
            var r6 = Framework.Form.RadioElement.Register("inputTextureIndifferent", group2, function () { evaluation.AimeTexture = 0; radioChecked2 = true; btnContinuerEvaluation.CheckState(); });
            var radioChecked3 = false;
            var group3 = new Framework.Form.RadioGroup();
            var r7 = Framework.Form.RadioElement.Register("inputGoutOui", group3, function () { evaluation.AimeGout = 1; radioChecked3 = true; btnContinuerEvaluation.CheckState(); });
            var r8 = Framework.Form.RadioElement.Register("inputGoutNon", group3, function () { evaluation.AimeGout = -1; radioChecked3 = true; btnContinuerEvaluation.CheckState(); });
            var r9 = Framework.Form.RadioElement.Register("inputGoutIndifferent", group3, function () { evaluation.AimeGout = 0; radioChecked3 = true; btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                //return txtDescription.IsValid == true;
                return radioChecked1 == true && radioChecked2 == true && radioChecked3 == true;
            }, function () {
                //evaluation.DescriptionAime = txtDescription.Value;
                self.continuerEvaluation(evaluation);
            });
        });
    };
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
    DataSensApp.prototype.showDivEvaluationGout = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationGout.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            var txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(3), function () { btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return txtDescription.IsValid == true;
            }, function () {
                evaluation.DescriptionGout = txtDescription.Value;
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationJARSucre = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationJARSucre.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            var radioChecked = false;
            var group = new Framework.Form.RadioGroup();
            var r1 = Framework.Form.RadioElement.Register("check1", group, function () { evaluation.JARSucre = -2; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r2 = Framework.Form.RadioElement.Register("check2", group, function () { evaluation.JARSucre = -1; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r3 = Framework.Form.RadioElement.Register("check3", group, function () { evaluation.JARSucre = 0; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r4 = Framework.Form.RadioElement.Register("check4", group, function () { evaluation.JARSucre = 1; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r5 = Framework.Form.RadioElement.Register("check5", group, function () { evaluation.JARSucre = 2; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            //let slider: HTMLInputElement = <HTMLInputElement>document.getElementById("slider");
            //slider.onchange = (ev) => {
            //    radioChecked = true;
            //    btnContinuerEvaluation.CheckState();
            //}
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return radioChecked == true;
            }, function () {
                //evaluation.JARSucre = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationJARSale = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationJARSale.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            //let sliderChecked = false;
            //let slider: HTMLInputElement = <HTMLInputElement>document.getElementById("slider");
            //slider.onchange = (ev) => {
            //    sliderChecked = true;
            //    btnContinuerEvaluation.CheckState();
            //}
            var radioChecked = false;
            var group = new Framework.Form.RadioGroup();
            var r1 = Framework.Form.RadioElement.Register("check1", group, function () { evaluation.JARSale = -2; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r2 = Framework.Form.RadioElement.Register("check2", group, function () { evaluation.JARSale = -1; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r3 = Framework.Form.RadioElement.Register("check3", group, function () { evaluation.JARSale = 0; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r4 = Framework.Form.RadioElement.Register("check4", group, function () { evaluation.JARSale = 1; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r5 = Framework.Form.RadioElement.Register("check5", group, function () { evaluation.JARSale = 2; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return radioChecked == true;
            }, function () {
                //evaluation.JARSale = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationJARGras = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationJARGras.html", function () {
            var divProduit = Framework.Form.TextElement.Register("divProduit", evaluation.Produit.Designation + " (" + evaluation.Produit.Type + ")");
            //let sliderChecked = false;
            //let slider: HTMLInputElement = <HTMLInputElement>document.getElementById("slider");
            //slider.onchange = (ev) => {
            //    sliderChecked = true;
            //    btnContinuerEvaluation.CheckState();
            //}
            var radioChecked = false;
            var group = new Framework.Form.RadioGroup();
            var r1 = Framework.Form.RadioElement.Register("check1", group, function () { evaluation.JARGras = -2; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r2 = Framework.Form.RadioElement.Register("check2", group, function () { evaluation.JARGras = -1; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r3 = Framework.Form.RadioElement.Register("check3", group, function () { evaluation.JARGras = 0; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r4 = Framework.Form.RadioElement.Register("check4", group, function () { evaluation.JARGras = 1; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var r5 = Framework.Form.RadioElement.Register("check5", group, function () { evaluation.JARGras = 2; radioChecked = true; btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return radioChecked == true;
            }, function () {
                //evaluation.JARGras = Number(slider.value);
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationRachat = function (evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationRachat.html", function () {
            var g = new Framework.Form.RadioGroup();
            var rachat = "";
            var inputRachatOui = Framework.Form.RadioElement.Register("inputRachatOui", g, function () { rachat = "O"; btnContinuerEvaluation.CheckState(); });
            var inputRachatNon = Framework.Form.RadioElement.Register("inputRachatNon", g, function () { rachat = "N"; btnContinuerEvaluation.CheckState(); });
            var inputRachatNSP = Framework.Form.RadioElement.Register("inputRachatNSP", g, function () { rachat = "NSP"; btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () { return rachat != ""; }, function () {
                evaluation.IntentionReachat = rachat;
                evaluation.DateFin = new Date(Date.now());
                evaluation.EvaluationTerminee = true;
                self.continuerEvaluation(evaluation);
            });
        });
    };
    DataSensApp.prototype.showDivVerificationCagnotte = function (evaluation, restant) {
        var self = this;
        self.showDiv("html/divVerificationCagnotte.html", function () {
            var divConfirmation = Framework.Form.TextElement.Register("divConfirmation");
            divConfirmation.Hide();
            var pIndemnisationOK = Framework.Form.TextElement.Register("pIndemnisationOK");
            var pIndemnisationKO = Framework.Form.TextElement.Register("pIndemnisationKO");
            pIndemnisationKO.Hide();
            var canContinue = true;
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () { return canContinue; }, function () {
                self.showDivMenu();
            });
            btnContinuerEvaluation.Hide();
            if (restant >= 10) {
                self.saveQuestionnaire(function () {
                    self.CallWCF('IndemnisationDataSens', { id: self.questionnaire.Code }, function () {
                        Framework.Progress.Show("Mise à jour de la cagnotte...");
                    }, function (res) {
                        Framework.Progress.Hide();
                        if (res.Status == 'success') {
                            canContinue = false;
                            divConfirmation.Show();
                            btnContinuerEvaluation.CheckState();
                            var checkConfim_1 = Framework.Form.CheckBox.Register("checkConfim", function () { return true; }, function () {
                                canContinue = checkConfim_1.IsChecked;
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
                        }
                        else {
                            divConfirmation.Hide();
                            alert(res.ErrorMessage);
                        }
                    });
                    btnContinuerEvaluation.Show();
                });
                //pIndemnisationOK.Show();
            }
            else {
                pIndemnisationKO.Show();
                btnContinuerEvaluation.Show();
            }
        });
    };
    DataSensApp.prototype.showDivIndemnisation = function () {
        this.showDiv("html/divIndemnisation.html", function () {
        });
    };
    DataSensApp.prototype.showDivEvaluationApparenceIdeal = function (p, evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationApparenceIdeal.html", function () {
            var spanProduit = Framework.Form.TextElement.Register("spanProduit");
            if (p.Type == "cookie") {
                spanProduit.Set("cookie idéal");
            }
            if (p.Type == "pizza") {
                spanProduit.Set("pizza idéale");
            }
            if (p.Type == "pain de mie") {
                spanProduit.Set("pain de mie idéal");
            }
            var txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(6), function () { btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return txtDescription.IsValid == true;
            }, function () {
                p.DescriptionApparence = txtDescription.Value;
                self.saveQuestionnaire(function () { self.showDivEvaluationTextureIdeal(p, evaluation); });
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationTextureIdeal = function (p, evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationTextureIdeal.html", function () {
            var spanProduit = Framework.Form.TextElement.Register("spanProduit");
            if (p.Type == "cookie") {
                spanProduit.Set("cookie idéal");
            }
            if (p.Type == "pizza") {
                spanProduit.Set("pizza idéale");
            }
            if (p.Type == "pain de mie") {
                spanProduit.Set("pain de mie idéal");
            }
            var txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(6), function () { btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return txtDescription.IsValid == true;
            }, function () {
                p.DescriptionTexture = txtDescription.Value;
                self.saveQuestionnaire(function () { self.showDivEvaluationGoutIdeal(p, evaluation); });
            });
        });
    };
    DataSensApp.prototype.showDivEvaluationGoutIdeal = function (p, evaluation) {
        var self = this;
        self.showDiv("html/divEvaluationGoutIdeal.html", function () {
            var spanProduit = Framework.Form.TextElement.Register("spanProduit");
            if (p.Type == "cookie") {
                spanProduit.Set("cookie idéal");
            }
            if (p.Type == "pizza") {
                spanProduit.Set("pizza idéale");
            }
            if (p.Type == "pain de mie") {
                spanProduit.Set("pain de mie idéal");
            }
            var txtDescription = Framework.Form.InputText.Register("txtDescription", "", Framework.Form.Validator.MinLength(6), function () { btnContinuerEvaluation.CheckState(); });
            var btnContinuerEvaluation = Framework.Form.Button.Register("btnContinuerEvaluation", function () {
                return txtDescription.IsValid == true;
            }, function () {
                p.DescriptionGout = txtDescription.Value;
                p.DateFin = new Date(Date.now());
                p.Evalue = true;
                self.ajouteACagnotte(evaluation);
            });
        });
    };
    DataSensApp.prototype.saveQuestionnaire = function (onSuccess) {
        if (onSuccess === void 0) { onSuccess = function () { }; }
        var self = this;
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
        self.CallWCF('SaveQuestionnaireDataSens', { code: self.questionnaire.Code, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, function () {
            Framework.Progress.Show("Enregistrement...");
        }, function (res) {
            Framework.Progress.Hide();
            if (res.Status == 'success') {
                onSuccess();
            }
            else {
                Framework.Modal.Alert("Erreur", "Une erreur a eu lieu pendant l'enregistrement du fichier.", function () { onSuccess(); });
            }
        });
    };
    return DataSensApp;
}(Framework.App));
//# sourceMappingURL=app.js.map