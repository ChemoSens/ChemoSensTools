module Models {

    export class Aliment {
        public Type: string;
        public Code: string;
        public NutriScore: string;
        public ScoreEnvironnement: string;
        public PrefScore: string;
        public PrixUnitaire: number;
        public PrixKg: number;
        public Quantite: number;
        public Position: number;
        public RaisonPrix: number = 0;
        public RaisonDejaGoute: number = 0;
        public RaisonNutriscore: number = 0;
        public RaisonPrefscore: number = 0;
        public RaisonEnvironnement: number = 0;
        public RaisonMarque: number = 0;
        public RaisonNouveaute: number = 0;
        public RaisonAutre: number = 0;
        public RaisonAutreDetail: string = "";

        //constructor(type: string, code: string, nutriscore: string, scoreEnvironnement: string, prefscore: string, prixUnitaire: number, prixKg: number, quantite: number, position: number) {
        //    this.Type = type;
        //    this.Code = code;
        //    this.NutriScore = nutriscore;
        //    this.ScoreEnvironnement = scoreEnvironnement;
        //    this.PrefScore = prefscore;
        //    this.PrixUnitaire = prixUnitaire;
        //    this.PrixKg = prixKg;
        //    this.Quantite = quantite;
        //    this.Position = position;
        //}

        constructor(type: string, code: string, nutriscore: string, prefscore: string, prixUnitaire: number, quantite: number, position: number) {
            this.Type = type;
            this.Code = code;
            this.NutriScore = nutriscore;            
            this.PrefScore = prefscore;
            this.PrixUnitaire = prixUnitaire;            
            this.Quantite = quantite;
            this.Position = position;
        }
    }

    export class Questionnaire {
        public CodeSujet: string;
        public Page: string;
        public ConsentementAccepte: boolean;
        public PrefScore: boolean = false;
        public Date: Date;
        public Type1: string;
        public Type2: string;
        public Aliments: Aliment[];

        constructor(codeSujet: string) {

            let self = this;

            this.Page = "Consentement";
            this.CodeSujet = codeSujet;


            if (codeSujet.charAt(0) == "A" || codeSujet.charAt(0) == "C") {
                this.Type1 = "Jambon";
                this.Type2 = "Pizza";
                if (codeSujet.charAt(0) == "A") {
                    this.PrefScore = true;
                }
            }
            if (codeSujet.charAt(0) == "B" || codeSujet.charAt(0) == "D") {
                this.Type2 = "Jambon";
                this.Type1 = "Pizza";
                if (codeSujet.charAt(0) == "B") {
                    this.PrefScore = true;
                }
            }

            this.Date = new Date(Date.now());
            this.Aliments = [];

            let pizzas: Aliment[] = [];
            let jambons: Aliment[] = [];

            //pizzas.push(new Aliment("Pizza", "P1", "B", "4", "4", 3.9, 8.87, 0, 0));
            //pizzas.push(new Aliment("Pizza", "P2", "B", "3", "2", 2.3, 5.11, 0, 0));
            //pizzas.push(new Aliment("Pizza", "P3", "B", "3", "4", 3.1, 5.17, 0, 0));
            //pizzas.push(new Aliment("Pizza", "P4", "B", "4", "2", 3.1, 7.75, 0, 0));
            //pizzas.push(new Aliment("Pizza", "P5", "C", "3", "2", 1.5, 3.19, 0, 1));
            //pizzas.push(new Aliment("Pizza", "P6", "C", "4", "2", 2.3, 2.88, 0, 1));
            //pizzas.push(new Aliment("Pizza", "P7", "C", "4", "4", 3.1, 6.89, 0, 1));
            //pizzas.push(new Aliment("Pizza", "P8", "C", "3", "4", 2.3, 5.48, 0, 1));

            pizzas.push(new Aliment("Pizza", "P1", "B", "O", 2.60, 0, 0));
            pizzas.push(new Aliment("Pizza", "P2", "B", "N", 2.40, 0, 0));
            pizzas.push(new Aliment("Pizza", "P3", "B", "O", 3.60, 0, 0));
            pizzas.push(new Aliment("Pizza", "P4", "B", "N", 3.20, 0, 0));
            pizzas.push(new Aliment("Pizza", "P5", "C", "N", 2.20, 0, 0));
            pizzas.push(new Aliment("Pizza", "P6", "C", "N", 2.80, 0, 0));
            pizzas.push(new Aliment("Pizza", "P7", "C", "N", 4.20, 0, 0));
            pizzas.push(new Aliment("Pizza", "P8", "C", "N", 3.40, 0, 0));

            Framework.Array.Shuffle(pizzas);

            //jambons.push(new Aliment("Jambon", "J01", "4", "3", "4", 3.3, 20.63, 0, 0));
            //jambons.push(new Aliment("Jambon", "J05", "3", "3", "2", 2.4, 13.33, 0, 0));
            //jambons.push(new Aliment("Jambon", "J10", "3", "3", "4", 3, 21.43, 0, 0));
            //jambons.push(new Aliment("Jambon", "J11", "4", "1", "2", 2.1, 13.13, 0, 0));
            //jambons.push(new Aliment("Jambon", "J15", "2", "3", "4", 2.7, 16.88, 0, 0));
            //jambons.push(new Aliment("Jambon", "J16", "2", "1", "2", 1.5, 8.33, 0, 0));
            //jambons.push(new Aliment("Jambon", "J23", "3", "2", "2", 1.8, 12.86, 0, 0));
            //jambons.push(new Aliment("Jambon", "J27", "3", "2", "4", 2.4, 15, 0, 0));
            jambons.push(new Aliment("Jambon", "J1", "B", "O", 2.20, 0, 0));
            jambons.push(new Aliment("Jambon", "J2", "B", "N", 2.20, 0, 0));
            jambons.push(new Aliment("Jambon", "J3", "B", "O", 3.40, 0, 0));
            jambons.push(new Aliment("Jambon", "J4", "B", "N", 3.40, 0, 0));
            jambons.push(new Aliment("Jambon", "J5", "C", "N", 2.40, 0, 0));
            jambons.push(new Aliment("Jambon", "J6", "C", "N", 1.80, 0, 0));
            jambons.push(new Aliment("Jambon", "J7", "C", "N", 3.20, 0, 0));
            jambons.push(new Aliment("Jambon", "J8", "C", "N", 3.00, 0, 0));
            Framework.Array.Shuffle(jambons);

            //if (commencePar == "Pizza") {
            let index = 1;
            pizzas.forEach(p => {
                p.Position = index;
                self.Aliments.push(p);
                index++;
            });
            index = 1;
            jambons.forEach(p => {
                p.Position = index;
                self.Aliments.push(p);
                index++;
            });
        }
    }


}