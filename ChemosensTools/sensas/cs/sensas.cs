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

namespace ChemosensTools.Sensas
{
    public class Sensas
    {
        public static List<string> GetAuthorizedCodes(string authorizedCodesFilePath)
        {
            List<string> authorizedCodes = File.ReadAllText(authorizedCodesFilePath, System.Text.Encoding.UTF8).Split(';').ToList();
            return authorizedCodes;
        }

        public static bool CheckAccess(string authorizedCodesFilePath, string code)
        {
            List<string> authorizedCodes = GetAuthorizedCodes(authorizedCodesFilePath);

            //File.AppendAllText("E:\\data\\consodrive\\log\\log.txt", string.Join(";", authorizedCodes));
            //if (authorizedCodes.Contains(code))
            if (authorizedCodes.IndexOf(code) > -1)
            {
                return true;
            }
            else
            {
                //File.AppendAllText("E:\\data\\consodrive\\log\\log.txt", authorizedCodes.Last());
                throw new FaultException(new FaultReason("Code non reconnu."), new FaultCode(""));
            }

        }

        public static string Login(string authorizedCodesFilePath, string dataDirPath, string code, string hashKey)
        {
            string json = "";
            // Lecture des codes autorisés (fichier externe), authentification + renvoi du contenu json du code correspondant
            CheckAccess(authorizedCodesFilePath, code);

            // lecture du fichier de résultats ou création d'un nouveau fichier
            string file = dataDirPath + code + ".json";
            if (File.Exists(file))
            {
                json = Read(file, hashKey);
            }
            else
            {
                File.Create(file).Dispose();
            }

            return json;
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

        public static void SaveQuestionnaire(string authorizedCodesFilePath, string dataDirPath, string code, string jsonQuestionnaire, string hashKey)
        {
            try
            {
                CheckAccess(authorizedCodesFilePath, code);
                string file = dataDirPath + code + ".json";
                File.WriteAllText(file, Serializer.Encrypt(System.Uri.UnescapeDataString(jsonQuestionnaire), hashKey));
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        private static int? convert(JToken number)
        {
            int variable = 0;
            if (int.TryParse(number.ToString(), out variable))
            {
                return variable;
            }
            return null;
        }

        private static double? convertD(JToken number)
        {
            double variable = 0;
            if (double.TryParse(number.ToString(), out variable))
            {
                return variable;
            }
            return null;
        }

        public static byte[] DownloadQuestionnaireSensas(string questionnaireDirPath, string hashKey)
        {
            try
            {
                byte[] res = null;

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage xlPackage = new ExcelPackage())
                {
                    var subjectSheet = xlPackage.Workbook.Worksheets.Add("Sujet");
                    int indexSubject = 2;
                    subjectSheet.Cells[1, 1].Value = "CodeSujet";
                    subjectSheet.Cells[1, 2].Value = "ConsentementAccepte";
                    subjectSheet.Cells[1, 3].Value = "Page";
                    subjectSheet.Cells[1, 4].Value = "Date";
                    subjectSheet.Cells[1, 5].Value = "PrefScoreAffiche";
                    subjectSheet.Cells[1, 6].Value = "Ecran1";
                    subjectSheet.Cells[1, 7].Value = "Ecran2";
                    subjectSheet.Cells[1, 8].Value = "Total";

                    var productSheet = xlPackage.Workbook.Worksheets.Add("Produit");
                    int indexProduct = 2;

                    productSheet.Cells[1, 1].Value = "CodeSujet";
                    productSheet.Cells[1, 2].Value = "CodeProduit";
                    productSheet.Cells[1, 3].Value = "Position";
                    productSheet.Cells[1, 4].Value = "Quantite";
                    productSheet.Cells[1, 5].Value = "RaisonPrix";
                    productSheet.Cells[1, 6].Value = "RaisonDejaGoute";
                    productSheet.Cells[1, 7].Value = "RaisonNutriscore";
                    productSheet.Cells[1, 8].Value = "RaisonPrefscore";                    
                    productSheet.Cells[1, 9].Value = "RaisonMarque";
                    productSheet.Cells[1, 10].Value = "RaisonNouveaute";
                    productSheet.Cells[1, 11].Value = "RaisonAutre";
                    productSheet.Cells[1, 12].Value = "RaisonAutreDetail";
                    productSheet.Cells[1, 13].Value = "PrixUnitaire";
                    productSheet.Cells[1, 14].Value = "QualiteNutrition";                    
                    productSheet.Cells[1, 15].Value = "QualiteGout";


                    foreach (string f in Directory.EnumerateFiles(questionnaireDirPath))
                    {
                        string json = Read(f, hashKey);

                        try
                        {

                            JObject jObject = JsonConvert.DeserializeObject<JObject>(json);
                            if (jObject["CodeSujet"] != null)
                            {
                                subjectSheet.Cells[indexSubject, 1].Value = jObject["CodeSujet"].ToString();

                                if (jObject["ConsentementAccepte"] != null)
                                {
                                    subjectSheet.Cells[indexSubject, 2].Value = jObject["ConsentementAccepte"].ToString();
                                }
                                if (jObject["Page"] != null)
                                {
                                    subjectSheet.Cells[indexSubject, 3].Value = jObject["Page"].ToString();
                                }
                                if (jObject["Date"] != null)
                                {
                                    subjectSheet.Cells[indexSubject, 4].Value = jObject["Date"].ToString();
                                }
                                if (jObject["PrefScore"] != null)
                                {
                                    subjectSheet.Cells[indexSubject, 5].Value = jObject["PrefScore"].ToString();
                                }
                                if (jObject["Type1"] != null)
                                {
                                    subjectSheet.Cells[indexSubject, 6].Value = jObject["Type1"].ToString();
                                }
                                if (jObject["Type2"] != null)
                                {
                                    subjectSheet.Cells[indexSubject, 7].Value = jObject["Type2"].ToString();
                                }

                                

                                if (jObject["Aliments"] != null)
                                {
                                    double total = 0;
                                    foreach (JToken t in jObject["Aliments"].Children())
                                    {

                                        if (jObject["CodeSujet"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 1].Value = jObject["CodeSujet"].ToString();
                                        }
                                        if (t["Code"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 2].Value = t["Code"].ToString();
                                        }
                                        if (t["Position"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 3].Value = convert(t["Position"]);
                                        }
                                        if (t["Quantite"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 4].Value = convert(t["Quantite"]);
                                            total += (double)convert(t["Quantite"]) * (double)convertD(t["PrixUnitaire"]);
                                        }                                        
                                        if (t["RaisonPrix"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 5].Value = convert(t["RaisonPrix"]);
                                        }
                                        if (t["RaisonDejaGoute"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 6].Value = convert(t["RaisonDejaGoute"]);
                                        }
                                        if (t["RaisonNutriscore"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 7].Value = convert(t["RaisonNutriscore"]);
                                        }
                                        if (t["RaisonPrefscore"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 8].Value = convert(t["RaisonPrefscore"]);
                                        }
                                        
                                        if (t["RaisonMarque"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 9].Value = convert(t["RaisonMarque"]);
                                        }
                                        if (t["RaisonNouveaute"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 10].Value = convert(t["RaisonNouveaute"]);
                                        }
                                        if (t["RaisonAutre"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 11].Value = convert(t["RaisonAutre"]);
                                        }
                                        if (t["RaisonAutreDetail"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 12].Value = t["RaisonAutreDetail"].ToString();
                                        }

                                        if (t["PrixUnitaire"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 13].Value = convertD(t["PrixUnitaire"]);
                                        }
                                        if (t["NutriScore"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 14].Value = t["NutriScore"].ToString();
                                        }
                                        
                                        if (t["PrefScore"] != null)
                                        {
                                            productSheet.Cells[indexProduct, 15].Value = t["PrefScore"].ToString();
                                        }

                                        indexProduct++;
                                    }
                                    subjectSheet.Cells[indexSubject, 8].Value = total;
                                }

                                indexSubject++;


                            }
                        }
                        catch (Exception ex)
                        {
                            string s = "";
                        }
                    }


                    res = xlPackage.GetAsByteArray();

                }
                return res;

            }
            catch (Exception ex)
            {
                string sss = "";
                return null;
            }
        }
    }
}