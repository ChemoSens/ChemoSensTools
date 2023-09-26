var CodAchatsModels;
(function (CodAchatsModels) {
    var QuestionnaireCodAchats = /** @class */ (function () {
        function QuestionnaireCodAchats() {
            this.Aliments = [];
        }
        return QuestionnaireCodAchats;
    }());
    CodAchatsModels.QuestionnaireCodAchats = QuestionnaireCodAchats;
    var Ticket = /** @class */ (function () {
        function Ticket(date, lieu) {
            this.Date = date;
            this.Lieu = lieu;
        }
        return Ticket;
    }());
    CodAchatsModels.Ticket = Ticket;
    var Aliment = /** @class */ (function () {
        function Aliment() {
            this.Appreciation = -1;
            this.Labels = [];
        }
        return Aliment;
    }());
    CodAchatsModels.Aliment = Aliment;
})(CodAchatsModels || (CodAchatsModels = {}));
//# sourceMappingURL=models.js.map