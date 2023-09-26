var Models;
(function (Models) {
    var QuestionAliment = /** @class */ (function () {
        function QuestionAliment(label, rayon) {
            this.Consomme = undefined;
            this.Choisi = undefined;
            this.EstNote = false;
            this.Position = undefined;
            this.EstRepete = false;
            this.Dimensions = [
                new Dimension("Economique", "Valeur économique (caractéristiques liées au prix des produits alimentaires)"),
                new Dimension("Nutrition", "Caractéristiques nutritionnelles (caractéristiques liées au contenu du produit en éléments nutritifs (nutriments) ou en éléments ayant des vertus physiologiques.)"),
                new Dimension("Environnement", "Impact environnemental (caractéristiques liées à l'impact environnemental des produits alimentaires et de leurs emballages)"),
                new Dimension("Pratique", "Qualités pratiques (caractéristiques liées à la praticité des produits alimentaires et de leurs emballages, ainsi qu'à leur qualité technique)"),
                new Dimension("Sanitaire", "Qualité sanitaire (caractéristiques liées à la présence possible d'éléments indésirables voire nocifs dans les produits alimentaires)"),
                new Dimension("Organoleptique", "Propriétés sensorielles (caractéristiques liées au goût et à l'apparence des produits alimentaires, ainsi qu'à leur appréciation et au plaisir perçus lors de leur consommation)"),
                new Dimension("SocioEconomique", "Impact économique et social (caractéristiques liées aux conséquences des achats alimentaires sur les acteurs impliqués dans la chaîne de production, l'économie locale ou nationale et les liens entre les producteurs et les consommateurs)"),
                new Dimension("Conviction", "Convictions personnelles et culturelles (caractéristiques liées aux convictions personnelles ou culturelles, autres que celles liées à l'environnement, ou aux aspects économiques et sociaux)"),
                new Dimension("Autre", "")
            ];
            this.Designation = label;
            this.Rayon = rayon;
        }
        QuestionAliment.GetDimension = function (question, dimension) {
            return (question.Dimensions.filter(function (x) { return x.Nom == dimension; })[0]);
        };
        QuestionAliment.GetImportantDimensions = function (question) {
            var result = [];
            for (var i = 0; i < question.Dimensions.length; i++) {
                var dimension = question.Dimensions[i];
                if (dimension.ImportantAliment == 1) {
                    result.push(dimension);
                }
            }
            return result;
        };
        return QuestionAliment;
    }());
    Models.QuestionAliment = QuestionAliment;
    var AccesQuestionnaire = /** @class */ (function () {
        function AccesQuestionnaire(page, date) {
            this.Page = page;
            this.Date = date;
        }
        return AccesQuestionnaire;
    }());
    Models.AccesQuestionnaire = AccesQuestionnaire;
    var Dimension = /** @class */ (function () {
        function Dimension(nom, label, sousDimensions) {
            if (sousDimensions === void 0) { sousDimensions = undefined; }
            this.NonPrisEnCompte = undefined; // questionnaire global
            this.ScoreGlobal = undefined; // questionnaire global
            this.SousDimensions = undefined; // questionnaire global, quizz
            this.ImportantAliment = undefined; // questionnaire aliment
            this.ScoreAliment = undefined; // questionnaire aliment
            this.Nom = nom;
            if (sousDimensions) {
                // questionnaire global
                this.Label = undefined;
                sousDimensions.forEach(function (x) { x.Dimension = nom; });
                this.SousDimensions = sousDimensions;
                this.NonPrisEnCompte = 0;
                this.ScoreGlobal = undefined;
            }
            else {
                // questionnaire aliment
                this.Label = label;
                this.ImportantAliment = 0;
                this.ScoreAliment = 0;
            }
        }
        return Dimension;
    }());
    Models.Dimension = Dimension;
    var SousDimension = /** @class */ (function () {
        function SousDimension(nom, label, classeParSujetDansDimension) {
            if (classeParSujetDansDimension === void 0) { classeParSujetDansDimension = "Defaut"; }
            this.Important = 0;
            this.Reponses = [];
            this.MauvaisesReponses = 0;
            this.Nom = nom;
            this.Label = label;
            this.ClasseParSujetDansDimension = classeParSujetDansDimension;
        }
        return SousDimension;
    }());
    Models.SousDimension = SousDimension;
    var QuestionnaireArbitrage = /** @class */ (function () {
        function QuestionnaireArbitrage() {
            this.Genre = undefined;
            this.Taille = undefined;
            this.Poids = undefined;
            this.Age = undefined;
            this.CSP = undefined;
            this.Diplome = undefined;
            this.NbPersonnesMajeures = undefined;
            this.NbPersonnesMineures = undefined;
            this.MontantAlloueCourses = undefined;
            this.RegimeParticulier = undefined;
            this.DetailRegimeParticulier = undefined;
            this.UtilisationApplications = undefined;
            this.QuantiteInfo = undefined;
            this.QualiteInfo = undefined;
            this.ConfianceInfo = undefined;
            this.RemarquesInfo = undefined;
            this.CP_inscription = "";
            this.AchatGMS = false;
            this.AchatGrandeSurfaceSpecialisee = false;
            this.AchatCommerceProximite = false;
            this.AchatMarche = false;
            this.AchatDrive = false;
            this.AchatProducteur = false;
            this.AchatInternet = false;
            this.AchatAutre = "";
            this.EnseigneCarrefour = false;
            this.EnseigneLeclerc = false;
            this.EnseigneIntermarche = false;
            this.EnseigneSuperU = false;
            this.EnseigneCora = false;
            this.EnseigneCasino = false;
            this.EnseigneAutre = "";
            this.CategorieViandePoisson = false;
            this.CategorieFruitLegume = false;
            this.CategoriePainPatisserie = false;
            this.CategorieSurgele = false;
            this.CategorieEpicerieSalee = false;
            this.CategorieEpicerieSucree = false;
            this.CategorieFrais = false;
            this.ConsentementAccepte = false;
            this.AlimentRepete = false;
            this.AccesQuestionnaire = [];
            this.Invoices = [];
            this.QuestionsAliment = [];
            this.IndexQuestion = 1;
            this.Dimensions = [
                new Dimension("Economique", "", [
                    new SousDimension("OffrePromo", "Offre promotionnelle"),
                    new SousDimension("AdequationBudget", "Adéquation du prix d'achat avec mon budget"),
                    new SousDimension("PrixKg", "Prix affiché au kg"),
                    new SousDimension("PrixEuro", "Prix affiché en euros"),
                    new SousDimension("AutreEconomique", "", "")
                ]),
                new Dimension("Nutrition", "", [
                    new SousDimension("Transit", "Favorise le transit"),
                    new SousDimension("Regime", "Compatibilité avec un régime sans sel"),
                    new SousDimension("Conformite", "Conformité par rapport aux recommandations nutritionnelles"),
                    new SousDimension("Teneur", "Teneur en lipides, glucides et en sodium"),
                    new SousDimension("MarqueNutrition", "Marque connue pour la qualité nutritionnelle de ses produits"),
                    new SousDimension("NutriScore", "Bon Nutri-Score"),
                    new SousDimension("AutreNutrition", "", "")
                ]),
                new Dimension("Environnement", "", [
                    new SousDimension("Carbone", "Impact carbone (gaz à effet de serre)"),
                    new SousDimension("Saisonnalite", "Saisonnalité des produits alimentaires"),
                    new SousDimension("Distance", "Distance séparant les lieux de production et de consommation"),
                    new SousDimension("Durable", "Pêche durable"),
                    new SousDimension("Recyclable", "Emballage recyclable"),
                    new SousDimension("Production", "Conséquences du mode de production sur la pollution des sols"),
                    new SousDimension("Vrac", "Produit en vrac"),
                    new SousDimension("AutreEnvironnement", "", "")
                ]),
                new Dimension("Pratique", "", [
                    new SousDimension("Conservation", "Facilité de conservation"),
                    new SousDimension("OuvertureFacile", "Emballage avec ouverture facilitée"),
                    new SousDimension("LongueConservation", "Longue durée de conservation"),
                    new SousDimension("PreparationFacile", "Facilité de préparation"),
                    new SousDimension("Technique", "Qualité technique (ex: farine sans grumeau)"),
                    new SousDimension("AutrePratique", "", "")
                ]),
                new Dimension("Sanitaire", "", [
                    new SousDimension("Additif", "Présence d'additifs controversés"),
                    new SousDimension("Toxine", "Présence possible de mycotoxines"),
                    new SousDimension("Pesticide", "Présence possible de résidus de pesticides dans l'aliment"),
                    new SousDimension("Contaminant", "Présence possible de contaminants des emballages (plastiques, vernis)"),
                    new SousDimension("Toxique", "Présence de composés toxiques générés pendant la fabrication"),
                    new SousDimension("AutreSanitaire", "", "")
                ]),
                new Dimension("Organoleptique", "", [
                    new SousDimension("Gout", "Goût de l'aliment"),
                    new SousDimension("Plaisir", "Plaisir perçu lors de la consommation"),
                    new SousDimension("MarqueOrganoleptique", "Marque connue pour la qualité gustative de ses produits, médaille délivrée par un jury d'experts"),
                    new SousDimension("VarieteOrganoleptique", "Possibilité offerte par l'aliment de varier les goûts"),
                    new SousDimension("Nouveaute", "Goût nouveau apporté par l'aliment"),
                    new SousDimension("AutreOrganoleptique", "", "")
                ]),
                new Dimension("SocioEconomique", "", [
                    new SousDimension("ConditionsTravail", "Conditions de travail des producteurs"),
                    new SousDimension("LienProducteur", "Lien direct avec le producteur"),
                    new SousDimension("RemunerationProducteur", "Rémunération des producteurs"),
                    new SousDimension("CircuitCourt", "Commercialisation en circuit court"),
                    new SousDimension("EconomieLocale", "Achat contribuant à l'économie locale"),
                    new SousDimension("AutreSocioEconomique", "", "")
                ]),
                new Dimension("Conviction", "", [
                    new SousDimension("BienEtreAnimal", "Bien-être animal"),
                    new SousDimension("Vegetarien", "Compatibilité avec un régime végétarien"),
                    new SousDimension("Tradition", "Traditions culturelles"),
                    new SousDimension("AutreConviction", "", "")
                ]),
                new Dimension("Autre", "", [
                    new SousDimension("Autre", "", "")
                ])
            ];
        }
        QuestionnaireArbitrage.GetNbGoodAnswers = function (questionnaire) {
            var result = 0;
            for (var i = 0; i < questionnaire.Dimensions.length; i++) {
                var dimension = questionnaire.Dimensions[i];
                for (var j = 0; j < dimension.SousDimensions.length; j++) {
                    var sousDimension = dimension.SousDimensions[j];
                    if (sousDimension.ClasseParSujetDansDimension == sousDimension.Dimension) {
                        result++;
                    }
                }
            }
            return result;
        };
        QuestionnaireArbitrage.GetDimension = function (questionnaire, dimension) {
            return (questionnaire.Dimensions.filter(function (x) { return x.Nom == dimension; })[0]);
        };
        QuestionnaireArbitrage.GetSousDimensionsBy = function (questionnaire, by, value) {
            var result = [];
            for (var i = 0; i < questionnaire.Dimensions.length; i++) {
                var dimension = questionnaire.Dimensions[i];
                for (var j = 0; j < dimension.SousDimensions.length; j++) {
                    var sousDimension = dimension.SousDimensions[j];
                    if (by == "Label" && sousDimension.Label == value) {
                        result.push(sousDimension);
                    }
                    if (by == "Nom" && sousDimension.Nom == value) {
                        result.push(sousDimension);
                    }
                    if (by == "Classe" && sousDimension.ClasseParSujetDansDimension == value) {
                        result.push(sousDimension);
                    }
                    if (by == "All" && sousDimension.ClasseParSujetDansDimension != "") {
                        result.push(sousDimension);
                    }
                    if (by == "MalClasse" && sousDimension.ClasseParSujetDansDimension == value && sousDimension.Dimension != sousDimension.ClasseParSujetDansDimension) {
                        result.push(sousDimension);
                    }
                }
            }
            return result;
        };
        QuestionnaireArbitrage.AddInvoice = function (questionnaire, invoice, nbItems) {
            //let exists = questionnaire.Invoices.filter((x) => { return x.InvoiceNumber == invoice.InvoiceNumber }).length > 0;
            var exists = false;
            if (exists == false) {
                questionnaire.Invoices.push(invoice);
                invoice.ListItems.forEach(function (x) {
                    var exist = questionnaire.QuestionsAliment.filter(function (y) { return y.Designation == x.Designation; }).length > 0;
                    if (exist == false) {
                        questionnaire.QuestionsAliment.push(new QuestionAliment(x.Designation, x.Rayon));
                    }
                });
                //Framework.Array.Shuffle(questionnaire.QuestionsAliment);
                //questionnaire.QuestionsAliment = questionnaire.QuestionsAliment.slice(0, nbItems);
                if (questionnaire.QuestionsAliment.length >= nbItems) {
                    // Echantillonnage
                    var rayons_1 = Framework.Array.Unique(questionnaire.QuestionsAliment.map(function (x) { return x.Rayon; }));
                    Framework.Array.Shuffle(rayons_1);
                    var position_1 = 1;
                    var shuffle_1 = function () {
                        rayons_1.forEach(function (r) {
                            var items = questionnaire.QuestionsAliment.filter(function (x) { return x.Rayon == r && x.Position == undefined; });
                            if (items.length > 0) {
                                Framework.Array.Shuffle(items);
                                items[0].Position = position_1;
                                position_1++;
                            }
                        });
                        if (questionnaire.QuestionsAliment.filter(function (x) { return x.Position == undefined; }).length > 0) {
                            Framework.Array.Shuffle(rayons_1);
                            shuffle_1();
                        }
                    };
                    shuffle_1();
                    try {
                        var memo = questionnaire.QuestionsAliment.filter(function (x) { return x.Position == 30; });
                        memo[0].Position = position_1;
                        var rep = questionnaire.QuestionsAliment.filter(function (x) { return x.Position < 30; })[0];
                        //let repl = new QuestionAliment(questionnaire.QuestionsAliment[0].Designation, questionnaire.QuestionsAliment[0].Rayon);
                        var repl = new QuestionAliment(rep.Designation, rep.Rayon);
                        repl.EstRepete = true;
                        repl.Position = 30;
                        questionnaire.QuestionsAliment.push(repl);
                    }
                    catch (_a) { }
                    questionnaire.QuestionsAliment = Framework.Array.SortBy(questionnaire.QuestionsAliment, "Position");
                }
            }
        };
        QuestionnaireArbitrage.GetNbItems = function (questionnaire) {
            return questionnaire.QuestionsAliment.length;
            //return Models.QuestionnaireArbitrage.GetItems(questionnaire).length;
        };
        QuestionnaireArbitrage.GetItems = function (questionnaire) {
            var items = [];
            questionnaire.Invoices.forEach(function (invoice) {
                invoice.ListItems.forEach(function (item) {
                    var exist = items.filter(function (x) { return x.Designation == item.Designation; }).length > 0;
                    if (exist == false) {
                        items.push(item);
                    }
                });
            });
            return items;
        };
        QuestionnaireArbitrage.RenderItems = function (questionnaire, divNombre, divItems, height) {
            var items = QuestionnaireArbitrage.GetItems(questionnaire);
            divNombre.Set(items.length.toString());
            var table = new Framework.Form.Table();
            table.CanSelect = false;
            table.ShowFooter = false;
            table.ListData = items;
            table.Height = height;
            table.FullWidth = true;
            table.AddCol("Rayon", "Famille", 150, "left");
            table.AddCol("Designation", "Désignation", 300, "left");
            table.AddCol("Quantite", "Quantité", 100, "left");
            table.AddCol("PUTTC", "PUTTC", 100, "left");
            table.Render(divItems.HtmlElement);
        };
        QuestionnaireArbitrage.HasAccess = function (questionnaire, page) {
            var acces = questionnaire.AccesQuestionnaire.filter(function (x) { return x.Page == page; });
            return (acces.length > 0);
        };
        return QuestionnaireArbitrage;
    }());
    Models.QuestionnaireArbitrage = QuestionnaireArbitrage;
})(Models || (Models = {}));
//# sourceMappingURL=models.js.map