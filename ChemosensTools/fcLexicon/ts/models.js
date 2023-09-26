var FcLexiconModels;
(function (FcLexiconModels) {
    var Pretraitement = /** @class */ (function () {
        function Pretraitement() {
        }
        return Pretraitement;
    }());
    FcLexiconModels.Pretraitement = Pretraitement;
    var AnalysisOption = /** @class */ (function () {
        function AnalysisOption() {
            this.ExcludedModalities = [];
            this.Alpha = 0.05;
            this.Lexicon = "Lexicon";
            this.CategorieProduit = "";
            this.Correction = true;
            this.MRCA = true;
            this.TableauDescripteur = true;
        }
        return AnalysisOption;
    }());
    FcLexiconModels.AnalysisOption = AnalysisOption;
})(FcLexiconModels || (FcLexiconModels = {}));
//# sourceMappingURL=models.js.map