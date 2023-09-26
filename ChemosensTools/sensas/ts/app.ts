class SensasApp extends Framework.App {

    private static GetRequirements(): Framework.ModuleRequirements {
        let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/sensas';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        } else {
            requirements.AppUrl = 'https://www.chemosenstools.com/sensas';
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
        super(SensasApp.GetRequirements(), isInTest);
    }

    protected onError(error: string) {
        super.onError(error);
    }

    private questionnaire: Models.Questionnaire;
    private listButtons: Framework.Form.Button[] = [];

    protected start(fullScreen: boolean = false) {
        super.start(fullScreen);

        let self = this;

        let id = "";
        let url = window.location.href;
        if (url.indexOf('?id=') > -1) {
            var hashes = url.slice(url.indexOf('?id=') + 4).split('&');
            if (hashes.length > 0) {
                id = hashes[0];
            }

            self.CallWCF('LoginSensas', { code: id }, () => {
                Framework.Progress.Show("Vérification du code...");
            }, (res) => {
                Framework.Progress.Hide();
                console.log(res.ErrorMessage);
                if (res.Status == 'success') {
                    let json: string = res.Result;
                    if (json == "") {
                        // 1ere connexion                    
                        self.questionnaire = new Models.Questionnaire(id);
                    } else {
                        // Récupération de l'existant
                        self.questionnaire = JSON.parse(json);
                    }

                    self.saveQuestionnaire(() => {
                        self.checkQuestionnaire();
                    });

                } else {
                    self.showDivErreur();
                }
            });


        } else {
            self.showDivErreur();
        }

    }

    private checkQuestionnaire() {
        let page = this.questionnaire.Page;
        switch (page) {
            case "Consentement":
                this.showDivConsentement();
                break;
            case "Instruction1":
                this.showDivInstruction1();
                break;
            case "Instruction2":
                this.showDivInstruction2();
                break;
            //case "Instruction3":
            //    this.showDivInstruction3();
            //    break;
            case "Instruction4":
                this.showDivInstruction4();
                break;
            case "Instruction5":
                this.showDivInstruction5();
                break;
            case "Achat1":
                this.showDivAchat1();
                break;
            case "Achat2":
                this.showDivAchat2();
                break;
            case "RecapAchat":
                this.showDivRecapAchat();
                break;
            case "CATA":
                this.showDivCATA();
                break;
            case "Fin":
                this.showDivFin();
                break;
        }

    }

    private saveQuestionnaire(onSuccess: () => void = () => { }) {
        let self = this;

        self.CallWCF('SaveQuestionnaireSensas', { code: self.questionnaire.CodeSujet, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, () => {
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

    //private showDivAuthentification(id: string = "") {

    //    let self = this;

    //    this.showDiv("html/divAuthentification.html", () => {

    //        let pIdError = Framework.Form.TextElement.Register("pIdError");
    //        pIdError.Hide();

    //        let inputId = Framework.Form.InputText.Register("inputId", "", Framework.Form.Validator.MinLength(4, "Longueur minimale : 4 caractères."), (text: string) => {
    //            btnCheckId.CheckState();
    //        });

    //        let btnCheckId = Framework.Form.Button.Register("btnCheckId", () => { return inputId.Value.length >= 4; }, () => {
    //            self.CallWCF('LoginSensas', { code: inputId.Value }, () => {
    //                Framework.Progress.Show("Vérification du code...");
    //            }, (res) => {
    //                Framework.Progress.Hide();
    //                console.log(res.ErrorMessage);
    //                if (res.Status == 'success') {
    //                    let json: string = res.Result;
    //                    if (json == "") {
    //                        // 1ere connexion
    //                        self.questionnaire = new Models.Questionnaire();
    //                        self.questionnaire.CodeSujet = inputId.Value;
    //                    } else {
    //                        // Récupération de l'existant
    //                        self.questionnaire = JSON.parse(json);
    //                    }

    //                    self.saveQuestionnaire("divAuthentification", () => {
    //                        self.checkQuestionnaire();
    //                    });

    //                } else {
    //                    pIdError.Show();
    //                }
    //            });
    //        });

    //        if (id != "") {

    //            self.CallWCF('LoginSensasURL', { id: id }, () => {
    //                Framework.Progress.Show("Vérification du code...");
    //            }, (res) => {
    //                Framework.Progress.Hide();
    //                console.log(res.ErrorMessage);
    //                if (res.Status == 'success') {
    //                    let json: string = res.Result;

    //                    // Récupération de l'existant
    //                    self.questionnaire = JSON.parse(json);
    //                    self.questionnaire.CodeSujet = id;


    //                    self.saveQuestionnaire("divAuthentification", () => {
    //                        self.checkQuestionnaire();
    //                    });

    //                } else {
    //                    pIdError.Show();
    //                }
    //            });
    //        }

    //    });


    //}

    private showDivConsentement() {
        let self = this;
        this.showDiv("html/divConsentement.html", "Consentement", () => {

            let btnDecline = Framework.Form.Button.Register("btnDecline", () => { return true; }, () => {
                let mw = Framework.Modal.Confirm("Confirmation requise", "Si vous cliquez sur \"Confirmer\", votre participation ne sera pas prise en compte et vous ne serez pas indemnisé(e). Confirmez-vous votre choix ?", () => {
                    self.questionnaire.ConsentementAccepte = false;
                    self.showDivFin2();
                }, () => {
                    mw.Close();
                }, "Confirmer", "Annuler")
            });

            let btnAccept = Framework.Form.Button.Register("btnAccept", () => { return true; }, () => {
                self.questionnaire.ConsentementAccepte = true;
                self.showDivInstruction1();
            });
        });

    }

    private showDivInstruction1() {
        let self = this;
        this.showDiv("html/divInstruction1.html", "Instruction1", () => {

            if (self.questionnaire.PrefScore == false) {
                document.getElementById("liPrefScore").classList.add("hidden");
            }

        }, "btnSuivant", () => { self.showDivInstruction2(); }, () => { return true; }, 20);

    }

    private showDivInstruction2() {
        let self = this;
        this.showDiv("html/divInstruction2.html", "Instruction2", () => {
        }, "btnSuivant", () => {
            if (self.questionnaire.PrefScore == true) {
                self.showDivInstruction4();
            } else {
                self.showDivInstruction5();
            }
        }, () => { return true; }, 20);

    }

    //private showDivInstruction3() {
    //    let self = this;
    //    this.showDiv("html/divInstruction3.html", "Instruction3", () => {
    //    }, "btnSuivant", () => {
    //        if (self.questionnaire.PrefScore == true) {
    //            self.showDivInstruction4();
    //        } else {
    //            self.showDivInstruction5();
    //        }
    //    }, () => { return true; }, 10);

    //}

    private showDivInstruction4() {
        let self = this;
        this.showDiv("html/divInstruction4.html", "Instruction4", () => {
        }, "btnSuivant", () => { self.showDivInstruction5(); }, () => { return true; }, 20);

    }

    private showDivInstruction5() {
        let self = this;
        this.showDiv("html/divInstruction5.html", "Instruction5", () => {
        }, "btnSuivant", () => { self.showDivAchat1(); }, () => { return true; }, 20);

    }

    private createVignette(aliment: Models.Aliment, onChange: () => void): HTMLDivElement {

        let self = this;

        let div1 = document.createElement("div");
        div1.style.border = "1px solid"; div1.style.paddingBottom = "5px";
        div1.classList.add("col-3");
        let div2 = document.createElement("div");
        div2.classList.add("product-grid");

        div1.appendChild(div2);
        //let h3 = document.createElement("h3");
        //h3.innerText = aliment.Code;
        //div2.appendChild(h3);
        let div3 = document.createElement("div");
        div3.classList.add("product-image");
        div2.appendChild(div3);
        let img = document.createElement("img");
        img.src = "img/" + aliment.Code + ".png";
        img.style.marginBottom = "10px";
        div3.appendChild(img);


        let div4 = document.createElement("div");
        div4.classList.add("product-content");
        div4.classList.add("text-center");
        div2.appendChild(div4);

        let tble0 = document.createElement("table"); tble0.style.margin = "0 auto"; tble0.width = "100%"; tble0.style.marginBottom = "10px";
        let tr0 = document.createElement("tr"); tble0.appendChild(tr0);

        let td02 = document.createElement("td"); tr0.appendChild(td02); td02.align = "left"; td02.style.width = "140px";
        let img2 = document.createElement("img");
        if (aliment.PrefScore == "O" && this.questionnaire.PrefScore == true) {
            img2.src = "img/prefscore.png";
            //img1.style.width = "30%";
            td02.appendChild(img2);
        }

        let td01 = document.createElement("td"); tr0.appendChild(td01); td01.align = "left";
        let img1 = document.createElement("img");
        if (aliment.NutriScore == "B") {
            img1.src = "img/nutriscoreB.png";
        }
        if (aliment.NutriScore == "C") {
            img1.src = "img/nutriscoreC.png";
        }

        //img1.style.width = "30%";
        td01.appendChild(img1);

        div4.appendChild(tble0);


        //let p = document.createElement("p");
        //p.classList.add("text-center");
        //p.style.fontSize = "1.1em";

        //p.innerHTML = "Nutrition : " + aliment.NutriScore + "/5";        
        //p.innerHTML += "<br/>Environnement : " + aliment.ScoreEnvironnement + "/5";
        //if (self.questionnaire.PrefScore == true) {       
        //    p.innerHTML += "<br/>Goût : " + aliment.PrefScore + "/5";
        //}
        //p.style.border = "1px solid gray";       

        let tble = document.createElement("table"); tble.style.margin = "0 auto"; tble.width = "100%";

        let tr = document.createElement("tr"); tble.appendChild(tr);
        let td1 = document.createElement("td"); tr.appendChild(td1); td1.align = "left"; td1.innerText = aliment.PrixUnitaire.toFixed(2).toString() + " €"; td1.style.fontSize = "1.3em"; td1.style.paddingLeft = "20px";
        let td2 = document.createElement("td"); tr.appendChild(td2); td2.align = "right"; td2.style.paddingRight = "20px";
        //div4.appendChild(p);


        let span = document.createElement("span"); span.style.width = "50px"; span.style.textAlign = "center"; span.style.verticalAlign = "middle"; span.innerText = aliment.Quantite.toString(); /*ttd8a.appendChild(span); ttd8a.align = "center";*/span.style.margin = "10px"; span.style.fontSize = "1.3em";

        let btn1 = Framework.Form.Button.Create(() => {
            let aliments = self.questionnaire.Aliments.filter(x => { return x.Type == aliment.Type });
            let nb = 0;
            aliments.forEach(p => {
                nb += p.Quantite;
            });
            return nb < 2;
        }, () => {
            aliment.Quantite += 1;
            span.innerText = aliment.Quantite.toString();
            onChange();
        }, "<span class='fa fa-plus fa-lg'>", ["btn", "btn-primary", "btnCart"]); td2.appendChild(btn1.HtmlElement);
        td2.appendChild(span)
        //let span2 = document.createElement("span"); span2.innerHTML = "&nbsp;"; ttd11.appendChild(span2);
        let btn2 = Framework.Form.Button.Create(() => {
            return aliment.Quantite > 0;
        }, () => {
            aliment.Quantite -= 1;
            span.innerText = aliment.Quantite.toString();
            onChange();
        }, "<span class='fa fa-minus fa-lg'>", ["btn", "btn-primary", "btnCart"]); td2.appendChild(btn2.HtmlElement);


        div4.appendChild(tble);

        self.listButtons.push(btn1);
        self.listButtons.push(btn2);

        return div1;
    }

    private setDivAchat(type: string, onNext: () => void) {

        let self = this;

        let row1 = document.getElementById("row1");
        let row2 = document.getElementById("row2");
        let list1: Models.Aliment[] = self.questionnaire.Aliments.filter(x => { return x.Type == type && x.Position < 5 });
        let list2: Models.Aliment[] = self.questionnaire.Aliments.filter(x => { return x.Type == type && x.Position > 4 });

        let onChange: () => void = () => {

            let sum0 = 0;
            self.questionnaire.Aliments.filter(x => { return x.Type == type }).forEach(x => sum0 += x.Quantite * x.PrixUnitaire);
            pTotal.Set("Total (" + type + "s) : " + sum0.toFixed(2) + "€");
            let sum = 0;
            self.questionnaire.Aliments.forEach(a => { sum += a.Quantite * a.PrixUnitaire; });
            let credit = 20 - sum;
            pCredit.Set("Crédit : " + credit.toFixed(2) + "€");
            self.listButtons.forEach(b => { b.CheckState(); });

            btnSuivant.CheckState();

        };

        self.listButtons = [];
        list1.forEach(p => {
            row1.appendChild(self.createVignette(p, onChange));
        });
        list2.forEach(p => {
            row2.appendChild(self.createVignette(p, onChange));
        });

        let pTotal = Framework.Form.TextElement.Register("pTotal");
        let pCredit = Framework.Form.TextElement.Register("pCredit");

        let btnSuivant = Framework.Form.Button.Register("btnSuivant", () => {
            let aliments = self.questionnaire.Aliments.filter(x => { return x.Type == type });
            let nb = 0;
            aliments.forEach(p => {
                nb += p.Quantite;
            });
            return nb == 2;
        }, () => {
            onNext();

        });

        onChange();

    }

    private showDivAchat1() {
        let self = this;
        this.showDiv("html/divAchat.html", "Achat1", () => {
            self.setDivAchat(self.questionnaire.Type1, () => { self.showDivAchat2(); });
        });

    }

    private showDivAchat2() {
        let self = this;
        this.showDiv("html/divAchat.html", "Achat2", () => {
            self.setDivAchat(self.questionnaire.Type2, () => { self.showDivRecapAchat(); });
        });

    }

    private showDivRecapAchat() {
        let self = this;
        this.showDiv("html/divRecapAchat.html", "RecapAchat", () => {

            let div = Framework.Form.TextElement.Register("content");
            div.HtmlElement.classList.add("text-center");

            let table = document.createElement("table"); table.style.fontSize = "1.2em"; table.classList.add("table"); table.classList.add("table-bordered"); table.classList.add("mt-5");
            let tr1 = document.createElement("tr"); table.appendChild(tr1);
            let td1 = document.createElement("td"); tr1.appendChild(td1); td1.innerText = "Type";
            let td2 = document.createElement("td"); tr1.appendChild(td2); td2.innerText = "Code";
            let td3 = document.createElement("td"); tr1.appendChild(td3); td3.innerText = "Quantité";
            let td4 = document.createElement("td"); tr1.appendChild(td4); td4.innerText = "Prix unitaire (€)";
            let td5 = document.createElement("td"); tr1.appendChild(td5); td5.innerText = "Prix total (€)";

            let aliments = self.questionnaire.Aliments.filter(x => { return x.Quantite > 0 });
            let sum = 0;
            let index = 1;
            aliments.forEach(a => {
                let tr1 = document.createElement("tr"); table.appendChild(tr1);
                let td1 = document.createElement("td"); tr1.appendChild(td1); td1.innerText = a.Type;
                let td2 = document.createElement("td"); tr1.appendChild(td2); td2.innerText = "Choix " + index; index++;

                let img = document.createElement("img"); img.src = "img/" + a.Code + ".png"; img.style.height = "200px"; img.style.width = "auto";
                Framework.Popup.Create(td2, img, "top", "hover");

                let td3 = document.createElement("td"); tr1.appendChild(td3); td3.innerText = a.Quantite.toString();
                let td4 = document.createElement("td"); tr1.appendChild(td4); td4.innerText = a.PrixUnitaire.toFixed(2);
                let td5 = document.createElement("td"); tr1.appendChild(td5); td5.innerText = (a.PrixUnitaire * a.Quantite).toFixed(2);
                sum += (a.PrixUnitaire * a.Quantite);
            });

            let tr2 = document.createElement("tr"); table.appendChild(tr2);
            let td21 = document.createElement("td"); tr2.appendChild(td21); td21.align = "right"; td21.colSpan = 4; td21.innerHTML = "Total";
            let td25 = document.createElement("td"); tr2.appendChild(td25); td25.innerText = sum.toFixed(2);

            let tr3 = document.createElement("tr"); table.appendChild(tr3);
            let td31 = document.createElement("td"); tr3.appendChild(td31); td31.align = "right"; td31.colSpan = 4; td31.innerHTML = "Crédit";
            let td35 = document.createElement("td"); tr3.appendChild(td35); td35.innerText = (20 - sum).toFixed(2);

            div.HtmlElement.appendChild(table);


        }, "btnSuivant", () => {
            self.showDivCATA();
        }, () => { return true; });

    }

    private showDivCATA() {
        let self = this;
        this.showDiv("html/divCATA.html", "CATA", () => {

            let div = document.getElementById("content");

            let table = document.createElement("table"); table.style.fontSize = "1.2em"; table.classList.add("table"); table.classList.add("table-bordered"); table.classList.add("mt-5"); table.width = "auto !important";
            let tr1 = document.createElement("tr"); table.appendChild(tr1);
            let td1 = document.createElement("td"); tr1.appendChild(td1); td1.innerText = "";

            let aliments = self.questionnaire.Aliments.filter(x => { return x.Quantite > 0 });
            let index = 1;
            aliments.forEach(a => {
                let td = document.createElement("td"); tr1.appendChild(td); td.innerText = "Choix " + index; index++;
                let img = document.createElement("img"); img.src = "img/" + a.Code + ".png"; img.style.height = "200px"; img.style.width = "auto";
                Framework.Popup.Create(td, img, "top", "hover");
            });

            let raisons: Framework.KeyValuePair[] = []
            raisons.push(new Framework.KeyValuePair("RaisonPrix", "Pour son prix"));
            raisons.push(new Framework.KeyValuePair("RaisonNutriscore", "Pour son Nutri-score"));
            if (self.questionnaire.PrefScore == true) {
                raisons.push(new Framework.KeyValuePair("RaisonPrefscore", "Pour son label \"Bon goût garanti\""));
            }
            raisons.push(new Framework.KeyValuePair("RaisonMarque", "Pour sa marque ou son packaging"));
            raisons.push(new Framework.KeyValuePair("RaisonNouveaute", "Pour tester un nouveau produit"));
            raisons.push(new Framework.KeyValuePair("RaisonDejaGoute", "Par ce que j'ai déjà goûté ce produit et que je l'apprécie"));
            raisons.push(new Framework.KeyValuePair("RaisonAutre", "Pour une autre raison"));

            raisons.forEach(r => {
                let tr1 = document.createElement("tr"); table.appendChild(tr1);
                let td1 = document.createElement("td"); tr1.appendChild(td1); td1.innerText = r.Value; td1.align = "left";
                aliments.forEach(a => {
                    let td = document.createElement("td"); tr1.appendChild(td); td.align = "center";
                    let cb = document.createElement("input");
                    cb.type = "checkbox";
                    cb.name = a.Code;
                    cb.onclick = (b) => {
                        let res = Number(b.target["checked"]);
                        self.questionnaire.Aliments.filter(x => { return x.Code == b.target["name"] })[0][r.Key] = res;
                        if (r.Key == "RaisonAutre" && res == 1) {
                            let text = Framework.Form.InputText.Create("", (txt, send) => {
                                self.questionnaire.Aliments.filter(x => { return x.Code == b.target["name"] })[0]["RaisonAutreDetail"] = txt
                                btn.CheckState();
                            })
                            text.HtmlElement.style.width = "100%";
                            let btn = Framework.Form.Button.Create(() => { return text.Value != "" }, () => { mw.Close() }, "OK", ["btn", "btn-primary"]);
                            let mw = new Framework.Modal.CustomModal(text.HtmlElement, "Veuillez préciser la raison de votre choix", [btn]);
                            mw.show();
                        }
                        btnSuivant.CheckState();
                    };
                    td.appendChild(cb)
                })
            });

            div.appendChild(table);

            let btnSuivant = Framework.Form.Button.Register("btnSuivant", () => {
                let aliments = self.questionnaire.Aliments.filter(x => { return x.Quantite > 0 });
                let valid = true;
                aliments.forEach(p => {
                    if (p.RaisonAutre == 1 || p.RaisonDejaGoute == 1 || p.RaisonEnvironnement == 1 || p.RaisonMarque == 1 || p.RaisonNutriscore == 1 || p.RaisonPrefscore == 1 || p.RaisonPrix == 1 || p.RaisonNouveaute == 1) {
                    } else {
                        valid = false;
                    }
                });
                return valid;
            }, () => {
                self.showDivFin();
            });

        });

    }

    private showDiv(htmlPath: string, page: string, onLoaded: () => void, nextButtonId: string = undefined, nextButtonAction: () => void = undefined, nextButtonEnableFunction: () => boolean = () => { return true }, nextButtonTime: number = undefined) {

        let self = this;

        document.body.innerHTML = "";
        let path = SensasApp.GetRequirements().AppUrl + "/" + htmlPath;
        Framework.BaseView.Load(path, "body", (div) => {

            $('.fa-info-circle').tooltipster({ trigger: 'click' });

            let previousAccess = false;
            if (self.questionnaire) {

                self.questionnaire.Page = page;

                self.saveQuestionnaire(() => {

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

    private showDivFin() {
        let self = this;
        this.showDiv("html/divFin.html", "Fin", () => { });
    }

    private showDivFin2() {
        let self = this;
        this.showDiv("html/divFin2.html", "NonConsentement", () => { });
    }

    private showDivErreur() {
        let self = this;
        this.showDiv("html/divErreur.html", "Erreur", () => { });
    }


}

