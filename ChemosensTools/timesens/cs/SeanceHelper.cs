using ICSharpCode.SharpZipLib.Zip;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading;
using System.Web;
using TimeSens.webservices.models;
using TimeSense.Web.Helpers;

namespace TimeSens.webservices.helpers
{
    public class SeanceHelper
    {
        private static string seanceDir = ConfigurationManager.AppSettings["SeanceDirPath"];
        private static string hashKey = ConfigurationManager.AppSettings["EncryptKey"];

        private static int NbPanelists;
        private static Semaphore SemNbPanelists = new Semaphore(1, 1);//sémaphore pour protéger la variable NbPanelists des accès concurrents (plusieurs panelist peuvent se conencter en même temps
        private static Semaphore SemPanList = new Semaphore(1, 1);//bloque les panelists si le panelleader effectue une opération sur les fichiers progress
        private static Semaphore SemPanLeader = new Semaphore(1, 1);//bloque les panelleader si les pannelists sont en train d'enregistré des données dans leur fichier progress 
        //private static readonly TimeSens.webservices.helpers.Monitor _monitor = new TimeSens.webservices.helpers.Monitor();

        //public static string SetSessionDirectory(string id, string sessionDirectory)
        //{
        //    if (LicenceHelper.IsAdminToken(id) && sessionDirectory != "")
        //    {
        //        seanceDir = sessionDirectory;
        //    }
        //    return seanceDir;
        //}

        public static string DownloadVideos(ObservableCollection<string> listVideos, string password)
        {
            ObservableCollection<string> files = new ObservableCollection<string>();
            foreach (string file in listVideos)
            {

                if (File.Exists(seanceDir + file))
                {
                    files.Add(seanceDir + file);
                }

            }

            try
            {

                Stream s = ZipHelper.ZipToMemoryStream(files, password);
                
                foreach (string file in listVideos)
                {
                    FileHelper.MarkFileToDelete(seanceDir + file);
                }


                string filepath = ConfigurationManager.AppSettings["DownloadDirectory"] + new Random().Next(0, 100000000).ToString() + ".zip";
                string url = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + new Random().Next(0, 100000000).ToString() + ".zip";

                using (System.IO.FileStream output = new System.IO.FileStream(filepath, FileMode.Create))
                {
                    s.CopyTo(output);
                }

                System.Threading.Timer timer = new System.Threading.Timer((obj) =>
                {
                    File.Delete(filepath);
                }, null, 1000000, 0);


                return url;
            }
            catch (Exception ex)
            {
                LogHelper.LogPanelLeaderAction("cc", DateTime.Now, ex.Message, "");
                return null;
            }
        }

        public static void UploadBase64String(string base64string, string name, string servercode)
        {
            try
            {
                byte[] blob = Convert.FromBase64String(base64string);
                string dir = seanceDir + servercode;
                if (!Directory.Exists(dir))
                {
                    // Séance existe ?
                    return;
                }
                dir += "\\Uploads";
                if (!Directory.Exists(dir))
                {
                    // Si le répertoire Uploads n'existe pas, on le crée
                    Directory.CreateDirectory(dir);
                }
                File.WriteAllBytes(dir + "\\" + name, blob);
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "UploadBlob");
                throw new FaultException(new FaultReason("UPLOAD_BLOB_FAILURE"), new FaultCode("UPLOAD_BLOB_FAILURE"));
            }
        }

        public static string GetListSubjectsForSeance(string serverCode)
        {
            try
            {
                ObservableCollection<string> listCodesSubjects = new ObservableCollection<string>();

                // Test : fichier ListSubjectCodes.xml existe : lecture du fichier
                string file = seanceDir + serverCode + "\\ListSubjectCodes.xml";
                if (File.Exists(file))
                {
                    listCodesSubjects = Serializer.Deserialize<ObservableCollection<string>>(file, hashKey);
                    if (listCodesSubjects != null && listCodesSubjects.Count > 0)
                    {
                        listCodesSubjects = new ObservableCollection<string>(listCodesSubjects.Distinct().OrderBy(x => x));
                        return Serializer.SerializeToString(listCodesSubjects);
                    }
                }

                // Sinon : parcours des fichiers de progrès
                string dir = seanceDir + serverCode + @"\Progress\";
                if (Directory.Exists(dir))
                {
                    foreach (var item in Directory.GetFiles(dir))
                    {
                        if (File.Exists(item))
                        {
                            Progress progress = Serializer.Deserialize<Progress>(item, hashKey);
                            if (progress.ShowSubjectCodeOnClient == "Never")
                            {
                                // Sujet non ajouté
                            }
                            else if (progress.ShowSubjectCodeOnClient == "NotStarted")
                            {
                                // Sujet ajouté si la séance n'est pas commencée
                                if (progress.CurrentState == null || (progress.CurrentState != null && progress.CurrentState.LastAccess == null))
                                {
                                    if (Path.GetFileNameWithoutExtension(item).StartsWith("ANONYMOUS") == false)
                                    {
                                        listCodesSubjects.Add(Path.GetFileNameWithoutExtension(item));
                                    }
                                }
                            }
                            else if (progress.CurrentState == null || (progress.CurrentState != null && progress.CurrentState.CurrentScreen < progress.CurrentState.CountScreen || progress.CurrentState.CountScreen == 0))
                            {
                                // Sujet ajouté si la séance n'est pas terminée
                                if (Path.GetFileNameWithoutExtension(item).StartsWith("ANONYMOUS") == false)
                                {
                                    listCodesSubjects.Add(Path.GetFileNameWithoutExtension(item));
                                }
                            }
                        }
                    }

                    //Envoi au client des données non cryptées
                    return Serializer.SerializeToString(listCodesSubjects);
                }
                else
                {
                    throw new FaultException(new FaultReason("INVALID_USER_OR_SESSION"), new FaultCode("INVALID_USER_OR_SESSION"));
                }
            }
            catch (Exception ex)
            {
                if (!(ex is FaultException))
                {
                    //TODO
                    //LogHelper.LogException(ex, "SeanceService");
                }
                return null;
            }
        }

        public static string GetSubjectSeanceProgress(string serverCode, string subjectCode)
        {
            try
            {
                if (serverCode == null)
                {
                    throw new FaultException(new FaultReason("SERVER_CODE_REQUIRED"), new FaultCode("SERVER_CODE_REQUIRED"));
                }

                //string file = seanceDir + serverCode + @"\SubjectSeances\";

                //if (subjectCode != null && subjectCode.Length > 0)
                //{
                //    file += subjectCode;
                //}
                //else if (getAnonymousMode(serverCode) == "CreateJudgeAuto")
                //{
                //    file += "ANONYMOUS";
                //}

                //file += ".xml";

                //if (File.Exists(file))
                //{
                string fileProgress = seanceDir + serverCode + @"\Progress\" + subjectCode + ".xml";
                if (File.Exists(fileProgress))
                {
                    // Lecture des données cryptées sur le serveur
                    Progress p = Serializer.Deserialize<Progress>(fileProgress, hashKey);
                    return p.CurrentState.CurrentScreen.ToString();
                }
                //}

                throw new FaultException(new FaultReason("INVALID_USER_OR_SESSION"), new FaultCode("INVALID_USER_OR_SESSION"));

            }
            catch (Exception ex)
            {
                if (!(ex is FaultException))
                {
                    //TODO
                    //LogHelper.LogException(ex, "BasicSeanceService");
                }
                throw ex;
            }
        }

        public static string GetSubjectSeanceFileSize(string serverCode, string subjectCode)
        {
            try
            {
                if (serverCode == null)
                {
                    throw new FaultException(new FaultReason("SERVER_CODE_REQUIRED"), new FaultCode("SERVER_CODE_REQUIRED"));
                }

                string file = seanceDir + serverCode + @"\Progress\";

                if (subjectCode != null && subjectCode.Length > 0)
                {
                    file += subjectCode;
                }
                else if (getAnonymousMode(serverCode) == "CreateJudgeAuto")
                {
                    return "ANONYMOUS";
                }
                else if (getAnonymousMode(serverCode) == "UseExperimentalDesign")
                {
                    // 1er juge dispo
                    string s = GetListSubjectsForSeance(serverCode);
                    ObservableCollection<string> listCodesSubjects = Serializer.DeserializeFromString<ObservableCollection<string>>(s);
                    if (listCodesSubjects.Count > 0)
                    {
                        file += listCodesSubjects.First();
                    }
                }

                file += ".xml";

                // Vérification : progress existe
                if (File.Exists(file))
                {
                    //string responseString = File.ReadAllText(file);
                    //int contentLength = responseString.Length;
                    //return contentLength.ToString();
                    return "OK";
                }
                return "";

            }
            catch (Exception ex)
            {
                if (!(ex is FaultException))
                {
                    //TODO
                    //LogHelper.LogException(ex, "BasicSeanceService");
                }
                throw ex;
            }
        }

        private static SubjectSeance getSubjectSeance(string serverCode, string subjectCode)
        {        
            string file = seanceDir + serverCode + @"\SubjectSeances\" + subjectCode + ".xml";
            SubjectSeance s = null;
            if (File.Exists(file))
            {
                // Séance déployée depuis Silverlight
                s = Serializer.Deserialize<SubjectSeance>(file, hashKey);
            }
            else
            {
                // Création du fichier subjectseance depuis le template
                string fileTemplate = seanceDir + serverCode + @"\template.json";
                if (!File.Exists(fileTemplate))
                {
                    throw new FaultException(new FaultReason("INVALID_SESSION"), new FaultCode("INVALID_SESSION"));
                }
                TemplatedSubjectSeance template = Serializer.Deserialize<TemplatedSubjectSeance>(fileTemplate, hashKey);
                template.ServerCode = serverCode;
                s = generateSubjectSeanceFromTemplate(template, subjectCode);
                if (s == null)
                {
                    // Si le juge n'existe pas dans le plan de présentation : erreur      
                    throw new FaultException(new FaultReason("INVALID_SESSION"), new FaultCode("INVALID_SESSION"));
                }
            }
            return s;
        }

        public static string DownloadSubjectSeance(string serverCode, string subjectCode, string password, string os = "", string browser = "")
        {
            try
            {
                string code = isAuthorized(serverCode, subjectCode, password);

                //recupération de l'adresse ip pour la geolocation
                string customerIp = "";

                if (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
                    customerIp = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                else if (HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"] != null)
                    customerIp = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];


                string directory = seanceDir + serverCode + @"\SubjectSeances\";
                if (!Directory.Exists(directory))
                {
                    throw new FaultException(new FaultReason("INVALID_SESSION"), new FaultCode("INVALID_SESSION"));
                }

                string file = seanceDir + serverCode + @"\SubjectSeances\" + code + ".xml";

                SubjectSeance s = getSubjectSeance(serverCode, code);

                string fileProgress = seanceDir + serverCode + @"\Progress\" + code + ".xml";

                if (File.Exists(fileProgress))
                {
                    // Lecture des données cryptées sur le serveur
                    Progress p = Serializer.Deserialize<Progress>(fileProgress, hashKey);
                    p.CurrentState.OS = os;
                    p.CurrentState.Browser = browser;
                    p.CurrentState.Geolocation = LogHelper.Geolocation(customerIp);


                    // Test écart min entre 2 séances respecté
                    if (p.CurrentState.CurrentScreen > 0 && p.CurrentState.LastAccess != null && ((DateTime)p.CurrentState.LastAccess).AddHours(s.Access.MinTimeBetweenConnexions) > DateTime.Now)
                    {
                        throw new FaultException(new FaultReason("MIN_TIME_BETWEEN_CONNEXIONS"), new FaultCode("MIN_TIME_BETWEEN_CONNEXIONS"));
                    }

                    p.CurrentState.LastAccess = DateTime.Now;

                    s.Progress = p;

                    Serializer.Serialize(p, fileProgress, hashKey);

                    // MAJ de la liste des juges
                    if (p.ShowSubjectCodeOnClient == "NotStarted")
                    {
                        updateSubjectList(serverCode, code);
                    }

                    // Envoi au client des données non cryptées
                    return Serializer.SerializeToString(s);
                }
                else
                {
                    return File.ReadAllText(file);
                }

            }
            catch (Exception ex)
            {
                if (!(ex is FaultException))
                {
                    //TODO
                    //LogHelper.LogException(ex, "SeanceService");
                }
                throw ex;
            }
        }

        /// <summary>
        /// Renvoie au panel leader tous les SubjectSeance
        /// </summary>
        /// <returns></returns>        
        public static string DownloadAllSubjectSeances(string serverCode, string sessionPassword = "")
        {
            try
            {
                // TODO : Test : utilisateur authentifié
                //if (!LicenceHelper.Authentificate(user, password))
                //{
                //    throw new FaultException(new FaultReason(Language.AuthentificationFailed), new FaultCode("AUTHENTIFICATION_FAILED"));
                //}

                if (!Directory.Exists(seanceDir + serverCode))
                {
                    throw new FaultException(new FaultReason("INVALID_SESSION"), new FaultCode("INVALID_SESSION"));
                }

                if (File.Exists(seanceDir + serverCode + @"\password"))
                {
                    string encryptedPassword = File.ReadAllText(seanceDir + serverCode + @"\password");
                    string decryptedPassword = Serializer.DecryptString(encryptedPassword, hashKey);
                    if (sessionPassword != decryptedPassword)
                    {
                        throw new FaultException(new FaultReason("INVALID_PASSWORD"), new FaultCode("INVALID_PASSWORD"));
                    }
                }

                ObservableCollection<SubjectSeance> ss = new ObservableCollection<SubjectSeance>();
                string dir = seanceDir + serverCode + @"\SubjectSeances\";
                if (Directory.Exists(dir))
                {
                    foreach (var item in Directory.GetFiles(dir))
                    {
                        if (File.Exists(item))
                        {
                            // Lecture des données cryptées sur le serveur
                            SubjectSeance s = Serializer.Deserialize<SubjectSeance>(item, hashKey);
                            // Ajout à la liste
                            ss.Add(s);

                        }
                    }
                    //Envoi au client des données non cryptées
                    string res = Serializer.SerializeToString(ss);
                    return res;
                }
                else
                {
                    throw new FaultException(new FaultReason("INVALID_SESSION"), new FaultCode("INVALID_SESSION"));
                }
            }
            catch (Exception ex)
            {
                if (!(ex is FaultException))
                {
                    //TODO
                    //LogHelper.LogException(ex, "SeanceService");
                }
                throw ex;
            }
        }

        /// <summary>
        /// Permet au client d'uploader ses résultats et son avancement dans le un fichier Progress
        /// En retour, lit les notifications éventuelles laissées par le panel leader
        /// </summary>
        /// <returns></returns>
        public static string UploadProgress(string serverCode, string subjectCode, string xmlProgress)
        {
            try
            {
                //utilisation des sémaphores
                SemNbPanelists.WaitOne();
                NbPanelists++;
                //s'il s'agit du premier panelist à arriver, on vérifie qu'un panelleader ne soit pas en train d'effectuer une opération
                if (NbPanelists == 1)
                    SemPanList.WaitOne();
                SemNbPanelists.Release();

                Progress newP = Serializer.DeserializeFromString<Progress>(xmlProgress);
                Progress returnProgress = updateProgressFile(serverCode, subjectCode, newP);

                // Modification du rappel de mail
                try
                {
                    bool finished = false;
                    if (newP.CurrentState.CurrentScreen == (newP.CurrentState.CountScreen - 1))
                    {
                        finished = true;
                        // Séance terminée : suppression du rappel
                        foreach (string mailFile in Directory.GetFiles(seanceDir + serverCode + @"\Mails\", subjectCode + ".*"))
                        {
                            File.Delete(mailFile);
                        }
                    }
                    else
                    {
                        // Modification de la date
                        foreach (string mailFile in Directory.GetFiles(seanceDir + serverCode + @"\Mails\", subjectCode + ".*"))
                        {
                            EMail mail = Serializer.Deserialize<EMail>(mailFile, ConfigurationManager.AppSettings["EncryptKey"]);
                            File.Delete(mailFile);
                            DateTime nextMailDate = DateTime.Now.AddDays((int)mail.Frequency);
                            string newMailFile = Path.GetFileNameWithoutExtension(mailFile) + "." + nextMailDate.ToString("yyyyMMdd");
                            Serializer.Serialize(mail, seanceDir + serverCode + @"\Mails\" + newMailFile, hashKey);
                        }
                    }

                    // MAJ fichier d'accès
                    if (newP.ShowSubjectCodeOnClient == "NotStarted" || (newP.ShowSubjectCodeOnClient == "NotFinished" && finished == true))
                    {
                        //string listSubjectCodesFile = seanceDir + serverCode + "\\ListSubjectCodes.xml";
                        //if (File.Exists(listSubjectCodesFile))
                        //{
                        //    ObservableCollection<string> listSubjectCodes = Serializer.Deserialize<ObservableCollection<string>>(listSubjectCodesFile, hashKey);
                        //    bool mustRemove = (from x in listSubjectCodes
                        //                       where x == subjectCode
                        //                       select x).Count() > 0;
                        //    if (mustRemove)
                        //    {
                        //        listSubjectCodes.Remove(subjectCode);
                        //        Serializer.Serialize(listSubjectCodes, listSubjectCodesFile, hashKey);
                        //    }
                        //}
                        updateSubjectList(serverCode, subjectCode);
                    }
                }
                catch
                {
                }

                //on relâche les sémaphores
                SemNbPanelists.WaitOne();
                NbPanelists--;
                //s'il s'agit du dernier panelist à faire un upload, on libère le sémaphore ce qui permet à un eventuel leader d'effectuer un download. De cette façon, la priorité va toujours aux panelists
                if (NbPanelists == 0)
                    SemPanList.Release();
                SemNbPanelists.Release();

                return Serializer.SerializeToString(returnProgress);
            }
            catch (Exception ex)
            {
                //on relâche les sémaphores
                SemNbPanelists.WaitOne();
                NbPanelists--;
                //s'il s'agit du dernier panelist à faire un upload, on libère le sémaphore ce qui permet à un eventuel leader d'effectuer un download. De cette façon, la priorité va toujours aux panelists
                if (NbPanelists == 0)
                    SemPanList.Release();
                SemNbPanelists.Release();
                //TODO
                //LogHelper.LogException(ex, "SeanceService");
                throw new FaultException(new FaultReason(ex.Message), new FaultCode("UNEXPECTED_ERROR"));
            }
        }

        private static void updateSubjectList(string serverCode, string subjectCode)
        {
            string listSubjectCodesFile = seanceDir + serverCode + "\\ListSubjectCodes.xml";
            if (File.Exists(listSubjectCodesFile))
            {
                ObservableCollection<string> listSubjectCodes = Serializer.Deserialize<ObservableCollection<string>>(listSubjectCodesFile, hashKey);
                bool mustRemove = (from x in listSubjectCodes
                                   where x == subjectCode
                                   select x).Count() > 0;
                if (mustRemove)
                {
                    listSubjectCodes.Remove(subjectCode);
                    Serializer.Serialize(listSubjectCodes, listSubjectCodesFile, hashKey);
                }
            }
        }

        private static Progress updateProgressFile(string serverCode, string subjectCode, Progress newP)
        {
            try
            {
                string file = seanceDir + serverCode + @"\Progress\" + subjectCode + ".xml";
                Progress returnProgress = new Progress();

                if (!File.Exists(file))
                {
                    if (subjectCode.Contains("LOCAL_ANONYMOUS_"))
                    {
                        //si le fichier progress n'exizte pas, on le crée (cas d'une synchronisation avec des sessions anonymes en mode local)
                        Serializer.Serialize(newP, file, hashKey);
                    }
                    else
                        throw new FaultException(new FaultReason("FILE_NOT_EXISTS"), new FaultCode("FILE_NOT_EXISTS"));
                }

                DateTime dt = DateTime.Now;

                // Lecture sur le serveur des notifications éventuelles du panel leader (crypté)
                Progress oldP = Serializer.Deserialize<Progress>(file, hashKey);
                returnProgress.Notification = oldP.Notification;
                returnProgress.CurrentState = new Progress.State();
                returnProgress.CurrentState.CountScreen = oldP.CurrentState.CountScreen;
                returnProgress.CurrentState.CurrentScreen = oldP.CurrentState.CurrentScreen;
                returnProgress.CurrentState.LastAccess = dt;
                returnProgress.CurrentState.LastUpload = dt;

                // Lecture des données envoyées par le client, non cryptées                
                newP.CurrentState.LastAccess = dt;
                newP.CurrentState.LastUpload = dt;
                newP.CurrentState.LastDownload = oldP.CurrentState.LastDownload;
                newP.CurrentState.LastAction = Progress.State.ActionTypeEnum.Panelist;
                newP.Notification = "";


                // Ecrase les anciennes données avec les nouvelles, et crypte le fichier
                //if (newP.CurrentState.CurrentScreen >= oldP.CurrentState.CurrentScreen)
                //{
                //si la dernière action effectuée sur le progress est un téléchargement par le panel leader, il faut vérifier les données qui ont déjà été téléchargé
                //ce cas de figure n'intervient que lorsqu'un panel leader télécharge des données pendant qu'un panelist est en pleine séance. 
                //NewP écrasant à chaque fois les anciennes données, toutes les données réapparraitraient comme non téléchargées.
                //if (oldP.CurrentState.LastAction == Progress.State.ActionTypeEnum.Panelleader)
                //{
                foreach (Data d in newP.ListData)
                {
                    foreach (Data dd in oldP.ListData)
                    {
                        if (dd.State != Data.DataStateTypeEnum.Fresh && d.IsEqual(dd))
                        {
                            d.State = dd.State;
                            break;
                        }
                    }
                }
                returnProgress.ListData = newP.ListData;
                //}

                //ecriture des nouvelles données
                Serializer.Serialize(newP, file, hashKey);

                //}
                return returnProgress;
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService");
                throw new FaultException(new FaultReason(ex.Message), new FaultCode("UNEXPECTED_ERROR"));
            }
        }

        /// <summary>
        /// Vérifie si un utilisateur a le droit de se connecter à une séance
        /// </summary>
        /// <param name="xDoc"></param>
        /// <param name="subjectCode"></param>
        /// <returns></returns>
        private static string isAuthorized(string serverCode, string subjectCode, string password)
        {
            try
            {
                // Vérification : fichier SubjectSeance.xml existe
                //if (serverCode == null || subjectCode == null)
                if (serverCode == null)
                {
                    throw new FaultException(new FaultReason("SERVER_CODE_REQUIRED"), new FaultCode("SERVER_CODE_REQUIRED"));
                }

                // COMPATIBILITE V1
                if (subjectCode == "")
                {
                    if (getAnonymousMode(serverCode) == "UseExperimentalDesign")
                    {
                        ObservableCollection<string> listCodesSubjects = Serializer.DeserializeFromString<ObservableCollection<string>>(GetListSubjectsForSeance(serverCode));
                        if (listCodesSubjects.Count > 0)
                        {
                            subjectCode = listCodesSubjects.First();
                        }
                    }
                    if (getAnonymousMode(serverCode) == "CreateJudgeAuto")
                    {
                        //subjectCode = "ANONYMOUS" + getLastAnonymousFile(seanceDir + serverCode + @"\Progress\");
                        // Création template.json depuis fichier anonymous



                        if (File.Exists(seanceDir + serverCode + @"\template.json") == false)
                        {

                            string file = seanceDir + serverCode + @"\SubjectSeances\ANONYMOUS.XML";
                            SubjectSeance anonymous = Serializer.Deserialize<SubjectSeance>(file, hashKey);

                            TemplatedSubjectSeance template = new TemplatedSubjectSeance();
                            template.Access = new Access();
                            template.Access.Anonymous = true;
                            template.Access.AnonymousMode = "CreateJudgeAuto";
                            template.Access.ListAuthorizedDates = anonymous.Access.ListAuthorizedDates;
                            template.Access.MinTimeBetweenConnexions = anonymous.Access.MinTimeBetweenConnexions;
                            template.Access.Password = anonymous.Access.Password;
                            template.ListScreens = Serializer.DeserializeFromString<ObservableCollection<Screen>>(Serializer.SerializeToString(anonymous.ListScreens));
                            //template.ListSubjects = anonymous.ListSubjects;
                            template.ListExperimentalDesigns = Serializer.DeserializeFromString<ObservableCollection<ExperimentalDesign>>(Serializer.SerializeToString(anonymous.ListExperimentalDesigns));
                            template.ShowSubjectCodeOnClient = "Never";
                            //template.UploadPassword = ""; //TODO
                            //template.ExpirationDate = this.session.Upload.ExpirationDate;
                            //template.MailPath = this.license.Mail;
                            //templatedSubjectSeance.Login = this.license.Login;
                            //templatedSubjectSeance.Password = this.license.Password;
                            template.MinTimeBetweenConnexions = anonymous.Access.MinTimeBetweenConnexions;
                            //templatedSubjectSeance.Culture = Framework.LocalizationManager.GetDisplayLanguage();
                            template.ServerCode = serverCode;

                            Serializer.Serialize(template, seanceDir + serverCode + @"\template.json", hashKey);
                        }
                    }
                }
                // COMPATIBILITE V1

                //string file = seanceDir + serverCode + @"\Progress\";
                //bool isAnomymous = false;

                //bool shouldVerify = true;

                //if (subjectCode != null && subjectCode.Length > 0)
                //{
                //    if (subjectCode == "ANONYMOUS")
                //    {
                //        isAnomymous = true;
                //    }
                //    file += subjectCode;
                //}
                //else if (getAnonymousMode(serverCode) == "CreateJudgeAuto")
                //{
                //    file += "ANONYMOUS";
                //    isAnomymous = true;
                //    shouldVerify = false;
                //}
                //else if (getAnonymousMode(serverCode) == "UseExperimentalDesign")
                //{
                //    1er juge dispo
                //    ObservableCollection<string> listCodesSubjects = Serializer.DeserializeFromString<ObservableCollection<string>>(GetListSubjectsForSeance(serverCode));
                //    if (listCodesSubjects.Count > 0)
                //    {
                //        file += listCodesSubjects.First();
                //    }
                //    else
                //    {
                //        isAnomymous = true;
                //        file += "ANONYMOUS";
                //    }
                //}

                //file += ".xml";

                SubjectSeance ss = getSubjectSeance(serverCode, subjectCode);

                // Vérification : utilisateur autorisé
                if (ss.Access.Password != password)
                {
                    throw new FaultException(new FaultReason("WRONG_PASSWORD"), new FaultCode("WRONG_PASSWORD"));
                }

                // Vérification : horaire autorisé
                if (ss.Access.ListAuthorizedDates == null || ss.Access.ListAuthorizedDates.Count == 0)
                {
                    return ss.Subject.Code;
                }

                DateTime currentDateTime = DateTime.Now;
                //string dates = "";
                foreach (AuthorizedDates date in ss.Access.ListAuthorizedDates)
                {
                    if (currentDateTime >= date.BeginDate && currentDateTime <= date.EndDate)
                    {
                        return ss.Subject.Code;
                    }
                    //if (date.BeginDate != null && date.EndDate != null)
                    //{
                    //    dates += ((DateTime)date.BeginDate).ToShortDateString() + " " + ((DateTime)date.EndDate).ToShortDateString() + "\n";
                    //}
                }
                throw new FaultException(new FaultReason("UNAUTHORIZED_DATE"), new FaultCode("UNAUTHORIZED_DATE"));
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "SeanceService");
                throw ex;
            }
        }

        private static string getAnonymousMode(string serverCode)
        {
            try
            {
                string res = "";

                // Test : fichier ListSubjectCodes.xml existe : lecture du fichier
                if (File.Exists(seanceDir + serverCode + @"\anonymous"))
                {
                    res = File.ReadAllText(seanceDir + serverCode + @"\anonymous");
                }
                res = res.Replace("\r", "");
                res = res.Replace("\n", "");
                //Envoi au client des données non cryptées
                return res;

            }
            catch (Exception ex)
            {
                return "";
            }
        }

        private static int getLastAnonymousFile(string dir)
        {
            try
            {
                int max = 0;
                if (Directory.Exists(dir))
                {
                    foreach (string file in Directory.GetFiles(dir))
                    {
                        if (File.Exists(file))
                        {
                            string filename = System.IO.Path.GetFileName(file);
                            if (filename.StartsWith("ANONYMOUS_"))
                            {
                                string[] tab = filename.Split('_');
                                int tmp = Convert.ToInt32(tab[1].Replace(".xml", ""));
                                if (tmp > max)
                                {
                                    max = tmp;
                                }
                            }
                        }
                    }
                }
                return max + 1;
            }
            catch
            {
                return 0;
            }
        }

        //public static string DownloadProgress(string listServerCodes, Nullable<DateTime> lastUpdate, string login, string password, Guid progressFeedbackKey = new Guid(), string culture = "en")
        //public static string DownloadProgress(string serverCode, License l)
        //{
        //    return GetProgress(serverCode, l, seanceDir);
        //}

        //public static string DownloadSubjectProgress(string serverCode, Nullable<DateTime> lastUpdate, License l, Guid progressFeedbackKey = new Guid(), string culture = "en")
        //{
        //    return GetProgress(serverCode, lastUpdate, l, seanceDir, progressFeedbackKey, culture, false);
        //}

        public static string DownloadMonitoringProgress(string serverCode, Account license)
        {
            try
            {
                SemPanLeader.WaitOne();
                SemPanList.WaitOne();

                MonitoringInfo monitoringInfo = new MonitoringInfo();
                //monitoringInfo.AvailableTokens = Convert.ToInt32(license.TockenCount);

                // Videos
                if (Directory.Exists(seanceDir + serverCode + @"\Uploads"))
                {
                    DirectoryInfo di0 = new DirectoryInfo(seanceDir + serverCode + @"\Uploads");
                    FileInfo[] rgFiles0 = di0.GetFiles("*.*");
                    foreach (FileInfo fi in rgFiles0)
                    {
                        string file0 = serverCode + @"\Uploads\" + fi.Name;
                        monitoringInfo.Videos.Add(file0);
                        monitoringInfo.VideosSize += fi.Length;
                    }
                }

                DirectoryInfo di = new DirectoryInfo(seanceDir + serverCode + @"\Progress");
                FileInfo[] rgFiles = di.GetFiles("*.xml");

                int cpt = 1;
                int cptfiles = rgFiles.Length;
                foreach (FileInfo fi in rgFiles)
                {
                    string file = seanceDir + serverCode + @"\Progress\" + fi.Name;
                    if (File.Exists(file))
                    {
                        List<DateTime> ListDate = new List<DateTime>();

                        // Lecture des données cryptées sur le serveur
                        Progress p = Serializer.Deserialize<Progress>(file, hashKey);

                        if (p.CurrentState.LastAccess != null)
                        {
                            bool rewriteFile = false;

                            foreach (Data d in p.ListData)
                            {
                                //on recherche les différentes dates pour lesquelles il y a eu un enregistrement de données.
                                //if (d.RecordedDate != null && d.State != Data.DataStateTypeEnum.Downloaded)
                                if (d.RecordedDate != null)
                                {
                                    //si cette date a déjà été enregistré, on passe
                                    if (!ListDate.Contains(d.RecordedDate.Value.Date))
                                    {
                                        //on vérifie que pour cette date, une autre donnée n'a pas déjà été téléchargée. Dans quel cas on ne compte pas de tocken
                                        bool ok = true;
                                        foreach (Data dd in p.ListData)
                                        {
                                            if (dd.State == Data.DataStateTypeEnum.Downloaded && dd.RecordedDate != null && dd.RecordedDate.Value.Date == d.RecordedDate.Value.Date)
                                            //if (dd.RecordedDate.Value.Date == d.RecordedDate.Value.Date)
                                            {
                                                ok = false;
                                                break;
                                            }
                                        }

                                        //si aucune donnée à cette date n'a été téléchargé, on garde la date.
                                        if (ok)
                                        {
                                            ListDate.Add(d.RecordedDate.Value.Date);
                                        }
                                    }

                                    //on marque la donnée en attente de validation ou annulation par le panelleader
                                    d.State = Data.DataStateTypeEnum.Pending;
                                    rewriteFile = true;
                                }
                            }

                            MonitoringProgress mp = getMonitoringProgress(p);

                            monitoringInfo.MonitoringProgress.Add(mp);
                            // Que données non téléchargées
                            monitoringInfo.DataCount += p.ListData.Where((x) => x.State != Data.DataStateTypeEnum.Downloaded).ToList().Count;
                            monitoringInfo.Subjects.Add(p.CurrentState.SubjectCode);

                            //on réécrit le fichier si besoin
                            if (rewriteFile)
                            {
                                p.CurrentState.LastAction = Progress.State.ActionTypeEnum.Panelleader;
                                Serializer.Serialize(p, file, hashKey);
                            }
                        }

                        //chaque date récupérée pour ce sujet signifie un jeton supplémentaire
                        foreach (DateTime d in ListDate)
                        {
                            monitoringInfo.RequiredTokens++;
                            //ListSessionTockens.AddTocken(d);
                        }

                    }
                    cpt++;
                }

                //if (ListSessionTockens.TockensCount > 0)
                //{
                //    ProgressReturn.ListTockensBySession.Add(ListSessionTockens);
                //}


                //if (checkTokens)
                //{
                //    //on vérifie que le panelleader a assez de jetons
                //    //double TockensCount = ProgressReturn.TockensCount;
                //    if (TockensCount > 0 && license.TockenCount < TockensCount)
                //    {                        
                //        //ProgressReturn.Error = "TockensCountNotEnough" + "\r\n" + "TockensNeeded" + ": " + TockensCount.ToString() + "\r\n" + "TockensAvailable" + ": " + license.TockenCount.ToString();

                //        //on annule les modifs sur les données
                //        ChangeDataStatus(ProgressReturn.ListProgress, Data.DataStateTypeEnum.Fresh);

                //        //ProgressReturn.ListProgress.Clear();
                //        //ProgressReturn.ListTockensBySession.Clear();
                //    }
                //    ////si on a pas décompté de jetons mais qu'il y a quand même des données à télécharger, on met à jour leur statut à downloaded
                //    else if (TockensCount == 0)
                //    {
                //        ChangeDataStatus(ProgressReturn.ListProgress, Data.DataStateTypeEnum.Downloaded);
                //    }
                //}

                SemPanList.Release();
                SemPanLeader.Release();

                // Envoi au client des données non cryptées
                return Serializer.SerializeToString(monitoringInfo);
            }
            catch (Exception ex)
            {
                SemPanList.Release();
                SemPanLeader.Release();
                throw new FaultException(new FaultReason(ex.Message), new FaultCode("UNEXPECTED_ERROR"));
            }
        }

        public static string DownloadData(string serverCode, string[] subjects, string dataStatus, Account l)
        {
            ObservableCollection<Data> result = new ObservableCollection<Data>();

            //ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            //using (ExcelPackage xlPackage = new ExcelPackage())
            //{
                //var dataSheet = xlPackage.Workbook.Worksheets.Add("Data");
                //int index = 2;
                //dataSheet.Cells[1, 1].Value = "AttributeCode";
                //dataSheet.Cells[1, 2].Value = "Description";
                //dataSheet.Cells[1, 3].Value = "ProductCode";
                //dataSheet.Cells[1, 4].Value = "RecordedDate";
                //dataSheet.Cells[1, 5].Value = "Replicate";
                //dataSheet.Cells[1, 6].Value = "Intake";
                //dataSheet.Cells[1, 7].Value = "Score";
                //dataSheet.Cells[1, 8].Value = "SubjectCode";
                //dataSheet.Cells[1, 9].Value = "Time";
                //dataSheet.Cells[1, 10].Value = "Type";

                for (int i = 0; i < subjects.Length; i++)
                {
                    string file = seanceDir + serverCode + @"\Progress\" + subjects[i] + ".xml";

                    if (File.Exists(file))
                    {
                        try
                        {
                            // Lecture des données cryptées sur le serveur
                            Progress p = Serializer.Deserialize<Progress>(file, hashKey);

                            foreach (Data d in p.ListData)
                            {
                                //on recherche les différentes dates pour lesquelles il y a eu un enregistrement de données.
                                //if (d.RecordedDate != null && d.State != Data.DataStateTypeEnum.Downloaded)
                                {
                                    //on marque la donnée en attente de validation ou annulation par le panelleader
                                    d.State = Data.DataStateTypeEnum.Downloaded;
                                    result.Add(d);

                                    //dataSheet.Cells[index, 1].Value = d.AttributeCode;
                                    //dataSheet.Cells[index, 2].Value = d.Description;
                                    //dataSheet.Cells[index, 3].Value = d.ProductCode;
                                    //dataSheet.Cells[index, 4].Value = d.RecordedDate.ToString();
                                    //dataSheet.Cells[index, 5].Value = d.Replicate;
                                    //dataSheet.Cells[index, 6].Value = d.Intake;
                                    //dataSheet.Cells[index, 7].Value = d.Score;
                                    //dataSheet.Cells[index, 8].Value = d.SubjectCode;
                                    //dataSheet.Cells[index, 9].Value = d.Time;
                                    //dataSheet.Cells[index, 10].Value = d.Type;
                                    //index++;

                                }
                            }

                            p.CurrentState.LastAction = Progress.State.ActionTypeEnum.Panelleader;
                            Serializer.Serialize(p, file, hashKey);
                        }
                        catch (Exception ex)
                        {

                        }

                    }
                }

                //FileInfo fi = new FileInfo(@"C:\michel.visalli\projets\asahi\analyses\recup.xlsx");
                //xlPackage.SaveAs(fi);
            //}

          

            return Serializer.SerializeToString(result);
        }

        //public static string GetProgress(string serverCode, Nullable<DateTime> lastUpdate, string login, string password, string SeanceDirectory, Guid progressFeedbackKey = new Guid(), string culture = "en", bool checkTokens = true)
        //{
        //    try
        //    {
        //        // Monitoring
        //        ProgressInfo info = _monitor.RegisterNewProgressProcess(progressFeedbackKey);

        //        SemPanLeader.WaitOne();
        //        SemPanList.WaitOne();

        //        //on récupère la licence
        //        License lic = LicenceHelper.GetAuthentificateLicense(login, password);
        //        if (lic == null)
        //            throw new FaultException(new FaultReason("AUTHENTIFICATION_FAILED"), new FaultCode("AUTHENTIFICATION_FAILED"));

        //        DownloadProgressReturn ProgressReturn = new DownloadProgressReturn();
        //        ProgressReturn.LicenceTockensCount = lic.TockenCount;
        //        ProgressReturn.Videos = new ObservableCollection<string>();
        //        ProgressReturn.VideosSize = 0;

        //        // Videos
        //        if (Directory.Exists(SeanceDirectory + serverCode + @"\Uploads"))
        //        {
        //            DirectoryInfo di0 = new DirectoryInfo(SeanceDirectory + serverCode + @"\Uploads");
        //            FileInfo[] rgFiles0 = di0.GetFiles("*.webm");
        //            foreach (FileInfo fi in rgFiles0)
        //            {
        //                string file0 = serverCode + @"\Uploads\" + fi.Name;
        //                ProgressReturn.Videos.Add(file0);
        //                ProgressReturn.VideosSize += fi.Length;
        //            }
        //        }

        //        DirectoryInfo di = new DirectoryInfo(SeanceDirectory + serverCode + @"\Progress");
        //        FileInfo[] rgFiles = di.GetFiles("*.xml");

        //        DownloadProgressReturn.TockensBySession ListSessionTockens = new DownloadProgressReturn.TockensBySession(serverCode);

        //        int cpt = 1;
        //        int cptfiles = rgFiles.Length;
        //        foreach (FileInfo fi in rgFiles)
        //        {
        //            string file = SeanceDirectory + serverCode + @"\Progress\" + fi.Name;
        //            if (File.Exists(file))
        //            {
        //                info.Progress = 100 * (double)cpt / (double)cptfiles;
        //                //info.Description = TimeSense.SLResources.LocalizedString.GetString("DownloadingDataFor", new CultureInfo(culture)) + " " + Path.GetFileNameWithoutExtension(fi.Name);
        //                info.Description = "DownloadingDataFor" + " " + Path.GetFileNameWithoutExtension(fi.Name);

        //                // Rajouté
        //                bool mustDownloadProgress = true;
        //                List<DateTime> ListDate = new List<DateTime>();

        //                if (lastUpdate != null && File.GetLastWriteTime(file) <= lastUpdate)
        //                {
        //                    mustDownloadProgress = false;
        //                }

        //                if (mustDownloadProgress == true)
        //                {
        //                    // Lecture des données cryptées sur le serveur
        //                    Progress p = Serializer.Deserialize<Progress>(file, hashKey);

        //                    if (p.CurrentState.LastAccess != null)
        //                    {
        //                        bool rewriteFile = false;

        //                        foreach (Data d in p.ListData)
        //                        {
        //                            //on recherche les différentes dates pour lesquelles il y a eu un enregistrement de données.
        //                            if (d.RecordedDate != null && d.State != Data.DataStateTypeEnum.Downloaded)
        //                            {
        //                                //si cette date a déjà été enregistré, on passe
        //                                if (!ListDate.Contains(d.RecordedDate.Value.Date))
        //                                {
        //                                    //on vérifie que pour cette date, une autre donnée n'a pas déjà été téléchargée. Dans quel cas on ne compte pas de tocken
        //                                    bool ok = true;
        //                                    foreach (Data dd in p.ListData)
        //                                    {
        //                                        if (dd.State == Data.DataStateTypeEnum.Downloaded && dd.RecordedDate.Value.Date == d.RecordedDate.Value.Date)
        //                                        {
        //                                            ok = false;
        //                                            break;
        //                                        }
        //                                    }

        //                                    //si aucune donnée à cette date n'a été téléchargé, on garde la date.
        //                                    if (ok)
        //                                        ListDate.Add(d.RecordedDate.Value.Date);
        //                                }

        //                                //on marque la donnée en attente de validation ou annulation par le panelleader
        //                                d.State = Data.DataStateTypeEnum.Pending;
        //                                rewriteFile = true;
        //                            }
        //                        }

        //                        ProgressReturn.ListProgress.Add(p);

        //                        //on réécrit le fichier si besoin
        //                        if (rewriteFile)
        //                        {
        //                            p.CurrentState.LastAction = Progress.State.ActionTypeEnum.Panelleader;
        //                            Serializer.Serialize(p, file, hashKey);
        //                        }
        //                    }

        //                    //chaque date récupérée pour ce sujet signifie un jeton supplémentaire
        //                    foreach (DateTime d in ListDate)
        //                    {
        //                        ListSessionTockens.AddTocken(d);
        //                    }
        //                }
        //            }
        //            cpt++;
        //        }

        //        if (ListSessionTockens.TockensCount > 0)
        //        {
        //            ProgressReturn.ListTockensBySession.Add(ListSessionTockens);
        //        }


        //        if (checkTokens)
        //        {
        //            //on vérifie que le panelleader a assez de jetons
        //            double TockensCount = ProgressReturn.TockensCount;
        //            if (TockensCount > 0 && lic.TockenCount < TockensCount)
        //            {
        //                //TODOProgressReturn.Error = Language.TockensCountNotEnough + "\r\n" + Language.TockensNeeded + ": " + TockensCount.ToString() + "\r\n" + Language.TockensAvailable + ": " + lic.TockenCount.ToString();
        //                ProgressReturn.Error = "TockensCountNotEnough" + "\r\n" + "TockensNeeded" + ": " + TockensCount.ToString() + "\r\n" + "TockensAvailable" + ": " + lic.TockenCount.ToString();

        //                //on annule les modifs sur les données
        //                ChangeDataStatus(ProgressReturn.ListProgress, Data.DataStateTypeEnum.Fresh);

        //                //ProgressReturn.ListProgress.Clear();
        //                //ProgressReturn.ListTockensBySession.Clear();
        //            }
        //            ////si on a pas décompté de jetons mais qu'il y a quand même des données à télécharger, on met à jour leur statut à downloaded
        //            else if (TockensCount == 0)
        //            {
        //                ChangeDataStatus(ProgressReturn.ListProgress, Data.DataStateTypeEnum.Downloaded);
        //            }
        //        }

        //        SemPanList.Release();
        //        SemPanLeader.Release();

        //        // Envoi au client des données non cryptées
        //        return Serializer.SerializeToString(ProgressReturn);
        //    }
        //    catch (Exception ex)
        //    {
        //        SemPanList.Release();
        //        SemPanLeader.Release();
        //        //TODO
        //        //LogHelper.LogException(ex, "SeanceService");
        //        throw new FaultException(new FaultReason(ex.Message), new FaultCode("UNEXPECTED_ERROR"));
        //    }
        //}

        //private static void ChangeDataStatus(ObservableCollection<Progress> ListProgress, Data.DataStateTypeEnum Status)
        //{
        //    foreach (Progress p in ListProgress)
        //    {
        //        bool rewriteFile = false;

        //        foreach (Data d in p.ListData)
        //        {
        //            if (d.State == Data.DataStateTypeEnum.Pending)
        //            {
        //                d.State = Status;
        //                rewriteFile = true;
        //            }
        //        }


        //        if (rewriteFile)
        //        {
        //            if (Status == Data.DataStateTypeEnum.Downloaded)
        //                p.CurrentState.LastDownload = DateTime.UtcNow;

        //            string file = seanceDir + p.CurrentState.ServerCode + @"\Progress\" + p.CurrentState.SubjectCode + ".xml";
        //            if (File.Exists(file))
        //            {
        //                //on réécrit le fichier
        //                Serializer.Serialize(p, file, hashKey);
        //            }
        //        }
        //    }
        //}

        private static SubjectSeance generateSubjectSeanceFromTemplate(TemplatedSubjectSeance template, string subjectCode)
        {
            // Juge existe dans plan prés ?
            if (template.Access.AnonymousMode == "NotAuthorized" && template.ListSubjects.Where(x => x.Code == subjectCode).Count() == 0)
            {
                return null;
            }

            SubjectSeance ss = new SubjectSeance();
            ss.Description = template.Description;
            ss.UploadedDate = DateTime.Now;
            ss.UploadId = template.UploadId;
            ss.BrowserCheckMode = template.BrowserCheckMode;

            if (subjectCode == "")
            {
                if (template.Access.AnonymousMode == "CreateJudgeAuto")
                {
                    ss.Subject = new Subject();
                    ss.Subject.Code = "J_" + DateTime.Now.ToString("yyyyMMddHHmmss") + new Random().Next(1000);
                    createProgressFile(template.ServerCode, ss.Subject.Code, template.ShowSubjectCodeOnClient);
                    template.ListSubjects = new ObservableCollection<Subject>();
                    template.ListSubjects.Add(ss.Subject);
                    Serializer.Serialize(template, seanceDir + template.ServerCode + "\\template.json", hashKey);
                }
                else if (template.Access.AnonymousMode == "UseExperimentalDesign")
                {
                    // 1er juge dispo
                    string s = GetListSubjectsForSeance(template.ServerCode);
                    ObservableCollection<string> listCodesSubjects = Serializer.DeserializeFromString<ObservableCollection<string>>(s);
                    ss.Subject = template.ListSubjects.Where(x => x.Code == listCodesSubjects.First()).First();
                }
            }
            else
            {
                ss.Subject = template.ListSubjects.Where(x => x.Code == subjectCode).First();
            }
            ss.Progress = new Progress();
            ss.Progress.CurrentState = new Progress.State() { CurrentScreen = 0, LastAccess = null, ServerCode = template.ServerCode, SubjectCode = subjectCode };
            ss.Progress.ListData = new ObservableCollection<Data>();
            ss.Progress.Notification = null;
            ss.Access = new Access();
            ss.Access.ListAuthorizedDates = template.ListAuthorizedDates;
            ss.Access.Password = ss.Subject.Password;
            ss.Access.ServerCode = template.ServerCode;
            ss.Access.SubjectCode = ss.Subject.Code;

            //ss.Access.Anonymous = anonymousAccess.IsEnabled;
            //    ss.Access.Password = anonymousAccess.Password;
            //    ss.Access.AnonymousForcedMail = anonymousAccess.ForceEmail;
            //    ss.Access.AnonymousMode = anonymousAccess.Mode;


            ss.ListExperimentalDesigns = template.ListExperimentalDesigns;

            if (subjectCode != "")
            {
                foreach (ExperimentalDesign ed in ss.ListExperimentalDesigns)
                {
                    // Seulement ligne de plan de prés du juge
                    ed.ListExperimentalDesignRows = new ObservableCollection<ExperimentalDesignRow>(ed.ListExperimentalDesignRows.Where((x) => x.SubjectCode == subjectCode));
                }
            }

            ss.Access.MinTimeBetweenConnexions = template.MinTimeBetweenConnexions;
            ss.Progress.CurrentState.ServerCode = template.ServerCode;
            ss.Progress.ShowSubjectCodeOnClient = template.ShowSubjectCodeOnClient;
            ss.ListScreens = template.ListScreens;

            if (template.Access.AnonymousMode == "CreateJudgeAuto")
            {
                foreach (ExperimentalDesign design in ss.ListExperimentalDesigns)
                {
                    foreach (ExperimentalDesignRow row in design.ListExperimentalDesignRows)
                    {
                        row.SubjectCode = ss.Subject.Code;
                    }
                    if (design.IsRandomOrder)
                    {
                        design.Seed = DateTime.Now.Millisecond;
                        design.SetOrder(design.Order);
                    }
                }
            }

            return ss;
        }

        private static void createProgressFile(string serverCode, string subjectCode, string showSubjectCodeOnClient)
        {
            Progress p = new Progress();
            p.ShowSubjectCodeOnClient = showSubjectCodeOnClient;
            p.CurrentState = new Progress.State()
            {
                CurrentScreen = 0,
                LastAccess = null,
                ServerCode = serverCode,
                SubjectCode = subjectCode
            };
            p.ListData = new ObservableCollection<Data>();
            p.Notification = null;

            Serializer.Serialize(p, seanceDir + serverCode + @"\Progress\" + subjectCode + ".xml", hashKey);
        }

        public static string UploadSubjectsSeance(string json)
        {
            TemplatedSubjectSeance template = Serializer.DeserializeFromString<TemplatedSubjectSeance>(json);
            if (template.ExpirationDate < DateTime.Now)
            {
                throw new FaultException(new FaultReason("WRONG_EXPIRATION_DATE"), new FaultCode("WRONG_EXPIRATION_DATE"));
            }

            // Test : utilisateur authentifié
            //if (!LicenceHelper.Authentificate(template.Login, template.Password))
            //{
            //    throw new FaultException(new FaultReason("AUTHENTIFICATION_FAILED"), new FaultCode("AUTHENTIFICATION_FAILED"));
            //}

            try
            {
                // Monitoring
                // ProgressInfo info = _monitor.RegisterNewProgressProcess(progressFeedbackKey);

                // Création du répertoire session aléatoire
                string serverCode = createSeanceDirectory();

                createPasswordFile(serverCode, template.UploadPassword);
                createAnonymousFile(serverCode, template.Access.AnonymousMode);
                createExpirationFile(serverCode, template.ExpirationDate);
                createMailFile(serverCode, template.MailPath, template.Culture);
                createLoginFile(serverCode, template.Login);

                ObservableCollection<string> listSubjectCodes = new ObservableCollection<string>();

                // Création des sous-répertoires
                Directory.CreateDirectory(seanceDir + serverCode + @"\SubjectSeances");
                Directory.CreateDirectory(seanceDir + serverCode + @"\Progress");
                Directory.CreateDirectory(seanceDir + serverCode + @"\Mails");
                Directory.CreateDirectory(seanceDir + serverCode + @"\Sms");

                // Création du fichier modèle de subjectseance
                Serializer.Serialize(template, seanceDir + serverCode + "\\template.json", hashKey);

                // Désérialisation du fichier en provenance du Panel Leader, non crypté       

                foreach (Subject s in template.ListSubjects)
                {
                    //info.Progress = 100 * (double)listSS.IndexOf(ss) / (double)listSS.Count;
                    //info.Description = LocalizationHelper.Localize("UploadingSessionForSubject", culture) + " " + listSS.IndexOf(ss).ToString() + "/" + listSS.Count.ToString() + "...";
                    // Création du fichier pour le suivi des données sur le serveur, crypté avec haskKey
                    createProgressFile(serverCode, s.Code, template.ShowSubjectCodeOnClient);

                    if (template.ShowSubjectCodeOnClient != "Never")
                    {
                        listSubjectCodes.Add(s.Code);
                    }
                }

                // Log de l'upload
                try
                {
                    // Log de l'upload dans la license
                    //LicenceHelper.LogUpload(template.Login, template.Password, template.ListSubjects.Count(), serverCode, template.ExpirationDate);
                    // Log csv
                    //TODO : Log
                    //LogHelper.SaveInLog("Upload", DateTime.Now.ToString() + ";" + template.Login + ";" + serverCode + ";" + template.ExpirationDate.ToString() + ";" + template.ListSubjects.Count() + ";" + template.Access.AnonymousMode);
                }
                catch
                {
                }

                // Création du fichier avec la liste des juges
                string listSubjectCodesFile = seanceDir + serverCode + "\\ListSubjectCodes.xml";
                //SemPanLeader.WaitOne();
                Serializer.Serialize(listSubjectCodes, listSubjectCodesFile, hashKey);
                //SemPanLeader.Release();

                return serverCode;
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "SeanceService");
                throw new FaultException(new FaultReason("UPLOAD_FAILED"), new FaultCode(ex.Message));
            }
        }

        private static void createPasswordFile(string serverCode, string password)
        {
            // Création d'un fichier password
            if (password != null && password.Length > 0)
            {
                string passwordFile = seanceDir + serverCode + @"\password";
                string encryptedPassword = Serializer.EncryptString(password, hashKey);
                FileHelper.createFile(passwordFile, encryptedPassword);
            }
        }

        private static void createExpirationFile(string serverCode, DateTime expirationDate)
        {
            // Création d'un fichier expiration
            string file = seanceDir + serverCode + @"\expiration";
            FileHelper.createFile(file, expirationDate.ToString());
        }

        private static void createMailFile(string serverCode, string mail, string culture)
        {
            // Création d'un fichier avec l'email du Panel leader
            string mailFile = seanceDir + serverCode + @"\mail";
            mailFile += "." + culture;
            FileHelper.createFile(mailFile, mail);
        }

        private static void createLoginFile(string serverCode, string login)
        {
            // Création d'un fichier avec le login du Panel leader
            string LoginFile = seanceDir + serverCode + @"\login";
            FileHelper.createFile(LoginFile, login);
        }

        private static void createAnonymousFile(string serverCode, string anonymousMode)
        {
            // Création d'un fichier anonymous
            if (anonymousMode != null && anonymousMode.Length > 0 && anonymousMode != "NotAuthorized")
            {
                string anonymousSessionModeFile = seanceDir + serverCode + @"\anonymous";
                FileHelper.createFile(anonymousSessionModeFile, anonymousMode);
            }
        }

        private static bool canBeAddedToSubjectList(Progress p)
        {
            return (p.ShowSubjectCodeOnClient == "NotFinished" || (p.ShowSubjectCodeOnClient == "NotStarted" && p.CurrentState != null && p.CurrentState.CurrentScreen == 0));
        }

        public static string UpdateSubjectsSeance(string jsonTemplatedSubjectSeance, bool updateSession = false)
        {

            // Chaine retournée : subjectcodes non affectés
            string returnText = "";

            TemplatedSubjectSeance template = Serializer.DeserializeFromString<TemplatedSubjectSeance>(jsonTemplatedSubjectSeance);
            if (template.ExpirationDate < DateTime.Now)
            {
                throw new FaultException(new FaultReason("WRONG_EXPIRATION_DATE"), new FaultCode("WRONG_EXPIRATION_DATE"));
            }

            // Test : utilisateur authentifié
            //if (!LicenceHelper.Authentificate(template.Login, template.Password))
            //{
            //    throw new FaultException(new FaultReason("AUTHENTIFICATION_FAILED"), new FaultCode("AUTHENTIFICATION_FAILED"));
            //}

            string dir = seanceDir + template.ServerCode;
            if (!Directory.Exists(dir))
            {
                throw new FaultException(new FaultReason("SEANCE_NO_LONGER_EXISTS_ON_SERVER"), new FaultCode("SEANCE_NO_LONGER_EXISTS_ON_SERVER"));
            }

            try
            {
                createPasswordFile(template.ServerCode, template.UploadPassword);
                createAnonymousFile(template.ServerCode, template.Access.AnonymousMode);
                createExpirationFile(template.ServerCode, template.ExpirationDate);
                createMailFile(template.ServerCode, template.MailPath, template.Culture);
                createLoginFile(template.ServerCode, template.Login);

                ObservableCollection<string> listSubjectCodes = new ObservableCollection<string>();

                // Création du fichier modèle de subjectseance
                if (updateSession == true)
                {
                    Serializer.Serialize(template, seanceDir + template.ServerCode + "\\template.json", hashKey);
                }

                foreach (Subject s in template.ListSubjects)
                {
                    string progressFile = seanceDir + template.ServerCode + @"\Progress\";

                    //si le code a été modifié
                    if (String.IsNullOrEmpty(s.OldCode))
                    {
                        progressFile += s.Code + ".xml";
                    }
                    else
                    {
                        progressFile += s.OldCode + ".xml";
                    }

                    if (File.Exists(progressFile))
                    {
                        // Séance existante : vérification progrès
                        Progress p = Serializer.Deserialize<Progress>(progressFile, hashKey);
                        p.ShowSubjectCodeOnClient = template.ShowSubjectCodeOnClient;
                        if (p.CurrentState.CurrentScreen > 0)
                        {
                            returnText += p.CurrentState.SubjectCode + ";";
                        }
                        if (canBeAddedToSubjectList(p))
                        {
                            listSubjectCodes.Add(s.Code);
                        }


                        //mise à jour des changements de code sujet
                        if (!String.IsNullOrEmpty(s.OldCode))
                        {
                            string newProgressFile = seanceDir + template.ServerCode + @"\Progress\" + s.Code + ".xml";

                            if (!File.Exists(newProgressFile))
                            {
                                string SubjectSeanceFile = seanceDir + template.ServerCode + @"\SubjectSeances\" + s.OldCode + ".xml";
                                string newSubjectSeanceFile = seanceDir + template.ServerCode + @"\SubjectSeances\" + s.Code + ".xml";


                                p.CurrentState.SubjectCode = s.Code;
                                foreach (Data d in p.ListData)
                                {
                                    d.SubjectCode = s.Code;
                                }

                                System.IO.File.Move(progressFile, newProgressFile);
                                Serializer.Serialize(p, newProgressFile, hashKey);
                                System.IO.File.Move(SubjectSeanceFile, newSubjectSeanceFile);
                                s.OldCode = String.Empty;
                            }
                        }
                        else
                        {
                            Serializer.Serialize(p, progressFile, hashKey);
                        }
                    }
                    else
                    {
                        createProgressFile(template.ServerCode, s.Code, template.ShowSubjectCodeOnClient);
                        if (template.ShowSubjectCodeOnClient != "Never")
                        {
                            listSubjectCodes.Add(s.Code);
                        }
                    }
                }

                // Log de l'upload
                try
                {
                    // Log de l'upload dans la license
                    //LicenceHelper.LogUpload(template.Login, template.Password, template.ListSubjects.Count(), template.ServerCode, template.ExpirationDate);
                    // Log csv
                    //TODO : Log
                    //LogHelper.SaveInLog("Upload", DateTime.Now.ToString() + ";" + template.Login + ";" + template.ServerCode + ";" + template.ExpirationDate.ToString() + ";" + template.ListSubjects.Count() + ";" + template.Access.AnonymousMode);
                }
                catch
                {
                }

                // Création du fichier avec la liste des juges
                string listSubjectCodesFile = seanceDir + template.ServerCode + "\\ListSubjectCodes.xml";
                Serializer.Serialize(listSubjectCodes, listSubjectCodesFile, hashKey);


                return returnText;
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "SeanceService");
                throw new FaultException(new FaultReason("UPLOAD_FAILED"), new FaultCode(ex.Message));
            }
        }

        public static string DeleteSubjectsSeance(string serverCode)
        {
            string file = seanceDir + serverCode;
            try
            {
                if (!System.IO.Directory.Exists(file))
                {
                    return null;
                }

                FileHelper.MarkDirToDelete(file);

                return serverCode;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason("SUPPRESS_FILE_FAILED"), new FaultCode("SUPPRESS_FILE_FAILED"));
            }

        }

        /// <summary>
        /// Crée un répertoire "dirName" dans le répertoire "seanceDir"
        /// </summary>
        /// <param name="dirName"></param>
        /// <returns></returns>
        private static string createSeanceDirectory()
        {
            try
            {
                string randomDirName = FileHelper.createRandomDirName();
                string seanceDirPath = seanceDir + randomDirName;
                if (!Directory.Exists(seanceDirPath))
                {
                    Directory.CreateDirectory(seanceDirPath);
                }
                else
                {
                    createSeanceDirectory();
                }
                return randomDirName;
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "SeanceService");
                return null;
            }
        }

        private static string getSeanceOwner(string serverCode)
        {
            try
            {
                string dir = seanceDir + serverCode;
                if (!Directory.Exists(dir))
                {
                    return null;
                }

                string loginFile = seanceDir + serverCode + @"\login";
                if (!File.Exists(loginFile))
                {
                    return null;
                }
                return File.ReadAllText(loginFile);
            }
            catch
            {
                throw new FaultException(new FaultReason("GET_SEANCE_OWNER_FAILED"), new FaultCode("GET_SEANCE_OWNER_FAILED"));
            }
        }

        private static bool isSeanceOwner(string login, string serverCode)
        {
            try
            {
                //Désactivé
                //string ownerLogin = getSeanceOwner(serverCode).Replace("\r\n", "");
                //return (login == ownerLogin);
                return true;
            }
            catch
            {
                throw new FaultException(new FaultReason("IS_SEANCE_OWNER_FAILED"), new FaultCode("IS_SEANCE_OWNER_FAILED"));
            }
        }

        public static bool IsSeanceOwner(string login, string serverCode)
        {
            return isSeanceOwner(login, serverCode);
        }

        private static MonitoringProgress getMonitoringProgress(Progress p)
        {
            MonitoringProgress mp = new MonitoringProgress();
            if (p.CurrentState.LastAccess != null)
            {
                mp.LastAccess = p.CurrentState.LastAccess.ToString();
            }
            else
            {
                mp.LastAccess = "-";
            }

            if (p.CurrentState.CurrentScreen > 0)
            {
                mp.Progress = p.CurrentState.CurrentScreen + "/" + p.CurrentState.CountScreen;
            }
            else
            {
                mp.Progress = "-";
            }
            mp.SubjectCode = p.CurrentState.SubjectCode;
            return mp;
        }

        public static List<MonitoringProgress> RemoveProgress(string serverCode, string[] subjectCodes, int newCurrentScreen = 0)
        {
            List<MonitoringProgress> res = new List<MonitoringProgress>();
            try
            {
                for (int i = 0; i < subjectCodes.Length; i++)
                {
                    string user = subjectCodes[i];
                    string file = seanceDir + serverCode + @"\Progress\" + user + ".xml";
                    if (File.Exists(file))
                    {
                        Progress p = Serializer.Deserialize<Progress>(file, hashKey);
                        //p.Notification = "Current session was reset by panel leader.";
                        if (newCurrentScreen == 0)
                        {
                            p.ListData = new ObservableCollection<Data>();
                            p.CurrentState.CountScreen = 0;
                            p.CurrentState.LastAccess = null;
                            p.CurrentState.LastDownload = null;
                        }
                        if (p.CurrentState.CountScreen == 0)
                        {
                            p.CurrentState.CurrentScreen = 0;
                        }
                        else
                        {
                            //TODO : suppression des données enregistrées à l'écran avant newCurrentScreen
                            p.CurrentState.CurrentScreen = newCurrentScreen;
                        }
                        Serializer.Serialize(p, file, hashKey);
                        MonitoringProgress mp = getMonitoringProgress(p);
                        res.Add(mp);

                        if (p.CanBeAddedToSubjectList())
                        {
                            // MAJ fichier d'accès
                            string listSubjectCodesFile = seanceDir + serverCode + "\\ListSubjectCodes.xml";
                            if (File.Exists(listSubjectCodesFile))
                            {
                                ObservableCollection<string> listSubjectCodes = Serializer.Deserialize<ObservableCollection<string>>(listSubjectCodesFile, hashKey);
                                bool mustAdd = (from x in listSubjectCodes
                                                where x == user
                                                select x).Count() == 0;
                                if (mustAdd)
                                {
                                    listSubjectCodes.Add(user);
                                    SemPanLeader.WaitOne();
                                    Serializer.Serialize(listSubjectCodes, listSubjectCodesFile, hashKey);
                                    SemPanLeader.Release();
                                }
                            }
                        }
                    }
                }
                return res;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason("REMOVE_PROGRESS_FAILURE"), new FaultCode("REMOVE_PROGRESS_FAILURE"));
            }
        }

        public static void ResetMinTimeBetween2Connections(string serverCode, string subjectCode)
        {
            try
            {
                string file = seanceDir + serverCode + @"\Progress\" + subjectCode + ".xml";
                if (File.Exists(file))
                {
                    Progress p = Serializer.Deserialize<Progress>(file, hashKey);
                    p.CurrentState.LastAccess = null;
                    Serializer.Serialize(p, file, hashKey);
                }

            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode("UNEXPECTED_ERROR"));
            }
        }

        public static Stream DownloadSubjectSeancesAsZip(string serverCode, List<string> listSubjectCodes)
        {
            try
            {
                List<KeyValuePair<string, byte[]>> listKvp = new List<KeyValuePair<string, byte[]>>();

                if (!Directory.Exists(seanceDir + serverCode))
                {
                    throw new FaultException(new FaultReason("INVALID_SESSION"), new FaultCode("INVALID_SESSION"));
                }

                foreach (string subjectCode in listSubjectCodes)
                {
                    SubjectSeance s = getSubjectSeance(serverCode, subjectCode);
                    string progressFile = seanceDir + serverCode + @"\Progress\" + subjectCode + ".xml";
                    Progress p = Serializer.Deserialize<Progress>(progressFile, hashKey);
                    s.Progress = p;
                    string json = Serializer.SerializeToString(s);
                    listKvp.Add(new KeyValuePair<string, byte[]>(s.Subject.Code + ".json", Encoding.UTF8.GetBytes(json)));
                }

                return ZipHelper.CreateMemoryStream(listKvp);

            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason("UNEXPECTED_ERROR"), new FaultCode("UNEXPECTED_ERROR"));
            }
        }
    }
}