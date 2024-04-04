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
var SensasApp = /** @class */ (function (_super) {
    __extends(SensasApp, _super);
    function SensasApp(isInTest) {
        if (isInTest === void 0) { isInTest = false; }
        var _this = _super.call(this, SensasApp.GetRequirements(), isInTest) || this;
        _this.listButtons = [];
        return _this;
    }
    SensasApp.GetRequirements = function () {
        var requirements = new Framework.ModuleRequirements();
        if (window.location.hostname.indexOf("localhost") > -1) {
            requirements.AppUrl = 'http://localhost:44301/sensas';
            requirements.FrameworkUrl = 'http://localhost:44301/framework';
            requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
        }
        else {
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
        requirements.Required = []; //TODO;
        //requirements.Extensions = ["Rating", "Slider"];
        return requirements;
    };
    SensasApp.prototype.onError = function (error) {
        _super.prototype.onError.call(this, error);
    };
    SensasApp.prototype.start = function (fullScreen) {
        if (fullScreen === void 0) { fullScreen = false; }
        _super.prototype.start.call(this, fullScreen);
        var self = this;
        var id = "";
        var url = window.location.href;
        if (url.indexOf('?id=') > -1) {
            var hashes = url.slice(url.indexOf('?id=') + 4).split('&');
            if (hashes.length > 0) {
                id = hashes[0];
            }
            self.CallWCF('LoginSensas', { code: id }, function () {
                Framework.Progress.Show("Vérification du code...");
            }, function (res) {
                Framework.Progress.Hide();
                console.log(res.ErrorMessage);
                if (res.Status == 'success') {
                    var json = res.Result;
                    if (json == "") {
                        // 1ere connexion                    
                        self.questionnaire = new Models.Questionnaire(id);
                    }
                    else {
                        // Récupération de l'existant
                        self.questionnaire = JSON.parse(json);
                    }
                    self.saveQuestionnaire(function () {
                        self.checkQuestionnaire();
                    });
                }
                else {
                    self.showDivErreur();
                }
            });
        }
        else {
            self.showDivErreur();
        }
    };
    SensasApp.prototype.checkQuestionnaire = function () {
        var page = this.questionnaire.Page;
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
    };
    SensasApp.prototype.saveQuestionnaire = function (onSuccess) {
        if (onSuccess === void 0) { onSuccess = function () { }; }
        var self = this;
        self.CallWCF('SaveQuestionnaireSensas', { code: self.questionnaire.CodeSujet, jsonQuestionnaire: JSON.stringify(self.questionnaire) }, function () {
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
    SensasApp.prototype.showDivConsentement = function () {
        var self = this;
        this.showDiv("html/divConsentement.html", "Consentement", function () {
            var btnDecline = Framework.Form.Button.Register("btnDecline", function () { return true; }, function () {
                var mw = Framework.Modal.Confirm("Confirmation requise", "Si vous cliquez sur \"Confirmer\", votre participation ne sera pas prise en compte et vous ne serez pas indemnisé(e). Confirmez-vous votre choix ?", function () {
                    self.questionnaire.ConsentementAccepte = false;
                    self.showDivFin2();
                }, function () {
                    mw.Close();
                }, "Confirmer", "Annuler");
            });
            var btnAccept = Framework.Form.Button.Register("btnAccept", function () { return true; }, function () {
                self.questionnaire.ConsentementAccepte = true;
                self.showDivInstruction1();
            });
        });
    };
    SensasApp.prototype.showDivInstruction1 = function () {
        var self = this;
        this.showDiv("html/divInstruction1.html", "Instruction1", function () {
            if (self.questionnaire.PrefScore == false) {
                document.getElementById("liPrefScore").classList.add("hidden");
            }
        }, "btnSuivant", function () { self.showDivInstruction2(); }, function () { return true; }, 20);
    };
    SensasApp.prototype.showDivInstruction2 = function () {
        var self = this;
        this.showDiv("html/divInstruction2.html", "Instruction2", function () {
        }, "btnSuivant", function () {
            if (self.questionnaire.PrefScore == true) {
                self.showDivInstruction4();
            }
            else {
                self.showDivInstruction5();
            }
        }, function () { return true; }, 20);
    };
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
    SensasApp.prototype.showDivInstruction4 = function () {
        var self = this;
        this.showDiv("html/divInstruction4.html", "Instruction4", function () {
        }, "btnSuivant", function () { self.showDivInstruction5(); }, function () { return true; }, 20);
    };
    SensasApp.prototype.showDivInstruction5 = function () {
        var self = this;
        this.showDiv("html/divInstruction5.html", "Instruction5", function () {
        }, "btnSuivant", function () { self.showDivAchat1(); }, function () { return true; }, 20);
    };
    SensasApp.prototype.createVignette = function (aliment, onChange) {
        var self = this;
        var div1 = document.createElement("div");
        div1.style.border = "1px solid";
        div1.style.paddingBottom = "5px";
        div1.classList.add("col-3");
        var div2 = document.createElement("div");
        div2.classList.add("product-grid");
        div1.appendChild(div2);
        //let h3 = document.createElement("h3");
        //h3.innerText = aliment.Code;
        //div2.appendChild(h3);
        var div3 = document.createElement("div");
        div3.classList.add("product-image");
        div2.appendChild(div3);
        var img = document.createElement("img");
        img.src = "img/" + aliment.Code + ".png";
        img.style.marginBottom = "10px";
        div3.appendChild(img);
        var div4 = document.createElement("div");
        div4.classList.add("product-content");
        div4.classList.add("text-center");
        div2.appendChild(div4);
        var tble0 = document.createElement("table");
        tble0.style.margin = "0 auto";
        tble0.width = "100%";
        tble0.style.marginBottom = "10px";
        var tr0 = document.createElement("tr");
        tble0.appendChild(tr0);
        var td02 = document.createElement("td");
        tr0.appendChild(td02);
        td02.align = "left";
        td02.style.width = "140px";
        var img2 = document.createElement("img");
        if (aliment.PrefScore == "O" && this.questionnaire.PrefScore == true) {
            img2.src = "img/prefscore.png";
            //img1.style.width = "30%";
            td02.appendChild(img2);
        }
        var td01 = document.createElement("td");
        tr0.appendChild(td01);
        td01.align = "left";
        var img1 = document.createElement("img");
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
        var tble = document.createElement("table");
        tble.style.margin = "0 auto";
        tble.width = "100%";
        var tr = document.createElement("tr");
        tble.appendChild(tr);
        var td1 = document.createElement("td");
        tr.appendChild(td1);
        td1.align = "left";
        td1.innerText = aliment.PrixUnitaire.toFixed(2).toString() + " €";
        td1.style.fontSize = "1.3em";
        td1.style.paddingLeft = "20px";
        var td2 = document.createElement("td");
        tr.appendChild(td2);
        td2.align = "right";
        td2.style.paddingRight = "20px";
        //div4.appendChild(p);
        var span = document.createElement("span");
        span.style.width = "50px";
        span.style.textAlign = "center";
        span.style.verticalAlign = "middle";
        span.innerText = aliment.Quantite.toString(); /*ttd8a.appendChild(span); ttd8a.align = "center";*/
        span.style.margin = "10px";
        span.style.fontSize = "1.3em";
        var btn1 = Framework.Form.Button.Create(function () {
            var aliments = self.questionnaire.Aliments.filter(function (x) { return x.Type == aliment.Type; });
            var nb = 0;
            aliments.forEach(function (p) {
                nb += p.Quantite;
            });
            return nb < 2;
        }, function () {
            aliment.Quantite += 1;
            span.innerText = aliment.Quantite.toString();
            onChange();
        }, "<span class='fa fa-plus fa-lg'>", ["btn", "btn-primary", "btnCart"]);
        td2.appendChild(btn1.HtmlElement);
        td2.appendChild(span);
        //let span2 = document.createElement("span"); span2.innerHTML = "&nbsp;"; ttd11.appendChild(span2);
        var btn2 = Framework.Form.Button.Create(function () {
            return aliment.Quantite > 0;
        }, function () {
            aliment.Quantite -= 1;
            span.innerText = aliment.Quantite.toString();
            onChange();
        }, "<span class='fa fa-minus fa-lg'>", ["btn", "btn-primary", "btnCart"]);
        td2.appendChild(btn2.HtmlElement);
        div4.appendChild(tble);
        self.listButtons.push(btn1);
        self.listButtons.push(btn2);
        return div1;
    };
    SensasApp.prototype.setDivAchat = function (type, onNext) {
        var self = this;
        var row1 = document.getElementById("row1");
        var row2 = document.getElementById("row2");
        var list1 = self.questionnaire.Aliments.filter(function (x) { return x.Type == type && x.Position < 5; });
        var list2 = self.questionnaire.Aliments.filter(function (x) { return x.Type == type && x.Position > 4; });
        var onChange = function () {
            var sum0 = 0;
            self.questionnaire.Aliments.filter(function (x) { return x.Type == type; }).forEach(function (x) { return sum0 += x.Quantite * x.PrixUnitaire; });
            pTotal.Set("Total (" + type + "s) : " + sum0.toFixed(2) + "€");
            var sum = 0;
            self.questionnaire.Aliments.forEach(function (a) { sum += a.Quantite * a.PrixUnitaire; });
            var credit = 20 - sum;
            pCredit.Set("Crédit : " + credit.toFixed(2) + "€");
            self.listButtons.forEach(function (b) { b.CheckState(); });
            btnSuivant.CheckState();
        };
        self.listButtons = [];
        list1.forEach(function (p) {
            row1.appendChild(self.createVignette(p, onChange));
        });
        list2.forEach(function (p) {
            row2.appendChild(self.createVignette(p, onChange));
        });
        var pTotal = Framework.Form.TextElement.Register("pTotal");
        var pCredit = Framework.Form.TextElement.Register("pCredit");
        var btnSuivant = Framework.Form.Button.Register("btnSuivant", function () {
            var aliments = self.questionnaire.Aliments.filter(function (x) { return x.Type == type; });
            var nb = 0;
            aliments.forEach(function (p) {
                nb += p.Quantite;
            });
            return nb == 2;
        }, function () {
            onNext();
        });
        onChange();
    };
    SensasApp.prototype.showDivAchat1 = function () {
        var self = this;
        this.showDiv("html/divAchat.html", "Achat1", function () {
            self.setDivAchat(self.questionnaire.Type1, function () { self.showDivAchat2(); });
        });
    };
    SensasApp.prototype.showDivAchat2 = function () {
        var self = this;
        this.showDiv("html/divAchat.html", "Achat2", function () {
            self.setDivAchat(self.questionnaire.Type2, function () { self.showDivRecapAchat(); });
        });
    };
    SensasApp.prototype.showDivRecapAchat = function () {
        var self = this;
        this.showDiv("html/divRecapAchat.html", "RecapAchat", function () {
            var div = Framework.Form.TextElement.Register("content");
            div.HtmlElement.classList.add("text-center");
            var table = document.createElement("table");
            table.style.fontSize = "1.2em";
            table.classList.add("table");
            table.classList.add("table-bordered");
            table.classList.add("mt-5");
            var tr1 = document.createElement("tr");
            table.appendChild(tr1);
            var td1 = document.createElement("td");
            tr1.appendChild(td1);
            td1.innerText = "Type";
            var td2 = document.createElement("td");
            tr1.appendChild(td2);
            td2.innerText = "Code";
            var td3 = document.createElement("td");
            tr1.appendChild(td3);
            td3.innerText = "Quantité";
            var td4 = document.createElement("td");
            tr1.appendChild(td4);
            td4.innerText = "Prix unitaire (€)";
            var td5 = document.createElement("td");
            tr1.appendChild(td5);
            td5.innerText = "Prix total (€)";
            var aliments = self.questionnaire.Aliments.filter(function (x) { return x.Quantite > 0; });
            var sum = 0;
            var index = 1;
            aliments.forEach(function (a) {
                var tr1 = document.createElement("tr");
                table.appendChild(tr1);
                var td1 = document.createElement("td");
                tr1.appendChild(td1);
                td1.innerText = a.Type;
                var td2 = document.createElement("td");
                tr1.appendChild(td2);
                td2.innerText = "Choix " + index;
                index++;
                var img = document.createElement("img");
                img.src = "img/" + a.Code + ".png";
                img.style.height = "200px";
                img.style.width = "auto";
                Framework.Popup.Create(td2, img, "top", "hover");
                var td3 = document.createElement("td");
                tr1.appendChild(td3);
                td3.innerText = a.Quantite.toString();
                var td4 = document.createElement("td");
                tr1.appendChild(td4);
                td4.innerText = a.PrixUnitaire.toFixed(2);
                var td5 = document.createElement("td");
                tr1.appendChild(td5);
                td5.innerText = (a.PrixUnitaire * a.Quantite).toFixed(2);
                sum += (a.PrixUnitaire * a.Quantite);
            });
            var tr2 = document.createElement("tr");
            table.appendChild(tr2);
            var td21 = document.createElement("td");
            tr2.appendChild(td21);
            td21.align = "right";
            td21.colSpan = 4;
            td21.innerHTML = "Total";
            var td25 = document.createElement("td");
            tr2.appendChild(td25);
            td25.innerText = sum.toFixed(2);
            var tr3 = document.createElement("tr");
            table.appendChild(tr3);
            var td31 = document.createElement("td");
            tr3.appendChild(td31);
            td31.align = "right";
            td31.colSpan = 4;
            td31.innerHTML = "Crédit";
            var td35 = document.createElement("td");
            tr3.appendChild(td35);
            td35.innerText = (20 - sum).toFixed(2);
            div.HtmlElement.appendChild(table);
        }, "btnSuivant", function () {
            self.showDivCATA();
        }, function () { return true; });
    };
    SensasApp.prototype.showDivCATA = function () {
        var self = this;
        this.showDiv("html/divCATA.html", "CATA", function () {
            var div = document.getElementById("content");
            var table = document.createElement("table");
            table.style.fontSize = "1.2em";
            table.classList.add("table");
            table.classList.add("table-bordered");
            table.classList.add("mt-5");
            table.width = "auto !important";
            var tr1 = document.createElement("tr");
            table.appendChild(tr1);
            var td1 = document.createElement("td");
            tr1.appendChild(td1);
            td1.innerText = "";
            var aliments = self.questionnaire.Aliments.filter(function (x) { return x.Quantite > 0; });
            var index = 1;
            aliments.forEach(function (a) {
                var td = document.createElement("td");
                tr1.appendChild(td);
                td.innerText = "Choix " + index;
                index++;
                var img = document.createElement("img");
                img.src = "img/" + a.Code + ".png";
                img.style.height = "200px";
                img.style.width = "auto";
                Framework.Popup.Create(td, img, "top", "hover");
            });
            var raisons = [];
            raisons.push(new Framework.KeyValuePair("RaisonPrix", "Pour son prix"));
            raisons.push(new Framework.KeyValuePair("RaisonNutriscore", "Pour son Nutri-score"));
            if (self.questionnaire.PrefScore == true) {
                raisons.push(new Framework.KeyValuePair("RaisonPrefscore", "Pour son label \"Bon goût garanti\""));
            }
            raisons.push(new Framework.KeyValuePair("RaisonMarque", "Pour sa marque ou son packaging"));
            raisons.push(new Framework.KeyValuePair("RaisonNouveaute", "Pour tester un nouveau produit"));
            raisons.push(new Framework.KeyValuePair("RaisonDejaGoute", "Par ce que j'ai déjà goûté ce produit et que je l'apprécie"));
            raisons.push(new Framework.KeyValuePair("RaisonAutre", "Pour une autre raison"));
            raisons.forEach(function (r) {
                var tr1 = document.createElement("tr");
                table.appendChild(tr1);
                var td1 = document.createElement("td");
                tr1.appendChild(td1);
                td1.innerText = r.Value;
                td1.align = "left";
                aliments.forEach(function (a) {
                    var td = document.createElement("td");
                    tr1.appendChild(td);
                    td.align = "center";
                    var cb = document.createElement("input");
                    cb.type = "checkbox";
                    cb.name = a.Code;
                    cb.onclick = function (b) {
                        var res = Number(b.target["checked"]);
                        self.questionnaire.Aliments.filter(function (x) { return x.Code == b.target["name"]; })[0][r.Key] = res;
                        if (r.Key == "RaisonAutre" && res == 1) {
                            var text_1 = Framework.Form.InputText.Create("", function (txt, send) {
                                self.questionnaire.Aliments.filter(function (x) { return x.Code == b.target["name"]; })[0]["RaisonAutreDetail"] = txt;
                                btn_1.CheckState();
                            });
                            text_1.HtmlElement.style.width = "100%";
                            var btn_1 = Framework.Form.Button.Create(function () { return text_1.Value != ""; }, function () { mw_1.Close(); }, "OK", ["btn", "btn-primary"]);
                            var mw_1 = new Framework.Modal.CustomModal(text_1.HtmlElement, "Veuillez préciser la raison de votre choix", [btn_1]);
                            mw_1.show();
                        }
                        btnSuivant.CheckState();
                    };
                    td.appendChild(cb);
                });
            });
            div.appendChild(table);
            var btnSuivant = Framework.Form.Button.Register("btnSuivant", function () {
                var aliments = self.questionnaire.Aliments.filter(function (x) { return x.Quantite > 0; });
                var valid = true;
                aliments.forEach(function (p) {
                    if (p.RaisonAutre == 1 || p.RaisonDejaGoute == 1 || p.RaisonEnvironnement == 1 || p.RaisonMarque == 1 || p.RaisonNutriscore == 1 || p.RaisonPrefscore == 1 || p.RaisonPrix == 1 || p.RaisonNouveaute == 1) {
                    }
                    else {
                        valid = false;
                    }
                });
                return valid;
            }, function () {
                self.showDivFin();
            });
        });
    };
    SensasApp.prototype.showDiv = function (htmlPath, page, onLoaded, nextButtonId, nextButtonAction, nextButtonEnableFunction, nextButtonTime) {
        if (nextButtonId === void 0) { nextButtonId = undefined; }
        if (nextButtonAction === void 0) { nextButtonAction = undefined; }
        if (nextButtonEnableFunction === void 0) { nextButtonEnableFunction = function () { return true; }; }
        if (nextButtonTime === void 0) { nextButtonTime = undefined; }
        var self = this;
        document.body.innerHTML = "";
        var path = SensasApp.GetRequirements().AppUrl + "/" + htmlPath;
        Framework.BaseView.Load(path, "body", function (div) {
            $('.fa-info-circle').tooltipster({ trigger: 'click' });
            var previousAccess = false;
            if (self.questionnaire) {
                self.questionnaire.Page = page;
                self.saveQuestionnaire(function () {
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
    SensasApp.prototype.showDivFin = function () {
        var self = this;
        this.showDiv("html/divFin.html", "Fin", function () { });
    };
    SensasApp.prototype.showDivFin2 = function () {
        var self = this;
        this.showDiv("html/divFin2.html", "NonConsentement", function () { });
    };
    SensasApp.prototype.showDivErreur = function () {
        var self = this;
        this.showDiv("html/divErreur.html", "Erreur", function () { });
    };
    return SensasApp;
}(Framework.App));
//# sourceMappingURL=app.js.map