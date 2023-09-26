var Models;
(function (Models) {
    var InscriptionSensas = /** @class */ (function () {
        function InscriptionSensas() {
            this.Code = "";
            this.ConnaissanceEtude = "";
            this.Panel = "";
            this.Mail = "";
            //public Civilite: string = "";
            this.Nom = "";
            this.Prenom = "";
            this.Genre = "";
            //public Telephone: string = "";
            this.Adresse = "";
            this.CP = "";
            this.Ville = "";
            this.CSP = "";
            this.NiveauEtudes = "";
            //public NbMajeurs: number;
            //public NbMineurs: number;
            this.InscriptionPanelSens = false;
            this.FreqConsoCookie = "";
            this.FreqConsoPainMie = "";
            this.FreqConsoPizza = "";
            this.TestNavigateur = 0;
            this.TexteConditions = "";
            this.AccepteConditions = 0;
            this.Pizzabon = 0;
            this.Stromboli = 0;
            this.Cookicroc = 0;
            this.TanteAdele = 0;
            this.Toastinou = 0;
            this.MamieDouce = 0;
            this.Healthy = 0;
            this.MoodMonitoring = 0;
            this.Convenient = 0;
            this.Pleasure = 0;
            this.Natural = 0;
            this.Affordable = 0;
            this.WeightControl = 0;
            this.Familiar = 0;
            this.EnvironmentalFriendly = 0;
            this.AnimalFriendly = 0;
            this.FairlyTrade = 0;
            //TODO : cagnotte
            //constructor() {
            //    let p1 = new Models.FoodChoice()
            //    p1.Type = "pizza";
            //    this.ListeFoodChoice.push(p1);
            //    let p2 = new Models.FoodChoice()
            //    p2.Type = "cookie";
            //    this.ListeFoodChoice.push(p2);
            //    let p3 = new Models.FoodChoice()
            //    p3.Type = "pain de mie";
            //    this.ListeFoodChoice.push(p3);
            //}
        }
        return InscriptionSensas;
    }());
    Models.InscriptionSensas = InscriptionSensas;
    var QuestionnaireSensas = /** @class */ (function () {
        function QuestionnaireSensas() {
            this.Code = "";
            this.Genre = "";
            this.CSP = "";
            this.NiveauEtudes = "";
            this.FreqConsoCookie = "";
            this.FreqConsoPainMie = "";
            this.FreqConsoPizza = "";
            this.DatesAcces = [];
            this.EvaluationProduit = [];
            this.ListeProduitIdeal = [];
            //public ListeFoodChoice: FoodChoice[] = [];
            this.Healthy = 0;
            this.MoodMonitoring = 0;
            this.Convenient = 0;
            this.Pleasure = 0;
            this.Natural = 0;
            this.Affordable = 0;
            this.WeightControl = 0;
            this.Familiar = 0;
            this.EnvironmentalFriendly = 0;
            this.AnimalFriendly = 0;
            this.FairlyTrade = 0;
            this.DatesMauvaisesReponses = [];
            this.NbEval = 0;
            this.ListIndemnisations = [];
        }
        return QuestionnaireSensas;
    }());
    Models.QuestionnaireSensas = QuestionnaireSensas;
    var Produit = /** @class */ (function () {
        function Produit() {
        }
        Produit.Create = function (ean, designation, categorie) {
            var produit = new Models.Produit();
            produit.EAN = ean;
            produit.Designation = designation;
            produit.Categorie = categorie;
            produit.Type = categorie;
            return produit;
        };
        return Produit;
    }());
    Models.Produit = Produit;
    var ProduitIdeal = /** @class */ (function () {
        function ProduitIdeal() {
            this.DateDebut = new Date(Date.now());
            this.DescriptionApparence = "";
            this.DescriptionTexture = "";
            this.DescriptionGout = "";
            this.Evalue = false;
        }
        return ProduitIdeal;
    }());
    Models.ProduitIdeal = ProduitIdeal;
    //export class FoodChoice {
    //    public Type: string;
    //    public Healthy: number = 0;
    //    public MoodMonitoring: number = 0;
    //    public Convenient: number = 0;
    //    public Pleasure: number = 0;
    //    public Natural: number = 0;
    //    public Affordable: number = 0;
    //    public WeightControl: number = 0;
    //    public Familiar: number = 0;
    //    public EnvironmentalFriendly: number = 0;
    //    public AnimalFriendly: number = 0;
    //    public FairlyTrade: number = 0;
    //    public Evalue: boolean = false;
    //}
    var EvaluationProduit = /** @class */ (function () {
        function EvaluationProduit() {
            this.DateDebut = new Date(Date.now());
            this.DejaGoute = "";
            this.PhotoEmballage = false;
            this.DescriptionApparence = "";
            this.DescriptionTexture = "";
            this.DescriptionGout = "";
            this.EvaluationTerminee = false;
        }
        return EvaluationProduit;
    }());
    Models.EvaluationProduit = EvaluationProduit;
    var Evaluation = /** @class */ (function () {
        function Evaluation() {
        }
        return Evaluation;
    }());
    Models.Evaluation = Evaluation;
    var Indemnisation = /** @class */ (function () {
        function Indemnisation() {
        }
        return Indemnisation;
    }());
    Models.Indemnisation = Indemnisation;
})(Models || (Models = {}));
//# sourceMappingURL=models.js.map