using ChemosensTools.Framework.cs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.Web;
using TimeSens.webservices.helpers;

namespace ChemosensTools.Questionnaire
{
    public class Questionnaire
    {
        //public static List<string> GetAuthorizedCodes(string authorizedCodesFilePath)
        //{
        //    List<string> authorizedCodes = File.ReadAllText(authorizedCodesFilePath, System.Text.Encoding.UTF8).Split(';').ToList();
        //    return authorizedCodes;
        //}

        //public static bool CheckAccess(string authorizedCodesFilePath, string code)
        //{
        //    List<string> authorizedCodes = GetAuthorizedCodes(authorizedCodesFilePath);

        //    if (authorizedCodes.IndexOf(code) > -1)
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        throw new FaultException(new FaultReason("Code non reconnu."), new FaultCode(""));
        //    }

        //}

        //public static string Login(string authorizedCodesFilePath, string dataDirPath, string code, string hashKey)
        //{
        //    string json = "";
        //    // Lecture des codes autorisés (fichier externe), authentification + renvoi du contenu json du code correspondant
        //    CheckAccess(authorizedCodesFilePath, code);

        //    // lecture du fichier de résultats ou création d'un nouveau fichier
        //    string file = dataDirPath + code + ".json";
        //    if (File.Exists(file))
        //    {
        //        json = Read(file, hashKey);
        //    }
        //    else
        //    {
        //        File.Create(file).Dispose();
        //    }

        //    return json;
        //}

        public static string Login(string dataDirPath, string id, string hashKey)
        {
            string json = "";

            // lecture du fichier de résultats ou création d'un nouveau fichier
            string file = dataDirPath + id + ".json";
            if (File.Exists(file))
            {
                json = Read(file, hashKey);
            }
            else
            {
                throw new FaultException(new FaultReason("Code non reconnu."), new FaultCode(""));
            }

            return json;
        }



        public static string Inscription(string questionnaireDirPath, string inscriptionDirPath, string hashKey, string inscriptionJson, string questionnaireJson, string mail, bool sendMail)
        {

            string code = EncryptionHelper.Encrypt(mail, mail).Replace("/", "");
            string file = questionnaireDirPath + code + ".json";
            string file2 = inscriptionDirPath + code + ".json";


            // Envoi mail avec code au juge
            string url = ConfigurationManager.AppSettings["DataSensURL"];
            string txt = "<p>Bonjour, et merci pour votre inscription !</p>";
            txt += "<p><a href='" + url + "?id=" + code + "'>Lien vers l'étude</a>.</p>";
            txt += "<p>Attention, ce lien est personnel. Ne le transmettez pas à une autre personne. Si quelqu’un de votre entourage souhaite participer à cette étude, il/elle doit au préalable s’inscrire ici : https://www.chemosenstools.com/datasens/inscription.html.</p>";
            txt += "<p>Votre code d'accès : " + code + "</p>";
            txt += "<p>Nous vous remercions par avance pour votre participation !</p>";
            txt += "<p></p><p>Plateforme Chemosens, Centre des Sciences du Goût et de l’Alimentation</p>";

            if (File.Exists(file2))
            {
                MailHelper.SendMail2(mail, "Votre lien d'accès pour l'étude DataSens", txt, "chemosenstools@inrae.fr", "chemosenstools@inrae.fr");
                throw new FaultException(new FaultReason("Un compte associé à cette adresse mail existe déjà. Le lien pour l'accès à l'étude vous a été renvoyé à cette adresse."), new FaultCode("Un compte associé à cette adresse mail existe déjà."));
            }

            File.Create(file).Dispose();



            File.WriteAllText(file, Serializer.Encrypt(System.Uri.UnescapeDataString(inscriptionJson), hashKey));

            File.Create(file2).Dispose();
            File.WriteAllText(file2, Serializer.Encrypt(System.Uri.UnescapeDataString(questionnaireJson), hashKey));
            //if (sendMail)
            //{
            //    MailHelper.SendMail2(mail, "Votre lien d'accès pour l'étude DataSens", txt, "chemosenstools@inrae.fr", "chemosenstools@inrae.fr");
            //}

            //// Envoi mail à consodrive           
            //string infos = "<p>Code : " + code + "</p>";
            //MailHelper.SendMail2("chemosenstools@inrae.fr", "Nouvelle inscription", infos , "chemosenstools@inrae.fr", "chemosenstools@inrae.fr");

            return code;
        }

        public static string Read(string filePath, string hashKey)
        {
            string json = "";
            if (File.Exists(filePath))
            {
                json = File.ReadAllText(filePath);
                if (json.StartsWith("{") == false)
                {
                    json = Serializer.Decrypt(json, hashKey);
                }
            }
            return json;
        }

        public static void SaveQuestionnaire(string dataDirPath, string code, string jsonQuestionnaire, string hashKey)
        {
            try
            {
                string file = dataDirPath + code + ".json";
                File.WriteAllText(file, Serializer.Encrypt(System.Uri.UnescapeDataString(jsonQuestionnaire), hashKey));
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static int? Convert(JToken number)
        {
            int variable = 0;
            if (int.TryParse(number.ToString(), out variable))
            {
                return variable;
            }
            return null;
        }

        public static double? ConvertD(JToken number)
        {
            double variable = 0;
            if (number == null)
            {
                return null;
            }
            if (double.TryParse(number.ToString(), out variable))
            {
                return variable;
            }
            return null;
        }

        public static string ConvertB(JToken boolean)
        {
            bool variable;
            if (Boolean.TryParse(boolean.ToString(), out variable))
            {
                if (variable == true)
                {
                    return "Oui";
                }
                if (variable == false)
                {
                    return "Non";
                }
            }

            return null;
        }

        //public static byte[] DownloadQuestionnaireConsoDrive(string questionnaireDirPath, string hashKey)
        //{
        //    try
        //    {
        //        byte[] res = null;

        //        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        //        using (ExcelPackage xlPackage = new ExcelPackage())
        //        {
        //            var subjectSheet = xlPackage.Workbook.Worksheets.Add("Subjects");
        //            int indexSubject = 2;
        //            subjectSheet.Cells[1, 1].Value = "Code";
        //            subjectSheet.Cells[1, 2].Value = "Genre";
        //            subjectSheet.Cells[1, 3].Value = "Age";
        //            subjectSheet.Cells[1, 4].Value = "Taille";
        //            subjectSheet.Cells[1, 5].Value = "Poids";
        //            subjectSheet.Cells[1, 6].Value = "CSP";
        //            subjectSheet.Cells[1, 7].Value = "Diplome";
        //            subjectSheet.Cells[1, 8].Value = "NbPersonnesMajeures";
        //            subjectSheet.Cells[1, 9].Value = "NbPersonnesMineures";
        //            subjectSheet.Cells[1, 10].Value = "MontantAlloueCourses";
        //            subjectSheet.Cells[1, 11].Value = "RegimeParticulier";
        //            subjectSheet.Cells[1, 12].Value = "DetailRegimeParticulier";
        //            subjectSheet.Cells[1, 13].Value = "UtilisationApplications";
        //            subjectSheet.Cells[1, 14].Value = "Remarques";
        //            subjectSheet.Cells[1, 15].Value = "ConsentementAccepte";
        //            subjectSheet.Cells[1, 16].Value = "QuantiteInfo";
        //            subjectSheet.Cells[1, 17].Value = "QualiteInfo";
        //            subjectSheet.Cells[1, 18].Value = "ConfianceInfo";
        //            subjectSheet.Cells[1, 19].Value = "RemarquesInfo";
        //            subjectSheet.Cells[1, 20].Value = "CP";

        //            subjectSheet.Cells[1, 21].Value = "CP_inscription";
        //            subjectSheet.Cells[1, 22].Value = "AchatGMS";
        //            subjectSheet.Cells[1, 23].Value = "AchatGrandeSurfaceSpecialisee";
        //            subjectSheet.Cells[1, 24].Value = "AchatCommerceProximite";
        //            subjectSheet.Cells[1, 25].Value = "AchatMarche";
        //            subjectSheet.Cells[1, 26].Value = "AchatDrive";
        //            subjectSheet.Cells[1, 27].Value = "AchatProducteur";
        //            subjectSheet.Cells[1, 28].Value = "AchatInternet";
        //            subjectSheet.Cells[1, 29].Value = "AchatAutre";
        //            subjectSheet.Cells[1, 30].Value = "EnseigneCarrefour";
        //            subjectSheet.Cells[1, 31].Value = "EnseigneLeclerc";
        //            subjectSheet.Cells[1, 32].Value = "EnseigneIntermarche";
        //            subjectSheet.Cells[1, 33].Value = "EnseigneSuperU";
        //            subjectSheet.Cells[1, 34].Value = "EnseigneCora";
        //            subjectSheet.Cells[1, 35].Value = "EnseigneCasino";
        //            subjectSheet.Cells[1, 36].Value = "EnseigneAutre";
        //            subjectSheet.Cells[1, 37].Value = "CategorieViandePoisson";
        //            subjectSheet.Cells[1, 38].Value = "CategorieFruitLegume";
        //            subjectSheet.Cells[1, 39].Value = "CategoriePainPatisserie";
        //            subjectSheet.Cells[1, 40].Value = "CategorieSurgele";
        //            subjectSheet.Cells[1, 41].Value = "CategorieEpicerieSalee";
        //            subjectSheet.Cells[1, 42].Value = "CategorieEpicerieSucree";
        //            subjectSheet.Cells[1, 43].Value = "CategorieFrais";

        //            var connexionSheet = xlPackage.Workbook.Worksheets.Add("Connexions");
        //            connexionSheet.Cells[1, 1].Value = "Code";
        //            connexionSheet.Cells[1, 2].Value = "Page";
        //            connexionSheet.Cells[1, 3].Value = "Date";
        //            connexionSheet.Cells[1, 4].Value = "Secondes";
        //            int indexConnexion = 2;

        //            var dimensionSheet = xlPackage.Workbook.Worksheets.Add("Dimensions");
        //            dimensionSheet.Cells[1, 1].Value = "Code";
        //            dimensionSheet.Cells[1, 2].Value = "Nom";
        //            //dimensionSheet.Cells[1, 3].Value = "NonPrisEnCompte";
        //            dimensionSheet.Cells[1, 3].Value = "ScoreGlobal";
        //            dimensionSheet.Cells[1, 4].Value = "SiAutre";
        //            int indexDimension = 2;

        //            var sousDimensionSheet = xlPackage.Workbook.Worksheets.Add("SousDimensions");
        //            sousDimensionSheet.Cells[1, 1].Value = "Code";
        //            sousDimensionSheet.Cells[1, 2].Value = "Dimension";
        //            sousDimensionSheet.Cells[1, 3].Value = "Label";
        //            sousDimensionSheet.Cells[1, 4].Value = "Important";
        //            sousDimensionSheet.Cells[1, 5].Value = "ClasseParSujetDansDimension";
        //            sousDimensionSheet.Cells[1, 6].Value = "MauvaisesReponses";
        //            sousDimensionSheet.Cells[1, 7].Value = "Reponses";
        //            int indexSousDimension = 2;

        //            var alimentSheet = xlPackage.Workbook.Worksheets.Add("Aliments");
        //            alimentSheet.Cells[1, 1].Value = "Code";
        //            alimentSheet.Cells[1, 2].Value = "Designation";
        //            alimentSheet.Cells[1, 3].Value = "Consomme";
        //            alimentSheet.Cells[1, 4].Value = "Choisi";
        //            alimentSheet.Cells[1, 5].Value = "Repetition";

        //            int indexAliment = 2;

        //            var dimensionAlimentSheet = xlPackage.Workbook.Worksheets.Add("DimensionsAliments");
        //            dimensionAlimentSheet.Cells[1, 1].Value = "Code";
        //            dimensionAlimentSheet.Cells[1, 2].Value = "Designation";
        //            dimensionAlimentSheet.Cells[1, 3].Value = "Nom";
        //            dimensionAlimentSheet.Cells[1, 4].Value = "ImportantAliment";
        //            dimensionAlimentSheet.Cells[1, 5].Value = "ScoreAliment";
        //            dimensionAlimentSheet.Cells[1, 6].Value = "SiAutre";
        //            int indexDimensionAliment = 2;

        //            var factureSheet = xlPackage.Workbook.Worksheets.Add("Factures");
        //            factureSheet.Cells[1, 1].Value = "Code";
        //            factureSheet.Cells[1, 2].Value = "NumeroFacture";
        //            factureSheet.Cells[1, 3].Value = "Drive";
        //            factureSheet.Cells[1, 4].Value = "Ville";
        //            factureSheet.Cells[1, 5].Value = "IDClient";
        //            factureSheet.Cells[1, 6].Value = "DateAchat";
        //            factureSheet.Cells[1, 7].Value = "DateEnvoi";
        //            factureSheet.Cells[1, 8].Value = "Texte";
        //            int indexFacture = 2;

        //            var factureAlimentSheet = xlPackage.Workbook.Worksheets.Add("FacturesAliments");
        //            factureAlimentSheet.Cells[1, 1].Value = "Code";
        //            factureAlimentSheet.Cells[1, 2].Value = "Rayon";
        //            factureAlimentSheet.Cells[1, 3].Value = "Designation";
        //            factureAlimentSheet.Cells[1, 4].Value = "Quantite";
        //            factureAlimentSheet.Cells[1, 5].Value = "PUHT";
        //            factureAlimentSheet.Cells[1, 6].Value = "Conditionnement";
        //            factureAlimentSheet.Cells[1, 7].Value = "PUTTC";
        //            int indexFactureAliment = 2;

        //            DateTime? previousDate = null;

        //            foreach (string f in Directory.EnumerateFiles(questionnaireDirPath))
        //            {
        //                string json = Read(f, hashKey);

        //                try
        //                {

        //                    JObject jObject = JsonConvert.DeserializeObject<JObject>(json);
        //                    if (jObject["Genre"] != null)
        //                    {
        //                        if (jObject["Code"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 1].Value = jObject["Code"].ToString();
        //                        }
        //                        if (jObject["Genre"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 2].Value = jObject["Genre"].ToString();
        //                        }
        //                        if (jObject["Age"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 3].Value = convert(jObject["Age"]);
        //                        }
        //                        if (jObject["Taille"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 4].Value = convert(jObject["Taille"]);
        //                        }
        //                        if (jObject["Poids"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 5].Value = convert(jObject["Poids"]); ;
        //                        }
        //                        if (jObject["CSP"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 6].Value = jObject["CSP"].ToString();
        //                        }
        //                        if (jObject["Diplome"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 7].Value = jObject["Diplome"].ToString();
        //                        }
        //                        if (jObject["NbPersonnesMajeures"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 8].Value = convert(jObject["NbPersonnesMajeures"]);
        //                        }
        //                        if (jObject["NbPersonnesMineures"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 9].Value = convert(jObject["NbPersonnesMineures"]);
        //                        }
        //                        if (jObject["MontantAlloueCourses"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 10].Value = jObject["MontantAlloueCourses"].ToString();
        //                        }
        //                        if (jObject["RegimeParticulier"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 11].Value = jObject["RegimeParticulier"].ToString();
        //                        }
        //                        if (jObject["DetailRegimeParticulier"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 12].Value = jObject["DetailRegimeParticulier"].ToString();
        //                        }
        //                        if (jObject["UtilisationApplications"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 13].Value = jObject["UtilisationApplications"].ToString();
        //                        }
        //                        if (jObject["Remarques"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 14].Value = jObject["Remarques"].ToString();
        //                        }
        //                        if (jObject["ConsentementAccepte"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 15].Value = (bool)jObject["ConsentementAccepte"] == true ? "Oui" : "Non";
        //                        }
        //                        if (jObject["QuantiteInfo"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 16].Value = jObject["QuantiteInfo"].ToString();
        //                        }
        //                        if (jObject["QualiteInfo"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 17].Value = jObject["QualiteInfo"].ToString();
        //                        }
        //                        if (jObject["ConfianceInfo"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 18].Value = jObject["ConfianceInfo"].ToString();
        //                        }
        //                        if (jObject["RemarquesInfo"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 19].Value = jObject["RemarquesInfo"].ToString();
        //                        }
        //                        if (jObject["CP"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 20].Value = jObject["CP"].ToString();
        //                        }
        //                        if (jObject["CP_inscription"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 21].Value = jObject["CP_inscription"].ToString();
        //                        }

        //                        if (jObject["AchatGMS"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 22].Value = (bool)jObject["AchatGMS"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["AchatGrandeSurfaceSpecialisee"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 23].Value = (bool)jObject["AchatGrandeSurfaceSpecialisee"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["AchatCommerceProximite"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 24].Value = (bool)jObject["AchatCommerceProximite"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["AchatMarche"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 25].Value = (bool)jObject["AchatMarche"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["AchatDrive"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 26].Value = (bool)jObject["AchatDrive"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["AchatProducteur"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 27].Value = (bool)jObject["AchatProducteur"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["AchatInternet"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 28].Value = (bool)jObject["AchatInternet"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["AchatAutre"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 29].Value = jObject["AchatAutre"].ToString();
        //                        }

        //                        if (jObject["EnseigneCarrefour"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 30].Value = (bool)jObject["EnseigneCarrefour"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["EnseigneLeclerc"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 31].Value = (bool)jObject["EnseigneLeclerc"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["EnseigneIntermarche"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 32].Value = (bool)jObject["EnseigneIntermarche"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["EnseigneSuperU"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 33].Value = (bool)jObject["EnseigneSuperU"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["EnseigneCora"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 34].Value = (bool)jObject["EnseigneCora"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["EnseigneCasino"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 35].Value = (bool)jObject["EnseigneCasino"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["EnseigneAutre"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 36].Value = jObject["EnseigneAutre"].ToString();
        //                        }
        //                        if (jObject["CategorieViandePoisson"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 37].Value = (bool)jObject["CategorieViandePoisson"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["CategorieFruitLegume"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 38].Value = (bool)jObject["CategorieFruitLegume"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["CategoriePainPatisserie"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 39].Value = (bool)jObject["CategoriePainPatisserie"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["CategorieSurgele"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 40].Value = (bool)jObject["CategorieSurgele"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["CategorieEpicerieSalee"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 41].Value = (bool)jObject["CategorieEpicerieSalee"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["CategorieEpicerieSucree"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 42].Value = (bool)jObject["CategorieEpicerieSucree"] == true ? "Oui" : "";
        //                        }
        //                        if (jObject["CategorieFrais"] != null)
        //                        {
        //                            subjectSheet.Cells[indexSubject, 43].Value = (bool)jObject["CategorieFrais"] == true ? "Oui" : "";
        //                        }

        //                        indexSubject++;

        //                        if (jObject["Invoices"] != null)
        //                        {

        //                            foreach (JToken t in jObject["Invoices"].Children())
        //                            {
        //                                if (jObject["Code"] != null)
        //                                {
        //                                    factureSheet.Cells[indexFacture, 1].Value = jObject["Code"].ToString();
        //                                }
        //                                if (t["InvoiceNumber"] != null)
        //                                {
        //                                    factureSheet.Cells[indexFacture, 2].Value = t["InvoiceNumber"].ToString();
        //                                }
        //                                if (t["Drive"] != null)
        //                                {
        //                                    factureSheet.Cells[indexFacture, 3].Value = t["Drive"].ToString();
        //                                }
        //                                if (t["Store"] != null)
        //                                {
        //                                    factureSheet.Cells[indexFacture, 4].Value = t["Store"].ToString();
        //                                }
        //                                if (t["CustomerID"] != null)
        //                                {
        //                                    factureSheet.Cells[indexFacture, 5].Value = t["CustomerID"].ToString();
        //                                }
        //                                if (t["PurchaseDate"] != null)
        //                                {
        //                                    factureSheet.Cells[indexFacture, 6].Value = t["PurchaseDate"].ToString();
        //                                }
        //                                if (t["UploadDate"] != null)
        //                                {
        //                                    factureSheet.Cells[indexFacture, 7].Value = t["UploadDate"].ToString();
        //                                }
        //                                if (t["Texte"] != null)
        //                                {
        //                                    factureSheet.Cells[indexFacture, 8].Value = t["Texte"].ToString();
        //                                }

        //                                foreach (JToken x in t["ListItems"].Children())
        //                                {
        //                                    //if (x["PUHT"] != null && x["PUHT"].ToString() != "0")
        //                                    {
        //                                        if (jObject["Code"] != null)
        //                                        {
        //                                            factureAlimentSheet.Cells[indexFactureAliment, 1].Value = jObject["Code"].ToString();
        //                                        }
        //                                        if (x["Rayon"] != null)
        //                                        {
        //                                            factureAlimentSheet.Cells[indexFactureAliment, 2].Value = x["Rayon"].ToString();
        //                                        }
        //                                        if (x["Designation"] != null)
        //                                        {
        //                                            factureAlimentSheet.Cells[indexFactureAliment, 3].Value = x["Designation"].ToString();
        //                                        }
        //                                        if (x["Quantite"] != null && x["Quantite"].ToString() != "0")
        //                                        {
        //                                            factureAlimentSheet.Cells[indexFactureAliment, 4].Value = convert(x["Quantite"]);
        //                                        }
        //                                        if (x["PUHT"] != null && x["PUHT"].ToString() != "0")
        //                                        {
        //                                            factureAlimentSheet.Cells[indexFactureAliment, 5].Value = convertD(x["PUHT"]);
        //                                        }
        //                                        if (x["PUTTC"] != null && x["PUTTC"].ToString() != "0")
        //                                        {
        //                                            factureAlimentSheet.Cells[indexFactureAliment, 7].Value = convertD(x["PUTTC"]);
        //                                        }
        //                                        if (x["Conditionnement"] != null)
        //                                        {
        //                                            factureAlimentSheet.Cells[indexFactureAliment, 6].Value = x["Conditionnement"].ToString();
        //                                        }
        //                                        indexFactureAliment++;
        //                                    }

        //                                }

        //                                indexFacture++;
        //                            }
        //                        }

        //                        if (jObject["AccesQuestionnaire"] != null)
        //                        {
        //                            foreach (JToken t in jObject["AccesQuestionnaire"].Children())
        //                            {
        //                                if (jObject["Code"] != null)
        //                                {
        //                                    connexionSheet.Cells[indexConnexion, 1].Value = jObject["Code"].ToString();
        //                                }
        //                                if (t["Page"] != null)
        //                                {
        //                                    connexionSheet.Cells[indexConnexion, 2].Value = t["Page"].ToString();
        //                                }
        //                                if (t["Date"] != null)
        //                                {
        //                                    DateTime oldDate = DateTime.Parse(t["Date"].ToString());
        //                                    connexionSheet.Cells[indexConnexion, 3].Value = oldDate.AddHours(2).ToString();
        //                                    if (indexConnexion > 2)
        //                                    {
        //                                        DateTime newDate = DateTime.Parse(t["Date"].ToString());
        //                                        if (previousDate != null)
        //                                        {
        //                                            double diffDate = (newDate - (DateTime)previousDate).TotalSeconds;
        //                                            connexionSheet.Cells[indexConnexion - 1, 4].Value = diffDate;
        //                                        }
        //                                        previousDate = newDate;
        //                                    }
        //                                }
        //                                indexConnexion++;
        //                            }
        //                        }

        //                        if (jObject["Dimensions"] != null)
        //                        {
        //                            foreach (JToken x in jObject["Dimensions"].Children())
        //                            {
        //                                if (jObject["Code"] != null)
        //                                {
        //                                    dimensionSheet.Cells[indexDimension, 1].Value = jObject["Code"].ToString();
        //                                }
        //                                if (x["Nom"] != null)
        //                                {
        //                                    dimensionSheet.Cells[indexDimension, 2].Value = x["Nom"].ToString();
        //                                }
        //                                //if (x["NonPrisEnCompte"] != null)
        //                                //{
        //                                //    dimensionSheet.Cells[indexDimension, 3].Value = convert(x["NonPrisEnCompte"]);
        //                                //}
        //                                if (x["ScoreGlobal"] != null)
        //                                {
        //                                    dimensionSheet.Cells[indexDimension, 3].Value = convert(x["ScoreGlobal"]);
        //                                }

        //                                foreach (JToken y in x["SousDimensions"].Children())
        //                                {
        //                                    if (jObject["Code"] != null)
        //                                    {
        //                                        sousDimensionSheet.Cells[indexSousDimension, 1].Value = jObject["Code"].ToString();
        //                                    }
        //                                    if (y["Dimension"] != null)
        //                                    {
        //                                        sousDimensionSheet.Cells[indexSousDimension, 2].Value = y["Dimension"].ToString();
        //                                    }
        //                                    if (y["Label"] != null)
        //                                    {
        //                                        sousDimensionSheet.Cells[indexSousDimension, 3].Value = y["Label"].ToString();
        //                                    }
        //                                    if (y["Important"] != null)
        //                                    {
        //                                        sousDimensionSheet.Cells[indexSousDimension, 4].Value = convert(y["Important"]);
        //                                    }
        //                                    if (y["ClasseParSujetDansDimension"] != null)
        //                                    {
        //                                        sousDimensionSheet.Cells[indexSousDimension, 5].Value = y["ClasseParSujetDansDimension"].ToString();
        //                                    }

        //                                    if (y["MauvaisesReponses"] != null)
        //                                    {
        //                                        sousDimensionSheet.Cells[indexSousDimension, 6].Value = convert(y["MauvaisesReponses"]);
        //                                    }

        //                                    foreach (JToken z in y["Reponses"].Children())
        //                                    {
        //                                        sousDimensionSheet.Cells[indexSousDimension, 7].Value += z.ToString() + ";";
        //                                    }

        //                                    indexSousDimension++;
        //                                }
        //                                indexDimension++;
        //                            }
        //                        }

        //                        if (jObject["QuestionsAliment"] != null)
        //                        {
        //                            foreach (JToken x in jObject["QuestionsAliment"].Children())
        //                            {
        //                                if (x["Consomme"] != null && Convert.ToInt32(x["Consomme"].ToString()) > -1)
        //                                {

        //                                    if (jObject["Code"] != null)
        //                                    {
        //                                        alimentSheet.Cells[indexAliment, 1].Value = jObject["Code"].ToString();
        //                                    }
        //                                    if (x["Designation"] != null)
        //                                    {
        //                                        alimentSheet.Cells[indexAliment, 2].Value = x["Designation"].ToString();
        //                                    }
        //                                    if (x["Consomme"] != null)
        //                                    {
        //                                        alimentSheet.Cells[indexAliment, 3].Value = convert(x["Consomme"]);
        //                                    }
        //                                    if (x["Choisi"] != null)
        //                                    {
        //                                        alimentSheet.Cells[indexAliment, 4].Value = x["Choisi"].ToString();
        //                                    }
        //                                    if (x["EstRepete"] != null)
        //                                    {
        //                                        alimentSheet.Cells[indexAliment, 5].Value = x["EstRepete"].ToString();
        //                                    }
        //                                    //if (x["Position"] != null)
        //                                    //{
        //                                    //    alimentSheet.Cells[indexAliment, 5].Value = Convert.ToInt32(x["Position"].ToString());
        //                                    //}
        //                                    foreach (JToken y in x["Dimensions"].Children())
        //                                    {
        //                                        if (x["Choisi"].ToString() != "non")
        //                                        {
        //                                            if (jObject["Code"] != null)
        //                                            {
        //                                                dimensionAlimentSheet.Cells[indexDimensionAliment, 1].Value = jObject["Code"].ToString();
        //                                            }
        //                                            if (x["Designation"] != null)
        //                                            {
        //                                                dimensionAlimentSheet.Cells[indexDimensionAliment, 2].Value = x["Designation"].ToString();
        //                                            }
        //                                            if (y["Nom"] != null)
        //                                            {
        //                                                dimensionAlimentSheet.Cells[indexDimensionAliment, 3].Value = y["Nom"].ToString();
        //                                            }
        //                                            if (y["ImportantAliment"] != null)
        //                                            {
        //                                                dimensionAlimentSheet.Cells[indexDimensionAliment, 4].Value = convert(y["ImportantAliment"]);
        //                                            }
        //                                            if (y["ScoreAliment"] != null)
        //                                            {
        //                                                dimensionAlimentSheet.Cells[indexDimensionAliment, 5].Value = Convert.ToDecimal(y["ScoreAliment"].ToString());
        //                                            }
        //                                            if (y["Label"] != null && y["Nom"].ToString() == "Autre")
        //                                            {
        //                                                dimensionAlimentSheet.Cells[indexDimensionAliment, 6].Value = y["Label"].ToString();
        //                                            }
        //                                            indexDimensionAliment++;
        //                                        }

        //                                    }
        //                                    indexAliment++;
        //                                }
        //                                else
        //                                {
        //                                    if (jObject["Code"] != null)
        //                                    {
        //                                        alimentSheet.Cells[indexAliment, 1].Value = jObject["Code"].ToString();
        //                                    }
        //                                    if (x["Designation"] != null)
        //                                    {
        //                                        alimentSheet.Cells[indexAliment, 2].Value = x["Designation"].ToString();
        //                                    }
        //                                    if (x["Consomme"] != null)
        //                                    {
        //                                        alimentSheet.Cells[indexAliment, 3].Value = x["Consomme"].ToString();
        //                                    }
        //                                    indexAliment++;
        //                                }
        //                            }
        //                        }
        //                    }
        //                }
        //                catch (Exception ex)
        //                {
        //                    string s = "";
        //                }
        //            }


        //            res = xlPackage.GetAsByteArray();

        //        }
        //        return res;

        //    }
        //    catch (Exception ex)
        //    {
        //        string sss = "";
        //        return null;
        //    }
        //}
    }
}