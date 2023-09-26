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
using NHunspell;
using System.ServiceModel;
using ChemosensTools.Framework;
using ChemosensTools.analyses.cs;
using ChemosensTools.Framework.cs;
using TimeSense.Web.Helpers;
using TimeSens.webservices.helpers;

namespace ChemosensTools.fcLexicon.csModels
{
    public class fcLexicon
    {

        private static string lexiconDirPath = ConfigurationManager.AppSettings["LexiconDirPath"];

        public class Pretraitement
        {
            public string RegularExpressionFR;
            public string AttributeFR;
            public string FullConceptFR;
            public string ConceptFR;
            //public string Modality;
            public string ProductCategory;
            public string Preposition;
            public string Word;
            public string Type;
            public string Corrected;

            public string Descriptor;
            public string Modality;
            public string RootConcept;
            public string PredecessorConcept;


            public void GetDescriptor()
            {

                string pas = "";
                if (this.Preposition == "pas")
                {
                    pas = "pas-";
                }
                if (this.FullConceptFR != null & this.FullConceptFR != "")
                {
                    string[] left = this.FullConceptFR.Split(':');
                    this.Modality = left.ElementAt(0);
                    if (left.Count() > 1)
                    {
                        string[] right = left.ElementAt(1).Split('>');
                        this.RootConcept = pas + right.ElementAt(0);
                        this.PredecessorConcept = pas + right.ElementAt(Math.Max(0, right.Count() - 2));
                        if (this.Preposition != null)
                        {
                            this.Descriptor = this.Preposition + "-" + right.Last();
                        }
                        else
                        {
                            this.Descriptor = right.Last();
                        }
                        char[] MyChar = { '-' };
                        this.Descriptor = this.Descriptor.Trim(MyChar);
                        if (this.Preposition != null)
                        {
                            this.Preposition = this.Preposition.Trim(MyChar);
                        }
                    }
                }



            }
            //public string Valence;            
        }

        public class ResultSenso
        {
            public string Product;
            public string Subject;
            public string Factor;
            public string Word;
            public string Concept;
            public string Quantifier;
            public string Corrected;

            public string Descriptor;
            public string Modality;
            public string RootConcept;
            public string PredecessorConcept;

            // Colonne 4 : mot
            // Colonne 5 : concept(s) séparés par ,
            // Colonne 6 : quantifieur


        }

        public class AnalysisOption
        {
            public List<string> ExcludedModalities = new List<string>();
            public double Alpha = 0.05;
            public string Lexicon = "Lexicon";
            public string CategorieProduit = "";
            public bool Correction = true;
            public bool MRCA = true;
            public bool TableauDescripteur = true;
        }

        public class Result
        {
            public List<string> MotsNonRetenus = new List<string>();
            public Dictionary<string, string> MotsCorriges = new Dictionary<string, string>();
            public List<Pretraitement> Mots = new List<Pretraitement>();
            public string TexteNettoye;
            public List<string> CategoriesProduit = new List<string>();
        }

        public class Classifier
        {
            private List<Pretraitement> listPretraitement;
            private List<Pretraitement> listPrepositions;
            private List<string> listExceptions;
            private List<string> listStopWords;
            private List<string> listCategoriesProduit = new List<string>();
            private string regexpMotsAConserver;
            private Hunspell hunspell;
            private AnalysisOption options;


            public Classifier(string designationPassageFilePath, string options)
            {
                this.options = Serializer.DeserializeFromString<AnalysisOption>(options);
                

                if (this.options.Correction)
                {
                    this.hunspell = new Hunspell(System.Web.HttpContext.Current.Server.MapPath("~/fcLexicon/cs/fr.aff"), System.Web.HttpContext.Current.Server.MapPath("~/fcLexicon/cs/fr.dic"));
                }

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(designationPassageFilePath)))
                {
                    try
                    {
                        var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);

                        var totalRows = myWorksheet.Dimension.End.Row;

                        this.listPretraitement = new List<Pretraitement>();

                        for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        {
                            string fullConceptFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FullConceptFR")].Value ?? string.Empty).ToString();

                            //p.Modality = (myWorksheet.Cells[rowNum, 4].Value ?? string.Empty).ToString();



                            List<string> concepts = fullConceptFR.Split(',').ToList();
                            concepts.ForEach(x =>
                            {
                                Pretraitement p = new Pretraitement();
                                p.RegularExpressionFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "RegularExpressionFR")].Value ?? string.Empty).ToString();
                                p.AttributeFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "AttributeFR")].Value ?? string.Empty).ToString();
                                p.ProductCategory = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "ProductCategory")].Value ?? string.Empty).ToString();

                                //List<string> categories = p.ProductCategory.Split(',').ToList();
                                //categories.ForEach(y =>
                                //{
                                if (this.listCategoriesProduit.Contains(p.ProductCategory) == false)
                                {
                                    this.listCategoriesProduit.Add(p.ProductCategory);
                                }
                                //});

                                // On ne conserve que les concepts de la catégorie produit
                                if (p.ProductCategory == this.options.CategorieProduit)
                                {
                                    p.FullConceptFR = x.Trim();
                                    List<string> elements = x.Split(':').ToList();
                                    if (elements != null && elements.Count > 0)
                                    {
                                        p.Type = elements.ElementAt(0);
                                    }
                                    if (elements != null && elements.Count > 1)
                                    {
                                        p.ConceptFR = elements.ElementAt(1);
                                    }
                                    this.listPretraitement.Add(p);
                                }

                            });

                            //p.Valence = (myWorksheet.Cells[rowNum, 6].Value ?? string.Empty).ToString();


                        }

                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
                        totalRows = myWorksheet.Dimension.End.Row;

                        // Nécessaire de commencer par les mots composés les plus long puis par ordre alphabétique décroissant
                        //listPretraitement = listPretraitement.Where(x => { return x.Replacement != ""; }).OrderByDescending(x => x.Expression.Length).ThenByDescending(x => x.Expression).ToList();
                        listPretraitement = listPretraitement.OrderByDescending(x => x.RegularExpressionFR.Split(' ').Count()).ThenByDescending(x => x.RegularExpressionFR.Length).ThenByDescending(x => x.RegularExpressionFR).ToList();
                        List<string> listMotsAConserver = (from x in listPretraitement where x.AttributeFR != "" select "\\b" + x.RegularExpressionFR + "\\b").ToList();

                        listMotsAConserver = listMotsAConserver.Where(x => { return x != ""; }).OrderByDescending(x => x.Length).ThenByDescending(x => x).ToList();
                        listMotsAConserver.Add("X");
                        this.regexpMotsAConserver = string.Join("|", listMotsAConserver);

                        // Prépositions
                        //myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);

                        //totalRows = myWorksheet.Dimension.End.Row;


                        //this.listPrepositions = (from x in this.listPretraitement where x.Type.StartsWith("quantifieur") select x).ToList();
                        //this.listPrepositions.ForEach(x=> {
                        //    //x.Type
                        //});


                        //this.listPrepositions = new List<Pretraitement>();

                        //for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        //{
                        //    Pretraitement p = new Pretraitement();
                        //    p.RegularExpressionFR = myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "RegularExpressionFR")].Value.ToString();
                        //    p.AttributeFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "QuantifierFR")].Value ?? string.Empty).ToString();
                        //    p.Modality = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Type")].Value ?? string.Empty).ToString();
                        //    p.Type = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "Position")].Value ?? string.Empty).ToString();
                        //    this.listPrepositions.Add(p);
                        //}

                        //this.listPrepositions = this.listPrepositions.OrderByDescending(x => x.RegularExpressionFR.Split(' ').Count()).ThenByDescending(x => x.RegularExpressionFR.Length).ThenBy(x => x.RegularExpressionFR).ToList();

                        // Exceptions
                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);

                        totalRows = myWorksheet.Dimension.End.Row;

                        this.listExceptions = new List<string>();

                        for (int rowNum = 1; rowNum <= totalRows; rowNum++)
                        {
                            this.listExceptions.Add(myWorksheet.Cells[rowNum, 1].Value.ToString());
                        }

                        // Exceptions
                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(2);

                        totalRows = myWorksheet.Dimension.End.Row;

                        this.listStopWords = new List<string>();

                        for (int rowNum = 1; rowNum <= totalRows; rowNum++)
                        {
                            this.listStopWords.Add(myWorksheet.Cells[rowNum, 1].Value.ToString());
                        }
                    }
                    catch (Exception ex)
                    {
                        //File.AppendAllText("E:\\data\\ciqualClassifier\\log.txt", ex.Message);
                    }

                }
            }

            public Result Classify2(string txt)
            {
                Result res = new Result();

                // Nettoyage de la désignation

                // Encodage UTF8 pour supprimer les accents
                //byte[] temp = System.Text.Encoding.GetEncoding("ISO-8859-8").GetBytes(txt);
                //txt = System.Text.Encoding.UTF8.GetString(temp).TrimEnd().TrimEnd(',');

                // Passage en minuscule
                txt = txt.ToLower();

                Regex rgx;

                // TODO : garder séparateurs de phrase pour conserver le contexte

                txt = txt.Replace('\'', ' ');
                txt = txt.Replace('\r', ' ');
                txt = txt.Replace('\n', ' ');
                txt = txt.Replace('\t', ' ');
                txt = txt.Replace('-', ' ');
                txt = txt.Replace('\'', ' ');
                txt = txt.Replace(',', ' ');
                txt = txt.Replace('.', ' ');
                txt = txt.Replace('(', ' ');
                txt = txt.Replace(')', ' ');
                txt = txt.Replace('/', ' ');
                txt = txt.Replace('"', ' ');
                txt = txt.Replace(';', ' ');
                txt = txt.Replace(':', ' ');
                txt = txt.Replace('è', 'é');
                txt = txt.Replace('ê', 'é');
                txt = txt.Replace('ë', 'é');
                txt = txt.Replace('à', 'a');
                txt = txt.Replace('û', 'u');
                txt = txt.Replace('â', 'a');
                txt = txt.Replace('î', 'i');
                txt = txt.Replace('ç', 'c');

                // Suppression des expressions
                //(from x in this.listPretraitement
                // where x.Modality == "to_remove"
                // select x).ToList().ForEach(x =>
                // {
                //     rgx = new Regex(x.RegularExpressionFR);
                //     txt = rgx.Replace(txt, "");
                // });

                txt = " " + Regex.Replace(txt, @"\s+", " ") + " ";

                List<string> exceptions = new List<string>();

                // Supression des mots de 2 lettres ou moins
                List<string> tmp = txt.Split(' ').ToList();
                tmp = tmp.Where(x => { return x.Length > 2 || this.listExceptions.IndexOf(x) > -1; }).ToList();
                txt = string.Join(" ", tmp);

                res.TexteNettoye = txt;
                res.CategoriesProduit = this.listCategoriesProduit;

                // Mots à conserver
                rgx = new Regex(this.regexpMotsAConserver);
                List<string> mCol = rgx.Matches(txt).OfType<Match>()
                    .Select(m => m.Groups[0].Value)
                    .ToList();

                mCol.Where(x => x != "").ToList().ForEach(m =>
                    {
                        int index = 0;
                        bool shouldContinue = true;
                        while (index < this.listPretraitement.Count && shouldContinue == true)
                        {
                            Pretraitement t = this.listPretraitement.ElementAt(index);

                            //TODO : remonter dans les prépositions, exemple trop > un peu trop...
                            //TODO : postposition
                            rgx = new Regex("\\b" + t.RegularExpressionFR + "\\b");
                            if (rgx.Matches(m).Count > 0)
                            {
                                string transfo = rgx.Replace(m, t.AttributeFR);
                                if (transfo != "" && transfo != " ")
                                {

                                    Pretraitement motRetenu = new Pretraitement();
                                    res.Mots.Add(motRetenu);
                                    motRetenu.Word = m;
                                    //res.MotsRetenus.Add(m);
                                    // Recherche des prépositions
                                    string preposition = "";
                                    string prepositionR = "";

                                    // Mot précédent
                                    string motPrecedent = "";

                                    for (int i = 0; i < this.listPrepositions.Count; i++)
                                    {
                                        //TODO : boucler sur les prepositions, ex : tres, vraiment tres...


                                        if (this.listPrepositions[i].Type == "quantifieur>pre")
                                        {
                                            Regex rg = new Regex(this.listPrepositions[i].RegularExpressionFR + " " + m);
                                            if (rg.Match(txt).Success)
                                            {
                                                //preposition = this.listPrepositions[i].AttributeFR;
                                                preposition = this.listPrepositions[i].ConceptFR;
                                                //if (this.listPrepositions[i].Modality.Contains("negation"))
                                                //{
                                                //    //prepositionR = "pas-";
                                                //}
                                                //txt = txt.Replace(this.listPrepositions[i].Expression + " " + t.Replacement, "");
                                                txt = rg.Replace(txt, "");
                                                break;
                                            }
                                        }
                                        if (this.listPrepositions[i].Type == "quantifieur>post")
                                        {
                                            Regex rg = new Regex(m + " " + this.listPrepositions[i].RegularExpressionFR);
                                            if (rg.Match(txt).Success)
                                            {
                                                //preposition = this.listPrepositions[i].AttributeFR;
                                                preposition = this.listPrepositions[i].ConceptFR;
                                                //if (this.listPrepositions[i].Modality.Contains("negation"))
                                                //{
                                                //    //prepositionR = "pas-";
                                                //}
                                                //txt = txt.Replace(this.listPrepositions[i].Expression + " " + t.Replacement, "");
                                                txt = rg.Replace(txt, "");
                                                break;
                                            }
                                        }

                                    }
                                    motRetenu.Preposition = "";
                                    if (preposition.Length > 0)
                                    {
                                        //motRetenu.Preposition = " (" + preposition + ")";
                                        motRetenu.Preposition = preposition;
                                    }
                                    motRetenu.AttributeFR = prepositionR + t.AttributeFR;
                                    motRetenu.FullConceptFR = t.FullConceptFR;
                                    //motRetenu.Modality = t.Modality;
                                    motRetenu.ProductCategory = t.ProductCategory;


                                    //TODO : 3 niveaux : - / "" / +

                                    //res.Lemmes.Add(preposition + t.Replacement);
                                    txt = txt.Replace(m, "");

                                }
                                shouldContinue = false;
                            }
                            index++;
                        }
                    });


                res.MotsNonRetenus = txt.Split(' ').Distinct().ToList();
                List<string> toRemove = new List<string>();
                // Recherche de prepositions/descripteurs dans les mots non retenus

                //var desc = (from x in this.listPrepositions
                //            where x.Modality.IndexOf("descriptive") > -1 || x.Modality.IndexOf("hedonic") > -1
                //            select x);

                foreach (string m in res.MotsNonRetenus)
                {

                    foreach (var d in this.listPrepositions)
                    {
                        Regex rgx2 = new Regex("\\b" + d.RegularExpressionFR + "\\b");
                        if (rgx2.Match(m).Success)
                        {
                            Pretraitement motRetenu = new Pretraitement();
                            res.Mots.Add(motRetenu);
                            motRetenu.Word = m;
                            motRetenu.AttributeFR = d.AttributeFR;
                            motRetenu.FullConceptFR = d.FullConceptFR;
                            motRetenu.ProductCategory = d.ProductCategory;
                            //motRetenu.Modality = d.Modality;
                            motRetenu.Preposition = "";
                            toRemove.Add(m);
                        }
                    }
                }

                // Suppression de toutes les prépositions et autres mots restants
                //var desc2 = (from x in this.listPrepositions
                //             select x);
                //desc2 = desc2.Concat(from x in this.listPretraitement where x.Modality == "other" select x);
                //foreach (string m in res.MotsNonRetenus)
                //{
                //    foreach (var d in desc2)
                //    {
                //        Regex rgx2 = new Regex("\\b" + d.RegularExpressionFR + "\\b");
                //        if (rgx2.Match(m).Success)
                //        {
                //            toRemove.Add(m);
                //        }
                //    }
                //}

                toRemove.ForEach(m =>
                {
                    res.MotsNonRetenus.Remove(m);
                });

                // Corrections  
                if (this.hunspell != null)
                {
                    foreach (string m in res.MotsNonRetenus.Where(x => x.Length > 3))
                    {
                        bool resh = hunspell.Spell(m);

                        if (resh == false)
                        {

                            var list = this.listPretraitement.Where(x => x.RegularExpressionFR.StartsWith(m.Substring(0, 3)));
                            for (int i = 0; i < list.Count(); i++)
                            {
                                Pretraitement d = list.ElementAt(i);
                                int leven = CalcLevenshteinDistance(m, d.AttributeFR);
                                if (leven <= 2)
                                {
                                    Pretraitement motRetenu = new Pretraitement();
                                    res.Mots.Add(motRetenu);
                                    motRetenu.Word = m;
                                    motRetenu.AttributeFR = "[" + d.AttributeFR + "]";
                                    motRetenu.FullConceptFR = d.FullConceptFR;
                                    motRetenu.ProductCategory = d.ProductCategory;
                                    //motRetenu.Modality = d.Modality;
                                    motRetenu.Preposition = "";
                                    motRetenu.Corrected = "O";
                                    toRemove.Add(m);
                                    break;
                                }
                            }
                        }
                    }
                }

                return res;
            }

            public static string ReplaceSpecialCharacters(string txt)
            {
                if (txt == null)
                {
                    return "";
                }

                //byte[] temp = System.Text.Encoding.GetEncoding("ISO-8859-8").GetBytes(txt);
                //txt = System.Text.Encoding.UTF8.GetString(temp).TrimEnd().TrimEnd(',');
                txt = txt.Replace('\'', ' ');
                txt = txt.Replace('\r', ' ');
                txt = txt.Replace('\n', ' ');
                txt = txt.Replace('\t', ' ');
                txt = txt.Replace('-', ' ');
                txt = txt.Replace('\'', ' ');
                txt = txt.Replace(",", " XXX ");
                txt = txt.Replace("^", "");
                txt = txt.Replace("0", "");
                txt = txt.Replace("1", "");
                txt = txt.Replace("2", "é");
                txt = txt.Replace("3", "");
                txt = txt.Replace("4", "");
                txt = txt.Replace("5", "");
                txt = txt.Replace("6", "");
                txt = txt.Replace("7", "");
                txt = txt.Replace("8", "");
                txt = txt.Replace("9", "");
                txt = txt.Replace(".", " XXX ");
                txt = txt.Replace('(', ' ');
                txt = txt.Replace(')', ' ');
                txt = txt.Replace("?", " XXX ");
                txt = txt.Replace("!", " XXX ");
                txt = txt.Replace('/', ' ');
                txt = txt.Replace('"', ' ');
                txt = txt.Replace(";", " XXX ");
                txt = txt.Replace(":", " XXX ");
                txt = txt.Replace('è', 'é');
                txt = txt.Replace('ê', 'é');
                txt = txt.Replace('ë', 'é');
                txt = txt.Replace('ä', 'a');
                txt = txt.Replace('à', 'a');
                txt = txt.Replace('û', 'u');
                txt = txt.Replace('ô', 'o');
                txt = txt.Replace('â', 'a');
                txt = txt.Replace('î', 'i');
                txt = txt.Replace('ç', 'c');
                txt = txt.Replace("œ", "oe");
                return txt;
            }

            public static List<string> Match(string txt, string expressions)
            {
                Regex rgx = new Regex(expressions);
                List<string> mCol = rgx.Matches(txt).OfType<Match>()
                    .Select(m => m.Groups[0].Value)
                    .ToList();
                return mCol;
            }

            public Result Classify(string txt)
            {
                // TODO : garder meilleure correction 
                // TODO : quantifieur + descripteur => léger 
                // TODO : correction + mots multiples => pas tres douxi

                Result res = new Result();

                if (txt == null)
                {
                    return res;
                }

                // Passage en minuscule
                txt = txt.ToLower();

                // Suppression des caractères spéciaux                
                txt = ReplaceSpecialCharacters(txt);
                txt = " " + Regex.Replace(txt, @"\s+", " ") + " ";

                // Supression des mots de 2 lettres ou moins et des stop words
                List<string> tmp = txt.Split(' ').ToList();
                tmp = tmp.Where(x => { return (x.Length > 2 || this.listExceptions.IndexOf(x) > -1) && this.listStopWords.IndexOf(x) == -1; }).ToList();
                txt = string.Join(" ", tmp);


                res.TexteNettoye = txt;
                res.CategoriesProduit = this.listCategoriesProduit;

                // Chaine de caractères -> tableau
                List<string> words = txt.Split(' ').Where(x => x.Length > 0).ToList();
                List<string> newWords = new List<string>();

                res.MotsCorriges = new Dictionary<string, string>();

                // Correction orthographique
                //if (this.hunspell != null)
                //{
                for (int i = 0; i < words.Count; i++)
                {
                    string w = words.ElementAt(i);

                    int wlength = w.Length;
                    int nbCarCorrections = Math.Min(wlength, 3);
                    int distLeven = 2;
                    if (wlength > 7)
                    {
                        nbCarCorrections = 2;
                        distLeven = 3;
                    }
                    //bool resh = hunspell.Spell(w);

                    //if (resh == false)
                    //{
                    bool found = false;

                    // Recherche dans les mots autorisés
                    Regex rg = new Regex(this.regexpMotsAConserver);
                    if (rg.Matches(w).Count > 0)
                    {
                        newWords.Add(w);
                    }
                    else
                    {
                        if (this.hunspell != null)
                        {
                            bool resh = hunspell.Spell(w);
                            if (resh == false)
                            {
                                List<string> list = new List<string>();
                                try
                                {
                                    w = Regex.Replace(w, @"\p{Cs}", "");
                                    list = hunspell.Suggest(w).Where(x => x.Contains(" ") == false && x.StartsWith(w.ElementAt(0).ToString())).ToList();
                                }
                                catch (Exception ex)
                                {
                                    list = new List<string>();
                                }
                                //var list = this.listPretraitement.Where(x => ReplaceSpecialCharacters(x.AttributeFR).StartsWith(ReplaceSpecialCharacters(w).Substring(0, nbCarCorrections))).OrderBy(x => x.AttributeFR.Length);
                                for (int j = 0; j < list.Count(); j++)
                                {

                                    //Pretraitement d = list.ElementAt(j);
                                    string d = list.ElementAt(j);
                                    //int leven = CalcLevenshteinDistance(ReplaceSpecialCharacters(w), ReplaceSpecialCharacters(d.AttributeFR));
                                    int leven = CalcLevenshteinDistance(ReplaceSpecialCharacters(w), ReplaceSpecialCharacters(d));

                                    if (leven <= distLeven && rg.Matches(d).Count > 0)
                                    {
                                        //if (res.MotsCorriges.ContainsKey(d.AttributeFR) == false)
                                        if (res.MotsCorriges.ContainsKey(d) == false)
                                        {
                                            //res.MotsCorriges.Add(d.AttributeFR, w);
                                            res.MotsCorriges.Add(d, w);
                                            //newWords.Add(d.AttributeFR);
                                            newWords.Add(d);
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (found == false)
                        {
                            res.MotsNonRetenus.Add(w);
                            newWords.Add("X");
                        }
                    }
                    //}
                    //else
                    //{
                    //    newWords.Add(w);
                    //}
                    //}
                }

                txt = ReplaceSpecialCharacters(String.Join(" ", newWords));

                // Recherche des mots à conserver
                Regex rgx = new Regex(this.regexpMotsAConserver);
                List<string> matches = rgx.Matches(txt).OfType<Match>()
                .Select(m => m.Groups[0].Value)
                .ToList();

                this.listPretraitement.Add(new Pretraitement() { RegularExpressionFR = "X", Type = "stop-word" }); ;

                // Parcours des mots
                List<Pretraitement> concepts = new List<Pretraitement>();
                matches.ForEach(x =>
                {
                    int index = 0;
                    bool shouldContinue = true;
                    // Parcours des expressions régulières
                    while (index < this.listPretraitement.Count && shouldContinue == true)
                    {
                        Pretraitement t = this.listPretraitement.ElementAt(index);
                        rgx = new Regex("\\b" + t.RegularExpressionFR + "\\b");
                        if (rgx.Matches(x).Count > 0)
                        {
                            Pretraitement motRetenu = new Pretraitement();
                            concepts.Add(motRetenu);
                            motRetenu.Word = x;
                            motRetenu.AttributeFR = t.AttributeFR;
                            motRetenu.FullConceptFR = t.FullConceptFR;
                            motRetenu.ConceptFR = t.ConceptFR;
                            motRetenu.Type = t.Type;
                            //motRetenu.Corrected = "O";
                            shouldContinue = false;
                        }
                        index++;
                    }
                });

                /// Localisations pre
                for (int i = 0; i < concepts.Count; i++)
                {
                    if (concepts.ElementAt(i).Type == "localisation" && i < concepts.Count - 1)
                    {
                        if (concepts.ElementAt(i + 1).Type == "stop-word" || concepts.ElementAt(i + 1).Type == "quantifieur>post" || concepts.ElementAt(i + 1).Type == "quantifieur>pre")
                        {
                            concepts.ElementAt(i).Type = "stop-word";
                        }
                        else
                        {
                            concepts.ElementAt(i + 1).Word = concepts.ElementAt(i).Word + " " + concepts.ElementAt(i + 1).Word;
                            concepts.ElementAt(i + 1).FullConceptFR += "-" + concepts.ElementAt(i).AttributeFR;
                            concepts.ElementAt(i + 1).ConceptFR += "-" + concepts.ElementAt(i).AttributeFR;
                            concepts.ElementAt(i).Type = "stop-word";
                        }
                    }
                }
                //concepts = concepts.Where(x => x.Type != "stop-word").ToList();

                /// Localisations post
                for (int i = concepts.Count - 1; i > 0; i--)
                {
                    if (concepts.ElementAt(i).Type == "localisation" && i > 0)
                    {
                        if (concepts.ElementAt(i - 1).Type == "stop-word" || concepts.ElementAt(i - 1).Type == "quantifieur>pre" || concepts.ElementAt(i - 1).Type == "quantifieur>post")
                        {
                            concepts.ElementAt(i).Type = "stop-word";
                        }
                        else
                        {
                            concepts.ElementAt(i - 1).Word = concepts.ElementAt(i).Word + " " + concepts.ElementAt(i - 1).Word;
                            concepts.ElementAt(i - 1).FullConceptFR += "-" + concepts.ElementAt(i).AttributeFR;
                            concepts.ElementAt(i - 1).ConceptFR += "-" + concepts.ElementAt(i).AttributeFR;
                            concepts.ElementAt(i).Type = "stop-word";
                        }
                    }
                }
                //concepts = concepts.Where(x => x.Type != "stop-word").ToList();


                /// Quantifieurs pre
                for (int i = 0; i < concepts.Count; i++)
                {
                    if ((concepts.ElementAt(i).Type == "quantifieur>pre" || concepts.ElementAt(i).Type == "quantifieur>pre-post") && i < concepts.Count - 1)
                    {
                        if (concepts.ElementAt(i + 1).Type == "stop-word" || concepts.ElementAt(i + 1).Type == "quantifieur>post")
                        {
                            if (concepts.ElementAt(i).Type != "quantifieur>pre-post")
                            {
                                concepts.ElementAt(i).Type = "stop-word";
                            }
                        }
                        else
                        {
                            if (concepts.ElementAt(i + 1).Type == "quantifieur>pre")
                            {
                                concepts.ElementAt(i + 1).ConceptFR = concepts.ElementAt(i).ConceptFR + "-" + concepts.ElementAt(i + 1).ConceptFR;
                            }
                            else
                            {
                                concepts.ElementAt(i + 1).Word = concepts.ElementAt(i).Word + " " + concepts.ElementAt(i + 1).Word;
                                concepts.ElementAt(i + 1).Preposition = concepts.ElementAt(i).ConceptFR;
                            }
                            concepts.ElementAt(i).Type = "stop-word";
                        }
                    }
                }

                /// Quantifieurs post
                for (int i = concepts.Count - 1; i > 0; i--)
                {
                    if ((concepts.ElementAt(i).Type == "quantifieur>post" || concepts.ElementAt(i).Type == "quantifieur>pre-post") && i > 0)
                    {
                        if (concepts.ElementAt(i - 1).Type == "stop-word" || concepts.ElementAt(i - 1).Type == "quantifieur>pre")
                        {
                            concepts.ElementAt(i).Type = "stop-word";
                        }
                        else
                        {
                            if (concepts.ElementAt(i - 1).Type == "quantifieur>post")
                            {
                                concepts.ElementAt(i - 1).ConceptFR = concepts.ElementAt(i - 1).ConceptFR + "-" + concepts.ElementAt(i).ConceptFR;
                            }
                            else
                            {
                                concepts.ElementAt(i - 1).AttributeFR = concepts.ElementAt(i - 1).AttributeFR + " " + concepts.ElementAt(i).AttributeFR;
                                concepts.ElementAt(i - 1).Preposition = concepts.ElementAt(i).ConceptFR;
                            }
                            concepts.ElementAt(i).Type = "stop-word";
                        }
                    }
                }

                concepts.Where(x => x.Type != "stop-word").ToList().ForEach(x =>
                {
                    if (x.Type.StartsWith("quantifieur") == false)
                    {
                        Pretraitement motRetenu = new Pretraitement();


                        motRetenu.Word = x.Word;
                        
                        if (res.MotsCorriges.ContainsKey(x.Word))
                        {
                            motRetenu.Word += "(" + res.MotsCorriges[x.Word] + ")";
                            motRetenu.Corrected = "O";
                        }

                        motRetenu.AttributeFR = x.AttributeFR;
                        motRetenu.FullConceptFR = x.FullConceptFR;
                        motRetenu.ConceptFR = x.ConceptFR;
                        motRetenu.Type = x.Type;
                        if (x.Preposition != null)
                        {
                            motRetenu.Preposition = String.Join("-", x.Preposition.Split('-').Distinct());
                        }

                        motRetenu.GetDescriptor();

                        if (this.options.ExcludedModalities.Contains(motRetenu.Modality)==false)
                        {
                            res.Mots.Add(motRetenu);
                        }
                    }

                    // Si plusieurs concepts correspondent à la recherche
                    List<Pretraitement> l = (from y in this.listPretraitement where y.AttributeFR == x.AttributeFR && y.FullConceptFR != x.FullConceptFR && y.FullConceptFR.StartsWith("quantifieur") == false select y).ToList();
                    if (l.Count > 1)
                    {
                        l.ForEach(y =>
                        {
                            Pretraitement motRetenu2 = new Pretraitement();
                            //res.Mots.Add(motRetenu2);

                            motRetenu2.Word = x.Word;

                            //TOFIX
                            if (res.MotsCorriges.ContainsKey(x.Word))
                            {
                                motRetenu2.Word += "(" + res.MotsCorriges[x.Word] + ")";
                                motRetenu2.Corrected = "O";
                            }

                            motRetenu2.AttributeFR = y.AttributeFR;
                            motRetenu2.FullConceptFR = y.FullConceptFR;
                            motRetenu2.ConceptFR = y.ConceptFR;
                            motRetenu2.Type = y.Type;
                            motRetenu2.Preposition = x.Preposition;

                            motRetenu2.GetDescriptor();

                            if (this.options.ExcludedModalities.Contains(motRetenu2.Modality) == false)
                            {
                                res.Mots.Add(motRetenu2);
                            }
                        });
                    }

                });


                return res;
            }

        }

        private static int CalcLevenshteinDistance(string a, string b)
        {
            if (String.IsNullOrEmpty(a) && String.IsNullOrEmpty(b))
            {
                return 0;
            }
            if (String.IsNullOrEmpty(a))
            {
                return b.Length;
            }
            if (String.IsNullOrEmpty(b))
            {
                return a.Length;
            }
            int lengthA = a.Length;
            int lengthB = b.Length;
            var distances = new int[lengthA + 1, lengthB + 1];
            for (int i = 0; i <= lengthA; distances[i, 0] = i++) ;
            for (int j = 0; j <= lengthB; distances[0, j] = j++) ;

            for (int i = 1; i <= lengthA; i++)
                for (int j = 1; j <= lengthB; j++)
                {
                    int cost = b[j - 1] == a[i - 1] ? 0 : 1;
                    distances[i, j] = Math.Min
                        (
                        Math.Min(distances[i - 1, j] + 1, distances[i, j - 1] + 1),
                        distances[i - 1, j - 1] + cost
                        );
                }
            return distances[lengthA, lengthB];
        }

        public static string GetSensoryWords(string txt, string options)
        {
            AnalysisOption o = Serializer.DeserializeFromString<AnalysisOption>(options);
            Classifier classifier = new Classifier(lexiconDirPath + o.Lexicon + ".xlsx", options);
            Result res = classifier.Classify(txt);
            string jsonString = new JavaScriptSerializer().Serialize(res);
            return jsonString;
        }

        public static string GetSensoryWords2(Classifier classifier, string txt, bool unspell = false)
        {            
            Result res = classifier.Classify(txt);
            return string.Join(", ", from x in res.Mots
                                     select x.AttributeFR);
        }

        //public static Classifier GetClassifier()
        //{
        //    Classifier classifier = new Classifier(lexiconFilePath);
        //    return classifier;
        //}

        public class TesteLexiqueResult
        {
            public bool Exist;
            public List<string> Modalities;
            public List<string> Products;
        }

        public static string TesteLexique(string name)
        {
            TesteLexiqueResult res = new TesteLexiqueResult();
            res.Modalities = new List<string>();
            res.Products = new List<string>();
            res.Exist = true;

            string designationPassageFilePath = ConfigurationManager.AppSettings["LexiconDirPath"] + name + ".xlsx";
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            if (File.Exists(designationPassageFilePath) == false)
            {
                res.Exist = false;
                designationPassageFilePath = ConfigurationManager.AppSettings["LexiconDirPath"] + "lexicon.xlsx";
            }

            using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(designationPassageFilePath)))
            {

                var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);

                var totalRows = myWorksheet.Dimension.End.Row;

                for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                {
                    string txt = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FullConceptFR")].Value ?? string.Empty).ToString();
                    string mod = txt.Split(':').ElementAt(0);
                    if (res.Modalities.Contains(mod) == false)
                    {
                        res.Modalities.Add(mod);
                    }
                    txt = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "ProductCategory")].Value ?? string.Empty).ToString();
                    if (res.Products.Contains(txt) == false)
                    {
                        res.Products.Add(txt);
                    }
                }

            }


            return new JavaScriptSerializer().Serialize(res);
        }

        public static void UploadLexique(string data, string name)
        {
            try
            {
                byte[] bytes = Org.BouncyCastle.Utilities.Encoders.Base64.Decode(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                MemoryStream stream = new MemoryStream(bytes);
                ExcelPackage xlPackage = new ExcelPackage(stream);

                xlPackage.SaveAs(new FileInfo(ConfigurationManager.AppSettings["LexiconDirPath"] + name + ".xlsx"));

                //TODO : vérifier structure du fichier
                //TODO : renvoi nombre concepts, catégories produit, modalités senso

                //ResultReferentiel result = ReadReferentiel(ConfigurationManager.AppSettings["ReferentielFoodExPath"] + name + ".xlsx", 1000);

                //List<ReferenceOFF> list = result.ListeReferencesOFF;

                //UploadReferentielResult res = new UploadReferentielResult();
                //res.CountBefore = list.Count;
                //res.CountAfter = list.GroupBy(x => new { x.TripletsString, x.Famille }).Select(group => group.First()).Count();

                //return (res);

                //return list.Count;



            }
            catch (Exception ex)
            {
                //throw new FaultException(new FaultReason("Erreur lors du téléversement du fichier"), new FaultCode("Erreur lors du téléversement du fichier"));
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }


        private static ExcelPackage getSensoryWordsInXlsIn(string data, string options)
        {
            AnalysisOption o = Serializer.DeserializeFromString<AnalysisOption>(options);

            byte[] bytes = Org.BouncyCastle.Utilities.Encoders.Base64.Decode(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            Classifier classifier = new Classifier(lexiconDirPath + o.Lexicon + ".xlsx", options);
            MemoryStream stream = new MemoryStream(bytes);

            ExcelPackage xlPackage = new ExcelPackage(stream);
            // ENTREE
            // Colonne 1 : sujet
            // Colonne 2 : produit
            // Colonne 3 : autre
            // Colonne 4 : fc

            // SORTIE 1
            // Colonne 1 : sujet
            // Colonne 2 : produit
            // Colonne 3 : autre
            // Colonne 4 : fc            
            // Colonne 5 : fc nettoyé

            // SORTIE 2 (format long)
            // Colonne 1 : sujet
            // Colonne 2 : produit
            // Colonne 3 : autre
            // Colonne 4 : mot
            // Colonne 5 : concept(s) séparés par ,
            // Colonne 6 : quantifieur

            // SORTIE 3
            // Mots non retenus

            // SORTIE 4
            // Mots corrigés


            var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);
            var totalRows = myWorksheet.Dimension.End.Row;

            myWorksheet.Cells[1, 5].Value = "Texte nettoyé";

            Dictionary<string, int> motsNonRetenus = new Dictionary<string, int>();
            Dictionary<string, string> motsCorriges = new Dictionary<string, string>();
            List<ResultSenso> resultatSenso = new List<ResultSenso>();

            for (int rowNum = 2; rowNum <= totalRows; rowNum++)
            {
                string txt = (myWorksheet.Cells[rowNum, 4].Value ?? string.Empty).ToString();
                Result res = classifier.Classify(txt);

                //myWorksheet.Cells[rowNum, 5].Value = res.TexteNettoye;
                myWorksheet.Cells[rowNum, 5].Value = "";

                res.Mots.ForEach(m =>
                {
                    ResultSenso r = new ResultSenso();
                    r.Subject = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();
                    r.Product = (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString();
                    r.Factor = (myWorksheet.Cells[rowNum, 3].Value ?? string.Empty).ToString();
                    r.Word = m.Word;
                    r.Concept = m.FullConceptFR;
                    r.Quantifier = m.Preposition;
                    r.Corrected = m.Corrected;
                    r.Descriptor = m.Descriptor;
                    r.Modality = m.Modality;
                    r.RootConcept = m.RootConcept;
                    r.PredecessorConcept = m.PredecessorConcept;
                    resultatSenso.Add(r);
                    myWorksheet.Cells[rowNum, 5].Value += r.Concept;
                    if (r.Quantifier != null)
                    {
                        myWorksheet.Cells[rowNum, 5].Value += "/" + r.Quantifier;
                    }
                    myWorksheet.Cells[rowNum, 5].Value += " ; ";
                });

                //List<string> words = new List<string>();

                //res.Mots.ForEach(x =>
                //{
                //    string word = x.AttributeFR;
                //    if (x.Preposition != null && x.Preposition.Length > 0)
                //    {
                //        word += x.Preposition;
                //    }
                //    words.Add(word);
                //});

                //myWorksheet.Cells[rowNum, 4].Value = string.Join(" ", words);
                res.MotsNonRetenus.ForEach(x =>
                {
                    if (x.Length > 1)
                    {
                        if (motsNonRetenus.ContainsKey(x))
                        {
                            motsNonRetenus[x] += 1;
                        }
                        else
                        {
                            motsNonRetenus.Add(x, 1);
                        }
                    }
                });

                List<KeyValuePair<string, string>> list = (from x in res.MotsCorriges select x).ToList();
                list.ForEach(x =>
                {

                    if (motsCorriges.ContainsKey(x.Key) == false)
                    {
                        motsCorriges.Add(x.Key, x.Value);
                    }

                });

                //motsNonRetenus = motsNonRetenus.Concat(res.MotsNonRetenus).ToList();
            }

            xlPackage.Workbook.Worksheets.Add("result");
            myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);

            myWorksheet.Cells[1, 1].Value = "subject";
            myWorksheet.Cells[1, 2].Value = "product";
            myWorksheet.Cells[1, 3].Value = "factor";
            myWorksheet.Cells[1, 4].Value = "word";
            myWorksheet.Cells[1, 5].Value = "concept";
            myWorksheet.Cells[1, 6].Value = "quantifier";
            myWorksheet.Cells[1, 7].Value = "corrected";
            myWorksheet.Cells[1, 8].Value = "modality";
            myWorksheet.Cells[1, 9].Value = "rootConcept";
            myWorksheet.Cells[1, 10].Value = "predecessorConcept";
            myWorksheet.Cells[1, 11].Value = "descriptor";


            int index = 2;
            foreach (ResultSenso r in resultatSenso)
            {
                myWorksheet.Cells[index, 1].Value = r.Subject;
                myWorksheet.Cells[index, 2].Value = r.Product;
                myWorksheet.Cells[index, 3].Value = r.Factor;
                myWorksheet.Cells[index, 4].Value = r.Word;
                myWorksheet.Cells[index, 5].Value = r.Concept;
                myWorksheet.Cells[index, 6].Value = r.Quantifier;
                myWorksheet.Cells[index, 7].Value = r.Corrected;
                if (r.Concept != null & r.Concept != "")
                {
                    myWorksheet.Cells[index, 8].Value = r.Modality;
                    myWorksheet.Cells[index, 9].Value = r.RootConcept;
                    myWorksheet.Cells[index, 10].Value = r.PredecessorConcept;
                    myWorksheet.Cells[index, 11].Value = r.Descriptor;
                }

                //string pas = "";
                //if (r.Quantifier == "pas")
                //{
                //    pas = "pas-";
                //}
                //if (r.Concept != null & r.Concept != "")
                //{
                //    string[] left = r.Concept.Split(':');
                //    myWorksheet.Cells[index, 8].Value = left.ElementAt(0);
                //    if (left.Count() > 1)
                //    {
                //        string[] right = left.ElementAt(1).Split('>');
                //        myWorksheet.Cells[index, 9].Value = pas + right.ElementAt(0);
                //        myWorksheet.Cells[index, 10].Value = pas + right.ElementAt(Math.Max(0, right.Count() - 2));
                //        if (r.Quantifier != null)
                //        {
                //            myWorksheet.Cells[index, 11].Value = r.Quantifier + "-" + right.Last();
                //        }
                //        else
                //        {
                //            myWorksheet.Cells[index, 11].Value = right.Last();
                //        }
                //    }
                //}

                index++;
            }


            motsNonRetenus = motsNonRetenus.OrderByDescending(x => x.Value).ToDictionary(x => x.Key, x => x.Value);

            xlPackage.Workbook.Worksheets.Add("excluded_words");
            myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(2);

            myWorksheet.Cells[1, 1].Value = "word";
            myWorksheet.Cells[1, 2].Value = "count";
            index = 2;

            foreach (KeyValuePair<string, int> entry in motsNonRetenus)
            {
                myWorksheet.Cells[index, 1].Value = entry.Key;
                myWorksheet.Cells[index, 2].Value = entry.Value;
                index++;
            }

            xlPackage.Workbook.Worksheets.Add("corrected_words");
            myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(3);

            myWorksheet.Cells[1, 1].Value = "word";
            myWorksheet.Cells[1, 2].Value = "suggestion";
            index = 2;

            foreach (KeyValuePair<string, string> entry in motsCorriges)
            {
                myWorksheet.Cells[index, 2].Value = entry.Key;
                myWorksheet.Cells[index, 1].Value = entry.Value;
                index++;
            }



            xlPackage.Save();
            return xlPackage;





        }

        public static byte[] GetSensoryWordsInXlsIn(string data, string options)
        {
            ExcelPackage xlPackage = getSensoryWordsInXlsIn(data, options);
            return xlPackage.GetAsByteArray();
        }

        public static string GetSensoryWordsInXlsInForAnalysis(string login, string data, string options)
        {            
            ExcelPackage xlPackage = getSensoryWordsInXlsIn(data, options);

            var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
            var totalRows = myWorksheet.Dimension.End.Row;
            string csv = "";



            for (int rowNum = 1; rowNum <= totalRows; rowNum++)
            {
                csv += (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 3].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 4].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 5].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 6].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 7].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 8].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 9].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 10].Value ?? string.Empty).ToString() + ",";
                csv += (myWorksheet.Cells[rowNum, 11].Value ?? string.Empty).ToString() + "\n";
            }

            return RAnalysis.RunFromCsv(login, "consotextplorer", csv, options, xlPackage);


        }



    }
}