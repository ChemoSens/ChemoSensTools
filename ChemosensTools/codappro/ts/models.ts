module CodAchatsModels {
    export class QuestionnaireCodAchats {
        public Code: string;
        public Aliments: Aliment[] = [];
    }

    export class Ticket {
        public Date: string;
        public Lieu: string;      

        constructor(date: string, lieu: string) {
            this.Date = date;
            this.Lieu = lieu;
        }
    }

    export class Aliment {
        public Date: string;
        public Lieu: string;
        public Menu: string;
        public PrixMenu: number;
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
        public Image: string;
    }


}