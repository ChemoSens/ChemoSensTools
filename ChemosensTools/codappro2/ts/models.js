var CodApproModels;
(function (CodApproModels) {
    var Config = /** @class */ (function () {
        function Config() {
            this.ListOptions = [];
            this.ListAliments = [];
            this.ListCategorie1 = [];
            this.ListCategorie2 = [];
            this.ListLieuxAchats = [];
            this.ListTextes = [];
            this.ListLabels = [];
        }
        return Config;
    }());
    CodApproModels.Config = Config;
    var Questionnaire = /** @class */ (function () {
        function Questionnaire() {
            this.Aliments = [];
        }
        return Questionnaire;
    }());
    CodApproModels.Questionnaire = Questionnaire;
    var Ticket = /** @class */ (function () {
        function Ticket() {
            this.Code = "";
            this.Date = new Date(Date.now()).toLocaleDateString('en-CA');
            this.Lieu = "";
            this.Image = "";
        }
        ;
        return Ticket;
    }());
    CodApproModels.Ticket = Ticket;
    var Aliment = /** @class */ (function () {
        function Aliment() {
            this.Appreciation = -1;
            this.Labels = [];
        }
        return Aliment;
    }());
    CodApproModels.Aliment = Aliment;
})(CodApproModels || (CodApproModels = {}));
//# sourceMappingURL=models.js.map