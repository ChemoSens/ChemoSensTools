using ChemosensTools.analyses.cs;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using Newtonsoft.Json;
using Org.BouncyCastle.Utilities.Encoders;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Channels;
using System.ServiceModel.Web;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using TimeSens.webservices.helpers;
using TimeSens.webservices.models;
using TimeSense.Web.Helpers;
using static ChemosensTools.fcLexicon.csModels.fcLexicon;
using static ChemosensTools.invoiceAnalyzer.cs.InvoiceAnalyzer;

namespace ChemosensTools
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class WebService
    {
        private string accountDir = ConfigurationManager.AppSettings["AccountFileDirPath"];
        private string hashKey = ConfigurationManager.AppSettings["EncryptKey"];

        // CodAchats

        [OperationContract]
        public string LoginCodAchats(string code, string sn)
        {            
            return CodAchats.CodAchats.Login(ConfigurationManager.AppSettings["CodAchatsCodePath"] + "\\" + sn + "\\codes.txt", ConfigurationManager.AppSettings["CodAchatsDataDirPath"] + "\\" + sn + "\\", code, hashKey);
        }

        [OperationContract]
        public void ImportQuestionnaireCodAchats(string data, string sn, string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "CodAchats");
            CodAchats.CodAchats.ImportQuestionnaire(data, ConfigurationManager.AppSettings["CodAchatsCodePath"] + "\\" + sn + "\\codes.txt", ConfigurationManager.AppSettings["CodAchatsDataDirPath"] + "\\" + sn + "\\", hashKey);
        }

        [OperationContract]
        public string ClassifieurCiqualCodachats(string txt)
        {
            return ciqualClassifier.csModels.ciqualClassifier.ClassifyDesignation2(txt);
        }

        [OperationContract]
        public void SaveQuestionnaireCodAchats(string code, string dir, string jsonQuestionnaire)
        {            
            CodAchats.CodAchats.SaveQuestionnaire(ConfigurationManager.AppSettings["CodAchatsCodePath"] + "\\" + dir + "\\codes.txt", ConfigurationManager.AppSettings["CodAchatsDataDirPath"] + "\\" + dir + "\\", code, jsonQuestionnaire, hashKey);
        }

        [OperationContract]
        public string DownloadQuestionnaireCodAchats(string login, string password, string dir)
        {
            //string dir = "";
            //if (login == "lmarty")
            //{
            //    dir = "a";
            //}
            //if (login == "vbellassen" || login == "mvisalli")
            //{
            //    dir = "b";
            //}
            Account a = Account.Check(login, password, accountDir, hashKey, "CodAchats");
            byte[] bytes = CodAchats.CodAchats.DownloadQuestionnaireCodAchats(ConfigurationManager.AppSettings["CodAchatsDataDirPath"] + "\\" + dir + "\\", hashKey);
            return Convert.ToBase64String(bytes);
        }

        [OperationContract]
        public string DownloadQuestionnaireRaisonsAchat(string login, string password)
        {            
            Account a = Account.Check(login, password, accountDir, hashKey, "RaisonsAchat");
            
            byte[] bytes = RaisonAchat.RaisonAchat.DownloadQuestionnaireRaisonAchat(ConfigurationManager.AppSettings["RaisonAchatDataDirPath"]+ "\\", hashKey);
            return Convert.ToBase64String(bytes);
        }

        [OperationContract]
        public string DownloadDataCodAchats(string dir, string code)
        {            
            return CodAchats.CodAchats.DownloadData(ConfigurationManager.AppSettings["CodAchatsDataDirPath"] + "\\" + dir + "\\", code, hashKey);
        }


        // ConsoDrive
        [OperationContract]
        public void ReadLeclercFiles()
        {
            labelExtractor.csModels.LabelExtractor.ReadCarrefourFiles();
        }

        [OperationContract]
        public void CalculeSurFichierExcel2()
        {
            labelExtractor.csModels.LabelExtractor.CalculeSurFichierExcel2();
        }

        [OperationContract]
        public string CalculeSurTexte(string txt)
        {
            return labelExtractor.csModels.LabelExtractor.CalculeSurTexte(txt);
        }

        [OperationContract]
        public string CalculeSurFichierExcel(string fileContent)
        {
            //byte[] bytes = labelExtractor.csModels.LabelExtractor.CalculeSurFichierExcel(Base64.Decode(fileContent.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "")));
            byte[] bytes = labelExtractor.csModels.LabelExtractor.CalculeSurFichierExcel(Convert.FromBase64String(fileContent.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "")));
            return Convert.ToBase64String(bytes);
        }

        [OperationContract]
        public string NettoieDesignation(string txt)
        {
            return labelExtractor.csModels.LabelExtractor.NettoieDesignation(txt);
        }

        [OperationContract]
        public string ClassifieurCiqual(string txt, string modeRecherche, bool reload)
        {
            return ciqualClassifier.csModels.ciqualClassifier.ClassifyDesignation(txt, modeRecherche, reload);
        }

        [OperationContract]
        public string GetSensoryWords(string txt, string options)
        {
            return ChemosensTools.fcLexicon.csModels.fcLexicon.GetSensoryWords(txt, options);
        }

        [OperationContract]
        public string TesteLexique(string name)
        {
            return ChemosensTools.fcLexicon.csModels.fcLexicon.TesteLexique(name);
        }

        [OperationContract]
        public void ClassifieurCiqualXls(string txt)
        {
            ciqualClassifier.csModels.ciqualClassifier.ClassifyDesignationInXls();
        }

        [OperationContract]
        public string ClassifieurCiqualXlsIn(string data, string modeRecherche)
        {
            byte[] bytes = ciqualClassifier.csModels.ciqualClassifier.ClassifyDesignationInXlsIn(data, modeRecherche);
            return Convert.ToBase64String(bytes);
        }

        [OperationContract]
        //public string GetSensoryWordsInXls(string data, string lexicon, string productCategory, bool correction)
        public string GetSensoryWordsInXls(string data, string options)
        {            
            byte[] bytes = ChemosensTools.fcLexicon.csModels.fcLexicon.GetSensoryWordsInXlsIn(data, options);
            return Convert.ToBase64String(bytes);
        }

        [OperationContract]
        public string GetSensoryWordsInXlsForAnalysis(string login, string password, string data, string options)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "ConsoTextplorer");
            string s = ChemosensTools.fcLexicon.csModels.fcLexicon.GetSensoryWordsInXlsInForAnalysis(login, data, options);
            return s;
        }

        [OperationContract]
        public void NettoieDesignationFichierExcel()
        {
            labelExtractor.csModels.LabelExtractor.NettoieDesignationFichierExcel();
        }

        [OperationContract]
        public string UploadInvoice(/*string login, string password, */string fileContent, bool complete = false, int delay = 0)
        {
            string path = "";
            string designationPassageFilePath = "";
            if (complete == true)
            {
                designationPassageFilePath = ConfigurationManager.AppSettings["DesignationPassageFilePath"];
                path = ConfigurationManager.AppSettings["InvoiceDirPath"];
            }
            string result = Invoice.UploadInvoice(fileContent, path, designationPassageFilePath, delay);
            return result;
        }

        [OperationContract]
        public string UploadInvoice2(/*string login, string password, */string fileContent, bool complete = false, int delay = 0)
        {
            string path = "";
            string designationPassageFilePath = "";
            if (complete == true)
            {
                designationPassageFilePath = ConfigurationManager.AppSettings["DesignationPassageFilePath"];
                path = ConfigurationManager.AppSettings["InvoiceDirPath"];
            }
            string result = Invoice.Upload(fileContent, path, designationPassageFilePath, delay);
            return result;
        }

        // TimeSens

        private static string databaseDir = ConfigurationManager.AppSettings["DatabaseDirPath"];

        //TODO : logger les actions
        //TODO : affecter tous les chemins ici
        //TODO : touver un moyen d'affecter les séances dans un directory spécifique au panel leader, comme les analyses

        /// <summary>
        /// Teste si l'utilisateur a une licence valide et non expirée
        /// Si serverCode est non null, vérifie également si le login est le même que celui qui a déployé la séance
        /// </summary>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <param name="serverCode"></param>
        //private License checkAuthentificateUser(string login, string password, string serverCode = null, string licenseType = null)
        //{
        //    License l = LicenceHelper.GetAuthentificateLicense(login, password);
        //    if (l == null)
        //    {
        //        throw new FaultException(new FaultReason("AUTHENTIFICATED_ACCOUNT_ONLY"), new FaultCode("AUTHENTIFICATED_ACCOUNT_ONLY"));
        //    }
        //    if (serverCode != null)
        //    {
        //        if (SeanceHelper.IsSeanceOwner(login, serverCode) == false)
        //        {
        //            throw new FaultException(new FaultReason("SESSION_OWNER_ONLY"), new FaultCode("SESSION_OWNER_ONLY"));
        //        }
        //    }
        //    if (licenseType != null && l.NewLicenseType.ToString() != licenseType)
        //    {
        //        string error = licenseType.ToUpper() + "_ACCOUNT_ONLY";
        //        throw new FaultException(new FaultReason(error), new FaultCode(error));
        //    }
        //    return l;
        //}

        //[OperationContract]
        //public string SetSessionDirectory(string id)
        //{
        //    string sessionDirectory = ConfigurationManager.AppSettings["SessionDirForTests"];
        //    return SeanceHelper.SetSessionDirectory(id, sessionDirectory);
        //}

        [OperationContract]
        public void UploadBug(string data)
        {
            string filePath = ConfigurationManager.AppSettings["BugDirPath"];
            string mail = ConfigurationManager.AppSettings["NewIssueMail"];
            string fileName = DateTime.Now.ToString("yyyyMMdd") + "_ " + FileHelper.CreateRandomName(filePath) + ".html";
            FileHelper.UploadFile(filePath, fileName, System.Uri.UnescapeDataString(data));
            List<System.Net.Mail.Attachment> list = new List<System.Net.Mail.Attachment>();
            list.Add(new System.Net.Mail.Attachment(filePath + fileName));
            MailHelper.SendMailWithAttachments("Nouveau bug TimeSens", mail, "Nouveau bug TimeSens", "Bug", list);
        }

        [OperationContract]
        public string DownloadAllSubjectSeances(string serverCode, string sessionPassword = "")
        {
            return SeanceHelper.DownloadAllSubjectSeances(serverCode, sessionPassword);
        }

        [OperationContract]
        public void SendMail(string toEmail, string subject, string body, string displayName, string replyTo = "", bool test = false)
        {
            MailHelper.SendMail2(toEmail, subject, System.Uri.UnescapeDataString(body), System.Uri.UnescapeDataString(displayName), System.Uri.UnescapeDataString(replyTo), test);
        }

        [OperationContract]
        public string UpdateAccountAsUser(string login, string password, string jsonLicense)
        {
            Account license = Account.CheckTimeSens(login, password, accountDir, hashKey);
            return Account.UpdateAccountAsUser(accountDir, hashKey, license, System.Uri.UnescapeDataString(jsonLicense));
        }

        [OperationContract]
        public string CreateIssue(string browser, string os, string software, string type, string login, string password, string title, string detail, bool sendMail)
        {
            return "";
            //return IssueHelper.CreateIssue(browser, os, software, type, login, password, title, detail, sendMail);
        }

        [OperationContract]
        public void UploadBase64String(string base64string, string name, string servercode)
        {
            SeanceHelper.UploadBase64String(System.Uri.UnescapeDataString(base64string), name, servercode);
        }

        [OperationContract]
        public string DownloadVideos(string login, string password, string listVideos, string serverCode)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey, serverCode);
            // Format du nom de fichier : servercode_subjectcode_product_rep_date.webm
            string[] videos = listVideos.Split(';');
            string[] parts = videos[0].Split('\\');
            string file = parts[parts.Length - 1];
            string[] fileParts = file.Split('_');
            string fileName = fileParts[0] + "_" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() + DateTime.Now.Second.ToString();
            //String headerInfo = "attachment; filename=" + fileName + ".zip";
            //WebOperationContext.Current.OutgoingResponse.Headers["Content-Disposition"] = headerInfo;
            return SeanceHelper.DownloadVideos(new ObservableCollection<string>(System.Uri.UnescapeDataString(listVideos).Split(';')), password);
        }

        [OperationContract]
        public string UploadSubjectsSeance(string login, string password, string jsonTemplatedSubjectSeance)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey);
            return SeanceHelper.UploadSubjectsSeance(jsonTemplatedSubjectSeance);
        }

        [OperationContract]
        public string UpdateSubjectsSeance(string login, string password, string jsonTemplatedSubjectSeance, bool updateSessions = false)
        {
            //TODO : tester owner=login
            Account.CheckTimeSens(login, password, accountDir, hashKey);
            return SeanceHelper.UpdateSubjectsSeance(jsonTemplatedSubjectSeance, updateSessions);
        }

        [OperationContract]
        public string DeleteSubjectsSeance(string serverCode, string login, string password)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey, serverCode);
            return SeanceHelper.DeleteSubjectsSeance(serverCode);
        }

        [OperationContract]
        public void LogConnexion(string client, string version, string login)
        {
            LogHelper.LogConnexion(HttpContext.Current.Request, client, version, login);
        }

        [OperationContract]
        public void LogPanelLeaderAction(string login, string date, string action, string detail)
        {
            DateTime d = DateTime.Parse(date);
            LogHelper.LogPanelLeaderAction(login, d, action, detail);
        }

        [OperationContract]
        public string RefreshMonitoring(string serverCode, string login, string password)
        {
            Account license = Account.CheckTimeSens(login, password, accountDir, hashKey, serverCode);
            return SeanceHelper.DownloadMonitoringProgress(serverCode, license);
        }

        [OperationContract]
        public string DownloadData(string serverCode, string subjects, string login, string password, string dataStatus = "Pending")
        {
            Account license = Account.CheckTimeSens(login, password, accountDir, hashKey, serverCode);
            return SeanceHelper.DownloadData(serverCode, subjects.Split(';'), dataStatus, license);
        }

        [OperationContract]
        public string LoginAsPanelLeader(string login, string password)
        {
            Account license = Account.CheckTimeSens(login, password, accountDir, hashKey);
            return Serializer.SerializeToString(license);
        }

        [OperationContract]
        public string RemoveProgress(string serverCode, string subjectCodes, string login, string password, int newCurrentScreen = 0)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey, serverCode);
            return Serializer.SerializeToString(SeanceHelper.RemoveProgress(serverCode, subjectCodes.Split(';'), newCurrentScreen));
        }

        [OperationContract]
        public void ResetMinTimeBetween2Connections(string serverCode, string subjectCode, string login, string password)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey, serverCode);
            SeanceHelper.ResetMinTimeBetween2Connections(serverCode, subjectCode);
        }

        [OperationContract]
        public string DownloadSubjectSeancesAsZip(string login, string password, string serverCode, string listSubjectCodes)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey, serverCode);
            String headerInfo = "attachment; filename=" + serverCode + ".zip";
            WebOperationContext.Current.OutgoingResponse.Headers["Content-Disposition"] = headerInfo;
            Stream s = SeanceHelper.DownloadSubjectSeancesAsZip(serverCode, new List<string>(System.Uri.UnescapeDataString(listSubjectCodes).Split(';')));

            byte[] bytes = ReadFully(s);

            return Convert.ToBase64String(bytes);
        }

        public static byte[] ReadFully(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }

        [OperationContract]
        public string UploadItemOnServer(string login, string password, string json, string dbName)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey);
            json = System.Uri.UnescapeDataString(json);

            dynamic item = JsonConvert.DeserializeObject<dynamic>(json);

            string path = databaseDir + login + "\\" + dbName;

            if (Directory.Exists(path) == false)
            {
                Directory.CreateDirectory(path);
            }

            return Synchronizable.Upload(item, path);

        }

        [OperationContract]
        public string DownloadItemFromServer(string login, string password, string id, string dbName)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey);

            string path = databaseDir + login + "\\" + dbName;

            return Synchronizable.Download(path, id);
        }

        [OperationContract]
        public string DownloadItemsFromServer(string login, string password, string dbName)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey);

            string path = databaseDir + login + "\\" + dbName;

            return Synchronizable.DownloadAll(path);
        }

        [OperationContract]
        public void DeleteItemOnServer(string login, string password, string json, string dbName)
        {
            Account.CheckTimeSens(login, password, accountDir, hashKey);
            json = System.Uri.UnescapeDataString(json);

            dynamic item = JsonConvert.DeserializeObject<dynamic>(json);

            string path = databaseDir + login + "\\" + dbName;

            if (Directory.Exists(path) == false)
            {
                Directory.CreateDirectory(path);
            }

            Synchronizable.Delete(item, path);
        }

        [OperationContract]
        public string GetListSubjectsForSeance(string serverCode)
        {
            return SeanceHelper.GetListSubjectsForSeance(serverCode);
        }

        [OperationContract]
        public string GetSubjectSeanceFileSize(string serverCode, string subjectCode)
        {
            return SeanceHelper.GetSubjectSeanceFileSize(serverCode, subjectCode);
        }

        [OperationContract]
        public string GetSubjectSeanceProgress(string serverCode, string subjectCode)
        {
            return SeanceHelper.GetSubjectSeanceProgress(serverCode, subjectCode);
        }

        [OperationContract]
        public string DownloadSubjectSeance(string serverCode, string subjectCode, string password, string os = "", string browser = "")
        {
            return SeanceHelper.DownloadSubjectSeance(serverCode, subjectCode, password, os, browser);
        }

        //[OperationContract]
        //public string DownloadAllSubjectSeances(string serverCode, string sessionPassword = "")
        //{
        //    return SeanceHelper.DownloadAllSubjectSeances(serverCode, sessionPassword);
        //}

        [OperationContract]
        public string UploadProgress(string serverCode, string subjectCode, string xmlProgress)
        {
            return SeanceHelper.UploadProgress(serverCode, subjectCode, xmlProgress);
        }

        ////TODO : appeler le webservice depuis un task manager : http://localhost:56206/webservices/TimeSensPanelistService.svc?StartDailyTasks
        ////Taches journalières 
        //[OperationContract]
        //[WebGet]
        ////public void StartDailyTasks(string adminToken)
        //public void StartDailyTasks()
        //{
        //    //if (LicenceHelper.IsAdminToken(adminToken))
        //    {
        //        DailyTasks.StartDailyTasks();
        //    }
        //}

        [OperationContract]
        public string Login(string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey);
            return Serializer.SerializeToString(a);
        }
       
        [OperationContract]
        public string LoginSensas(string code)
        {
            return Sensas.Sensas.Login(ConfigurationManager.AppSettings["SensasCodePath"], ConfigurationManager.AppSettings["SensasDataDirPath"], code, hashKey);
        }

        [OperationContract]
        public string LoginRaisonAchat(string code)
        {
            return RaisonAchat.RaisonAchat.Login(ConfigurationManager.AppSettings["RaisonAchatCodePath"], ConfigurationManager.AppSettings["RaisonAchatDataDirPath"], code, hashKey);
        }

        [OperationContract]
        public void SaveQuestionnaireSensas(string code, string jsonQuestionnaire)
        {
            Sensas.Sensas.SaveQuestionnaire(ConfigurationManager.AppSettings["SensasCodePath"], ConfigurationManager.AppSettings["SensasDataDirPath"], code, jsonQuestionnaire, hashKey);
        }

        [OperationContract]
        public void SaveQuestionnaireRaisonAchat(string code, string jsonQuestionnaire)
        {
            RaisonAchat.RaisonAchat.SaveQuestionnaire(ConfigurationManager.AppSettings["RaisonAchatCodePath"], ConfigurationManager.AppSettings["RaisonAchatDataDirPath"], code, jsonQuestionnaire, hashKey);
        }

        [OperationContract]
        public string GetLikingRaisonAchat(string code)
        {
            return RaisonAchat.RaisonAchat.GetLiking(ConfigurationManager.AppSettings["RaisonAchatLiking"], code);
        }

        [OperationContract]
        public string LoginConsoDrive(string code)
        {
            return ConsoDrive.ConsoDrive.Login(ConfigurationManager.AppSettings["ConsoDriveCodePath"], ConfigurationManager.AppSettings["ConsoDriveDataDirPath"], code, hashKey);
        }

        [OperationContract]
        public string LoginConsoDriveURL(string id)
        {
            return ConsoDrive.ConsoDrive.LoginURL(ConfigurationManager.AppSettings["ConsoDriveDataDirPath"], id, hashKey);
        }

        [OperationContract]
        public string NewLoginConsoDrive(string json, string infos, string mail)
        {
            return ConsoDrive.ConsoDrive.NewLogin(ConfigurationManager.AppSettings["ConsoDriveDataDirPath"], hashKey, json, infos, mail);
        }

        [OperationContract]
        public void SaveQuestionnaireConsoDrive(string code, string jsonQuestionnaire)
        {
            ConsoDrive.ConsoDrive.SaveQuestionnaire(ConfigurationManager.AppSettings["ConsoDriveCodePath"], ConfigurationManager.AppSettings["ConsoDriveDataDirPath"], code, jsonQuestionnaire, hashKey);
        }
        
        [OperationContract]
        public string DownloadQuestionnaireConsoDrive(string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "ConsoDrive");
            byte[] bytes = ConsoDrive.ConsoDrive.DownloadQuestionnaireConsoDrive(ConfigurationManager.AppSettings["ConsoDriveDataDirPath"], hashKey);
            return Convert.ToBase64String(bytes);
        }
        
        [OperationContract]
        public string DownloadQuestionnaireSensas(string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            byte[] bytes = Sensas.Sensas.DownloadQuestionnaireSensas(ConfigurationManager.AppSettings["SensasDataDirPath"], hashKey);
            return Convert.ToBase64String(bytes);
        }

        [OperationContract]
        public string DownloadQuestionnaireCrocnoteurs(string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            byte[] bytes = DataSens.DataSens.DownloadQuestionnaire(ConfigurationManager.AppSettings["DataSensDataDirPath"], ConfigurationManager.AppSettings["DataSensBarcodesDirPath"], ConfigurationManager.AppSettings["DataSensIndemnisationDirPath"], ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], ConfigurationManager.AppSettings["DataSensImgDirPath"], hashKey);
            return Convert.ToBase64String(bytes);
        }

        [OperationContract]
        public string DownloadImagesCrocnoteurs(string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            byte[] bytes = DataSens.DataSens.DownloadImages(ConfigurationManager.AppSettings["DataSensImgDirPath"]);
            return Convert.ToBase64String(bytes);
        }

        [OperationContract]
        public void SendMailCrocnoteurs(string title, string txt)
        {
            DataSens.DataSens.SendMail(title, txt);
        }

        [OperationContract]
        public string DownloadProduitsCrocnoteurs(string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            return DataSens.DataSens.DownloadProduit(ConfigurationManager.AppSettings["DataSensBarcodesDirPath"], hashKey);
        }

        [OperationContract]
        public string DownloadParticipantsCrocnoteurs(string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            return DataSens.DataSens.DownloadParticipants(ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], hashKey);
        }


        [OperationContract]
        public int TeleverserBonAchatCrocnoteurs(string login, string password, string binaries)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            return DataSens.DataSens.TeleverserBonAchatCrocnoteurs(ConfigurationManager.AppSettings["DataSensIndemnisationDirPath"], binaries, hashKey);
        }

        [OperationContract]
        public void UpdateProduitsCrocnoteurs(string login, string password, string produits)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            DataSens.DataSens.UpdateProduitsCrocnoteurs(ConfigurationManager.AppSettings["DataSensBarcodesDirPath"], hashKey, produits);
        }

        [OperationContract]
        public void UpdateParticipantsCrocnoteurs(string login, string password, string participants)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            DataSens.DataSens.UpdateParticipantsCrocnoteurs(ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], hashKey, participants);
        }

        [OperationContract]
        public void UpdateAccounts(string login, string password, string accounts)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            Account.UpdateAccounts(accountDir, hashKey, accounts);
        }

        [OperationContract]
        public int GetNbBonAchatCrocnoteurs(string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            return DataSens.DataSens.GetNbBonAchatCrocnoteurs(ConfigurationManager.AppSettings["DataSensIndemnisationDirPath"]);
        }

        [OperationContract]
        public string DownloadAccounts(string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "", "admin");
            return Account.DownloadAccounts(accountDir, hashKey);
        }

        [OperationContract]
        public string RAnalyze(string login, string password, string analysis, string data, string app)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, app, "");
            //byte[] bytes = Base64.Decode(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            byte[] bytes = Convert.FromBase64String(data.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""));
            return RAnalysis.Run(login, analysis, bytes, a.AuthorizedApps);
        }

        // DataSens
        [OperationContract]
        public bool VerifieMailDataSens(string mail)
        {
            return DataSens.DataSens.VerifieMail(ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], mail, hashKey);
        }

        [OperationContract]
        public string InscriptionDataSens(string inscriptionJson, string mail, bool sendMail, bool valid)
        {
            return DataSens.DataSens.Inscription(ConfigurationManager.AppSettings["DataSensDataDirPath"], ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], hashKey, inscriptionJson, mail, sendMail, valid);
        }

        [OperationContract]
        public string LoginDataSens(string id)
        {
            return Questionnaire.Questionnaire.Login(ConfigurationManager.AppSettings["DataSensDataDirPath"], id, hashKey);
        }

        [OperationContract]
        public void SaveQuestionnaireDataSens(string code, string jsonQuestionnaire)
        {
            Questionnaire.Questionnaire.SaveQuestionnaire(ConfigurationManager.AppSettings["DataSensDataDirPath"], code, jsonQuestionnaire, hashKey);
        }

        [OperationContract]
        public string VerifieCodeBarreDataSens(string code)
        {
            return DataSens.DataSens.VerifieCodeBarre(ConfigurationManager.AppSettings["DataSensBarcodesDirPath"], code, hashKey);
        }

        [OperationContract]
        public bool VerifiePhotoDataSens(string code)
        {
            return DataSens.DataSens.VerifiePhoto(ConfigurationManager.AppSettings["DataSensImgDirPath"], code);
        }

        [OperationContract]
        public void AjouteCodeBarreDataSens(string code, string famille, string designation)
        {
            DataSens.DataSens.AjouteCodeBarre(ConfigurationManager.AppSettings["DataSensBarcodesDirPath"], code, famille, designation, hashKey);
        }

        [OperationContract]
        public void TeleverseImageDataSens(string base64string, string dir, string filename, bool addDate = true)
        {
            string file = ConfigurationManager.AppSettings["DataSensImgDirPath"] + "\\" + dir + "\\" + filename;
            if (addDate == true)
            {
                file += "_" + DateTime.Now.ToString("yyyyMMdd");
            }
            file += ".png";
            DataSens.DataSens.TeleverseImageDataSens(System.Uri.UnescapeDataString(base64string), file);
        }

        [OperationContract]
        public void TeleverseImageCodAppro(string base64string, string filename)
        {
            string file = ConfigurationManager.AppSettings["CodApproImgDirPath"] +  "\\" + filename;            
            file += ".png";
            DataSens.DataSens.TeleverseImageDataSens(System.Uri.UnescapeDataString(base64string), file);
        }

        //[OperationContract]
        //public string VerifieCagnotteDataSens(string id, string codebarre)
        //{
        //    return DataSens.DataSens.VerifieCagnotteDataSens(ConfigurationManager.AppSettings["DataSensBarcodesPath"], id, codebarre);
        //}

        [OperationContract]
        public double AjouteACagnotteDataSens(string id, string codebarre, string type, string designation)
        {
            return DataSens.DataSens.AjouteACagnotteDataSens(ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], ConfigurationManager.AppSettings["DataSensIndemnisationDirPath"], id, codebarre, type, designation, hashKey);
        }

        [OperationContract]
        public string IndemnisationDataSens(string id)
        {
            return DataSens.DataSens.IndemnisationDataSens(ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], ConfigurationManager.AppSettings["DataSensIndemnisationDirPath"], id, hashKey);
        }

        [OperationContract]
        public string TelechargerCagnotteDataSens(string id)
        {
            return DataSens.DataSens.TelechargerCagnotteDataSens(ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], id, hashKey);
        }

        [OperationContract]
        public double VerifiePlafondIndemnisation(string id)
        {
            return DataSens.DataSens.VerifiePlafondIndemnisation(ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], id, hashKey);
        }

        [OperationContract]
        public string ClassifieurFamilleFoodEx(string designation, string login, int pourcentage, bool matchExact, bool supprimeDoublons, int troncature, int differenceCorrespondance = 50, bool tauxCorrespondancePondere = false)
        {

            return Serializer.SerializeToString(inca3Classifier.csModels.inca3Classifier.ClassifieurFamilleFoodEx(ConfigurationManager.AppSettings["ReferentielFoodExPath"] + login + ".xlsx", designation, pourcentage, matchExact, supprimeDoublons, troncature, differenceCorrespondance, tauxCorrespondancePondere));
        }

        // Classifieur FoodEx
        [OperationContract]
        public string UploadReferentiel(string data, string login)
        {
            return Serializer.SerializeToString(inca3Classifier.csModels.inca3Classifier.UploadReferentiel(data, login));
        }

        [OperationContract]
        public void SupprimeReferentiel(string login)
        {
            inca3Classifier.csModels.inca3Classifier.SupprimeReferentiel(login);
        }

        [OperationContract]
        public void UploadLexicon(string login, string password, string data)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "ConsoTextplorer");
            fcLexicon.csModels.fcLexicon.UploadLexique(data, login);
        }


        [OperationContract]
        public string ClassifieurFamilleFoodExExcel(string data, string login, int pourcentage, bool matchExact, bool supprimeDoublons, int troncature, string stat, int differenceCorrespondance, bool tauxCorrespondancePondere = false)
        {
            byte[] bytes = inca3Classifier.csModels.inca3Classifier.ClassifieurFamilleFoodExExcel(ConfigurationManager.AppSettings["ReferentielFoodExPath"] + login + ".xlsx", data, pourcentage, matchExact, supprimeDoublons, troncature, stat, differenceCorrespondance, tauxCorrespondancePondere);
            return Convert.ToBase64String(bytes);
        }

        [OperationContract]
        public string ClassifieurCIQUALExcel(string data)
        {
            byte[] bytes = ciqualClassifier.csModels.ciqualClassifier.ClassifieurCIQUALExcel(data);
            return Convert.ToBase64String(bytes);
        }


        // Recette
        [OperationContract]
        public string UploadRecette(string fileContent)
        {
            return recette.cs.analyserecette.Upload(fileContent);
        }

        //private string GetClientAddress()
        //{
        //    // creating object of service when request comes   
        //    OperationContext context = OperationContext.Current;
        //    //Getting Incoming Message details   
        //    MessageProperties prop = context.IncomingMessageProperties;
        //    //Getting client endpoint details from message header   
        //    RemoteEndpointMessageProperty endpoint = prop[RemoteEndpointMessageProperty.Name] as RemoteEndpointMessageProperty;
        //    return endpoint.Address;
        //}

        [OperationContract]
        [WebGet]
        public Stream Download(string id, string token, string path)
        {
            if (WebOperationContext.Current == null) throw new Exception("WebOperationContext not set");

            if (id != "feZj524Az") throw new Exception("Not authorized");

            if (token == "01azdad4")
            {
                // image Crocnoteurs
                path = ConfigurationManager.AppSettings["DataSensImgDirPath"] + "emballages\\\\" + path + ".png";
            }

            var fileName = System.IO.Path.GetFileName(path);
            //string ip = GetClientAddress();


            // http://localhost:44301/webservice.svc/Download?id=feZj524Az&token=01azdad4&path=71UOWpzYiq0oU9K9M4ivrSaSEMlVd1q2_3228857000876_20220331

            WebOperationContext.Current.OutgoingResponse.ContentType = "application/octet-stream";
            WebOperationContext.Current.OutgoingResponse.Headers.Add("content-disposition", "inline; filename=" + fileName);

            return File.OpenRead(path);
        }

        [OperationContract]
        [WebGet]
        public string ValidationInscriptionDataSens(string code, string mdp, bool valid)
        {
            DataSens.DataSens.ValidationInscription(ConfigurationManager.AppSettings["DataSensDataDirPath"], ConfigurationManager.AppSettings["DataSensInscriptionDirPath"], hashKey, code, mdp, valid);           
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return "INSCRIPTION VALIDEE";
        }


        ////// CodAppro

        [OperationContract]
        public string TranslateCodAppro(string sn)
        {
            return CodAppro.CodAppro.Translate(ConfigurationManager.AppSettings["CodApproDirPath"], sn, hashKey);
        }

        [OperationContract]
        public string LoginCodAppro(string code, string sn)
        {
            return CodAppro.CodAppro.Login(ConfigurationManager.AppSettings["CodApproDirPath"], sn, code, hashKey);
        }

        [OperationContract]
        public void TeleverseImageCodAppro2(string base64string, string sn, string filename)
        {
            string file = ConfigurationManager.AppSettings["CodApproDirPath"] + "\\" + sn + "\\pictures\\" + filename;
            file += ".png";
            DataSens.DataSens.TeleverseImageDataSens(System.Uri.UnescapeDataString(base64string), file);
        }

        [OperationContract]
        public void SaveQuestionnaireCodAppro(string code, string sn, string jsonQuestionnaire)
        {
            CodAppro.CodAppro.SaveQuestionnaire(ConfigurationManager.AppSettings["CodApproDirPath"], sn, code, jsonQuestionnaire, hashKey);
        }

        [OperationContract]
        public string DownloadDataCodAppro(string sn, string code)
        {
            return CodAppro.CodAppro.DownloadData(ConfigurationManager.AppSettings["CodApproDirPath"], sn , code, hashKey);
        }

        [OperationContract]
        public void ImportQuestionnaireCodAppro(string data, string sn, string login, string password)
        {
            Account a = Account.Check(login, password, accountDir, hashKey, "CodAchats");
            CodAppro.CodAppro.ImportQuestionnaire(data,  ConfigurationManager.AppSettings["CodApproDirPath"] + "\\" + sn + "\\questionnaires\\", hashKey);
        }


        [OperationContract]
        public string DownloadQuestionnaireCodAppro(string login, string password, string dir)
        {            
            Account a = Account.Check(login, password, accountDir, hashKey, "CodAchats");
            byte[] bytes = CodAppro.CodAppro.DownloadQuestionnaire(ConfigurationManager.AppSettings["CodApproDirPath"] + "\\" + dir + "\\questionnaires\\", hashKey);
            return Convert.ToBase64String(bytes);
        }
    }

}
