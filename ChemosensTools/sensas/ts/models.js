var Models;
(function (Models) {
    var Aliment = /** @class */ (function () {
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
        function Aliment(type, code, nutriscore, prefscore, prixUnitaire, quantite, position) {
            this.RaisonPrix = 0;
            this.RaisonDejaGoute = 0;
            this.RaisonNutriscore = 0;
            this.RaisonPrefscore = 0;
            this.RaisonEnvironnement = 0;
            this.RaisonMarque = 0;
            this.RaisonNouveaute = 0;
            this.RaisonAutre = 0;
            this.RaisonAutreDetail = "";
            this.Type = type;
            this.Code = code;
            this.NutriScore = nutriscore;
            this.PrefScore = prefscore;
            this.PrixUnitaire = prixUnitaire;
            this.Quantite = quantite;
            this.Position = position;
        }
        return Aliment;
    }());
    Models.Aliment = Aliment;
    var Questionnaire = /** @class */ (function () {
        function Questionnaire(codeSujet) {
            this.PrefScore = false;
            var self = this;
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
            var pizzas = [];
            var jambons = [];
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
            var index = 1;
            pizzas.forEach(function (p) {
                p.Position = index;
                self.Aliments.push(p);
                index++;
            });
            index = 1;
            jambons.forEach(function (p) {
                p.Position = index;
                self.Aliments.push(p);
                index++;
            });
        }
        return Questionnaire;
    }());
    Models.Questionnaire = Questionnaire;
})(Models || (Models = {}));
//# sourceMappingURL=models.js.map