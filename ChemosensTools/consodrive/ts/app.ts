class ConsoDriveIndemnisationApp extends Framework.App {
    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/consodrive';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
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
        requirements.Required = [] //TODO;


        //requirements.Extensions = ["Rating", "Slider"];
        return requirements;
    }

    constructor(isInTest: boolean = false) {
        super(ConsoDriveIndemnisationApp.GetRequirements(), isInTest);
    }

    protected onError(error: string) {
        super.onError(error);
    }

    private inputNom: Framework.Form.InputText;
    private inputPrenom: Framework.Form.InputText;
    private inputMail: Framework.Form.InputText;
    private checkboxParticipation: Framework.Form.CheckBox;
    private checkboxBAL: Framework.Form.CheckBox;
    private btnTerminer: Framework.Form.Button;

    private nom: string = "";
    private prenom: string = "";
    private mail: string = "";
    private participation: boolean = false;
    private bal: boolean = false;

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);
        let self = this;
        this.inputNom = Framework.Form.InputText.Register("inputNom", "", Framework.Form.Validator.MinLength(2, "Le champ Nom est requis"), (nom) => { self.nom = nom; self.btnTerminer.CheckState(); });
        this.inputPrenom = Framework.Form.InputText.Register("inputPrenom", "", Framework.Form.Validator.MinLength(2, "Le champ Prénom est requis"), (prenom) => { self.prenom = prenom; self.btnTerminer.CheckState(); });
        this.inputMail = Framework.Form.InputText.Register("inputMail", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), (mail) => { self.mail = mail; self.btnTerminer.CheckState(); });
        this.checkboxParticipation = Framework.Form.CheckBox.Register("checkboxParticipation", () => { return true; }, (ev, cb) => { self.participation = cb.IsChecked; self.btnTerminer.CheckState(); }, "");
        this.checkboxBAL = Framework.Form.CheckBox.Register("checkboxBAL", () => { return true; }, (ev, cb) => { self.bal = cb.IsChecked; self.btnTerminer.CheckState(); }, "");
        this.btnTerminer = Framework.Form.Button.Register("btnTerminer", () => {
            return self.inputNom.IsValid && self.inputPrenom.IsValid && self.inputMail.IsValid && self.participation == true && self.bal == true;
        }, () => {

                let body = "<p>" + self.prenom + " " + self.nom + " a terminé le questionnaire et demande à être indemnisé à l'adresse mail suivante : " + self.mail + ".</p>";
                body += "<p>Le panéliste a répondu « oui » aux questions « Je certifie avoir participé à l'étude sur les achats alimentaires en Drive proposé par le Centre des Sciences du Goût et de l'Alimentation. » et « Je souhaite recevoir le bon de 10€ sur ma boîte personnelle. »</p>";

            self.CallWCF('SendMail', { toEmail: "consodrive@inrae.fr", subject: "Demande d'indemnisation consodrive", body: body, displayName: "consodrive", replyTo: "consodrive@inrae.fr" }, () => {
                Framework.Progress.Show("Enregistrement...");
            }, (res) => {
                Framework.Progress.Hide();

                if (res.Status == 'success') {
                    Framework.Modal.Alert("Demande d'indemnisation envoyée", "La demande d'indemnisation a bien été envoyée.")
                } else {
                    Framework.Modal.Alert("Echec de l'envoi de la demande d'indemnisation", "L'envoi de la demande d'indemnisation a échoué. Veuillez vérifier votre adresse mail et réessayer. En cas de problème, vous pouvez envoyer un mail à : consodrive@inrae.fr")
                }
            });
        })

    }
}

class ConsoDriveInscriptionApp extends Framework.App {
    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/consodrive';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
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
        requirements.Required = [] //TODO;


        //requirements.Extensions = ["Rating", "Slider"];
        return requirements;
    }

    constructor(isInTest: boolean = false) {
        super(ConsoDriveInscriptionApp.GetRequirements(), isInTest);
    }

    protected onError(error: string) {
        super.onError(error);
    }

    private divPresentation: Framework.Form.TextElement;
    private divCompris: Framework.Form.TextElement;
    private divCnil: Framework.Form.TextElement;
    private divLieuAchat: Framework.Form.TextElement;
    private divEnseigne: Framework.Form.TextElement;
    private divCategories: Framework.Form.TextElement;
    private divFin: Framework.Form.TextElement;
    //private inputComprisOui: Framework.Form.RadioElement;
    //private inputComprisNon: Framework.Form.RadioElement;
    private inputCiviliteMme: Framework.Form.RadioElement;
    private inputCiviliteMr: Framework.Form.RadioElement;
    private inputNom: Framework.Form.InputText;
    private inputPrenom: Framework.Form.InputText;
    private inputDateNaissance: Framework.Form.InputText;
    private inputAdresse: Framework.Form.InputText;
    private inputCP: Framework.Form.InputText;
    private inputVille: Framework.Form.InputText;
    private inputMail: Framework.Form.InputText;
    private checkboxLieu1: Framework.Form.CheckBox;
    private checkboxLieu2: Framework.Form.CheckBox;
    private checkboxLieu3: Framework.Form.CheckBox;
    private checkboxLieu4: Framework.Form.CheckBox;
    private checkboxLieu5: Framework.Form.CheckBox;
    private checkboxLieu6: Framework.Form.CheckBox;
    private checkboxLieu7: Framework.Form.CheckBox;
    private inputLieu8: Framework.Form.InputText;
    private checkboxEnseigne1: Framework.Form.CheckBox;
    private checkboxEnseigne2: Framework.Form.CheckBox;
    private checkboxEnseigne3: Framework.Form.CheckBox;
    private checkboxEnseigne4: Framework.Form.CheckBox;
    private checkboxEnseigne5: Framework.Form.CheckBox;
    private checkboxEnseigne6: Framework.Form.CheckBox;
    private inputEnseigne7: Framework.Form.InputText;
    private checkboxCategorie1: Framework.Form.CheckBox;
    private checkboxCategorie2: Framework.Form.CheckBox;
    private checkboxCategorie3: Framework.Form.CheckBox;
    private checkboxCategorie4: Framework.Form.CheckBox;
    private checkboxCategorie5: Framework.Form.CheckBox;
    private checkboxCategorie6: Framework.Form.CheckBox;
    private checkboxCategorie7: Framework.Form.CheckBox;
    private btnInscription1: Framework.Form.Button;
    private btnInscription2: Framework.Form.Button;
    private btnInscription3: Framework.Form.Button;
    private btnInscription4: Framework.Form.Button;
    private btnInscription5: Framework.Form.Button;
    private btnInscription6: Framework.Form.Button;

    //private compris: boolean = false;
    private civilite: string = "";
    private nom: string = "";
    private prenom: string = "";
    private dateNaissance: string = "";
    private adresse: string = "";
    private ville: string = "";
    private cp: string = "";
    private mail: string = "";
    private lieuGMS: boolean = false;
    private lieuGrandeSurfaceSpecialisee: boolean = false;
    private lieuCommerceProximite: boolean = false;
    private lieuMarche: boolean = false;
    private lieuDrive: boolean = false;
    private lieuProducteur: boolean = false;
    private lieuInternet: boolean = false;
    private lieuAutre: string = "";
    private enseigneCarrefour: boolean = false;
    private enseigneLeclerc: boolean = false;
    private enseigneIntermarche: boolean = false;
    private enseigneSuperU: boolean = false;
    private enseigneCora: boolean = false;
    private enseigneCasino: boolean = false;
    private enseigneAutre: string = "";
    private categorieViandePoisson: boolean = false;
    private categorieFruitLegume: boolean = false;
    private categoriePainPatisserie: boolean = false;
    private categorieSurgele: boolean = false;
    private categorieEpicerieSalee: boolean = false;
    private categorieEpicerieSucree: boolean = false;
    private categorieFrais: boolean = false;

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);
        let self = this;
        this.divPresentation = Framework.Form.TextElement.Register("divPresentation");
        this.divCompris = Framework.Form.TextElement.Register("divCompris"); this.divCompris.Hide();
        this.divCnil = Framework.Form.TextElement.Register("divCnil"); this.divCnil.Hide();
        this.divLieuAchat = Framework.Form.TextElement.Register("divLieuAchat"); this.divLieuAchat.Hide();
        this.divEnseigne = Framework.Form.TextElement.Register("divEnseigne"); this.divEnseigne.Hide();
        this.divCategories = Framework.Form.TextElement.Register("divCategories"); this.divCategories.Hide();
        this.divFin = Framework.Form.TextElement.Register("divFin"); this.divFin.Hide();
        //let g1 = Framework.Form.RadioGroup.Register();
        //this.inputComprisOui = Framework.Form.RadioElement.Register("inputComprisOui", g1, () => { self.compris = true; self.btnInscription2.CheckState(); });
        //this.inputComprisNon = Framework.Form.RadioElement.Register("inputComprisNon", g1, () => { self.compris = false; self.btnInscription2.CheckState(); });
        let g2 = Framework.Form.RadioGroup.Register();
        this.inputCiviliteMme = Framework.Form.RadioElement.Register("inputCiviliteMme", g2, () => { self.civilite = "Mme"; self.btnInscription3.CheckState(); });
        this.inputCiviliteMr = Framework.Form.RadioElement.Register("inputCiviliteMr", g2, () => { self.civilite = "Mr"; self.btnInscription3.CheckState();});
        this.inputNom = Framework.Form.InputText.Register("inputNom", "", Framework.Form.Validator.MinLength(2, "Le champ Nom est requis"), (nom) => { self.nom = nom; self.btnInscription3.CheckState(); });
        this.inputPrenom = Framework.Form.InputText.Register("inputPrenom", "", Framework.Form.Validator.MinLength(2, "Le champ Prénom est requis"), (prenom) => { self.prenom = prenom; self.btnInscription3.CheckState(); });
        this.inputDateNaissance = Framework.Form.InputText.Register("inputDateNaissance", "", Framework.Form.Validator.FrenchDate(2003, "Le champ Date est requis (format : DD/MM/YYYY) et vous devez avoir plus de 18 ans."), (naissance) => { self.dateNaissance = naissance; self.btnInscription3.CheckState(); });
        this.inputAdresse = Framework.Form.InputText.Register("inputAdresse", "", Framework.Form.Validator.MinLength(2, "Le champ Adresse est requis"), (adresse) => { self.adresse = adresse; self.btnInscription3.CheckState(); });
        this.inputCP = Framework.Form.InputText.Register("inputCP", "", Framework.Form.Validator.CodePostal("Le champ CP est requis"), (cp) => { self.cp = cp; self.btnInscription3.CheckState(); });
        this.inputVille = Framework.Form.InputText.Register("inputVille", "", Framework.Form.Validator.MinLength(2, "Le champ Ville est requis"), (ville) => { self.ville = ville; self.btnInscription3.CheckState(); });
        this.inputMail = Framework.Form.InputText.Register("inputMail", "", Framework.Form.Validator.Mail("Le champ Mail est requis"), (mail) => { self.mail = mail; self.btnInscription3.CheckState(); });
        this.checkboxLieu1 = Framework.Form.CheckBox.Register("checkboxLieu1", () => { return true; }, (ev, cb) => { self.lieuGMS = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu2 = Framework.Form.CheckBox.Register("checkboxLieu2", () => { return true; }, (ev, cb) => { self.lieuGrandeSurfaceSpecialisee = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu3 = Framework.Form.CheckBox.Register("checkboxLieu3", () => { return true; }, (ev, cb) => { self.lieuCommerceProximite = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu4 = Framework.Form.CheckBox.Register("checkboxLieu4", () => { return true; }, (ev, cb) => { self.lieuMarche = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu5 = Framework.Form.CheckBox.Register("checkboxLieu5", () => { return true; }, (ev, cb) => { self.lieuDrive = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu6 = Framework.Form.CheckBox.Register("checkboxLieu6", () => { return true; }, (ev, cb) => { self.lieuProducteur = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.checkboxLieu7 = Framework.Form.CheckBox.Register("checkboxLieu7", () => { return true; }, (ev, cb) => { self.lieuInternet = cb.IsChecked; self.btnInscription4.CheckState(); }, "");
        this.inputLieu8 = Framework.Form.InputText.Register("inputLieu8", "", Framework.Form.Validator.NoValidation(), (lieu) => { self.lieuAutre = lieu; self.btnInscription4.CheckState(); });
        this.checkboxEnseigne1 = Framework.Form.CheckBox.Register("checkboxEnseigne1", () => { return true; }, (ev, cb) => { self.enseigneCarrefour = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne2 = Framework.Form.CheckBox.Register("checkboxEnseigne2", () => { return true; }, (ev, cb) => { self.enseigneLeclerc = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne3 = Framework.Form.CheckBox.Register("checkboxEnseigne3", () => { return true; }, (ev, cb) => { self.enseigneIntermarche = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne4 = Framework.Form.CheckBox.Register("checkboxEnseigne4", () => { return true; }, (ev, cb) => { self.enseigneSuperU = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne5 = Framework.Form.CheckBox.Register("checkboxEnseigne5", () => { return true; }, (ev, cb) => { self.enseigneCora = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.checkboxEnseigne6 = Framework.Form.CheckBox.Register("checkboxEnseigne6", () => { return true; }, (ev, cb) => { self.enseigneCasino = cb.IsChecked; self.btnInscription5.CheckState(); }, "");
        this.inputEnseigne7 = Framework.Form.InputText.Register("inputEnseigne7", "", Framework.Form.Validator.NoValidation(), (enseigne) => { self.enseigneAutre = enseigne; self.btnInscription5.CheckState(); });
        this.checkboxCategorie1 = Framework.Form.CheckBox.Register("checkboxCategorie1", () => { return true; }, (ev, cb) => { self.categorieViandePoisson = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie2 = Framework.Form.CheckBox.Register("checkboxCategorie2", () => { return true; }, (ev, cb) => { self.categorieFruitLegume = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie3 = Framework.Form.CheckBox.Register("checkboxCategorie3", () => { return true; }, (ev, cb) => { self.categoriePainPatisserie = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie4 = Framework.Form.CheckBox.Register("checkboxCategorie4", () => { return true; }, (ev, cb) => { self.categorieSurgele = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie5 = Framework.Form.CheckBox.Register("checkboxCategorie5", () => { return true; }, (ev, cb) => { self.categorieEpicerieSalee = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie6 = Framework.Form.CheckBox.Register("checkboxCategorie6", () => { return true; }, (ev, cb) => { self.categorieEpicerieSucree = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.checkboxCategorie7 = Framework.Form.CheckBox.Register("checkboxCategorie7", () => { return true; }, (ev, cb) => { self.categorieFrais = cb.IsChecked; self.btnInscription6.CheckState(); }, "");
        this.btnInscription1 = Framework.Form.Button.Register("btnInscription1", () => {
            return true
        }, () => {
            self.divPresentation.Hide();
            self.divCompris.Show();
        })
        this.btnInscription2 = Framework.Form.Button.Register("btnInscription2", () => {
            return true
        }, () => {
            self.divCompris.Hide();
            //if (self.compris == true) {
                self.divCnil.Show();
            //} else {
            //    self.divFin.Show();
            //    self.divFin.SetHtml("<p>Merci pour votre participation.N'hésitez pas à parler de l'étude autour de vous si vous connaissez des gens potentiellement intéressés !</p>");
            //}
        })
        this.btnInscription3 = Framework.Form.Button.Register("btnInscription3", () => {
            return self.civilite != "" && self.inputNom.IsValid && self.inputPrenom.IsValid && self.inputDateNaissance.IsValid && self.inputAdresse.IsValid && self.inputCP.IsValid && self.inputVille.IsValid && self.inputMail.IsValid
        }, () => {
            self.divCnil.Hide();
            self.divLieuAchat.Show();
        })
        this.btnInscription4 = Framework.Form.Button.Register("btnInscription4", () => {
            return true;
        }, () => {
            self.divLieuAchat.Hide();
            if (self.lieuDrive == true) {
                self.divEnseigne.Show();
            } else {
                self.divFin.Show();
                self.divFin.SetHtml("<p>Malheureusement, nous recherchons seulement des personnes qui font leur courses en drive. Merci pour votre participation.</p>");
            }
        })
        this.btnInscription5 = Framework.Form.Button.Register("btnInscription5", () => {
            return self.enseigneCarrefour != false || self.enseigneCasino != false || self.enseigneCora != false || self.enseigneIntermarche != false || self.enseigneLeclerc != false || self.enseigneSuperU != false || self.enseigneAutre != "";
        }, () => {
            self.divEnseigne.Hide();
            self.divCategories.Show();
        })
        this.btnInscription6 = Framework.Form.Button.Register("btnInscription6", () => {
            return self.categorieViandePoisson != false || self.categorieFruitLegume != false || self.categoriePainPatisserie != false || self.categorieEpicerieSucree != false || self.categorieFrais != false || self.categorieSurgele != false || self.categorieEpicerieSalee != false;
        }, () => {
            let self = this;

            let questionnaire = new Models.QuestionnaireArbitrage();
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

            let json = JSON.stringify(questionnaire);

            let infos = "<p>Civilité : " + self.civilite + "</p>";
            infos += "<p>Nom : " + self.nom + "</p>";
            infos += "<p>Prénom : " + self.prenom + "</p>";
            infos += "<p>Date de naissance : " + self.dateNaissance + "</p>";
            infos += "<p>Adresse : " + self.adresse + "</p>";
            infos += "<p>Ville : " + self.ville + "</p>";
            infos += "<p>CP : " + self.cp + "</p>";
            infos += "<p>Mail : " + self.mail + "</p>";


            self.CallWCF('NewLoginConsoDrive', { json: json, infos: infos, mail: self.mail }, () => {
                Framework.Progress.Show("Enregistrement...");
            }, (res) => {
                Framework.Progress.Hide();
                self.divCategories.Hide();
                self.divFin.Show();
                if (res.Status == 'success') {
                    self.divFin.SetHtml("<p>Un e-mail avec un lien de connexion au questionnaire vous a été envoyé.</p><p> Nous vous remercions par avance pour votre participation.</p>");
                } else {
                    self.divFin.SetHtml("<p>" + res.ErrorMessage + "</p><p>Veuillez vérifier votre adresse mail et réessayer.</p><p>En cas de problème, vous pouvez envoyer un mail à : consodrive@inrae.fr.</p>");
                }
            });
        })

    }
}

class ConsoDriveApp extends Framework.App {

    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/consodrive';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
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
        requirements.Required = [] //TODO;


        requirements.Extensions = ["Rating", "Slider"];
        return requirements;
    }

    constructor(isInTest: boolean = false) {
        super(ConsoDriveApp.GetRequirements(), isInTest);
    }

    protected onError(error: string) {
        super.onError(error);
    }

    private questionnaire: Models.QuestionnaireArbitrage;
    private aliment: Models.QuestionAliment;
    private nbAliments: number = 30;
    private readonly delaiFacture = 200;

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);

        let id = "";
        let url = window.location.href;
        if (url.indexOf('?id=') > -1) {
            var hashes = url.slice(url.indexOf('?id=') + 4).split('&');
            if (hashes.length > 0) {
                id = hashes[0];
            }
        }
        this.showDivAuthentification(id);
    }

    private checkQuestionnaire() {
        let acces = this.questionnaire.AccesQuestionnaire.filter((x) => { return x.Page != "Authentification" });
        if (acces.length == 0) {
            this.showDivConsentement();
            return;
        }
        let dernierePage: string = acces[acces.length - 1].Page;
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

    }

    private saveQuestionnaire(currentPage: string, onSuccess: () => void = () => { }) {
        let self = this;
        this.questionnaire.AccesQuestionnaire.push(new Models.AccesQuestionnaire(currentPage.replace("div", ""), new Date(Date.now())));
        self.CallWCF('SaveQuestionnaireConsoDrive', { code: self.questionnaire.Code, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, () => {
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

    private showDivAuthentification(id: string = "") {

        let self = this;

        this.showDiv("html/divAuthentification.html", () => {

            let pIdError = Framework.Form.TextElement.Register("pIdError");
            pIdError.Hide();

            let inputId = Framework.Form.InputText.Register("inputId", "", Framework.Form.Validator.MinLength(4, "Longueur minimale : 4 caractères."), (text: string) => {
                btnCheckId.CheckState();
            });

            let btnCheckId = Framework.Form.Button.Register("btnCheckId", () => { return inputId.Value.length >= 4; }, () => {
                self.CallWCF('LoginConsoDrive', { code: inputId.Value }, () => {
                    Framework.Progress.Show("Vérification du code...");
                }, (res) => {
                    Framework.Progress.Hide();
                    console.log(res.ErrorMessage);
                    if (res.Status == 'success') {
                        let json: string = res.Result;
                        if (json == "") {
                            // 1ere connexion
                            self.questionnaire = new Models.QuestionnaireArbitrage();
                            self.questionnaire.Code = inputId.Value;
                        } else {
                            // Récupération de l'existant
                            self.questionnaire = JSON.parse(json);
                        }

                        self.saveQuestionnaire("divAuthentification", () => {
                            self.checkQuestionnaire();
                        });

                    } else {
                        pIdError.Show();
                    }
                });
            });

            if (id != "") {

                self.CallWCF('LoginConsoDriveURL', { id: id }, () => {
                    Framework.Progress.Show("Vérification du code...");
                }, (res) => {
                    Framework.Progress.Hide();
                    console.log(res.ErrorMessage);
                    if (res.Status == 'success') {
                        let json: string = res.Result;

                        // Récupération de l'existant
                        self.questionnaire = JSON.parse(json);
                        self.questionnaire.Code = id;


                        self.saveQuestionnaire("divAuthentification", () => {
                            self.checkQuestionnaire();
                        });

                    } else {
                        pIdError.Show();
                    }
                });
            }

        });


    }

    private showDivConsentement() {
        let self = this;
        this.showDiv("html/divConsentement.html", () => {

            let btnDecline = Framework.Form.Button.Register("btnDecline", () => { return true; }, () => {
                let mw = Framework.Modal.Confirm("Confirmation requise", "Si vous cliquez sur \"Confirmer\", votre participation ne sera pas prise en compte et vous ne serez pas indemnisé(e). Confirmez-vous votre choix ?", () => {
                    self.questionnaire.ConsentementAccepte = false;
                    self.showDivFin();
                }, () => {
                    mw.Close();
                }, "Confirmer", "Annuler")
            });

            let btnAccept = Framework.Form.Button.Register("btnAccept", () => { return true; }, () => {
                self.questionnaire.ConsentementAccepte = true;
                self.showDivInfo();
            });
        });

    }

    private showDivInfo() {
        let self = this;
        this.showDiv("html/divInfo.html", () => {

            let btnNext = Framework.Form.Button.Register("btnNext", () => { return true; }, () => {
                self.showDivFactures();
            });
        });

    }

    private showDivFactures() {
        let self = this;

        this.showDiv("html/divFactures.html", () => {

            self.questionnaire.AccesQuestionnaire.push(new Models.AccesQuestionnaire("divQuestionnaireIndividu", new Date(Date.now())));

            let h4 = Framework.Form.TextElement.Register("h4");

            let spanNbTotalAliments = Framework.Form.TextElement.Register("spanNbTotalAliments", Models.QuestionnaireArbitrage.GetNbItems(self.questionnaire).toString());
            let spanNbAliments = Framework.Form.TextElement.Register("spanNbAliments", self.nbAliments.toString());
            let spanNbAliments2 = Framework.Form.TextElement.Register("spanNbAliments2", self.nbAliments.toString());



            //let divTableInvoices = Framework.Form.TextElement.Register("divTableInvoices");

            let pNbAliments = Framework.Form.TextElement.Register("pNbAliments");
            pNbAliments.Hide();
            pNbAliments.HtmlElement.classList.add("alert");
            pNbAliments.HtmlElement.classList.add("alert-danger");

            let btnGoToInstruction1 = Framework.Form.Button.Register("btnGoToInstruction1", () => {
                return true;
            }, () => {
                self.showDivInstruction1()
            });

            let btnFactures = Framework.Form.Button.Register("btnFactures", () => {
                return true;
            }, () => {
                let div = Framework.Form.TextElement.Create();;
                let mw = Framework.Modal.Alert("Factures", div.HtmlElement);
                Models.QuestionnaireArbitrage.RenderItems(self.questionnaire, spanNbTotalAliments, div, "50vh");
            });

            btnGoToInstruction1.Hide();

            let uploadPDF = (fileContent) => {
                self.CallWCF('UploadInvoice2', { fileContent: fileContent, complete: false, delay: self.delaiFacture }, () => {
                    Framework.Progress.Show("Traitement de la facture...");
                }, (res) => {
                    Framework.Progress.Hide();
                    if (res.Status == "success") {
                        let json = res.Result;
                        let invoice: InvoiceAnalyzerModels.Invoice = JSON.parse(json);
                        Models.QuestionnaireArbitrage.AddInvoice(self.questionnaire, invoice, self.nbAliments);
                        let nb = Models.QuestionnaireArbitrage.GetNbItems(self.questionnaire);
                        pNbAliments.Show();
                        spanNbTotalAliments.Set(nb.toString());
                        if (nb >= self.nbAliments) {
                            pNbAliments.HtmlElement.classList.add("alert");
                            pNbAliments.HtmlElement.classList.remove("alert-danger");
                            pNbAliments.HtmlElement.classList.add("alert-success");
                            h4.SetHtml("Veuillez cliquer sur \"Suivant\" pour continuer.");
                            btnGoToInstruction1.Show();
                            btnBrowse.Hide();
                        } else {
                            h4.SetHtml("Veuillez sélectionner <b>une nouvelle facture au format PDF</b> en cliquant sur le bouton \"Ajouter une facture\" jusqu'à obtenir un minimum de <b>" + self.nbAliments + " aliments différents</b> (seuls les achats alimentaires sont pris en compte).")
                            btnBrowse.SetInnerHTML("Ajouter une facture");
                        }
                    } else {
                        let error = res.ErrorMessage;
                        if (res.ErrorMessage == "INVOICE_TOO_OLD") {
                            error = "La facture est trop ancienne";
                        }
                        Framework.Modal.Alert("Erreur", error);
                    }

                });
            }

            let btnBrowse = Framework.Form.Button.Register("btnBrowse", () => { return true; }, () => {
                Framework.FileHelper.BrowseBinaries("pdf", (fileContent) => {
                    uploadPDF(fileContent);
                });
            });
        })
    }

    private showDiv(htmlPath: string, onLoaded: () => void, nextButtonId: string = undefined, nextButtonAction: () => void = undefined, nextButtonEnableFunction: () => boolean = () => { return true }, nextButtonTime: number = undefined, previousButtonId: string = undefined, previousButtonAction: () => void = undefined) {

        let self = this;

        document.body.innerHTML = "";
        let path = ConsoDriveApp.GetRequirements().AppUrl + "/" + htmlPath;
        Framework.BaseView.Load(path, "body", (div) => {

            $('.fa-info-circle').tooltipster({ trigger: 'click' });

            let previousAccess = false;
            if (self.questionnaire) {
                previousAccess = Models.QuestionnaireArbitrage.HasAccess(self.questionnaire, div.id.replace("div", ""));
                self.saveQuestionnaire(div.id, () => {
                    if (previousButtonId != undefined) {
                        let btnPrev = Framework.Form.Button.Register(previousButtonId, () => {
                            return true;
                        }, () => {
                            previousButtonAction();
                        });

                        if (nextButtonTime > 0 && previousAccess == false) {
                            Framework.Form.Button.DisableDuring(btnPrev, nextButtonTime);
                        }
                    }

                    if (nextButtonId != undefined) {
                        let btnNext = Framework.Form.Button.Register(nextButtonId, () => {
                            return nextButtonEnableFunction();
                        }, () => {
                            nextButtonAction();
                        });

                        if (nextButtonTime > 0 && previousAccess == false) {
                            Framework.Form.Button.DisableDuring(btnNext, nextButtonTime);
                        }
                    }

                    onLoaded();
                });
            } else {
                onLoaded();
            }



        });
    }

    private showDivInstruction1() {
        let self = this;
        this.showDiv("html/divInstruction1.html", () => { }, "btnGoToEntrainement1", () => { self.showDivEntrainement1(); });
    }

    private showDivEntrainement1() {
        let self = this;
        this.showDiv("html/divEntrainement1.html", () => { }, "btnGoToEntrainement2", () => { self.showDivEntrainement2(); }, () => { return true; }, 10, "btnBackToInstruction1", () => { self.showDivInstruction1(); })
    }

    private showDivEntrainement2() {
        let self = this;
        this.showDiv("html/divEntrainement2.html", () => { }, "btnGoToEntrainement3", () => { self.showDivEntrainement3(); }, () => { return true; }, 10, "btnBackToEntrainement1", () => { self.showDivEntrainement1(); })
    }

    private showDivEntrainement3() {
        let self = this;
        this.showDiv("html/divEntrainement3.html", () => { }, "btnGoToEntrainement4", () => { self.showDivEntrainement4(); }, () => { return true; }, 10, "btnBackToEntrainement2", () => { self.showDivEntrainement2(); })
    }

    private showDivEntrainement4() {
        let self = this;
        this.showDiv("html/divEntrainement4.html", () => { }, "btnGoToEntrainement5", () => { self.showDivEntrainement5(); }, () => { return true; }, 10, "btnBackToEntrainement3", () => { self.showDivEntrainement3(); })
    }

    private showDivEntrainement5() {
        let self = this;
        this.showDiv("html/divEntrainement5.html", () => { }, "btnGoToEntrainement6", () => { self.showDivEntrainement6(); }, () => { return true; }, 10, "btnBackToEntrainement4", () => { self.showDivEntrainement4(); })
    }

    private showDivEntrainement6() {
        let self = this;
        this.showDiv("html/divEntrainement6.html", () => { }, "btnGoToEntrainement7", () => { self.showDivEntrainement7(); }, () => { return true; }, 10, "btnBackToEntrainement5", () => { self.showDivEntrainement5(); })
    }

    private showDivEntrainement7() {
        let self = this;
        this.showDiv("html/divEntrainement7.html", () => { }, "btnGoToEntrainement8", () => { self.showDivEntrainement8(); }, () => { return true; }, 10, "btnBackToEntrainement6", () => { self.showDivEntrainement6(); })
    }

    private showDivEntrainement8() {
        let self = this;
        this.showDiv("html/divEntrainement8.html", () => { }, "btnGoToInstruction2", () => { self.showDivInstruction2(); }, () => { return true; }, 10, "btnBackToEntrainement7", () => { self.showDivEntrainement7(); })
    }

    private showDivInstruction2() {
        let self = this;
        this.showDiv("html/divInstruction2.html", () => { }, "btnGoToEntrainement9", () => { self.showDivEntrainement9(); }, () => { return true; }, undefined, "btnBackToEntrainement8", () => { self.showDivEntrainement8(); })
    }

    private showDivEntrainement9() {
        let self = this;
        

        this.showDiv("html/divEntrainement9.html", () => {

            self.showDivInstruction3();

            let nbDefaut = 40;
            let nbValeurEconomique = 0; let nbValeurEconomiqueErreur = 0;
            let nbProprietesOrganoleptiques = 0; let nbProprietesOrganoleptiquesErreur = 0;
            let nbQualiteSanitaire = 0; let nbQualiteSanitaireErreur = 0;
            let nbCaracteristiquesNutritionnelles = 0; let nbCaracteristiquesNutritionnellesErreur = 0;
            let nbImpactEnvironnemental = 0; let nbImpactEnvironnementalErreur = 0;
            let nbImpactEconomiqueSocial = 0; let nbImpactEconomiqueSocialErreur = 0;
            let nbConvictionsPersonnellesCulturelles = 0; let nbConvictionsPersonnellesCulturellesErreur = 0;
            let nbQualitesPratiques = 0; let nbQualitesPratiquesErreur = 0;

            let drop = (ev: DragEvent) => {
                ev.preventDefault();
                let data = ev.dataTransfer.getData("text");
                let div = (<HTMLDivElement>ev.target);
                while (div.id.indexOf("divGrp") == -1) {
                    div = <HTMLDivElement>div.parentElement;
                }
                //div.appendChild(document.getElementById(data));
                //div.insertAdjacentElement('afterbegin',document.getElementById(data))

                let group = "";

                group = div.id.replace("divGrp", "");

                let question = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Label", data)[0];
                question.ClasseParSujetDansDimension = group;
                if (question.ClasseParSujetDansDimension == "Defaut") {
                    document.getElementById(data).style.color = "black";
                    div.appendChild(document.getElementById(data));
                } else if (question.ClasseParSujetDansDimension == question.Dimension) {
                    document.getElementById(data).style.color = "green";
                    question.Reponses.push(group);
                    div.appendChild(document.getElementById(data));
                } else {
                    document.getElementById(data).style.color = "red";
                    question.Reponses.push(group);
                    question.MauvaisesReponses++;
                    div.insertAdjacentElement('afterbegin', document.getElementById(data))
                }
                update();
            }

            let droppable = (div: Framework.Form.TextElement) => {
                div.HtmlElement.ondrop = (ev) => { drop(ev); };
                div.HtmlElement.ondragover = (ev) => { ev.preventDefault(); };
                div.HtmlElement.innerHTML = "";
            };

            let update = () => {
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
                spanValeurEconomique.Set(nbValeurEconomique.toString()); spanValeurEconomiqueErreur.Set(nbValeurEconomiqueErreur.toString());
                spanProprietesOrganoleptiques.Set(nbProprietesOrganoleptiques.toString()); spanProprietesOrganoleptiquesErreur.Set(nbProprietesOrganoleptiquesErreur.toString());
                spanQualiteSanitaire.Set(nbQualiteSanitaire.toString()); spanQualiteSanitaireErreur.Set(nbQualiteSanitaireErreur.toString());
                spanCaracteristiquesNutritionnelles.Set(nbCaracteristiquesNutritionnelles.toString()); spanCaracteristiquesNutritionnellesErreur.Set(nbCaracteristiquesNutritionnellesErreur.toString());
                spanImpactEnvironnemental.Set(nbImpactEnvironnemental.toString()); spanImpactEnvironnementalErreur.Set(nbImpactEnvironnementalErreur.toString());
                spanImpactEconomiqueSocial.Set(nbImpactEconomiqueSocial.toString()); spanImpactEconomiqueSocialErreur.Set(nbImpactEconomiqueSocialErreur.toString());
                spanConvictionsPersonnellesCulturelles.Set(nbConvictionsPersonnellesCulturelles.toString()); spanConvictionsPersonnellesCulturellesErreur.Set(nbConvictionsPersonnellesCulturellesErreur.toString());
                spanQualitesPratiques.Set(nbQualitesPratiques.toString()); spanQualitesPratiquesErreur.Set(nbQualitesPratiquesErreur.toString());
                btnGoToInstruction3.CheckState();

            };

            let btnGoToInstruction2 = Framework.Form.Button.Register("btnBackToInstruction2", () => {
                return true;
            }, () => {
                self.showDivInstruction2();
            })

            let btnGoToInstruction3 = Framework.Form.Button.Register("btnGoToInstruction3", () => {
                return true;
            }, () => {
                let nbGoodAnswers = Models.QuestionnaireArbitrage.GetNbGoodAnswers(self.questionnaire);
                if (nbGoodAnswers == 40) {
                    self.showDivInstruction3();
                } else {
                    Framework.Modal.Alert("Il reste des éléments mal classés", "Vous avez " + nbGoodAnswers + " bonnes réponses sur 40, il vous reste " + (40 - nbGoodAnswers) + " bonnes réponses à trouver avant de pouvoir passer à l'écran suivant.")
                }
            })

            let divGrpDefaut = Framework.Form.TextElement.Register("divGrpDefaut");
            let spanDefaut = Framework.Form.TextElement.Register("spanDefaut");
            droppable(divGrpDefaut);

            let divGrpValeurEconomique = Framework.Form.TextElement.Register("divGrpEconomique");
            let spanValeurEconomique = Framework.Form.TextElement.Register("spanValeurEconomique");
            let spanValeurEconomiqueErreur = Framework.Form.TextElement.Register("spanValeurEconomiqueErreur");
            droppable(divGrpValeurEconomique);

            let divGrpProprietesOrganoleptiques = Framework.Form.TextElement.Register("divGrpOrganoleptique");
            let spanProprietesOrganoleptiques = Framework.Form.TextElement.Register("spanProprietesOrganoleptiques");
            let spanProprietesOrganoleptiquesErreur = Framework.Form.TextElement.Register("spanProprietesOrganoleptiquesErreur");
            droppable(divGrpProprietesOrganoleptiques);

            let divGrpQualiteSanitaire = Framework.Form.TextElement.Register("divGrpSanitaire");
            let spanQualiteSanitaire = Framework.Form.TextElement.Register("spanQualiteSanitaire");
            let spanQualiteSanitaireErreur = Framework.Form.TextElement.Register("spanQualiteSanitaireErreur");
            droppable(divGrpQualiteSanitaire);

            let divGrpCaracteristiquesNutritionnelles = Framework.Form.TextElement.Register("divGrpNutrition");
            let spanCaracteristiquesNutritionnelles = Framework.Form.TextElement.Register("spanCaracteristiquesNutritionnelles");
            let spanCaracteristiquesNutritionnellesErreur = Framework.Form.TextElement.Register("spanCaracteristiquesNutritionnellesErreur");
            droppable(divGrpCaracteristiquesNutritionnelles);

            let divGrpImpactEnvironnemental = Framework.Form.TextElement.Register("divGrpEnvironnement");
            let spanImpactEnvironnemental = Framework.Form.TextElement.Register("spanImpactEnvironnemental");
            let spanImpactEnvironnementalErreur = Framework.Form.TextElement.Register("spanImpactEnvironnementalErreur");
            droppable(divGrpImpactEnvironnemental);

            let divGrpImpactEconomiqueSocial = Framework.Form.TextElement.Register("divGrpSocioEconomique");
            let spanImpactEconomiqueSocial = Framework.Form.TextElement.Register("spanImpactEconomiqueSocial");
            let spanImpactEconomiqueSocialErreur = Framework.Form.TextElement.Register("spanImpactEconomiqueSocialErreur");
            droppable(divGrpImpactEconomiqueSocial);

            let divGrpConvictionsPersonnellesCulturelles = Framework.Form.TextElement.Register("divGrpConviction");
            let spanConvictionsPersonnellesCulturelles = Framework.Form.TextElement.Register("spanConvictionsPersonnellesCulturelles");
            let spanConvictionsPersonnellesCulturellesErreur = Framework.Form.TextElement.Register("spanConvictionsPersonnellesCulturellesErreur");
            droppable(divGrpConvictionsPersonnellesCulturelles);

            let divGrpQualitesPratiques = Framework.Form.TextElement.Register("divGrpPratique");
            let spanQualitesPratiques = Framework.Form.TextElement.Register("spanQualitesPratiques");
            let spanQualitesPratiquesErreur = Framework.Form.TextElement.Register("spanQualitesPratiquesErreur");
            droppable(divGrpQualitesPratiques);


            let arr = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "All", "");
            Framework.Array.Shuffle(arr);

            arr.forEach((x) => {
                let div = Framework.Form.TextElement.Create(x.Label);
                div.HtmlElement.id = x.Label;
                if (x.ClasseParSujetDansDimension == "Defaut") {
                    div.HtmlElement.style.color = "black";
                } else if (x.ClasseParSujetDansDimension == x.Dimension) {
                    div.HtmlElement.style.color = "green";
                } else {
                    div.HtmlElement.style.color = "red";
                }
                div.HtmlElement.classList.add("draggable");
                div.HtmlElement.draggable = true;
                div.HtmlElement.ondragstart = (event) => {
                    event.dataTransfer.setData("text", (<HTMLDivElement>(event.target)).id.replace("divGrp", ""));
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
    }

    private showDivInstruction3() {
        let self = this;
        this.showDiv("html/divInstruction3.html", () => { }, "btnGoToQuestionnaireAliment1", () => { self.showDivQuestionnaireAliment1(); });
    }

    private getLastAliment(): boolean {
        let self = this;
        let aliments = this.questionnaire.QuestionsAliment.filter(x => { return x.EstNote == true });
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
        } else {
            aliments = this.questionnaire.QuestionsAliment.filter(x => { return x.Position == self.questionnaire.IndexQuestion });
            self.aliment = aliments[0];
            return true;
        }
    }

    private showDivQuestionnaireAliment1() {
        let self = this;

        if (this.getLastAliment() == false) {
            return;
        }

        let show = () => {
            self.showDiv("html/divQuestionnaireAliment1.html", () => {

                let reponse: number = undefined;

                let divNomAliment = Framework.Form.TextElement.Register("divNomAliment1");
                divNomAliment.Set(self.aliment.Designation);

                let inputConsommeOui = Framework.Form.CheckBox.Register("inputConsommeOui", () => { return true; }, () => { self.aliment.Consomme = 1; btnGoToQuestionnaireAliment2.CheckState(); }, "OUI");
                let inputConsommeNon = Framework.Form.CheckBox.Register("inputConsommeNon", () => { return true; }, () => { self.aliment.Consomme = 0; btnGoToQuestionnaireAliment2.CheckState(); }, "NON");
                let inputConsommeNonAlimentaire = Framework.Form.CheckBox.Register("inputConsommeNonAlimentaire", () => { return true; }, () => { self.aliment.Consomme = -1; btnGoToQuestionnaireAliment2.CheckState(); }, "Non alimentaire");
                if (self.aliment.Consomme == 1) {
                    inputConsommeOui.Check();
                }
                if (self.aliment.Consomme == 0) {
                    inputConsommeNon.Check();
                }
                if (self.aliment.Consomme == -1) {
                    inputConsommeNonAlimentaire.Check();
                }

                let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                    return true;
                }, () => {
                    if (self.questionnaire.IndexQuestion > 1) {
                        self.questionnaire.IndexQuestion--;
                        self.showDivQuestionnaireAliment4();
                    } else {
                        self.showDivInstruction3();
                    }
                })

                let btnGoToQuestionnaireAliment2 = Framework.Form.Button.Register("btnGoToQuestionnaireAliment2", () => {
                    return (self.aliment.Consomme != undefined);
                }, () => {
                    if (self.aliment.Consomme > -1) {
                        self.showDivQuestionnaireAliment2();
                    } else {
                        // Nouvel aliment      
                        self.aliment.EstNote = false;
                        self.questionnaire.IndexQuestion++;
                        self.showDivQuestionnaireAliment1();
                    }

                })
            });
        }

        if (this.questionnaire.IndexQuestion > 1) {

            let div = document.createElement("h2");
            div.innerText = "Nouvel aliment";
            div.style.textAlign = "center";

            let mw = Framework.Modal.CustomWithBackdrop(div);
            mw.show();

            setTimeout(() => { mw.Close(); show(); }, 2000);
        } else {
            show();
        }


    }

    private showDivQuestionnaireAliment2() {
        let self = this;

        if (this.getLastAliment() == false) {
            return;
        }

        this.showDiv("html/divQuestionnaireAliment2.html", () => {

            let reponse: string = undefined;

            let divNomAliment = Framework.Form.TextElement.Register("divNomAliment2");
            divNomAliment.Set(self.aliment.Designation);

            let inputChoixOui = Framework.Form.CheckBox.Register("inputChoixOui", () => { return true; }, () => { self.aliment.Choisi = "oui"; btnGoToQuestionnaireAliment3.CheckState(); }, "OUI");
            let inputChoixNon = Framework.Form.CheckBox.Register("inputChoixNon", () => { return true; }, () => { self.aliment.Choisi = "non"; btnGoToQuestionnaireAliment3.CheckState(); }, "NON");
            let inputChoixPartage = Framework.Form.CheckBox.Register("inputChoixPartage", () => { return true; }, () => { self.aliment.Choisi = "partage"; btnGoToQuestionnaireAliment3.CheckState(); }, "PARTAGE");

            if (self.aliment.Choisi == "oui") {
                inputChoixOui.Check();
            }
            if (self.aliment.Choisi == "non") {
                inputChoixNon.Check();
            }
            if (self.aliment.Choisi == "partage") {
                inputChoixPartage.Check();
            }

            let btnGoToQuestionnaireAliment3 = Framework.Form.Button.Register("btnGoToQuestionnaireAliment3", () => {
                return (self.aliment.Choisi != undefined);
            }, () => {
                if (self.aliment.Choisi == "non") {
                    // Nouvel aliment
                    self.aliment.EstNote = false;
                    self.questionnaire.IndexQuestion++;
                    self.showDivQuestionnaireAliment1();

                } else {
                    self.showDivQuestionnaireAliment3();
                }

            })

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireAliment1();
            })
        });

    }

    private showDivQuestionnaireAliment3() {
        let self = this;

        if (this.getLastAliment() == false) {
            return;
        }

        this.showDiv("html/divQuestionnaireAliment3.html", () => {

            let divNomAliment = Framework.Form.TextElement.Register("divNomAliment3");
            divNomAliment.Set(self.aliment.Designation);



            let economique = Models.QuestionAliment.GetDimension(self.aliment, "Economique");
            let sensoriel = Models.QuestionAliment.GetDimension(self.aliment, "Organoleptique");
            let sanitaire = Models.QuestionAliment.GetDimension(self.aliment, "Sanitaire");
            let nutrition = Models.QuestionAliment.GetDimension(self.aliment, "Nutrition");
            let environnement = Models.QuestionAliment.GetDimension(self.aliment, "Environnement");
            let socio = Models.QuestionAliment.GetDimension(self.aliment, "SocioEconomique");
            let conviction = Models.QuestionAliment.GetDimension(self.aliment, "Conviction");
            let pratique = Models.QuestionAliment.GetDimension(self.aliment, "Pratique");
            let autre = Models.QuestionAliment.GetDimension(self.aliment, "Autre");

            let btnGoToQuestionnaireAliment4 = Framework.Form.Button.Register("btnGoToQuestionnaireAliment4", () => {
                let autre = Models.QuestionAliment.GetDimension(self.aliment, "Autre");
                return (economique.ImportantAliment == 1
                    || sensoriel.ImportantAliment == 1
                    || sanitaire.ImportantAliment == 1
                    || nutrition.ImportantAliment == 1
                    || environnement.ImportantAliment == 1
                    || socio.ImportantAliment == 1
                    || conviction.ImportantAliment == 1
                    || pratique.ImportantAliment == 1
                    || (autre.ImportantAliment == 0 || (autre.ImportantAliment == 1 && autre.Label.length > 4))
                );
            }, () => {
                self.showDivQuestionnaireAliment4();
            })


            let inputInfluenceValeurEconomique = Framework.Form.CheckBox.Register("inputInfluenceValeurEconomique", () => { return true; }, (event, cb) => { economique.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            let inputInfluenceProprietesOrganoleptiques = Framework.Form.CheckBox.Register("inputInfluenceProprietesOrganoleptiques", () => { return true; }, (event, cb) => { sensoriel.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            let inputInfluenceQualiteSanitaire = Framework.Form.CheckBox.Register("inputInfluenceQualiteSanitaire", () => { return true; }, (event, cb) => { sanitaire.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            let inputInfluenceCaracteristiquesNutritionnelles = Framework.Form.CheckBox.Register("inputInfluenceCaracteristiquesNutritionnelles", () => { return true; }, (event, cb) => { nutrition.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            let inputInfluenceImpactEnvironnemental = Framework.Form.CheckBox.Register("inputInfluenceImpactEnvironnemental", () => { return true; }, (event, cb) => { environnement.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            let inputInfluenceImpactEconomiqueSocial = Framework.Form.CheckBox.Register("inputInfluenceImpactEconomiqueSocial", () => { return true; }, (event, cb) => { socio.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            let inputInfluenceConvictionsPersonnellesCulturelles = Framework.Form.CheckBox.Register("inputInfluenceConvictionsPersonnellesCulturelles", () => { return true; }, (event, cb) => { conviction.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            let inputInfluenceQualitesPratiques = Framework.Form.CheckBox.Register("inputInfluenceQualitesPratiques", () => { return true; }, (event, cb) => { pratique.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            let inputInfluenceAutre = Framework.Form.CheckBox.Register("inputInfluenceAutre", () => { return true; }, (event, cb) => { autre.ImportantAliment = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireAliment4.CheckState(); }, "");
            let inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), (val) => { autre.Label = val; btnGoToQuestionnaireAliment4.CheckState(); });

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



            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireAliment2();
            })
        });

    }

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

    private showDivQuestionnaireAliment4() {
        let self = this;

        if (this.getLastAliment() == false) {
            return;
        }

        this.showDiv("html/divQuestionnaireAliment4.html", () => {

            let divNomAliment = Framework.Form.TextElement.Register("divNomAliment4");
            divNomAliment.Set(self.aliment.Designation);

            let importantDimensions = Models.QuestionAliment.GetImportantDimensions(self.aliment);

            let divCriteresImportant = Framework.Form.TextElement.Register("divCriteresImportant");
            importantDimensions.forEach(x => {

                try {
                    let h4 = document.createElement("h4");
                    h4.style.fontWeight = "bold";
                    h4.classList.add("mt-5");
                    let text = x.Label.split("(");
                    if (text[1] == undefined) {
                        text[1] = text[0];
                    }

                    if (x.Nom != "Autre") {
                        let span = document.createElement("span");
                        span.classList.add("tooltipster");
                        span.classList.add("fas");
                        span.classList.add("fa-info-circle");
                        span.title = text[1].replace(")", "");
                        //span.innerHTML = "<i class=\"fas fa-info-circle\" title=\"" + text[1] + "\"></i> ";
                        h4.append(span);

                        //span.onclick = () => {
                        //    alert(text[1]);
                        setTimeout(() => {
                            $('.fa-info-circle').tooltipster({ trigger: 'click' });
                        }, 100);
                        //};
                    }
                    let span2 = document.createElement("span");
                    span2.innerHTML = " " + text[0];
                    h4.append(span2);

                    //h4.innerHTML = "<i class=\"fas fa-info-circle\" title=\"" + text[1] + "\"></i> " + text[0];
                    divCriteresImportant.HtmlElement.append(h4);



                    let score = undefined;
                    if (x.ScoreAliment >= 1) {
                        score = x.ScoreAliment.toString();
                    }

                    //let slider = Framework.Slider.Slider.Create(x.Nom, 1, 3, score, (name: string, score: number) => {
                    //    Models.QuestionAliment.GetDimension(self.aliment, name).ScoreAliment = score;
                    //    btnBackToQuestionnaireAliment1.CheckState();
                    //});



                    let divSlider = document.createElement("div"); divSlider.style.float = "left"; divSlider.style.width = "40%";
                    divSlider.classList.add("scale-2");
                    divSlider.classList.add("text-center");
                    //divSlider.append(slider);

                    let rating = Framework.Rating.Render(divSlider, x.Nom, 1, 5, score, (x, name) => {
                        Models.QuestionAliment.GetDimension(self.aliment, name).ScoreAliment = x;
                        btnBackToQuestionnaireAliment1.CheckState();
                    });


                    let borneGauche = document.createElement("div"); borneGauche.innerHTML = "Secondaire"; divCriteresImportant.HtmlElement.appendChild(borneGauche); borneGauche.style.float = "left"; borneGauche.style.width = "30%"; borneGauche.style.textAlign = "right";
                    divCriteresImportant.HtmlElement.append(divSlider);
                    let borneDroite = document.createElement("div"); borneDroite.innerHTML = "Primordial"; divCriteresImportant.HtmlElement.appendChild(borneDroite); borneDroite.style.float = "left"; borneDroite.style.width = "30%"; borneDroite.style.textAlign = "left";
                    let divClearer = document.createElement("div"); divClearer.style.clear = "both"; divCriteresImportant.HtmlElement.append(divClearer);
                }
                catch {
                }
            });

            let btnBackToQuestionnaireAliment1 = Framework.Form.Button.Register("btnBackToQuestionnaireAliment1", () => {
                let incomplete = importantDimensions.filter(x => {
                    return x.ScoreAliment == 0
                }).length;
                return (incomplete == 0);
            }, () => {
                // Nouvel aliment
                self.aliment.EstNote = true;
                self.questionnaire.IndexQuestion++;
                self.showDivQuestionnaireAliment1();
            })

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireAliment3();
            })
        });

    }

    private showDivInstruction4() {
        let self = this;
        this.showDiv("html/divInstruction4.html", () => { }, "btnGoToQuestionnaireGeneral1", () => {
            self.showDivQuestionnaireGeneral1();
        });
    }

    private showDivQuestionnaireGeneral1() {
        let self = this;

        this.showDiv("html/divQuestionnaireGeneral1.html", () => {

            let divCriteres = Framework.Form.TextElement.Register("divCriteres");

            divCriteres.Hide();

            let divRankingValeurEconomique = Framework.Form.TextElement.Register("divRankingValeurEconomique");
            let dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Economique");
            let prixEuro = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "PrixEuro")[0];
            let prixKg = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "PrixKg")[0];
            let offrePromo = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "OffrePromo")[0];
            let adequationBudget = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AdequationBudget")[0];
            let autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreEconomique")[0];

            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }


            let rating = Framework.Rating.Render(divRankingValeurEconomique.HtmlElement, "", 1, 5, dimension.ScoreGlobal, (x) => {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnGoToQuestionnaireGeneral2.CheckState();
            });

            let btnGoToQuestionnaireGeneral2 = Framework.Form.Button.Register("btnGoToQuestionnaireGeneral2", () => {
                return (dimension.NonPrisEnCompte == 1 ||
                    (prixEuro.Important == 1
                        || prixKg.Important == 1
                        || offrePromo.Important == 1
                        || adequationBudget.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                        && dimension.ScoreGlobal > 0))
            }, () => {
                self.showDivQuestionnaireGeneral2();
            });

            let inputValeurEconomiqueSensiblePrixAffiche = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensiblePrixAffiche", () => { return true; }, (event, cb) => { prixEuro.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            let inputValeurEconomiqueSensiblePrixKg = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensiblePrixKg", () => { return true; }, (event, cb) => { prixKg.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            let inputValeurEconomiqueSensibleReduction = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensibleReduction", () => { return true; }, (event, cb) => { offrePromo.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            let inputValeurEconomiqueSensibleAdequation = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensibleAdequation", () => { return true; }, (event, cb) => { adequationBudget.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            let inputValeurEconomiqueSensibleAutre = Framework.Form.CheckBox.Register("inputValeurEconomiqueSensibleAutre", () => { return true; }, (event, cb) => { autre.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral2.CheckState(); }, "");
            let inputValeurEconomiqueAutre = Framework.Form.InputText.Register("inputValeurEconomiqueAutre", "", Framework.Form.Validator.NoValidation(), (val) => { Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreEconomique")[0].Label = val; if (val.length > 0) { autre.Important = 1; inputValeurEconomiqueSensibleAutre.Check(); } else { autre.Important = 0; inputValeurEconomiqueSensibleAutre.Uncheck(); }; btnGoToQuestionnaireGeneral2.CheckState(); });
            let inputValeurEconomiquePasSensible = Framework.Form.CheckBox.Register("inputValeurEconomiquePasSensible", () => { return true; }, (event, cb) => {

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

            let f = () => {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    inputValeurEconomiqueSensiblePrixAffiche.Uncheck(); prixEuro.Important = 0;
                    inputValeurEconomiqueSensiblePrixKg.Uncheck(); prixKg.Important = 0;
                    inputValeurEconomiqueSensibleReduction.Uncheck(); offrePromo.Important = 0;
                    inputValeurEconomiqueSensibleAdequation.Uncheck(); adequationBudget.Important = 0;
                    inputValeurEconomiqueSensibleAutre.Uncheck(); autre.Important = 0;
                    inputValeurEconomiqueAutre.Set(""); autre.Label = "";
                } else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                }

                btnGoToQuestionnaireGeneral2.CheckState();
            }
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



            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivInstruction4();
            });
        });
    }

    private showDivQuestionnaireGeneral2() {
        let self = this;

        this.showDiv("html/divQuestionnaireGeneral2.html", () => {

            let divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();

            let divRanking = Framework.Form.TextElement.Register("divRanking");
            let dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Organoleptique");
            let gout = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Gout")[0];
            let plaisir = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Plaisir")[0];
            let marque = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "MarqueOrganoleptique")[0];
            let variete = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "VarieteOrganoleptique")[0];
            let nouveaute = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Nouveaute")[0];
            let autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreOrganoleptique")[0];

            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }

            let rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, (x) => {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnGoToQuestionnaireGeneral3.CheckState();
            });

            let btnGoToQuestionnaireGeneral3 = Framework.Form.Button.Register("btnGoToQuestionnaireGeneral3", () => {
                return (dimension.NonPrisEnCompte == 1 ||
                    (gout.Important == 1
                        || plaisir.Important == 1
                        || marque.Important == 1
                        || nouveaute.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                        && dimension.ScoreGlobal > 0))
            }, () => {
                self.showDivQuestionnaireGeneral3();
            });

            let inputProprieteOrganoleptiqueGout = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueGout", () => { return true; }, (event, cb) => { gout.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            let inputProprieteOrganoleptiqueNouveau = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueNouveau", () => { return true; }, (event, cb) => { nouveaute.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            let inputProprieteOrganoleptiqueVarie = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueVarie", () => { return true; }, (event, cb) => { variete.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            let inputProprieteOrganoleptiquePlaisir = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiquePlaisir", () => { return true; }, (event, cb) => { plaisir.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            let inputProprieteOrganoleptiqueIndirect = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueIndirect", () => { return true; }, (event, cb) => { marque.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            let inputProprieteOrganoleptiqueAutre = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiqueAutre", () => { return true; }, (event, cb) => { autre.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral3.CheckState(); }, "");
            let inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), (val) => { Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreOrganoleptique")[0].Label = val; if (val.length > 0) { autre.Important = 1; inputProprieteOrganoleptiqueAutre.Check(); } else { autre.Important = 0; inputProprieteOrganoleptiqueAutre.Uncheck(); }; btnGoToQuestionnaireGeneral3.CheckState(); });
            let inputProprieteOrganoleptiquePasSensible = Framework.Form.CheckBox.Register("inputProprieteOrganoleptiquePasSensible", () => { return true; }, (event, cb) => {

                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();




            }, "");

            let f = () => {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    inputProprieteOrganoleptiqueGout.Uncheck(); gout.Important = 0;
                    inputProprieteOrganoleptiqueNouveau.Uncheck(); plaisir.Important = 0;
                    inputProprieteOrganoleptiqueVarie.Uncheck(); marque.Important = 0;
                    inputProprieteOrganoleptiquePlaisir.Uncheck(); variete.Important = 0;
                    inputProprieteOrganoleptiqueIndirect.Uncheck(); nouveaute.Important = 0;
                    inputProprieteOrganoleptiqueAutre.Uncheck(); autre.Important = 0;
                    inputAutre.Set(""); autre.Label = "";
                } else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }

                btnGoToQuestionnaireGeneral3.CheckState();
            }
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

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireGeneral1();
            });
        });
    }

    private showDivQuestionnaireGeneral3() {
        let self = this;

        this.showDiv("html/divQuestionnaireGeneral3.html", () => {
            let divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            let divRanking = Framework.Form.TextElement.Register("divRanking");
            let dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Sanitaire");
            let pesticide = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Pesticide")[0];
            let contaminant = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Contaminant")[0];
            let toxine = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Toxine")[0];
            let additif = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Additif")[0];
            let toxique = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Toxique")[0];
            let autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreSanitaire")[0];

            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }

            let rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, (x) => {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnGoToQuestionnaireGeneral4.CheckState();
            });

            let btnGoToQuestionnaireGeneral4 = Framework.Form.Button.Register("btnGoToQuestionnaireGeneral4", () => {
                return (dimension.NonPrisEnCompte == 1 ||
                    (pesticide.Important == 1
                        || contaminant.Important == 1
                        || toxine.Important == 1
                        || additif.Important == 1
                        || toxique.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                        && dimension.ScoreGlobal > 0))
            }, () => {
                self.showDivQuestionnaireGeneral4();
            });

            let inputQualiteSanitairePesticide = Framework.Form.CheckBox.Register("inputQualiteSanitairePesticide", () => { return true; }, (event, cb) => { pesticide.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            let inputQualiteSanitaireContaminant = Framework.Form.CheckBox.Register("inputQualiteSanitaireContaminant", () => { return true; }, (event, cb) => { contaminant.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            let inputQualiteSanitaireToxine = Framework.Form.CheckBox.Register("inputQualiteSanitaireToxine", () => { return true; }, (event, cb) => { toxine.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            let inputQualiteSanitaireAdditif = Framework.Form.CheckBox.Register("inputQualiteSanitaireAdditif", () => { return true; }, (event, cb) => { additif.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            let inputQualiteSanitaireToxique = Framework.Form.CheckBox.Register("inputQualiteSanitaireToxique", () => { return true; }, (event, cb) => { toxique.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            let inputQualiteSanitaireAutre = Framework.Form.CheckBox.Register("inputQualiteSanitaireAutre", () => { return true; }, (event, cb) => { autre.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral4.CheckState(); }, "");
            let inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), (val) => { Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreSanitaire")[0].Label = val; if (val.length > 0) { autre.Important = 1; inputQualiteSanitaireAutre.Check(); } else { autre.Important = 0; inputQualiteSanitaireAutre.Uncheck(); }; btnGoToQuestionnaireGeneral4.CheckState(); });
            let inputQualiteSanitairePasSensible = Framework.Form.CheckBox.Register("inputQualiteSanitairePasSensible", () => { return true; }, (event, cb) => {

                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();


            }, "");

            let f = () => {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    inputQualiteSanitairePesticide.Uncheck(); pesticide.Important = 0;
                    inputQualiteSanitaireContaminant.Uncheck(); contaminant.Important = 0;
                    inputQualiteSanitaireToxine.Uncheck(); toxine.Important = 0;
                    inputQualiteSanitaireAdditif.Uncheck(); additif.Important = 0;
                    inputQualiteSanitaireToxique.Uncheck(); toxique.Important = 0;
                    inputQualiteSanitaireAutre.Uncheck(); autre.Important = 0;
                    inputAutre.Set(""); autre.Label = "";
                } else {
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

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireGeneral2();
            });
        });
    }

    private showDivQuestionnaireGeneral4() {
        let self = this;

        this.showDiv("html/divQuestionnaireGeneral4.html", () => {
            let divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            let divRanking = Framework.Form.TextElement.Register("divRanking");
            let dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Nutrition");
            let teneur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Teneur")[0];
            let conformite = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Conformite")[0];
            let nutriScore = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "NutriScore")[0];
            let marqueNutrition = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "MarqueNutrition")[0];
            let regime = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Regime")[0];
            let transit = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Transit")[0];
            let autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreNutrition")[0];

            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }

            let rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, (x) => {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnGoToQuestionnaireGeneral5.CheckState();
            });



            let btnGoToQuestionnaireGeneral5 = Framework.Form.Button.Register("btnGoToQuestionnaireGeneral5", () => {
                return (dimension.NonPrisEnCompte == 1 ||
                    (teneur.Important == 1
                        || conformite.Important == 1
                        || nutriScore.Important == 1
                        || marqueNutrition.Important == 1
                        || regime.Important == 1
                        || transit.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                        && dimension.ScoreGlobal > 0))




            }, () => {
                self.showDivQuestionnaireGeneral5();
            });



            let inputNutritionnelTeneur = Framework.Form.CheckBox.Register("inputNutritionnelTeneur", () => { return true; }, (event, cb) => { teneur.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            let inputNutritionnelConforme = Framework.Form.CheckBox.Register("inputNutritionnelConforme", () => { return true; }, (event, cb) => { conformite.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            let inputNutritionnelIndicateur = Framework.Form.CheckBox.Register("inputNutritionnelIndicateur", () => { return true; }, (event, cb) => { nutriScore.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            let inputNutritionnelIndirect = Framework.Form.CheckBox.Register("inputNutritionnelIndirect", () => { return true; }, (event, cb) => { marqueNutrition.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            let inputNutritionnelRegime = Framework.Form.CheckBox.Register("inputNutritionnelRegime", () => { return true; }, (event, cb) => { regime.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            let inputNutritionnelAutre = Framework.Form.CheckBox.Register("inputNutritionnelAutre", () => { return true; }, (event, cb) => { autre.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            let inputNutritionnelVertu = Framework.Form.CheckBox.Register("inputNutritionnelVertu", () => { return true; }, (event, cb) => { transit.Important = cb.IsChecked == true ? 1 : 0; btnGoToQuestionnaireGeneral5.CheckState(); }, "");
            let inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), (val) => { autre.Label = val; if (val.length > 0) { autre.Important = 1; inputNutritionnelAutre.Check(); } else { autre.Important = 0; inputNutritionnelAutre.Uncheck(); }; btnGoToQuestionnaireGeneral5.CheckState(); });
            let inputNutritionnelPasSensible = Framework.Form.CheckBox.Register("inputNutritionnelPasSensible", () => { return true; }, (event, cb) => {

                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();


            }, "");

            let f = () => {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    inputNutritionnelTeneur.Uncheck(); teneur.Important = 0;
                    inputNutritionnelConforme.Uncheck(); conformite.Important = 0;
                    inputNutritionnelIndicateur.Uncheck(); nutriScore.Important = 0;
                    inputNutritionnelIndirect.Uncheck(); marqueNutrition.Important = 0;
                    inputNutritionnelRegime.Uncheck(); regime.Important = 0;
                    inputNutritionnelAutre.Uncheck(); autre.Important = 0;
                    inputNutritionnelVertu.Uncheck(); transit.Important = 0;
                    inputAutre.Set(""); autre.Label = "";
                } else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }

                btnGoToQuestionnaireGeneral5.CheckState();
            }
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

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireGeneral3();
            });
        });
    }

    private showDivQuestionnaireGeneral5() {
        let self = this;

        this.showDiv("html/divQuestionnaireGeneral5.html", () => {
            let divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            let divRanking = Framework.Form.TextElement.Register("divRanking");
            let dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Environnement");
            let production = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Production")[0];
            let carbone = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Carbone")[0];
            let recyclable = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Recyclable")[0];
            let vrac = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Vrac")[0];
            let saisonnalite = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Saisonnalite")[0];
            let distance = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Distance")[0];
            let durable = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Durable")[0];
            let autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreEnvironnement")[0];

            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }

            let rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, (x) => {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnNext.CheckState();
            });

            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return (dimension.NonPrisEnCompte == 1 ||
                    (production.Important == 1
                        || carbone.Important == 1
                        || recyclable.Important == 1
                        || vrac.Important == 1
                        || saisonnalite.Important == 1
                        || distance.Important == 1
                        || durable.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                        && dimension.ScoreGlobal > 0))



            }, () => {
                self.showDivQuestionnaireGeneral6();
            });

            let input1 = Framework.Form.CheckBox.Register("input1", () => { return true; }, (event, cb) => { production.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input2 = Framework.Form.CheckBox.Register("input2", () => { return true; }, (event, cb) => { carbone.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input3 = Framework.Form.CheckBox.Register("input3", () => { return true; }, (event, cb) => { recyclable.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input4 = Framework.Form.CheckBox.Register("input4", () => { return true; }, (event, cb) => { vrac.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input5 = Framework.Form.CheckBox.Register("input5", () => { return true; }, (event, cb) => { saisonnalite.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input6 = Framework.Form.CheckBox.Register("input6", () => { return true; }, (event, cb) => { distance.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input7 = Framework.Form.CheckBox.Register("input7", () => { return true; }, (event, cb) => { durable.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input8 = Framework.Form.CheckBox.Register("input8", () => { return true; }, (event, cb) => { autre.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), (val) => { autre.Label = val; if (val.length > 0) { autre.Important = 1; input8.Check(); } else { autre.Important = 0; input8.Uncheck(); }; btnNext.CheckState(); });
            let input9 = Framework.Form.CheckBox.Register("input9", () => { return true; }, (event, cb) => {

                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();



            }, "");

            let f = () => {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    input1.Uncheck(); production.Important = 0;
                    input2.Uncheck(); carbone.Important = 0;
                    input3.Uncheck(); recyclable.Important = 0;
                    input4.Uncheck(); vrac.Important = 0;
                    input5.Uncheck(); saisonnalite.Important = 0;
                    input6.Uncheck(); distance.Important = 0;
                    input7.Uncheck(); durable.Important = 0;
                    input8.Uncheck(); autre.Important = 0;
                    inputAutre.Set(""); autre.Label = "";
                } else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }

                btnNext.CheckState();
            }
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

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireGeneral4();
            });
        });
    }

    private showDivQuestionnaireGeneral6() {
        let self = this;

        this.showDiv("html/divQuestionnaireGeneral6.html", () => {
            let divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();
            let divRanking = Framework.Form.TextElement.Register("divRanking");
            let dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "SocioEconomique");
            let economieLocale = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "EconomieLocale")[0];
            let circuitCourt = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "CircuitCourt")[0];
            let conditionsTravail = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "ConditionsTravail")[0];
            let remunerationProducteur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "RemunerationProducteur")[0];
            let lienProducteur = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "LienProducteur")[0];
            let autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreSocioEconomique")[0];

            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }

            let rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, (x) => {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnNext.CheckState();
            });

            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return (dimension.NonPrisEnCompte == 1 ||
                    (economieLocale.Important == 1
                        || circuitCourt.Important == 1
                        || conditionsTravail.Important == 1
                        || remunerationProducteur.Important == 1
                        || lienProducteur.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                        && dimension.ScoreGlobal > 0))


            }, () => {
                self.showDivQuestionnaireGeneral7();
            });

            let input1 = Framework.Form.CheckBox.Register("input1", () => { return true; }, (event, cb) => { economieLocale.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input2 = Framework.Form.CheckBox.Register("input2", () => { return true; }, (event, cb) => { circuitCourt.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input3 = Framework.Form.CheckBox.Register("input3", () => { return true; }, (event, cb) => { conditionsTravail.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input4 = Framework.Form.CheckBox.Register("input4", () => { return true; }, (event, cb) => { remunerationProducteur.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input5 = Framework.Form.CheckBox.Register("input5", () => { return true; }, (event, cb) => { lienProducteur.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input8 = Framework.Form.CheckBox.Register("input8", () => { return true; }, (event, cb) => { autre.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), (val) => { autre.Label = val; if (val.length > 0) { autre.Important = 1; input8.Check(); } else { autre.Important = 0; input8.Uncheck(); }; btnNext.CheckState(); });
            let input9 = Framework.Form.CheckBox.Register("input9", () => { return true; }, (event, cb) => {

                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();




            }, "");

            let f = () => {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    input1.Uncheck(); economieLocale.Important = 0;
                    input2.Uncheck(); circuitCourt.Important = 0;
                    input3.Uncheck(); conditionsTravail.Important = 0;
                    input4.Uncheck(); remunerationProducteur.Important = 0;
                    input5.Uncheck(); lienProducteur.Important = 0;
                    input8.Uncheck(); autre.Important = 0;
                    inputAutre.Set(""); autre.Label = "";
                } else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }

                btnNext.CheckState();
            }
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

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireGeneral5();
            });
        });
    }

    private showDivQuestionnaireGeneral7() {
        let self = this;

        this.showDiv("html/divQuestionnaireGeneral7.html", () => {

            let divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();

            let divRanking = Framework.Form.TextElement.Register("divRanking");
            let dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Conviction");
            let vegetarien = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Vegetarien")[0];
            let bienEtreAnimal = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "BienEtreAnimal")[0];
            let tradition = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Tradition")[0];
            let autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutreConviction")[0];

            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }

            let rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, (x) => {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnNext.CheckState();
            });


            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return (dimension.NonPrisEnCompte == 1 ||
                    (vegetarien.Important == 1
                        || bienEtreAnimal.Important == 1
                        || tradition.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                        && dimension.ScoreGlobal > 0))






            }, () => {
                self.showDivQuestionnaireGeneral8();
            });

            let input1 = Framework.Form.CheckBox.Register("input1", () => { return true; }, (event, cb) => { vegetarien.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input2 = Framework.Form.CheckBox.Register("input2", () => { return true; }, (event, cb) => { bienEtreAnimal.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input3 = Framework.Form.CheckBox.Register("input3", () => { return true; }, (event, cb) => { tradition.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input8 = Framework.Form.CheckBox.Register("input8", () => { return true; }, (event, cb) => { autre.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), (val) => { autre.Label = val; if (val.length > 0) { autre.Important = 1; input8.Check(); } else { autre.Important = 0; input8.Uncheck(); }; btnNext.CheckState(); });
            let input9 = Framework.Form.CheckBox.Register("input9", () => { return true; }, (event, cb) => {

                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();


            }, "");

            let f = () => {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    input1.Uncheck(); vegetarien.Important = 0;
                    input2.Uncheck(); bienEtreAnimal.Important = 0;
                    input3.Uncheck(); tradition.Important = 0;
                    input8.Uncheck(); autre.Important = 0;
                    inputAutre.Set(""); autre.Label = "";
                } else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }

                btnNext.CheckState();
            }
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

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireGeneral6();
            });
        });
    }

    private showDivQuestionnaireGeneral8() {
        let self = this;

        this.showDiv("html/divQuestionnaireGeneral8.html", () => {

            let divCriteres = Framework.Form.TextElement.Register("divCriteres");
            divCriteres.Hide();

            let divRanking = Framework.Form.TextElement.Register("divRanking");
            let dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Pratique");
            let ouvertureFacile = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "OuvertureFacile")[0];
            let longueConservation = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "LongueConservation")[0];
            let conservation = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Conservation")[0];
            let preparationFacile = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "PreparationFacile")[0];
            let technique = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Technique")[0];
            let autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "AutrePratique")[0];

            if (dimension.ScoreGlobal > 0) {
                divCriteres.Show();
            }

            let rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, (x) => {
                dimension.ScoreGlobal = x;
                divCriteres.Show();
                btnNext.CheckState();
            });

            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return (dimension.NonPrisEnCompte == 1 ||
                    (ouvertureFacile.Important == 1
                        || longueConservation.Important == 1
                        || conservation.Important == 1
                        || preparationFacile.Important == 1
                        || technique.Important == 1
                        || (autre.Important == 1 && autre.Label != "")
                        && dimension.ScoreGlobal > 0))

            }, () => {
                self.showDivQuestionnaireGeneral9();
            });

            let input1 = Framework.Form.CheckBox.Register("input1", () => { return true; }, (event, cb) => { ouvertureFacile.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input2 = Framework.Form.CheckBox.Register("input2", () => { return true; }, (event, cb) => { longueConservation.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input3 = Framework.Form.CheckBox.Register("input3", () => { return true; }, (event, cb) => { conservation.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input4 = Framework.Form.CheckBox.Register("input4", () => { return true; }, (event, cb) => { preparationFacile.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input5 = Framework.Form.CheckBox.Register("input5", () => { return true; }, (event, cb) => { technique.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let input8 = Framework.Form.CheckBox.Register("input8", () => { return true; }, (event, cb) => { autre.Important = cb.IsChecked == true ? 1 : 0; btnNext.CheckState(); }, "");
            let inputAutre = Framework.Form.InputText.Register("inputAutre", "", Framework.Form.Validator.NoValidation(), (val) => { autre.Label = val; if (val.length > 0) { autre.Important = 1; input8.Check(); } else { autre.Important = 0; input8.Uncheck(); }; btnNext.CheckState(); });
            let input9 = Framework.Form.CheckBox.Register("input9", () => { return true; }, (event, cb) => {

                dimension.NonPrisEnCompte = cb.IsChecked ? 1 : 0;
                f();


            }, "");

            let f = () => {
                if (dimension.NonPrisEnCompte == 1) {
                    divCriteres.Hide();
                    //divRanking.Hide();
                    rating.Clear();
                    rating.Disable();
                    dimension.ScoreGlobal = 0;
                    input1.Uncheck(); ouvertureFacile.Important = 0;
                    input2.Uncheck(); longueConservation.Important = 0;
                    input3.Uncheck(); conservation.Important = 0;
                    input4.Uncheck(); preparationFacile.Important = 0;
                    input5.Uncheck(); technique.Important = 0;
                    input8.Uncheck(); autre.Important = 0;
                    inputAutre.Set(""); autre.Label = "";
                } else {
                    if (dimension.ScoreGlobal > 0) {
                        divCriteres.Show();
                    }
                    rating.Enable();
                    //divRanking.Show();
                }

                btnNext.CheckState();
            }
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



            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireGeneral7();
            });
        });
    }

    private showDivQuestionnaireGeneral9() {
        let self = this;

        this.showDiv("html/divQuestionnaireGeneral9.html", () => {

            let divCriteres = Framework.Form.TextElement.Register("divCriteres"); /*divCriteres.Hide();*/
            let divRanking = Framework.Form.TextElement.Register("divRanking");
            let dimension = Models.QuestionnaireArbitrage.GetDimension(self.questionnaire, "Autre");
            let autre = Models.QuestionnaireArbitrage.GetSousDimensionsBy(self.questionnaire, "Nom", "Autre")[0];



            let rating = Framework.Rating.Render(divRanking.HtmlElement, "", 1, 5, dimension.ScoreGlobal, (x) => {
                dimension.ScoreGlobal = x;
                //divCriteres.Show();
                btnNext.CheckState();
            });

            if (autre.Label.length > 0) {
                rating.Enable();
            } else {
                rating.Clear();
                rating.Disable();
            }



            let inputAutre = Framework.Form.InputText.Register("inputAutre", autre.Label, Framework.Form.Validator.NoValidation(), (val) => {
                autre.Label = val;
                if (autre.Label.length > 0) {
                    rating.Enable();
                    //divCriteres.Show();
                } else {
                    dimension.ScoreGlobal = 0;
                    rating.Clear();
                    rating.Disable();
                    //divCriteres.Hide();
                }
                btnNext.CheckState();
            });

            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return (autre.Label.length == 0 || dimension.ScoreGlobal > 0);
            }, () => {
                self.showDivQuestionnaireIndividu1();
            });

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireGeneral8();
            });
        });
    }

    private showDivQuestionnaireIndividu1() {
        let self = this;
        this.showDiv("html/divQuestionnaireIndividu1.html", () => {

            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return (self.questionnaire.Genre != undefined
                    && self.questionnaire.Taille >= 80 && self.questionnaire.Taille <= 230
                    && self.questionnaire.Age >= 18 && self.questionnaire.Age <= 130
                    && self.questionnaire.Poids >= 20 && self.questionnaire.Poids <= 300
                    && inputcpValidator(self.questionnaire.CP) == ""
                );
            }, () => {
                self.showDivQuestionnaireIndividu2();
            });

            let input1a = Framework.Form.CheckBox.Register("input1a", () => { return true; }, (event, cb) => { self.questionnaire.Genre = "Homme"; btnNext.CheckState(); }, "");
            let input1b = Framework.Form.CheckBox.Register("input1b", () => { return true; }, (event, cb) => { self.questionnaire.Genre = "Femme"; btnNext.CheckState(); }, "");

            if (self.questionnaire.Genre == "Homme") {
                input1a.Check();
            }
            if (self.questionnaire.Genre == "Femme") {
                input1b.Check();
            }

            let input2Validator = (code: string) => {
                let n = Number(code);
                if (n && n >= 80 && n <= 230) {
                    return "";
                }
                return "La taille doit être comprise entre 80 et 230 cm";
            }
            let input2 = Framework.Form.InputText.Register("input2", "", Framework.Form.Validator.Custom(input2Validator), (val) => { self.questionnaire.Taille = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.Taille != undefined) {
                input2.Set(self.questionnaire.Taille);
            }

            let input3Validator = (code: string) => {
                let n = Number(code);
                if (n && n >= 18 && n <= 130) {
                    return "";
                }
                return "L'âge doit être compris entre 18 et 130 ans.";
            }
            let input3 = Framework.Form.InputText.Register("input3", "", Framework.Form.Validator.Custom(input3Validator), (val) => { self.questionnaire.Age = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.Age != undefined) {
                input3.Set(self.questionnaire.Age);
            }

            let input4Validator = (code: string) => {
                let n = Number(code);
                if (n && n >= 20 && n <= 300) {
                    return "";
                }
                return "Le poids doit être compris entre 20 et 300 kg.";
            }
            let input4 = Framework.Form.InputText.Register("input4", "", Framework.Form.Validator.Custom(input4Validator), (val) => { self.questionnaire.Poids = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.Poids != undefined) {
                input4.Set(self.questionnaire.Poids);
            }

            let inputcpValidator = (code: string) => {
                let regexp = new RegExp('\\d{5}');
                if (regexp.test(code) == true) {
                    return "";
                }
                return "Le code postal n'est pas valide.";
            }
            let inputcp = Framework.Form.InputText.Register("input_cp", "", Framework.Form.Validator.Custom(inputcpValidator), (val) => { self.questionnaire.CP = val; btnNext.CheckState(); });
            if (self.questionnaire.CP != undefined) {
                inputcp.Set(self.questionnaire.CP);
            }


        });
    }

    private showDivQuestionnaireIndividu2() {
        let self = this;
        this.showDiv("html/divQuestionnaireIndividu2.html", () => {


            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return (self.questionnaire.CSP != undefined
                    && self.questionnaire.Diplome != undefined
                );
            }, () => {
                self.showDivQuestionnaireIndividu3();
            });

            let input5a = Framework.Form.CheckBox.Register("input5a", () => { return true; }, (event, cb) => { self.questionnaire.CSP = "Agriculteurs exploitants"; btnNext.CheckState(); }, "");
            let input5b = Framework.Form.CheckBox.Register("input5b", () => { return true; }, (event, cb) => { self.questionnaire.CSP = "Artisans, commerçants et chefs d'entreprise"; btnNext.CheckState(); }, "");
            let input5c = Framework.Form.CheckBox.Register("input5c", () => { return true; }, (event, cb) => { self.questionnaire.CSP = "Cadres et professions intellectuelles supérieures"; btnNext.CheckState(); }, "");
            let input5d = Framework.Form.CheckBox.Register("input5d", () => { return true; }, (event, cb) => { self.questionnaire.CSP = "Professions Intermédiaires"; btnNext.CheckState(); }, "");
            let input5e = Framework.Form.CheckBox.Register("input5e", () => { return true; }, (event, cb) => { self.questionnaire.CSP = "Employés"; btnNext.CheckState(); }, "");
            let input5f = Framework.Form.CheckBox.Register("input5f", () => { return true; }, (event, cb) => { self.questionnaire.CSP = "Ouvriers"; btnNext.CheckState(); }, "");
            let input5g = Framework.Form.CheckBox.Register("input5g", () => { return true; }, (event, cb) => { self.questionnaire.CSP = "Autres personnes sans activité professionnelle"; btnNext.CheckState(); }, "");

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

            let input6a = Framework.Form.CheckBox.Register("input6a", () => { return true; }, (event, cb) => { self.questionnaire.Diplome = "Aucun diplôme, brevet des collèges"; btnNext.CheckState(); }, "");
            let input6b = Framework.Form.CheckBox.Register("input6b", () => { return true; }, (event, cb) => { self.questionnaire.Diplome = "CAP, BEP ou équivalent"; btnNext.CheckState(); }, "");
            let input6c = Framework.Form.CheckBox.Register("input6c", () => { return true; }, (event, cb) => { self.questionnaire.Diplome = "Baccalauréat ou équivalent"; btnNext.CheckState(); }, "");
            let input6d = Framework.Form.CheckBox.Register("input6d", () => { return true; }, (event, cb) => { self.questionnaire.Diplome = "Bac + 2"; btnNext.CheckState(); }, "");
            let input6e = Framework.Form.CheckBox.Register("input6e", () => { return true; }, (event, cb) => { self.questionnaire.Diplome = "Supérieur à Bac + 2"; btnNext.CheckState(); }, "");

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

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireIndividu1();
            });
        });
    }

    private showDivQuestionnaireIndividu3() {
        let self = this;
        this.showDiv("html/divQuestionnaireIndividu3.html", () => {

            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return (
                    self.questionnaire.NbPersonnesMajeures > 0
                    && self.questionnaire.NbPersonnesMineures >= 0
                    && self.questionnaire.MontantAlloueCourses != undefined
                );
            }, () => {
                self.showDivQuestionnaireIndividu4();
            });

            let input7Validator = (code: string) => {
                let n = Number(code);
                if (n && n >= 1 && n <= 10) {
                    return "";
                }
                return "Le nombre de personnes doit être compris entre 1 et 10.";
            }
            let input7 = Framework.Form.InputText.Register("input7", "", Framework.Form.Validator.Custom(input7Validator), (val) => { self.questionnaire.NbPersonnesMajeures = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.NbPersonnesMajeures != undefined) {
                input7.Set(self.questionnaire.NbPersonnesMajeures);
            }

            let input8Validator = (code: string) => {
                if (code == "0") {
                    return "";
                }
                let n = Number(code);
                if (n && n >= 0 && n <= 10) {
                    return "";
                }
                return "Le nombre de personnes doit être compris entre 0 et 10.";
            }
            let input8 = Framework.Form.InputText.Register("input8", "", Framework.Form.Validator.Custom(input8Validator), (val) => { self.questionnaire.NbPersonnesMineures = Number(val); btnNext.CheckState(); });
            if (self.questionnaire.NbPersonnesMineures != undefined) {
                input8.Set(self.questionnaire.NbPersonnesMineures);
            }

            let input9a = Framework.Form.CheckBox.Register("input9a", () => { return true; }, (event, cb) => { self.questionnaire.MontantAlloueCourses = "Moins de 100 € par mois"; btnNext.CheckState(); }, "");
            let input9b = Framework.Form.CheckBox.Register("input9b", () => { return true; }, (event, cb) => { self.questionnaire.MontantAlloueCourses = "100 à 199 € par mois"; btnNext.CheckState(); }, "");
            let input9c = Framework.Form.CheckBox.Register("input9c", () => { return true; }, (event, cb) => { self.questionnaire.MontantAlloueCourses = "200 à 299 € par mois"; btnNext.CheckState(); }, "");
            let input9d = Framework.Form.CheckBox.Register("input9d", () => { return true; }, (event, cb) => { self.questionnaire.MontantAlloueCourses = "300 à 399 € par mois"; btnNext.CheckState(); }, "");
            let input9e = Framework.Form.CheckBox.Register("input9e", () => { return true; }, (event, cb) => { self.questionnaire.MontantAlloueCourses = "400 à 500 € par mois"; btnNext.CheckState(); }, "");
            let input9f = Framework.Form.CheckBox.Register("input9f", () => { return true; }, (event, cb) => { self.questionnaire.MontantAlloueCourses = "Plus de 500 € par mois"; btnNext.CheckState(); }, "");
            let input9g = Framework.Form.CheckBox.Register("input9g", () => { return true; }, (event, cb) => { self.questionnaire.MontantAlloueCourses = "Je ne sais pas"; btnNext.CheckState(); }, "");

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

            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireIndividu2();
            });
        });
    }

    private showDivQuestionnaireIndividu4() {
        let self = this;
        this.showDiv("html/divQuestionnaireIndividu4.html", () => {

            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return (
                    (self.questionnaire.RegimeParticulier == "Non" || (self.questionnaire.RegimeParticulier == "Oui" && self.questionnaire.DetailRegimeParticulier != undefined))
                    && self.questionnaire.UtilisationApplications != undefined
                );
            }, () => {
                self.showDivQuestionnaireIndividu5();
            });

            let input10a = Framework.Form.CheckBox.Register("input10a", () => { return true; }, (event, cb) => { self.questionnaire.RegimeParticulier = "Non"; btnNext.CheckState(); }, "");
            let input10b = Framework.Form.CheckBox.Register("input10b", () => { return true; }, (event, cb) => { self.questionnaire.RegimeParticulier = "Oui"; btnNext.CheckState(); }, "");
            if (self.questionnaire.RegimeParticulier == "Non") {
                input10a.Check();
            }
            if (self.questionnaire.RegimeParticulier == "Oui") {
                input10b.Check();
            }

            let input11 = Framework.Form.InputText.Register("input11", "", Framework.Form.Validator.MinLength(5), (val) => { self.questionnaire.DetailRegimeParticulier = val; btnNext.CheckState(); });
            if (self.questionnaire.DetailRegimeParticulier != undefined) {
                input11.Set(self.questionnaire.DetailRegimeParticulier);
            }

            let input12a = Framework.Form.CheckBox.Register("input12a", () => { return true; }, (event, cb) => { self.questionnaire.UtilisationApplications = "Jamais"; btnNext.CheckState(); }, "");
            let input12b = Framework.Form.CheckBox.Register("input12b", () => { return true; }, (event, cb) => { self.questionnaire.UtilisationApplications = "Parfois"; btnNext.CheckState(); }, "");
            let input12c = Framework.Form.CheckBox.Register("input12c", () => { return true; }, (event, cb) => { self.questionnaire.UtilisationApplications = "Souvent"; btnNext.CheckState(); }, "");
            let input12d = Framework.Form.CheckBox.Register("input12d", () => { return true; }, (event, cb) => { self.questionnaire.UtilisationApplications = "Toujours"; btnNext.CheckState(); }, "");
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


            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireIndividu3();
            });
        });
    }

    private showDivQuestionnaireIndividu5() {
        let self = this;
        this.showDiv("html/divQuestionnaireIndividu5.html", () => {

            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return self.questionnaire.QuantiteInfo != undefined && self.questionnaire.QualiteInfo != undefined && self.questionnaire.ConfianceInfo != undefined;
            }, () => {
                self.showDivQuestionnaireIndividu6();
            });

            let input1a = Framework.Form.CheckBox.Register("input1a", () => { return true; }, (event, cb) => { self.questionnaire.QuantiteInfo = "Pas assez d'information"; btnNext.CheckState(); }, "");
            let input1b = Framework.Form.CheckBox.Register("input1b", () => { return true; }, (event, cb) => { self.questionnaire.QuantiteInfo = "Suffisamment d'information"; btnNext.CheckState(); }, "");
            let input1c = Framework.Form.CheckBox.Register("input1c", () => { return true; }, (event, cb) => { self.questionnaire.QuantiteInfo = "Trop d'information"; btnNext.CheckState(); }, "");
            if (self.questionnaire.QuantiteInfo == "Pas assez d'information") {
                input1a.Check();
            }
            if (self.questionnaire.QuantiteInfo == "Suffisamment d'information") {
                input1b.Check();
            }
            if (self.questionnaire.QuantiteInfo == "Trop d'information") {
                input1c.Check();
            }

            let input2a = Framework.Form.CheckBox.Register("input2a", () => { return true; }, (event, cb) => { self.questionnaire.QualiteInfo = "Ne correspond pas aux attentes"; btnNext.CheckState(); }, "");
            let input2b = Framework.Form.CheckBox.Register("input2b", () => { return true; }, (event, cb) => { self.questionnaire.QualiteInfo = "Correspond aux attentes"; btnNext.CheckState(); }, "");
            if (self.questionnaire.QualiteInfo == "Correspond aux attentes") {
                input2a.Check();
            }
            if (self.questionnaire.QualiteInfo == "Ne correspond pas aux attentes") {
                input2b.Check();
            }

            let input3a = Framework.Form.CheckBox.Register("input3a", () => { return true; }, (event, cb) => { self.questionnaire.ConfianceInfo = "Oui"; btnNext.CheckState(); }, "");
            let input3b = Framework.Form.CheckBox.Register("input3b", () => { return true; }, (event, cb) => { self.questionnaire.ConfianceInfo = "Non"; btnNext.CheckState(); }, "");
            let input3c = Framework.Form.CheckBox.Register("input3c", () => { return true; }, (event, cb) => { self.questionnaire.ConfianceInfo = "Dépend des sources"; btnNext.CheckState(); }, "");
            if (self.questionnaire.ConfianceInfo == "Oui") {
                input3a.Check();
            }
            if (self.questionnaire.ConfianceInfo == "Non") {
                input3b.Check();
            }
            if (self.questionnaire.ConfianceInfo == "Dépend des sources") {
                input3c.Check();
            }

            let inputText = Framework.Form.InputText.Register("inputText", "", Framework.Form.Validator.NoValidation(), (val) => { self.questionnaire.RemarquesInfo = val; });
            if (self.questionnaire.RemarquesInfo != undefined) {
                inputText.Set(self.questionnaire.RemarquesInfo);
            }


            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireIndividu4();
            });
        });
    }

    private showDivQuestionnaireIndividu6() {
        let self = this;
        this.showDiv("html/divQuestionnaireIndividu6.html", () => {

            let btnNext = Framework.Form.Button.Register("btnNext", () => {
                return true;
            }, () => {
                self.showDivFin();
            });

            let input13 = Framework.Form.InputText.Register("input13", "", Framework.Form.Validator.NoValidation(), (val) => { self.questionnaire.Remarques = val; });
            if (self.questionnaire.Remarques != undefined) {
                input13.Set(self.questionnaire.Remarques);
            }


            let btnPrec = Framework.Form.Button.Register("btnPrec", () => {
                return true;
            }, () => {
                self.showDivQuestionnaireIndividu5();
            });
        });
    }

    private showDivFin() {
        let self = this;
        this.showDiv("html/divFin.html", () => { });
    }


}

