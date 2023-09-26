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
using System.Runtime.Caching;
using ChemosensTools.Framework;

namespace ChemosensTools.ciqualClassifier.csModels
{
    public class ciqualClassifier
    {

        private static string designationPassageFilePath = ConfigurationManager.AppSettings["ReferentielCiqual"];



        public class Pretraitement
        {
            public string Regexp;
            public string Remplacement;
            public string Type;
        }

        public class CorrespondanceLogigramme
        {
            public string CommencePar;
            public string Contient;
            public string Logigramme;
        }

        public class CorrespondanceCiqual
        {
            //public string Logigramme;
            public string DoitCommencerPar;
            public string DoitContenir;
            public string DevraitContenir;
            public string PeutContenir;
            public string DesignationCiqual;
            public string DesignationModifiee;
            public string Commercialise;
            public string Consomme;
            public string Calnut;
            public int AlimentMoyen;
            public List<string> MotsCles;

            public string alim_code_codachats;
            public string alim_code;

            public string alim_grp_nom_fr;
            public string alim_ssgrp_nom_fr;
            public string alim_ssssgrp_nom_fr;

            public string gpe_INCA3_nom;
            public string gpe_TI;

            public decimal min_5_magasins;
            public decimal max_95_magasins;
            public decimal min_5_magasins_sol;
            public decimal max_95_magasins_sol;
            public decimal poids_unitaire;

        }

        public class ClassifierResult
        {
            public List<string> MotsCles = new List<string>();
            public List<string> CommencePar = new List<string>();
            public List<MatchCount> Matches = new List<MatchCount>();
        }

        public class MatchCount
        {
            public string CommencePar;
            public string Consomme;
            public string DesignationCIQUAL;
            public string DesignationModifiee;
            public int NbMotsImperatifs;
            public int NbMotsSuggeres;
            public int NbMotsSuggeresMax = 0;
            public int NbMotsFacultatifs;
            public List<string> Mots;
            public int MatchExact;
            public int MatchSuggere;
            public int MatchApproximatif = 0;
            public int MeilleurMatchApproximatif = 0;
            public int MeilleurMatch = 0;
            public int Suggestion1 = 0;
            public int Suggestion2 = 0;
            public int NbMotsLexique;
            public int AlimentMoyen = 0;

            public int NiveauMax = 0;
            public int NbMots = 0;
            public int NbMotsSansPretraitement = 0;
            public int NiveauCorrespondance = 0;
            public int NombreCorrespondances = 0;
            public string Match;

            public string alim_code;
            public string alim_grp_nom_fr;
            public string alim_ssgrp_nom_fr;
            public string alim_ssssgrp_nom_fr;

            public string alim_code_codachats;

            public string gpe_TI;
            public string gpe_INCA3_nom;
            public string aliment_libelle_INCA3;

            public decimal min_5_magasins;
            public decimal max_95_magasins;

            public decimal min_5_magasins_sol;
            public decimal max_95_magasins_sol;

            public decimal poids_unitaire;
        }

        public class Calnut
        {
            public string DesignationModifiee;
            public string gpe_TI;
            public string alim_code;
            public string alim_code_codachats;
            public decimal min_5_magasins;
            public decimal max_95_magasins;
            public decimal min_5_magasins_sol;
            public decimal max_95_magasins_sol;
            public decimal poids_unitaire;
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
            private List<KeyValuePair<string, string>> listExceptions = new List<KeyValuePair<string, string>>();

            public Classifier(string designationPassageFilePath)
            {

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(ConfigurationManager.AppSettings["ReferentielCiqual"])))
                {

                    try
                    {

                        var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);

                        var totalRows = myWorksheet.Dimension.End.Row;

                        this.listPretraitement = new List<Pretraitement>();
                        this.listTraitementAliments = new List<Pretraitement>();
                        this.listTraitementNonAlimentaire = new List<Pretraitement>();
                        this.listExceptions = new List<KeyValuePair<string, string>>();


                        for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        {
                            try
                            {
                                Pretraitement p = new Pretraitement();
                                p.Regexp = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();
                                p.Remplacement = (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString();
                                p.Type = (myWorksheet.Cells[rowNum, 3].Value ?? string.Empty).ToString();
                                if (p.Type == "prétraitement")
                                {
                                    this.listPretraitement.Add(p);
                                }
                                else if (p.Type == "non alimentaire")
                                {
                                    this.listTraitementNonAlimentaire.Add(p);
                                }
                                else if (p.Type == "exception")
                                {
                                    this.listExceptions.Add(new KeyValuePair<string, string>(p.Regexp, p.Remplacement));
                                }
                                else
                                {
                                    this.listTraitementAliments.Add(p);
                                }
                            }
                            catch (Exception ex)
                            {
                                string s = ex.Message;
                            }
                        }

                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
                        totalRows = myWorksheet.Dimension.End.Row;
                        this.listCorrespondanceCiqual = new List<CorrespondanceCiqual>();

                        this.motsLogigramme = new List<string>();

                        for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        {
                            try
                            {
                                string cDoitContenir = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Mots clés")].Value ?? string.Empty).ToString();

                                string cMotsClesRechercheCommercialise = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FiltreCommercialise")].Value ?? string.Empty).ToString();
                                string cMotsClesRechercheConsomme = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FiltreConsomme")].Value ?? string.Empty).ToString();
                                string cMotsClesRechercheCalnut = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FiltreCalnut")].Value ?? string.Empty).ToString();
                                int cAlimentMoyen = Convert.ToInt32((myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FiltreMoyen")].Value ?? string.Empty).ToString());

                                //string cDesignationCiqual = (myWorksheet.Cells[rowNum, 6].Value ?? string.Empty).ToString();
                                string cDesignationCiqual = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_Designation")].Value ?? string.Empty).ToString();
                                string cDesignation = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "DesignationModifiee")].Value ?? string.Empty).ToString();
                                string alim_code = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_alim_code")].Value ?? string.Empty).ToString();
                                string alim_code_codachats = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CODACHATS_alim_code")].Value ?? string.Empty).ToString();
                                string alim_grp_nom_fr = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_alim_grp_nom_fr")].Value ?? string.Empty).ToString();
                                string alim_ssgrp_nom_fr = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_alim_ssgrp_nom_fr")].Value ?? string.Empty).ToString();
                                string alim_ssssgrp_nom_fr = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "CIQUAL_alim_ssssgrp_nom_fr")].Value ?? string.Empty).ToString();

                                string gpe_TI = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "groupe_TI_TdC")].Value ?? string.Empty).ToString();

                                string gpe_INCA3_nom = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "INCA3_gpe")].Value ?? string.Empty).ToString();
                                string a = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "min_5_magasins")].Value ?? string.Empty).ToString();
                                string asol = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "min_5_epiceries")].Value ?? string.Empty).ToString();
                                decimal min_5pct_magasins = 0;
                                if (a != "")
                                {
                                    min_5pct_magasins = Convert.ToDecimal(a.Replace(".", ","));
                                }

                                decimal min_5pct_magasins_sol = 0;
                                if (asol != "")
                                {
                                    min_5pct_magasins_sol = Convert.ToDecimal(asol.Replace(".", ","));
                                }

                                decimal max_5pct_magasins = 0;
                                decimal max_5pct_magasins_sol = 0;
                                string b = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "max_95_magasins")].Value ?? string.Empty).ToString();
                                string bsol = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "max_95_epiceries")].Value ?? string.Empty).ToString();
                                if (b != "")
                                {
                                    max_5pct_magasins = Convert.ToDecimal(b);
                                }
                                if (bsol != "")
                                {
                                    max_5pct_magasins_sol = Convert.ToDecimal(bsol);
                                }
                                string cc = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "poids_unitaire")].Value ?? string.Empty).ToString();
                                decimal poids_unitaire = 0;
                                if (cc != "")
                                {
                                    poids_unitaire = Convert.ToDecimal(cc);
                                }

                                //cCommencePar.Split(';').ToList().ForEach(commencePar =>
                                //{
                                cDoitContenir.Split(';').ToList().ForEach(contient =>
                                {
                                    List<string> motsCles = contient.Split(new string[] { ">" }, StringSplitOptions.RemoveEmptyEntries).ToList();
                                    string premiersMotsCles = motsCles.ElementAt(0);
                                    premiersMotsCles.Split(',').ToList().ForEach(commencePar =>
                                    {

                                        CorrespondanceCiqual c = new CorrespondanceCiqual();
                                        //c.DoitCommencerPar = commencePar.Trim();
                                        c.DesignationCiqual = cDesignationCiqual;
                                        c.DesignationModifiee = cDesignation;
                                        c.Commercialise = cMotsClesRechercheCommercialise;
                                        c.Consomme = cMotsClesRechercheConsomme;
                                        c.Calnut = cMotsClesRechercheCalnut;
                                        c.AlimentMoyen = cAlimentMoyen;
                                        c.alim_code = alim_code;
                                        c.alim_code_codachats = alim_code_codachats;
                                        c.alim_grp_nom_fr = alim_grp_nom_fr;
                                        c.alim_ssgrp_nom_fr = alim_ssgrp_nom_fr;
                                        c.alim_ssssgrp_nom_fr = alim_ssssgrp_nom_fr;

                                        c.gpe_TI = gpe_TI;
                                        c.gpe_INCA3_nom = gpe_INCA3_nom;
                                        c.min_5_magasins = min_5pct_magasins;
                                        c.max_95_magasins = max_5pct_magasins;
                                        c.min_5_magasins_sol = min_5pct_magasins_sol;
                                        c.max_95_magasins_sol = max_5pct_magasins_sol;
                                        c.poids_unitaire = poids_unitaire;

                                        c.MotsCles = motsCles;

                                        c.DoitCommencerPar = commencePar.Trim();

                                        if (this.motsLogigramme.Contains(c.DoitCommencerPar) == false)
                                        {
                                            this.motsLogigramme.Add(c.DoitCommencerPar);
                                        }

                                        //if (cDesignationCiqual != "")
                                        //{
                                            this.listCorrespondanceCiqual.Add(c);
                                        //}
                                    });
                                });
                            }
                            catch (Exception ex)
                            {
                                string s = ex.Message;
                            }
                            //});

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

            private static string clean(string txt)
            {

                // Encodage UTF8 pour supprimer les accents
                byte[] temp = System.Text.Encoding.GetEncoding("ISO-8859-8").GetBytes(txt);
                txt = System.Text.Encoding.UTF8.GetString(temp).TrimEnd().TrimEnd(',');

                // Passage en minuscule
                txt = txt.ToLower();
                return txt;
            }

            private string clean2(string txt)
            {
                txt = clean(txt).Trim();

                Regex rgx;

                // Prétraitement
                (from x in this.listPretraitement
                 select x).ToList().ForEach(x =>
                 {
                     rgx = new Regex(x.Regexp);
                     txt = rgx.Replace(txt, " " + x.Remplacement + " ");
                 });

                txt = " " + Regex.Replace(txt, @"\s+", " ") + " ";
                txt = txt.Trim();

                return txt;
            }

            public ClassifierResult Classify(string txt, string modeRecherche)
            {
                ClassifierResult res = new ClassifierResult();

                // Nettoyage de la désignation
                this.listExceptions.ForEach(ex =>
                {
                    Regex r = new Regex(ex.Key, RegexOptions.IgnoreCase);
                    if (r.Match(txt).Success)
                    {
                        txt = r.Replace(txt, ex.Value);
                    }
                });

                txt = clean(txt);

                Regex rgx;

                // Prétraitement
                (from x in this.listPretraitement
                 select x).ToList().ForEach(x =>
                 {
                     rgx = new Regex(x.Regexp);
                     txt = rgx.Replace(txt, " " + x.Remplacement + " ");
                 });

                txt = " " + Regex.Replace(txt, @"\s+", " ") + " ";

                // Non alimentaire
                for (int i = 0; i < this.listTraitementNonAlimentaire.Count; i++)
                {
                    string nonAlim = this.listTraitementNonAlimentaire.ElementAt(i).Regexp;
                    rgx = new Regex("\\b" + nonAlim + "\\b");
                    if (rgx.IsMatch(txt))
                    {
                        MatchCount mc = new MatchCount();
                        mc.DesignationCIQUAL = "Non alimentaire";
                        mc.DesignationModifiee = "Non alimentaire";
                        mc.alim_grp_nom_fr = "Non alimentaire";
                        res.Matches.Add(mc);
                        res.MotsCles = new List<string>();
                        res.MotsCles.Add(txt);
                        return (res);
                    }
                }

                // Mots à conserver
                rgx = new Regex(this.regexpMotsAConserver);
                List<string> mCol = rgx.Matches(txt).OfType<Match>()
                    .Select(m => m.Groups[0].Value)
                    .ToList();

                mCol.Where(x => x != "").ToList().ForEach(m =>
                    {
                        int index = 0;
                        bool shouldContinue = true;
                        while (index < this.listTraitementAliments.Count && shouldContinue == true)
                        {
                            Pretraitement t = this.listTraitementAliments.ElementAt(index);
                            rgx = new Regex("\\b" + t.Regexp + "\\b");
                            if (rgx.Matches(m).Count > 0)
                            {
                                string transfo = rgx.Replace(m, t.Remplacement);
                                if (transfo != "")
                                {
                                    t.Remplacement.Split(',').ToList().ForEach(x =>
                                    {
                                        res.MotsCles.Add(x.Trim());
                                    });
                                }
                                shouldContinue = false;
                            }
                            index++;
                        }
                    });

                res.MotsCles = res.MotsCles.Distinct().ToList();

                // TODO : dans fichier xlsx
                List<string> fruits = new List<string>() { "abricot", "ananas", "banane", "canneberge", "carambole", "cassis", "cerise", "citron", "clémentine", "mandarine", "fraise", "framboise", "myrtille", "prune", "figue", "goyave", "groseille", "fruit de la passion", "mangue", "pamplemousse", "pomme", "pruneau", "raisin", "kiwi", "kaki", "kumquat", "litchi", "melon", "pêche", "poire", "brugnon", "carotte", "papaye", "pastèque", "rhubarbe", "orange", "pomme", "raisin", "grenade", "yuzu" };


                int nbFruits = (from x in res.MotsCles where fruits.IndexOf(x) > -1 select x).Count();
                int nbCereales = (from x in res.MotsCles where x == "céréale" select x).Count();
                if (nbFruits > 1)
                {
                    res.MotsCles.Add("multifruit");
                }
                if (nbCereales > 1)
                {
                    res.MotsCles.Add("multicéréale");
                }

                res.MotsCles = res.MotsCles.Distinct().ToList();

                res.MotsCles.ForEach(x =>
                {
                    if (this.motsLogigramme.IndexOf(x) > -1)
                    {
                        res.CommencePar.Add(x);
                    }
                });

                // Recherche des élements qui commencent par
                List<CorrespondanceCiqual> matches = new List<CorrespondanceCiqual>();

                string commencePar = "";
                for (int i = 0; i < res.CommencePar.Count; i++)
                {
                    commencePar = res.CommencePar.ElementAt(i);
                    matches = (from x in listCorrespondanceCiqual where x.DoitCommencerPar == commencePar select x).ToList();
                    if (matches.Count > 0)
                    {
                        // TODO : que se passe t'il si pas d'occurence commençant par premier mot ?
                        break;
                    }
                }

                if (modeRecherche == "consomme")
                {
                    matches = (from x in matches where x.Consomme == "1" select x).ToList();
                }

                if (modeRecherche == "calnut")
                {
                    matches = (from x in matches where x.Calnut == "1" select x).ToList();
                }

                if (modeRecherche == "commercialise")
                {
                    matches = (from x in matches where x.Commercialise == "1" select x).ToList();
                }

                List<MatchCount> listMatchsCiqual = new List<MatchCount>();
                for (int i = 0; i < matches.Count; i++)
                {
                    CorrespondanceCiqual match = matches.ElementAt(i);
                    MatchCount m = new MatchCount();
                    bool continueAChercher = true;
                    int nbMotsCles = 0;
                    for (int niveau = 0; niveau < match.MotsCles.Count; niveau++)
                    {

                        List<string> motsCles = match.MotsCles.ElementAt(niveau).Trim().Split(',').ToList(); // , = ET


                        int nbMotsTrouves = 0;
                        motsCles.ForEach(motCle =>
                        {
                            if (res.MotsCles.Contains(motCle.Trim()) == false)
                            {
                                //contientTousLesMotsCles = false;
                                //continueAChercher = false;
                            }
                            else
                            {
                                m.NombreCorrespondances++;
                                nbMotsTrouves++;
                            }
                            nbMotsCles++;
                        });

                        //if (contientTousLesMotsCles)
                        //{
                        //    m.NombreCorrespondances++;
                        //}
                        //if (continueAChercher)
                        if (nbMotsTrouves > 0 && continueAChercher != false)
                        {
                            m.NiveauCorrespondance = niveau + 1;
                        }
                        else
                        {
                            continueAChercher = false;
                        }
                        //});

                    }

                    // TODO : mots clés impératifs/facultatifs

                    if (m.NombreCorrespondances > 0)
                    {
                        // Contient un mot de la désignation
                        mCol.ForEach(x =>
                        {
                            if (clean(match.DesignationModifiee).IndexOf(x) > -1)
                            {
                                m.MatchApproximatif = 1;
                            }

                        });


                        m.DesignationCIQUAL = match.DesignationCiqual;
                        m.DesignationModifiee = match.DesignationModifiee;
                        m.AlimentMoyen = match.AlimentMoyen;
                        m.NiveauMax = match.MotsCles.Count();
                        m.NbMots = nbMotsCles;
                        m.Match = string.Join(">", match.MotsCles);
                        m.alim_code = match.alim_code;
                        m.alim_code_codachats = match.alim_code_codachats;
                        m.alim_grp_nom_fr = match.alim_grp_nom_fr;
                        m.alim_ssgrp_nom_fr = match.alim_ssgrp_nom_fr;
                        m.alim_ssssgrp_nom_fr = match.alim_ssssgrp_nom_fr;
                        m.gpe_INCA3_nom = match.gpe_INCA3_nom;
                        m.gpe_TI = match.gpe_TI;
                        m.Consomme = match.Consomme;
                        m.min_5_magasins = match.min_5_magasins;
                        m.max_95_magasins = match.max_95_magasins;
                        m.min_5_magasins_sol = match.min_5_magasins_sol;
                        m.max_95_magasins_sol = match.max_95_magasins_sol;
                        m.poids_unitaire = match.poids_unitaire;

                        listMatchsCiqual.Add(m);
                    }

                }
                if (listMatchsCiqual.Count > 0)
                {
                    int niveauMax = (from x in listMatchsCiqual where x.NombreCorrespondances > 0 select x.NiveauCorrespondance).Max();
                    int nbMax = (from x in listMatchsCiqual where x.NombreCorrespondances > 0 && x.NiveauCorrespondance == niveauMax select x.NombreCorrespondances).Max();
                    int nbMin = (from x in listMatchsCiqual where x.NombreCorrespondances > 0 && x.NiveauCorrespondance == niveauMax && x.NombreCorrespondances == nbMax select x.NiveauMax).Min();
                    //int nbMin = (from x in listMatchsCiqual where x.NombreCorrespondances > 0 && x.NiveauCorrespondance == niveauMax select x.NiveauMax).Min();
                    //int nbMax = (from x in listMatchsCiqual where x.NombreCorrespondances > 0 && x.NiveauCorrespondance == niveauMax && x.NiveauMax == nbMin select x.NombreCorrespondances).Max();

                    (from x in listMatchsCiqual where x.NombreCorrespondances > 0 && x.NiveauCorrespondance == niveauMax && x.NombreCorrespondances == nbMax && x.NiveauMax == nbMin /*&& x.NbMots == nbMin2*/ select x).ToList().ForEach(x =>
                    {
                        x.MeilleurMatch = 1;
                    });

                    var l = (from x in listMatchsCiqual where x.MeilleurMatch == 1 select x).ToList();
                    l.ForEach(x =>
                    {
                        //if (modeRecherche == "" && x.Consomme == "1" && l.Count > 1)
                        //{
                        //    x.MeilleurMatch = 0;
                        //    x.MatchApproximatif = 1;
                        //}
                        if (x.NombreCorrespondances < x.NiveauMax)
                        {
                            x.MeilleurMatch = 0;
                            x.MatchApproximatif = 1;
                        }
                    });

                    var max = (from x in listMatchsCiqual where x.MatchApproximatif == 1 select x.NiveauCorrespondance);
                    if (max.Count() > 0)
                    {
                        (from x in listMatchsCiqual where x.MatchApproximatif == 1 select x).ToList().ForEach(x =>
                        {
                            if (x.NiveauCorrespondance == max.Max())
                            {
                                x.MeilleurMatchApproximatif = 1;
                            }
                        });
                    }

                    res.Matches = listMatchsCiqual.OrderByDescending(x => x.NiveauCorrespondance).ThenByDescending(x => x.NombreCorrespondances).ThenBy(x => x.NbMots).ThenBy(x => x.DesignationCIQUAL).ToList();
                    res.Matches = res.Matches.GroupBy(x => x.DesignationCIQUAL).Select(g => g.First()).ToList();
                }
                //} else
                //{
                string txt2 = txt.Trim();
                if (txt2.Length > 2)
                {
                    //var rechercheTexte = from x in listCorrespondanceCiqual
                    //                     from y in x.MotsCles
                    //                     where y.Contains(txt.Trim())
                    //                     select x;

                    var rechercheTexte = from x in listCorrespondanceCiqual
                                             //                     from y in x.MotsCles
                                         where x.DesignationCiqual.Contains(txt.Trim())
                                         select x;

                    if (modeRecherche == "consomme")
                    {
                        rechercheTexte = (from x in rechercheTexte where x.Consomme == "1" select x).ToList();
                    }

                    if (modeRecherche == "calnut")
                    {
                        rechercheTexte = (from x in rechercheTexte where x.Calnut == "1" select x).ToList();
                    }

                    if (modeRecherche == "commercialise")
                    {
                        rechercheTexte = (from x in rechercheTexte where x.Commercialise == "1" select x).ToList();
                    }

                    if (rechercheTexte.Count() > 0)
                    {
                        foreach (CorrespondanceCiqual corr in rechercheTexte)
                        {
                            MatchCount m = new MatchCount();
                            m.AlimentMoyen = corr.AlimentMoyen;
                            m.alim_code = corr.alim_code;
                            m.alim_code_codachats = corr.alim_code_codachats;
                            m.alim_grp_nom_fr = corr.alim_grp_nom_fr;
                            m.alim_ssgrp_nom_fr = corr.alim_ssgrp_nom_fr;
                            m.alim_ssssgrp_nom_fr = corr.alim_ssssgrp_nom_fr;
                            m.CommencePar = corr.DoitCommencerPar;
                            m.DesignationCIQUAL = corr.DesignationCiqual;
                            m.DesignationModifiee = corr.DesignationModifiee;
                            m.gpe_INCA3_nom = corr.gpe_INCA3_nom;
                            m.gpe_TI = corr.gpe_TI;
                            m.MeilleurMatch = 0;
                            m.MatchApproximatif = 1;
                            m.NbMots = -1;
                            m.min_5_magasins = corr.min_5_magasins;
                            m.max_95_magasins = corr.max_95_magasins;
                            m.poids_unitaire = corr.poids_unitaire;


                            //m.NbMotsSansPretraitement =  corr.DesignationModifiee.Split(new char[0]).Intersect(txt2.Split(new char[0])).Count();
                            if ((from x in res.Matches where x.alim_code == m.alim_code select x).Count() == 0)
                            {
                                res.Matches.Add(m);
                            }
                        }
                    }
                }
                //}
                return res;
            }


            public List<Calnut> GetListCalnut(string txt)
            {
                List<Calnut> res = new List<Calnut>();

                // Nettoyage de la désignation
                this.listExceptions.ForEach(ex =>
                {
                    Regex r = new Regex(ex.Key, RegexOptions.IgnoreCase);
                    if (r.Match(txt).Success)
                    {
                        txt = r.Replace(txt, ex.Value);
                    }
                });

                //txt = clean2(txt).Trim();

                List<CorrespondanceCiqual> matches = new List<CorrespondanceCiqual>();
                matches = (from x in listCorrespondanceCiqual where x.Calnut == "1" select x).ToList();
                matches = matches.GroupBy(x => x.DesignationModifiee).Select(g => g.First()).ToList();

                for (int i = 0; i < matches.Count; i++)
                {
                    CorrespondanceCiqual match = matches.ElementAt(i);
                    Calnut m = new Calnut();
                    m.gpe_TI = match.gpe_TI;
                    m.alim_code_codachats = match.alim_code_codachats;
                    m.DesignationModifiee = match.DesignationModifiee;
                    m.min_5_magasins = match.min_5_magasins;
                    m.max_95_magasins = match.max_95_magasins;
                    m.min_5_magasins_sol = match.min_5_magasins_sol;
                    m.max_95_magasins_sol = match.max_95_magasins_sol;
                    m.poids_unitaire = match.poids_unitaire;
                    res.Add(m);
                }
                res = res.OrderBy(x => x.DesignationModifiee).ToList();
                return res;



                //List<MatchCount> listMatchsCiqual = new List<MatchCount>();

                ////List<string> words = txt.Split(new char[0]).ToList();

                //string[] tableau = txt.Split(' ');
                //List<string> words = tableau.Where(x => x.Length > 2).ToList();
                //List<string> words2 = new List<string>();
                //words.ForEach(x =>
                //{
                //    words2.Add(x.TrimEnd('s'));
                //});

                //for (int i = 0; i < matches.Count; i++)
                //{
                //    CorrespondanceCiqual match = matches.ElementAt(i);
                //    MatchCount m = new MatchCount();
                //    m.alim_code_codachats = match.alim_code_codachats;
                //    m.DesignationModifiee = match.DesignationModifiee;
                //    m.min_5_magasins = match.min_5_magasins;
                //    m.max_95_magasins = match.max_95_magasins;
                //    m.min_5_magasins_sol = match.min_5_magasins_sol;
                //    m.max_95_magasins_sol = match.max_95_magasins_sol;
                //    m.poids_unitaire = match.poids_unitaire;

                //    if (words.Count == 1)
                //    {
                //        if (clean(match.DesignationCiqual).Contains(txt))
                //        {
                //            m.NbMots = 1;
                //        }
                //    }
                //    else
                //    {
                //        List<string> motsDesignation = clean2(match.DesignationModifiee).Split(new char[0]).ToList();
                //        List<string> motsDesignation2 = new List<string>();
                //        motsDesignation.ForEach(x => motsDesignation2.Add(x.TrimEnd('s')));
                //        int nbMotsCommuns = motsDesignation2.Intersect(words2).Count();

                //        if (nbMotsCommuns > 0)
                //        {
                //            m.NbMots = nbMotsCommuns;
                //            if (words2.ElementAt(0) == motsDesignation2.ElementAt(0))
                //            {
                //                m.CommencePar = motsDesignation2.ElementAt(0);
                //            }
                //        }
                //    }

                //    bool contains = (from x in res.Matches where x.alim_code_codachats == m.alim_code_codachats select x).Count() > 0;
                //    if (m.NbMots > 0 && contains == false)
                //    {
                //        res.Matches.Add(m);
                //    }
                //}
                //if (res.Matches.Count > 0)
                //{
                //    var max = (from x in res.Matches select x.NbMots).Max();
                //    res.Matches = res.Matches.Where(x => x.NbMots == max).OrderByDescending(x => x.CommencePar).OrderBy(x=>x.DesignationModifiee.Length).ToList();
                //}
                //res.Matches = res.Matches.OrderByDescending(x => x.CommencePar).ThenByDescending(x => x.NbMots).ToList();

                return res;
            }

        }

        public static string ClassifyDesignation(string txt, string modeRecherche, bool reload = false)
        {
            Classifier classifier;

            ObjectCache cache = MemoryCache.Default;
            if (cache.Contains("ciqualClassifierCache") && reload == false)
            {
                classifier = (Classifier)cache.Get("ciqualClassifierCache");
            }
            else
            {
                classifier = new Classifier(designationPassageFilePath);
                CacheItemPolicy cacheItemPolicy = new CacheItemPolicy();
                cacheItemPolicy.AbsoluteExpiration = DateTime.Now.AddHours(1.0);
                cache.Add("ciqualClassifierCache", classifier, cacheItemPolicy);
            }



            ClassifierResult res = classifier.Classify(txt, modeRecherche);
            string jsonString = new JavaScriptSerializer().Serialize(res);
            return jsonString;
        }

        public static string ClassifyDesignation2(string txt)
        {
            Classifier classifier;

            ObjectCache cache = MemoryCache.Default;
            if (cache.Contains("ciqualClassifierCache"))
            {
                classifier = (Classifier)cache.Get("ciqualClassifierCache");
            }
            else
            {
                classifier = new Classifier(designationPassageFilePath);
                CacheItemPolicy cacheItemPolicy = new CacheItemPolicy();
                cacheItemPolicy.AbsoluteExpiration = DateTime.Now.AddHours(1.0);
                cache.Add("ciqualClassifierCache", classifier, cacheItemPolicy);
            }


            List<Calnut> res = classifier.GetListCalnut(txt);

            var JsonSerializer = new JavaScriptSerializer();
            JsonSerializer.MaxJsonLength = Int32.MaxValue;

            string jsonString = JsonSerializer.Serialize(res);
            return jsonString;
        }

        public static Classifier GetClassifier()
        {
            Classifier classifier = new Classifier(designationPassageFilePath);
            return classifier;
        }

        public class ClassifiedItem
        {
            public string Ciqual;
            public string Rayon;
        }

        public static ClassifiedItem ClassifyDesignation2(string txt, string modeRecherche, Classifier classifier)
        {
            ClassifiedItem item = new ClassifiedItem();
            ClassifierResult res = classifier.Classify(txt, modeRecherche);
            List<string> list = (from x in res.Matches where x.MeilleurMatch > 0 select x.DesignationCIQUAL).Distinct().ToList();
            if (list.Count > 0)
            {
                item.Ciqual = string.Join(" ; ", list);
                List<string> list2 = (from x in res.Matches where x.MeilleurMatch > 0 select x.alim_grp_nom_fr).Distinct().ToList();
                item.Rayon = string.Join(" ; ", list2);
            }
            else
            {
                list = (from x in res.Matches select x.DesignationCIQUAL).ToList();
                if (list.IndexOf("Non alimentaire") > -1)
                {
                    item.Ciqual = "Non alimentaire";
                    item.Rayon = "Non alimentaire";
                }
            }

            return item;
        }

        public static void ClassifyDesignationInXls()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            Classifier classifier = new Classifier(designationPassageFilePath);

            using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(designationPassageFilePath)))
            {
                //var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(3); // Ciqual
                //var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(3); // Leclerc
                //var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(4); // Alim non alim
                var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(5); // ConsoDrive
                var totalRows = myWorksheet.Dimension.End.Row;
                for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                {
                    string txt = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();
                    ClassifierResult res = classifier.Classify(txt, "consomme");

                    myWorksheet.Cells[rowNum, 2].Value = string.Join(", ", res.MotsCles);

                    List<string> list = (from x in res.Matches where x.MeilleurMatch > 0 select x.DesignationCIQUAL).ToList();

                    int code = list.Count;

                    string verite = (myWorksheet.Cells[rowNum, 4].Value ?? string.Empty).ToString();

                    string resultatAlgo = "";

                    if (code > 0)
                    {
                        resultatAlgo = string.Join(" ; ", list);
                    }
                    else
                    {
                        list = (from x in res.Matches select x.DesignationCIQUAL).ToList();
                        if (list.IndexOf("Non alimentaire") > -1)
                        {
                            resultatAlgo = "Non alimentaire";
                        }
                    }
                    myWorksheet.Cells[rowNum, 3].Value = resultatAlgo;

                    int validite = 0;
                    if (verite == resultatAlgo)
                    {
                        validite = 1;
                    }
                    myWorksheet.Cells[rowNum, 5].Value = validite;
                    myWorksheet.Cells[rowNum, 6].Value = code;
                    List<string> list1 = (from x in res.Matches where x.MeilleurMatch > 0 select x.alim_grp_nom_fr).Distinct().ToList();
                    List<string> list2 = (from x in res.Matches where x.MeilleurMatch > 0 select x.alim_ssgrp_nom_fr).Distinct().ToList();
                    List<string> list3 = (from x in res.Matches where x.MeilleurMatch > 0 select x.alim_ssssgrp_nom_fr).Distinct().ToList();
                    myWorksheet.Cells[rowNum, 7].Value = string.Join(" ; ", list1);
                    myWorksheet.Cells[rowNum, 8].Value = string.Join(" ; ", list2);
                    myWorksheet.Cells[rowNum, 9].Value = string.Join(" ; ", list3);
                    myWorksheet.Cells[rowNum, 10].Value = list1.Count;
                    myWorksheet.Cells[rowNum, 11].Value = list2.Count;
                    myWorksheet.Cells[rowNum, 12].Value = list3.Count;
                }
                xlPackage.Save();
            }





        }

        public static byte[] ClassifyDesignationInXlsIn(string data, string modeRecherche)
        {
            byte[] bytes = Org.BouncyCastle.Utilities.Encoders.Base64.Decode(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            Classifier classifier = new Classifier(designationPassageFilePath);
            MemoryStream stream = new MemoryStream(bytes);

            ExcelPackage xlPackage = new ExcelPackage(stream);

            var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);
            var totalRows = myWorksheet.Dimension.End.Row;

            myWorksheet.Cells[1, 3].Value = "Mots clés";
            myWorksheet.Cells[1, 4].Value = "Meilleure(s) correspondance(s)";
            myWorksheet.Cells[1, 5].Value = "Correspondance(s) proche(s)";
            //myWorksheet.Cells[1, 4].Value = "algo_gpe_INCA3_nom";
            //myWorksheet.Cells[1, 5].Value = "algo_aliment_libelle_INCA3";
            //myWorksheet.Cells[1, 6].Value = "algo_nb_gpe_INCA3_nom";
            //myWorksheet.Cells[1, 7].Value = "algo_nb_aliment_libelle_INCA3";
            //myWorksheet.Cells[1, 2].Value = "alim_grp_nom_fr";
            //myWorksheet.Cells[1, 3].Value = "alim_ssgrp_nom_fr";
            //myWorksheet.Cells[1, 4].Value = "alim_ssssgrp_nom_fr";
            //myWorksheet.Cells[1, 5].Value = "alim_nom_fr";
            //myWorksheet.Cells[1, 6].Value = "nb_alim_grp_nom_fr";
            //myWorksheet.Cells[1, 7].Value = "nb_alim_ssgrp_nom_fr";
            //myWorksheet.Cells[1, 8].Value = "nb_alim_ssssgrp_nom_fr";
            //myWorksheet.Cells[1, 9].Value = "nb_alim_nom_fr";
            //myWorksheet.Cells[1, 10].Value = "mots_cles";


            for (int rowNum = 2; rowNum <= totalRows; rowNum++)
            {
                string txt = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();
                ClassifierResult res = classifier.Classify(txt, modeRecherche);

                myWorksheet.Cells[rowNum, 3].Value = string.Join(" ; ", res.MotsCles);

                List<string> list = (from x in res.Matches where x.MeilleurMatch == 1 select x.DesignationCIQUAL).ToList();

                int code = list.Count;



                string resultatAlgo = "";

                if (list.Count() > 0)
                {
                    myWorksheet.Cells[rowNum, 4].Value = string.Join(" ; ", list);
                }
                else
                {
                    list = (from x in res.Matches where x.MeilleurMatchApproximatif == 1 select x.DesignationCIQUAL).ToList();
                    if (list.IndexOf("Non alimentaire") > -1)
                    {
                        resultatAlgo = "Non alimentaire";
                    }
                    resultatAlgo = string.Join(" ; ", list);
                    myWorksheet.Cells[rowNum, 5].Value = resultatAlgo;
                }

                //List<string> list1 = (from x in res.Matches where x.MeilleurMatch > 0 select x.alim_grp_nom_fr).Distinct().ToList();
                //List<string> list1 = (from x in res.Matches where x.MeilleurMatch > 0 select x.gpe_INCA3_nom).Distinct().ToList();
                ////List<string> list2 = (from x in res.Matches where x.MeilleurMatch > 0 select x.alim_ssgrp_nom_fr).Distinct().ToList();
                //List<string> list2 = (from x in res.Matches where x.MeilleurMatch > 0 select x.aliment_libelle_INCA3).Distinct().ToList();
                ////List<string> list3 = (from x in res.Matches where x.MeilleurMatch > 0 select x.alim_ssssgrp_nom_fr).Distinct().ToList();
                //myWorksheet.Cells[rowNum, 4].Value = string.Join(" ; ", list1);
                //myWorksheet.Cells[rowNum, 5].Value = string.Join(" ; ", list2);
                ////myWorksheet.Cells[rowNum, 4].Value = string.Join(" ; ", list3);
                ////myWorksheet.Cells[rowNum, 5].Value = resultatAlgo;
                //myWorksheet.Cells[rowNum, 6].Value = list1.Count;
                //myWorksheet.Cells[rowNum, 7].Value = list2.Count;
                //myWorksheet.Cells[rowNum, 8].Value = list3.Count;
                //myWorksheet.Cells[rowNum, 9].Value = code;
                //myWorksheet.Cells[rowNum, 10].Value = string.Join(" ; ", res.MotsCles);
            }
            xlPackage.Save();


            return xlPackage.GetAsByteArray();


        }

        public static byte[] ClassifieurCIQUALExcel(string data)
        {
            byte[] bytes = Org.BouncyCastle.Utilities.Encoders.Base64.Decode(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            Classifier classifier = new Classifier(designationPassageFilePath);
            MemoryStream stream = new MemoryStream(bytes);

            //List<ReferenceOFF> listeReferencesOFF = new List<ReferenceOFF>();

            ExcelPackage xlPackage = new ExcelPackage(stream);



            // Onglet avec références
            var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);
            var totalRows = myWorksheet.Dimension.End.Row;

            for (int rowNum = 4; rowNum <= totalRows; rowNum++)
            {
                string designation = (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString();
                if (designation.Length > 0)
                {


                    ClassifierResult res = classifier.Classify(designation, "");
                    if (res.Matches.Count() > 0)
                    {
                        myWorksheet.Cells[rowNum, 3].Value = res.Matches.ElementAt(0).alim_code;
                        myWorksheet.Cells[rowNum, 4].Value = res.Matches.ElementAt(0).DesignationCIQUAL;
                    }

                }
            }

            xlPackage.Save();
            return xlPackage.GetAsByteArray();
        }

        public static JObject RequestOFF(string researchMode, string value, string projection = "generic_name_fr,product_name_fr")
        {
            //HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://off-api.odalim.inrae.fr/findbyname/?product_name_fr=banania");
            //HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://off-api.odalim.inrae.fr/?ean=3229820129488");

            HttpWebRequest request = null;

            // Token
            //request = (HttpWebRequest)WebRequest.Create("https://odalim.inrae.fr/ws/token");
            //request.Headers.Add("Auth", "6d86e25e8f40f2542b5c14de439f0186:644fee198bde94542ca3b0172555ee64");

            if (researchMode == "ean")
            {
                request = (HttpWebRequest)WebRequest.Create("https://off-api.odalim.inrae.fr/?ean=" + value + "&projection=" + projection);
            }
            if (researchMode == "product_name")
            {
                request = (HttpWebRequest)WebRequest.Create("https://off-api.odalim.inrae.fr/findbyname/?product_name_fr=" + value);
            }

            request.Headers.Add("token", "236c27c3c74f80a117f84414825eed08");
            request.Method = "GET";


            try
            {
                WebResponse response = request.GetResponse();
                using (Stream responseStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    string text = reader.ReadToEnd();
                    JObject jObject = JsonConvert.DeserializeObject<JObject>(text);
                    return jObject;
                }
            }
            catch (WebException ex)
            {
                WebResponse errorResponse = ex.Response;
                using (Stream responseStream = errorResponse.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.GetEncoding("utf-8"));
                    String errorText = reader.ReadToEnd();
                    // Log errorText
                }
                return null;
            }
        }

        //// Recherche OFF
        ////Header: "Auth: 6d86e25e8f40f2542b5c14de439f0186:644fee198bde94542ca3b0172555ee64"
        ////string url = "https://off-api.odalim.inrae.fr/findbyname/?product_name_fr=yaourt";
        //string url = "https://odalim.inrae.fr/ws/token";

        ////HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://odalim.inrae.fr/ws/token");
        ////request.Headers.Add("Auth", "6d86e25e8f40f2542b5c14de439f0186:644fee198bde94542ca3b0172555ee64");
        ////request.Method = "GET";
        ////token : 756ae220f6919ff1063132dbcc958baa

        //HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://off-api.odalim.inrae.fr/findbyname/?product_name_fr=banania");
        ////HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://off-api.odalim.inrae.fr/?ean=3229820129488");
        //request.Headers.Add("token", "756ae220f6919ff1063132dbcc958baa");
        //request.Method = "GET";

        //try
        //{
        //    WebResponse response = request.GetResponse();
        //    using (Stream responseStream = response.GetResponseStream())
        //    {
        //        StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
        //        string text = reader.ReadToEnd();
        //        //JObject jObject = JsonConvert.DeserializeObject<JObject>(reader.ReadToEnd());
        //        string b = "";
        //    }
        //}
        //catch (WebException ex)
        //{
        //    WebResponse errorResponse = ex.Response;
        //    using (Stream responseStream = errorResponse.GetResponseStream())
        //    {
        //        StreamReader reader = new StreamReader(responseStream, Encoding.GetEncoding("utf-8"));
        //        String errorText = reader.ReadToEnd();
        //        // Log errorText
        //    }
        //    throw;
        //}



    }
}