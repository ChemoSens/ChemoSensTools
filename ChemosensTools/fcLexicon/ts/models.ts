module FcLexiconModels {

    export class Pretraitement {        
        public AttributeFR: string;
        public FullConceptFR: string ;
        public Modality: string ;
        public ProductCategory: string ;
        public Preposition: string ;
        public Valence: string;
        public Word: string;

        public Descriptor: string;        
        public RootConcept: string;
        public PredecessorConcep: string;
    }

    export class AnalysisOption {
        public ExcludedModalities: string[] = [];
        public Alpha: number = 0.05;        
        public Lexicon: string = "Lexicon";
        public CategorieProduit: string = "";
        public Correction: boolean = true;
        public MRCA: boolean = true;
        public TableauDescripteur: boolean = true;
    }
    
}