using iTextSharp.xmp.impl;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.Xml.Linq;
using static ChemosensTools.cs.Helpers;
using Org.BouncyCastle.Utilities.Encoders;
using System.Net;
using Newtonsoft.Json;
using System.Net.Http;
using System.ServiceModel;
using TimeSens.webservices.helpers;
using System.Threading.Tasks;

namespace ChemosensTools.inca3Classifier.csModels
{
    public class inca3Classifier
    {

        private static string designationPassageFilePath = ConfigurationManager.AppSettings["DesignationPassageFilePath"];

        public class Pretraitement
        {
            public string Regexp;
            public string Remplacement;
            public string Type;
        }

        public class CorrespondanceCiqual
        {
            //public string Logigramme;
            public string DoitCommencerPar;
            public string DoitContenir;
            public string DevraitContenir;
            public string PeutContenir;
            public string DesignationCiqual;
            public string Commercialise;
            public string Consomme;
            public int AlimentMoyen;
            public List<string> MotsCles;

            public string alim_code;
            public string alim_grp_nom_fr;
            public string alim_ssgrp_nom_fr;
            public string alim_ssssgrp_nom_fr;

            public string gpe_INCA3_nom;
            public string aliment_libelle_INCA3;
        }

        public class Classifier
        {
            private List<Pretraitement> listPretraitement;
            private List<Pretraitement> listTraitementAliments;
            private List<Pretraitement> listTraitementNonAlimentaire;
            private List<string> motsLogigramme;
            private List<CorrespondanceCiqual> listCorrespondanceCiqual;
            private string regexpMotsAConserver;
            private string regexpMotsAConserverLogigramme;

            public Classifier(string designationPassageFilePath)
            {

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;



                using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(ConfigurationManager.AppSettings["DesignationPassageFilePath"])))
                {

                    try
                    {

                        var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);

                        var totalRows = myWorksheet.Dimension.End.Row;

                        this.listPretraitement = new List<Pretraitement>();
                        this.listTraitementAliments = new List<Pretraitement>();
                        this.listTraitementNonAlimentaire = new List<Pretraitement>();
                        for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        {
                            Pretraitement p = new Pretraitement();
                            p.Regexp = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();
                            p.Remplacement = (myWorksheet.Cells[rowNum, 3].Value ?? string.Empty).ToString();
                            p.Type = (myWorksheet.Cells[rowNum, 4].Value ?? string.Empty).ToString();
                            if (p.Type == "prétraitement")
                            {
                                this.listPretraitement.Add(p);
                            }
                            else if (p.Type == "non alimentaire")
                            {
                                this.listTraitementNonAlimentaire.Add(p);
                            }
                            else
                            {
                                this.listTraitementAliments.Add(p);
                            }
                        }

                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
                        totalRows = myWorksheet.Dimension.End.Row;
                        this.listCorrespondanceCiqual = new List<CorrespondanceCiqual>();

                        this.motsLogigramme = new List<string>();

                        for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        {
                            string cCommencePar = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();
                            string cDoitContenir = (myWorksheet.Cells[rowNum, 5].Value ?? string.Empty).ToString();
                            //string cDevraitContenir = (myWorksheet.Cells[rowNum, 3].Value ?? string.Empty).ToString();
                            //string cPeutContenir = (myWorksheet.Cells[rowNum, 4].Value ?? string.Empty).ToString();
                            string cMotsClesRechercheCommercialise = (myWorksheet.Cells[rowNum, 6].Value ?? string.Empty).ToString();
                            string cMotsClesRechercheConsomme = (myWorksheet.Cells[rowNum, 7].Value ?? string.Empty).ToString();
                            //int cAlimentMoyen = Convert.ToInt32((myWorksheet.Cells[rowNum, 8].Value ?? string.Empty).ToString());
                            int cAlimentMoyen = 0;
                            string cDesignationCiqual = (myWorksheet.Cells[rowNum, 10].Value ?? string.Empty).ToString();




                            string alim_code = (myWorksheet.Cells[rowNum, 12].Value ?? string.Empty).ToString();
                            string alim_grp_nom_fr = (myWorksheet.Cells[rowNum, 13].Value ?? string.Empty).ToString();
                            string alim_ssgrp_nom_fr = (myWorksheet.Cells[rowNum, 14].Value ?? string.Empty).ToString();
                            string alim_ssssgrp_nom_fr = (myWorksheet.Cells[rowNum, 15].Value ?? string.Empty).ToString();

                            string aliment_libelle_INCA3 = (myWorksheet.Cells[rowNum, 18].Value ?? string.Empty).ToString();
                            string gpe_INCA3_nom = (myWorksheet.Cells[rowNum, 19].Value ?? string.Empty).ToString();

                            cCommencePar.Split(';').ToList().ForEach(commencePar =>
                            {
                                cDoitContenir.Split(';').ToList().ForEach(contient =>
                                {
                                    CorrespondanceCiqual c = new CorrespondanceCiqual();
                                    c.DoitCommencerPar = commencePar.Trim();
                                    c.DesignationCiqual = cDesignationCiqual;
                                    c.Commercialise = cMotsClesRechercheCommercialise;
                                    c.Consomme = cMotsClesRechercheConsomme;
                                    c.AlimentMoyen = cAlimentMoyen;
                                    c.alim_code = alim_code;
                                    c.alim_grp_nom_fr = alim_grp_nom_fr;
                                    c.alim_ssgrp_nom_fr = alim_ssgrp_nom_fr;
                                    c.alim_ssssgrp_nom_fr = alim_ssssgrp_nom_fr;
                                    c.aliment_libelle_INCA3 = aliment_libelle_INCA3;
                                    c.gpe_INCA3_nom = gpe_INCA3_nom;

                                    if (this.motsLogigramme.Contains(c.DoitCommencerPar) == false)
                                    {
                                        this.motsLogigramme.Add(c.DoitCommencerPar);
                                    }

                                    c.MotsCles = contient.Split(new string[] { ">" }, StringSplitOptions.RemoveEmptyEntries).ToList();

                                    if (cDesignationCiqual != "")
                                    {
                                        this.listCorrespondanceCiqual.Add(c);
                                    }
                                });


                            });

                        }

                        // Nécessaire de commencer par les mots composés les plus long puis par ordre alphabétique décroissant
                        List<string> listMotsAConserver = (from x in listTraitementAliments select "\\b" + x.Regexp + "\\b").ToList();
                        listMotsAConserver = listMotsAConserver.Where(x => { return x != ""; }).OrderByDescending(x => x.Split(' ').Count()).ThenByDescending(x => x).ToList();
                        this.listTraitementAliments = this.listTraitementAliments.Where(x => { return x.Regexp != ""; }).OrderByDescending(x => x.Regexp.Length).ThenByDescending(x => x.Regexp).ToList();
                        this.regexpMotsAConserver = string.Join("|", listMotsAConserver);
                        this.regexpMotsAConserverLogigramme = string.Join("|", motsLogigramme);
                    }
                    catch (Exception ex)
                    {
                        string s = ex.Message;
                        //File.AppendAllText("E:\\data\\ciqualClassifier\\log.txt", ex.Message);
                    }

                }
            }

        }

        private static List<string> DesignationAsTableau(string designation, List<string> exceptions, List<string> motsASupprimer, int troncature)
        {
            string motMinusculeNettoye = DesignationNettoyee(designation, exceptions, motsASupprimer, troncature);
            
            List<string> tableauMots = new List<string>();
            for (int i = 0; i < motMinusculeNettoye.Length - 2; i++)
            {
                tableauMots.Add(motMinusculeNettoye.Substring(i, 3));
            }

            return tableauMots;
        }

        private static string DesignationNettoyee(string designation, List<string> exceptions, List<string> motsASupprimer, int troncature)
        {
            byte[] temp = System.Text.Encoding.GetEncoding("ISO-8859-8").GetBytes(designation);
            // Suppression des accents
            string motMinusculeNettoye = System.Text.Encoding.UTF8.GetString(temp).TrimEnd().TrimEnd(',');
            // Passage en minuscule
            motMinusculeNettoye = motMinusculeNettoye.Replace("'", "").ToLower();
            // Suppression des parenthèses
            //motMinusculeNettoye = Regex.Replace(motMinusculeNettoye, "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))", "");
            // Lettres uniquement            
            motMinusculeNettoye = new String(motMinusculeNettoye.Where(x => { return Char.IsLetter(x) || Char.IsWhiteSpace(x); }).ToArray());
            // Suppression des mots de 1 ou 2 caractère
            string[] tableau = motMinusculeNettoye.Split(' ');
            var mots = tableau.Where(x => x.Length > 2 || exceptions.Contains(x)).ToList();
            List<string> motsSansS = new List<string>();
            mots.ForEach(x =>
            {
                motsSansS.Add(x.TrimEnd('s'));
            });
            // Suppression des mots
            motsASupprimer.ForEach(x =>
            {
                if (motsSansS.Contains(x))
                {
                    motsSansS.RemoveAll(w=>w == x);
                }                
            });


            motMinusculeNettoye = String.Join("", motsSansS.ToArray());
            // Suppression des espaces
            motMinusculeNettoye = motMinusculeNettoye.Replace(" ", "");
            motMinusculeNettoye = motMinusculeNettoye.Substring(0, Math.Min(motMinusculeNettoye.Length, troncature));

            return motMinusculeNettoye;
        }

        public class ReferenceOFF
        {
            public string Famille;
            public string Designation;
            public List<string> Triplets;
            public string TripletsString;
            public double Pourcentage = 0.0;
            public double PourcentagePondere = 0.0;
            public double DifferenceCorrespondance = 0.0;
            public double PourcentageFamille = 0.0;
            public string DesignationNettoyee;
        }

        public class FamilleFoodEx
        {
            public string Famille;
            public double Pourcentage = 0.0;
            public double PourcentageMoyen = 0.0;
        }

        public class ResultatClassifieurFamilleFoodEx
        {
            public List<ReferenceOFF> ListeReferenceOFF;
            public List<FamilleFoodEx> ListeFamilleFoodEx;
            public string DesignationNettoyee;
            public string Triplets;
            public string Mode;
            public string TauxCorrespondanceMoyen;
            public string Freq;
            public double Pourcentage;
            public int CountAfter;
        }

        public class ResultReferentiel
        {
            public List<ReferenceOFF> ListeReferencesOFF = new List<ReferenceOFF>();
            public List<string> ListeExceptions = new List<string>();
            public List<string> ListeMotsASupprimer = new List<string>();
        }

        private static ResultReferentiel ReadReferentiel(string referentielPath, int troncature)
        {
            ResultReferentiel result = new ResultReferentiel();

            ExcelPackage xlPackage = new ExcelPackage(new FileInfo(referentielPath));

            var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);
            var totalRows = myWorksheet.Dimension.End.Row;

            if (xlPackage.Workbook.Worksheets.Count > 1)
            {
                myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
                totalRows = myWorksheet.Dimension.End.Row;

                for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                {
                    result.ListeExceptions.Add((myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString());
                }
            }

            if (xlPackage.Workbook.Worksheets.Count > 2)
            {
                myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(2);
                totalRows = myWorksheet.Dimension.End.Row;

                for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                {
                    result.ListeMotsASupprimer.Add((myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString());
                }
            }


            myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);
            totalRows = myWorksheet.Dimension.End.Row;

            for (int rowNum = 2; rowNum <= totalRows; rowNum++)
            {
                ReferenceOFF reference = new ReferenceOFF();
                reference.Famille = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();
                reference.Designation = (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString();
                //if (reference.Designation.Length > 0)
                //{
                //    reference.Designation= reference.Designation.Substring(0, Math.Min(reference.Designation.Length,troncature));
                //}
                reference.Triplets = DesignationAsTableau(reference.Designation, result.ListeExceptions, result.ListeMotsASupprimer, troncature);
                reference.DesignationNettoyee = DesignationNettoyee(reference.Designation, result.ListeExceptions, result.ListeMotsASupprimer, troncature);                
                myWorksheet.Cells[rowNum, 3].Value = reference.DesignationNettoyee;
                reference.TripletsString = string.Join(";", reference.Triplets);
                myWorksheet.Cells[rowNum, 4].Value = reference.TripletsString;
                result.ListeReferencesOFF.Add(reference);
            }



            return result;
        }

        private static List<string> intersect2(List<string> list1, List<string> list2)
        {
            var intersect = list1.Intersect(list2).ToList();
            var groups1 = list1.Where(e => intersect.Contains(e)).GroupBy(e => e);
            var groups2 = list2.Where(e => intersect.Contains(e)).GroupBy(e => e);

            var allGroups = groups1.Concat(groups2);

            var aa = allGroups.GroupBy(e => e.Key)
                .SelectMany(group => group
                    .First(g => g.Count() == group.Min(g1 => g1.Count())))
                .ToList();
            return (aa);
        }

        private static ResultatClassifieurFamilleFoodEx chercheCorrespondance(string designation, List<ReferenceOFF> listeReferences, List<string> exceptions, List<string> motsASupprimer, int pourcentage, bool matchExact, int troncature, int differenceCorrespondance, bool tauxCorrespondancePondere)
        {
            List<string> list2 = DesignationAsTableau(designation, exceptions, motsASupprimer, troncature);

            List<ReferenceOFF> listeReferencesOFF = new List<ReferenceOFF>();

            foreach (ReferenceOFF reference in listeReferences)
            {
                //string a = String.Join(";",reference.Triplets);
                //string b = String.Join(";", list2);
                //string c = String.Join(";", reference.Triplets.Intersect(list2));

                //double pourcentage1 = (double)(reference.Triplets.Intersect(list2).Count()) / (double)(reference.Triplets.Count());
                double pourcentage1 = (double)(intersect2(reference.Triplets, list2).Count()) / (double)(reference.Triplets.Count());
                //double pourcentage2 = (double)(list2.Intersect(reference.Triplets).Count()) / (double)(list2.Count());
                double pourcentage2 = (double)(intersect2(list2, reference.Triplets).Count()) / (double)(list2.Count());
                double pourcentageMoyen = ((pourcentage1 + pourcentage2) / 2) * 100;
                reference.Pourcentage = Math.Round(pourcentageMoyen, 2);
                reference.PourcentagePondere = Math.Round(((pourcentage1 + pourcentage2) / 2) * (1 - Math.Abs(pourcentage1 - pourcentage2)) * 100, 2);
                reference.DifferenceCorrespondance = Math.Round(Math.Abs(pourcentage1 - pourcentage2) * 100, 2);

                if (tauxCorrespondancePondere == false)
                {
                    if (reference.Pourcentage >= pourcentage && reference.DifferenceCorrespondance <= differenceCorrespondance)
                    {
                        listeReferencesOFF.Add(reference);
                        if (matchExact == true && pourcentageMoyen == 100)
                        {
                            listeReferencesOFF = new List<ReferenceOFF>();
                            listeReferencesOFF.Add(reference);
                            break;
                        }
                    }
                }
                if (tauxCorrespondancePondere == true)
                {
                    if (reference.PourcentagePondere >= pourcentage && reference.DifferenceCorrespondance <= differenceCorrespondance)
                    {
                        listeReferencesOFF.Add(reference);
                        if (matchExact == true && pourcentageMoyen == 100)
                        {
                            listeReferencesOFF = new List<ReferenceOFF>();
                            listeReferencesOFF.Add(reference);
                            break;
                        }
                    }
                }

            }

            ResultatClassifieurFamilleFoodEx resultat = new ResultatClassifieurFamilleFoodEx();
            resultat.ListeReferenceOFF = listeReferencesOFF.OrderByDescending(x => x.Pourcentage).ToList();
            resultat.ListeFamilleFoodEx = new List<FamilleFoodEx>();
            resultat.DesignationNettoyee = DesignationNettoyee(designation, exceptions, motsASupprimer, troncature);
            resultat.Triplets = string.Join(";", list2);

            var groups = listeReferencesOFF.GroupBy(n => n.Famille)
                         .Select(n => new
                         {
                             Famille = n.Key,
                             Count = n.Count(),
                             AverageScore = n.Average(x => x.PourcentagePondere)
                         })
                         .OrderBy(n => n.Famille);
            foreach (var group in groups)
            {
                FamilleFoodEx f = new FamilleFoodEx();
                f.Famille = group.Famille;
                f.PourcentageMoyen = Math.Round(group.AverageScore,2);
                f.Pourcentage = Math.Round(((double)group.Count / (double)listeReferencesOFF.Count) * 100, 2);                
                resultat.ListeFamilleFoodEx.Add(f);
            }
            resultat.ListeFamilleFoodEx = resultat.ListeFamilleFoodEx.OrderByDescending(x => x.Pourcentage).ToList();
            if (resultat.ListeFamilleFoodEx.Count > 0)
            {
                resultat.ListeReferenceOFF.ForEach(x => x.PourcentageFamille = (from y in resultat.ListeFamilleFoodEx
                                                                                where x.Famille == y.Famille
                                                                                select y.Pourcentage).ElementAt(0));
                resultat.ListeReferenceOFF = resultat.ListeReferenceOFF.OrderByDescending(x => x.PourcentageFamille).ThenByDescending(x => x.Pourcentage).ToList();

                //resultat.Mode = resultat.ListeFamilleFoodEx.ElementAt(0).Famille;
                resultat.Mode = resultat.ListeReferenceOFF.ElementAt(0).Famille;
                
                //resultat.Pourcentage = resultat.ListeFamilleFoodEx.ElementAt(0).Pourcentage;
                if (tauxCorrespondancePondere == true)
                {
                    resultat.Pourcentage = resultat.ListeReferenceOFF.ElementAt(0).PourcentagePondere;
                }
                else
                {
                    resultat.Pourcentage = resultat.ListeReferenceOFF.ElementAt(0).Pourcentage;
                }

                resultat.Freq = resultat.ListeReferenceOFF.ElementAt(0).Famille;
                resultat.TauxCorrespondanceMoyen = resultat.ListeFamilleFoodEx.OrderByDescending(x=>x.PourcentageMoyen).ElementAt(0).Famille;
            }

            return (resultat);
        }

        public static ResultatClassifieurFamilleFoodEx ClassifieurFamilleFoodEx(string referentielPath, string designation, int pourcentage = 45, bool matchExact = false, bool supprimeDoublons = false, int troncature = 1000, int differenceCorrespondance = 50, bool tauxCorrespondancePondere = false)
        {

            //TODO : connexion persistante, une seule fonction pour charger le référentiel

            try
            {
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                ResultReferentiel result = ReadReferentiel(referentielPath, troncature);
                List<ReferenceOFF> listeReferences = result.ListeReferencesOFF;
                // Suppression doublons
                if (supprimeDoublons == true)
                {
                    listeReferences = listeReferences.GroupBy(elem => elem.TripletsString).Select(group => group.First()).ToList();
                }

                ResultatClassifieurFamilleFoodEx resultat = chercheCorrespondance(designation, listeReferences, result.ListeExceptions, result.ListeMotsASupprimer, pourcentage, matchExact, troncature, differenceCorrespondance, tauxCorrespondancePondere);

                return (resultat);
            }
            catch (Exception ex)
            {
                File.WriteAllText("E:\\data\\ciqualClassifier\\log.txt", ex.Message);
                return null;
            }
        }

        public class UploadReferentielResult
        {
            public int CountBefore;
            public int CountAfter;
        }

        public static UploadReferentielResult UploadReferentiel(string data, string name)
        {
            try
            {
                //byte[] bytes = Org.BouncyCastle.Utilities.Encoders.Base64.Decode(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
                byte[] bytes = Convert.FromBase64String(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                MemoryStream stream = new MemoryStream(bytes);
                ExcelPackage xlPackage = new ExcelPackage(stream);
                xlPackage.SaveAs(new FileInfo(ConfigurationManager.AppSettings["ReferentielFoodExPath"] + name + ".xlsx"));

                ResultReferentiel result = ReadReferentiel(ConfigurationManager.AppSettings["ReferentielFoodExPath"] + name + ".xlsx", 1000);

                List<ReferenceOFF> list = result.ListeReferencesOFF;

                UploadReferentielResult res = new UploadReferentielResult();
                res.CountBefore = list.Count;
                res.CountAfter = list.GroupBy(x => new { x.TripletsString, x.Famille }).Select(group => group.First()).Count();

                return (res);

                //return list.Count;

            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason("Erreur lors du téléversement du fichier"), new FaultCode("Erreur lors du téléversement du fichier"));
            }
        }

        public static void SupprimeReferentiel(string name)
        {
            try
            {
                if (File.Exists(ConfigurationManager.AppSettings["ReferentielFoodExPath"] + name + ".xlsx"))
                {
                    File.Delete(ConfigurationManager.AppSettings["ReferentielFoodExPath"] + name + ".xlsx");
                }


            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason("Erreur lors de la suppression du fichier"), new FaultCode("Erreur lors de la suppression du fichier"));
            }
        }

        public static byte[] ClassifieurFamilleFoodExExcel(string referentielPath, string data, int pourcentage = 45, bool matchExact = false, bool supprimeDoublon = false, int troncature = 1000, string stat = "mode", int differenceCorrespondance = 50, bool tauxCorrespondancePondere = false)
        {
            //byte[] bytes = Org.BouncyCastle.Utilities.Encoders.Base64.Decode(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            byte[] bytes = Convert.FromBase64String(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            Classifier classifier = new Classifier(designationPassageFilePath);
            MemoryStream stream = new MemoryStream(bytes);

            //List<ReferenceOFF> listeReferencesOFF = new List<ReferenceOFF>();

            ResultReferentiel result = ReadReferentiel(referentielPath, troncature);

            List<ReferenceOFF> listeReferencesOFF = result.ListeReferencesOFF;
            // Suppression doublons
            if (supprimeDoublon == true)
            {
                listeReferencesOFF = listeReferencesOFF.GroupBy(x => new { x.TripletsString, x.Famille }).Select(group => group.First()).ToList();
            }

            ExcelPackage xlPackage = new ExcelPackage(stream);

            // Onglet avec désignations            
            var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);
            var totalRows = myWorksheet.Dimension.End.Row;

            myWorksheet.Cells[1, 2].Value = "Designation nettoyée";
            myWorksheet.Cells[1, 3].Value = "Triplets";
            myWorksheet.Cells[1, 4].Value = "Correspondance 1 (" + stat + ")";
            myWorksheet.Cells[1, 5].Value = "Pourcentage";

            /*for (int rowNum = 2; rowNum <= totalRows; rowNum++)
            {
                string designation = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();

                ResultatClassifieurFamilleFoodEx resultat = chercheCorrespondance(designation, listeReferencesOFF, result.ListeExceptions, result.ListeMotsASupprimer, pourcentage, matchExact, troncature, differenceCorrespondance, tauxCorrespondancePondere);
                myWorksheet.Cells[rowNum, 2].Value = resultat.DesignationNettoyee;
                myWorksheet.Cells[rowNum, 3].Value = resultat.Triplets;
                if (stat == "mode")
                {
                    myWorksheet.Cells[rowNum, 4].Value = resultat.Mode;
                }
                if (stat == "freq")
                {
                    myWorksheet.Cells[rowNum, 4].Value = resultat.Freq;
                }
                if (stat == "moy")
                {
                    myWorksheet.Cells[rowNum, 4].Value = resultat.TauxCorrespondanceMoyen;
                }
                myWorksheet.Cells[rowNum, 5].Value = resultat.Pourcentage;

                int index = 6;
                foreach (var f in resultat.ListeFamilleFoodEx.Skip(1))
                {
                    myWorksheet.Cells[1, index].Value = "Correspondance " + (index - 4).ToString(); ;
                    myWorksheet.Cells[rowNum, index].Value = f.Famille + " (" + f.Pourcentage + ")";
                    index++;
                }


            }*/
            Parallel.For(2, totalRows, rowNum =>
            {
                string designation = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();

                ResultatClassifieurFamilleFoodEx resultat = chercheCorrespondance(designation, listeReferencesOFF, result.ListeExceptions, result.ListeMotsASupprimer, pourcentage, matchExact, troncature, differenceCorrespondance, tauxCorrespondancePondere);
                myWorksheet.Cells[rowNum, 2].Value = resultat.DesignationNettoyee;
                myWorksheet.Cells[rowNum, 3].Value = resultat.Triplets;
                if (stat == "mode")
                {
                    myWorksheet.Cells[rowNum, 4].Value = resultat.Mode;
                }
                if (stat == "freq")
                {
                    myWorksheet.Cells[rowNum, 4].Value = resultat.Freq;
                }
                if (stat == "moy")
                {
                    myWorksheet.Cells[rowNum, 4].Value = resultat.TauxCorrespondanceMoyen;
                }
                myWorksheet.Cells[rowNum, 5].Value = resultat.Pourcentage;

                int index = 6;
                foreach (var f in resultat.ListeFamilleFoodEx.Skip(1))
                {
                    myWorksheet.Cells[1, index].Value = "Correspondance " + (index - 4).ToString(); ;
                    myWorksheet.Cells[rowNum, index].Value = f.Famille + " (" + f.Pourcentage + ")";
                    index++;
                }


            });

            xlPackage.Workbook.Worksheets.Add("Infos");
            myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
            myWorksheet.Cells[1, 1].Value = "Seuil choisi (%)";
            myWorksheet.Cells[1, 2].Value = pourcentage;
            myWorksheet.Cells[2, 1].Value = "Arrêt auto";
            myWorksheet.Cells[2, 2].Value = matchExact == true ? "Oui" : "Non";
            myWorksheet.Cells[3, 1].Value = "Suppression des doublons";
            myWorksheet.Cells[3, 2].Value = supprimeDoublon == true ? "Oui" : "Non";
            myWorksheet.Cells[4, 1].Value = "Seuil de troncature";
            myWorksheet.Cells[4, 2].Value = troncature;
            myWorksheet.Cells[5, 1].Value = "Statistique pour le choix de la catégorie";
            myWorksheet.Cells[5, 2].Value = stat;

            xlPackage.Save();
            return xlPackage.GetAsByteArray();
        }


    }
}