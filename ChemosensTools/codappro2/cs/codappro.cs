using ChemosensTools.Framework;
using ChemosensTools.Framework.cs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.IO.Packaging;
using System.Linq;
using System.ServiceModel;
using System.Text.RegularExpressions;
using System.Web;
using TimeSens.webservices.helpers;

namespace ChemosensTools.CodAppro
{

    public class Config
    {
        public Questionnaire Questionnaire = new Questionnaire();
        public List<string> ListOptions = new List<string>();
        public List<Aliment> ListAliments = new List<Aliment>();
        public List<KeyValuePair<string, string>> ListCategorie1 = new List<KeyValuePair<string, string>>();
        public List<KeyValuePair<string, string>> ListCategorie2 = new List<KeyValuePair<string, string>>();
        public List<KeyValuePair<string, string>> ListLieuxAchats = new List<KeyValuePair<string, string>>();
        //public List<KeyValuePair<string, string>> ListTextes = new List<KeyValuePair<string, string>>();
        public List<KeyValuePair<string, string>> ListLabels = new List<KeyValuePair<string, string>>();
    }

    public class Questionnaire
    {
        public string Code;
        public List<Aliment> Aliments = new List<Aliment>();
        public List<Ticket> Tickets = new List<Ticket>();
    }

    public class Ticket
    {
        public string Code;
        public string Date;
        public string Lieu;
        public string Image;
    }

    public class Aliment
    {
        public string TicketCode;
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
        public decimal PrixMin;
        public decimal PrixMax;
        public decimal PrixMinEpicerie;
        public decimal PrixMaxEpicerie;
        public decimal PoidsUnitaire;
    }

    public class CodAppro
    {
        public static bool CheckAccess(string xlFilePath, string code)
        {
            if (File.Exists(xlFilePath) == false)
            {
                throw new FaultException(new FaultReason("Code non reconnu."), new FaultCode("Code non reconnu."));
            }

            // Lecture du fichier Excel et vérification que code est dans la liste
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            List<string> codes = new List<string>();

            using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(xlFilePath)))
            {
                try
                {
                    var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);
                    var totalRows = myWorksheet.Dimension.End.Row;

                    for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                    {
                        try
                        {
                            codes.Add((myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString());
                        }
                        catch (Exception ex)
                        {
                            string s = ex.Message;
                        }
                    }

                }
                catch (Exception ex)
                {
                    string s = ex.Message;
                    //File.AppendAllText("E:\\data\\ciqualClassifier\\log.txt", ex.Message);
                }
            }

            if (codes.IndexOf(code) > -1)
            {
                return true;
            }
            else
            {
                throw new FaultException(new FaultReason("Code non reconnu."), new FaultCode("Code non reconnu."));
            }

        }

        public static string Translate(string xlDirPath, string sn,  string hashKey)
        {
            // Lecture des codes autorisés (fichier externe), authentification + renvoi du contenu json du code correspondant + des infos de configuration

            string dir = xlDirPath + "//" + sn;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;


            List<KeyValuePair<string,string>> liste = new List<KeyValuePair<string,string>>();

            // Lecture de la configuration
            using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(dir + "//config.xlsx")))
            {
                try
                {
                    // Lecture des clés pour l'internationalisation
                    var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(2);
                    var totalRows = myWorksheet.Dimension.End.Row;

                    for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                    {
                        try
                        {
                            string key = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "key")].Value ?? string.Empty).ToString();
                            string val = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "value")].Value ?? string.Empty).ToString();
                            liste.Add(new KeyValuePair<string, string>(key, val));
                        }
                        catch (Exception ex)
                        {
                            string s = ex.Message;
                        }
                    }

                }
                catch
                {
                }
            }
            return Serializer.SerializeToString(liste);
        }

        public static string Login(string xlDirPath, string sn, string code, string hashKey)
        {
            // Lecture des codes autorisés (fichier externe), authentification + renvoi du contenu json du code correspondant + des infos de configuration

            string dir = xlDirPath + "//" + sn;

            CheckAccess(dir + "//config.xlsx", code);

            if (Directory.Exists(dir + "//questionnaires") == false)
            {
                Directory.CreateDirectory(dir + "//questionnaires");
            }

            if (Directory.Exists(dir + "//pictures") == false)
            {
                Directory.CreateDirectory(dir + "//pictures");
            }

            Config config = new Config();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            // Lecture de la configuration
            using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(dir + "//config.xlsx")))
            {
                try
                {
                    // Lecture des Paramètres
                    var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
                    var totalRows = myWorksheet.Dimension.End.Row;
                    for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                    {
                        try
                        {
                            config.ListOptions.Add((myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString());
                        }
                        catch (Exception ex)
                        {
                            string s = ex.Message;
                        }
                    }

                    // Lecture des clés pour l'internationalisation
                    //myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(2);
                    //totalRows = myWorksheet.Dimension.End.Row;
                    //for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                    //{
                    //    try
                    //    {
                    //        string key = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "key")].Value ?? string.Empty).ToString();
                    //        string val = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "value")].Value ?? string.Empty).ToString();
                    //        config.ListTextes.Add(new KeyValuePair<string, string>(key, val));
                    //    }
                    //    catch (Exception ex)
                    //    {
                    //        string s = ex.Message;
                    //    }
                    //}

                    // Lecture des lieux d'achats
                    myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(3);
                    totalRows = myWorksheet.Dimension.End.Row;
                    for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                    {
                        try
                        {
                            config.ListLieuxAchats.Add(new KeyValuePair<string, string>((myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString(), (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString()));
                        }
                        catch (Exception ex)
                        {
                            string s = ex.Message;
                        }
                    }

                    // Lecture des aliments
                    myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(4);
                    totalRows = myWorksheet.Dimension.End.Row;
                    for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                    {
                        try
                        {
                            Aliment al = new Aliment();
                            al.LibelleCIQUAL = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_Designation")].Value ?? string.Empty).ToString();
                            al.LibelleCustom = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "DesignationModifiee")].Value ?? string.Empty).ToString();
                            al.CodeCIQUAL = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_alim_code")].Value ?? string.Empty).ToString();
                            al.Code = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CODAPPRO_alim_code")].Value ?? string.Empty).ToString();
                            al.Categorie1 = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "groupe_TI_TdC")].Value ?? string.Empty).ToString();
                            //al. = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_alim_grp_nom_fr")].Value ?? string.Empty).ToString();
                            //al.alim_ssgrp_nom_fr = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_alim_ssgrp_nom_fr")].Value ?? string.Empty).ToString();
                            //al.alim_ssssgrp_nom_fr = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_alim_ssssgrp_nom_fr")].Value ?? string.Empty).ToString();
                            //al. = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "groupe_TI_TdC")].Value ?? string.Empty).ToString();
                            //al.gpe_INCA3_nom = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "INCA3_gpe")].Value ?? string.Empty).ToString();
                            string a = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "min_5_magasins")].Value ?? string.Empty).ToString();
                            string asol = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "min_5_epiceries")].Value ?? string.Empty).ToString();
                            al.PrixMin = 0;
                            if (a != "")
                            {
                                al.PrixMin = Convert.ToDecimal(a.Replace(".", ","));
                            }

                            al.PrixMinEpicerie = 0;
                            if (asol != "")
                            {
                                al.PrixMinEpicerie = Convert.ToDecimal(asol.Replace(".", ","));
                            }

                            al.PrixMax = 0;
                            al.PrixMaxEpicerie = 0;
                            string b = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "max_95_magasins")].Value ?? string.Empty).ToString();
                            string bsol = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "max_95_epiceries")].Value ?? string.Empty).ToString();
                            if (b != "")
                            {
                                al.PrixMax = Convert.ToDecimal(b);
                            }
                            if (bsol != "")
                            {
                                al.PrixMaxEpicerie = Convert.ToDecimal(bsol);
                            }
                            string cc = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "poids_unitaire")].Value ?? string.Empty).ToString();
                            al.PoidsUnitaire = 0;
                            if (cc != "")
                            {
                                al.PoidsUnitaire = Convert.ToDecimal(cc);
                            }

                            config.ListAliments.Add(al);
                        }
                        catch (Exception ex)
                        {
                            string s = ex.Message;
                        }
                    }

                    // Lecture des categories 1
                    myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(5);
                    totalRows = myWorksheet.Dimension.End.Row;
                    for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                    {
                        try
                        {
                            config.ListCategorie1.Add(new KeyValuePair<string, string>((myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString(), (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString()));
                        }
                        catch (Exception ex)
                        {
                            string s = ex.Message;
                        }
                    }

                    // Lecture des categories 2
                    myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(6);
                    totalRows = myWorksheet.Dimension.End.Row;
                    for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                    {
                        try
                        {
                            config.ListCategorie2.Add(new KeyValuePair<string, string>((myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString(), (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString()));
                        }
                        catch (Exception ex)
                        {
                            string s = ex.Message;
                        }
                    }

                    // Lecture des labels
                    myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(7);
                    totalRows = myWorksheet.Dimension.End.Row;
                    for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                    {
                        try
                        {
                            config.ListLabels.Add(new KeyValuePair<string, string>((myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString(), (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString()));
                        }
                        catch (Exception ex)
                        {
                            string s = ex.Message;
                        }
                    }

                }
                catch (Exception ex)
                {
                    string s = ex.Message;
                    //File.AppendAllText("E:\\data\\ciqualClassifier\\log.txt", ex.Message);
                }
            }

            string file = dir + "//questionnaires//" + code + ".json";

            if (File.Exists(file))
            {
                config.Questionnaire = Serializer.Deserialize<Questionnaire>(file, hashKey);
            }
            else
            {
                config.Questionnaire = new Questionnaire();
                config.Questionnaire.Code = code;
                Serializer.Serialize(config.Questionnaire, file, hashKey);
            }

            return Serializer.SerializeToString(config);
        }

        public static void ImportQuestionnaire(string data, string dataDirPath, string hashKey)
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
                o.TicketCode = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CodeTicket")].Value ?? string.Empty).ToString();
                o.Code = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Code")].Value ?? string.Empty).ToString();
                o.Lieu = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Lieu")].Value ?? string.Empty).ToString();
                o.Date = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Date")].Value ?? string.Empty).ToString();
                //o.CodeCIQUAL = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CodeCIQUAL")].Value ?? string.Empty).ToString();
                //o.LibelleCIQUAL = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "LibelleCIQUAL")].Value ?? string.Empty).ToString();
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
                Questionnaire quest;

                //CheckAccess(authorizedCodesFilePath, code);

                string file = dataDirPath + code + ".json";
                if (File.Exists(file))
                {
                    quest = Serializer.Deserialize<Questionnaire>(file, hashKey);
                }
                else
                {
                    quest = new Questionnaire();
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

        public static void SaveQuestionnaire(string xlDirPath, string sn, string code, string jsonQuestionnaire, string hashKey)
        {
            try
            {
                string dir = xlDirPath + "//" + sn;

                CheckAccess(dir + "//config.xlsx", code);


                string file = dir + "//questionnaires//" + code + ".json";
                File.WriteAllText(file, Serializer.Encrypt(System.Uri.UnescapeDataString(jsonQuestionnaire), hashKey));
            }
            catch (Exception ex)
            {
                //File.WriteAllText("E:\\data\\codachats\\log.txt", ex.Message);
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string DownloadData(string xlDirPath, string sn, string code, string hashKey)
        {
            Questionnaire quest = Serializer.Deserialize<Questionnaire>(xlDirPath + "//" + sn + "//questionnaires//" + code + ".json", hashKey);
            return Serializer.SerializeToString(quest);
        }

        public static byte[] DownloadQuestionnaire(string questionnaireDirPath, string hashKey)
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
                    sheet.Cells[1, 2].Value = "TicketCode";
                    sheet.Cells[1, 3].Value = "Lieu";
                    sheet.Cells[1, 4].Value = "Date";
                    sheet.Cells[1, 5].Value = "CodeCIQUAL";
                    sheet.Cells[1, 6].Value = "LibelleCIQUAL";
                    sheet.Cells[1, 7].Value = "Categorie1";
                    sheet.Cells[1, 8].Value = "Categorie2";
                    sheet.Cells[1, 9].Value = "Nb";
                    sheet.Cells[1, 10].Value = "Unite";
                    sheet.Cells[1, 11].Value = "Prix";
                    sheet.Cells[1, 12].Value = "Appreciation";
                    sheet.Cells[1, 13].Value = "Labels";
                    sheet.Cells[1, 14].Value = "Menu";
                    sheet.Cells[1, 15].Value = "PrixMenu";
                    sheet.Cells[1, 16].Value = "LibelleCustom";
                    sheet.Cells[1, 17].Value = "MontantChequeAlimentaire";
                    sheet.Cells[1, 18].Value = "DateSaisie";
                    sheet.Cells[1, 19].Value = "DateMAJ";
                    sheet.Cells[1, 20].Value = "Photo";

                    foreach (string f in Directory.EnumerateFiles(questionnaireDirPath))
                    {
                        try
                        {
                            Questionnaire quest = Serializer.Deserialize<Questionnaire>(f, hashKey);

                            foreach (Aliment al in quest.Aliments)
                            {
                                sheet.Cells[index, 1].Value = quest.Code;
                                sheet.Cells[index, 2].Value = al.TicketCode;
                                sheet.Cells[index, 3].Value = al.Lieu;
                                sheet.Cells[index, 4].Value = al.Date;
                                sheet.Cells[index, 5].Value = al.CodeCIQUAL;
                                sheet.Cells[index, 6].Value = al.LibelleCIQUAL;
                                sheet.Cells[index, 7].Value = al.Categorie1;
                                sheet.Cells[index, 8].Value = al.Categorie2;
                                sheet.Cells[index, 9].Value = al.Nb;
                                sheet.Cells[index, 10].Value = al.Unite;
                                sheet.Cells[index, 11].Value = al.Prix;
                                sheet.Cells[index, 12].Value = al.Appreciation;
                                sheet.Cells[index, 13].Value = String.Join(", ", al.Labels);
                                sheet.Cells[index, 14].Value = al.Menu;
                                sheet.Cells[index, 15].Value = al.PrixMenu;
                                sheet.Cells[index, 16].Value = al.LibelleCustom;
                                sheet.Cells[index, 17].Value = al.MontantChequeAlimentaire;

                                try
                                {
                                    if (al.DateSaisie.IndexOf("/") > -1)
                                    {
                                        string[] t = al.DateSaisie.Split('/');
                                        al.DateSaisie = t[2] + "-" + Convert.ToInt32(t[0]).ToString("D2") + "-" + Convert.ToInt32(t[1]).ToString("D2");
                                    }
                                }
                                catch
                                { }
                                sheet.Cells[index, 18].Value = al.DateSaisie;

                                try
                                {
                                    if (al.DateModif.IndexOf("/") > -1)
                                    {
                                        string[] t = al.DateModif.Split('/');
                                        al.DateModif = t[2] + "-" + Convert.ToInt32(t[0]).ToString("D2") + "-" + Convert.ToInt32(t[1]).ToString("D2");
                                    }
                                }
                                catch
                                { }
                                sheet.Cells[index, 19].Value = al.DateModif;

                                try
                                {
                                    sheet.Cells[index, 20].Value = (from x in quest.Tickets where x.Code == al.TicketCode select x.Image).ElementAt(0);
                                }
                                catch
                                { }

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