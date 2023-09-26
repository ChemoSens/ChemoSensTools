module Models {

    export class InscriptionSensas {
        public Code: string = "";
        public ConnaissanceEtude: string = "";
        public Panel: string = "";
        public Mail: string = "";
        //public Civilite: string = "";
        public Nom: string = "";
        public Prenom: string = "";
        public DateNaissance: Date;
        public Genre: string = "";
        //public Telephone: string = "";
        public Adresse: string = "";
        public CP: string = "";
        public Ville: string = "";
        public CSP: string = "";
        public NiveauEtudes: string = "";
        //public NbMajeurs: number;
        //public NbMineurs: number;
        public InscriptionPanelSens: boolean = false;
        public FreqConsoCookie: string = "";
        public FreqConsoPainMie: string = "";
        public FreqConsoPizza: string = "";
        //public ListeFoodChoice: FoodChoice;
        public IndemnisationMax: number;
        public UUID: string;
        public TestNavigateur: number = 0;
        public TexteConditions: string = "";
        public AccepteConditions: number = 0;
        public Pizzabon: number = 0;
        public Stromboli: number = 0;
        public Cookicroc: number = 0;
        public TanteAdele: number = 0;
        public Toastinou: number = 0;
        public MamieDouce: number = 0;

        public Healthy: number = 0;
        public MoodMonitoring: number = 0;
        public Convenient: number = 0;
        public Pleasure: number = 0;
        public Natural: number = 0;
        public Affordable: number = 0;
        public WeightControl: number = 0;
        public Familiar: number = 0;
        public EnvironmentalFriendly: number = 0;
        public AnimalFriendly: number = 0;
        public FairlyTrade: number = 0;

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

    export class QuestionnaireSensas {
        public Code: string = "";
        public AnneeNaissance: number;
        public Genre: string = "";
        public CSP: string = "";
        public NiveauEtudes: string = "";
        public NbMajeurs: number;
        public NbMineurs: number;
        public FreqConsoCookie: string = "";
        public FreqConsoPainMie: string = "";
        public FreqConsoPizza: string = "";

        public DatesAcces: Date[] = [];
        public EvaluationProduit: EvaluationProduit[] = [];
        public ListeProduitIdeal: ProduitIdeal[] = [];
        //public ListeFoodChoice: FoodChoice[] = [];

        public Healthy: number = 0;
        public MoodMonitoring: number = 0;
        public Convenient: number = 0;
        public Pleasure: number = 0;
        public Natural: number = 0;
        public Affordable: number = 0;
        public WeightControl: number = 0;
        public Familiar: number = 0;
        public EnvironmentalFriendly: number = 0;
        public AnimalFriendly: number = 0;
        public FairlyTrade: number = 0;

        public DatesMauvaisesReponses: Date[] = [];
        public NbEval: number = 0;

        public ListIndemnisations: string[] = [];
        
    }

    export class Produit {
        public CodeBarre: string;
        public EAN: string;
        public Type: string;
        public Designation: string;
        public Categorie: string;
        public Valide: string;
        public Rang: number;

        public static Create(ean:string, designation:string, categorie:string):Produit {
            let produit = new Models.Produit();
            produit.EAN = ean;
            produit.Designation = designation;
            produit.Categorie = categorie;          
            produit.Type = categorie;     
            return produit;
        }
    }

    export class ProduitIdeal {
        public DateDebut: Date = new Date(Date.now());
        public DateFin: Date;
        public Type: string;
        public DescriptionApparence: string = "";
        public DescriptionTexture: string = "";
        public DescriptionGout: string = "";
        public Evalue: boolean = false;
    }

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

    export class EvaluationProduit {
        public DateDebut: Date = new Date(Date.now());
        public DateFin: Date;
        public Produit: Produit;
        public DejaGoute: string = "";
        public PhotoEmballage: boolean = false;
        //public PhotoComposition: boolean = false;
        public ExpectedLiking: number;
        public DescriptionApparence: string = "";
        public StatedLiking: number;
        public DescriptionTexture: string = "";
        public DescriptionGout: string = "";
        //public DescriptionAime: string = "";
        //public DescriptionPasAime: string = "";
        public AimeTexture: number;
        public AimeGout: number;
        public AimeApparence: number;
        public JARSucre: number;
        public JARSale: number;
        public JARGras: number;
        public IntentionReachat: string;
        public EvaluationTerminee: boolean = false;        
    }

    export class Evaluation {

        public Date: string;
        public CodeBarre: string;
        public Designation: string;
        public Type: string;
        public Rang: number;
        public Montant: number;
        public Multiplicateur :number;
        public Total: number;

    }

    export class Indemnisation {
        public Date:string;
        public Montant:number;
        public Code:string;
    }



}