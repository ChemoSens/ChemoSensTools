using iTextSharp.text.html.simpleparser;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net.Mail;
using System.ServiceModel;
using TimeSens.webservices.models;

namespace TimeSens.webservices.helpers
{
    static class OrderHelper
    {
        private static string prefix = String.Format("{0:0000}", DateTime.Now.Year) + String.Format("{0:00}", DateTime.Now.Month);

        public static string GetHtmlInvoice(License lic, string orderNumber, string subscription, string tokenPack, double tokenPackPrice, double subscriptionPrice, string paymentMode, string lang)
        {
            string html = "";
            html += "<table>";
            html += @"<tr><td width='66%'>
                        <p style='font-size:9px;'><strong>SAS Temporal Sensory Innovation</strong><br/>
                        Centre des Sciences du Goût et de l'Alimentation<br/>
                        9E boulevard Jeanne d'Arc<br/>
                        21000 DIJON, FRANCE<br/>
                        Tél : +33 3 80 29 64 19<br/>
                        Mail : contact@timesens.net</p>
                      </td>
                      <td width='33%' border='1'><p style='font-size:9px;'><strong>" + LocalizationHelper.Localize("OrderReference", lang) + "</strong><br/>";
            html += LocalizationHelper.Localize("OurReference", lang) + " : " + orderNumber + " <br/>";
            html += LocalizationHelper.Localize("YourReference", lang) + " <br/>";
            html += LocalizationHelper.Localize("Date", lang) + " : " + DateTime.Now.ToString() + " <br/>";
            html += LocalizationHelper.Localize("Due", lang) + " : " + DateTime.Now.AddDays(30).ToString() + " </p></td></tr>";
            html += "</table>";
            html += "<br/>";

            html += "<table border='1' width='100%' style='border-spacing: 0px;cellspacing:0px;border: 1px solid gray;padding: 5px;border-collapse: collapse;'>";
            html += "<tr><td><p style='font-size:9px;'><strong>" + LocalizationHelper.Localize("ShippingAddress", lang) + " </strong></p></td>";
            html += "<td><p style='font-size:9px;'><strong>" + LocalizationHelper.Localize("BillingAddress", lang) + " </strong></p></td></tr>";
            html += "<tr><td><p style='font-size:9px;'>" + lic.Society + "<br/>" + lic.FirstName + " " + lic.LastName + "<br/>" + lic.Address + "<br/>" + lic.ZipCode + " " + lic.City + "<br/>" + lic.Country + "</p></td>";
            html += "<td><p style='font-size:9px;'>" + lic.OrderSociety + "<br/>" + lic.OrderFirstName + " " + lic.OrderLastName + "<br/>" + lic.OrderAddress + "<br/>" + lic.OrderZipCode + " " + lic.OrderCity + "<br/>" + lic.OrderCountry + "</p></td></tr>";
            html += "</table>";
            html += "<br/>";
            html += "<table width='100%'>";
            html += LocalizationHelper.Localize("VATZone", lang) + "(1) : " + LocalizationHelper.Localize(lic.VATZone) + "<br/>";
            if (lic.VATNumber != null && lic.VATNumber.Length > 0)
            {
                html += LocalizationHelper.Localize("VATNumber", lang) + "(1) : " + lic.VATNumber;
            }
            html += "</p></td>";
            html += "<td width='30%'><p style='font-size:9px;text-align:right;'>Dijon, " + LocalizationHelper.Localize("On", lang) + " " + DateTime.Now.ToShortDateString() + " </p></td></tr>";
            html += "</table>";

            html += "<p style='font-size:11px;text-align:center'><strong>" + LocalizationHelper.Localize("Invoice", lang) + " " + orderNumber + " </strong></p>";
            html += "<p style='font-size:11px;text-align:center'>" + LocalizationHelper.Localize("ToRecallWhenRegulation", lang) + " </p>";

            html += "<br/>";

            html += "<table border='1' width='100%'>";
            html += "<tr><td colspan='3' style='font-size:9px;'>" + LocalizationHelper.Localize("Description", lang) + " </td><td style='font-size:9px;text-align:center'>" + LocalizationHelper.Localize("Quantity", lang) + " </td><td style='font-size:9px;text-align:center'> " + LocalizationHelper.Localize("PUHT", lang) + " </td><td style='font-size:9px;text-align:center'>" + LocalizationHelper.Localize("TotalHT", lang) + " </td></tr>";
            if (subscription != null)
            {
                html += "<tr><td colspan='3' style='font-size:9px;'>" + LocalizationHelper.Localize(subscription, lang) + " (" + LocalizationHelper.Localize(lic.NewLicenseType.ToString(), lang) + ")" + " </td><td style='font-size:9px;text-align:center'>1 </td><td style='font-size:9px;text-align:center'>" + subscriptionPrice + " EUR </td><td style='font-size:9px;text-align:center'>" + subscriptionPrice + " EUR </td></tr>";
            }
            html += "<tr><td colspan='3' style='font-size:9px;'>" + LocalizationHelper.Localize(tokenPack, lang) + " (" + LocalizationHelper.Localize(lic.NewLicenseType.ToString(), lang) + ") </td><td style='font-size:9px;text-align:center'>1 </td><td style='font-size:9px;text-align:center'>" + tokenPackPrice + " EUR </td><td style='font-size:9px;text-align:center'>" + tokenPackPrice + " EUR </td></tr>";
            double total = tokenPackPrice;
            if (subscription != null)
            {
                total += subscriptionPrice;
            }
            html += "<tr><td colspan='5' align='right' style='font-size:9px;'>" + LocalizationHelper.Localize("TotalHT", lang) + " </td><td style='font-size:9px;text-align:center'>" + total + " EUR </td></tr>";

            if ((lic.VATZone == "UENonAssujettiOrHorsUE"))
            {
                html += "<tr><td colspan='5' align='right' style='font-size:9px;'>" + LocalizationHelper.Localize("VAT", lang) + "(1)</td><td style='font-size:9px;text-align:center'>" + LocalizationHelper.Localize("NetOfTax", lang) + " </td></tr>";
            }
            else if ((lic.VATZone == "ZoneTVAFranceOrUEAssujetti"))
            {
                double tva = total * 0.2;
                total += tva;
                html += "<tr><td colspan='5' align='right' style='font-size:9px;' >" + LocalizationHelper.Localize("VAT", lang) + " 20 % (1)</td><td align='center' style='font-size:9px;' >" + tva + " EUR </td></tr>";
            }

            html += "<tr><td colspan='5' align='right'  style='font-size:9px;'>" + LocalizationHelper.Localize("TotalTTC", lang) + " </td><td align='center' style='font-size:9px;' ><strong>" + total + " EUR </strong></td></tr>";
            html += "</table>";

            html += "<br/>";

            if (paymentMode == "OrderOnLine")
            {
                html += "<p style='font-size:9px;'><strong>" + LocalizationHelper.Localize("OrderOnLine", lang) + " " + DateTime.Now.ToShortDateString() + " </strong></p><br/>";
            }
            else
            {
                html += "<p style='font-size:9px;'><strong>" + LocalizationHelper.Localize("SettlementTerms", lang) + " </strong></p>";
                html += "<p style='font-size:9px;'>" + LocalizationHelper.Localize("SettlementTermsContent", lang) + " </p>";
                html += "<p style='font-size:9px;'>RIB : 30004 00085 00010063558 34 BNPPARB DIJON HOTEL VILL (00085)</p>";
                html += "<p style='font-size:9px;'>BIC/SWIFT : BNPAFRPPXXX</p>";
                html += "<p style='font-size:9px;'>IBAN : FR7630004000850001006355834</p>";
                html += "<p style='font-size:9px;'>" + LocalizationHelper.Localize("BankName", lang) + " : BNP PARIBAS, " + LocalizationHelper.Localize("BranchNumber", lang) + " : 00085</p>";
                html += "<p style='font-size:9px;'>" + LocalizationHelper.Localize("BranchName", lang) + " : BNP PARIBAS DIJON HOTEL DE VILLE, 8 rue Rameau, 21000 DIJON, FRANCE" + "</p>";
                html += "<p style='font-size:9px;'>" + LocalizationHelper.Localize("AccountHolder", lang) + " : SAS Temporal Sensory Innovation, 35 rue Parmentier, 21000 Dijon, FRANCE.</p>";
            }
            html += "<br/>";
            html += "<br/>";
            html += "<br/>";
            html += "<br/>";
            html += "<p style='font-size:9px;text-align:center'>Temporal Sensory Innovation SAS au capital de 15 000€ | Siège social : 35 rue Parmentier, 21000 Dijon | SIRET : 817 733 280 00017 | TVA : FR12 817 733 280 | APE : 6311Z</p>";
            return html;
        }

        public static void SaveInvoice(License lic, string orderNumber, string subscription, string tokenPack, double tokenPackPrice, double subscriptionPrice, string paymentMode, string lang)
        {
            // Génération de la facture
            string htmlInvoice = GetHtmlInvoice(lic, orderNumber, subscription, tokenPack, tokenPackPrice, subscriptionPrice, paymentMode, lang);
            // Svg du fichier html
            TextWriter tw = new StreamWriter(ConfigurationManager.AppSettings["InvoiceDirectory"] + "\\" + orderNumber + ".htm", false);
            tw.Write(htmlInvoice);
            tw.Close();
            // Génération fichier pdf
            iTextSharp.text.Document document = new iTextSharp.text.Document();
            iTextSharp.text.pdf.PdfWriter.GetInstance(document, new FileStream(ConfigurationManager.AppSettings["InvoiceDirectory"] + "\\" + orderNumber + ".pdf", FileMode.Create));
            document.Open();
            using (TextReader sReader = new StringReader(htmlInvoice))
            {
                List<iTextSharp.text.IElement> list = HTMLWorker.ParseToList(sReader, new iTextSharp.text.html.simpleparser.StyleSheet());
                foreach (iTextSharp.text.IElement elm in list)
                {
                    document.Add(elm);
                }
            }
            document.Close();
        }

        private static FileInfo[] getInvoices(string prefix="")
        {
            // Numéro de facture : YYYYMM[n]cmd dans le mois            
            DirectoryInfo directory = new DirectoryInfo(ConfigurationManager.AppSettings["InvoiceDirectory"]);
            FileInfo[] files = directory.GetFiles(prefix + "*.pdf");
            return files;
        }

        public static string GetInvoiceNumber()
        {
            FileInfo[] files = getInvoices(prefix);
            string res = prefix + String.Format("{0:000}", files.Length + 1);
            return (res);
        }

        public static string GetInvoiceList()
        {
            FileInfo[] files = getInvoices();
            List<string> fileNames = new List<string>();
            foreach (FileInfo fi in files)
            {
                fileNames.Add(fi.Name);
            }
            return Serializer.SerializeToString(fileNames);
        }

        public static string GetCountryCode(string country)
        {
            switch (country.ToUpper())
            {
                case "FRANCE":
                    return "FR";
                case "UNITED STATES":
                    return "US";
                case "UNITED KINGDOM":
                    return "UK";
            }
            return "";
        }

        public static string SubmitOrder(License license, string orderFirstName, string orderLastName, string orderMail, string orderSociety, string orderCountry, string orderAddress, string orderCity, string orderZip, string orderPhone, string orderVATZone, string orderVATNumber, string orderMode, string subscription, string tokenPack, string lang, bool sendMail)
        {
            try
            {



                bool newsubscription = false;
                //string tokenPack = LocalizationHelper.Localize("NoToken", lang);
                double tokenPackPrice = 0;
                double subscriptionPrice = 0;

                string invoiceNumber = OrderHelper.GetInvoiceNumber();

                // MAJ des informations de facturation
                license.OrderFirstName = orderFirstName;
                license.OrderLastName = orderLastName;
                license.OrderMail = orderMail;
                license.OrderSociety = orderSociety;
                license.OrderCountry = orderCountry;
                license.OrderAddress = orderAddress;
                license.OrderCity = orderCity;
                license.OrderZipCode = orderZip;
                license.OrderPhoneNumber = orderPhone;
                license.VATZone = orderVATZone;
                license.VATNumber = orderVATNumber;

                // Abonnement cas 1 : Nouvelle demande TryOut
                // Vérification que ce n'est pas un renouvellement de TryOut
                // Validation auto, 20 jetons offerts, abonnement 30 jours
                if (subscription == "TryOut" && license.NewLicenseType != License.NewLicenseTypeEnum.Demo)
                {
                    license.NewLicenseType = License.NewLicenseTypeEnum.Demo;
                    license.ExpirationDate = DateTime.Now.AddDays(30);
                    license.PurchaseDate = DateTime.Now;
                    license.Validated = true;
                    Consumption cc = new Consumption();
                    cc.Action = Consumption.ActionTypeEnum.Subscription;
                    cc.Date = DateTime.Now;
                    cc.NbTockens = 20;
                    cc.NumFacture = invoiceNumber;
                    license.Consumptions.Add(cc);

                    newsubscription = true;
                    //tokenPack = String.Format(LocalizationHelper.Localize("TokenPack", lang), 20);
                }

                // Abonnement cas 2 : nouvelle demande Teaching
                // Validation non automatique, + 1an à partir de la validation par admin
                if (subscription == "Teaching")
                {
                    license.NewLicenseType = License.NewLicenseTypeEnum.Academic;
                    license.ExpirationDate = DateTime.Now.AddYears(1);
                    license.PurchaseDate = DateTime.Now;
                    license.Validated = false;

                    newsubscription = true;
                }

                // Abonnement cas 3 : nouvelle demande FullPrice ou LowPrice
                // Reset des jetons si ancienne licence = TryOut
                // Validation auto, abonnement 1 an
                if (subscription == "FullPrice" || subscription == "LowPrice")
                {
                    if (license.NewLicenseType == License.NewLicenseTypeEnum.Demo)
                    {
                        license.Consumptions.Clear();
                    }
                    if (subscription == "FullPrice")
                    {
                        license.NewLicenseType = License.NewLicenseTypeEnum.FullPrice;
                        subscriptionPrice = 500;
                    }
                    if (subscription == "LowPrice")
                    {
                        license.NewLicenseType = License.NewLicenseTypeEnum.LowPrice;
                        subscriptionPrice = 250;
                    }
                    license.ExpirationDate = DateTime.Now.AddYears(1);
                    license.PurchaseDate = DateTime.Now;
                    license.Validated = true;

                    newsubscription = true;
                }

                // Abonnement Admin, Free : nouvelle demande impossible

                // Abonnement cas 4 : renouvellement d'abonnement
                // Vérification nouveau type = ancien type
                // Abonnement + 1 an

                if (subscription == "Renew" && license.NewLicenseType != License.NewLicenseTypeEnum.Undefined && license.NewLicenseType != License.NewLicenseTypeEnum.Demo && license.Validated == true)
                {
                    DateTime d = (DateTime)license.ExpirationDate;
                    if (DateTime.Now > d)
                    {
                        d = DateTime.Now;
                    }
                    license.ExpirationDate = d.AddYears(1);
                    license.Validated = true;

                    subscriptionPrice = 0;

                    if (license.NewLicenseType == License.NewLicenseTypeEnum.FullPrice)
                    {
                        subscriptionPrice = 500;
                    }
                    if (license.NewLicenseType == License.NewLicenseTypeEnum.LowPrice)
                    {
                        subscriptionPrice = 250;
                    }

                    newsubscription = false;
                }

                // Jetons
                // Vérifier que la licence est valide et != TryOut
                if (tokenPack != "NoToken" && license.Validated == true && license.NewLicenseType != License.NewLicenseTypeEnum.Undefined && license.NewLicenseType != License.NewLicenseTypeEnum.Demo)
                {
                    double tokens = 0;
                    if (tokenPack == "Pack250")
                    {
                        tokens = 250;
                        tokenPackPrice = 500;
                    }
                    if (tokenPack == "Pack500")
                    {
                        tokens = 500;
                        tokenPackPrice = 900;
                    }
                    if (tokenPack == "Pack1000")
                    {
                        tokens = 1000;
                        tokenPackPrice = 1600;
                    }
                    if (tokenPack == "Pack2000")
                    {
                        tokens = 2000;
                        tokenPackPrice = 2800;
                    }
                    if (tokenPack == "Pack5000")
                    {
                        tokens = 6000;
                        tokenPackPrice = 6000;
                    }
                    if (tokenPack == "Pack10000")
                    {
                        tokens = 10000;
                        tokenPackPrice = 10000;
                    }

                    //TODO:unlimited

                    Consumption cc = new Consumption();
                    cc.Action = Consumption.ActionTypeEnum.Subscription;
                    cc.Date = DateTime.Now;
                    cc.NbTockens = tokens;
                    cc.NumFacture = invoiceNumber;
                    license.Consumptions.Add(cc);

                    if (license.NewLicenseType == License.NewLicenseTypeEnum.FullPrice)
                    {

                    }
                    else if (license.NewLicenseType == License.NewLicenseTypeEnum.LowPrice)
                    {
                        tokenPackPrice = tokenPackPrice / 2;
                    }
                    else
                    {
                        tokenPackPrice = 0;
                    }

                    //tokenPack = String.Format(LocalizationHelper.Localize("TokenPack", lang), tokens);
                }

                // Sauvegarde de la licence
                LicenceHelper.SaveLicenceFile(license);

                // Impression de la facture                    
                OrderHelper.SaveInvoice(license, invoiceNumber, subscription, tokenPack, tokenPackPrice, subscriptionPrice, orderMode, lang);

                // Envoi de mails                   
                string body = "";
                List<Attachment> attachments = new List<Attachment>();
                string htmlInvoice = OrderHelper.GetHtmlInvoice(license, invoiceNumber, subscription, tokenPack, tokenPackPrice, subscriptionPrice, orderMode, lang);


                // Envoi du mail à TimeSens
                if (license.PurchaseDate != null)
                {
                    body += "le " + ((DateTime)license.PurchaseDate).Day + "/" + ((DateTime)license.PurchaseDate).Month + "/" + ((DateTime)license.PurchaseDate).Year + "<br/><br/>";
                }
                body += "Prénom : " + license.FirstName + "<br/>";
                body += "Nom : " + license.LastName + "<br/>";
                body += "Société : " + license.Society + "<br/>";
                body += "Mail : " + license.Mail + "<br/><br/>";
                body += htmlInvoice;

                if (newsubscription == true && license.NewLicenseType == License.NewLicenseTypeEnum.Academic)
                {
                    body += "<p>La licence doit être validée.</p>";
                }

                body += "<a href='http://www.timesens.com/tools.aspx'>http://www.timesens.com/tools.aspx</a>";

                attachments.Add(new System.Net.Mail.Attachment(ConfigurationManager.AppSettings["InvoiceDirectory"] + "\\" + invoiceNumber + ".pdf"));
                if (sendMail == true)
                {
                    MailHelper.SendMailWithAttachments("Mail automatique de TimeSens", ConfigurationManager.AppSettings["NewOrderMail"], "Nouvelle commande TimeSens (" + license.NewLicenseType.ToString() + ")", body, attachments);
                }

                // Envoi du mail au client
                body = "<p>" + LocalizationHelper.Localize("DearTimeSensUser", lang) + ",</p>";

                if (newsubscription == true && license.NewLicenseType == License.NewLicenseTypeEnum.Demo)
                {
                    body += "<p>" + LocalizationHelper.Localize("AskDemoLicenceComplete", lang) + " </p>";
                }
                else if (newsubscription == true && license.NewLicenseType == License.NewLicenseTypeEnum.Academic)
                {
                    body += "<p>" + LocalizationHelper.Localize("AskTeachingLicenceComplete", lang) + " </p>";
                }
                else
                {
                    body += "<p>" + LocalizationHelper.Localize("AskLicenceComplete", lang) + " </p>";
                    if (subscription != "NoSubscription")
                    {
                        body += "<p>" + LocalizationHelper.Localize("YourSubscriptionIsValid", lang) + " </p>";
                    }
                    if (tokenPack != "NoToken")
                    {
                        body += "<p>" + LocalizationHelper.Localize("YourTokenPackIsValid", lang) + " </p>";
                    }
                }

                body += "<p>" + LocalizationHelper.Localize("PleaseFindYourOrderDetail", lang) + " </p>";
                body += htmlInvoice;

                body += "<p><br/>" + LocalizationHelper.Localize("EnjoyTimeSens", lang) + " <br/></p>";
                body += "<p align='right'><strong>" + LocalizationHelper.Localize("TheTimeSensTeam", lang) + " </strong></p>";

                attachments = new List<Attachment>();
                if (lang == "fr")
                {
                    attachments.Add(new System.Net.Mail.Attachment(ConfigurationManager.AppSettings["Root"] + "\\website\\pdf\\fr\\EULA.pdf"));
                }
                else
                {
                    attachments.Add(new System.Net.Mail.Attachment(ConfigurationManager.AppSettings["Root"] + "\\website\\pdf\\en\\EULA.pdf"));
                }
                attachments.Add(new System.Net.Mail.Attachment(ConfigurationManager.AppSettings["InvoiceDirectory"] + "\\" + invoiceNumber + ".pdf"));

                MailHelper.SendMailWithAttachments(LocalizationHelper.Localize("TheTimeSensTeam", lang), license.OrderMail, LocalizationHelper.Localize("TimeSensTokenOrder", lang), body, attachments);

                string redirecturl = "";

                if (orderMode == "OrderOnLine")
                {
                    // Redirection vers PayPal                        
                    string countryCode = GetCountryCode(license.Country);
                    //URL to redirect content to paypal site
                    redirecturl += ConfigurationManager.AppSettings["PayPalSubmitUrl"].ToString();
                    redirecturl += "&first_name=" + license.FirstName;
                    redirecturl += "&last_name=" + license.LastName;
                    redirecturl += "&city=" + license.City;
                    redirecturl += "&zip=" + license.ZipCode;
                    redirecturl += "&country=" + countryCode;
                    redirecturl += "&item_name=" + LocalizationHelper.Localize(subscription, lang) + " " + LocalizationHelper.Localize(tokenPack, lang);
                    redirecturl += "&item_number=" + license.Id;
                    redirecturl += "&amount=" + (tokenPackPrice + subscriptionPrice).ToString();
                    //redirecturl += "&night_phone_a=" + lic.PhoneNumber;
                    redirecturl += "&address1=" + license.Address;
                    //redirecturl += "&email=" + "toto@toto.fr";
                    redirecturl += "&business=" + ConfigurationManager.AppSettings["PayPalEmail"].ToString();
                    redirecturl += "&shipping=0";
                    redirecturl += "&no_shipping=1";
                    redirecturl += "&no_note=1";
                    redirecturl += "&handling=0";
                    redirecturl += "&image_url=http://www.timesens.com/assets/images/logo.png";
                    double totalTVA = 0;
                    if (license.VATZone == "Asujetti")
                    {
                        totalTVA = (tokenPackPrice + subscriptionPrice) * 0.2;
                    }
                    redirecturl += "&tax=" + totalTVA.ToString();
                    redirecturl += "&quantity=1";
                    redirecturl += "&lc=" + countryCode;
                    redirecturl += "&currency_code=EUR";
                    redirecturl += "&notify_url=" + ConfigurationManager.AppSettings["SuccessURL"].ToString();
                    redirecturl += "&return=" + ConfigurationManager.AppSettings["SuccessURL"].ToString();
                    redirecturl += "&cancel_return=" + ConfigurationManager.AppSettings["FailedURL"].ToString();
                    redirecturl += "&cbt=" + LocalizationHelper.Localize("CompleteTransaction", lang);
                    redirecturl += "&image=http://timesens.com/Assets/Images/logo.png";
                }

                Order order = new Order();
                order.License = license;
                order.RedirectURL = redirecturl;
                order.Status = "TODO";

                return Serializer.SerializeToString(order, null);


            }
            catch (FaultException ex)
            {
                if (ex is FaultException)
                {
                    throw (FaultException)ex;
                }
                else
                {
                    //TODO
                    //LogHelper.LogException(ex, "LogService");
                    throw new FaultException(new FaultReason("Unexpected error"), new FaultCode("UNEXPECTED_ERROR"));
                }
            }
        }
    }
}
