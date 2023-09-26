var InvoiceAnalyzerModels;
(function (InvoiceAnalyzerModels) {
    var Invoice = /** @class */ (function () {
        function Invoice() {
        }
        Invoice.Render = function (invoice, divDetail, divItems, height, width) {
            if (divDetail != null) {
                var txt = "Drive : " + invoice.Drive + " (" + invoice.Store + ")" + "\n";
                txt += "Numéro de facture : " + invoice.InvoiceNumber + ", numéro de client : " + invoice.CustomerID + "\n";
                txt += "Date d'achat : " + new Date(invoice.PurchaseDate.toString()).toLocaleDateString() + ", date d'envoi : " + new Date(invoice.UploadDate.toString()).toLocaleDateString() + "\n";
                txt += "Nombre d'aliments : " + invoice.ListItems.length + "\n";
                txt += invoice.WarningDuringUpload;
                divDetail.Set(txt);
            }
            var table = new Framework.Form.Table();
            table.CanSelect = false;
            table.ShowFooter = false;
            table.ListData = invoice.ListItems;
            table.Height = height;
            table.FullWidth = false;
            //table.TopFilter = ["Rayon"];
            var renderCiqualFunction = function (val, row) {
                if (row["CIQUAL"] != null) {
                    var res = row["CIQUAL"];
                    var index = res.indexOf(">>");
                    if (index > -1) {
                        res = "<span style='color:darkgreen'>" + res + "</span>";
                        res = res.replace(">>", "</span>>><span style='color:green;font-weight:bold'>");
                    }
                    else {
                        res = "<span style='color:red'>" + res + "</span>";
                    }
                    return res;
                }
                return "";
            };
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
        };
        return Invoice;
    }());
    InvoiceAnalyzerModels.Invoice = Invoice;
    var InvoiceItem = /** @class */ (function () {
        function InvoiceItem() {
        }
        return InvoiceItem;
    }());
    InvoiceAnalyzerModels.InvoiceItem = InvoiceItem;
})(InvoiceAnalyzerModels || (InvoiceAnalyzerModels = {}));
//# sourceMappingURL=models.js.map