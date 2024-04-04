module CodApproModels {

    export class Config {
        public Questionnaire: Questionnaire;                
        public ListOptions: string[] = [];
        public ListAliments: Aliment[] = [];
        public ListCategorie1: Framework.KeyValuePair[] = [];
        public ListCategorie2: Framework.KeyValuePair[] = [];
        public ListLieuxAchats: Framework.KeyValuePair[] = [];
        public ListTextes: Framework.KeyValuePair[] = [];
        public ListLabels: Framework.KeyValuePair[] = [];
    }

    export class Questionnaire {
        public Code: string;
        public Tickets: Ticket[];
        public Aliments: Aliment[] = [];
    }
    export class Ticket {
        public Code: string = "";
        public Date: string = new Date(Date.now()).toLocaleDateString('en-CA');;
        public Lieu: string = "";   
        public Image: string = "";

        constructor() {         
        }
    }

    export class Aliment {
        public TicketCode: string;
        public Date: string;
        public Lieu: string;
        public Menu: string;
        public PrixMenu: number;
        public Code: string;
        public CodeCIQUAL: string;
        public LibelleCIQUAL: string;
        public LibelleCustom: string;
        public Categorie1: string;
        public Categorie2: string;
        public Unite: string;
        public Nb: number;
        public Prix: number;
        public Appreciation: number = -1;
        public Labels: string[] = [];
        public PrixMin: number;
        public PrixMax: number;
        public PrixMinEpicerie: number;
        public PrixMaxEpicerie: number;
        public PoidsUnitaire: number;
        public MontantChequeAlimentaire: number;
        public DateSaisie: string;
        public DateModif: string;        
    }


}