var FcLexiconModels;
(function (FcLexiconModels) {
    var Pretraitement = /** @class */ (function () {
        function Pretraitement() {
        }
        return Pretraitement;
    }());
    FcLexiconModels.Pretraitement = Pretraitement;
    var Result = /** @class */ (function () {
        function Result() {
        }
        return Result;
    }());
    FcLexiconModels.Result = Result;
    var AnalysisOption = /** @class */ (function () {
        function AnalysisOption() {
            this.ExcludedWords = [];
            this.ExcludedModalities = [];
            this.Alpha = 0.05;
            this.Lexicon = "Lexicon";
            this.CategorieProduit = "";
            this.Correction = true;
            this.MRCA = false;
            this.TableauDescripteur = false;
        }
        return AnalysisOption;
    }());
    FcLexiconModels.AnalysisOption = AnalysisOption;
})(FcLexiconModels || (FcLexiconModels = {}));
//# sourceMappingURL=models.js.map