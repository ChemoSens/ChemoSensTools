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
var ConsoDriveIndemnisationApp = /** @class */ (function (_super) {
    __extends(ConsoDriveIndemnisationApp, _super);
    function ConsoDriveIndemnisationApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        var _this = _super.call(this, ConsoDriveIndemnisationApp.GetRequirements(), isInTest) || this;
        _this.nom = "";
        _this.prenom = "";
        _this.mail = "";
        _this.participation = false;
        _this.bal = false;
        return _this;
    }
    ConsoDriveIndemnisationApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/consodrive';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
            requirements.AppUrl = 'https://www.chemosenstools.com/consodrive';
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
    ConsoDriveIndemnisationApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    ConsoDriveIndemnisationApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        var self = this;
        this.inputNom = Framework.Form.InputText.Register("inputNom", "", Framework.Form.Validator.MinLength(2, "Le champ Nom est requis"), function (nom) { self.nom = nom; self.btnTerminer.CheckState(); });
        this.inputPrenom = Framework.Form.InputText.Register("inputPrenom", "", Framework.Form.Validator.MinLength(2, "Le champ Prénom est requis"), function (prenom) { self.prenom = prenom; self.btnTerminer.CheckState(); });
        this.inputMail = Framework.Form.InputText.Register("inputMail", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), function (mail) { self.mail = mail; self.btnTerminer.CheckState(); });
        this.checkboxParticipation = Framework.Form.CheckBox.Register("checkboxParticipation", function () { return true; }, function (ev, cb) { self.participation = cb.IsChecked; self.btnTerminer.CheckState(); }, "");
        this.checkboxBAL = Framework.Form.CheckBox.Register("checkboxBAL", function () { return true; }, function (ev, cb) { self.bal = cb.IsChecked; self.btnTerminer.CheckState(); }, "");
        this.btnTerminer = Framework.Form.Button.Register("btnTerminer", function () {
            return self.inputNom.IsValid && self.inputPrenom.IsValid && self.inputMail.IsValid && self.participation == true && self.bal == true;
        }, function () {
            var body = "<p>" + self.prenom + " " + self.nom + " a terminé le questionnaire et demande à être indemnisé à l'adresse mail suivante : " + self.mail + ".</p>";
            body += "<p>Le panéliste a répondu « oui » aux questions « Je certifie avoir participé à l'étude sur les achats alimentaires en Drive proposé par le Centre des Sciences du Goût et de l'Alimentation. » et « Je souhaite recevoir le bon de 10€ sur ma boîte personnelle. »</p>";
            self.CallWCF('SendMail', { toEmail: "consodrive@inrae.fr", subject: "Demande d'indemnisation consodrive", body: body, displayName: "consodrive", replyTo: "consodrive@inrae.fr" }, function () {
                Framework.Progress.Show("Enregistrement...");
            }, function (res) {
                Framework.Progress.Hide();
                if (res.Status == 'success') {
                    Framework.Modal.Alert("Demande d'indemnisation envoyée", "La demande d'indemnisation a bien été envoyée.");
                }
                else {
                    Framework.Modal.Alert("Echec de l'envoi de la demande d'indemnisation", "L'envoi de la demande d'indemnisation a échoué. Veuillez vérifier votre adresse mail et réessayer. En cas de problème, vous pouvez envoyer un mail à : consodrive@inrae.fr");
                }
            });
        });
    };
    return ConsoDriveIndemnisationApp;
}(Framework.App));
var ConsoDriveInscriptionApp = /** @class */ (function (_super) {
    __extends(ConsoDriveInscriptionApp, _super);
    function ConsoDriveInscriptionApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        var _this = _super.call(this, ConsoDriveInscriptionApp.GetRequirements(), isInTest) || this;
        //private compris: boolean = false;
        _this.civilite = "";
        _this.nom = "";
        _this.prenom = "";
        _this.dateNaissance = "";
        _this.adresse = "";
        _this.ville = "";
        _this.cp = "";
        _this.mail = "";
        _this.lieuGMS = false;
        _this.lieuGrandeSurfaceSpecialisee = false;
        _this.lieuCommerceProximite = false;
        _this.lieuMarche = false;
        _this.lieuDrive = false;
        _this.lieuProducteur = false;
        _this.lieuInternet = false;
        _this.lieuAutre = "";
        _this.enseigneCarrefour = false;
        _this.enseigneLeclerc = false;
        _this.enseigneIntermarche = false;
        _this.enseigneSuperU = false;
        _this.enseigneCora = false;
        _this.enseigneCasino = false;
        _this.enseigneAutre = "";
        _this.categorieViandePoisson = false;
        _this.categorieFruitLegume = false;
        _this.categoriePainPatisserie = false;
        _this.categorieSurgele = false;
        _this.categorieEpicerieSalee = false;
        _this.categorieEpicerieSucree = false;
        _this.categorieFrais = false;
        return _this;
    }
    ConsoDriveInscriptionApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/consodrive';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
            requirements.AppUrl = 'https://www.chemosenstools.com/consodrive';
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
    ConsoDriveInscriptionApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    ConsoDriveInscriptionApp.prototype.start = function (fullScreen) {
        var _this = this;
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        var self = this;
        this.divPresentation = Framework.Form.TextElement.Register("divPresentation");
        this.divCompris = Framework.Form.TextElement.Register("divCompris");
        this.divCompris.Hide();
        this.divCnil = Framework.Form.TextElement.Register("divCnil");
        this.divCnil.Hide();
        this.divLieuAchat = Framework.Form.TextElement.Register("divLieuAchat");
        this.divLieuAchat.Hide();
        this.divEnseigne = Framework.Form.TextElement.Register("divEnseigne");
        this.divEnseigne.Hide();
        this.divCategories = Framework.Form.TextElement.Register("divCategories");
        this.divCategories.Hide();
        this.divFin = Framework.Form.TextElement.Register("divFin");
        this.divFin.Hide();
        //let g1 = Framework.Form.RadioGroup.Register();
        //this.inputComprisOui = Framework.Form.RadioElement.Register("inputComprisOui", g1, () => { self.compris = true; self.btnInscription2.CheckState(); });
        //this.inputComprisNon = Framework.Form.RadioElement.Register("inputComprisNon", g1, () => { self.compris = false; self.btnInscription2.CheckState(); });
        var g2 = Framework.Form.RadioGroup.Register();
        this.inputCiviliteMme = Framework.Form.RadioElement.Register("inputCiviliteMme", g2, function () { self.civilite = "Mme"; self.btnInscription3.CheckState(); });
        this.inputCiviliteMr = Framework.Form.RadioElement.Register("inputCiviliteMr", g2, function () { self.civilite = "Mr"; self.btnInscription3.CheckState(); });
        this.inputNom = Framework.Form.InputText.Register("inputNom", "", Framework.Form.Validator.MinLength(2, "Le champ Nom est requis"), function (nom) { self.nom = nom; self.btnInscription3.CheckState(); });
        this.inputPrenom = Framework.Form.InputText.Register("inputPrenom", "", Framework.Form.Validator.MinLength(2, "Le champ Prénom est requis"), function (prenom) { self.prenom = prenom; self.btnInscription3.CheckState(); });
        this.inputDateNaissance = Framework.Form.InputText.Register("inputDateNaissance", "", Framework.Form.Validator.FrenchDate(2003, "Le champ Date est requis (format : DD/MM/YYYY) et vous devez avoir plus de 18 ans."), function (naissance) { self.dateNaissance = naissance; self.btnInscription3.CheckState(); });
        this.inputAdresse = Framework.Form.InputText.Register("inputAdresse", "", Framework.Form.Validator.MinLength(2, "Le champ Adresse est requis"), function (adresse) { self.adresse = adresse; self.btnInscription3.CheckState(); });
        this.inputCP = Framework.Form.InputText.Register("inputCP", "", Framework.Form.Validator.CodePostal("Le champ CP est requis"), function (cp) { self.cp = cp; self.btnInscription3.CheckState(); });
        this.inputVille = Framework.Form.InputText.Register("inputVille", "", Framework.Form.Validator.MinLength(2, "Le champ Ville est requis"), function (ville) { self.ville = ville; self.btnInscription3.CheckState(); });
        this.inputMail = Framework.Form.InputText.Register("inputMail", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), function (mail) { self.mail = mail; self.btnInscription3.CheckState(); });
        this.checkboxLieu1 = Framework.Form.CheckBox.Register("checkboxLieu1", function () { return true; }, function (ev, cb) { self.lieuGMS = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu2 = Framework.Form.CheckBox.Register("checkboxLieu2", function () { return true; }, function (ev, cb) { self.lieuGrandeSurfaceSpecialisee = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu3 = Framework.Form.CheckBox.Register("checkboxLieu3", function () { return true; }, function (ev, cb) { self.lieuCommerceProximite = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu4 = Framework.Form.CheckBox.Register("checkboxLieu4", function () { return true; }, function (ev, cb) { self.lieuMarche = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu5 = Framework.Form.CheckBox.Register("checkboxLieu5", function () { return true; }, function (ev, cb) { self.lieuDrive = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu6 = Framework.Form.CheckBox.Register("checkboxLieu6", function () { return true; }, function (ev, cb) { self.lieuProducteur = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu7 = Framework.Form.CheckBox.Register("checkboxLieu7", function () { return true; }, function (ev, cb) { self.lieuInternet = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.inputLieu8 = Framework.Form.InputText.Register("inputLieu8", "", Framework.Form.Validator.NoValidation(), function (lieu) { self.lieuAutre = lieu; self.btnInscription4.CheckState(); });
        this.checkboxEnseigne1 = Framework.Form.CheckBox.Register("checkboxEnseigne1", function () { return true; }, function (ev, cb) { self.enseigneCarrefour = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne2 = Framework.Form.CheckBox.Register("checkboxEnseigne2", function () { return true; }, function (ev, cb) { self.enseigneLeclerc = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne3 = Framework.Form.CheckBox.Register("checkboxEnseigne3", function () { return true; }, function (ev, cb) { self.enseigneIntermarche = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne4 = Framework.Form.CheckBox.Register("checkboxEnseigne4", function () { return true; }, function (ev, cb) { self.enseigneSuperU = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne5 = Framework.Form.CheckBox.Register("checkboxEnseigne5", function () { return true; }, function (ev, cb) { self.enseigneCora = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne6 = Framework.Form.CheckBox.Register("checkboxEnseigne6", function () { return true; }, function (ev, cb) { self.enseigneCasino = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.inputEnseigne7 = Framework.Form.InputText.Register("inputEnseigne7", "", Framework.Form.Validator.NoValidation(), function (enseigne) { self.enseigneAutre = enseigne; self.btnInscription5.CheckState(); });
        this.checkboxCategorie1 = Framework.Form.CheckBox.Register("checkboxCategorie1", function () { return true; }, function (ev, cb) { self.categorieViandePoisson = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie2 = Framework.Form.CheckBox.Register("checkboxCategorie2", function () { return true; }, function (ev, cb) { self.categorieFruitLegume = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie3 = Framework.Form.CheckBox.Register("checkboxCategorie3", function () { return true; }, function (ev, cb) { self.categoriePainPatisserie = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie4 = Framework.Form.CheckBox.Register("checkboxCategorie4", function () { return true; }, function (ev, cb) { self.categorieSurgele = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie5 = Framework.Form.CheckBox.Register("checkboxCategorie5", function () { return true; }, function (ev, cb) { self.categorieEpicerieSalee = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie6 = Framework.Form.CheckBox.Register("checkboxCategorie6", function () { return true; }, function (ev, cb) { self.categorieEpicerieSucree = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie7 = Framework.Form.CheckBox.Register("checkboxCategorie7", function () { return true; }, function (ev, cb) { self.categorieFrais = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.btnInscription1 = Framework.Form.Button.Register("btnInscription1", function () {
            return true;
        }, function () {
            self.divPresentation.Hide();
            self.divCompris.Show();
        });
        this.btnInscription2 = Framework.Form.Button.Register("btnInscription2", function () {
            return true;
        }, function () {
            self.divCompris.Hide();
            //if (self.compris == true) {
            self.divCnil.Show();
            //} else {
            //    self.divFin.Show();
            //    self.divFin.SetHtml("<p>Merci pour votre participation.N'hésitez pas à parler de l'étude autour de vous si vous connaissez des gens potentiellement intéressés !</p>");
            //}
        });
        this.btnInscription3 = Framework.Form.Button.Register("btnInscription3", function () {
            return self.civilite != "" && self.inputNom.IsValid && self.inputPrenom.IsValid && self.inputDateNaissance.IsValid && self.inputAdresse.IsValid && self.inputCP.IsValid && self.inputVille.IsValid && self.inputMail.IsValid;
        }, function () {
            self.divCnil.Hide();
            self.divLieuAchat.Show();
        });
        this.btnInscription4 = Framework.Form.Button.Register("btnInscription4", function () {
            return true;
        }, function () {
            self.divLieuAchat.Hide();
            if (self.lieuDrive == true) {
                self.divEnseigne.Show();
            }
            else {
                self.divFin.Show();
                self.divFin.SetHtml("<p>Malheureusement, nous recherchons seulement des personnes qui font leur courses en drive. Merci pour votre participation.</p>");
            }
        });
        this.btnInscription5 = Framework.Form.Button.Register("btnInscription5", function () {
            return self.enseigneCarrefour != false || self.enseigneCasino != false || self.enseigneCora != false || self.enseigneIntermarche != false || self.enseigneLeclerc != false || self.enseigneSuperU != false || self.enseigneAutre != "";
        }, function () {
            self.divEnseigne.Hide();
            self.divCategories.Show();
        });
        this.btnInscription6 = Framework.Form.Button.Register("btnInscription6", function () {
            return self.categorieViandePoisson != false || self.categorieFruitLegume != false || self.categoriePainPatisserie != false || self.categorieEpicerieSucree != false || self.categorieFrais != false || self.categorieSurgele != false || self.categorieEpicerieSalee != false;
        }, function () {
            var self = _this;
            var questionnaire = new Models.QuestionnaireArbitrage();
            questionnaire.CP_inscription = self.cp;
            questionnaire.AchatGMS = self.lieuGMS;
            questionnaire.AchatGrandeSurfaceSpecialisee = self.lieuGrandeSurfaceSpecialisee;
            questionnaire.AchatCommerceProximite = self.lieuCommerceProximite;
            questionnaire.AchatMarche = self.lieuMarche;
            questionnaire.AchatDrive = self.lieuDrive;
            questionnaire.AchatProducteur = self.lieuProducteur;
            questionnaire.AchatInternet = self.lieuInternet;
            questionnaire.AchatAutre = self.lieuAutre;
            questionnaire.EnseigneCarrefour = self.enseigneCarrefour;
            questionnaire.EnseigneLeclerc = self.enseigneLeclerc;
            questionnaire.EnseigneIntermarche = self.enseigneIntermarche;
            questionnaire.EnseigneSuperU = self.enseigneSuperU;
            questionnaire.EnseigneCora = self.enseigneCora;
            questionnaire.EnseigneCasino = self.enseigneCasino;
            questionnaire.EnseigneAutre = self.enseigneAutre;
            questionnaire.CategorieViandePoisson = self.categorieViandePoisson;
            questionnaire.CategorieFruitLegume = self.categorieFruitLegume;
            questionnaire.CategoriePainPatisserie = self.categoriePainPatisserie;
            questionnaire.CategorieSurgele = self.categorieSurgele;
            questionnaire.CategorieEpicerieSalee = self.categorieEpicerieSalee;
            questionnaire.CategorieEpicerieSucree = self.categorieEpicerieSucree;
            questionnaire.CategorieFrais = self.categorieFrais;
            var json = JSON.stringify(questionnaire);
            var infos = "<p>Civilité : " + self.civilite + "</p>";
            infos += "<p>Nom : " + self.nom + "</p>";
            infos += "<p>Prénom : " + self.prenom + "</p>";
            infos += "<p>Date de naissance : " + self.dateNaissance + "</p>";
            infos += "<p>Adresse : " + self.adresse + "</p>";
            infos += "<p>Ville : " + self.ville + "</p>";
            infos += "<p>CP : " + self.cp + "</p>";
            infos += "<p>Mail : " + self.mail + "</p>";
            self.CallWCF('NewLoginConsoDrive', { json: json, infos: infos, mail: self.mail }, function () {
                Framework.Progress.Show("Enregistrement...");
            }, function (res) {
                Framework.Progress.Hide();
                self.divCategories.Hide();
                self.divFin.Show();
                if (res.Status == 'success') {
                    self.divFin.SetHtml("<p>Un e-mail avec un lien de connexion au questionnaire vous a été envoyé.</p><p> Nous vous remercions par avance pour votre participation.</p>");
                }
                else {
                    self.divFin.SetHtml("<p>" + res.ErrorMessage + "</p><p>Veuillez vérifier votre adresse mail et réessayer.</p><p>En cas de problème, vous pouvez envoyer un mail à : consodrive@inrae.fr.</p>");
                }
            });
        });
    };
    return ConsoDriveInscriptionApp;
}(Framework.App));
var ConsoDriveApp = /** @class */ (function (_super) {
    __extends(ConsoDriveApp, _super);
    function ConsoDriveApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        var _this = _super.call(this, ConsoDriveApp.GetRequirements(), isInTest) || this;
        _this.nbAliments = 30;
        _this.delaiFacture = 200;
        return _this;
    }
    ConsoDriveApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/consodrive';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
            requirements.AppUrl = 'https://www.chemosenstools.com/consodrive';
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
        requirements.Extensions = ["Rating", "Slider"];
        return requirements;
    };
    ConsoDriveApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    ConsoDriveApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        var id = "";
        var url = window.location.href;
        if (url.indexOf('?id=') > -1) {
            var hashes = url.slice(url.indexOf('?id=') + 4).split('&');
            if (hashes.length > 0) {
                id = hashes[0];
            }
        }
        this.showDivAuthentification(id);
    };
    ConsoDriveApp.prototype.checkQuestionnaire = function () {
        var acces = this.questionnaire.AccesQuestionnaire.filter(function (x) { return x.Page != "Authentification"; });
        if (acces.length == 0) {
            this.showDivConsentement();
            return;
        }
        var dernierePage = acces[acces.length - 1].Page;
        switch (dernierePage) {
            case "Consentement":
                this.showDivConsentement();
                break;
            case "Info":
                this.showDivInfo();
                break;
            case "Factures":
                this.showDivFactures();
                break;
            case "Instruction1":
                this.showDivInstruction1();
                break;
            case "Entrainement1":
                this.showDivEntrainement1();
                break;
            case "Entrainement2":
                this.showDivEntrainement2();
                break;
            case "Entrainement3":
                this.showDivEntrainement3();
                break;
            case "Entrainement4":
                this.showDivEntrainement4();
                break;
            case "Entrainement5":
                this.showDivEntrainement5();
                break;
            case "Entrainement6":
                this.showDivEntrainement6();
                break;
            case "Entrainement7":
                this.showDivEntrainement7();
                break;
            case "Entrainement8":
                this.showDivEntrainement8();
                break;
            case "Instruction2":
                this.showDivInstruction2();
                break;
            case "Entrainement9":
                this.showDivEntrainement9();
                break;
            case "Instruction3":
                this.showDivInstruction3();
                break;
            case "QuestionnaireAliment1":
                this.showDivQuestionnaireAliment1();
                break;
            case "QuestionnaireAliment2":
                this.showDivQuestionnaireAliment2();
                break;
            case "QuestionnaireAliment3":
                this.showDivQuestionnaireAliment3();
                break;
            case "QuestionnaireAliment4":
                this.showDivQuestionnaireAliment4();
                break;
            case "Instruction4":
                this.showDivInstruction4();
                break;
            case "QuestionnaireGeneral1":
                this.showDivQuestionnaireGeneral1();
                break;
            case "QuestionnaireGeneral2":
                this.showDivQuestionnaireGeneral2();
                break;
            case "QuestionnaireGeneral3":
                this.showDivQuestionnaireGeneral3();
                break;
            case "QuestionnaireGeneral4":
                this.showDivQuestionnaireGeneral4();
                break;
            case "QuestionnaireGeneral5":
                this.showDivQuestionnaireGeneral5();
                break;
            case "QuestionnaireGeneral6":
                this.showDivQuestionnaireGeneral6();
                break;
            case "QuestionnaireGeneral7":
                this.showDivQuestionnaireGeneral7();
                break;
            case "QuestionnaireGeneral8":
                this.showDivQuestionnaireGeneral8();
                break;
            case "QuestionnaireGeneral9":
                this.showDivQuestionnaireGeneral9();
                break;
            case "QuestionnaireIndividu1":
                this.showDivQuestionnaireIndividu1();
                break;
            case "QuestionnaireIndividu2":
                this.showDivQuestionnaireIndividu2();
                break;
            case "QuestionnaireIndividu3":
                this.showDivQuestionnaireIndividu3();
                break;
            case "QuestionnaireIndividu4":
                this.showDivQuestionnaireIndividu4();
                break;
            case "QuestionnaireIndividu5":
                this.showDivQuestionnaireIndividu5();
                break;
            case "QuestionnaireIndividu6":
                this.showDivQuestionnaireIndividu5();
                break;
            case "Fin":
                this.showDivFin();
                break;
        }
    };
    ConsoDriveApp.prototype.saveQuestionnaire = function (currentPage, onSuccess) {
        if (onSuccess === void 0) { onSuccess = function () { }; }
        var self = this;
        this.questionnaire.AccesQuestionnaire.push(new Models.AccesQuestionnaire(currentPage.replace("div", ""), new Date(Date.now())));
        self.CallWCF('SaveQuestionnaireConsoDrive', { code: self.questionnaire.Code, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, function () {
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
    ConsoDriveApp.prototype.showDivAuthentification = function (id) {
        if (id === void 0) { id = ""; }
        var self = this;
        this.showDiv("html/divAuthentification.html", function () {
            var pIdError = Framework.Form.TextElement.Register("pIdError");
            pIdError.Hide();
            var inputId = Framework.Form.InputText.Register("inputId", "", Framework.Form.Validator.MinLength(4, "Longueur minimale : 4 caractères."), function (text) {
                btnCheckId.CheckState();
            });
            var btnCheckId = Framework.Form.Button.Register("btnCheckId", function () { return inputId.Value.length >= 4; }, function () {
                self.CallWCF('LoginConsoDrive', { code: inputId.Value }, function () {
                    Framework.Progress.Show("Vérification du code...");
                }, function (res) {
                    Framework.Progress.Hide();
                    console.log(res.ErrorMessage);
                    if (res.Status == 'success') {
                        var json = res.Result;
                        if (json == "") {
                            // 1ere connexion
                            self.questionnaire = new Models.QuestionnaireArbitrage();
                            self.questionnaire.Code = inputId.Value;
                        }
                        else {
                            // Récupération de l'existant
                            self.questionnaire = JSON.parse(json);
                        }
                        self.saveQuestionnaire("divAuthentification", function () {
                            self.checkQuestionnaire();
                        });
                    }
                    else {
                        pIdError.Show();
                    }
                });
            });
            if (id != "") {
                self.CallWCF('LoginConsoDriveURL', { id: id }, function () {
                    Framework.Progress.Show("Vérification du code...");
                }, function (res) {
                    Framework.Progress.Hide();
                    console.log(res.ErrorMessage);
                    if (res.Status == 'success') {
                        var json = res.Result;
                        // Récupération de l'existant
                        self.questionnaire = JSON.parse(json);
                        self.questionnaire.Code = id;
                        self.saveQuestionnaire("divAuthentification", function () {
                            self.checkQuestionnaire();
                        });
                    }
                    else {
                        pIdError.Show();
                    }
                });
            }
        });
    };
    ConsoDriveApp.prototype.showDivConsentement = function () {
        var self = this;
        this.showDiv("html/divConsentement.html", function () {
            var btnDecline = Framework.Form.Button.Register("btnDecline", function () { return true; }, function () {
                var mw = Framework.Modal.Confirm("Confirmation requise", "Si vous cliquez sur \"Confirmer\", votre participation ne sera pas prise en compte et vous ne serez pas indemnisé(e). Confirmez-vous votre choix ?", function () {
                    self.questionnaire.ConsentementAccepte = false;
                    self.showDivFin();
                }, function () {
                    mw.Close();
                }, "Confirmer", "Annuler");
            });
            var btnAccept = Framework.Form.Button.Register("btnAccept", function () { return true; }, function () {
                self.questionnaire.ConsentementAccepte = true;
                self.showDivInfo();
            });
        });
    };
    ConsoDriveApp.prototype.showDivInfo = function () {
        var self = this;
        this.showDiv("html/divInfo.html", function () {
            var btnNext = Framework.Form.Button.Register("btnNext", function () { return true; }, function () {
                self.showDivFactures();
            });
        });
    };
    ConsoDriveApp.prototype.showDivFactures = function () {
        var self = this;
        this.showDiv("html/divFactures.html", function () {
            self.questionnaire.AccesQuestionnaire.push(new Models.AccesQuestionnaire("divQuestionnaireIndividu", new Date(Date.now())));
            var h4 = Framework.Form.TextElement.Register("h4");
            var spanNbTotalAliments = Framework.Form.TextElement.Register("spanNbTotalAliments", Models.QuestionnaireArbitrage.GetNbItems(self.questionnaire).toString());
            var spanNbAliments = Framework.Form.TextElement.Register("spanNbAliments", self.nbAliments.toString());
            var spanNbAliments2 = Framework.Form.TextElement.Register("spanNbAliments2", self.nbAliments.toString());
            //let divTableInvoices = Framework.Form.TextElement.Register("divTableInvoices");
            var pNbAliments = Framework.Form.TextElement.Register("pNbAliments");
            pNbAliments.Hide();
            pNbAliments.HtmlElement.classList.add("alert");
            pNbAliments.HtmlElement.classList.add("alert-danger");
            var btnGoToInstruction1 = Framework.Form.Button.Register("btnGoToInstruction1", function () {
                return true;
            }, function () {
                self.showDivInstruction1();
            });
            var btnFactures = Framework.Form.Button.Register("btnFactures", function () {
                return true;
            }, function () {
                var div = Framework.Form.TextElement.Create();
                ;
                var mw = Framework.Modal.Alert("Factures", div.HtmlElement);
                Models.QuestionnaireArbitrage.RenderItems(self.questionnaire, spanNbTotalAliments, div, "50vh");
            });
            btnGoToInstruction1.Hide();
            var uploadPDF = function (fileContent) {
                self.CallWCF('UploadInvoice2', { fileContent: fileContent, complete: false, delay: self.delaiFacture }, function () {
                    Framework.Progress.Show("Traitement de la facture...");
                }, function (res) {
                    Framework.Progress.Hide();
                    if (res.Status == "success") {
                        var json = res.Result;
                        var invoice = JSON.parse(json);
                        Models.QuestionnaireArbitrage.AddInvoice(self.questionnaire, invoice, self.nbAliments);
                        var nb = Models.QuestionnaireArbitrage.GetNbItems(self.questionnaire);
                        pNbAliments.Show();
                        spanNbTotalAliments.Set(nb.toString());
                        if (nb >= self.nbAliments) {
                            pNbAliments.HtmlElement.classList.add("alert");
                            pNbAliments.HtmlElement.classList.remove("alert-danger");
                            pNbAliments.HtmlElement.classList.add("alert-success");
                            h4.SetHtml("Veuillez cliquer sur \"Suivant\" pour continuer.");
                            btnGoToInstruction1.Show();
                            btnBrowse.Hide();
                        }
                        else {
                            h4.SetHtml("Veuillez sélectionner <b>une nouvelle facture au format PDF</b> en cliquant sur le bouton \"Ajouter une facture\" jusqu'à obtenir un minimum de <b>" + self.nbAliments + " aliments différents</b> (seuls les achats alimentaires sont pris en compte).");
                            btnBrowse.SetInnerHTML("Ajouter une facture");
                        }
                    }
                    else {
                        var error = res.ErrorMessage;
                        if (res.ErrorMessage == "INVOICE_TOO_OLD") {
                            error = "La facture est trop ancienne";
                        }
                        Framework.Modal.Alert("Erreur", error);
                    }
                });
            };
            var btnBrowse = Framework.Form.Button.Register("btnBrowse", function () { return true; }, function () {
                Framework.FileHelper.BrowseBinaries("pdf", function (fileContent) {
                    uploadPDF(fileContent);
                });
            });
        });
    };
    ConsoDriveApp.prototype.showDiv = function (htmlPath, onLoaded, nextButtonId, nextButtonAction, nextButtonEnableFunction, nextButtonTime, previousButtonId, previousButtonAction) {
        if (nextButtonId === void 0) { nextButtonId = undefined; }
        if (nextButtonAction === void 0) { nextButtonAction = undefined; }
        if (nextButtonEnableFunction === void 0) { nextButtonEnableFunction = function () { return true; }; }
        if (nextButtonTime === void 0) { nextButtonTime = undefined; }
        if (previousButtonId === void 0) { previousButtonId = undefined; }
        if (previousButtonAction === void 0) { previousButtonAction = undefined; }
        var self = this;
        document.body.innerHTML = "";
        var path = ConsoDriveApp.GetRequirements().AppUrl + "/" + htmlPath;
        Framework.BaseView.Load(path, "body", function (div) {
            $('.fa-info-circle').tooltipster({ trigger: 'click' });
            var previousAccess = false;
            if (self.questionnaire) {
                previousAccess = Models.QuestionnaireArbitrage.HasAccess(self.questionnaire, div.id.replace("div", ""));
                self.saveQuestionnaire(div.id, function () {
                    if (previousButtonId != undefined) {
                        var btnPrev = Framework.Form.Button.Register(previousButtonId, function () {
                            return true;
                        }, function () {
                            previousButtonAction();
                        });
                        if (nextButtonTime > 0 && previousAccess == false) {
                            Framework.Form.Button.DisableDuring(btnPrev, nextButtonTime);
                        }
                    }
                    if (nextButtonId != undefined) {
                        var btnNext = Framework.Form.Button.Register(nextButtonId, function () {
                            return nextButtonEnableFunction();
                        }, function () {
                            nextButtonAction();
                        });
                        if (nextButtonTime > 0 && previousAccess == false) {
                            Framework.Form.Button.DisableDuring(btnNext, nextButtonTime);
                        }
                    }
                    onLoaded();
                });
            }
            else {
                onLoaded();
            }
        });
    };
    ConsoDriveApp.prototype.showDivInstruction1 = function () {
        var self = this;
        this.showDiv("html/divInstruction1.html", function () { }, "btnGoToEntrainement1", function () { self.showDivEntrainement1(); });
    };
    ConsoDriveApp.prototype.showDivEntrainement1 = function () {
        var self = this;
        this.showDiv("html/divEntrainement1.html", function () { }, "btnGoToEntrainement2", function () { self.showDivEntrainement2(); }, function () { return true; }, 10, "btnBackToInstruction1", function () { self.showDivInstruction1(); });
    };
    ConsoDriveApp.prototype.showDivEntrainement2 = function () {
        var self = this;
        this.showDiv("html/divEntrainement2.html", function () { }, "btnGoToEntrainement3", function () { self.showDivEntrainement3(); }, function () { return true; }, 10, "btnBackToEntrainement1", function () { self.showDivEntrainement1(); });
    };
    ConsoDriveApp.prototype.showDivEntrainement3 = function () {
        var self = this;
        this.showDiv("html/divEntrainement3.html", function () { }, "btnGoToEntrainement4", function () { self.showDivEntrainement4(); }, function () { return true; }, 10, "btnBackToEntrainement2", function () { self.showDivEntrainement2(); });
    };
    ConsoDriveApp.prototype.showDivEntrainement4 = function () {
        var self = this;
        this.showDiv("html/divEntrainement4.html", function () { }, "btnGoToEntrainement5", function () { self.showDivEntrainement5(); }, function () { return true; }, 10, "btnBackToEntrainement3", function () { self.showDivEntrainement3(); });
    };
    ConsoDriveApp.prototype.showDivEntrainement5 = function () {
        var self = this;
        this.showDiv("html/divEntrainement5.html", function () { }, "btnGoToEntrainement6", function () { self.showDivEntrainement6(); }, function () { return true; }, 10, "btnBackToEntrainement4", function () { self.showDivEntrainement4(); });
    };
    ConsoDriveApp.prototype.showDivEntrainement6 = function () {
        var self = this;
        this.showDiv("html/divEntrainement6.html", function () { }, "btnGoToEntrainement7", function () { self.showDivEntrainement7(); }, function () { return true; }, 10, "btnBackToEntrainement5", function () { self.showDivEntrainement5(); });
    };
    ConsoDriveApp.prototype.showDivEntrainement7 = function () {
        var self = this;
        this.showDiv("html/divEntrainement7.html", function () { }, "btnGoToEntrainement8", function () { self.showDivEntrainement8(); }, function () { return true; }, 10, "btnBackToEntrainement6", function () { self.showDivEntrainement6(); });
    };
    ConsoDriveApp.prototype.showDivEntrainement8 = function () {
        var self = this;
        this.showDiv("html/divEntrainement8.html", function () { }, "btnGoToInstruction2", function () { self.showDivInstruction2(); }, function () { return true; }, 10, "btnBackToEntrainement7", function () { self.showDivEntrainement7(); });
    };
    ConsoDriveApp.prototype.showDivInstruction2 = function () {
        var self = this;
        this.showDiv("html/divInstruction2.html", function () { }, "btnGoToEntrainement9", function () { self.showDivEntrainement9(); }, function () { return true; }, undefined, "btnBackToEntrainement8", function () { self.showDivEntrainement8(); });
    };
    ConsoDriveApp.prototype.showDivEntrainement9 = function () {
        var self = this;
        this.showDiv("html/divEntrainement9.html", function () {
            self.showDivInstruction3();
            var nbDefaut = 40;
            var nbValeurEconomique = 0;
            var nbValeurEconomiqueErreur = 0;
            var nbProprietesOrganoleptiques = 0;
            var nbProprietesOrganoleptiquesErreur = 0;
            var nbQualiteSanitaire = 0;
            var nbQualiteSanitaireErreur = 0;
            var nbCaracteristiquesNutritionnelles = 0;
            var nbCaracteristiquesNutritionnellesErreur = 0;
            var nbImpactEnvironnemental = 0;
            var nbImpactEnvironnementalErreur = 0;
            var nbImpactEconomiqueSocial = 0;
            var nbImpactEconomiqueSocialErreur = 0;
            var nbConvictionsPersonnellesCulturelles = 0;
            var nbConvictionsPersonnellesCulturellesErreur = 0;
            var nbQualitesPratiques = 0;
            var nbQualitesPratiquesErreur = 0;
            var drop = function (ev) {
                ev.preventDefault();
                var data = ev.dataTransfer.getData("text");
                var div = ev.target;
                while (div.id.indexOf("divGrp") == -1) {
                    div = div.parentElement;
                }
                //div.appendChild(document.getElementById(data));
                //div.insertAdjacentElement('afterbegin',document.getElementById(data))
                var group = "";
                group = div.id.replace("divGrp", "");
                var question = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Label", data)[0];
                question.ClasseParSujetDansDimension = group;
                if (question.ClasseParSujetDansDimension == "Defaut") {
                    document.getElementById(data).style.color = "black";
                    div.appendChild(document.getElementById(data));
                }
                else if (question.ClasseParSujetDansDimension == question.Dimension) {
                    document.getElementById(data).style.color = "green";
                    question.Reponses.push(group);
                    div.appendChild(document.getElementById(data));
                }
                else {
                    document.getElementById(data).style.color = "red";
                    question.Reponses.push(group);
                    question.MauvaisesReponses++;
                    div.insertAdjacentElement('afterbegin', document.getElementById(data));
                }
                update();
            };
            var droppable = function (div) {
                div.HtmlElement.ondrop = function (ev) { drop(ev); };
                div.HtmlElement.ondragover = function (ev) { ev.preventDefault(); };
                div.HtmlElement.innerHTML = "";
            };
            var update = function () {
                // MAJ comptage, état bouton suivant
                nbDefaut = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Classe", "Defaut").length;
                nbValeurEconomique = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Classe", "Economique").length;
                nbValeurEconomiqueErreur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "MalClasse", "Economique").length;
                nbProprietesOrganoleptiques = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Classe", "Organoleptique").length;
                nbProprietesOrganoleptiquesErreur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "MalClasse", "Organoleptique").length;
                nbQualiteSanitaire = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Classe", "Sanitaire").length;
                nbQualiteSanitaireErreur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "MalClasse", "Sanitaire").length;
                nbCaracteristiquesNutritionnelles = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Classe", "Nutrition").length;
                nbCaracteristiquesNutritionnellesErreur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "MalClasse", "Nutrition").length;
                nbImpactEnvironnemental = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Classe", "Environnement").length;
                nbImpactEnvironnementalErreur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "MalClasse", "Environnement").length;
                nbImpactEconomiqueSocial = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Classe", "SocioEconomique").length;
                nbImpactEconomiqueSocialErreur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "MalClasse", "SocioEconomique").length;
                nbConvictionsPersonnellesCulturelles = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Classe", "Conviction").length;
                nbConvictionsPersonnellesCulturellesErreur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "MalClasse", "Conviction").length;
                nbQualitesPratiques = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Classe", "Pratique").length;
                nbQualitesPratiquesErreur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "MalClasse", "Pratique").length;
                spanDefaut.Set(nbDefaut.toString());
                spanValeurEconomique.Set(nbValeurEconomique.toString());
                spanValeurEconomiqueErreur.Set(nbValeurEconomiqueErreur.toString());
                spanProprietesOrganoleptiques.Set(nbProprietesOrganoleptiques.toString());
                spanProprietesOrganoleptiquesErreur.Set(nbProprietesOrganoleptiquesErreur.toString());
                spanQualiteSanitaire.Set(nbQualiteSanitaire.toString());
                spanQualiteSanitaireErreur.Set(nbQualiteSanitaireErreur.toString());
                spanCaracteristiquesNutritionnelles.Set(nbCaracteristiquesNutritionnelles.toString());
                spanCaracteristiquesNutritionnellesErreur.Set(nbCaracteristiquesNutritionnellesErreur.toString());
                spanImpactEnvironnemental.Set(nbImpactEnvironnemental.toString());
                spanImpactEnvironnementalErreur.Set(nbImpactEnvironnementalErreur.toString());
                spanImpactEconomiqueSocial.Set(nbImpactEconomiqueSocial.toString());
                spanImpactEconomiqueSocialErreur.Set(nbImpactEconomiqueSocialErreur.toString());
                spanConvictionsPersonnellesCulturelles.Set(nbConvictionsPersonnellesCulturelles.toString());
                spanConvictionsPersonnellesCulturellesErreur.Set(nbConvictionsPersonnellesCulturellesErreur.toString());
                spanQualitesPratiques.Set(nbQualitesPratiques.toString());
                spanQualitesPratiquesErreur.Set(nbQualitesPratiquesErreur.toString());
                btnGoToInstruction3.CheckState();
            };
            var btnGoToInstruction2 = Framework.Form.Button.Register("btnBackToInstruction2", function () {
                return true;
            }, function () {
                self.showDivInstruction2();
            });
            var btnGoToInstruction3 = Framework.Form.Button.Register("btnGoToInstruction3", function () {
                return true;
            }, function () {
                var nbGoodAnswers = Models.QuestionnaireArbitrage.GetNbGoodAnswers(self.questionnaire);
                if (nbGoodAnswers == 40) {
                    self.showDivInstruction3();
                }
                else {
                    Framework.Modal.Alert("Il reste des éléments mal classés", "Vous avez " + nbGoodAnswers + " bonnes réponses sur 40, il vous reste " + (40 - nbGoodAnswers) + " bonnes réponses à trouver avant de pouvoir passer à l'écran suivant.");
                }
            });
            var divGrpDefaut = Framework.Form.TextElement.Register("divGrpDefaut");
            var spanDefaut = Framework.Form.TextElement.Register("spanDefaut");
            droppable(divGrpDefaut);
            var divGrpValeurEconomique = Framework.Form.TextElement.Register("divGrpEconomique");
            var spanValeurEconomique = Framework.Form.TextElement.Register("spanValeurEconomique");
            var spanValeurEconomiqueErreur = Framework.Form.TextElement.Register("spanValeurEconomiqueErreur");
            droppable(divGrpValeurEconomique);
            var divGrpProprietesOrganoleptiques = Framework.Form.TextElement.Register("divGrpOrganoleptique");
            var spanProprietesOrganoleptiques = Framework.Form.TextElement.Register("spanProprietesOrganoleptiques");
            var spanProprietesOrganoleptiquesErreur = Framework.Form.TextElement.Register("spanProprietesOrganoleptiquesErreur");
            droppable(divGrpProprietesOrganoleptiques);
            var divGrpQualiteSanitaire = Framework.Form.TextElement.Register("divGrpSanitaire");
            var spanQualiteSanitaire = Framework.Form.TextElement.Register("spanQualiteSanitaire");
            var spanQualiteSanitaireErreur = Framework.Form.TextElement.Register("spanQualiteSanitaireErreur");
            droppable(divGrpQualiteSanitaire);
            var divGrpCaracteristiquesNutritionnelles = Framework.Form.TextElement.Register("divGrpNutrition");
            var spanCaracteristiquesNutritionnelles = Framework.Form.TextElement.Register("spanCaracteristiquesNutritionnelles");
            var spanCaracteristiquesNutritionnellesErreur = Framework.Form.TextElement.Register("spanCaracteristiquesNutritionnellesErreur");
            droppable(divGrpCaracteristiquesNutritionnelles);
            var divGrpImpactEnvironnemental = Framework.Form.TextElement.Register("divGrpEnvironnement");
            var spanImpactEnvironnemental = Framework.Form.TextElement.Register("spanImpactEnvironnemental");
            var spanImpactEnvironnementalErreur = Framework.Form.TextElement.Register("spanImpactEnvironnementalErreur");
            droppable(divGrpImpactEnvironnemental);
            var divGrpImpactEconomiqueSocial = Framework.Form.TextElement.Register("divGrpSocioEconomique");
            var spanImpactEconomiqueSocial = Framework.Form.TextElement.Register("spanImpactEconomiqueSocial");
            var spanImpactEconomiqueSocialErreur = Framework.Form.TextElement.Register("spanImpactEconomiqueSocialErreur");
            droppable(divGrpImpactEconomiqueSocial);
            var divGrpConvictionsPersonnellesCulturelles = Framework.Form.TextElement.Register("divGrpConviction");
            var spanConvictionsPersonnellesCulturelles = Framework.Form.TextElement.Register("spanConvictionsPersonnellesCulturelles");
            var spanConvictionsPersonnellesCulturellesErreur = Framework.Form.TextElement.Register("spanConvictionsPersonnellesCulturellesErreur");
            droppable(divGrpConvictionsPersonnellesCulturelles);
            var divGrpQualitesPratiques = Framework.Form.TextElement.Register("divGrpPratique");
            var spanQualitesPratiques = Framework.Form.TextElement.Register("spanQualitesPratiques");
            var spanQualitesPratiquesErreur = Framework.Form.TextElement.Register("spanQualitesPratiquesErreur");
            droppable(divGrpQualitesPratiques);
            var arr = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "All", "");
            Framework.Array.Shuffle(arr);
            arr.forEach(function (x) {
                var div = Framework.Form.TextElement.Create(x.Label);
                div.HtmlElement.id = x.Label;
                if (x.ClasseParSujetDansDimension == "Defaut") {
                    div.HtmlElement.style.color = "black";
                }
                else if (x.ClasseParSujetDansDimension == x.Dimension) {
                    div.HtmlElement.style.color = "green";
                }
                else {
                    div.HtmlElement.style.color = "red";
                }
                div.HtmlElement.classList.add("draggable");
                div.HtmlElement.draggable = true;
                div.HtmlElement.ondragstart = function (event) {
                    event.dataTransfer.setData("text", (event.target).id.replace("divGrp", ""));
                };
                switch (x.ClasseParSujetDansDimension) {
                    case "Defaut":
                        divGrpDefaut.Append(div);
                        break;
                    case "Economique":
                        divGrpValeurEconomique.Append(div);
                        break;
                    case "Organoleptique":
                        divGrpProprietesOrganoleptiques.Append(div);
                        break;
                    case "Sanitaire":
                        divGrpQualiteSanitaire.Append(div);
                        break;
                    case "Nutrition":
                        divGrpCaracteristiquesNutritionnelles.Append(div);
                        break;
                    case "Environnement":
                        divGrpImpactEnvironnemental.Append(div);
                        break;
                    case "SocioEconomique":
                        divGrpImpactEconomiqueSocial.Append(div);
                        break;
                    case "Conviction":
                        divGrpConvictionsPersonnellesCulturelles.Append(div);
                        break;
                    case "Pratique":
                        divGrpQualitesPratiques.Append(div);
                        break;
                }
            });
            update();
        });
    };
    ConsoDriveApp.prototype.showDivInstruction3 = function () {
        var self = this;
        this.showDiv("html/divInstruction3.html", function () { }, "btnGoToQuestionnaireAliment1", function () { self.showDivQuestionnaireAliment1(); });
    };
    ConsoDriveApp.prototype.getLastAliment = function () {
        var self = this;
        var aliments = this.questionnaire.QuestionsAliment.filter(function (x) { return x.EstNote == true; });
        if (aliments.length >= (this.nbAliments + 1) || self.questionnaire.IndexQuestion > this.questionnaire.QuestionsAliment.length) {
            // Aliment répété
            //let alimentRepete = this.questionnaire.QuestionsAliment.filter(x => { return x.EstRepete == true && x.EstNote == true });
            //if (alimentRepete.length > 0) {
            // Fin de la boucle sur les aliments
            self.showDivInstruction4();
            return false;
            //} else {
            //    alimentRepete = this.questionnaire.QuestionsAliment.filter(x => { return x.EstRepete == true && x.Choisi != "non" && x.Consomme >= 0 });
            //    //alimentRepete = this.questionnaire.QuestionsAliment.filter(x => { return x.EstRepete == true });
            //    if (alimentRepete.length == 0) {
            //        this.nbAliments++;
            //        let aliments = this.questionnaire.QuestionsAliment.filter(x => x.EstNote == true);
            //        let random = Framework.Random.Helper.GetRandomInt(6, aliments.length - 1);
            //        let aliment = aliments[random];
            //        let q = new Models.QuestionAliment(aliment.Designation, aliment.Rayon);
            //        q.EstRepete = true;
            //        q.Position = 1000;
            //        self.questionnaire.IndexQuestion = 1000;
            //        this.questionnaire.QuestionsAliment.push(q);
            //    }
            //    alimentRepete = this.questionnaire.QuestionsAliment.filter(x => { return x.EstRepete == true });
            //    self.aliment = alimentRepete[0];
            //    return true;
            //}
        }
        else {
            aliments = this.questionnaire.QuestionsAliment.filter(function (x) { return x.Position == self.questionnaire.IndexQuestion; });
            self.aliment = aliments[0];
            return true;
        }
    };
    ConsoDriveApp.prototype.showDivQuestionnaireAliment1 = function () {
        var self = this;
        if (this.getLastAliment() == false) {
            return;
        }
        var show = function () {
            self.showDiv("html/divQuestionnaireAliment1.html", function () {
                var reponse = undefined;
                var divNomAliment = Framework.Form.TextElement.Register("divNomAliment1");
                divNomAliment.Set(self.aliment.Designation);
                var inputConsommeOui = Framework.Form.CheckBox.Register("inputConsommeOui", function () { return true; }, function () { self.aliment.Consomme = 1; btnGoToQuestionnaireAliment2.CheckState(); }, "OUI");
                var inputConsommeNon = Framework.Form.CheckBox.Register("inputConsommeNon", function () { return true; }, function () { self.aliment.Consomme = 0; btnGoToQuestionnaireAliment2.CheckState(); }, "NON");
                var inputConsommeNonAlimentaire = Framework.Form.CheckBox.Register("inputConsommeNonAlimentaire", function () { return true; }, function () { self.aliment.Consomme = -1; btnGoToQuestionnaireAliment2.CheckState(); }, "Non alimentaire");
                if (self.aliment.Consomme == 1) {
                    inputConsommeOui.Check();
                }
                if (self.aliment.Consomme == 0) {
                    inputConsommeNon.Check();
                }
                if (self.aliment.Consomme == -1) {
                    inputConsommeNonAlimentaire.Check();
                }
                var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                    return true;
                }, function () {
                    if (self.questionnaire.IndexQuestion > 1) {
                        self.questionnaire.IndexQuestion--;
                        self.showDivQuestionnaireAliment4();
                    }
                    else {
                        self.showDivInstruction3();
                    }
                });
                var btnGoToQuestionnaireAliment2 = Framework.Form.Button.Register("btnGoToQuestionnaireAliment2", function () {
                    return (self.aliment.Consomme != undefined);
                }, function () {
                    if (self.aliment.Consomme > -1) {
                        self.showDivQuestionnaireAliment2();
                    }
                    else {
                        // Nouvel aliment      
                        self.aliment.EstNote = false;
                        self.questionnaire.IndexQuestion++;
                        self.showDivQuestionnaireAliment1();
                    }
                });
            });
        };
        if (this.questionnaire.IndexQuestion > 1) {
            var div = document.createElement("h2");
            div.innerText = "Nouvel aliment";
            div.style.textAlign = "center";
            var mw_1 = Framework.Modal.CustomWithBackdrop(div);
            mw_1.show();
            setTimeout(function () { mw_1.Close(); show(); }, 2000);
        }
        else {
            show();
        }
    };
    ConsoDriveApp.prototype.showDivQuestionnaireAliment2 = function () {
        var self = this;
        if (this.getLastAliment() == false) {
            return;
        }
        this.showDiv("html/divQuestionnaireAliment2.html", function () {
            var reponse = undefined;
            var divNomAliment = Framework.Form.TextElement.Register("divNomAliment2");
            divNomAliment.Set(self.aliment.Designation);
            var inputChoixOui = Framework.Form.CheckBox.Register("inputChoixOui", function () { return true; }, function () { self.aliment.Choisi = "oui"; btnGoToQuestionnaireAliment3.CheckState(); }, "OUI");
            var inputChoixNon = Framework.Form.CheckBox.Register("inputChoixNon", function () { return true; }, function () { self.aliment.Choisi = "non"; btnGoToQuestionnaireAliment3.CheckState(); }, "NON");
            var inputChoixPartage = Framework.Form.CheckBox.Register("inputChoixPartage", function () { return true; }, function () { self.aliment.Choisi = "partage"; btnGoToQuestionnaireAliment3.CheckState(); }, "PARTAGE");
            if (self.aliment.Choisi == "oui") {
                inputChoixOui.Check();
            }
            if (self.aliment.Choisi == "non") {
                inputChoixNon.Check();
            }
            if (self.aliment.Choisi == "partage") {
                inputChoixPartage.Check();
            }
            var btnGoToQuestionnaireAliment3 = Framework.Form.Button.Register("btnGoToQuestionnaireAliment3", function () {
                return (self.aliment.Choisi != undefined);
            }, function () {
                if (self.aliment.Choisi == "non") {
                    // Nouvel aliment
                    self.aliment.EstNote = false;
                    self.questionnaire.IndexQuestion++;
                    self.showDivQuestionnaireAliment1();
                }
                else {
                    self.showDivQuestionnaireAliment3();
                }
            });
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireAliment1();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireAliment3 = function () {
        var self = this;
        if (this.getLastAliment() == false) {
            return;
        }
        this.showDiv("html/divQuestionnaireAliment3.html", function () {
            var divNomAliment = Framework.Form.TextElement.Register("divNomAliment3");
            divNomAliment.Set(self.aliment.Designation);
            var economique = Models.QuestionAliment.GetDimension(self.aliment, "Economique");
            var sensoriel = Models.QuestionAliment.GetDimension(self.aliment, "Organoleptique");
            var sanitaire = Models.QuestionAliment.GetDimension(self.aliment, "Sanitaire");
            var nutrition = Models.QuestionAliment.GetDimension(self.aliment, "Nutrition");
            var environnement = Models.QuestionAliment.GetDimension(self.aliment, "Environnement");
            var socio = Models.QuestionAliment.GetDimension(self.aliment, "SocioEconomique");
            var conviction = Models.QuestionAliment.GetDimension(self.aliment, "Conviction");
            var pratique = Models.QuestionAliment.GetDimension(self.aliment, "Pratique");
            var autre = Models.QuestionAliment.GetDimension(self.aliment, "Autre");
            var btnGoToQuestionnaireAliment4 = Framework.Form.Button.Register("btnGoToQuestionnaireAliment4", function () {
                var autre = Models.QuestionAliment.GetDimension(self.aliment, "Autre");
                return (economique.ImportantAliment == 1
                    || sensoriel.ImportantAliment == 1
                    || sanitaire.ImportantAliment == 1
                    || nutrition.ImportantAliment == 1
                    || environnement.ImportantAliment == 1
                    || socio.ImportantAliment == 1
                    || conviction.ImportantAliment == 1
                    || pratique.ImportantAliment == 1
                    || (autre.ImportantAliment == 0 || (autre.ImportantAliment == 1 && autre.Label.length > 4)));
            }, function () {
                self.showDivQuestionnaireAliment4();
            });
            var inputInfluenceValeurEconomique = Framework.Form.CheckBox.Register("inputInfluenceValeurEconomique", function () { return true; }, function (event, cb) { economique.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            var inputInfluenceProprietesOrganoleptiques = Framework.Form.CheckBox.Register("inputInfluenceProprietesOrganoleptiques", function () { return true; }, function (event, cb) { sensoriel.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            var inputInfluenceQualiteSanitaire = Framework.Form.CheckBox.Register("inputInfluenceQualiteSanitaire", function () { return true; }, function (event, cb) { sanitaire.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            var inputInfluenceCaracteristiquesNutritionnelles = Framework.Form.CheckBox.Register("inputInfluenceCaracteristiquesNutritionnelles", function () { return true; }, function (event, cb) { nutrition.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            var inputInfluenceImpactEnvironnemental = Framework.Form.CheckBox.Register("inputInfluenceImpactEnvironnemental", function () { return true; }, function (event, cb) { environnement.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            var inputInfluenceImpactEconomiqueSocial = Framework.Form.CheckBox.Register("inputInfluenceImpactEconomiqueSocial", function () { return true; }, function (event, cb) { socio.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            var inputInfluenceConvictionsPersonnellesCulturelles = Framework.Form.CheckBox.Register("inputInfluenceConvictionsPersonnellesCulturelles", function () { return true; }, function (event, cb) { conviction.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            var inputInfluenceQualitesPratiques = Framework.Form.CheckBox.Register("inputInfluenceQualitesPratiques", function () { return true; }, function (event, cb) { pratique.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            var inputInfluenceAutre = Framework.Form.CheckBox.Register("inputInfluenceAutre", function () { return true; }, function (event, cb) { autre.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            var inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), function (val) { autre.Label = val; btnGoToQuestionnaireAliment4.CheckState(); });
            if (economique.ImportantAliment == 1) {
                inputInfluenceValeurEconomique.Check();
            }
            if (sensoriel.ImportantAliment == 1) {
                inputInfluenceProprietesOrganoleptiques.Check();
            }
            if (sanitaire.ImportantAliment == 1) {
                inputInfluenceQualiteSanitaire.Check();
            }
            if (nutrition.ImportantAliment == 1) {
                inputInfluenceCaracteristiquesNutritionnelles.Check();
            }
            if (environnement.ImportantAliment == 1) {
                inputInfluenceImpactEnvironnemental.Check();
            }
            if (socio.ImportantAliment == 1) {
                inputInfluenceImpactEconomiqueSocial.Check();
            }
            if (conviction.ImportantAliment == 1) {
                inputInfluenceConvictionsPersonnellesCulturelles.Check();
            }
            if (pratique.ImportantAliment == 1) {
                inputInfluenceQualitesPratiques.Check();
            }
            if (autre.ImportantAliment == 1) {
                inputInfluenceAutre.Check();
                inputAutre.Set(autre.Label);
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireAliment2();
            });
        });
    };
    //private createRadioButtonGroup(name: string, values: string[], score: number, onClick: (ev: MouseEvent) => void) {
    //    let div = document.createElement("div");
    //    values.forEach(v => {
    //        let div1 = document.createElement("div");
    //        div1.classList.add("form-check");
    //        div1.classList.add("form-check-inline");
    //        div.append(div1);
    //        let input1 = document.createElement("input");
    //        input1.name = "radio" + name;
    //        input1.setAttribute("score", v);
    //        input1.type = "radio";
    //        input1.value = name;
    //        if (score == 1 && v == "Secondaire") {
    //            input1.checked = true;
    //        }
    //        if (score == 2 && v == "Important") {
    //            input1.checked = true;
    //        }
    //        if (score == 3 && v == "Primordial") {
    //            input1.checked = true;
    //        }
    //        input1.classList.add("form-check-input");
    //        input1.onclick = (ev: MouseEvent) => {
    //            onClick(ev);
    //        };
    //        div1.append(input1);
    //        let label1 = document.createElement("label");
    //        label1.classList.add("form-check-label");
    //        label1.textContent = v;
    //        div1.append(label1);
    //    });
    //    return div;
    //}
    ConsoDriveApp.prototype.showDivQuestionnaireAliment4 = function () {
        var self = this;
        if (this.getLastAliment() == false) {
            return;
        }
        this.showDiv("html/divQuestionnaireAliment4.html", function () {
            var divNomAliment = Framework.Form.TextElement.Register("divNomAliment4");
            divNomAliment.Set(self.aliment.Designation);
            var importantDimensions = Models.QuestionAliment.GetImportantDimensions(self.aliment);
            var divCriteresImportant = Framework.Form.TextElement.Register("divCriteresImportant");
            importantDimensions.forEach(function (x) {
                try {
                    var h4 = document.createElement("h4");
                    h4.style.fontWeight = "bold";
                    h4.classList.add("mt-5");
                    var text = x.Label.split("(");
                    if (text[1] == undefined) {
                        text[1] = text[0];
                    }
                    if (x.Nom != "Autre") {
                        var span = document.createElement("span");
                        span.classList.add("tooltipster");
                        span.classList.add("fas");
                        span.classList.add("fa-info-circle");
                        span.title = text[1].replace(")", "");
                        //span.innerHTML = "<i class=\"fas fa-info-circle\" title=\"" + text[1] + "\"></i> ";
                        h4.append(span);
                        //span.onclick = () => {
                        //    alert(text[1]);
                        setTimeout(function () {
                            $('.fa-info-circle').tooltipster({ trigger: 'click' });
                        }, 100);
                        //};
                    }
                    var span2 = document.createElement("span");
                    span2.innerHTML = " " + text[0];
                    h4.append(span2);
                    //h4.innerHTML = "<i class=\"fas fa-info-circle\" title=\"" + text[1] + "\"></i> " + text[0];
                    divCriteresImportant.HtmlElement.append(h4);
                    var score = undefined;
                    if (x.ScoreAliment >= 1) {
                        score = x.ScoreAliment.toString();
                    }
                    //let slider = Framework.Slider.Slider.Create(x.Nom, 1, 3, score, (name: string, score: number) => {
                    //    Models.QuestionAliment.GetDimension(self.aliment, name).ScoreAliment = score;
                    //    btnBackToQuestionnaireAliment1.CheckState();
                    //});
                    var divSlider = document.createElement("div");
                    divSlider.style.float = "left";
                    divSlider.style.width = "40%";
                    divSlider.classList.add("scale-2");
                    divSlider.classList.add("text-center");
                    //divSlider.append(slider);
                    var rating = Framework.Rating.Render(divSlider, x.Nom, 1, 5, score, function (x, name) {
                        Models.QuestionAliment.GetDimension(self.aliment, name).ScoreAliment = x;
                        btnBackToQuestionnaireAliment1.CheckState();
                    });
                    var borneGauche = document.createElement("div");
                    borneGauche.innerHTML = "Secondaire";
                    divCriteresImportant.HtmlElement.appendChild(borneGauche);
                    borneGauche.style.float = "left";
                    borneGauche.style.width = "30%";
                    borneGauche.style.textAlign = "right";
                    divCriteresImportant.HtmlElement.append(divSlider);
                    var borneDroite = document.createElement("div");
                    borneDroite.innerHTML = "Primordial";
                    divCriteresImportant.HtmlElement.appendChild(borneDroite);
                    borneDroite.style.float = "left";
                    borneDroite.style.width = "30%";
                    borneDroite.style.textAlign = "left";
                    var divClearer = document.createElement("div");
                    divClearer.style.clear = "both";
                    divCriteresImportant.HtmlElement.append(divClearer);
                }
                catch (_a) {
                }
            });
            var btnBackToQuestionnaireAliment1 = Framework.Form.Button.Register("btnBackToQuestionnaireAliment1", function () {
                var incomplete = importantDimensions.filter(function (x) {
                    return x.ScoreAliment == 0;
                }).length;
                return (incomplete == 0);
            }, function () {
                // Nouvel aliment
                self.aliment.EstNote = true;
                self.questionnaire.IndexQuestion++;
                self.showDivQuestionnaireAliment1();
            });
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireAliment3();
            });
        });
    };
    ConsoDriveApp.prototype.showDivInstruction4 = function () {
        var self = this;
        this.showDiv("html/divInstruction4.html", function () { }, "btnGoToQuestionnaireGeneral1", function () {
            self.showDivQuestionnaireGeneral1();
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireGeneral1 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireGeneral1.html", function () {
            var divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            var divRankingValeurEconomique = Framework.Form.TextElement.Register("divRankingValeurEconomique");
            var dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Economique");
            var prixEuro = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "PrixEuro")[0];
            var prixKg = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "PrixKg")[0];
            var offrePromo = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "OffrePromo")[0];
            var adequationBudget = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AdequationBudget")[0];
            var autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreEconomique")[0];
            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }
            var rating = Framework.Rating.Render(divRankingValeurEconomique.HtmlElement, "", 1, 5, dimension.ScoreGlobal, function (x) {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnGoToQuestionnaireGeneral2.CheckState();
            });
            var btnGoToQuestionnaireGeneral2 = Framework.Form.Button.Register("btnGoToQuestionnaireGeneral2", function () {
                return (dimension.NonPrisEnCompte == 1 ||
                    (prixEuro.Important == 1
                        || prixKg.Important == 1
                        || offrePromo.Important == 1
                        || adequationBudget.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                            && dimension.ScoreGlobal > 0));
            }, function () {
                self.showDivQuestionnaireGeneral2();
            });
            var inputValeurEconomiqueSensiblePrixAffiche = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensiblePrixAffiche", function () { return true; }, function (event, cb) { prixEuro.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            var inputValeurEconomiqueSensiblePrixKg = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensiblePrixKg", function () { return true; }, function (event, cb) { prixKg.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            var inputValeurEconomiqueSensibleReduction = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensibleReduction", function () { return true; }, function (event, cb) { offrePromo.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            var inputValeurEconomiqueSensibleAdequation = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensibleAdequation", function () { return true; }, function (event, cb) { adequationBudget.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            var inputValeurEconomiqueSensibleAutre = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensibleAutre", function () { return true; }, function (event, cb) { autre.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            var inputValeurEconomiqueAutre = Framework.Form.InputText.Register("inputValeurEconomiqueAutre", "", Framework.Form.Validator.NoValidation(), function (val) { Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreEconomique")[0].Label = val; if (val.length > 0) {
                autre.Important = 1;
                inputValeurEconomiqueSensibleAutre.Check();
            }
            else {
                autre.Important = 0;
                inputValeurEconomiqueSensibleAutre.Uncheck();
            } ; btnGoToQuestionnaireGeneral2.CheckState(); });
            var inputValeurEconomiquePasSensible = Framework.Form.CheckBox.Register("inputValeurEconomiquePasSensible", function () { return true; }, function (event, cb) {
                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();
                //if (cb.IsChecked) {
                //    divCriteres.Hide();
                //    rating.Clear();
                //    rating.Disable();
                //    //divRankingValeurEconomique.Hide();
                //    dimension.ScoreGlobal = 0;
                //    inputValeurEconomiqueSensiblePrixAffiche.Uncheck(); prixEuro.Important = 0;
                //    inputValeurEconomiqueSensiblePrixKg.Uncheck(); prixKg.Important = 0;
                //    inputValeurEconomiqueSensibleReduction.Uncheck(); offrePromo.Important = 0;
                //    inputValeurEconomiqueSensibleAdequation.Uncheck(); adequationBudget.Important = 0;
                //    inputValeurEconomiqueSensibleAutre.Uncheck(); autre.Important = 0;
                //} else {
                //    if (dimension.ScoreGlobal > 0) {
                //        divCriteres.Show();
                //    }
                //    rating.Enable();
                //    //divRankingValeurEconomique.Show();
                //}
                //btnGoToQuestionnaireGeneral2.CheckState();
            }, "");
            var f = function () {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    inputValeurEconomiqueSensiblePrixAffiche.Uncheck();
                    prixEuro.Important = 0;
                    inputValeurEconomiqueSensiblePrixKg.Uncheck();
                    prixKg.Important = 0;
                    inputValeurEconomiqueSensibleReduction.Uncheck();
                    offrePromo.Important = 0;
                    inputValeurEconomiqueSensibleAdequation.Uncheck();
                    adequationBudget.Important = 0;
                    inputValeurEconomiqueSensibleAutre.Uncheck();
                    autre.Important = 0;
                    inputValeurEconomiqueAutre.Set("");
                    autre.Label = "";
                }
                else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                }
                btnGoToQuestionnaireGeneral2.CheckState();
            };
            f();
            if (prixEuro.Important == 1) {
                inputValeurEconomiqueSensiblePrixAffiche.Check();
            }
            if (prixKg.Important == 1) {
                inputValeurEconomiqueSensiblePrixKg.Check();
            }
            if (offrePromo.Important == 1) {
                inputValeurEconomiqueSensibleReduction.Check();
            }
            if (adequationBudget.Important == 1) {
                inputValeurEconomiqueSensibleAdequation.Check();
            }
            if (autre.Important == 1) {
                inputValeurEconomiqueSensibleAutre.Check();
                inputValeurEconomiqueAutre.Set(autre.Label);
            }
            if (dimension.NonPrisEnCompte == 1) {
                inputValeurEconomiquePasSensible.Check();
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivInstruction4();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireGeneral2 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireGeneral2.html", function () {
            var divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            var divRanking = Framework.Form.TextElement.Register("divRanking");
            var dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Organoleptique");
            var gout = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Gout")[0];
            var plaisir = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Plaisir")[0];
            var marque = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "MarqueOrganoleptique")[0];
            var variete = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "VarieteOrganoleptique")[0];
            var nouveaute = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Nouveaute")[0];
            var autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreOrganoleptique")[0];
            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }
            var rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, function (x) {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnGoToQuestionnaireGeneral3.CheckState();
            });
            var btnGoToQuestionnaireGeneral3 = Framework.Form.Button.Register("btnGoToQuestionnaireGeneral3", function () {
                return (dimension.NonPrisEnCompte == 1 ||
                    (gout.Important == 1
                        || plaisir.Important == 1
                        || marque.Important == 1
                        || nouveaute.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                            && dimension.ScoreGlobal > 0));
            }, function () {
                self.showDivQuestionnaireGeneral3();
            });
            var inputProprieteOrganoleptiqueGout = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueGout", function () { return true; }, function (event, cb) { gout.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            var inputProprieteOrganoleptiqueNouveau = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueNouveau", function () { return true; }, function (event, cb) { nouveaute.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            var inputProprieteOrganoleptiqueVarie = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueVarie", function () { return true; }, function (event, cb) { variete.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            var inputProprieteOrganoleptiquePlaisir = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiquePlaisir", function () { return true; }, function (event, cb) { plaisir.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            var inputProprieteOrganoleptiqueIndirect = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueIndirect", function () { return true; }, function (event, cb) { marque.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            var inputProprieteOrganoleptiqueAutre = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueAutre", function () { return true; }, function (event, cb) { autre.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            var inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), function (val) { Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreOrganoleptique")[0].Label = val; if (val.length > 0) {
                autre.Important = 1;
                inputProprieteOrganoleptiqueAutre.Check();
            }
            else {
                autre.Important = 0;
                inputProprieteOrganoleptiqueAutre.Uncheck();
            } ; btnGoToQuestionnaireGeneral3.CheckState(); });
            var inputProprieteOrganoleptiquePasSensible = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiquePasSensible", function () { return true; }, function (event, cb) {
                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();
            }, "");
            var f = function () {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    inputProprieteOrganoleptiqueGout.Uncheck();
                    gout.Important = 0;
                    inputProprieteOrganoleptiqueNouveau.Uncheck();
                    plaisir.Important = 0;
                    inputProprieteOrganoleptiqueVarie.Uncheck();
                    marque.Important = 0;
                    inputProprieteOrganoleptiquePlaisir.Uncheck();
                    variete.Important = 0;
                    inputProprieteOrganoleptiqueIndirect.Uncheck();
                    nouveaute.Important = 0;
                    inputProprieteOrganoleptiqueAutre.Uncheck();
                    autre.Important = 0;
                    inputAutre.Set("");
                    autre.Label = "";
                }
                else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }
                btnGoToQuestionnaireGeneral3.CheckState();
            };
            f();
            if (gout.Important == 1) {
                inputProprieteOrganoleptiqueGout.Check();
            }
            if (plaisir.Important == 1) {
                inputProprieteOrganoleptiqueNouveau.Check();
            }
            if (marque.Important == 1) {
                inputProprieteOrganoleptiqueIndirect.Check();
            }
            if (variete.Important == 1) {
                inputProprieteOrganoleptiqueVarie.Check();
            }
            if (nouveaute.Important == 1) {
                inputProprieteOrganoleptiqueNouveau.Check();
            }
            if (autre.Important == 1) {
                inputProprieteOrganoleptiqueAutre.Check();
                inputAutre.Set(autre.Label);
            }
            if (dimension.NonPrisEnCompte == 1) {
                inputProprieteOrganoleptiquePasSensible.Check();
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireGeneral1();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireGeneral3 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireGeneral3.html", function () {
            var divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            var divRanking = Framework.Form.TextElement.Register("divRanking");
            var dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Sanitaire");
            var pesticide = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Pesticide")[0];
            var contaminant = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Contaminant")[0];
            var toxine = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Toxine")[0];
            var additif = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Additif")[0];
            var toxique = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Toxique")[0];
            var autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreSanitaire")[0];
            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }
            var rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, function (x) {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnGoToQuestionnaireGeneral4.CheckState();
            });
            var btnGoToQuestionnaireGeneral4 = Framework.Form.Button.Register("btnGoToQuestionnaireGeneral4", function () {
                return (dimension.NonPrisEnCompte == 1 ||
                    (pesticide.Important == 1
                        || contaminant.Important == 1
                        || toxine.Important == 1
                        || additif.Important == 1
                        || toxique.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                            && dimension.ScoreGlobal > 0));
            }, function () {
                self.showDivQuestionnaireGeneral4();
            });
            var inputQualiteSanitairePesticide = Framework.Form.CheckBox.Register("inputQualiteSanitairePesticide", function () { return true; }, function (event, cb) { pesticide.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            var inputQualiteSanitaireContaminant = Framework.Form.CheckBox.Register("inputQualiteSanitaireContaminant", function () { return true; }, function (event, cb) { contaminant.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            var inputQualiteSanitaireToxine = Framework.Form.CheckBox.Register("inputQualiteSanitaireToxine", function () { return true; }, function (event, cb) { toxine.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            var inputQualiteSanitaireAdditif = Framework.Form.CheckBox.Register("inputQualiteSanitaireAdditif", function () { return true; }, function (event, cb) { additif.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            var inputQualiteSanitaireToxique = Framework.Form.CheckBox.Register("inputQualiteSanitaireToxique", function () { return true; }, function (event, cb) { toxique.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            var inputQualiteSanitaireAutre = Framework.Form.CheckBox.Register("inputQualiteSanitaireAutre", function () { return true; }, function (event, cb) { autre.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            var inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), function (val) { Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreSanitaire")[0].Label = val; if (val.length > 0) {
                autre.Important = 1;
                inputQualiteSanitaireAutre.Check();
            }
            else {
                autre.Important = 0;
                inputQualiteSanitaireAutre.Uncheck();
            } ; btnGoToQuestionnaireGeneral4.CheckState(); });
            var inputQualiteSanitairePasSensible = Framework.Form.CheckBox.Register("inputQualiteSanitairePasSensible", function () { return true; }, function (event, cb) {
                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();
            }, "");
            var f = function () {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    inputQualiteSanitairePesticide.Uncheck();
                    pesticide.Important = 0;
                    inputQualiteSanitaireContaminant.Uncheck();
                    contaminant.Important = 0;
                    inputQualiteSanitaireToxine.Uncheck();
                    toxine.Important = 0;
                    inputQualiteSanitaireAdditif.Uncheck();
                    additif.Important = 0;
                    inputQualiteSanitaireToxique.Uncheck();
                    toxique.Important = 0;
                    inputQualiteSanitaireAutre.Uncheck();
                    autre.Important = 0;
                    inputAutre.Set("");
                    autre.Label = "";
                }
                else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }
                btnGoToQuestionnaireGeneral4.CheckState();
            };
            f();
            if (pesticide.Important == 1) {
                inputQualiteSanitairePesticide.Check();
            }
            if (contaminant.Important == 1) {
                inputQualiteSanitaireContaminant.Check();
            }
            if (toxine.Important == 1) {
                inputQualiteSanitaireToxine.Check();
            }
            if (additif.Important == 1) {
                inputQualiteSanitaireAdditif.Check();
            }
            if (toxique.Important == 1) {
                inputQualiteSanitaireToxique.Check();
            }
            if (autre.Important == 1) {
                inputQualiteSanitaireAutre.Check();
                inputAutre.Set(autre.Label);
            }
            if (dimension.NonPrisEnCompte == 1) {
                inputQualiteSanitairePasSensible.Check();
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireGeneral2();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireGeneral4 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireGeneral4.html", function () {
            var divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            var divRanking = Framework.Form.TextElement.Register("divRanking");
            var dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Nutrition");
            var teneur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Teneur")[0];
            var conformite = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Conformite")[0];
            var nutriScore = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "NutriScore")[0];
            var marqueNutrition = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "MarqueNutrition")[0];
            var regime = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Regime")[0];
            var transit = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Transit")[0];
            var autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreNutrition")[0];
            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }
            var rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, function (x) {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnGoToQuestionnaireGeneral5.CheckState();
            });
            var btnGoToQuestionnaireGeneral5 = Framework.Form.Button.Register("btnGoToQuestionnaireGeneral5", function () {
                return (dimension.NonPrisEnCompte == 1 ||
                    (teneur.Important == 1
                        || conformite.Important == 1
                        || nutriScore.Important == 1
                        || marqueNutrition.Important == 1
                        || regime.Important == 1
                        || transit.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                            && dimension.ScoreGlobal > 0));
            }, function () {
                self.showDivQuestionnaireGeneral5();
            });
            var inputNutritionnelTeneur = Framework.Form.CheckBox.Register("inputNutritionnelTeneur", function () { return true; }, function (event, cb) { teneur.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            var inputNutritionnelConforme = Framework.Form.CheckBox.Register("inputNutritionnelConforme", function () { return true; }, function (event, cb) { conformite.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            var inputNutritionnelIndicateur = Framework.Form.CheckBox.Register("inputNutritionnelIndicateur", function () { return true; }, function (event, cb) { nutriScore.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            var inputNutritionnelIndirect = Framework.Form.CheckBox.Register("inputNutritionnelIndirect", function () { return true; }, function (event, cb) { marqueNutrition.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            var inputNutritionnelRegime = Framework.Form.CheckBox.Register("inputNutritionnelRegime", function () { return true; }, function (event, cb) { regime.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            var inputNutritionnelAutre = Framework.Form.CheckBox.Register("inputNutritionnelAutre", function () { return true; }, function (event, cb) { autre.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            var inputNutritionnelVertu = Framework.Form.CheckBox.Register("inputNutritionnelVertu", function () { return true; }, function (event, cb) { transit.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            var inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), function (val) { autre.Label = val; if (val.length > 0) {
                autre.Important = 1;
                inputNutritionnelAutre.Check();
            }
            else {
                autre.Important = 0;
                inputNutritionnelAutre.Uncheck();
            } ; btnGoToQuestionnaireGeneral5.CheckState(); });
            var inputNutritionnelPasSensible = Framework.Form.CheckBox.Register("inputNutritionnelPasSensible", function () { return true; }, function (event, cb) {
                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();
            }, "");
            var f = function () {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    inputNutritionnelTeneur.Uncheck();
                    teneur.Important = 0;
                    inputNutritionnelConforme.Uncheck();
                    conformite.Important = 0;
                    inputNutritionnelIndicateur.Uncheck();
                    nutriScore.Important = 0;
                    inputNutritionnelIndirect.Uncheck();
                    marqueNutrition.Important = 0;
                    inputNutritionnelRegime.Uncheck();
                    regime.Important = 0;
                    inputNutritionnelAutre.Uncheck();
                    autre.Important = 0;
                    inputNutritionnelVertu.Uncheck();
                    transit.Important = 0;
                    inputAutre.Set("");
                    autre.Label = "";
                }
                else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }
                btnGoToQuestionnaireGeneral5.CheckState();
            };
            f();
            if (dimension.NonPrisEnCompte == 1) {
                inputNutritionnelPasSensible.Check();
            }
            if (teneur.Important == 1) {
                inputNutritionnelTeneur.Check();
            }
            if (conformite.Important == 1) {
                inputNutritionnelConforme.Check();
            }
            if (nutriScore.Important == 1) {
                inputNutritionnelIndicateur.Check();
            }
            if (marqueNutrition.Important == 1) {
                inputNutritionnelIndirect.Check();
            }
            if (regime.Important == 1) {
                inputNutritionnelRegime.Check();
            }
            if (transit.Important == 1) {
                inputNutritionnelVertu.Check();
            }
            if (autre.Important == 1) {
                inputNutritionnelVertu.Check();
                inputAutre.Set(autre.Label);
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireGeneral3();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireGeneral5 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireGeneral5.html", function () {
            var divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            var divRanking = Framework.Form.TextElement.Register("divRanking");
            var dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Environnement");
            var production = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Production")[0];
            var carbone = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Carbone")[0];
            var recyclable = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Recyclable")[0];
            var vrac = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Vrac")[0];
            var saisonnalite = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Saisonnalite")[0];
            var distance = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Distance")[0];
            var durable = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Durable")[0];
            var autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreEnvironnement")[0];
            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }
            var rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, function (x) {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnNext.CheckState();
            });
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return (dimension.NonPrisEnCompte == 1 ||
                    (production.Important == 1
                        || carbone.Important == 1
                        || recyclable.Important == 1
                        || vrac.Important == 1
                        || saisonnalite.Important == 1
                        || distance.Important == 1
                        || durable.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                            && dimension.ScoreGlobal > 0));
            }, function () {
                self.showDivQuestionnaireGeneral6();
            });
            var input1 = Framework.Form.CheckBox.Register("input1", function () { return true; }, function (event, cb) { production.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input2 = Framework.Form.CheckBox.Register("input2", function () { return true; }, function (event, cb) { carbone.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input3 = Framework.Form.CheckBox.Register("input3", function () { return true; }, function (event, cb) { recyclable.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input4 = Framework.Form.CheckBox.Register("input4", function () { return true; }, function (event, cb) { vrac.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input5 = Framework.Form.CheckBox.Register("input5", function () { return true; }, function (event, cb) { saisonnalite.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input6 = Framework.Form.CheckBox.Register("input6", function () { return true; }, function (event, cb) { distance.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input7 = Framework.Form.CheckBox.Register("input7", function () { return true; }, function (event, cb) { durable.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input8 = Framework.Form.CheckBox.Register("input8", function () { return true; }, function (event, cb) { autre.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), function (val) { autre.Label = val; if (val.length > 0) {
                autre.Important = 1;
                input8.Check();
            }
            else {
                autre.Important = 0;
                input8.Uncheck();
            } ; btnNext.CheckState(); });
            var input9 = Framework.Form.CheckBox.Register("input9", function () { return true; }, function (event, cb) {
                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();
            }, "");
            var f = function () {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    input1.Uncheck();
                    production.Important = 0;
                    input2.Uncheck();
                    carbone.Important = 0;
                    input3.Uncheck();
                    recyclable.Important = 0;
                    input4.Uncheck();
                    vrac.Important = 0;
                    input5.Uncheck();
                    saisonnalite.Important = 0;
                    input6.Uncheck();
                    distance.Important = 0;
                    input7.Uncheck();
                    durable.Important = 0;
                    input8.Uncheck();
                    autre.Important = 0;
                    inputAutre.Set("");
                    autre.Label = "";
                }
                else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }
                btnNext.CheckState();
            };
            f();
            if (dimension.NonPrisEnCompte == 1) {
                input9.Check();
            }
            if (production.Important == 1) {
                input1.Check();
            }
            if (carbone.Important == 1) {
                input2.Check();
            }
            if (recyclable.Important == 1) {
                input3.Check();
            }
            if (vrac.Important == 1) {
                input4.Check();
            }
            if (saisonnalite.Important == 1) {
                input5.Check();
            }
            if (distance.Important == 1) {
                input6.Check();
            }
            if (durable.Important == 1) {
                input7.Check();
            }
            if (autre.Important == 1) {
                input8.Check();
                inputAutre.Set(autre.Label);
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireGeneral4();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireGeneral6 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireGeneral6.html", function () {
            var divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            var divRanking = Framework.Form.TextElement.Register("divRanking");
            var dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "SocioEconomique");
            var economieLocale = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "EconomieLocale")[0];
            var circuitCourt = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "CircuitCourt")[0];
            var conditionsTravail = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "ConditionsTravail")[0];
            var remunerationProducteur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "RemunerationProducteur")[0];
            var lienProducteur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "LienProducteur")[0];
            var autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreSocioEconomique")[0];
            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }
            var rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, function (x) {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnNext.CheckState();
            });
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return (dimension.NonPrisEnCompte == 1 ||
                    (economieLocale.Important == 1
                        || circuitCourt.Important == 1
                        || conditionsTravail.Important == 1
                        || remunerationProducteur.Important == 1
                        || lienProducteur.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                            && dimension.ScoreGlobal > 0));
            }, function () {
                self.showDivQuestionnaireGeneral7();
            });
            var input1 = Framework.Form.CheckBox.Register("input1", function () { return true; }, function (event, cb) { economieLocale.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input2 = Framework.Form.CheckBox.Register("input2", function () { return true; }, function (event, cb) { circuitCourt.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input3 = Framework.Form.CheckBox.Register("input3", function () { return true; }, function (event, cb) { conditionsTravail.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input4 = Framework.Form.CheckBox.Register("input4", function () { return true; }, function (event, cb) { remunerationProducteur.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input5 = Framework.Form.CheckBox.Register("input5", function () { return true; }, function (event, cb) { lienProducteur.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input8 = Framework.Form.CheckBox.Register("input8", function () { return true; }, function (event, cb) { autre.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), function (val) { autre.Label = val; if (val.length > 0) {
                autre.Important = 1;
                input8.Check();
            }
            else {
                autre.Important = 0;
                input8.Uncheck();
            } ; btnNext.CheckState(); });
            var input9 = Framework.Form.CheckBox.Register("input9", function () { return true; }, function (event, cb) {
                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();
            }, "");
            var f = function () {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    input1.Uncheck();
                    economieLocale.Important = 0;
                    input2.Uncheck();
                    circuitCourt.Important = 0;
                    input3.Uncheck();
                    conditionsTravail.Important = 0;
                    input4.Uncheck();
                    remunerationProducteur.Important = 0;
                    input5.Uncheck();
                    lienProducteur.Important = 0;
                    input8.Uncheck();
                    autre.Important = 0;
                    inputAutre.Set("");
                    autre.Label = "";
                }
                else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }
                btnNext.CheckState();
            };
            f();
            if (dimension.NonPrisEnCompte == 1) {
                input9.Check();
            }
            if (economieLocale.Important == 1) {
                input1.Check();
            }
            if (circuitCourt.Important == 1) {
                input2.Check();
            }
            if (conditionsTravail.Important == 1) {
                input3.Check();
            }
            if (remunerationProducteur.Important == 1) {
                input4.Check();
            }
            if (lienProducteur.Important == 1) {
                input5.Check();
            }
            if (autre.Important == 1) {
                input8.Check();
                inputAutre.Set(autre.Label);
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireGeneral5();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireGeneral7 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireGeneral7.html", function () {
            var divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            var divRanking = Framework.Form.TextElement.Register("divRanking");
            var dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Conviction");
            var vegetarien = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Vegetarien")[0];
            var bienEtreAnimal = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "BienEtreAnimal")[0];
            var tradition = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Tradition")[0];
            var autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreConviction")[0];
            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }
            var rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, function (x) {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnNext.CheckState();
            });
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return (dimension.NonPrisEnCompte == 1 ||
                    (vegetarien.Important == 1
                        || bienEtreAnimal.Important == 1
                        || tradition.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                            && dimension.ScoreGlobal > 0));
            }, function () {
                self.showDivQuestionnaireGeneral8();
            });
            var input1 = Framework.Form.CheckBox.Register("input1", function () { return true; }, function (event, cb) { vegetarien.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input2 = Framework.Form.CheckBox.Register("input2", function () { return true; }, function (event, cb) { bienEtreAnimal.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input3 = Framework.Form.CheckBox.Register("input3", function () { return true; }, function (event, cb) { tradition.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input8 = Framework.Form.CheckBox.Register("input8", function () { return true; }, function (event, cb) { autre.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), function (val) { autre.Label = val; if (val.length > 0) {
                autre.Important = 1;
                input8.Check();
            }
            else {
                autre.Important = 0;
                input8.Uncheck();
            } ; btnNext.CheckState(); });
            var input9 = Framework.Form.CheckBox.Register("input9", function () { return true; }, function (event, cb) {
                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();
            }, "");
            var f = function () {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    input1.Uncheck();
                    vegetarien.Important = 0;
                    input2.Uncheck();
                    bienEtreAnimal.Important = 0;
                    input3.Uncheck();
                    tradition.Important = 0;
                    input8.Uncheck();
                    autre.Important = 0;
                    inputAutre.Set("");
                    autre.Label = "";
                }
                else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }
                btnNext.CheckState();
            };
            f();
            if (dimension.NonPrisEnCompte == 1) {
                input9.Check();
            }
            if (vegetarien.Important == 1) {
                input1.Check();
            }
            if (bienEtreAnimal.Important == 1) {
                input2.Check();
            }
            if (tradition.Important == 1) {
                input3.Check();
            }
            if (autre.Important == 1) {
                input8.Check();
                inputAutre.Set(autre.Label);
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireGeneral6();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireGeneral8 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireGeneral8.html", function () {
            var divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            var divRanking = Framework.Form.TextElement.Register("divRanking");
            var dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Pratique");
            var ouvertureFacile = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "OuvertureFacile")[0];
            var longueConservation = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "LongueConservation")[0];
            var conservation = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Conservation")[0];
            var preparationFacile = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "PreparationFacile")[0];
            var technique = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Technique")[0];
            var autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutrePratique")[0];
            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }
            var rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, function (x) {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnNext.CheckState();
            });
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return (dimension.NonPrisEnCompte == 1 ||
                    (ouvertureFacile.Important == 1
                        || longueConservation.Important == 1
                        || conservation.Important == 1
                        || preparationFacile.Important == 1
                        || technique.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                            && dimension.ScoreGlobal > 0));
            }, function () {
                self.showDivQuestionnaireGeneral9();
            });
            var input1 = Framework.Form.CheckBox.Register("input1", function () { return true; }, function (event, cb) { ouvertureFacile.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input2 = Framework.Form.CheckBox.Register("input2", function () { return true; }, function (event, cb) { longueConservation.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input3 = Framework.Form.CheckBox.Register("input3", function () { return true; }, function (event, cb) { conservation.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input4 = Framework.Form.CheckBox.Register("input4", function () { return true; }, function (event, cb) { preparationFacile.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input5 = Framework.Form.CheckBox.Register("input5", function () { return true; }, function (event, cb) { technique.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var input8 = Framework.Form.CheckBox.Register("input8", function () { return true; }, function (event, cb) { autre.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            var inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), function (val) { autre.Label = val; if (val.length > 0) {
                autre.Important = 1;
                input8.Check();
            }
            else {
                autre.Important = 0;
                input8.Uncheck();
            } ; btnNext.CheckState(); });
            var input9 = Framework.Form.CheckBox.Register("input9", function () { return true; }, function (event, cb) {
                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();
            }, "");
            var f = function () {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    input1.Uncheck();
                    ouvertureFacile.Important = 0;
                    input2.Uncheck();
                    longueConservation.Important = 0;
                    input3.Uncheck();
                    conservation.Important = 0;
                    input4.Uncheck();
                    preparationFacile.Important = 0;
                    input5.Uncheck();
                    technique.Important = 0;
                    input8.Uncheck();
                    autre.Important = 0;
                    inputAutre.Set("");
                    autre.Label = "";
                }
                else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }
                btnNext.CheckState();
            };
            f();
            if (dimension.NonPrisEnCompte == 1) {
                input9.Check();
            }
            if (ouvertureFacile.Important == 1) {
                input1.Check();
            }
            if (longueConservation.Important == 1) {
                input2.Check();
            }
            if (conservation.Important == 1) {
                input3.Check();
            }
            if (preparationFacile.Important == 1) {
                input4.Check();
            }
            if (technique.Important == 1) {
                input5.Check();
            }
            if (autre.Important == 1) {
                input8.Check();
                inputAutre.Set(autre.Label);
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireGeneral7();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireGeneral9 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireGeneral9.html", function () {
            var divCriteres = Framework.Form.TextElement.Register("divCriteres"); /*divCriteres.Hide();*/
            var divRanking = Framework.Form.TextElement.Register("divRanking");
            var dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Autre");
            var autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Autre")[0];
            var rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, function (x) {
                dimension.ScoreGlobal = x;
                //divCriteres.Show();
                btnNext.CheckState();
            });
            if (autre.Label.length > 0) {
                rating.Enable();
            }
            else {
                rating.Clear();
                rating.Disable();
            }
            var inputAutre = Framework.Form.InputText.Register("inputAutre", autre.Label, Framework.Form.Validator.NoValidation(), function (val) {
                autre.Label = val;
                if (autre.Label.length > 0) {
                    rating.Enable();
                    //divCriteres.Show();
                }
                else {
                    dimension.ScoreGlobal = 0;
                    rating.Clear();
                    rating.Disable();
                    //divCriteres.Hide();
                }
                btnNext.CheckState();
            });
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return (autre.Label.length == 0 || dimension.ScoreGlobal > 0);
            }, function () {
                self.showDivQuestionnaireIndividu1();
            });
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireGeneral8();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireIndividu1 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireIndividu1.html", function () {
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return (self.questionnaire.Genre != undefined
                    && self.questionnaire.Taille >= 80 && self.questionnaire.Taille <= 230
                    && self.questionnaire.Age >= 18 && self.questionnaire.Age <= 130
                    && self.questionnaire.Poids >= 20 && self.questionnaire.Poids <= 300
                    && inputcpValidator(self.questionnaire.CP) == "");
            }, function () {
                self.showDivQuestionnaireIndividu2();
            });
            var input1a = Framework.Form.CheckBox.Register("input1a", function () { return true; }, function (event, cb) { self.questionnaire.Genre = "Homme"; btnNext.CheckState(); }, "");
            var input1b = Framework.Form.CheckBox.Register("input1b", function () { return true; }, function (event, cb) { self.questionnaire.Genre = "Femme"; btnNext.CheckState(); }, "");
            if (self.questionnaire.Genre == "Homme") {
                input1a.Check();
            }
            if (self.questionnaire.Genre == "Femme") {
                input1b.Check();
            }
            var input2Validator = function (code) {
                var n = Number(code);
                if (n && n >= 80 && n <= 230) {
                    return "";
                }
                return "La taille doit être comprise entre 80 et 230 cm";
            };
            var input2 = Framework.Form.InputText.Register("input2", "", Framework.Form.Validator.Custom(input2Validator), function (val) { self.questionnaire.Taille = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.Taille != undefined) {
                input2.Set(self.questionnaire.Taille);
            }
            var input3Validator = function (code) {
                var n = Number(code);
                if (n && n >= 18 && n <= 130) {
                    return "";
                }
                return "L'âge doit être compris entre 18 et 130 ans.";
            };
            var input3 = Framework.Form.InputText.Register("input3", "", Framework.Form.Validator.Custom(input3Validator), function (val) { self.questionnaire.Age = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.Age != undefined) {
                input3.Set(self.questionnaire.Age);
            }
            var input4Validator = function (code) {
                var n = Number(code);
                if (n && n >= 20 && n <= 300) {
                    return "";
                }
                return "Le poids doit être compris entre 20 et 300 kg.";
            };
            var input4 = Framework.Form.InputText.Register("input4", "", Framework.Form.Validator.Custom(input4Validator), function (val) { self.questionnaire.Poids = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.Poids != undefined) {
                input4.Set(self.questionnaire.Poids);
            }
            var inputcpValidator = function (code) {
                var regexp = new RegExp('\\d{5}');
                if (regexp.test(code) == true) {
                    return "";
                }
                return "Le code postal n'est pas valide.";
            };
            var inputcp = Framework.Form.InputText.Register("input_cp", "", Framework.Form.Validator.Custom(inputcpValidator), function (val) { self.questionnaire.CP = val; btnNext.CheckState(); });
            if (self.questionnaire.CP != undefined) {
                inputcp.Set(self.questionnaire.CP);
            }
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireIndividu2 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireIndividu2.html", function () {
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return (self.questionnaire.CSP != undefined
                    && self.questionnaire.Diplome != undefined);
            }, function () {
                self.showDivQuestionnaireIndividu3();
            });
            var input5a = Framework.Form.CheckBox.Register("input5a", function () { return true; }, function (event, cb) { self.questionnaire.CSP = "Agriculteurs exploitants"; btnNext.CheckState(); }, "");
            var input5b = Framework.Form.CheckBox.Register("input5b", function () { return true; }, function (event, cb) { self.questionnaire.CSP = "Artisans, commerçants et chefs d'entreprise"; btnNext.CheckState(); }, "");
            var input5c = Framework.Form.CheckBox.Register("input5c", function () { return true; }, function (event, cb) { self.questionnaire.CSP = "Cadres et professions intellectuelles supérieures"; btnNext.CheckState(); }, "");
            var input5d = Framework.Form.CheckBox.Register("input5d", function () { return true; }, function (event, cb) { self.questionnaire.CSP = "Professions Intermédiaires"; btnNext.CheckState(); }, "");
            var input5e = Framework.Form.CheckBox.Register("input5e", function () { return true; }, function (event, cb) { self.questionnaire.CSP = "Employés"; btnNext.CheckState(); }, "");
            var input5f = Framework.Form.CheckBox.Register("input5f", function () { return true; }, function (event, cb) { self.questionnaire.CSP = "Ouvriers"; btnNext.CheckState(); }, "");
            var input5g = Framework.Form.CheckBox.Register("input5g", function () { return true; }, function (event, cb) { self.questionnaire.CSP = "Autres personnes sans activité professionnelle"; btnNext.CheckState(); }, "");
            if (self.questionnaire.CSP == "Agriculteurs exploitants") {
                input5a.Check();
            }
            if (self.questionnaire.CSP == "Artisans, commerçants et chefs d'entreprise") {
                input5b.Check();
            }
            if (self.questionnaire.CSP == "Cadres et professions intellectuelles supérieures") {
                input5c.Check();
            }
            if (self.questionnaire.CSP == "Professions Intermédiaires") {
                input5d.Check();
            }
            if (self.questionnaire.CSP == "Employés") {
                input5e.Check();
            }
            if (self.questionnaire.CSP == "Ouvriers") {
                input5f.Check();
            }
            if (self.questionnaire.CSP == "Autres personnes sans activité professionnelle") {
                input5g.Check();
            }
            var input6a = Framework.Form.CheckBox.Register("input6a", function () { return true; }, function (event, cb) { self.questionnaire.Diplome = "Aucun diplôme, brevet des collèges"; btnNext.CheckState(); }, "");
            var input6b = Framework.Form.CheckBox.Register("input6b", function () { return true; }, function (event, cb) { self.questionnaire.Diplome = "CAP, BEP ou équivalent"; btnNext.CheckState(); }, "");
            var input6c = Framework.Form.CheckBox.Register("input6c", function () { return true; }, function (event, cb) { self.questionnaire.Diplome = "Baccalauréat ou équivalent"; btnNext.CheckState(); }, "");
            var input6d = Framework.Form.CheckBox.Register("input6d", function () { return true; }, function (event, cb) { self.questionnaire.Diplome = "Bac + 2"; btnNext.CheckState(); }, "");
            var input6e = Framework.Form.CheckBox.Register("input6e", function () { return true; }, function (event, cb) { self.questionnaire.Diplome = "Supérieur à Bac + 2"; btnNext.CheckState(); }, "");
            if (self.questionnaire.Diplome == "Aucun diplôme, brevet des collèges") {
                input6a.Check();
            }
            if (self.questionnaire.Diplome == "CAP, BEP ou équivalent") {
                input6b.Check();
            }
            if (self.questionnaire.Diplome == "Baccalauréat ou équivalent") {
                input6c.Check();
            }
            if (self.questionnaire.Diplome == "Bac + 2") {
                input6d.Check();
            }
            if (self.questionnaire.Diplome == "Supérieur à Bac + 2") {
                input6e.Check();
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireIndividu1();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireIndividu3 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireIndividu3.html", function () {
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return (self.questionnaire.NbPersonnesMajeures > 0
                    && self.questionnaire.NbPersonnesMineures >= 0
                    && self.questionnaire.MontantAlloueCourses != undefined);
            }, function () {
                self.showDivQuestionnaireIndividu4();
            });
            var input7Validator = function (code) {
                var n = Number(code);
                if (n && n >= 1 && n <= 10) {
                    return "";
                }
                return "Le nombre de personnes doit être compris entre 1 et 10.";
            };
            var input7 = Framework.Form.InputText.Register("input7", "", Framework.Form.Validator.Custom(input7Validator), function (val) { self.questionnaire.NbPersonnesMajeures = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.NbPersonnesMajeures != undefined) {
                input7.Set(self.questionnaire.NbPersonnesMajeures);
            }
            var input8Validator = function (code) {
                if (code == "0") {
                    return "";
                }
                var n = Number(code);
                if (n && n >= 0 && n <= 10) {
                    return "";
                }
                return "Le nombre de personnes doit être compris entre 0 et 10.";
            };
            var input8 = Framework.Form.InputText.Register("input8", "", Framework.Form.Validator.Custom(input8Validator), function (val) { self.questionnaire.NbPersonnesMineures = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.NbPersonnesMineures != undefined) {
                input8.Set(self.questionnaire.NbPersonnesMineures);
            }
            var input9a = Framework.Form.CheckBox.Register("input9a", function () { return true; }, function (event, cb) { self.questionnaire.MontantAlloueCourses = "Moins de 100 € par mois"; btnNext.CheckState(); }, "");
            var input9b = Framework.Form.CheckBox.Register("input9b", function () { return true; }, function (event, cb) { self.questionnaire.MontantAlloueCourses = "100 à 199 € par mois"; btnNext.CheckState(); }, "");
            var input9c = Framework.Form.CheckBox.Register("input9c", function () { return true; }, function (event, cb) { self.questionnaire.MontantAlloueCourses = "200 à 299 € par mois"; btnNext.CheckState(); }, "");
            var input9d = Framework.Form.CheckBox.Register("input9d", function () { return true; }, function (event, cb) { self.questionnaire.MontantAlloueCourses = "300 à 399 € par mois"; btnNext.CheckState(); }, "");
            var input9e = Framework.Form.CheckBox.Register("input9e", function () { return true; }, function (event, cb) { self.questionnaire.MontantAlloueCourses = "400 à 500 € par mois"; btnNext.CheckState(); }, "");
            var input9f = Framework.Form.CheckBox.Register("input9f", function () { return true; }, function (event, cb) { self.questionnaire.MontantAlloueCourses = "Plus de 500 € par mois"; btnNext.CheckState(); }, "");
            var input9g = Framework.Form.CheckBox.Register("input9g", function () { return true; }, function (event, cb) { self.questionnaire.MontantAlloueCourses = "Je ne sais pas"; btnNext.CheckState(); }, "");
            if (self.questionnaire.MontantAlloueCourses == "Moins de 100 € par mois") {
                input9a.Check();
            }
            if (self.questionnaire.MontantAlloueCourses == "100 à 199 € par mois") {
                input9b.Check();
            }
            if (self.questionnaire.MontantAlloueCourses == "200 à 299 € par mois") {
                input9c.Check();
            }
            if (self.questionnaire.MontantAlloueCourses == "300 à 399 € par mois") {
                input9d.Check();
            }
            if (self.questionnaire.MontantAlloueCourses == "400 à 500 € par mois") {
                input9e.Check();
            }
            if (self.questionnaire.MontantAlloueCourses == "Plus de 500 € par mois") {
                input9f.Check();
            }
            if (self.questionnaire.MontantAlloueCourses == "Je ne sais pas") {
                input9g.Check();
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireIndividu2();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireIndividu4 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireIndividu4.html", function () {
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return ((self.questionnaire.RegimeParticulier == "Non" || (self.questionnaire.RegimeParticulier == "Oui" && self.questionnaire.DetailRegimeParticulier != undefined))
                    && self.questionnaire.UtilisationApplications != undefined);
            }, function () {
                self.showDivQuestionnaireIndividu5();
            });
            var input10a = Framework.Form.CheckBox.Register("input10a", function () { return true; }, function (event, cb) { self.questionnaire.RegimeParticulier = "Non"; btnNext.CheckState(); }, "");
            var input10b = Framework.Form.CheckBox.Register("input10b", function () { return true; }, function (event, cb) { self.questionnaire.RegimeParticulier = "Oui"; btnNext.CheckState(); }, "");
            if (self.questionnaire.RegimeParticulier == "Non") {
                input10a.Check();
            }
            if (self.questionnaire.RegimeParticulier == "Oui") {
                input10b.Check();
            }
            var input11 = Framework.Form.InputText.Register("input11", "", Framework.Form.Validator.MinLength(5), function (val) { self.questionnaire.DetailRegimeParticulier = val; btnNext.CheckState(); });
            if (self.questionnaire.DetailRegimeParticulier != undefined) {
                input11.Set(self.questionnaire.DetailRegimeParticulier);
            }
            var input12a = Framework.Form.CheckBox.Register("input12a", function () { return true; }, function (event, cb) { self.questionnaire.UtilisationApplications = "Jamais"; btnNext.CheckState(); }, "");
            var input12b = Framework.Form.CheckBox.Register("input12b", function () { return true; }, function (event, cb) { self.questionnaire.UtilisationApplications = "Parfois"; btnNext.CheckState(); }, "");
            var input12c = Framework.Form.CheckBox.Register("input12c", function () { return true; }, function (event, cb) { self.questionnaire.UtilisationApplications = "Souvent"; btnNext.CheckState(); }, "");
            var input12d = Framework.Form.CheckBox.Register("input12d", function () { return true; }, function (event, cb) { self.questionnaire.UtilisationApplications = "Toujours"; btnNext.CheckState(); }, "");
            if (self.questionnaire.UtilisationApplications == "Jamais") {
                input12a.Check();
            }
            if (self.questionnaire.UtilisationApplications == "Parfois") {
                input12b.Check();
            }
            if (self.questionnaire.UtilisationApplications == "Souvent") {
                input12c.Check();
            }
            if (self.questionnaire.UtilisationApplications == "Toujours") {
                input12d.Check();
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireIndividu3();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireIndividu5 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireIndividu5.html", function () {
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return self.questionnaire.QuantiteInfo != undefined && self.questionnaire.QualiteInfo != undefined && self.questionnaire.ConfianceInfo != undefined;
            }, function () {
                self.showDivQuestionnaireIndividu6();
            });
            var input1a = Framework.Form.CheckBox.Register("input1a", function () { return true; }, function (event, cb) { self.questionnaire.QuantiteInfo = "Pas assez d'information"; btnNext.CheckState(); }, "");
            var input1b = Framework.Form.CheckBox.Register("input1b", function () { return true; }, function (event, cb) { self.questionnaire.QuantiteInfo = "Suffisamment d'information"; btnNext.CheckState(); }, "");
            var input1c = Framework.Form.CheckBox.Register("input1c", function () { return true; }, function (event, cb) { self.questionnaire.QuantiteInfo = "Trop d'information"; btnNext.CheckState(); }, "");
            if (self.questionnaire.QuantiteInfo == "Pas assez d'information") {
                input1a.Check();
            }
            if (self.questionnaire.QuantiteInfo == "Suffisamment d'information") {
                input1b.Check();
            }
            if (self.questionnaire.QuantiteInfo == "Trop d'information") {
                input1c.Check();
            }
            var input2a = Framework.Form.CheckBox.Register("input2a", function () { return true; }, function (event, cb) { self.questionnaire.QualiteInfo = "Ne correspond pas aux attentes"; btnNext.CheckState(); }, "");
            var input2b = Framework.Form.CheckBox.Register("input2b", function () { return true; }, function (event, cb) { self.questionnaire.QualiteInfo = "Correspond aux attentes"; btnNext.CheckState(); }, "");
            if (self.questionnaire.QualiteInfo == "Correspond aux attentes") {
                input2a.Check();
            }
            if (self.questionnaire.QualiteInfo == "Ne correspond pas aux attentes") {
                input2b.Check();
            }
            var input3a = Framework.Form.CheckBox.Register("input3a", function () { return true; }, function (event, cb) { self.questionnaire.ConfianceInfo = "Oui"; btnNext.CheckState(); }, "");
            var input3b = Framework.Form.CheckBox.Register("input3b", function () { return true; }, function (event, cb) { self.questionnaire.ConfianceInfo = "Non"; btnNext.CheckState(); }, "");
            var input3c = Framework.Form.CheckBox.Register("input3c", function () { return true; }, function (event, cb) { self.questionnaire.ConfianceInfo = "Dépend des sources"; btnNext.CheckState(); }, "");
            if (self.questionnaire.ConfianceInfo == "Oui") {
                input3a.Check();
            }
            if (self.questionnaire.ConfianceInfo == "Non") {
                input3b.Check();
            }
            if (self.questionnaire.ConfianceInfo == "Dépend des sources") {
                input3c.Check();
            }
            var inputText = Framework.Form.InputText.Register("inputText", "", Framework.Form.Validator.NoValidation(), function (val) { self.questionnaire.RemarquesInfo = val; });
            if (self.questionnaire.RemarquesInfo != undefined) {
                inputText.Set(self.questionnaire.RemarquesInfo);
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireIndividu4();
            });
        });
    };
    ConsoDriveApp.prototype.showDivQuestionnaireIndividu6 = function () {
        var self = this;
        this.showDiv("html/divQuestionnaireIndividu6.html", function () {
            var btnNext = Framework.Form.Button.Register("btnNext", function () {
                return true;
            }, function () {
                self.showDivFin();
            });
            var input13 = Framework.Form.InputText.Register("input13", "", Framework.Form.Validator.NoValidation(), function (val) { self.questionnaire.Remarques = val; });
            if (self.questionnaire.Remarques != undefined) {
                input13.Set(self.questionnaire.Remarques);
            }
            var btnPrec = Framework.Form.Button.Register("btnPrec", function () {
                return true;
            }, function () {
                self.showDivQuestionnaireIndividu5();
            });
        });
    };
    ConsoDriveApp.prototype.showDivFin = function () {
        var self = this;
        this.showDiv("html/divFin.html", function () { });
    };
    return ConsoDriveApp;
}(Framework.App));
//# sourceMappingURL=app.js.map