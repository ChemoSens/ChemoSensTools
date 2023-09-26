module Models {

    export class QuestionAliment {
        public Designation: string;
        public Rayon: string;
        public Consomme: number = undefined;
        public Choisi: string = undefined;
        public EstNote: boolean = false;
        public Position: number = undefined;
        public EstRepete: boolean = false;

        public Dimensions: Dimension[] = [
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

        public static GetDimension(question: QuestionAliment, dimension: string): Dimension {
            return (question.Dimensions.filter(x => { return x.Nom == dimension })[0]);
        }

        public static GetImportantDimensions(question: QuestionAliment): Dimension[] {
            let result: Dimension[] = []
            for (let i: number = 0; i < question.Dimensions.length; i++) {
                let dimension = question.Dimensions[i];

                if (dimension.ImportantAliment == 1) {
                    result.push(dimension);
                }

            }
            return result;
        }

        constructor(label: string, rayon: string) {
            this.Designation = label;
            this.Rayon = rayon;
        }
    }

    export class AccesQuestionnaire {
        public Page: string;
        public Date: Date;

        constructor(page: string, date: Date) {
            this.Page = page;
            this.Date = date;
        }
    }

    export class Dimension {
        public Nom: string;
        public Label: string;// questionnaire aliment
        public NonPrisEnCompte: number = undefined; // questionnaire global
        public ScoreGlobal: number = undefined; // questionnaire global
        public SousDimensions: SousDimension[] = undefined; // questionnaire global, quizz
        public ImportantAliment: number = undefined;// questionnaire aliment
        public ScoreAliment: number = undefined;// questionnaire aliment

        constructor(nom: string, label: string, sousDimensions: SousDimension[] = undefined) {
            this.Nom = nom;
            if (sousDimensions) {
                // questionnaire global
                this.Label = undefined;
                sousDimensions.forEach(x => { x.Dimension = nom });
                this.SousDimensions = sousDimensions;
                this.NonPrisEnCompte = 0;
                this.ScoreGlobal = undefined;
            } else {
                // questionnaire aliment
                this.Label = label;
                this.ImportantAliment = 0;
                this.ScoreAliment = 0;
            }
        }
    }

    export class SousDimension {
        public Dimension: string;
        public Nom: string;
        public Label: string;
        public Important: number = 0;
        public ClasseParSujetDansDimension: string;
        public Reponses: string[] = [];
        public MauvaisesReponses: number = 0;

        constructor(nom: string, label: string, classeParSujetDansDimension: string = "Defaut") {
            this.Nom = nom;
            this.Label = label;
            this.ClasseParSujetDansDimension = classeParSujetDansDimension;
        }
    }

    export class QuestionnaireArbitrage {

        public Code: string;
        public CP: string;
        public Genre: string = undefined;
        public Taille: number = undefined;
        public Poids: number = undefined;
        public Age: number = undefined;
        public CSP: string = undefined;
        public Diplome: string = undefined;
        public NbPersonnesMajeures: number = undefined;
        public NbPersonnesMineures: number = undefined;
        public MontantAlloueCourses: string = undefined;
        public RegimeParticulier: string = undefined;
        public DetailRegimeParticulier: string = undefined;
        public UtilisationApplications: string = undefined;
        public QuantiteInfo: string = undefined;
        public QualiteInfo: string = undefined;
        public ConfianceInfo: string = undefined;
        public RemarquesInfo: string = undefined;

        public CP_inscription: string = "";
        public AchatGMS: boolean = false;
        public AchatGrandeSurfaceSpecialisee: boolean = false;
        public AchatCommerceProximite: boolean = false;
        public AchatMarche: boolean = false;
        public AchatDrive: boolean = false;
        public AchatProducteur: boolean = false;
        public AchatInternet: boolean = false;
        public AchatAutre: string = "";
        public EnseigneCarrefour: boolean = false;
        public EnseigneLeclerc: boolean = false;
        public EnseigneIntermarche: boolean = false;
        public EnseigneSuperU: boolean = false;
        public EnseigneCora: boolean = false;
        public EnseigneCasino: boolean = false;
        public EnseigneAutre: string = "";
        public CategorieViandePoisson: boolean = false;
        public CategorieFruitLegume: boolean = false;
        public CategoriePainPatisserie: boolean = false;
        public CategorieSurgele: boolean = false;
        public CategorieEpicerieSalee: boolean = false;
        public CategorieEpicerieSucree: boolean = false;
        public CategorieFrais: boolean = false;


        public Remarques: string;

        public ConsentementAccepte: boolean = false;
        public AlimentRepete: boolean = false;

        public AccesQuestionnaire: AccesQuestionnaire[] = [];

        public Invoices: InvoiceAnalyzerModels.Invoice[] = [];

        public QuestionsAliment: QuestionAliment[] = []; 

        public IndexQuestion: number = 1;

        public Dimensions: Dimension[] = [
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
            ])]

        public static GetNbGoodAnswers(questionnaire: QuestionnaireArbitrage): number {
            let result: number = 0;

            for (let i: number = 0; i < questionnaire.Dimensions.length; i++) {
                let dimension = questionnaire.Dimensions[i];
                for (let j: number = 0; j < dimension.SousDimensions.length; j++) {
                    let sousDimension = dimension.SousDimensions[j];
                    if (sousDimension.ClasseParSujetDansDimension == sousDimension.Dimension) {
                        result++;
                    }
                }
            }

            return result;
        }

        public static GetDimension(questionnaire: QuestionnaireArbitrage, dimension: string): Dimension {
            return (questionnaire.Dimensions.filter(x => { return x.Nom == dimension })[0]);
        }

        public static GetSousDimensionsBy(questionnaire: QuestionnaireArbitrage, by: string, value: string): SousDimension[] {
            let result: SousDimension[] = []
            for (let i: number = 0; i < questionnaire.Dimensions.length; i++) {
                let dimension = questionnaire.Dimensions[i];
                for (let j: number = 0; j < dimension.SousDimensions.length; j++) {
                    let sousDimension = dimension.SousDimensions[j];
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
        }

        public static AddInvoice(questionnaire: QuestionnaireArbitrage, invoice: InvoiceAnalyzerModels.Invoice, nbItems) {
            //let exists = questionnaire.Invoices.filter((x) => { return x.InvoiceNumber == invoice.InvoiceNumber }).length > 0;
            let exists = false;
            if (exists == false) {
                questionnaire.Invoices.push(invoice);
                invoice.ListItems.forEach(x => {
                    let exist = questionnaire.QuestionsAliment.filter((y) => { return y.Designation == x.Designation }).length > 0;
                    if (exist == false) {
                        questionnaire.QuestionsAliment.push(new QuestionAliment(x.Designation, x.Rayon));
                    }
                });
                
                //Framework.Array.Shuffle(questionnaire.QuestionsAliment);
                //questionnaire.QuestionsAliment = questionnaire.QuestionsAliment.slice(0, nbItems);

                if (questionnaire.QuestionsAliment.length >= nbItems) {
                    // Echantillonnage
                    let rayons = Framework.Array.Unique(questionnaire.QuestionsAliment.map(x => x.Rayon));
                    Framework.Array.Shuffle(rayons);
                    let position: number = 1;

                    let shuffle = () => {
                        rayons.forEach(r => {
                            let items = questionnaire.QuestionsAliment.filter(x => { return x.Rayon == r && x.Position == undefined });
                            if (items.length > 0) {
                                Framework.Array.Shuffle(items);
                                items[0].Position = position;
                                position++;
                            }
                        });
                        if (questionnaire.QuestionsAliment.filter(x => { return x.Position == undefined }).length > 0) {
                            Framework.Array.Shuffle(rayons);
                            shuffle();
                        }
                    }

                    shuffle();

                    try {
                        let memo = questionnaire.QuestionsAliment.filter(x => { return x.Position == 30 });
                        memo[0].Position = position;
                        let rep = questionnaire.QuestionsAliment.filter(x => { return x.Position < 30 })[0];
                        //let repl = new QuestionAliment(questionnaire.QuestionsAliment[0].Designation, questionnaire.QuestionsAliment[0].Rayon);
                        let repl = new QuestionAliment(rep.Designation, rep.Rayon);
                        repl.EstRepete = true;
                        repl.Position = 30;
                        questionnaire.QuestionsAliment.push(repl);

                    }
                    catch
                    {}

                   

                    questionnaire.QuestionsAliment = Framework.Array.SortBy(questionnaire.QuestionsAliment, "Position");
                }


            }
        }

        public static GetNbItems(questionnaire: QuestionnaireArbitrage) {
            return questionnaire.QuestionsAliment.length;
            //return Models.QuestionnaireArbitrage.GetItems(questionnaire).length;
        }

        public static GetItems(questionnaire: QuestionnaireArbitrage): InvoiceAnalyzerModels.InvoiceItem[] {
            let items: InvoiceAnalyzerModels.InvoiceItem[] = [];

            questionnaire.Invoices.forEach((invoice) => {
                invoice.ListItems.forEach((item) => {
                    let exist = items.filter((x) => { return x.Designation == item.Designation }).length > 0;
                    if (exist == false) {
                        items.push(item);
                    }
                });
            });

            return items;
        }

        public static RenderItems(questionnaire: QuestionnaireArbitrage, divNombre: Framework.Form.TextElement, divItems: Framework.Form.TextElement, height: string) {
            let items: InvoiceAnalyzerModels.InvoiceItem[] = QuestionnaireArbitrage.GetItems(questionnaire);
            divNombre.Set(items.length.toString());
            let table: Framework.Form.Table<InvoiceAnalyzerModels.InvoiceItem> = new Framework.Form.Table<InvoiceAnalyzerModels.InvoiceItem>();
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
        }

        public static HasAccess(questionnaire: QuestionnaireArbitrage, page: string) {
            let acces = questionnaire.AccesQuestionnaire.filter((x) => { return x.Page == page });
            return (acces.length > 0);
        }


    }


}