using ChemosensTools.Framework;
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
using System.Text.RegularExpressions;
using System.Web;
using TimeSens.webservices.helpers;

namespace ChemosensTools.CodAchats
{

    public class QuestionnaireCodAchats
    {
        public string Code;
        public List<Aliment> Aliments = new List<Aliment>();
    }

    public class Aliment
    {
        public string Code;
        public string Date;
        public string Lieu;
        public string CodeCIQUAL;
        public string LibelleCIQUAL;
        public string Categorie1;
        public string Categorie2;
        public decimal Nb;
        public string Unite;
        public decimal Prix;
        public int Appreciation;
        public List<string> Labels = new List<string>();
        public string Menu;
        public decimal PrixMenu;
        public string LibelleCustom;
        public decimal MontantChequeAlimentaire;
        public string DateSaisie;
        public string DateModif;
        public string Image;
    }

    public class CodAchats
    {

        public static List<string> GetAuthorizedCodes(string authorizedCodesFilePath)
        {
            List<string> authorizedCodes = File.ReadAllText(authorizedCodesFilePath, System.Text.Encoding.UTF8).Split(new string[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries).ToList();
            return authorizedCodes;
        }

        public static bool CheckAccess(string authorizedCodesFilePath, string code)
        {
            List<string> authorizedCodes = GetAuthorizedCodes(authorizedCodesFilePath);
            if (authorizedCodes.IndexOf(code) > -1)
            {
                return true;
            }
            else
            {
                throw new FaultException(new FaultReason("Code non reconnu."), new FaultCode("Code non reconnu."));
            }

        }


        public static string Login(string authorizedCodesFilePath, string dataDirPath, string code, string hashKey)
        {
            // Lecture des codes autorisés (fichier externe), authentification + renvoi du contenu json du code correspondant
            CheckAccess(authorizedCodesFilePath, code);

            // Lecture du fichier de résultats ou création d'un nouveau fichier
            string file = dataDirPath + code + ".json";

            QuestionnaireCodAchats quest;

            if (File.Exists(file))
            {
                quest = Serializer.Deserialize<QuestionnaireCodAchats>(file, hashKey);
            }
            else
            {
                quest = new QuestionnaireCodAchats();
                quest.Code = code;
                Serializer.Serialize(quest, file, hashKey);
            }

            return Serializer.SerializeToString(quest);
        }

        public static void ImportQuestionnaire(string data, string authorizedCodesFilePath, string dataDirPath, string hashKey)
        {

            //byte[] bytes = Org.BouncyCastle.Utilities.Encoders.Base64.Decode(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            byte[] bytes = Convert.FromBase64String(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            MemoryStream stream = new MemoryStream(bytes);
            ExcelPackage xlPackage = new ExcelPackage(stream);
            //xlPackage.SaveAs(new FileInfo(ConfigurationManager.AppSettings["ReferentielFoodExPath"] + name + ".xlsx"));

            var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);

            var totalRows = myWorksheet.Dimension.End.Row;

            List<Aliment> list = new List<Aliment>();

            for (int rowNum = 2; rowNum <= totalRows; rowNum++)
            {

                Aliment o = new Aliment();
                o.Code = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Code")].Value ?? string.Empty).ToString();
                o.Lieu = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Lieu")].Value ?? string.Empty).ToString();
                o.Date = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Date")].Value ?? string.Empty).ToString();
                o.CodeCIQUAL = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CodeCIQUAL")].Value ?? string.Empty).ToString();
                o.LibelleCIQUAL = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "LibelleCIQUAL")].Value ?? string.Empty).ToString();
                o.Categorie1 = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Categorie1")].Value ?? string.Empty).ToString();
                o.Categorie2 = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Categorie2")].Value ?? string.Empty).ToString();

                string nb = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Nb")].Value ?? string.Empty).ToString();
                if (nb != "")
                {
                    o.Nb = Convert.ToDecimal(nb);
                }
                o.Unite = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Unite")].Value ?? string.Empty).ToString();
                string prix = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Prix")].Value ?? string.Empty).ToString();
                if (prix != "")
                {
                    o.Prix = Convert.ToDecimal(prix);
                }

                //o.Appreciation = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Appreciation")].Value ?? string.Empty).ToString();
                //o.Labels = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Labels")].Value ?? string.Empty).ToString().Split(',');
                o.Menu = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Menu")].Value ?? string.Empty).ToString();
                string prixmenu = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "PrixMenu")].Value ?? string.Empty).ToString();
                if (prixmenu != "")
                {
                    o.PrixMenu = Convert.ToDecimal(prixmenu);
                }
                o.LibelleCustom = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "LibelleCustom")].Value ?? string.Empty).ToString();

                list.Add(o);

            }

            List<string> codes = (from x in list select x.Code).ToList();

            codes.Distinct().ToList().ForEach(code =>
            {
                QuestionnaireCodAchats quest;

                //CheckAccess(authorizedCodesFilePath, code);

                string file = dataDirPath + code + ".json";
                if (File.Exists(file))
                {
                    quest = Serializer.Deserialize<QuestionnaireCodAchats>(file, hashKey);
                }
                else
                {
                    quest = new QuestionnaireCodAchats();
                    quest.Code = code;
                }

                foreach (Aliment al in list.Where(x => x.Code == code))
                {
                    quest.Aliments.Add(al);
                }

                Serializer.Serialize(quest, file, hashKey);

                //list.Select(x => x.attributes.Code as string).ToList();

                //quest.Aliments

                //var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(list);
            });

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
                File.WriteAllText("E:\\data\\codachats\\log.txt", ex.Message);
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string DownloadData(string questionnaireDirPath, string code, string hashKey)
        {
            QuestionnaireCodAchats quest = Serializer.Deserialize<QuestionnaireCodAchats>(questionnaireDirPath + code + ".json", hashKey);
            return Serializer.SerializeToString(quest);
        }

        public static byte[] DownloadQuestionnaireCodAchats(string questionnaireDirPath, string hashKey)
        {
            try
            {
                byte[] res = null;

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage xlPackage = new ExcelPackage())
                {
                    var sheet = xlPackage.Workbook.Worksheets.Add("Aliments");
                    int index = 2;

                    sheet.Cells[1, 1].Value = "Code";
                    sheet.Cells[1, 2].Value = "Lieu";
                    sheet.Cells[1, 3].Value = "Date";
                    sheet.Cells[1, 4].Value = "CodeCIQUAL";
                    sheet.Cells[1, 5].Value = "LibelleCIQUAL";
                    sheet.Cells[1, 6].Value = "Categorie1";
                    sheet.Cells[1, 7].Value = "Categorie2";
                    sheet.Cells[1, 8].Value = "Nb";
                    sheet.Cells[1, 9].Value = "Unite";
                    sheet.Cells[1, 10].Value = "Prix";
                    sheet.Cells[1, 11].Value = "Appreciation";
                    sheet.Cells[1, 12].Value = "Labels";
                    sheet.Cells[1, 13].Value = "Menu";
                    sheet.Cells[1, 14].Value = "PrixMenu";
                    sheet.Cells[1, 15].Value = "LibelleCustom";
                    sheet.Cells[1, 16].Value = "MontantChequeAlimentaire";
                    sheet.Cells[1, 17].Value = "DateSaisie";
                    sheet.Cells[1, 18].Value = "DateMAJ";
                    sheet.Cells[1, 19].Value = "Photo";



                    foreach (string f in Directory.EnumerateFiles(questionnaireDirPath))
                    {
                        try
                        {
                            QuestionnaireCodAchats quest = Serializer.Deserialize<QuestionnaireCodAchats>(f, hashKey);

                            foreach (Aliment al in quest.Aliments)
                            {
                                sheet.Cells[index, 1].Value = quest.Code;
                                sheet.Cells[index, 2].Value = al.Lieu;
                                sheet.Cells[index, 3].Value = al.Date;
                                sheet.Cells[index, 4].Value = al.CodeCIQUAL;
                                sheet.Cells[index, 5].Value = al.LibelleCIQUAL;
                                sheet.Cells[index, 6].Value = al.Categorie1;
                                sheet.Cells[index, 7].Value = al.Categorie2;
                                sheet.Cells[index, 8].Value = al.Nb;
                                sheet.Cells[index, 9].Value = al.Unite;
                                sheet.Cells[index, 10].Value = al.Prix;
                                sheet.Cells[index, 11].Value = al.Appreciation;
                                sheet.Cells[index, 12].Value = String.Join(", ", al.Labels);

                                sheet.Cells[index, 13].Value = al.Menu;
                                sheet.Cells[index, 14].Value = al.PrixMenu;
                                sheet.Cells[index, 15].Value = al.LibelleCustom;
                                sheet.Cells[index, 16].Value = al.MontantChequeAlimentaire;

                                try
                                {
                                    if (al.DateSaisie != null &&  al.DateSaisie.IndexOf("/") > -1)
                                    {
                                        string[] t = al.DateSaisie.Split('/');
                                        al.DateSaisie = t[2] + "-" + Convert.ToInt32(t[0]).ToString("D2") + "-" + Convert.ToInt32(t[1]).ToString("D2");
                                    }
                                }
                                catch
                                { }
                                sheet.Cells[index, 17].Value = al.DateSaisie;

                                try
                                {
                                    if (al.DateModif != null && al.DateModif.IndexOf("/") > -1)
                                    {
                                        string[] t = al.DateModif.Split('/');
                                        al.DateModif = t[2] + "-" + Convert.ToInt32(t[0]).ToString("D2") + "-" + Convert.ToInt32(t[1]).ToString("D2");
                                    }
                                }
                                catch
                                { }
                                sheet.Cells[index, 18].Value = al.DateModif;


                                sheet.Cells[index, 19].Value = 0;

                                // Verif photo                                                                  
                                if (al.DateSaisie != null)
                                {
                                    string file = quest.Code + "_" + al.DateSaisie.Replace("-", "") + "*";

                                    try
                                    {
                                        string[] matches = Directory.GetFiles(ConfigurationManager.AppSettings["CodApproImgDirPath"], file);
                                        if (matches.Count() > 0)
                                        {
                                            sheet.Cells[index, 19].Value = 1;
                                        }
                                    }
                                    catch
                                    { }
                                }

                                index++;
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
                return null;
            }
        }
    }
}