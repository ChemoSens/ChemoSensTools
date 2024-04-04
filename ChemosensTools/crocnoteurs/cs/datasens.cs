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
using TimeSense.Web.Helpers;
using static ChemosensTools.fcLexicon.csModels.fcLexicon;

namespace ChemosensTools.DataSens
{
    public class DataSens
    {

        public static void SendMail(string title, string txt)
        {
            MailHelper.SendMail2("crocnoteurs@inrae.fr", title, txt, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");
        }

        public static bool VerifieMail(string inscriptionDirPath, string mail, string hashkey)
        {
            string code = EncryptionHelper.Encrypt(mail, mail).Replace("/", "");
            string file = inscriptionDirPath + code + ".json";


            // Envoi mail avec code au juge
            string url = ConfigurationManager.AppSettings["DataSensURL"];
            string txt = "<p>Bonjour, voici votre lien pour participer à l'étude :</p>";
            txt += "<p><a href='" + url + "?id=" + code + "'>Je clique ici pour évaluer un produit </a>.</p>";
            txt += "<p>Attention, ce lien est personnel. Ne le transmettez pas à une autre personne.</p>";// Si quelqu’un de votre entourage souhaite participer à cette étude, il/elle doit au préalable s’inscrire ici : https://www.chemosenstools.com/crocnoteurs/inscription.html.</p>";
            txt += "<p>Votre code d'accès : " + code + "</p>";
            txt += "<p><a href='https://www.chemosenstools.com/crocnoteurs/data/comment_faire.pdf'>Télécharger le mode d'emploi.</a></p>";
            txt += "<p>Nous vous remercions par avance pour votre participation !</p>";
            txt += "<p></p><p>Plateforme Chemosens, Centre des Sciences du Goût et de l’Alimentation</p>";

            if (File.Exists(file))
            {
                InscriptionD insc = Serializer.Deserialize<InscriptionD>(file, hashkey);
                if (insc.Valide == false)
                {
                    throw new FaultException(new FaultReason("Votre inscription n'est pas encore validée, ou vous n'avez pas été retenu pour cette étude."), new FaultCode("Un compte associé à cette adresse mail existe déjà."));
                }
                if (insc.Valide == true)
                {
                    MailHelper.SendMail2(mail, "Votre lien d'accès pour l'étude croc'noteurs", txt, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");
                    throw new FaultException(new FaultReason("Un compte associé à cette adresse mail existe déjà. Le lien pour l'accès à l'étude vous a été renvoyé à cette adresse."), new FaultCode("Un compte associé à cette adresse mail existe déjà."));
                    //return true;
                }
                //throw new FaultException(new FaultReason("Un compte associé à cette adresse mail existe déjà. Le lien pour l'accès à l'étude vous a été renvoyé à cette adresse."), new FaultCode("Un compte associé à cette adresse mail existe déjà."));
            }

            return false;
        }

        public static string Inscription(string questionnaireDirPath, string inscriptionDirPath, string hashKey, string inscriptionJson, string mail, bool sendMail, bool valid = true)
        {
            try
            {

                mail = mail.ToLower().Replace(" ", "");

                string code = EncryptionHelper.Encrypt(mail, mail).Replace("/", "");
                //string file = questionnaireDirPath + code + ".json";
                string file2 = inscriptionDirPath + code + ".json";


                // Envoi mail avec code au juge
                //string url = ConfigurationManager.AppSettings["DataSensURL"];
                //string txt = "<p>Bonjour, et merci pour votre inscription !</p>";
                //txt += "<p><a href='" + url + "?id=" + code + "'>Je clique ici pour évaluer un produit</a>.</p>";
                //txt += "<p>Attention, ce lien est personnel. Ne le transmettez pas à une autre personne.</p>";// Si quelqu’un de votre entourage souhaite participer à cette étude, il/elle doit au préalable s’inscrire ici : https://www.chemosenstools.com/crocnoteurs/inscription.html.</p>";
                //txt += "<p>Votre code d'accès : " + code + "</p>";
                //txt += "<p><a href='https://www.chemosenstools.com/crocnoteurs/data/comment_faire.pdf'>Télécharger le mode d'emploi.</a></p>";
                //txt += "<p>Nous vous remercions par avance pour votre participation !</p>";
                //txt += "<p></p><p>Plateforme Chemosens, Centre des Sciences du Goût et de l’Alimentation</p>";

                if (File.Exists(file2))
                {
                    //MailHelper.SendMail2(mail, "Votre lien d'accès pour l'étude croc'noteurs", txt, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");
                    throw new FaultException(new FaultReason("Un compte associé à cette adresse mail existe déjà."), new FaultCode("Un compte associé à cette adresse mail existe déjà."));
                }

                InscriptionD insc = Serializer.DeserializeFromString<InscriptionD>(System.Uri.UnescapeDataString(inscriptionJson), hashKey);
                insc.Code = code;
                insc.DateInscription = DateTime.Now;
                insc.Valide = false;
                //InscriptionD newInsc = new InscriptionD();
                //newInsc.Adresse = insc.Adresse;
                ////newInsc.Civilite = insc.Civilite;
                //newInsc.Code = code;
                ////newInsc.ConnaissanceEtude = insc.ConnaissanceEtude;
                //newInsc.CP = insc.CP;
                //newInsc.CSP = insc.CSP;
                //newInsc.DateInscription = DateTime.Now;
                //newInsc.DateNaissance = insc.DateNaissance;
                //newInsc.Evaluations = new List<Evaluation>();
                //newInsc.Genre = insc.Civilite;
                //newInsc.Indemnisations = new List<Indemnisation>();
                //newInsc.InscriptionPanelSens = insc.InscriptionPanelSens;
                //newInsc.Mail = insc.Mail;
                ////newInsc.NbMajeurs = insc.NbMajeurs;
                ////newInsc.NbMineurs = insc.NbMineurs;
                //newInsc.NiveauEtudes = insc.NiveauEtudes;
                //newInsc.Nom = insc.Nom;
                //newInsc.Prenom = insc.Prenom;
                //newInsc.Telephone = insc.Telephone;
                //newInsc.Ville = insc.Ville;
                ////newInsc.Panel = insc.Panel;

                ////if (valid == false)
                ////{
                //    newInsc.Valide = false;
                ////}
                ////else
                ////{
                ////    newInsc.Valide = true;
                ////}

                Serializer.Serialize(insc, file2, hashKey);

                //if (valid == false)
                //{
                //    return "";
                //}

                //if (valid == true)
                //{
                //    File.Create(file).Dispose();
                //    File.WriteAllText(file, Serializer.Encrypt(System.Uri.UnescapeDataString(inscriptionJson), hashKey));
                //}

                string infos = "<p>Valide : " + (valid == true ? "Oui" : "Non") + "</p>"; /*"<p>Civilité : " + newInsc.Civilite + "</p>";*/
                infos += "<p>Nom : " + insc.Nom + "</p>";
                infos += "<p>Prénom : " + insc.Prenom + "</p>";
                infos += "<p>Mail : " + insc.Mail + "</p>";
                infos += "<p>Code : " + code + "</p>";

                List<System.Net.Mail.Attachment> list = new List<System.Net.Mail.Attachment>();

                if (valid == true)
                {
                    infos += "<p>Date de naissance : " + insc.DateNaissance.ToString("dd/MM/yyyy") + "</p>";
                    infos += "<p>Adresse : " + insc.Adresse + "</p>";
                    infos += "<p>CP : " + insc.CP + "</p>";
                    infos += "<p>Ville : " + insc.Ville + "</p>";
                    //infos += "<p>Téléphone : " + insc.Telephone + "</p>";
                    infos += "<p></p>";
                    infos += "<p><a href='" + ConfigurationManager.AppSettings["BaseURL"] + "webservice.svc/ValidationInscriptionDataSens?code=" + Uri.EscapeDataString(code) + "&mdp=lfkzlf44fz24&valid=true" + "'>Cliquer pour valider l'inscription</a>.</p>";

                    string filepath = ConfigurationManager.AppSettings["DataSensImgDirPath"] + "//justificatifs//" + insc.UUID + ".png";
                    list.Add(new System.Net.Mail.Attachment(filepath));
                }
                //infos += "<p>Code institut : " + insc.Panel + "</p>";
                //string auto = newInsc.InscriptionPanelSens == true ? "oui" : "non";
                //infos += "<p>Autorisation recontact : " + auto + "</p>";




                MailHelper.SendMailWithAttachments("crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr", "Nouvelle inscription", infos, list);




                //if (sendMail)
                //{
                //    MailHelper.SendMail2(mail, "Votre lien d'accès pour l'étude croc'noteurs", txt, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");
                //string infos = "<p>Civilité : " + newInsc.Civilite + "</p>";
                //infos += "<p>Nom : " + newInsc.Nom + "</p>";
                //infos += "<p>Prénom : " + newInsc.Prenom + "</p>";
                //infos += "<p>Date de naissance : " + insc.DateNaissance.ToString("dd/MM/yyyy") + "</p>";
                //infos += "<p>CP : " + newInsc.CP + "</p>";
                //infos += "<p>Ville : " + newInsc.Ville + "</p>";
                //infos += "<p>Mail : " + newInsc.Mail + "</p>";
                //infos += "<p>Téléphone : " + newInsc.Telephone + "</p>";
                //infos += "<p>Code : " + code + "</p>";
                //infos += "<p>Code institut : " + insc.Panel + "</p>";
                //string auto = newInsc.InscriptionPanelSens == true ? "oui" : "non";
                //infos += "<p>Autorisation recontact : " + auto + "</p>";

                //List<System.Net.Mail.Attachment> list = new List<System.Net.Mail.Attachment>();
                //string filepath = ConfigurationManager.AppSettings["DataSensImgDirPath"] + "//justificatifs//" + insc.UUID + ".png";
                //list.Add(new System.Net.Mail.Attachment(filepath));

                //MailHelper.SendMailWithAttachments("crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr", "Nouvelle inscription", infos, list);
                //MailHelper.SendMail2("crocnoteurs@inrae.fr", "Nouvelle inscription", infos, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");

                //}

                return code;
            }
            catch (Exception ex)
            {
                File.WriteAllText("E:\\data\\crocnoteurs\\data\\log.txt", ex.Message);
                throw new FaultException(new FaultReason("Une erreur s'est produite."), new FaultCode("Une erreur s'est produite."));
            }
        }

        public static string ValidationInscription(string questionnaireDirPath, string inscriptionDirPath, string hashKey, string code, string mdp, bool valid = true)
        {
            try
            {
                if (mdp != "lfkzlf44fz24")
                {
                    return "";
                }

                string file = questionnaireDirPath + code + ".json";
                string file2 = inscriptionDirPath + code + ".json";

                if (File.Exists(file2))
                {
                    InscriptionD insc = Serializer.Deserialize<InscriptionD>(file2, hashKey);
                    insc.Valide = valid;
                    Serializer.Serialize(insc, file2, hashKey);

                    if (valid == true)
                    {
                        InscriptionD newInsc = new InscriptionD();
                        newInsc.Adresse = insc.Adresse;
                        //newInsc.Civilite = insc.Civilite;
                        newInsc.Code = code;
                        //newInsc.ConnaissanceEtude = insc.ConnaissanceEtude;
                        newInsc.CP = insc.CP;
                        newInsc.CSP = insc.CSP;
                        newInsc.DateInscription = DateTime.Now;
                        newInsc.DateNaissance = insc.DateNaissance;
                        newInsc.Evaluations = new List<Evaluation>();
                        newInsc.Genre = insc.Genre;
                        newInsc.Indemnisations = new List<Indemnisation>();
                        newInsc.InscriptionPanelSens = insc.InscriptionPanelSens;
                        newInsc.Mail = insc.Mail;
                        //newInsc.NbMajeurs = insc.NbMajeurs;
                        //newInsc.NbMineurs = insc.NbMineurs;
                        newInsc.NiveauEtudes = insc.NiveauEtudes;
                        newInsc.Nom = insc.Nom;
                        newInsc.Prenom = insc.Prenom;
                        //newInsc.Telephone = insc.Telephone;
                        newInsc.Ville = insc.Ville;
                        newInsc.Valide = true;

                        newInsc.Affordable = insc.Affordable;
                        newInsc.AnimalFriendly = insc.AnimalFriendly;
                        newInsc.Convenient = insc.Convenient;
                        newInsc.EnvironmentalFriendly = insc.EnvironmentalFriendly;
                        newInsc.FairlyTrade = insc.FairlyTrade;
                        newInsc.Familiar = insc.Familiar;
                        newInsc.Healthy = insc.Healthy;
                        newInsc.MoodMonitoring = insc.MoodMonitoring;
                        newInsc.Natural = insc.Natural;
                        newInsc.Pleasure = insc.Pleasure;
                        newInsc.WeightControl = insc.WeightControl;

                        Serializer.Serialize(newInsc, file, hashKey);

                        // Envoi mail avec code au juge
                        string url = ConfigurationManager.AppSettings["DataSensURL"];
                        string txt = "<p>Bonjour, et merci pour votre inscription !</p>";
                        txt += "<p><a href='" + url + "?id=" + code + "'>Je clique ici pour évaluer un produit</a>.</p>";
                        txt += "<p>Attention, ce lien est personnel. Ne le transmettez pas à une autre personne.</p>";// Si quelqu’un de votre entourage souhaite participer à cette étude, il/elle doit au préalable s’inscrire ici : https://www.chemosenstools.com/crocnoteurs/inscription.html.</p>";
                        txt += "<p>Votre code d'accès : " + code + "</p>";
                        txt += "<p><a href='https://www.chemosenstools.com/crocnoteurs/data/produits.pdf'>Télécharger la liste des produits éligibles pour l'étude.</a></p>";
                        txt += "<p><a href='https://www.chemosenstools.com/crocnoteurs/data/comment_faire.pdf'>Télécharger le mode d'emploi.</a></p>";                        
                        txt += "<p>Nous vous remercions par avance pour votre participation !</p>";
                        txt += "<p></p><p>Plateforme Chemosens, Centre des Sciences du Goût et de l’Alimentation</p>";

                        string txt2 = "<p>Code : " + insc.Code + "</p>";
                        txt2 += "<p>Nom : " + insc.Nom + "</p>";
                        txt2 += "<p>Prenom : " + insc.Prenom + "</p>";
                        txt2 += "<p>Mail : " + insc.Mail + "</p>";
                        txt2 += "<p>URL : " + url + "?id=" + code + "</p>";

                        MailHelper.SendMail2(insc.Mail, "Votre lien d'accès pour l'étude croc'noteurs", txt, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");
                        MailHelper.SendMail2("crocnoteurs@inrae.fr", "Lien d'accès envoyé", txt2, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");

                    }

                }
                else
                {
                    throw new FaultException(new FaultReason("Une erreur s'est produite."), new FaultCode("Une erreur s'est produite."));
                }





                return code;
            }
            catch (Exception ex)
            {
                File.WriteAllText("E:\\data\\crocnoteurs\\data\\log.txt", ex.Message);
                throw new FaultException(new FaultReason("Une erreur s'est produite."), new FaultCode("Une erreur s'est produite."));
            }
        }

        public class CodeBarre
        {
            public string EAN;
            public string Type;
            public string Designation;
            public string Categorie;
            public string Valide;
        }

        public static string VerifieCodeBarre(string dataSensBarcodesDirPath, string code, string encryptkey)
        {


            string file = dataSensBarcodesDirPath + "//" + code + ".json";

            if (File.Exists(file))
            {
                CodeBarre cb = Serializer.Deserialize<CodeBarre>(file, encryptkey);
                return Serializer.SerializeToString(cb);
            }
            else
            {
                JObject j = ciqualClassifier.csModels.ciqualClassifier.RequestOFF("ean", code);
                if (j != null && j["product_name_fr"] != null)
                {
                    throw new FaultException(new FaultReason(j["product_name_fr"].ToString()), new FaultCode("Le code-barre n'est pas répertorié."));
                }
                else
                {
                    throw new FaultException(new FaultReason(""), new FaultCode("Le code-barre n'est pas répertorié."));
                }
            }
        }

        public static bool VerifiePhoto(string dataSensImagePath, string code)
        {
            DirectoryInfo directory = new DirectoryInfo(dataSensImagePath + "compositions");
            FileInfo[] files = directory.GetFiles(code + "*.png");

            for (int i = 0; i < files.Length; i++)
            {
                DateTime tDate = files.ElementAt(i).CreationTime;
                if ((DateTime.Now - tDate).TotalDays < 30)
                {
                    return true;
                }
            }

            return false;
        }

        public class Evaluation
        {
            public string Date;
            public DateTime DateD;
            public string CodeBarre;
            public string Designation;
            public string Type;
            public int Rang;
            public double Montant;
            public double Multiplicateur = 1;
            public string MultiplicateurTexte = "";
            public double Total;
        }

        public class Indemnisation
        {
            public DateTime Date;
            public string Expiration;
            public double Montant;
            public string Code;
            public string DateS;
        }

        public class Cagnotte
        {
            public List<Evaluation> Evaluations;
            public List<Indemnisation> Indemnisations;
            public double Solde;
        }

        //public class FoodChoice
        //{
        //    public string Type;
        //    public int Healthy;
        //    public int MoodMonitoring;
        //    public int Convenient;
        //    public int Pleasure;
        //    public int Natural;
        //    public int Affordable;
        //    public int WeightControl;
        //    public int Familiar;
        //    public int EnvironmentalFriendly;
        //    public int AnimalFriendly;
        //    public int FairlyTrade;
        //    public bool Evalue;

        //}

        public class QuestionnaireSensas
        {
            public string Code;
            public int AnneeNaissance;
            public string Genre;
            public string CSP;
            public string NiveauEtudes;
            //public int NbMajeurs;
            //public int NbMineurs;
            public string FreqConsoCookie;
            public string FreqConsoPainMie;
            public string FreqConsoPizza;

            public List<DateTime> DatesAcces;
            public List<EvaluationProduit> EvaluationProduit;
            public List<ProduitIdeal> ListeProduitIdeal;
            //public List<FoodChoice> ListeFoodChoice;

            public List<DateTime> DatesMauvaisesReponses;
            public int NbEval;

            public List<string> ListIndemnisations;

            public int Healthy;
            public int MoodMonitoring;
            public int Convenient;
            public int Pleasure;
            public int Natural;
            public int Affordable;
            public int WeightControl;
            public int Familiar;
            public int EnvironmentalFriendly;
            public int AnimalFriendly;
            public int FairlyTrade;
            public bool Evalue;

            
        }

        public class ProduitIdeal
        {
            public string Type;
            public string DescriptionApparence;
            public string DescriptionTexture;
            public string DescriptionGout;
            public bool Evalue;
            public DateTime DateDebut;
            public DateTime DateFin;
        }

        public class Produit
        {
            public string CodeBarre;
            public string Type;
            public string Designation;
            public int Valide;
            public int Rang;
        }

        public class EvaluationProduit
        {
            public DateTime DateDebut;
            public DateTime DateFin;
            public Produit Produit;
            public string DejaGoute;
            public bool PhotoEmballage;

            public decimal ExpectedLiking;
            public string DescriptionApparence;
            public decimal StatedLiking;
            public string DescriptionTexture;
            public string DescriptionGout;
            //public string DescriptionAime;
            //public string DescriptionPasAime;

            //public DescriptionPasAime: string = "";
            public int AimeTexture;
            public int AimeGout;
            public int AimeApparence;

            public int JARSucre;
            public int JARSale;
            public int JARGras;
            public string IntentionReachat;
            public bool EvaluationTerminee;
        }

        public class InscriptionD
        {
            public string UUID = "";
            public string Code = "";
            //public string ConnaissanceEtude = "";
            public string Mail = "";
            //public string Civilite = "";
            //public string Panel = "";
            public string Nom = "";
            public string Prenom = "";
            public DateTime DateNaissance;
            public DateTime DateInscription;
            public string Genre = "";
            //public string Telephone = "";
            public string Adresse = "";
            public string CP = "";
            public string Ville = "";
            public string CSP = "";
            public string NiveauEtudes = "";
            //public int NbMajeurs;
            //public int NbMineurs;
            public bool InscriptionPanelSens = false;
            public List<Evaluation> Evaluations = new List<Evaluation>();
            public List<Indemnisation> Indemnisations = new List<Indemnisation>();
            public double IndemnisationMax = 60;
            //public List<FoodChoice> ListeFoodChoice = new List<FoodChoice>();
            public bool Valide = true;

            public string FreqConsoCookie;
            public string FreqConsoPainMie;
            public string FreqConsoPizza;

            public int Healthy;
            public int MoodMonitoring;
            public int Convenient;
            public int Pleasure;
            public int Natural;
            public int Affordable;
            public int WeightControl;
            public int Familiar;
            public int EnvironmentalFriendly;
            public int AnimalFriendly;
            public int FairlyTrade;
            public bool Evalue;

            public int TestNavigateur;
            public string TexteConditions;
            public int AccepteConditions;
            public int Pizzabon;
            public int Stromboli;
            public int Cookicroc;
            public int TanteAdele;
            public int Toastinou;
            public int MamieDouce;

            public double Cagnotte
            {
                get
                {
                    double total = 0;
                    this.Evaluations.ForEach(x => { total += x.Total; });
                    double indemnisation = 0;
                    this.Indemnisations.ForEach(x => { indemnisation += x.Montant; });
                    return (total - indemnisation);
                }
            }
        }

        public class Cagnote
        {
            public double Restant;
            public bool Indemnisation;
        }

        public class BonAchat
        {
            public string Code;
            public string Expiration;
            public string Date;
        }

        public static double VerifiePlafondIndemnisation(string dataSensInscriptionDirPath, string id, string hashkey)
        {
            string file = dataSensInscriptionDirPath + id + ".json";
            if (File.Exists(file))
            {
                InscriptionD insc = Serializer.Deserialize<InscriptionD>(file, hashkey);
                if (insc.IndemnisationMax < 0)
                {
                    throw new FaultException(new FaultReason("Votre compte a été bloqué. Vous ne pouvez pas continuer à évaluer des produits."), new FaultCode("Votre compte a été bloqué. Vous ne pouvez pas continuer à évaluer des produits."));
                }
                if (insc.IndemnisationMax < 10)
                {
                    throw new FaultException(new FaultReason("Le montant maximum autorisé pour l'indemnisation est atteint. Vous ne pouvez pas continuer à évaluer des produits."), new FaultCode("Le montant maximum autorisé pour l'indemnisation est atteint. Vous ne pouvez pas continuer à évaluer des produits."));
                }
            }
            else
            {
                throw new FaultException(new FaultReason("Code non trouvé."), new FaultCode("Code non trouvé."));
            }
            return 0;
        }

        public static int GetNbBonAchatCrocnoteurs(string dataSensInscriptionDirPath)
        {
            DirectoryInfo directory = new DirectoryInfo(dataSensInscriptionDirPath);
            FileInfo[] files = directory.GetFiles();
            return (files.Length);
        }

        public static BonAchat GetIndemnisation(string dataSensInscriptionDirPath, string encryptkey, string mail)
        {
            DirectoryInfo directory = new DirectoryInfo(dataSensInscriptionDirPath);
            FileInfo[] files = directory.GetFiles();

            if (files.Length > 0)
            {
                //if (files.Length < 100)
                //{
                //    MailHelper.SendMail2("crocnoteurs@inrae.fr", "ALERTE - bons d'achats", "Il reste moins de 100 bons cadeaux", "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");
                //}
                string file = files.ElementAt(0).FullName;

                BonAchat bon = Serializer.Deserialize<BonAchat>(file, encryptkey);

                File.Delete(file);

                return bon;
            }
            else
            {
                string txt = "<p>Bonjour,</p>";
                txt += "<p>Vos réponses, apportées dans le cadre de l'étude Croc'Noteurs conduite par la plateforme ChemoSens du CSGA ont bien été enregistrées.</p>";
                txt += "<p>Votre indemnisation sous forme de chèque-cadeau dématérialisé Cadhoc vous sera envoyée sous quelques jours par mail. Surveillez bien votre boîte de réception !</p>";
                txt += "<p>Merci pour votre participation à cette étude que nous vous encourageons à poursuivre en continuant à déguster des produits !</p>";
                txt += "<p>Bien cordialement,</p>";
                txt += "<p>L’équipe Croc'noteurs</p>";
                txt += "<p>Si vous avez des questions concernant l’obtention des chèques-cadeaux dans le cadre de l’étude Croc'noteurs, contactez la plateforme Chemosens à l’adresse : crocnoteurs@inrae.fr</p>";
                MailHelper.SendMail2(mail, "Etude Croc'noteurs  – votre indemnisation vous sera envoyée très prochainement", txt, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr", false, "crocnoteurs@inrae.fr");
                throw new FaultException(new FaultReason("Plus de bon de commande disponible – votre indemnisation vous sera envoyée très prochainement."), new FaultCode("Plus de bon de commande disponible"));
            }


        }

        public static string TelechargerCagnotteDataSens(string dataSensInscriptionDirPath, string id, string hashkey)
        {
            string file = dataSensInscriptionDirPath + id + ".json";
            if (File.Exists(file))
            {
                Cagnotte c = new Cagnotte();
                InscriptionD insc = Serializer.Deserialize<InscriptionD>(file, hashkey);
                c.Indemnisations = insc.Indemnisations;
                c.Evaluations = insc.Evaluations;
                c.Solde = insc.Cagnotte;
                return Serializer.SerializeToString(c);
            }
            throw new FaultException(new FaultReason("Code introuvable"), new FaultCode("Code introuvable"));
        }

        public static double AjouteACagnotteDataSens(string dataSensInscriptionDirPath, string dataSensIndemnisationPath, string id, string codebarre, string type, string designation, string hashkey)
        {

            string file = dataSensInscriptionDirPath + id + ".json";

            if (File.Exists(file))
            {

                InscriptionD insc = Serializer.Deserialize<InscriptionD>(file, hashkey);

                Evaluation eval = new Evaluation();
                eval.Date = DateTime.Now.ToString("dd/MM/yyyy");
                eval.DateD = DateTime.Now;
                eval.CodeBarre = codebarre;
                eval.Designation = designation;
                eval.Type = type;
                eval.Rang = (from x in insc.Evaluations where x.Type == type select x).Count() + 1;

                if (type == "cookie")
                {
                    eval.Montant = 3;
                }
                if (type == "pain de mie")
                {
                    eval.Montant = 2.5;
                }
                if (type == "pizza")
                {
                    eval.Montant = 4;
                }

                if (eval.Rang % 5 == 0)
                {
                    eval.Multiplicateur = 2;
                    eval.MultiplicateurTexte = "x2";
                }

                eval.Total = eval.Montant * eval.Multiplicateur;
                insc.Evaluations.Add(eval);

                var dates = from x in insc.Evaluations where x.DateD >= DateTime.Now.AddDays(-7) select x;
                if (dates.Count() > 4)
                {
                    string infos = "<p>" + insc.Code + " a évalué " + dates.Count() + " produits en 7 jours ou moins </p>";
                    //MailHelper.SendMail2("crocnoteurs@inrae.fr", "ALERTE - Plus de 5 produits évalués en moins de 7 jours", infos, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");
                }

                Serializer.Serialize(insc, file, hashkey);

                return insc.Cagnotte;
            }

            throw new FaultException(new FaultReason("ERREUR"), new FaultCode("ERREUR"));

            //return Serializer.SerializeToString(c);
        }

        public static string IndemnisationDataSens(string dataSensInscriptionDirPath, string dataSensIndemnisationPath, string id, string hashkey)
        {
            string file = dataSensInscriptionDirPath + id + ".json";

            if (File.Exists(file))
            {

                InscriptionD insc = Serializer.Deserialize<InscriptionD>(file, hashkey);

                string txt2 = "";
                if (insc.Cagnotte >= 10)
                {

                    BonAchat bon = GetIndemnisation(dataSensIndemnisationPath, hashkey, insc.Mail);



                    // Envoi du lien
                    Indemnisation ind = new Indemnisation();
                    //ind.Date = DateTime.Now.ToString("dd/MM/yyyy");
                    ind.Date = DateTime.Now;
                    ind.DateS = ind.Date.ToString("dd/MM/yyyy");
                    ind.Montant = 10;
                    ind.Code = bon.Code;
                    ind.Expiration = bon.Expiration;
                    insc.Indemnisations.Add(ind);
                    insc.IndemnisationMax -= 10;

                    string url = ConfigurationManager.AppSettings["DataSensURL"];

                    string txt = "<p style='color:red'>Nous vous remercions de bien vouloir accuser réception de ce mail.</p>";
                    txt += "<p>Bonjour,</p></p><p>Vos réponses, apportées dans le cadre de l'étude croc'noteurs conduite par la plateforme ChemoSens du CSGA, ont bien été enregistrées.</p>";
                    txt += "<p>Nous avons le plaisir de vous remettre votre indemnisation sous forme de chèque-cadeau dématérialisé Cadhoc.</p>";
                    txt += "<p>Pour utiliser votre chèque-cadeau, cliquez sur le lien ci-dessous et suivez les instructions :</p>";
                    txt += "<p style='font-weight:bold'>Lien d’activation du chèque-cadeau : <a href='" + ind.Code + "'>" + ind.Code + "</a></p>";
                    txt += "<p style='font-weight:bold'>Montant : 10 €</p>";
                    txt += "<p style='color:red;font-weight:bold'>Attention à bien tenir compte de la date d’expiration de ce chèque-cadeau. Une fois cette date dépassée, le chèque-cadeau n’est plus valable.</p>";

                    //ICI
                    //txt += "<p>Merci pour votre participation à cette étude que nous vous encourageons à poursuivre en continuant à déguster des produits !</p>";
                    txt += "<p>Merci pour votre participation à cette étude.</p>";
                    //txt += "<p>Nous vous rappelons que Croc'noteurs fait une pause, mais vous pouvez continuer à nous suivre sur les réseaux sociaux pour savoir quand l'étude reprendra.</p>";

                    //txt += "<p style='color:red;font-weight:bold'>Rappel : le montant total des indemnisations est plafonné. Votre plafond d'indemnisation est de " + insc.IndemnisationMax +" €</p>";

                    txt += "<p></p><p>Bien cordialement,</p><p></p><p>L’équipe croc'noteurs</p><p></p>";

                    //txt += "<p>(1) Pour savoir comment utiliser votre bon d'achat, rendez-vous sur le site : <a href=\"https://boutiques.cheque-cadhoc.fr/\">cadhoc.fr</a>.</p>";
                    txt += "<p>Si vous avez des questions concernant l’obtention des chèques-cadeaux dans le cadre de l’étude croc'noteurs, contactez la plateforme Chemosens à l’adresse : crocnoteurs@inrae.fr</p>";
                    //txt += "<p>Le prestataire Cadhoc n’est ni à l’origine ni responsable de cette promotion. Les chèques-cadeaux Cadhoc pourront être utilisés dans les boutiques affiliées (cf https://boutiques.cheque-cadhoc.fr). Les chèques-cadeaux ne peuvent être enregistrés plusieurs fois, revendus, cédés pour contrepartie onéreuse, échangés contre des espèces ou appliqués à un autre compte. Le prestataire Cadhoc n’est pas responsable des vols, pertes, destructions ou utilisations sans autorisation des chèques-cadeaux.</p>";

                    txt2 += ind.Code;


                    MailHelper.SendMail2(insc.Mail, "Etude croc'noteurs  – votre indemnisation", txt, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr", false, "crocnoteurs@inrae.fr");
                    string infos = "<p>" + insc.Code + " : " + ind.Code + "</p>";
                    MailHelper.SendMail2("crocnoteurs@inrae.fr", "Nouvelle indemnisation croc'noteurs", infos, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");
                }

                //ICI
                //insc.IndemnisationMax = 0;
                Serializer.Serialize(insc, file, hashkey);

                return txt2;
            }

            throw new FaultException(new FaultReason("ERREUR"), new FaultCode("ERREUR"));

            //return Serializer.SerializeToString(c);
        }

        public static void AjouteCodeBarre(string dataSensBarcodesDirPath, string code, string famille, string designation, string encryptKey)
        {
            string file = dataSensBarcodesDirPath + "//" + code + ".json";

            CodeBarre cb = new CodeBarre();
            cb.EAN = code;
            cb.Type = famille;
            cb.Designation = designation;
            cb.Valide = "Non vérifié";

            Serializer.Serialize(cb, file, encryptKey);

            string infos = "<p>Nouveau code barre</p>";
            infos += "<p>EAN : " + cb.EAN + "</p>";
            infos += "<p>Désignation : " + cb.Designation + "</p>";
            infos += "<p>Type : " + cb.Type + "</p>";

            MailHelper.SendMail2("crocnoteurs@inrae.fr", "Nouveau code barre", infos, "crocnoteurs@inrae.fr", "crocnoteurs@inrae.fr");

        }

        public static void TeleverseImageDataSens(string base64string, string filename)
        {
            try
            {
                var base64Data = Regex.Match(base64string, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
                byte[] blob = Convert.FromBase64String(base64Data);

                if (File.Exists(filename))
                {
                    string file = filename.Replace(".png", "") + "_" + DateTime.Now.ToString("yyyyMMdd") + ".png";
                    File.Copy(filename, file);
                }

                File.WriteAllBytes(filename, blob);                
            }
            catch (Exception ex)
            {                
                throw new FaultException(new FaultReason("UPLOAD_BLOB_FAILURE"), new FaultCode("UPLOAD_BLOB_FAILURE"));
            }
        }

        public static int TeleverserBonAchatCrocnoteurs(string indemnisationsDirPath, string binaries, string encryptKey)
        {
            //byte[] bytes = Org.BouncyCastle.Utilities.Encoders.Base64.Decode(binaries.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            byte[] bytes = Convert.FromBase64String(binaries.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            MemoryStream stream = new MemoryStream(bytes);
            ExcelPackage xlPackage = new ExcelPackage(stream);

            // Onglet avec références
            var myWorksheet = xlPackage.Workbook.Worksheets.ElementAt(0);
            var totalRows = myWorksheet.Dimension.End.Row;
            for (int rowNum = 2; rowNum <= totalRows; rowNum++)
            {
                BonAchat bon = new BonAchat();
                bon.Code = (myWorksheet.Cells[rowNum, 1].Value ?? string.Empty).ToString();
                bon.Date = DateTime.Now.ToString("dd/MM/yyyy");
                //bon.Expiration = (myWorksheet.Cells[rowNum, 2].Value ?? string.Empty).ToString();
                string file = indemnisationsDirPath + "//" + DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + DateTime.Now.Hour + DateTime.Now.Minute + DateTime.Now.Second + rowNum + ".json";
                Serializer.Serialize(bon, file, encryptKey);
            }
            return GetNbBonAchatCrocnoteurs(indemnisationsDirPath);
        }

        public static void UpdateProduitsCrocnoteurs(string dataSensBarcodesDirPath, string hashKey, string list)
        {
            List<CodeBarre> List = Serializer.DeserializeFromString<List<CodeBarre>>(list, hashKey);
            foreach (CodeBarre cb in List)
            {
                string file = dataSensBarcodesDirPath + "//" + cb.EAN + ".json";
                Serializer.Serialize(cb, file, hashKey);
            }
        }

        public static void UpdateParticipantsCrocnoteurs(string inscriptionDirPath, string hashKey, string list)
        {
            List<InscriptionD> List = Serializer.DeserializeFromString<List<InscriptionD>>(list, hashKey);
            foreach (InscriptionD cb in List)
            {
                string file = inscriptionDirPath + "//" + cb.Code + ".json";
                InscriptionD ins = Serializer.Deserialize<InscriptionD>(file, hashKey);
                ins.IndemnisationMax = cb.IndemnisationMax;
                //ins.Panel = cb.Panel;
                Serializer.Serialize(ins, file, hashKey);
            }
        }

        public static byte[] DownloadImages(string imgDirPath)
        {
            Stream stream = ZipHelper.ZipToMemoryStream(Directory.EnumerateFiles(imgDirPath + "//compositions").Union(Directory.EnumerateFiles(imgDirPath + "//emballages")).Union(Directory.EnumerateFiles(imgDirPath + "//ingredients")), "");

            var bytes = new byte[stream.Length];
            stream.Seek(0, SeekOrigin.Begin);
            stream.ReadAsync(bytes, 0, bytes.Length);
            stream.Dispose();
            return bytes;

        }

        public static byte[] DownloadQuestionnaire(string questionnaireDirPath, string produitDirPath, string bonsDirPath, string inscriptionDirPath, string imgDirPath, string hashKey)
        {
            try
            {
                byte[] res = null;

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                //Classifier classifier = new Classifier(ConfigurationManager.AppSettings["LexiconFilePath"], "", false);

                using (ExcelPackage xlPackage = new ExcelPackage())
                {
                    var subjectSheet = xlPackage.Workbook.Worksheets.Add("Sujets");
                    int indexSubject = 2;

                    subjectSheet.Cells[1, 1].Value = "CodeSujet_CrocNoteurs";
                    subjectSheet.Cells[1, 2].Value = "Valide";
                    subjectSheet.Cells[1, 3].Value = "DateInscription";

                    subjectSheet.Cells[1, 4].Value = "TestNavigateur";
                    subjectSheet.Cells[1, 5].Value = "TexteConditions";
                    subjectSheet.Cells[1, 6].Value = "AccepteConditions";
                    subjectSheet.Cells[1, 7].Value = "Pizzabon";
                    subjectSheet.Cells[1, 8].Value = "Stromboli";
                    subjectSheet.Cells[1, 9].Value = "Cookicroc";
                    subjectSheet.Cells[1, 10].Value = "TanteAdele";
                    subjectSheet.Cells[1, 11].Value = "Toastinou";
                    subjectSheet.Cells[1, 12].Value = "MamieDouce";

                    subjectSheet.Cells[1, 13].Value = "DeclareEtreMajeur";
                    subjectSheet.Cells[1, 14].Value = "ConsentementTraitementAutomatisé";
                    subjectSheet.Cells[1, 15].Value = "ConsentementPanelsens";
                    subjectSheet.Cells[1, 16].Value = "ConsentementCadhoc";

                    subjectSheet.Cells[1, 17].Value = "Mail";
                    subjectSheet.Cells[1, 18].Value = "Nom";
                    subjectSheet.Cells[1, 19].Value = "Prenom";
                    subjectSheet.Cells[1, 20].Value = "DateNaissance";
                    subjectSheet.Cells[1, 21].Value = "Genre";                    
                    subjectSheet.Cells[1, 22].Value = "CP";
                    subjectSheet.Cells[1, 23].Value = "Ville";
                    subjectSheet.Cells[1, 24].Value = "Adresse";
                    //subjectSheet.Cells[1, 24].Value = "Telephone";
                    subjectSheet.Cells[1, 25].Value = "ActivitePro";
                    subjectSheet.Cells[1, 26].Value = "Diplome";

                    subjectSheet.Cells[1, 27].Value = "Freq_Conso_Pizzas";
                    subjectSheet.Cells[1, 28].Value = "Freq_Conso_Cookies";
                    subjectSheet.Cells[1, 29].Value = "Freq_Conso_PainMie";
                    subjectSheet.Cells[1, 30].Value = "Important_Aliments_Sains";
                    subjectSheet.Cells[1, 31].Value = "Important_Aliments_Humeur";
                    subjectSheet.Cells[1, 32].Value = "Important_Aliments_Pratiques";
                    subjectSheet.Cells[1, 33].Value = "Important_Aliments_Agreables";
                    subjectSheet.Cells[1, 34].Value = "Important_Aliments_Naturels";
                    subjectSheet.Cells[1, 35].Value = "Important_Aliments_Abordables";
                    subjectSheet.Cells[1, 36].Value = "Important_Aliments_Poids";
                    subjectSheet.Cells[1, 37].Value = "Important_Aliments_Familiers";
                    subjectSheet.Cells[1, 38].Value = "Important_Aliments_Environnement";
                    subjectSheet.Cells[1, 39].Value = "Important_Aliments_Equitables";
                    subjectSheet.Cells[1, 40].Value = "Important_Aliments_Respect_Animaux";

                    subjectSheet.Cells[1, 41].Value = "Nb_Pizza";
                    subjectSheet.Cells[1, 42].Value = "Nb_Cookies";
                    subjectSheet.Cells[1, 43].Value = "Nb_PainMie";

                    subjectSheet.Cells[1, 44].Value = "NbTests";
                    subjectSheet.Cells[1, 45].Value = "NbMauvaisesReponses";
                    //subjectSheet.Cells[1, 61].Value = "Duree_Moyenne_Evaluation_Secondes";

                    subjectSheet.Cells[1, 46].Value = "Indemnisation_Max";                    
                    subjectSheet.Cells[1, 47].Value = "Indemnisation_MontantTotal";
                    
                    subjectSheet.Cells[1, 48].Value = "Date_Derniere_Evaluation";                   
                    //subjectSheet.Cells[1, 64].Value = "CodesIndemnisations";

                    var evaluationProduitSheet = xlPackage.Workbook.Worksheets.Add("Evaluations_Produits");
                    int indexEvaluationProduit = 2;
                    evaluationProduitSheet.Cells[1, 1].Value = "CodeSujet_CrocNoteurs";
                    evaluationProduitSheet.Cells[1, 2].Value = "Code_Barres";
                    evaluationProduitSheet.Cells[1, 3].Value = "Date_Debut";
                    evaluationProduitSheet.Cells[1, 4].Value = "Date_Fin";
                    evaluationProduitSheet.Cells[1, 5].Value = "Designation";
                    evaluationProduitSheet.Cells[1, 6].Value = "Type_Produit";
                    evaluationProduitSheet.Cells[1, 7].Value = "Deja_Goute";
                    evaluationProduitSheet.Cells[1, 8].Value = "Attente_Liking";
                    evaluationProduitSheet.Cells[1, 9].Value = "Liking";
                    evaluationProduitSheet.Cells[1, 10].Value = "Apparence";
                    evaluationProduitSheet.Cells[1, 11].Value = "Texture";
                    evaluationProduitSheet.Cells[1, 12].Value = "Gout";
                    evaluationProduitSheet.Cells[1, 13].Value = "AimeApparence";
                    evaluationProduitSheet.Cells[1, 14].Value = "AimeTexture";
                    evaluationProduitSheet.Cells[1, 15].Value = "AimeGout";
                    evaluationProduitSheet.Cells[1, 16].Value = "JAR_Sucre";
                    evaluationProduitSheet.Cells[1, 17].Value = "JAR_Gras";
                    evaluationProduitSheet.Cells[1, 18].Value = "JAR_Sel";
                    evaluationProduitSheet.Cells[1, 19].Value = "Rachat";
                    evaluationProduitSheet.Cells[1, 20].Value = "Rang";
                    evaluationProduitSheet.Cells[1, 21].Value = "Montant";
                    evaluationProduitSheet.Cells[1, 22].Value = "Multiplicateur";
                    evaluationProduitSheet.Cells[1, 23].Value = "Total";
                    evaluationProduitSheet.Cells[1, 24].Value = "Photo_Paquet_Ouvert";

                    //evaluationProduitSheet.Cells[1, 25].Value = "Apparence_MotsCles";
                    //evaluationProduitSheet.Cells[1, 26].Value = "Texture_MotsCles";
                    //evaluationProduitSheet.Cells[1, 27].Value = "Gout_MotsCles";


                    var produitIdealSheet = xlPackage.Workbook.Worksheets.Add("Evaluations_Produits_Ideaux");
                    int indexProduitIdeal = 2;
                    produitIdealSheet.Cells[1, 1].Value = "CodeSujet_CrocNoteurs";
                    produitIdealSheet.Cells[1, 2].Value = "Type_Produit";
                    produitIdealSheet.Cells[1, 3].Value = "Apparence_Ideale";
                    produitIdealSheet.Cells[1, 4].Value = "Gout_Ideal";
                    produitIdealSheet.Cells[1, 5].Value = "Texture_Ideal";
                    produitIdealSheet.Cells[1, 6].Value = "Date_Debut";
                    produitIdealSheet.Cells[1, 7].Value = "Date_Fin";

                    //var produitSheet = xlPackage.Workbook.Worksheets.Add("Produits");
                    //int indexProduit = 2;
                    //produitSheet.Cells[1, 1].Value = "Code_Barres";
                    //produitSheet.Cells[1, 2].Value = "Type_Produit";
                    //produitSheet.Cells[1, 3].Value = "Designation";
                    //produitSheet.Cells[1, 4].Value = "Valide";
                    //produitSheet.Cells[1, 5].Value = "Nb_Eval";
                    //produitSheet.Cells[1, 6].Value = "Catégorie";

                    //var connexionSheet = xlPackage.Workbook.Worksheets.Add("Connexions");
                    //int indexConnexion = 2;
                    //connexionSheet.Cells[1, 1].Value = "CodeSujet_CrocNoteurs";
                    //connexionSheet.Cells[1, 2].Value = "Date";

                    var bonSheet = xlPackage.Workbook.Worksheets.Add("BonsAchatUtilises");
                    //int indexBon = 2;
                    bonSheet.Cells[1, 1].Value = "CodeSujet_CrocNoteurs";
                    bonSheet.Cells[1, 2].Value = "Dates";
                    bonSheet.Cells[1, 3].Value = "Code";
                    bonSheet.Cells[1, 4].Value = "MontantCode";
                    bonSheet.Cells[1, 5].Value = "AccuseReception";
                    //bonSheet.Cells[1, 5].Value = "Expiration";

                    var bonSheet2 = xlPackage.Workbook.Worksheets.Add("BonsAchatDisponibles");
                    int indexBon2 = 2;
                    bonSheet2.Cells[1, 2].Value = "Code";
                    bonSheet2.Cells[1, 1].Value = "Date de téléversement";

                    List<QuestionnaireSensas> ListQuestionnaires = new List<QuestionnaireSensas>();
                    List<InscriptionD> ListInscriptions = new List<InscriptionD>();
                    List<CodeBarre> ListCodeBarres = new List<CodeBarre>();
                    List<BonAchat> ListBonsAchat = new List<BonAchat>();

                    Dictionary<string, int> ListProduits = new Dictionary<string, int>();

                    foreach (string f in Directory.EnumerateFiles(questionnaireDirPath))
                    {
                        string json = Questionnaire.Questionnaire.Read(f, hashKey);

                        try
                        {
                            QuestionnaireSensas inscription = Serializer.DeserializeFromString<QuestionnaireSensas>(json);
                            if (inscription.Code == "")
                            {
                                inscription.Code = Path.GetFileNameWithoutExtension(f);
                            }

                            ListQuestionnaires.Add(inscription);
                        }
                        catch (Exception ex)
                        {
                            string s = "";
                        }
                    }

                    //foreach (string f in Directory.EnumerateFiles(produitDirPath))
                    //{
                    //    string json = Questionnaire.Questionnaire.Read(f, hashKey);

                    //    CodeBarre cb = JsonConvert.DeserializeObject<CodeBarre>(json);
                    //    ListCodeBarres.Add(cb);
                    //}

                    foreach (string f in Directory.EnumerateFiles(bonsDirPath))
                    {
                        try
                        {
                            string json = Questionnaire.Questionnaire.Read(f, hashKey);
                            BonAchat cb = JsonConvert.DeserializeObject<BonAchat>(json);
                            ListBonsAchat.Add(cb);
                            bonSheet2.Cells[indexBon2, EPPlusHelper.GetColumnByName(bonSheet2, "Code")].Value = "/XXXXX-XX" + cb.Code.Substring(cb.Code.Length - 3);
                            bonSheet2.Cells[indexBon2, EPPlusHelper.GetColumnByName(bonSheet2, "Date de téléversement")].Value = cb.Date;
                        }
                        catch
                        { }
                        indexBon2++;
                    }

                    foreach (string f in Directory.EnumerateFiles(inscriptionDirPath))
                    {
                        string json = Questionnaire.Questionnaire.Read(f, hashKey);
                        InscriptionD ins = JsonConvert.DeserializeObject<InscriptionD>(json);
                        ListInscriptions.Add(ins);
                    }

                    //foreach (QuestionnaireSensas q in ListQuestionnaires)
                    foreach(InscriptionD ins in ListInscriptions)
                    {
                        //List<InscriptionD> inscriptions = (from x in ListInscriptions
                        //                                   where x.Code == q.Code
                        //                                   select x).ToList();

                        List<QuestionnaireSensas> inscriptions = (from x in ListQuestionnaires
                                                                  where x.Code == ins.Code
                                                           select x).ToList();

                        try
                        {
                            //InscriptionD ins = inscriptions.ElementAt(0);

                            if (ins.DateInscription != null)
                            {
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "DateInscription")].Value = ins.DateInscription.ToString("dd/MM/yyyy HH:mm:ss");
                            }

                            if (inscriptions.Count > 0)
                            {
                                QuestionnaireSensas q = inscriptions.ElementAt(0);

                                if (q.ListIndemnisations != null && q.ListIndemnisations.Count > 0)
                                {
                                    bonSheet.Cells[indexSubject, 5].Value = String.Join(",", q.ListIndemnisations);
                                }


                                

                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Indemnisation_Max")].Value = ins.IndemnisationMax;

                                if (q.EvaluationProduit != null)
                                {
                                    subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Nb_Pizza")].Value = q.EvaluationProduit.Where(x => x.Produit.Type == "pizza" && x.EvaluationTerminee == true).Count();
                                    subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Nb_Cookies")].Value = q.EvaluationProduit.Where(x => x.Produit.Type == "cookie" && x.EvaluationTerminee == true).Count();
                                    subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Nb_PainMie")].Value = q.EvaluationProduit.Where(x => x.Produit.Type == "pain de mie" && x.EvaluationTerminee == true).Count();
                                }
                                double total = 0;
                                ins.Evaluations.ForEach(x => total += x.Total);

                                try
                                {
                                    subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "NbTests")].Value = q.NbEval;
                                    if (q.DatesMauvaisesReponses != null)
                                    {
                                        subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "NbMauvaisesReponses")].Value = q.DatesMauvaisesReponses.Count();
                                    }
                                }
                                catch (Exception ex)
                                { }

                                

                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Sains")].Value = Questionnaire.Questionnaire.Convert(ins.Healthy);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Humeur")].Value = Questionnaire.Questionnaire.Convert(ins.MoodMonitoring);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Pratiques")].Value = Questionnaire.Questionnaire.Convert(ins.Convenient);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Agreables")].Value = Questionnaire.Questionnaire.Convert(ins.Pleasure);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Naturels")].Value = Questionnaire.Questionnaire.Convert(ins.Natural);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Abordables")].Value = Questionnaire.Questionnaire.Convert(ins.Affordable);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Poids")].Value = Questionnaire.Questionnaire.Convert(ins.WeightControl);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Familiers")].Value = Questionnaire.Questionnaire.Convert(ins.Familiar);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Environnement")].Value = Questionnaire.Questionnaire.Convert(ins.EnvironmentalFriendly);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Equitables")].Value = Questionnaire.Questionnaire.Convert(ins.FairlyTrade);
                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Important_Aliments_Respect_Animaux")].Value = Questionnaire.Questionnaire.Convert(ins.AnimalFriendly);

                                subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Indemnisation_MontantTotal")].Value = total;
                                
                                if (q.EvaluationProduit != null)
                                {
                                    try
                                    {
                                        var lastEvalDate = (from x in q.EvaluationProduit select x.DateFin).Max();
                                        //var moy = (from x in q.EvaluationProduit where x.DateFin.Year > 2000 && x.DateDebut.Year > 2000 select (x.DateFin - x.DateDebut).TotalSeconds).Average();
                                        subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Date_Derniere_Evaluation")].Value = lastEvalDate.ToString("dd/MM/yyyy");
                                        //subjectSheet.Cells[indexSubject, 61].Value = moy;
                                    }
                                    catch
                                    { }
                                    
                                    foreach (EvaluationProduit e in q.EvaluationProduit)
                                    {
                                        List<Evaluation> evals = (from x in ins.Evaluations
                                                                  where x.CodeBarre == e.Produit.CodeBarre
                                                                  select x).ToList();


                                        evaluationProduitSheet.Cells[indexEvaluationProduit, 1].Value = q.Code;
                                        evaluationProduitSheet.Cells[indexEvaluationProduit, 2].Value = e.Produit.CodeBarre;
                                        evaluationProduitSheet.Cells[indexEvaluationProduit, 3].Value = e.DateDebut.ToString();
                                        evaluationProduitSheet.Cells[indexEvaluationProduit, 4].Value = e.DateFin.ToString();
                                        evaluationProduitSheet.Cells[indexEvaluationProduit, 5].Value = e.Produit.Designation;
                                        evaluationProduitSheet.Cells[indexEvaluationProduit, 6].Value = e.Produit.Type;
                                        evaluationProduitSheet.Cells[indexEvaluationProduit, 7].Value = e.DejaGoute;
                                        if (e.DejaGoute!="")
                                        {
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 8].Value = Questionnaire.Questionnaire.ConvertD(e.ExpectedLiking);
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 9].Value = Questionnaire.Questionnaire.ConvertD(e.StatedLiking);
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 10].Value = e.DescriptionApparence;
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 11].Value = e.DescriptionTexture;
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 12].Value = e.DescriptionGout;
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 13].Value = e.AimeApparence;
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 14].Value = e.AimeTexture;
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 15].Value = e.AimeGout;
                                            if (e.Produit.Type == "pain de mie" || e.Produit.Type == "cookie")
                                            {
                                                evaluationProduitSheet.Cells[indexEvaluationProduit, 16].Value = Questionnaire.Questionnaire.ConvertD(e.JARSucre);
                                            }
                                            if (e.Produit.Type == "pizza" || e.Produit.Type == "cookie")
                                            {
                                                evaluationProduitSheet.Cells[indexEvaluationProduit, 17].Value = Questionnaire.Questionnaire.ConvertD(e.JARGras);
                                            }
                                            if (e.Produit.Type == "pizza" || e.Produit.Type == "pain de mie")
                                            {
                                                evaluationProduitSheet.Cells[indexEvaluationProduit, 18].Value = Questionnaire.Questionnaire.ConvertD(e.JARSale);
                                            }
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 19].Value = e.IntentionReachat;
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 24].Value = "Cliquer pour télécharger";
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 24].Hyperlink = new Uri(ConfigurationManager.AppSettings["BaseURL"] + "webservice.svc/Download?id=feZj524Az&token=01azdad4&path=" + System.Web.HttpUtility.UrlEncode(q.Code) + "_" + e.Produit.CodeBarre);
                                        }
                                        

                                        if (evals.Count > 0)
                                        {
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 20].Value = evals.ElementAt(0).Rang;
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 21].Value = evals.ElementAt(0).Montant;
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 22].Value = evals.ElementAt(0).Multiplicateur;
                                            evaluationProduitSheet.Cells[indexEvaluationProduit, 23].Value = evals.ElementAt(0).Total;

                                            int nb = (from x in ListProduits
                                                      where x.Key == e.Produit.CodeBarre
                                                      select x).Count();
                                            if (nb == 0)
                                            {
                                                ListProduits.Add(e.Produit.CodeBarre, 0);
                                            }

                                            ListProduits[e.Produit.CodeBarre] += 1;


                                        }

                                        //try
                                        //{
                                        //    evaluationProduitSheet.Cells[indexEvaluationProduit, 25].Value = fcLexicon.csModels.fcLexicon.GetSensoryWords2(classifier, e.DescriptionApparence);
                                        //    evaluationProduitSheet.Cells[indexEvaluationProduit, 26].Value = fcLexicon.csModels.fcLexicon.GetSensoryWords2(classifier, e.DescriptionTexture);
                                        //    evaluationProduitSheet.Cells[indexEvaluationProduit, 27].Value = fcLexicon.csModels.fcLexicon.GetSensoryWords2(classifier, e.DescriptionGout);
                                        //}
                                        //catch (Exception ex)
                                        //{
                                        //    File.WriteAllText("E://data//log.txt", ex.Message);
                                        //}

                                        indexEvaluationProduit++;
                                    }
                                }

                                if (q.ListeProduitIdeal != null)
                                {
                                    foreach (ProduitIdeal p in q.ListeProduitIdeal)
                                    {
                                        produitIdealSheet.Cells[indexProduitIdeal, 1].Value = ins.Code;
                                        produitIdealSheet.Cells[indexProduitIdeal, 2].Value = p.Type;
                                        produitIdealSheet.Cells[indexProduitIdeal, 3].Value = p.DescriptionApparence;
                                        produitIdealSheet.Cells[indexProduitIdeal, 4].Value = p.DescriptionGout;
                                        produitIdealSheet.Cells[indexProduitIdeal, 5].Value = p.DescriptionTexture;
                                        produitIdealSheet.Cells[indexProduitIdeal, 6].Value = p.DateDebut.ToString();
                                        produitIdealSheet.Cells[indexProduitIdeal, 7].Value = p.DateFin.ToString();
                                        indexProduitIdeal++;
                                    }
                                }

                            }

                            
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "CodeSujet_CrocNoteurs")].Value = ins.Code;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Valide")].Value = ins.Valide==true?1:0;                                                      
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "TestNavigateur")].Value = Questionnaire.Questionnaire.Convert(ins.TestNavigateur);
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "TexteConditions")].Value = ins.TexteConditions;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "AccepteConditions")].Value = Questionnaire.Questionnaire.Convert(ins.AccepteConditions);
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Pizzabon")].Value = Questionnaire.Questionnaire.Convert(ins.Pizzabon);
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Stromboli")].Value = Questionnaire.Questionnaire.Convert(ins.Stromboli);
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Cookicroc")].Value = Questionnaire.Questionnaire.Convert(ins.Cookicroc);
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "TanteAdele")].Value = Questionnaire.Questionnaire.Convert(ins.TanteAdele);
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Toastinou")].Value = Questionnaire.Questionnaire.Convert(ins.Toastinou);
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "MamieDouce")].Value = Questionnaire.Questionnaire.Convert(ins.MamieDouce);
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "DeclareEtreMajeur")].Value = 1;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "ConsentementTraitementAutomatisé")].Value = 1;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "ConsentementPanelsens")].Value = 1;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "ConsentementCadhoc")].Value = 1;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Mail")].Value = ins.Mail;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Nom")].Value = ins.Nom;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Prenom")].Value = ins.Prenom;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "DateNaissance")].Value = ins.DateNaissance.ToString("dd/MM/yyyy");
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Genre")].Value = ins.Genre;                            
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "CP")].Value = ins.CP;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Ville")].Value = ins.Ville;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Adresse")].Value = ins.Adresse;                                                       
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "ActivitePro")].Value = ins.CSP;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Diplome")].Value = ins.NiveauEtudes;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Freq_Conso_Pizzas")].Value = ins.FreqConsoPizza;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Freq_Conso_Cookies")].Value = ins.FreqConsoCookie;
                            subjectSheet.Cells[indexSubject, EPPlusHelper.GetColumnByName(subjectSheet, "Freq_Conso_PainMie")].Value = ins.FreqConsoPainMie;




                            //subjectSheet.Cells[1, 61].Value = "Duree_Moyenne_Evaluation_Secondes";






                            //subjectSheet.Cells[indexSubject, 15].Value = Questionnaire.Questionnaire.ConvertB(ins.InscriptionPanelSens);                                                                                                                
                            //subjectSheet.Cells[indexSubject, 64].Value = String.Join(",", q.ListIndemnisations);



                           


                            bonSheet.Cells[indexSubject, 1].Value = ins.Code;
                            List<string> l1 = new List<string>();
                            List<string> l2 = new List<string>();                            
                            double totalg = 0;
                            foreach (Indemnisation ind in ins.Indemnisations)
                            {
                                l1.Add(ind.Date.ToString("dd/MM/yyyy"));
                                l2.Add("/XXXXX-XX" + ind.Code.Substring(ind.Code.Length - 3));                                
                                totalg += ind.Montant;
                            }

                            bonSheet.Cells[indexSubject, 2].Value = String.Join(", ", l1);
                            bonSheet.Cells[indexSubject, 3].Value = String.Join(", ", l2);
                            bonSheet.Cells[indexSubject, 4].Value = totalg;
                            //indexBon++;

                            //foreach (Indemnisation ind in ins.Indemnisations)
                            //{
                            //    bonSheet.Cells[indexBon, 1].Value = q.Code;
                            //    bonSheet.Cells[indexBon, 2].Value = ind.Date.ToString();
                            //    bonSheet.Cells[indexBon, 3].Value = ind.Montant;
                            //    bonSheet.Cells[indexBon, 4].Value = ind.Code;
                            //    //bonSheet.Cells[indexBon, 5].Value = ind.Expiration;
                            //    indexBon++;
                            //}

                            //var groups = ins.Indemnisations.GroupBy(x => x.Code)
                            //  .Select(g => new { Dates = String.Join(",", g.Select(s => s.Date.ToString("dd/MM/yyyy"))), Codes = String.Join(",", g.Select(s => s.Code.Substring(0, 5))), Total = g.Sum(s => s.Montant) })
                            //  .ToList().OrderBy(x => x.Dates);

                            //foreach (var group in groups)
                            //{
                            //    bonSheet.Cells[indexBon, 1].Value = q.Code;
                            //    bonSheet.Cells[indexBon, 2].Value = group.Dates;
                            //    bonSheet.Cells[indexBon, 3].Value = group.Total;
                            //    bonSheet.Cells[indexBon, 4].Value = group.Codes;
                            //    //bonSheet.Cells[indexBon, 5].Value = ind.Expiration;
                            //    indexBon++;
                            //}


                            //foreach (FoodChoice fc in q.ListeFoodChoice)
                            //{
                            //    if (fc.Type == "pizza")
                            //    {
                            //subjectSheet.Cells[indexSubject, 17].Value = Questionnaire.Questionnaire.Convert(q.Healthy);
                            //subjectSheet.Cells[indexSubject, 18].Value = Questionnaire.Questionnaire.Convert(q.MoodMonitoring);
                            //subjectSheet.Cells[indexSubject, 19].Value = Questionnaire.Questionnaire.Convert(q.Convenient);
                            //subjectSheet.Cells[indexSubject, 20].Value = Questionnaire.Questionnaire.Convert(q.Pleasure);
                            //subjectSheet.Cells[indexSubject, 21].Value = Questionnaire.Questionnaire.Convert(q.Natural);
                            //subjectSheet.Cells[indexSubject, 22].Value = Questionnaire.Questionnaire.Convert(q.Affordable);
                            //subjectSheet.Cells[indexSubject, 23].Value = Questionnaire.Questionnaire.Convert(q.WeightControl);
                            //subjectSheet.Cells[indexSubject, 24].Value = Questionnaire.Questionnaire.Convert(q.Familiar);
                            //subjectSheet.Cells[indexSubject, 25].Value = Questionnaire.Questionnaire.Convert(q.EnvironmentalFriendly);
                            //subjectSheet.Cells[indexSubject, 26].Value = Questionnaire.Questionnaire.Convert(q.FairlyTrade);
                            //subjectSheet.Cells[indexSubject, 27].Value = Questionnaire.Questionnaire.Convert(q.AnimalFriendly);
                            //}

                            //if (fc.Type == "cookie")
                            //{
                            //    subjectSheet.Cells[indexSubject, 29].Value = Questionnaire.Questionnaire.Convert(fc.Healthy);
                            //    subjectSheet.Cells[indexSubject, 30].Value = Questionnaire.Questionnaire.Convert(fc.MoodMonitoring);
                            //    subjectSheet.Cells[indexSubject, 31].Value = Questionnaire.Questionnaire.Convert(fc.Convenient);
                            //    subjectSheet.Cells[indexSubject, 32].Value = Questionnaire.Questionnaire.Convert(fc.Pleasure);
                            //    subjectSheet.Cells[indexSubject, 33].Value = Questionnaire.Questionnaire.Convert(fc.Natural);
                            //    subjectSheet.Cells[indexSubject, 34].Value = Questionnaire.Questionnaire.Convert(fc.Affordable);
                            //    subjectSheet.Cells[indexSubject, 35].Value = Questionnaire.Questionnaire.Convert(fc.WeightControl);
                            //    subjectSheet.Cells[indexSubject, 36].Value = Questionnaire.Questionnaire.Convert(fc.Familiar);
                            //    subjectSheet.Cells[indexSubject, 37].Value = Questionnaire.Questionnaire.Convert(fc.EnvironmentalFriendly);
                            //    subjectSheet.Cells[indexSubject, 38].Value = Questionnaire.Questionnaire.Convert(fc.FairlyTrade);
                            //    subjectSheet.Cells[indexSubject, 39].Value = Questionnaire.Questionnaire.Convert(fc.AnimalFriendly);
                            //}

                            //if (fc.Type == "pain de mie")
                            //{
                            //    subjectSheet.Cells[indexSubject, 41].Value = Questionnaire.Questionnaire.Convert(fc.Healthy);
                            //    subjectSheet.Cells[indexSubject, 42].Value = Questionnaire.Questionnaire.Convert(fc.MoodMonitoring);
                            //    subjectSheet.Cells[indexSubject, 43].Value = Questionnaire.Questionnaire.Convert(fc.Convenient);
                            //    subjectSheet.Cells[indexSubject, 44].Value = Questionnaire.Questionnaire.Convert(fc.Pleasure);
                            //    subjectSheet.Cells[indexSubject, 45].Value = Questionnaire.Questionnaire.Convert(fc.Natural);
                            //    subjectSheet.Cells[indexSubject, 46].Value = Questionnaire.Questionnaire.Convert(fc.Affordable);
                            //    subjectSheet.Cells[indexSubject, 47].Value = Questionnaire.Questionnaire.Convert(fc.WeightControl);
                            //    subjectSheet.Cells[indexSubject, 48].Value = Questionnaire.Questionnaire.Convert(fc.Familiar);
                            //    subjectSheet.Cells[indexSubject, 49].Value = Questionnaire.Questionnaire.Convert(fc.EnvironmentalFriendly);
                            //    subjectSheet.Cells[indexSubject, 50].Value = Questionnaire.Questionnaire.Convert(fc.FairlyTrade);
                            //    subjectSheet.Cells[indexSubject, 51].Value = Questionnaire.Questionnaire.Convert(fc.AnimalFriendly);
                            //}


                            //}

                            

                            //if (q.DatesAcces != null)
                            //{
                            //    foreach (DateTime d in q.DatesAcces)
                            //    {
                            //        connexionSheet.Cells[indexConnexion, 1].Value = ins.Code;
                            //        connexionSheet.Cells[indexConnexion, 2].Value = d.ToString();
                            //        indexConnexion++;

                            //    }
                            //}

                            indexSubject++;

                        }
                        catch (Exception ex)
                        {
                            string ss = ex.Message;
                        }

                        //foreach (CodeBarre cb in ListCodeBarres)
                        //{
                        //    if (cb.EAN != null && cb.EAN != "")
                        //    {
                        //        produitSheet.Cells[indexProduit, 1].Value = cb.EAN;
                        //        produitSheet.Cells[indexProduit, 2].Value = cb.Type;
                        //        produitSheet.Cells[indexProduit, 3].Value = cb.Designation;
                        //        produitSheet.Cells[indexProduit, 4].Value = cb.Valide;

                        //        produitSheet.Cells[indexProduit, 5].Value = (from x in ListProduits
                        //                                                     where x.Key == cb.EAN
                        //                                                     select x.Value);

                        //        produitSheet.Cells[indexProduit, 6].Value = cb.Categorie;

                        //        indexProduit++;
                        //    }
                        //}
                    }

                    //foreach (CodeBarre cb in ListCodeBarres)
                    //{
                    //    if (cb.EAN != null && cb.EAN != "")
                    //    {
                    //        produitSheet.Cells[indexProduit, 1].Value = cb.EAN;
                    //        produitSheet.Cells[indexProduit, 2].Value = cb.Type;
                    //        produitSheet.Cells[indexProduit, 3].Value = cb.Designation;
                    //        produitSheet.Cells[indexProduit, 4].Value = cb.Valide;

                    //        produitSheet.Cells[indexProduit, 5].Value = (from x in ListProduits
                    //                                                     where x.Key == cb.EAN
                    //                                                     select x.Value);

                    //        produitSheet.Cells[indexProduit, 6].Value = cb.Categorie;

                    //        indexProduit++;
                    //    }
                    //}


                    res = xlPackage.GetAsByteArray();

                }
                return res;

            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string DownloadProduit(string dataSensBarcodesDirPath, string hashKey)
        {
            List<CodeBarre> ListeCodeBarres = new List<CodeBarre>();

            foreach (string f in Directory.EnumerateFiles(dataSensBarcodesDirPath))
            {
                string json = Questionnaire.Questionnaire.Read(f, hashKey);

                CodeBarre cb = JsonConvert.DeserializeObject<CodeBarre>(json);
                ListeCodeBarres.Add(cb);
            }

            return Serializer.SerializeToString(ListeCodeBarres);
        }

        public static string DownloadParticipants(string inscriptionDirPath, string hashKey)
        {
            List<InscriptionD> Liste = new List<InscriptionD>();

            foreach (string f in Directory.EnumerateFiles(inscriptionDirPath))
            {
                string json = Questionnaire.Questionnaire.Read(f, hashKey);

                InscriptionD cb = JsonConvert.DeserializeObject<InscriptionD>(json);
                Liste.Add(cb);
            }

            return Serializer.SerializeToString(Liste);
        }
    }
}