﻿using iTextSharp.xmp.impl;
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
using DocumentFormat.OpenXml.Drawing.ChartDrawing;
using System.Threading.Tasks;
using Org.BouncyCastle.Asn1.Cms;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using NPOI.Util.ArrayExtensions;
using NPOI.OpenXmlFormats.Dml.Diagram;
using static ChemosensTools.fcLexicon.csModels.fcLexicon;
using SixLabors.Fonts.Unicode;
using System.Security.Cryptography;

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
            public string Quantifier = "";
            public string QuantifierConcept = "";
            public string Contextualizer = "";
            public string ContextualizerConcept = "";
            public string Word;
            public string Type;
            public string Class;
            public string Corrected;

            public string Descriptor = "";
            public string Modality = "";
            public string RootConcept = "";
            public string PredecessorConcept;

            public int Position;

            public string ExtractedText;
            public string HandledText;


            public string GetDescription()
            {
                // Raw description extracted from text
                if (this.Contextualizer == "")
                {
                    this.Contextualizer = "-";
                }
                if (this.AttributeFR == "")
                {
                    this.AttributeFR = "";
                }
                if (this.Quantifier == "")
                {
                    this.Quantifier = "-";
                }
                if (this.Class == "quantifier")
                {
                    return ("-/-/" + this.AttributeFR).Trim().Trim(';').Trim();
                }
                if (this.Class == "contextualizer")
                {
                    return (this.AttributeFR + "/-/" + this.Quantifier).Trim().Trim(';').Trim();
                }
                if (this.Class == "concept")
                {
                    return (this.Contextualizer + "/" + this.AttributeFR + "/" + this.Quantifier).Trim().Trim(';').Trim();
                }
                return "";
            }

            public string GetAgregatedDescription()
            {
                // Concept = dimension:groupedescripteur(_groupequantifier)/descripteur(_groupequantifier) 
                string suffixConcept = "";
                string suffixDescripteur = "";

                if (this.QuantifierConcept.IndexOf("mal") > -1)
                {
                    suffixConcept = "_mal";
                    suffixDescripteur = "_mal";
                }
                else if (this.QuantifierConcept.IndexOf("bien") > -1)
                {
                    suffixConcept = "_bien";
                    suffixDescripteur = "_bien";
                }

                if (this.QuantifierConcept.IndexOf("pas") > -1 || this.QuantifierConcept.IndexOf("peu") > -1 || this.QuantifierConcept.IndexOf("manque") > -1)
                {
                    suffixDescripteur = "_pas";
                    if (suffixConcept == "_mal")
                    {
                        suffixConcept = "";
                    }
                    else if (suffixConcept == "_bien")
                    {
                        suffixConcept = "_mal";
                    }
                    else
                    {
                        suffixConcept += "_pas";
                    }
                }
                else if (this.QuantifierConcept.IndexOf("très") > -1 || this.QuantifierConcept.IndexOf("excès") > -1)
                {
                    if (suffixConcept == "")
                    {
                        suffixConcept = "_très";
                        suffixDescripteur = "_très";
                    }
                }

                string res = "";
                if (this.Class == "quantifier")
                {
                    string bracket = "";
                    if (this.ConceptFR.IndexOf("(") > -1)
                    {
                        bracket = this.ConceptFR.Split().Where(x => x.StartsWith("(") && x.EndsWith(")")).ToList().ElementAt(0).Replace("(", "").Replace(")", "");
                        this.ConceptFR = Regex.Replace(this.ConceptFR, @"\([^()]*\)", string.Empty).Trim();
                    }

                    if (this.ConceptFR.IndexOf("mal") > -1)
                    {
                        suffixConcept = "_mal";
                    }
                    else if (this.ConceptFR.IndexOf("bien") > -1)
                    {
                        suffixConcept = "_bien";

                    }

                    if (this.ConceptFR.IndexOf("pas") > -1 || this.ConceptFR.IndexOf("peu") > -1 || this.ConceptFR.IndexOf("manque") > -1)
                    {
                        if (suffixConcept == "_mal")
                        {
                            suffixConcept = "_bien";
                        }
                        else if (suffixConcept == "_bien")
                        {
                            suffixConcept = "_mal";
                        }
                        else if (this.ConceptFR.IndexOf("peu") > -1 && (this.ConceptFR.IndexOf("excès") > -1 || this.ConceptFR.IndexOf("très") > -1))
                        {
                            // peu très
                            suffixConcept = "_très";
                        }
                        else
                        {
                            suffixConcept += "_pas";
                        }
                    }
                    else if (this.ConceptFR.IndexOf("excès") > -1 || this.ConceptFR.IndexOf("très") > -1)
                    {
                        suffixConcept += "_très";
                    }

                    res = "global:global" + suffixConcept + "/_";
                    if (bracket != "")
                    {
                        res = bracket + ":" + bracket + suffixConcept + "/_";
                    }

                    if (this.ConceptFR == "")
                    {
                        res = "_:_/_";
                    }

                }

                if (this.Class == "contextualizer")
                {

                    if (this.ConceptFR.IndexOf("(") > -1)
                    {
                        this.ConceptFR = Regex.Replace(this.ConceptFR, @"\([^()]*\)", string.Empty).Trim();
                    }

                    string concept = this.ConceptFR.Split(' ').ElementAt(0);
                    if (concept == "")
                    {
                        concept = "_";
                    }
                    if (this.QuantifierConcept.IndexOf("bien") > -1)
                    {
                        suffixConcept = "_bien";
                        if (concept == "_")
                        {
                            concept = "global";
                        }
                    }
                    if (this.QuantifierConcept.IndexOf("mal") > -1)
                    {
                        suffixConcept = "_mal";
                        if (concept == "_")
                        {
                            concept = "global";
                        }
                    }
                    res = concept + ":" + concept + suffixConcept + "/_";
                }

                if (this.Class == "concept")
                {

                    string concept = "";

                    if (this.FullConceptFR.StartsWith("NC"))
                    {
                        concept = "_:_";
                    }
                    else if (this.FullConceptFR.IndexOf('|') > -1 && this.ContextualizerConcept.Length > 1)
                    {
                        string modality = this.FullConceptFR.Split(':').ElementAt(0);
                        if (this.ContextualizerConcept.IndexOf("(") > -1)
                        {
                            this.ContextualizerConcept = Regex.Replace(this.ContextualizerConcept, @"\([^()]*\)", string.Empty).Trim();
                        }
                        if (modality.Contains("goût"))
                        {
                            modality += "|arrière_goût";
                        }
                        if (this.ContextualizerConcept.Length > 0 && modality.IndexOf(this.ContextualizerConcept) > -1)
                        {
                            concept = this.ContextualizerConcept + ":" + this.FullConceptFR.Split(':').ElementAt(1);
                        }
                        else
                        {
                            concept = this.FullConceptFR;
                        }
                    }
                    else
                    {
                        concept = this.FullConceptFR;
                    }

                    
                    concept += suffixConcept;
                    concept = concept.Replace("_bien_très", "_bien");
                    concept = concept.Replace("_pas_pas", "");
                    concept = concept.Replace("_très_très", "_très");
                    concept = concept.Replace("_pas_très", "_pas");
                    concept = concept.Replace("_très_pas", "_pas");

                    res = concept + "/" + this.AttributeFR + suffixDescripteur;

                }

                //if (res == "")
                //{
                //    res = "_:_/_";
                //}

                res = res.Replace('-', '_');                
                res = res.Replace(' ', '_');
                if (res == "_:_/_")
                {
                    res = "";
                }
                return res;

            }

            public void GetDescriptor()
            {
                this.ExtractedText = this.GetDescription();
                this.HandledText = this.GetAgregatedDescription();
            }

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

            public string ExtractedText;
            public string HandledText;

            // Colonne 4 : mot
            // Colonne 5 : concept(s) séparés par ,
            // Colonne 6 : quantifieur


        }

        public class AnalysisOption
        {
            public List<string> ExcludedWords = new List<string>();
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
            public List<Pretraitement> Concepts = new List<Pretraitement>();
            public string TexteNettoye;
            public List<string> CategoriesProduit = new List<string>();
        }

        public class Classifier
        {
            private List<Pretraitement> listConcepts;
            private List<Pretraitement> listQuantifiers;
            //private List<Pretraitement> listCombinationQuantifiers;
            private List<Pretraitement> listContextualizers;
            private List<Pretraitement> listCompositeWords;

            private List<string> listExceptions;
            private List<string> listStopWords;
            private List<string> listStateVerbs;
            private List<string> listCategoriesProduit = new List<string>();
            private string regexpMotsAConserver;
            private Hunspell hunspell;
            private AnalysisOption options;


            public Classifier(string designationPassageFilePath, string options)
            {
                this.options = Serializer.DeserializeFromString<AnalysisOption>(options);


                if (this.options.Correction)
                {
                    this.hunspell = new Hunspell(System.Web.HttpContext.Current.Server.MapPath("~/consotextplorer/cs/fr.aff"), System.Web.HttpContext.Current.Server.MapPath("~/consotextplorer/cs/fr.dic"));
                }

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage xlPackage = new ExcelPackage(new FileInfo(designationPassageFilePath)))
                {
                    try
                    {
                        var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);

                        var totalRows = myWorksheet.Dimension.End.Row;

                        this.listConcepts = new List<Pretraitement>();

                        for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        {
                            string fullConceptFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FullConceptFR")].Value ?? string.Empty).ToString();

                            List<string> concepts = fullConceptFR.Split(',').ToList();
                            concepts.ForEach(x =>
                            {
                                Pretraitement p = new Pretraitement();
                                p.RegularExpressionFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "RegularExpressionFR")].Value ?? string.Empty).ToString();
                                p.AttributeFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "AttributeFR")].Value ?? string.Empty).ToString();
                                p.ProductCategory = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "ProductCategory")].Value ?? string.Empty).ToString();
                                p.Class = "concept";
                                if (this.listCategoriesProduit.Contains(p.ProductCategory) == false)
                                {
                                    this.listCategoriesProduit.Add(p.ProductCategory);
                                }

                                // On ne conserve que les concepts de la catégorie produit
                                if (p.ProductCategory == "" || p.ProductCategory == this.options.CategorieProduit)
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

                                    // Suppression des mots liés à une catégorie de produit en particulier (ex : "vin" pour les vins)
                                    if ((p.ProductCategory != "" && p.ProductCategory == this.options.CategorieProduit))
                                    {
                                        List<Pretraitement> toRemove = (from y in this.listConcepts where y.AttributeFR == p.AttributeFR select y).ToList();
                                        toRemove.ForEach(y => { this.listConcepts.Remove(y); });
                                    }

                                    if (p.FullConceptFR != null && p.FullConceptFR != "")
                                    {
                                        this.listConcepts.Add(p);
                                    }
                                }

                            });

                        }

                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
                        totalRows = myWorksheet.Dimension.End.Row;

                        // Nécessaire de commencer par les mots composés les plus long puis par ordre alphabétique décroissant                        
                        listConcepts = listConcepts.OrderByDescending(x => x.RegularExpressionFR.Split(' ').Count()).ThenByDescending(x => x.RegularExpressionFR.Length).ThenByDescending(x => x.RegularExpressionFR).ToList();

                        // Contextualiseurs
                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
                        totalRows = myWorksheet.Dimension.End.Row;
                        this.listContextualizers = new List<Pretraitement>();

                        for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        {
                            Pretraitement p = new Pretraitement();
                            p.RegularExpressionFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "RegularExpressionFR")].Value ?? string.Empty).ToString();
                            p.AttributeFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "AttributeFR")].Value ?? string.Empty).ToString();
                            p.ConceptFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FullConceptFR")].Value ?? string.Empty).ToString();
                            p.Class = "contextualizer";
                            this.listContextualizers.Add(p);
                        }

                        // Quantifieurs
                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(2);
                        totalRows = myWorksheet.Dimension.End.Row;
                        this.listQuantifiers = new List<Pretraitement>();

                        for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        {
                            Pretraitement p = new Pretraitement();
                            p.RegularExpressionFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "RegularExpressionFR")].Value ?? string.Empty).ToString();
                            p.AttributeFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "AttributeFR")].Value ?? string.Empty).ToString();
                            p.ConceptFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FullConceptFR")].Value ?? string.Empty).ToString();
                            p.Class = "quantifier";
                            this.listQuantifiers.Add(p);
                        }

                        List<string> listMotsAConserver = (from x in listConcepts where x.AttributeFR != "" select "\\b" + x.RegularExpressionFR + "\\b").ToList();
                        listMotsAConserver = listMotsAConserver.Where(x => { return x != ""; }).OrderByDescending(x => x.Length).ThenByDescending(x => x).ToList();
                        listMotsAConserver.Add("X");
                        listMotsAConserver = listMotsAConserver.Concat(from x in listQuantifiers where x.AttributeFR != "" select "\\b" + x.RegularExpressionFR + "\\b").Concat((from x in listContextualizers where x.AttributeFR != "" select "\\b" + x.RegularExpressionFR + "\\b")).ToList();
                        this.regexpMotsAConserver = string.Join("|", listMotsAConserver);


                        // Exceptions
                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(3);
                        totalRows = myWorksheet.Dimension.End.Row;
                        this.listExceptions = new List<string>();
                        for (int rowNum = 1; rowNum <= totalRows; rowNum++)
                        {
                            this.listExceptions.Add(myWorksheet.Cells[rowNum, 1].Value.ToString());
                        }

                        // Stop words
                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(4);
                        totalRows = myWorksheet.Dimension.End.Row;
                        this.listStopWords = new List<string>();
                        for (int rowNum = 1; rowNum <= totalRows; rowNum++)
                        {
                            this.listStopWords.Add(myWorksheet.Cells[rowNum, 1].Value.ToString());
                        }

                        // Verbes d'état à supprimer
                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(5);
                        totalRows = myWorksheet.Dimension.End.Row;
                        this.listStateVerbs = new List<string>();
                        for (int rowNum = 1; rowNum <= totalRows; rowNum++)
                        {
                            this.listStateVerbs.Add(myWorksheet.Cells[rowNum, 1].Value.ToString());
                        }

                        // Combinaisons de quantifieurs
                        //myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(6);
                        //totalRows = myWorksheet.Dimension.End.Row;
                        //this.listCombinationQuantifiers = new List<Pretraitement>();

                        //for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        //{
                        //    Pretraitement p = new Pretraitement();
                        //    p.AttributeFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "AttributeFR")].Value ?? string.Empty).ToString();
                        //    p.ConceptFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "FullConceptFR")].Value ?? string.Empty).ToString();
                        //    this.listCombinationQuantifiers.Add(p);
                        //}

                        // Mots composés
                        myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(7);
                        totalRows = myWorksheet.Dimension.End.Row;
                        this.listCompositeWords = new List<Pretraitement>();

                        for (int rowNum = 2; rowNum <= totalRows; rowNum++)
                        {
                            Pretraitement p = new Pretraitement();
                            p.RegularExpressionFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "RegularExpressionFR")].Value ?? string.Empty).ToString();
                            p.AttributeFR = (myWorksheet.Cells[rowNum, EPPlusHelper.GetColumnByName(myWorksheet, "AttributeFR")].Value ?? string.Empty).ToString();
                            this.listCompositeWords.Add(p);
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
                        while (index < this.listConcepts.Count && shouldContinue == true)
                        {
                            Pretraitement t = this.listConcepts.ElementAt(index);

                            rgx = new Regex("\\b" + t.RegularExpressionFR + "\\b");
                            if (rgx.Matches(m).Count > 0)
                            {
                                string transfo = rgx.Replace(m, t.AttributeFR);
                                if (transfo != "" && transfo != " ")
                                {

                                    Pretraitement motRetenu = new Pretraitement();
                                    res.Concepts.Add(motRetenu);
                                    motRetenu.Word = m;
                                    // Recherche des prépositions
                                    string preposition = "";
                                    string prepositionR = "";

                                    // Mot précédent
                                    string motPrecedent = "";

                                    for (int i = 0; i < this.listQuantifiers.Count; i++)
                                    {
                                        if (this.listQuantifiers[i].Type == "quantifieur>pre")
                                        {
                                            Regex rg = new Regex(this.listQuantifiers[i].RegularExpressionFR + " " + m);
                                            if (rg.Match(txt).Success)
                                            {
                                                preposition = this.listQuantifiers[i].ConceptFR;
                                                txt = rg.Replace(txt, "");
                                                break;
                                            }
                                        }
                                        if (this.listQuantifiers[i].Type == "quantifieur>post")
                                        {
                                            Regex rg = new Regex(m + " " + this.listQuantifiers[i].RegularExpressionFR);
                                            if (rg.Match(txt).Success)
                                            {
                                                preposition = this.listQuantifiers[i].ConceptFR;
                                                txt = rg.Replace(txt, "");
                                                break;
                                            }
                                        }

                                    }
                                    motRetenu.Quantifier = "";
                                    if (preposition.Length > 0)
                                    {
                                        motRetenu.Quantifier = preposition;
                                    }
                                    motRetenu.AttributeFR = prepositionR + t.AttributeFR;
                                    motRetenu.FullConceptFR = t.FullConceptFR;
                                    motRetenu.ProductCategory = t.ProductCategory;
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
                foreach (string m in res.MotsNonRetenus)
                {

                    foreach (var d in this.listQuantifiers)
                    {
                        Regex rgx2 = new Regex("\\b" + d.RegularExpressionFR + "\\b");
                        if (rgx2.Match(m).Success)
                        {
                            Pretraitement motRetenu = new Pretraitement();
                            res.Concepts.Add(motRetenu);
                            motRetenu.Word = m;
                            motRetenu.AttributeFR = d.AttributeFR;
                            motRetenu.FullConceptFR = d.FullConceptFR;
                            motRetenu.ProductCategory = d.ProductCategory;
                            //motRetenu.Modality = d.Modality;
                            motRetenu.Quantifier = "";
                            toRemove.Add(m);
                        }
                    }
                }

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

                            var list = this.listConcepts.Where(x => x.RegularExpressionFR.StartsWith(m.Substring(0, 3)));
                            for (int i = 0; i < list.Count(); i++)
                            {
                                Pretraitement d = list.ElementAt(i);
                                int leven = CalcLevenshteinDistance(m, d.AttributeFR);
                                if (leven <= 2)
                                {
                                    Pretraitement motRetenu = new Pretraitement();
                                    res.Concepts.Add(motRetenu);
                                    motRetenu.Word = m;
                                    motRetenu.AttributeFR = "[" + d.AttributeFR + "]";
                                    motRetenu.FullConceptFR = d.FullConceptFR;
                                    motRetenu.ProductCategory = d.ProductCategory;
                                    //motRetenu.Modality = d.Modality;
                                    motRetenu.Quantifier = "";
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
                txt = txt.Replace(':', ' ');
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
                txt = txt.Replace("’", " ");
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


            private Pretraitement FindConcept(string x, List<Pretraitement> list)
            {
                int index = 0;
                list = list.Where(y => y.RegularExpressionFR.Length > 1).ToList();
                //bool shouldContinue = true;
                // Parcours des concepts
                while (index < list.Count /*&& shouldContinue == true*/)
                {
                    Pretraitement t = list.ElementAt(index);
                    Regex rgx = new Regex("^(" + t.RegularExpressionFR + ")$");
                    if (rgx.Match(x).Success)
                    {
                        Pretraitement motRetenu = new Pretraitement();
                        motRetenu.Word = x;
                        motRetenu.AttributeFR = t.AttributeFR;
                        motRetenu.FullConceptFR = t.FullConceptFR;
                        motRetenu.ConceptFR = t.ConceptFR;
                        motRetenu.Type = t.Type;
                        motRetenu.Class = t.Class;
                        //motRetenu.Corrected = "O";
                        //shouldContinue = false;
                        return (motRetenu);
                    }
                    index++;
                }
                return null;
            }

            private static bool rechercheConceptAdj(List<Pretraitement> table, Pretraitement x, int pos)
            {
                List<Pretraitement> conceptsAdj = (from y in table where y.Class == "concept" && y.Position == x.Position + pos select y).ToList();
                if (conceptsAdj.Count == 1)
                {
                    // Fusion contextualizer + concept
                    if (conceptsAdj.ElementAt(0).Contextualizer == "-")
                    {
                        conceptsAdj.ElementAt(0).Contextualizer = "";
                        conceptsAdj.ElementAt(0).ContextualizerConcept = "";
                    }
                    //if (conceptsAdj.ElementAt(0).Quantifier == "-")
                    //{
                    //    conceptsAdj.ElementAt(0).Quantifier = "";
                    //    conceptsAdj.ElementAt(0).QuantifierConcept = "";
                    //}
                    conceptsAdj.ElementAt(0).Contextualizer += " " + x.AttributeFR;
                    conceptsAdj.ElementAt(0).ContextualizerConcept += " " + x.ConceptFR;
                    conceptsAdj.ElementAt(0).Contextualizer = conceptsAdj.ElementAt(0).Contextualizer.Trim();
                    conceptsAdj.ElementAt(0).ContextualizerConcept = conceptsAdj.ElementAt(0).ContextualizerConcept.Trim();

                    conceptsAdj.ElementAt(0).Quantifier += " " + x.Quantifier;
                    conceptsAdj.ElementAt(0).QuantifierConcept += " " + x.QuantifierConcept;
                    if (conceptsAdj.ElementAt(0).Quantifier != "-")
                    {
                        conceptsAdj.ElementAt(0).Quantifier = conceptsAdj.ElementAt(0).Quantifier.Trim();
                        conceptsAdj.ElementAt(0).QuantifierConcept = conceptsAdj.ElementAt(0).QuantifierConcept.Trim();
                    }

                    table.Remove(x);

                    // Suppression  du contextualizer en tant que contexte, s'il existe                      
                    //List<Pretraitement> conceptsAdjToRemove = (from y in table where y.Class == "concept" && y.Position == x.Position && y.AttributeFR == x.AttributeFR select y).ToList();
                    //if (conceptsAdjToRemove.Count > 0)
                    //{
                    //    table.Remove(conceptsAdjToRemove.ElementAt(0));
                    //}
                    return true;
                }
                return false;
            }

            private static bool rechercheQuantifierAdj(List<Pretraitement> table, Pretraitement x, int pos)
            {
                List<Pretraitement> conceptsAdj = (from y in table where (y.Class == "concept" || y.Class == "contextualizer") && y.Position == x.Position + pos select y).ToList();
                if (conceptsAdj.Count > 0)
                {
                    conceptsAdj.ForEach(conc =>
                    {
                        // Association quantififier + concept
                        if (conc.Quantifier == "-")
                        {
                            conc.Quantifier = "";
                            conc.QuantifierConcept = "";
                        }
                        conc.Quantifier += " " + x.AttributeFR;
                        conc.QuantifierConcept += " " + x.ConceptFR;
                        conc.Quantifier = conc.Quantifier.Trim();
                        conc.QuantifierConcept = conc.QuantifierConcept.Trim();
                        // Suppression si considéré comme quantifier
                        table.Remove(x);
                        (from y in table where y.Position == x.Position select y).ToList().ForEach(y => table.Remove(y));
                    });
                    return true;
                }
                return false;
            }


            public Result Classify(string txt)
            {
                // TODO : quantifieur + descripteur => léger 
                // TODO : correction + mots multiples => pas tres douxi

                Result res = new Result();
                res.CategoriesProduit = this.listCategoriesProduit;

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

                // Fusion des mots composés
                txt = string.Join(" ", tmp);
                this.listCompositeWords.ForEach(x =>
                {
                    Regex rgx = new Regex("\\b" + x.RegularExpressionFR + "\\b");
                    if (rgx.Matches(txt).Count > 0)
                    {
                        txt = rgx.Replace(txt, x.AttributeFR);
                    }

                });

                // Supression des mots à exclure
                this.listStateVerbs.ForEach(x =>
                {
                    Regex rgx = new Regex("\\b" + x + "\\b");
                    if (rgx.Matches(txt).Count > 0)
                    {
                        txt = rgx.Replace(txt, "");
                    }

                });

                tmp = txt.Split(' ').ToList();

                //// Supression des verbes d'états
                //tmp = tmp.Where(x => this.listStateVerbs.IndexOf(x) == -1).ToList();



                txt = string.Join(" ", tmp);

                res.TexteNettoye = txt;

                // Chaine de caractères -> tableau
                List<string> words = txt.Split(' ').Where(x => x.Length > 0).ToList();
                List<string> newWords = new List<string>();

                res.MotsCorriges = new Dictionary<string, string>();

                // Correction orthographique

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
                                    list = hunspell.Suggest(w);
                                    list = list.Where(x => x.Contains(" ") == false /*&& x.Length >= w.Length*/ && x.StartsWith(w.ElementAt(0).ToString())).ToList();
                                }
                                catch (Exception ex)
                                {
                                    list = new List<string>();
                                }

                                int minLeven = 1000;
                                string betterSuggestion = "";
                                for (int j = 0; j < list.Count(); j++)
                                {


                                    string d = list.ElementAt(j);

                                    int leven = CalcLevenshteinDistance(ReplaceSpecialCharacters(w), ReplaceSpecialCharacters(d));

                                    if (leven <= distLeven /*&& rg.Matches(d).Count > 0*/)
                                    {
                                        if (leven < minLeven || (leven == minLeven && rg.Matches(d).Count > 0))
                                        {
                                            minLeven = leven;
                                            d = d.Replace('-', ' ');
                                            d = d.Replace('\'', ' ');
                                            betterSuggestion = d;
                                        }
                                    }
                                }

                                if (betterSuggestion != "" && res.MotsCorriges.ContainsKey(betterSuggestion) == false)
                                {
                                    res.MotsCorriges.Add(betterSuggestion, w);
                                    newWords.Add(betterSuggestion);
                                    found = true;
                                }

                            }
                        }
                        if (found == false)
                        {
                            res.MotsNonRetenus.Add(w);
                            newWords.Add("XXX");
                        }
                    }

                }

                txt = ReplaceSpecialCharacters(String.Join(" ", newWords));

                // Supression des mots à exclure
                this.options.ExcludedWords.Concat(this.listStateVerbs).ToList().ForEach(x =>
                {
                    Regex rgx = new Regex("\\b" + x + "\\b");
                    if (rgx.Matches(txt).Count > 0)
                    {
                        txt = rgx.Replace(txt, "");
                    }

                });

                // Parcours de la chaine et lemmatization
                List<Pretraitement> table = new List<Pretraitement>();
                int position = 0;

                List<string> mots = txt.Split(' ').ToList();
                while (position < mots.Count)
                {
                    string mot = mots.ElementAt(position);

                    if (mot == "XXX")
                    {
                        table.Add(new Pretraitement() { Class = "stopword", Position = position });
                    }

                    Pretraitement contextualizer = this.FindConcept(mot, this.listContextualizers);
                    if (contextualizer != null)
                    {
                        contextualizer.Position = position;
                        table.Add(contextualizer);
                    }
                    Pretraitement quantifier = this.FindConcept(mot, this.listQuantifiers);
                    if (quantifier != null)
                    {
                        quantifier.Position = position;
                        table.Add(quantifier);
                    }

                    Pretraitement concept = this.FindConcept(mot, this.listConcepts);

                    if (concept != null)
                    {
                        concept.Position = position;
                        table.Add(concept);
                    }

                    position += 1;
                }

                // Fusion des quantifieurs successifs
                List<Pretraitement> quantifiers = (from x in table where x.Class == "quantifier" select x).OrderBy(x => x.Position).ToList();
                quantifiers.ForEach(x =>
                {
                    List<Pretraitement> quantifiersNext = (from y in quantifiers where y.Position == x.Position + 1 select y).ToList();
                    if (quantifiersNext.Count > 0)
                    {

                        if (quantifiersNext.ElementAt(0).ConceptFR.Split(' ').ToList().IndexOf(x.ConceptFR) == -1)
                        {
                            quantifiersNext.ElementAt(0).AttributeFR = x.AttributeFR + " " + quantifiersNext.ElementAt(0).AttributeFR;
                            quantifiersNext.ElementAt(0).ConceptFR = x.ConceptFR + " " + quantifiersNext.ElementAt(0).ConceptFR;

                            // Quantifiers combinés
                            //List<Pretraitement> combination = (from y in this.listCombinationQuantifiers where quantifiersNext.ElementAt(0).ConceptFR.Replace("-", " ") == y.AttributeFR select y).ToList();
                            //if (combination.Count > 0)
                            //{
                            //    quantifiersNext.ElementAt(0).ConceptFR = combination.ElementAt(0).ConceptFR;
                            //}


                        }

                        table.Remove(x);
                    }
                });

                // Fusion des contextualizers successifs
                List<Pretraitement> contextualizers = (from x in table where x.Class == "contextualizer" select x).OrderBy(x => x.Position).ToList();
                contextualizers.ForEach(x =>
                {
                    List<Pretraitement> contextualizersNext = (from y in contextualizers where y.Position == x.Position + 1 select y).ToList();
                    if (contextualizersNext.Count > 0)
                    {
                        if (contextualizersNext.ElementAt(0).AttributeFR != x.AttributeFR)
                        {
                            contextualizersNext.ElementAt(0).AttributeFR = x.AttributeFR + " " + contextualizersNext.ElementAt(0).AttributeFR;
                            if (contextualizersNext.ElementAt(0).ConceptFR != x.ConceptFR)
                            {
                                contextualizersNext.ElementAt(0).ConceptFR = x.ConceptFR + " " + contextualizersNext.ElementAt(0).ConceptFR;
                            }
                        }
                        table.Remove(x);
                    }
                });

                // Renumérotation
                position = 0;
                int memoryPosition = 0;
                string pred = "";
                table.ForEach(x =>
                {
                    if (pred == x.AttributeFR)
                    {
                        x.Position = memoryPosition;
                    }
                    else
                    {
                        x.Position = position;
                        memoryPosition = position;
                        position++;
                    }
                    pred = x.AttributeFR;
                });

                // Parcours des quantifieurs ==> association avec concept précédent ou suivant, sinon supprimé         
                quantifiers = (from x in table where x.Class == "quantifier" select x).OrderBy(x => x.Position).ToList();
                quantifiers.ForEach(x =>
                {
                    // Recherches concepts à gauche
                    if (rechercheQuantifierAdj(table, x, +1) == false)
                    {
                        rechercheQuantifierAdj(table, x, -1);
                    }
                });

                // Renumérotation
                position = 0;
                memoryPosition = 0;
                pred = "";
                table.ForEach(x =>
                {
                    if (pred == x.AttributeFR)
                    {
                        x.Position = memoryPosition;
                    }
                    else
                    {
                        x.Position = position;
                        memoryPosition = position;
                        position++;
                    }
                    pred = x.AttributeFR;
                });

                // Parcours des contextualizers ==> association avec concept suivant, sinon supprimé sauf si c'est aussi un concept
                contextualizers = (from x in table where x.Class == "contextualizer" select x).OrderBy(x => x.Position).ToList();
                contextualizers.ForEach(x =>
                {
                    // Recherches concepts adjacents
                    if (rechercheConceptAdj(table, x, +1) == false)
                    {
                        rechercheConceptAdj(table, x, -1);
                    }
                });

                List<Pretraitement> toRemove = (from x in table where x.Class == "stopword" select x).ToList();
                // Suppression des quantifieurs correspondants à des descripteurs
                table.ForEach(x =>
                {
                    if (x.Class == "quantifier")
                    {
                        int cpt = (from y in this.listConcepts where x.AttributeFR == y.AttributeFR select x).Count();
                        if (cpt > 0)
                        {
                            toRemove.Add(x);
                        }
                    }
                    if (x.Class == "concept")
                    {
                        x.Quantifier = x.Quantifier.Replace(x.AttributeFR, "").Trim();
                        x.QuantifierConcept = x.QuantifierConcept.Replace(x.ConceptFR, "").Trim();
                    }
                    x.GetDescriptor();
                });

                toRemove.ForEach(x =>
                {
                    table.Remove(x);
                });

                res.Concepts = table;


                return res;
            }

            public Result ClassifyOK(string txt)
            {
                // TODO : quantifieur + descripteur => léger 
                // TODO : correction + mots multiples => pas tres douxi

                Result res = new Result();
                res.CategoriesProduit = this.listCategoriesProduit;

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

                // Fusion des mots composés
                txt = string.Join(" ", tmp);
                this.listCompositeWords.ForEach(x =>
                {
                    Regex rgx = new Regex("\\b" + x.RegularExpressionFR + "\\b");
                    if (rgx.Matches(txt).Count > 0)
                    {
                        txt = rgx.Replace(txt, x.AttributeFR);
                    }

                });

                tmp = txt.Split(' ').ToList();

                // Supression des verbes d'états
                tmp = tmp.Where(x => this.listStateVerbs.IndexOf(x) == -1).ToList();

                txt = string.Join(" ", tmp);

                res.TexteNettoye = txt;

                // Chaine de caractères -> tableau
                List<string> words = txt.Split(' ').Where(x => x.Length > 0).ToList();
                List<string> newWords = new List<string>();

                res.MotsCorriges = new Dictionary<string, string>();

                // Correction orthographique

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
                                    list = hunspell.Suggest(w);
                                    list = list.Where(x => x.Contains(" ") == false /*&& x.Length >= w.Length*/ && x.StartsWith(w.ElementAt(0).ToString())).ToList();
                                }
                                catch (Exception ex)
                                {
                                    list = new List<string>();
                                }

                                int minLeven = 1000;
                                string betterSuggestion = "";
                                for (int j = 0; j < list.Count(); j++)
                                {


                                    string d = list.ElementAt(j);

                                    int leven = CalcLevenshteinDistance(ReplaceSpecialCharacters(w), ReplaceSpecialCharacters(d));

                                    if (leven <= distLeven && rg.Matches(d).Count > 0)
                                    {
                                        if (leven < minLeven)
                                        {
                                            minLeven = leven;
                                            d = d.Replace('-', ' ');
                                            d = d.Replace('\'', ' ');
                                            betterSuggestion = d;
                                        }
                                    }
                                }

                                if (betterSuggestion != "" && res.MotsCorriges.ContainsKey(betterSuggestion) == false)
                                {
                                    res.MotsCorriges.Add(betterSuggestion, w);
                                    newWords.Add(betterSuggestion);
                                    found = true;
                                    break;
                                }

                            }
                        }
                        if (found == false)
                        {
                            res.MotsNonRetenus.Add(w);
                            newWords.Add("XXX");
                        }
                    }

                }

                txt = ReplaceSpecialCharacters(String.Join(" ", newWords));

                //////////////////////////////////////////
                // Corriger ici

                // Parcours de la chaine et lemmatization
                List<Pretraitement> table = new List<Pretraitement>();
                int position = 0;

                List<string> mots = txt.Split(' ').ToList();
                while (position < mots.Count)
                {
                    string mot = mots.ElementAt(position);

                    if (mot == "XXX")
                    {
                        table.Add(new Pretraitement() { Class = "stopword", Position = position });
                    }

                    Pretraitement contextualizer = this.FindConcept(mot, this.listContextualizers);
                    if (contextualizer != null)
                    {
                        contextualizer.Position = position;
                        table.Add(contextualizer);
                    }
                    Pretraitement quantifier = this.FindConcept(mot, this.listQuantifiers);
                    if (quantifier != null)
                    {
                        quantifier.Position = position;
                        table.Add(quantifier);
                    }

                    Pretraitement concept = this.FindConcept(mot, this.listConcepts);
                    //bool go = true;
                    //// Recherche des concepts composites
                    //while (position < (mots.Count - 1) && go == true)
                    //{
                    //    mot += " " + mots.ElementAt(position + 1);
                    //    Pretraitement conceptComposite = this.FindConcept(mot, this.listConcepts);
                    //    if (conceptComposite != null)
                    //    {
                    //        concept = conceptComposite;
                    //        position += 1;
                    //    }
                    //    else
                    //    {
                    //        go = false;
                    //    }
                    //}
                    if (concept != null)
                    {
                        concept.Position = position;
                        table.Add(concept);
                    }

                    position += 1;
                }

                // Fusion des quantifieurs successifs
                List<Pretraitement> quantifiers = (from x in table where x.Class == "quantifier" select x).OrderBy(x => x.Position).ToList();
                quantifiers.ForEach(x =>
                {
                    List<Pretraitement> quantifiersNext = (from y in quantifiers where y.Position == x.Position + 1 select y).ToList();
                    if (quantifiersNext.Count > 0)
                    {

                        if (quantifiersNext.ElementAt(0).ConceptFR.Contains(x.ConceptFR) == false)
                        {
                            //quantifiersNext.ElementAt(0).AttributeFR = x.AttributeFR + "-" + quantifiersNext.ElementAt(0).AttributeFR;
                            //quantifiersNext.ElementAt(0).ConceptFR = x.ConceptFR + "-" + quantifiersNext.ElementAt(0).ConceptFR;
                            quantifiersNext.ElementAt(0).AttributeFR = x.AttributeFR + " " + quantifiersNext.ElementAt(0).AttributeFR;
                            quantifiersNext.ElementAt(0).ConceptFR = x.ConceptFR + " " + quantifiersNext.ElementAt(0).ConceptFR;

                            // Quantifiers combinés
                            //List<Pretraitement> combination = (from y in this.listCombinationQuantifiers where quantifiersNext.ElementAt(0).ConceptFR.Replace("-", " ") == y.AttributeFR select y).ToList();
                            //if (combination.Count > 0)
                            //{
                            //    quantifiersNext.ElementAt(0).ConceptFR = combination.ElementAt(0).ConceptFR;
                            //}


                        }

                        table.Remove(x);
                    }
                });

                // Fusion des contextualizers successifs
                List<Pretraitement> contextualizers = (from x in table where x.Class == "contextualizer" select x).OrderBy(x => x.Position).ToList();
                contextualizers.ForEach(x =>
                {
                    List<Pretraitement> contextualizersNext = (from y in contextualizers where y.Position == x.Position + 1 select y).ToList();
                    if (contextualizersNext.Count > 0)
                    {
                        if (contextualizersNext.ElementAt(0).ConceptFR != x.ConceptFR)
                        {
                            contextualizersNext.ElementAt(0).AttributeFR = x.AttributeFR + "-" + contextualizersNext.ElementAt(0).AttributeFR;
                            contextualizersNext.ElementAt(0).ConceptFR = x.ConceptFR + "-" + contextualizersNext.ElementAt(0).ConceptFR;
                        }
                        table.Remove(x);
                    }
                });

                // Renumérotation
                position = 0;
                int memoryPosition = 0;
                string pred = "";
                table.ForEach(x =>
                {
                    if (pred == x.AttributeFR)
                    {
                        x.Position = memoryPosition;
                    }
                    else
                    {
                        x.Position = position;
                        memoryPosition = position;
                        position++;
                    }
                    pred = x.AttributeFR;
                });

                // Parcours des quantifieurs ==> association avec concept précédent ou suivant, sinon supprimé         
                quantifiers = (from x in table where x.Class == "quantifier" select x).OrderBy(x => x.Position).ToList();
                quantifiers.ForEach(x =>
                {
                    // Recherches concepts à gauche
                    if (rechercheQuantifierAdj(table, x, +1) == false)
                    {
                        rechercheQuantifierAdj(table, x, -1);
                    }
                });

                // Renumérotation
                position = 0;
                memoryPosition = 0;
                pred = "";
                table.ForEach(x =>
                {
                    if (pred == x.AttributeFR)
                    {
                        x.Position = memoryPosition;
                    }
                    else
                    {
                        x.Position = position;
                        memoryPosition = position;
                        position++;
                    }
                    pred = x.AttributeFR;
                });

                // Parcours des contextualizers ==> association avec concept suivant, sinon supprimé sauf si c'est aussi un concept
                contextualizers = (from x in table where x.Class == "contextualizer" select x).OrderBy(x => x.Position).ToList();
                contextualizers.ForEach(x =>
                {
                    // Recherches concepts adjacents
                    if (rechercheConceptAdj(table, x, +1) == false)
                    {
                        rechercheConceptAdj(table, x, -1);
                    }
                });

                table = table.Where(x => x.Class == "concept").ToList();

                table.ForEach(x => { x.GetDescriptor(); });

                res.Concepts = table;


                return res;
            }

            public Result ClassifyOld(string txt)
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

                this.listConcepts.Add(new Pretraitement() { RegularExpressionFR = "X", Type = "stop-word" }); ;

                // Parcours des mots
                List<Pretraitement> concepts = new List<Pretraitement>();
                matches.ForEach(x =>
                {
                    int index = 0;
                    bool shouldContinue = true;
                    // Parcours des concepts
                    while (index < this.listConcepts.Count && shouldContinue == true)
                    {
                        Pretraitement t = this.listConcepts.ElementAt(index);
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
                    // Parcours des contextualizers
                    while (index < this.listContextualizers.Count && shouldContinue == true)
                    {
                        Pretraitement t = this.listContextualizers.ElementAt(index);
                        rgx = new Regex("\\b" + t.RegularExpressionFR + "\\b");
                        if (rgx.Matches(x).Count > 0)
                        {
                            Pretraitement motRetenu = new Pretraitement();
                            concepts.Add(motRetenu);
                            motRetenu.Word = x;
                            motRetenu.AttributeFR = t.AttributeFR;
                            //motRetenu.FullConceptFR = t.FullConceptFR;
                            motRetenu.ConceptFR = t.ConceptFR;
                            motRetenu.Type = t.Type;
                            //motRetenu.Corrected = "O";
                            shouldContinue = false;
                        }
                        index++;
                    }

                    // Parcours des quantifiers
                    while (index < this.listQuantifiers.Count && shouldContinue == true)
                    {
                        Pretraitement t = this.listQuantifiers.ElementAt(index);
                        rgx = new Regex("\\b" + t.RegularExpressionFR + "\\b");
                        if (rgx.Matches(x).Count > 0)
                        {
                            Pretraitement motRetenu = new Pretraitement();
                            concepts.Add(motRetenu);
                            motRetenu.Word = x;
                            motRetenu.AttributeFR = t.AttributeFR;
                            //motRetenu.FullConceptFR = t.FullConceptFR;
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
                                concepts.ElementAt(i + 1).Quantifier = concepts.ElementAt(i).ConceptFR;
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
                                concepts.ElementAt(i - 1).Quantifier = concepts.ElementAt(i).ConceptFR;
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
                        if (x.Quantifier != null)
                        {
                            motRetenu.Quantifier = String.Join("-", x.Quantifier.Split('-').Distinct());
                        }

                        motRetenu.GetDescriptor();

                        if (this.options.ExcludedModalities.Contains(motRetenu.Modality) == false)
                        {
                            res.Concepts.Add(motRetenu);
                        }
                    }

                    // Si plusieurs concepts correspondent à la recherche
                    List<Pretraitement> l = (from y in this.listConcepts where y.AttributeFR == x.AttributeFR && y.FullConceptFR != x.FullConceptFR && y.FullConceptFR.StartsWith("quantifieur") == false select y).ToList();
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
                            motRetenu2.Quantifier = x.Quantifier;

                            motRetenu2.GetDescriptor();

                            if (this.options.ExcludedModalities.Contains(motRetenu2.Modality) == false)
                            {
                                res.Concepts.Add(motRetenu2);
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
            return string.Join(", ", from x in res.Concepts
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
                //byte[] bytes = Org.BouncyCastle.Utilities.Encoders.Base64.Decode(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
                byte[] bytes = Convert.FromBase64String(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
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

            byte[] bytes = Convert.FromBase64String(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            Classifier classifier = new Classifier(lexiconDirPath + o.Lexicon + ".xlsx", options);
            MemoryStream stream = new MemoryStream(bytes);

            ExcelPackage xlPackage = new ExcelPackage(stream);

            var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);
            var totalRows = myWorksheet.Dimension.End.Row;

            myWorksheet.Cells[1, 5].Value = "contexte/descripteur/quantifieur";
            myWorksheet.Cells[1, 6].Value = "dimension:concept_intensité/descripteur_intensité";

            Dictionary<string, int> motsNonRetenus = new Dictionary<string, int>();
            Dictionary<string, string> motsCorriges = new Dictionary<string, string>();
            List<ResultSenso> resultatSenso = new List<ResultSenso>();

            Parallel.For(2, totalRows, rowNum =>
            //for (int rowNum = 2; rowNum <= totalRows; rowNum++)
            {
                string txt = (myWorksheet.Cells[rowNum, 4].Value ?? string.Empty).ToString();
                Result res = classifier.Classify(txt);

                myWorksheet.Cells[rowNum, 5].Value = "";
                myWorksheet.Cells[rowNum, 6].Value = "";

                res.Concepts.ForEach(m =>
                {
                    ResultSenso r = new ResultSenso();
                    r.Subject = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();
                    r.Product = (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString();
                    r.Factor = (myWorksheet.Cells[rowNum, 3].Value ?? string.Empty).ToString();
                    r.HandledText = m.HandledText;
                    string desc = m.ExtractedText;

                    if (desc != "")
                    {
                        myWorksheet.Cells[rowNum, 5].Value += desc + ";";
                        myWorksheet.Cells[rowNum, 6].Value += r.HandledText + ";";
                    }
                    resultatSenso.Add(r);
                });

                myWorksheet.Cells[rowNum, 5].Value = ((string)myWorksheet.Cells[rowNum, 5].Value).Trim(';');
                if (myWorksheet.Cells[rowNum, 5].Value == ";")
                {
                    myWorksheet.Cells[rowNum, 5].Value = "";
                }

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
                //}  
            });

            xlPackage.Workbook.Worksheets.Add("result");
            myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);

            myWorksheet.Cells[1, 1].Value = "subject";
            myWorksheet.Cells[1, 2].Value = "product";
            myWorksheet.Cells[1, 3].Value = "factor";
            myWorksheet.Cells[1, 4].Value = "dimension:concept_intensité/descripteur_intensité";
            myWorksheet.Cells[1, 5].Value = "dimension:concept_intensité/descripteur_intensité (sans bien/mal)";

            int index = 2;
            foreach (ResultSenso r in resultatSenso)
            {
                myWorksheet.Cells[index, 1].Value = r.Subject;
                myWorksheet.Cells[index, 2].Value = r.Product;
                myWorksheet.Cells[index, 3].Value = r.Factor;
                myWorksheet.Cells[index, 4].Value = r.HandledText;
                myWorksheet.Cells[index, 5].Value += r.HandledText.Replace("_bien", "").Replace("_mal", "") + ";";
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

        //public static string GetSensoryWordsInXlsInForAnalysis(string login, string data, string options)
        public static byte[] GetSensoryWordsInXlsInForAnalysis(string login, string data, string options)
        {
            ExcelPackage xlPackage = getSensoryWordsInXlsIn(data, options);
            return xlPackage.GetAsByteArray();


            //var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(1);
            //var totalRows = myWorksheet.Dimension.End.Row;
            //string csv = "";

            //for (int rowNum = 1; rowNum <= totalRows; rowNum++)
            //{
            //    csv += (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 3].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 4].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 5].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 6].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 7].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 8].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 9].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 10].Value ?? string.Empty).ToString() + ",";
            //    csv += (myWorksheet.Cells[rowNum, 11].Value ?? string.Empty).ToString() + "\n";
            //}

            //return RAnalysis.RunFromCsv(login, "consotextplorer", csv, options, xlPackage);


        }



    }
}