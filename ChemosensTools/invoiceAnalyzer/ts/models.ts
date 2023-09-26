module InvoiceAnalyzerModels {

    export class Invoice {
        public InvoiceNumber: string;
        public Drive: string;
        public Store: string;
        public CustomerID: string;
        public PurchaseDate: Date;
        public UploadDate: Date;
        public ListItems: InvoiceItem[];
        public WarningDuringUpload: string;
        

        public static Render(invoice: Invoice, divDetail: Framework.Form.TextElement, divItems: Framework.Form.TextElement, height: string, width: number) {

            if (divDetail != null) {
                let txt: string = "Drive : " + invoice.Drive + " (" + invoice.Store + ")" + "\n";
                txt += "Numéro de facture : " + invoice.InvoiceNumber + ", numéro de client : " + invoice.CustomerID + "\n";
                txt += "Date d'achat : " + new Date(invoice.PurchaseDate.toString()).toLocaleDateString() + ", date d'envoi : " + new Date(invoice.UploadDate.toString()).toLocaleDateString() + "\n";
                txt += "Nombre d'aliments : " + invoice.ListItems.length + "\n";
                txt += invoice.WarningDuringUpload;

                divDetail.Set(txt);
            }
                       
            let table: Framework.Form.Table<InvoiceItem> = new Framework.Form.Table<InvoiceItem>();
            table.CanSelect = false;
            table.ShowFooter = false;
            table.ListData = invoice.ListItems;
            table.Height = height;
            table.FullWidth = false;
            //table.TopFilter = ["Rayon"];

            let renderCiqualFunction = (val, row) => {
                if (row["CIQUAL"] != null) {
                    let res:string = (<string>row["CIQUAL"]);
                    let index = res.indexOf(">>");
                    
                    if (index > -1) {
                        res = "<span style='color:darkgreen'>" + res + "</span>";
                        res = res.replace(">>", "</span>>><span style='color:green;font-weight:bold'>")
                    }
                    else {
                        res = "<span style='color:red'>" + res + "</span>";
                    }

                    return res;
                }
                return "";
            }

            //
            table.AddCol("Designation", "Designation", 400, "left");  
            table.AddCol("Quantite", "Qtte", 50, "center");  
            table.AddCol("Conditionnement", "Conditionnement", 100, "center");  
            table.AddCol("PUTTC", "PUTTC", 50, "center");  
            //table.AddCol("TVA", "TVA", 50, "center");  
            //table.AddCol("Allegations", "Allegations", 100, "left");  
            table.AddCol("Rayon", "Rayon", 250, "left");            
            table.AddCol("CIQUAL", "CIQUAL", 900, "left");  
            //table.AddCol("ScoreEF", "Score EF", 70, "center");  
            table.Render(divItems.HtmlElement, width);
        }
        
    }

    export class InvoiceItem {
        public Rayon: string;        
        public Designation: string;
        public Quantite: number;
        public Conditionnement: string;
        public PUHT: number;
        public TVA: number;
        public Allegations: string[];
        public CIQUAL: string;
        public ScoreEF: number;
    }

}