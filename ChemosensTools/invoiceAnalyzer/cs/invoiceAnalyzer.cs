using ChemosensTools.Framework.cs;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using Newtonsoft.Json;
using Org.BouncyCastle.Utilities.Encoders;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Text.RegularExpressions;
using static ChemosensTools.labelExtractor.csModels.LabelExtractor;
using static ChemosensTools.ciqualClassifier.csModels.ciqualClassifier;

namespace ChemosensTools.invoiceAnalyzer.cs
{
    public class InvoiceAnalyzer
    {
        public class Rayon
        {
            public string Nom;
            public int Index;
            public bool AddToInvoice;

            public static List<Rayon> Get(string drive = "Leclerc")
            {
                List<Rayon> list = new List<Rayon>();
                list.Add(new Rayon() { Nom = "BIO", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "VIANDES POISSONS", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "FRUITS LÉGUMES", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "PAINS PÂTISSERIES", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "FRAIS", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "SURGELÉS", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "EPICERIE SALÉE", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "EPICERIE SUCRÉE", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "BOISSONS", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "BÉBÉ", Index = 0, AddToInvoice = true });
                list.Add(new Rayon() { Nom = "PARAPHARMACIE", Index = 0, AddToInvoice = false });
                list.Add(new Rayon() { Nom = "HYGIÈNE BEAUTÉ", Index = 0, AddToInvoice = false });
                list.Add(new Rayon() { Nom = "ANIMALERIE", Index = 0, AddToInvoice = false });
                list.Add(new Rayon() { Nom = "BAZAR TEXTILE", Index = 0, AddToInvoice = false });
                list.Add(new Rayon() { Nom = "ENTRETIEN NETTOYAGE", Index = 0, AddToInvoice = false });
                list.Add(new Rayon() { Nom = "MAISON JARDIN", Index = 0, AddToInvoice = false });
                return list;
            }
        }

        public class InvoiceItem
        {

            public string Rayon; // Facture
            public string Designation; // Facture
            public int Quantite; // Facture
            public double PUHT; // Facture
            public double PUTTC; // Facture
            public double TVA; // Facture
            public string Conditionnement; // Facture



            // Obtenu avec labelExtractor
            public string CIQUAL;
            public List<string> Allegations = new List<string>();
            public double? ScoreEF;

            public void Complete(string designationPassageFilePath)
            {
                CleanContext cc = CleanContext.FromExcel(designationPassageFilePath, new List<int>() { 0 }, new List<int>() { 1, 2, 3, 4 }, 5, 6);
                string txt = this.Designation;
                if (this.Rayon == "SURGELÉS")
                {
                    txt += " surgelé";
                }
                CleanDesignationResult res = cc.CleanDesignation(txt);
                this.CIQUAL = res.Ciqual;
                this.Allegations = res.Allegations;
                this.ScoreEF = res.EF;
            }
        }

        public class Invoice
        {
            public string InvoiceNumber;
            public string Drive;
            public string Store;
            public string CustomerID;
            public DateTime PurchaseDate;
            public DateTime UploadDate;
            public List<InvoiceItem> ListItems;
            public string WarningDuringUpload = "";

            public string Texte; // Texte sur la facture

            public Invoice()
            {
                this.UploadDate = DateTime.Now;
                this.ListItems = new List<InvoiceItem>(); ;
            }

            public bool Save(string path)
            {
                bool exists = false;
                string json = JsonConvert.SerializeObject(this);
                string f = path + "\\" + this.InvoiceNumber + ".json";
                if (File.Exists(f))
                {
                    this.WarningDuringUpload += "La facture a déjà été uploadée.";
                }
                File.WriteAllText(f, json);
                return exists;
            }

            public override string ToString()
            {
                string res = JsonConvert.SerializeObject(this);
                return res;
            }

            public static Invoice FromInvoiceNumber(string invoiceNumber)
            {
                string json = File.ReadAllText(ConfigurationManager.AppSettings["InvoiceDirPath"] + invoiceNumber + ".json");
                return JsonConvert.DeserializeObject<Invoice>(json);
            }

            public static string UploadInvoice(string fileContent, string path = "", string designationPassageFilePath = "", int delay = 0)
            {
                fileContent = fileContent.Replace("data:application/pdf;base64,", "");

                //var pdfReader = new PdfReader(Base64.Decode(fileContent));
                var pdfReader = new PdfReader(Convert.FromBase64String(fileContent));

                Invoice invoice = new Invoice();

                string typePdf = "";


                for (int i = 0; i < pdfReader.NumberOfPages; i++)
                {
                    var locationTextExtractionStrategy = new SimpleTextExtractionStrategy();

                    string textFromPage = PdfTextExtractor.GetTextFromPage(pdfReader, i + 1, locationTextExtractionStrategy);

                    textFromPage = Encoding.UTF8.GetString(Encoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(textFromPage)));

                    if (i == 0)
                    {

                        if (textFromPage.ToLower().Contains("leclerc") == false)
                        {
                            throw new FaultException(new FaultReason("Facture Leclerc drive exclusivement."), new FaultCode("Facture Leclerc drive exclusivement."));
                        }




                        string startText = "";
                        //int indexStore = -1;

                        if (textFromPage.ToLower().Contains("facture"))
                        {
                            //invoice.InvoiceNumber = textFromPage.Substring(10, 10);
                            invoice.InvoiceNumber = textFromPage.Substring(textFromPage.IndexOf("FACTURE N°") + 10, 10);
                            typePdf = "facture";
                            startText = "Date impression";
                            string dateFacture = textFromPage.Substring(textFromPage.IndexOf("du") + 3, 18);
                            invoice.PurchaseDate = new DateTime(Convert.ToInt16(dateFacture.Substring(6, 4)), Convert.ToInt16(dateFacture.Substring(3, 2)), Convert.ToInt16(dateFacture.Substring(0, 2)), Convert.ToInt16(dateFacture.Substring(13, 2)), Convert.ToInt16(dateFacture.Substring(16, 2)), 0);
                            //indexStore = 11;
                        }
                        else if (textFromPage.ToLower().Contains("bon de commande"))
                        {
                            typePdf = "bon";
                            startText = "Détail de votre commande";
                            string dateFacture = textFromPage.Substring(textFromPage.IndexOf("RETRAIT LE ") + 11, 8);
                            invoice.PurchaseDate = new DateTime(2000 + Convert.ToInt16(dateFacture.Substring(6, 2)), Convert.ToInt16(dateFacture.Substring(3, 2)), Convert.ToInt16(dateFacture.Substring(0, 2)));
                            //indexStore = 10;
                        }
                        else
                        {
                            throw new FaultException(new FaultReason("Facture Leclerc uniquement."), new FaultCode("Facture Leclerc uniquement."));
                        }




                        invoice.Drive = "LECLERC";

                        //if (delay > 0)
                        //{
                        //    if (invoice.PurchaseDate < DateTime.Now.AddDays(-delay))
                        //    {
                        //        throw new FaultException(new FaultReason("INVOICE_TOO_OLD"), new FaultCode("INVOICE_TOO_OLD"));
                        //    }
                        //}

                        string[] header = textFromPage.Substring(0, textFromPage.IndexOf(startText)).Split('\n');

                        string customerName = EncryptionHelper.Encrypt(header[6], header[6]);
                        byte[] data = Encoding.UTF8.GetBytes(customerName);
                        string b64 = Convert.ToBase64String(data);
                        invoice.CustomerID = b64;
                        //invoice.Store = header[indexStore];

                        Regex r = new Regex(@"(21)(\d+){3}( )");
                        List<string> l = r.Matches(textFromPage.Substring(0, textFromPage.IndexOf(startText))).OfType<Match>()
                            .Select(m => m.Groups[0].Value)
                            .ToList();

                        if (l.Count > 0)
                        {
                            string[] elmnts = l.ElementAt(0).Split(' ');
                            if (elmnts.Count() == 2)
                            {
                                invoice.Store = l.ElementAt(0);
                            }
                        }

                    }

                    string textCommande = "";

                    int debut = textFromPage.IndexOf("Total TTC") + 9;
                    int factureEnd = -1;
                    if (textFromPage.Contains("Total commande"))
                    {
                        factureEnd = textFromPage.IndexOf("Total commande");
                        i = 100;
                    }
                    else if (textFromPage.Contains("Total de la commande"))
                    {
                        factureEnd = textFromPage.IndexOf("Total de la commande");
                        i = 100;
                    }

                    if (factureEnd == -1)
                    {
                        factureEnd = textFromPage.LastIndexOf(i + 1 + "/" + pdfReader.NumberOfPages);
                    }
                    if (factureEnd == 0)
                    {
                        textCommande = "";
                    }
                    else
                    {
                        textCommande = textFromPage.Substring(debut, factureEnd - debut);
                        textCommande = textCommande.Replace(" Taux TVA Quantité Prix unitaire HT", "").Replace(" Prix unitaire TTC Quantité Désignation", "");
                    }

                    invoice.Texte += textCommande;




                }

                int posTotalTTC = -1;
                int posTVA = -1;
                int posPUHT = -1;
                int posQtte = -1;
                int index1 = -1;
                int index2 = -1;



                List<Rayon> families = Rayon.Get();

                for (int j = 0; j < families.Count; j++)
                {
                    families[j].Index = invoice.Texte.IndexOf(families[j].Nom);
                }

                families = families.Where(x => x.Index > 0).OrderBy(x => x.Index).ToList();

                for (int k = 0; k < families.Count; k++)
                {
                    int start = families[k].Index + families[k].Nom.Length;
                    int stop = invoice.Texte.Length;
                    if (k != families.Count - 1)
                    {
                        stop = families[k + 1].Index;
                    }

                    string textItems = invoice.Texte.Substring(start, stop - start);
                    textItems = textItems.Substring(textItems.IndexOf('\n') + 1);



                    List<string> items = new List<string>();

                    if (typePdf == "facture")
                    {
                        items = textItems.Trim().Replace("\n ", " ").Replace("  ", " ").Split('\n').ToList();
                    }
                    if (typePdf == "bon")
                    {
                        items = textItems.Trim().Replace("  ", " ").Split('\n').ToList();
                    }

                    items.ForEach((x) =>
                    {
                        string[] elements = x.Trim().Split(' ');

                        if (typePdf == "facture")
                        {
                            posTotalTTC = elements.Length - 1;
                            posTVA = posTotalTTC - 1;
                            posPUHT = posTotalTTC - 2;
                            posQtte = posTotalTTC - 3;
                            index1 = 0;
                            index2 = posQtte;
                        }
                        if (typePdf == "bon")
                        {
                            posTotalTTC = 0;
                            posPUHT = 2;
                            posQtte = 1;
                            index1 = 3;
                            index2 = elements.Length;
                        }


                        string first = elements[0];
                        if ((typePdf == "facture" && first != "" && Char.IsLetter(first[0])) || (typePdf == "bon" && first != "" && Char.IsDigit(first[0])))
                        {
                            string designation = "";

                            for (int j = index1; j < index2; j++)
                            {
                                designation += elements[j] + " ";
                            }

                            designation = Regex.Replace(designation, @"\s+", " ").Trim(' ');

                            int quantite = 0;
                            double puht = 0;
                            double tva = 0;

                            try
                            {
                                quantite = Convert.ToInt32(elements[posQtte]);
                                puht = double.Parse(elements[posPUHT], CultureInfo.InvariantCulture);
                                if (posTVA > -1)
                                {
                                    tva = double.Parse(elements[posTVA], CultureInfo.InvariantCulture);
                                }
                            }
                            catch
                            {
                                invoice.WarningDuringUpload = "Certaines lignes n'ont peut être pas été importées correctement.";
                            }

                            InvoiceItem obj = new InvoiceItem();
                            obj.Rayon = families[k].Nom;
                            obj.Designation = designation;
                            obj.Quantite = quantite;
                            obj.PUHT = puht;
                            obj.TVA = tva;

                            try
                            {
                                if (obj.Quantite == 0 || obj.PUHT == 0)
                                {
                                    // Recherche dans la désignation
                                    Regex r = new Regex(@"(\d+)( )(\d+){1,2}(.)(\d+){2}");
                                    List<string> l = r.Matches(obj.Designation).OfType<Match>()
                                        .Select(m => m.Groups[0].Value)
                                        .ToList();

                                    if (l.Count == 1)
                                    {
                                        string[] elmnts = l.ElementAt(0).Split(' ');
                                        if (elmnts.Count() == 2)
                                        {
                                            obj.Designation = obj.Designation.Replace(l.ElementAt(0), "");
                                            obj.Quantite = Convert.ToInt32(elmnts.ElementAt(0));
                                            obj.PUHT = Convert.ToDouble(elmnts.ElementAt(1).Replace('.', ','));
                                        }
                                    }

                                }
                            }
                            catch
                            {

                            }


                            string conditionnement = designation.ToLower().Replace(".", ",");

                            List<string> rgxToKeep = new List<string>() {
                                        "\\d+( )?x( )?\\d+( )?(g|l|kg|p|cl)",
                                        "\\d+(.d+)?( )?(g|l|kg|p|cl)",
                                        "x( )?\\d+",
                                        "\\d+( )?x( )?\\d+"

                                };


                            Regex rgx = new Regex(String.Join("|", rgxToKeep));

                            List<string> mCol = rgx.Matches(conditionnement).OfType<Match>()
                                .Select(m => m.Groups[0].Value)
                                .ToList();

                            obj.Conditionnement = string.Join(" ", mCol).Trim();

                            if (families[k].AddToInvoice == true)
                            {
                                if (designationPassageFilePath != "")
                                {
                                    obj.Complete(designationPassageFilePath);
                                }
                                if (obj.Designation != "" && obj.Quantite > 0)
                                {
                                    invoice.ListItems.Add(obj);
                                }
                            }
                        }

                    });
                }


                if (path != "")
                {
                    invoice.Save(path);
                }
                return invoice.ToString();

            }

            public static string Upload(string fileContent, string path = "", string designationPassageFilePath = "", int delay = 0)
            {
                try
                {

                    Classifier classifier = GetClassifier();

                    fileContent = fileContent.Replace("data:application/pdf;base64,", "");

                    //var pdfReader = new PdfReader(Base64.Decode(fileContent));
                    var pdfReader = new PdfReader(Convert.FromBase64String(fileContent));

                    Invoice invoice = new Invoice();

                    string typePdf = "";
                    string drive = "";

                    List<string> rgxConditionnement = new List<string>() {
                                        "\\d+( )?x( )?\\d+( )?(g|l|kg|p|cl|ml)",
                                        "\\d+(.d+)?( )?(g|l|kg|p|cl|ml)",
                                        "x( )?\\d+",
                                        "\\d+( )?x( )?\\d+"
                                };

                    // A supprimer dans la facture
                    List<string> listRegex = new List<string>();

                    string separator = "\n";

                    // Données sur les produits
                    string textFromPage = "";

                    // Conversion du PDF en texte
                    SimpleTextExtractionStrategy locationTextExtractionStrategy = new SimpleTextExtractionStrategy();

                    for (int i = 0; i < pdfReader.NumberOfPages; i++)
                    {

                        textFromPage = PdfTextExtractor.GetTextFromPage(pdfReader, i + 1, locationTextExtractionStrategy);
                        textFromPage = Encoding.UTF8.GetString(Encoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(textFromPage)));

                        if (i == 0)
                        {
                            // Première page : détermination de l'enseigne
                            if (textFromPage.ToLower().Contains("leclerc") == true)
                            {
                                drive = "leclerc";

                                try
                                {
                                    Regex rgx2 = new Regex("du ((.)*) à");
                                    Match m2 = rgx2.Match(textFromPage);
                                    string dateFacture = m2.Groups[1].Value.Trim();
                                    invoice.PurchaseDate = new DateTime(Convert.ToInt16(dateFacture.Substring(6, 4)), Convert.ToInt16(dateFacture.Substring(3, 2)), Convert.ToInt16(dateFacture.Substring(0, 2)), 0, 0, 0);
                                }
                                catch
                                {

                                }

                                if (textFromPage.ToLower().Contains("facture"))
                                {
                                    try
                                    {
                                        typePdf = "facture";
                                        Regex rgx = new Regex("FACTURE N°((.)*)\\n");
                                        Match m = rgx.Match(textFromPage);
                                        invoice.InvoiceNumber = m.Groups[1].Value;
                                    }
                                    catch
                                    {

                                    }
                                    //TODO
                                    //Regex rgx3 = new Regex("Leclerc(.)*(\\d+){5}");
                                    //Match m3 = rgx3.Match(textFromPage);
                                    //invoice.Store = m3.Groups[0].Value.Trim();
                                    //Regex rgx4 = new Regex("Adresse de facturation\\n(.)*\\n");
                                    //Match m4 = rgx4.Match(textFromPage);
                                    //invoice.CustomerID = m4.Groups[0].Value.Replace("Adresse de facturation", "").Trim();
                                }
                                else if (textFromPage.ToLower().Contains("bon de commande"))
                                {
                                    typePdf = "bon";
                                    try
                                    {
                                        Regex rgx = new Regex("commande n°(\\d+)");
                                        Match m = rgx.Match(textFromPage);
                                        invoice.InvoiceNumber = m.Groups[1].Value;
                                    }
                                    catch
                                    {

                                    }

                                    try
                                    {
                                        Regex rgx3 = new Regex("au E.Leclerc DRIVE (.)*\n");
                                        Match m3 = rgx3.Match(textFromPage);
                                        invoice.Store = m3.Groups[0].Value.Replace("au E.Leclerc DRIVE", "").Trim();
                                    }
                                    catch
                                    {

                                    }
                                    //TODO
                                    //Regex rgx4 = new Regex("Adresse de facturation\\n(.)*\\n");
                                    //Match m4 = rgx4.Match(textFromPage);
                                    //invoice.CustomerID = m4.Groups[0].Value.Replace("Adresse de facturation", "").Trim();                                
                                }
                                else
                                {
                                    throw new FaultException(new FaultReason("Facture non reconnue."), new FaultCode("Facture non reconnue."));
                                }
                            }
                            else if (textFromPage.ToLower().Contains("carrefour") == true)
                            {
                                drive = "carrefour";
                                try
                                {
                                    Regex rgx = new Regex("N° de facture((.)*)\\n");
                                    Match m = rgx.Match(textFromPage);
                                    invoice.InvoiceNumber = m.Groups[1].Value;
                                }
                                catch
                                {

                                }
                                typePdf = "facture";
                                try
                                {
                                    Regex rgx2 = new Regex("Date de commande((.)*) Date de Facturation");
                                    Match m2 = rgx2.Match(textFromPage);
                                    string dateFacture = m2.Groups[1].Value.Trim();
                                    invoice.PurchaseDate = new DateTime(Convert.ToInt16(dateFacture.Substring(6, 4)), Convert.ToInt16(dateFacture.Substring(3, 2)), Convert.ToInt16(dateFacture.Substring(0, 2)), 0, 0, 0);
                                }
                                catch
                                {

                                }
                                try
                                {
                                    Regex rgx3 = new Regex("CARREFOUR(.)*\\n");
                                    Match m3 = rgx3.Match(textFromPage);
                                    invoice.Store = m3.Groups[0].Value.Trim();
                                }
                                catch
                                {

                                }
                                try
                                {
                                    Regex rgx4 = new Regex("Adresse de facturation\\n(.)*\\n");
                                    Match m4 = rgx4.Match(textFromPage);
                                    invoice.CustomerID = m4.Groups[0].Value.Replace("Adresse de facturation", "").Trim();
                                }
                                catch
                                {

                                }
                            }
                            else if (textFromPage.ToLower().Contains("intermarché") == true)
                            {
                                drive = "intermarché";
                                try
                                {
                                    Regex rgx = new Regex("N° de la commande((.)*)\\n");
                                    Match m = rgx.Match(textFromPage);
                                    invoice.InvoiceNumber = m.Groups[1].Value;
                                }
                                catch
                                {

                                }
                                typePdf = "facture";
                                try
                                {
                                    Regex rgx2 = new Regex("Date de la commande((.)*)\\n");
                                    Match m2 = rgx2.Match(textFromPage);
                                    string dateFacture = m2.Groups[1].Value.Trim();
                                    invoice.PurchaseDate = new DateTime(Convert.ToInt16(dateFacture.Substring(6, 4)), Convert.ToInt16(dateFacture.Substring(3, 2)), Convert.ToInt16(dateFacture.Substring(0, 2)), 0, 0, 0);
                                }
                                catch
                                {

                                }
                                try
                                {
                                    Regex rgx3 = new Regex("Intermarché Super Alim.(.)*\\n");
                                    Match m3 = rgx3.Match(textFromPage);
                                    invoice.Store = m3.Groups[0].Value.Replace("Intermarché Super Alim.", "").Trim();
                                }
                                catch
                                {

                                }
                                //TODO
                                //Regex rgx4 = new Regex("Adresse de facturation\\n(.)*\\n");
                                //Match m4 = rgx4.Match(textFromPage);
                                //invoice.CustomerID = m4.Groups[0].Value.Replace("Adresse de facturation", "").Trim();
                            }
                            else if (textFromPage.ToLower().Contains("cora") == true)
                            {
                                drive = "cora";
                                try
                                {
                                    Regex rgx = new Regex("Votre commande (.)* \\(CB\\)");
                                    Match m = rgx.Match(textFromPage);
                                    invoice.InvoiceNumber = m.Groups[0].Value.Replace("Votre commande ", "").Replace(" (CB)", "");
                                }
                                catch
                                {

                                }
                                typePdf = "facture";
                                //TODO
                                //Regex rgx2 = new Regex("Date de la commande((.)*)\\n");
                                //Match m2 = rgx2.Match(textFromPage);
                                //string dateFacture = m2.Groups[1].Value.Trim();                            
                                //invoice.PurchaseDate = new DateTime(Convert.ToInt16(dateFacture.Substring(6, 4)), Convert.ToInt16(dateFacture.Substring(3, 2)), Convert.ToInt16(dateFacture.Substring(0, 2)), 0, 0, 0);
                                //TODO
                                try
                                {
                                    Regex rgx3 = new Regex("Hypermarché Cora\\n(.)*\\n");
                                    Match m3 = rgx3.Match(textFromPage);
                                    invoice.Store = m3.Groups[0].Value.Replace("Hypermarché Cora\n", "").Trim();
                                }
                                catch
                                {

                                }
                                //TODO
                                //Regex rgx4 = new Regex("Adresse de facturation\\n(.)*\\n");
                                //Match m4 = rgx4.Match(textFromPage);
                                //invoice.CustomerID = m4.Groups[0].Value.Replace("Adresse de facturation", "").Trim();
                            }
                            else if (textFromPage.ToLower().Contains("auchan") == true)
                            {
                                drive = "auchan";
                                try
                                {
                                    Regex rgx = new Regex("COMMANDE N° (.)*");
                                    Match m = rgx.Match(textFromPage);
                                    invoice.InvoiceNumber = m.Groups[0].Value.Replace("COMMANDE N° ", "");
                                }
                                catch
                                {

                                }
                                typePdf = "facture";
                                //TODO
                                //Regex rgx2 = new Regex("Date de la commande((.)*)\\n");
                                //Match m2 = rgx2.Match(textFromPage);
                                //string dateFacture = m2.Groups[1].Value.Trim();                            
                                //invoice.PurchaseDate = new DateTime(Convert.ToInt16(dateFacture.Substring(6, 4)), Convert.ToInt16(dateFacture.Substring(3, 2)), Convert.ToInt16(dateFacture.Substring(0, 2)), 0, 0, 0);
                                //TODO
                                //Regex rgx3 = new Regex("Hypermarché Cora\\n(.)*\\n");
                                //Match m3 = rgx3.Match(textFromPage);
                                //invoice.Store = m3.Groups[0].Value.Replace("Hypermarché Cora\n", "").Trim();
                                //TODO
                                //Regex rgx4 = new Regex("Adresse de facturation\\n(.)*\\n");
                                //Match m4 = rgx4.Match(textFromPage);
                                //invoice.CustomerID = m4.Groups[0].Value.Replace("Adresse de facturation", "").Trim();
                            }

                            if (drive == "")
                            {
                                throw new FaultException(new FaultReason("Facture non reconnue."), new FaultCode("Facture non reconnue."));
                            }

                            // Date de la facture
                            //if (delay > 0)
                            //{
                            //    if (invoice.PurchaseDate < DateTime.Now.AddDays(-delay))
                            //    {
                            //        throw new FaultException(new FaultReason("INVOICE_TOO_OLD"), new FaultCode("INVOICE_TOO_OLD"));
                            //    }
                            //}

                        }


                    }

                    string txtFacture = textFromPage;

                    //TODO
                    //byte[] data = Encoding.UTF8.GetBytes(invoice.CustomerID);
                    //string b64 = Convert.ToBase64String(data);
                    //invoice.CustomerID = b64;

                    invoice.Drive = drive;
                    

                    string textCommande = "";
                    int posTotalTTC = 0;
                    int posQuantite = 0;
                    int posDesignation = 0;

                    if (drive == "leclerc")
                    {
                        int debut = txtFacture.IndexOf("Total TTC") + 9;
                        int factureEnd = -1;
                        if (txtFacture.Contains("Total commande"))
                        {
                            factureEnd = txtFacture.IndexOf("Total commande");
                        }
                        else if (txtFacture.Contains("Total de la commande"))
                        {
                            factureEnd = txtFacture.IndexOf("Total de la commande");
                        }

                        if (factureEnd == 0)
                        {
                            textCommande = "";
                        }
                        else
                        {
                            textCommande = txtFacture.Substring(debut, factureEnd - debut);
                        }

                        if (typePdf == "facture")
                        {
                            posTotalTTC = -1;
                            posQuantite = -4;
                            posDesignation = -4;
                        }
                        if (typePdf == "bon")
                        {
                            posTotalTTC = 0;
                            posQuantite = 1;
                            posDesignation = 3;
                        }

                        listRegex = new List<string>() {
                        "VIANDES POISSONS \\(\\d+ produits?\\)(\\n)",
                        "BIO \\(\\d+ produits?\\)(\\n)",
                        "FRUITS LÉGUMES \\(\\d+ produits?\\)(\\n)",
                        "PAINS PÂTISSERIES \\(\\d+ produits?\\)(\\n)",
                        "FRAIS \\(\\d+ produits?\\)(\\n)",
                        "SURGELÉS \\(\\d+ produits?\\)(\\n)",
                        "EPICERIE SALÉE \\(\\d+ produits?\\)(\\n)",
                        "EPICERIE SUCRÉE \\(\\d+ produits?\\)(\\n)",
                        "BOISSONS \\(\\d+ produits?\\)(\\n)",
                        "BÉBÉ \\(\\d+ produits?\\)(\\n)",
                        "PARAPHARMACIE \\(\\d+ produits?\\)(\\n)",
                        "HYGIÈNE BEAUTÉ \\(\\d+ produits?\\)(\\n)",
                        "ANIMALERIE \\(\\d+ produits?\\)(\\n)",
                        "BAZAR TEXTILE \\(\\d+ produits?\\)(\\n)",
                        "ENTRETIEN NETTOYAGE \\(\\d+ produits?\\)(\\n)",
                        "MAISON JARDIN \\(\\d+ produits?\\)(\\n)",
                        "Taux TVA(.)*(\\n)",
                        "Total TTC(.)*(\\n)",
                        "Prix unitaire(.)*(\\n)",
                        "Taux TVA Quantité Prix unitaire HT",
                        "Facture(.)*(\\n)",
                        "Date impression(.)*(\\n)",
                        "Désignation(.)*(\\n)",
                        "(\\d)(/)(\\d)(\\n)",
                    };

                    }

                    if (drive == "carrefour")
                    {
                        int debut = txtFacture.IndexOf("Montant\nTTC") + 12;
                        int factureEnd = txtFacture.LastIndexOf("CARREFOUR");

                        if (factureEnd == -1)
                        {
                            textCommande = "";
                        }
                        else
                        {
                            textCommande = txtFacture.Substring(debut, factureEnd - debut);
                        }

                        posTotalTTC = -1;
                        posQuantite = -5;
                        posDesignation = -6;

                        listRegex = new List<string>() {
                        "Remise sur le lot de produits\\n",
                        "TVA\\n%\\n",
                        "Prix Unit.\\nTTC\\n",
                        "Montant\\nremise TTC\\n",
                        "Montant\\nTTC\\n",
                        "Code EAN 13 Libellé Qté Cdée Qté livrée\\n",
                        "Remise immédiate sur le produit\\n",
                        "\\d+ Remplacé par(.)*\\n",
                        "Produit Manquant : ",
                        "(\\d)(/)(\\d)(\\n)",
                    };
                    }

                    if (drive == "intermarché")
                    {
                        int debut = txtFacture.IndexOf("Total TTC") + 9;
                        int factureEnd = txtFacture.LastIndexOf("TOTAL TVA");

                        if (factureEnd == -1)
                        {
                            textCommande = "";
                        }
                        else
                        {
                            textCommande = txtFacture.Substring(debut, factureEnd - debut);
                        }

                        posTotalTTC = -1;
                        posQuantite = -9;
                        posDesignation = -9;

                        listRegex = new List<string>() {
                        "SA (.)*\\n",
                        "Date de facturation (.)*\\n",
                        "N° de la commande (.)*\\n",
                        "Type de la commande (.)*\\n",
                        "Créneau de livraison (.)*\\n",
                        "Date de la commande (.)*\\n",
                        "Date de livraison (.)*\\n",
                        "Moyen de paiement (.)*\\n",
                        "Description Quantité\\ncommandée\\nQuantité\\nlivrée\\nTVA PV HT PV TTC Total TTC",
                        "FROMAGE À LA COUPE",
                        "\\(PROMO\\)",
                        "VOTRE POISSONNIER A SÉLECTIONNÉ",
                        "NOTRE SÉLECTION ",
                    };

                        separator = "€\n";
                    }

                    if (drive == "cora")
                    {
                        int debut = txtFacture.IndexOf("Total TTC") + 9;
                        int factureEnd = txtFacture.LastIndexOf("Sous-total de la commande");

                        if (factureEnd == -1)
                        {
                            textCommande = "";
                        }
                        else
                        {
                            textCommande = txtFacture.Substring(debut, factureEnd - debut).Replace(" €", "");
                        }

                        posTotalTTC = -1;
                        posQuantite = -3;
                        posDesignation = -4;

                        listRegex = new List<string>()
                        {
                        };

                    }

                    if (drive == "auchan")
                    {
                        int debut = txtFacture.IndexOf("PRIX TOTAL TTC (€)") + 18;
                        int factureEnd = txtFacture.LastIndexOf("TOTAL TTC");

                        if (factureEnd == -1)
                        {
                            textCommande = "";
                        }
                        else
                        {
                            textCommande = txtFacture.Substring(debut, factureEnd - debut).Replace(" €", "");
                        }

                        Regex rgx = new Regex("(\\d){13}");
                        MatchCollection m = rgx.Matches(textCommande);
                        for (int i = 0; i < m.Count; i++)
                        {
                            string ean = m[i].Groups[0].Value;
                            textCommande = textCommande.Replace(ean, "|||");
                        }
                        //3292070005161
                        textCommande = textCommande.Replace("\n", " ");

                        posTotalTTC = -1;
                        posQuantite = -5;
                        posDesignation = -5;

                        listRegex = new List<string>()
                    {
                        "\\d+ Frais de Livraison(.)*\\n",
                    };

                        separator = "|||";
                    }




                    listRegex.ForEach(x =>
                    {
                        Regex rgx = new Regex(x);
                        textCommande = rgx.Replace(textCommande, "");
                    });

                    invoice.Texte = textCommande;

                    List<string> lines = textCommande.Split(new string[] { separator }, StringSplitOptions.None).Where(x => x != "").ToList();
                    lines.ForEach(line =>
                    {
                        try
                        {
                            List<string> elements = line.Split(' ').Where(x => x != "").ToList();
                            if (elements.Count > 1)
                            {
                                InvoiceItem obj = new InvoiceItem();

                                double totalttc;
                                if (posTotalTTC < 0)
                                {
                                    totalttc = double.Parse(elements.ElementAt(elements.Count + posTotalTTC).Replace(",", "."), CultureInfo.InvariantCulture);
                                }
                                else
                                {
                                    totalttc = double.Parse(elements.ElementAt(posTotalTTC).Replace(",", "."), CultureInfo.InvariantCulture);
                                }


                                if (posQuantite < 0)
                                {
                                    try
                                    {
                                        obj.Quantite = Convert.ToInt32(elements.ElementAt(elements.Count + posQuantite));
                                    }
                                    catch
                                    {
                                        obj.Quantite = 1;
                                    }
                                }
                                else
                                {
                                    try
                                    {
                                        obj.Quantite = Convert.ToInt32(elements.ElementAt(posQuantite));
                                    }
                                    catch
                                    {
                                        obj.Quantite = 1;
                                    }
                                }


                                obj.PUTTC = Math.Round(totalttc / obj.Quantite, 2);
                                if (totalttc == 0 && drive == "carrefour")
                                {
                                    obj.PUTTC = double.Parse(elements.ElementAt(elements.Count + posTotalTTC - 1), CultureInfo.InvariantCulture);
                                }

                                if (posDesignation < 0)
                                {
                                    if (drive == "carrefour")
                                    {
                                        obj.Designation += string.Join(" ", elements.Skip(1).Take(elements.Count + posDesignation));
                                    }
                                    else
                                    {
                                        obj.Designation += string.Join(" ", elements.Take(elements.Count + posDesignation));
                                    }
                                }
                                else
                                {
                                    obj.Designation += string.Join(" ", elements.Skip(posDesignation));
                                }

                                string conditionnement = obj.Designation.ToLower().Replace(".", ",");
                                Regex rgx = new Regex(String.Join("|", rgxConditionnement));
                                List<string> mCol = rgx.Matches(conditionnement).OfType<Match>()
                                    .Select(m => m.Groups[0].Value)
                                    .ToList();
                                obj.Conditionnement = string.Join(" ", mCol).Trim();

                                ClassifiedItem item = ClassifyDesignation2(obj.Designation, "", classifier);
                                obj.CIQUAL = item.Ciqual;
                                obj.Rayon = item.Rayon;

                                if (item.Ciqual != null && item.Ciqual != "Non alimentaire" && obj.Quantite > 0)
                                {
                                    invoice.ListItems.Add(obj);
                                }

                            }
                        }
                        catch
                        {

                        }
                    });

                    if (path != "")
                    {
                        invoice.Save(path);
                    }
                    return invoice.ToString();

                }
                catch (Exception ex)
                {
                    if (ex is FaultException)
                    {
                        throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
                    }
                    else
                    {
                        throw new FaultException(new FaultReason("Erreur rencontrée pendant le traitement de la facture"), new FaultCode("Erreur rencontrée pendant le traitement de la facture."));
                    }
                }
            }

        }

    }
}