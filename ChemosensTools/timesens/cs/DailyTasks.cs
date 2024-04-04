using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.IO;
using System.Net.Mail;
using System.Threading;
using TimeSens.webservices.models;
using TimeSense.Web.Helpers;

namespace TimeSens.webservices.helpers
{
    public class DailyTasks
    {

        public static void StartDailyTasks()
        {            
            // Test : "visiteur" = serveur
            //string visitorIP = Request.ServerVariables["REMOTE_ADDR"]; VisitorIP.Text = visitorIP;
            //        string serverIP = Request.ServerVariables["LOCAL_ADDR"]; ServerIP.Text = serverIP;

            //        // Suppression des fichiers dans Tmp au bout de 2 jours
            //        deleteFiles(ConfigurationManager.AppSettings["TmpDirPath"], 2); DeleteTmpDone.Text = "Done";

            //        // Suppression des fichiers dans todelete_directories au bout de 60 jours
            //        deleteDirectory(ConfigurationManager.AppSettings["ToDeleteDirectoryPath"] + "Seances", 60); DeleteSeancesDone.Text = "Done";
            //        deleteDirectory(ConfigurationManager.AppSettings["ToDeleteDirectoryPath"] + "RWork", 60); DeleteRWork2Done.Text = "Done";
            //        deleteFiles(ConfigurationManager.AppSettings["ToDeleteDirectoryPath"] + "Tmp", 60); DeleteFilesDone.Text = "Done";

            //        // Suppression des fichiers dans Seance après date d'expiration
            //        deleteDirectory(ConfigurationManager.AppSettings["SeanceDirPath"], 0, true); DeleteSeances2Done.Text = "Done";

            //        // Suppression des fichiers dans Reports après date d'expiration
            //        deleteDirectory(ConfigurationManager.AppSettings["PublishDirPath"], 0, true); DeletePublishDone.Text = "Done";

            //        // Rappel de mails
            //        loopForMails(); SendMailDone.Text = "Done";

            //        // Mail hebdomadaire
            //        if (DateTime.Now.DayOfWeek == DayOfWeek.Sunday)
            //        {
            //        sendHebdoMail(); SendHebdoMailDone.Text = "Done";
            //        }

            checkExpirationDateOfLicences();
            deleteRWorkDirectoryContent();
            //TODOdeleteTmpDirContent();
        }


        private static void deleteRWorkDirectoryContent()
        {
            int deletedDirectories = 0;
            // Suppression des fichiers dans RWork
            DirectoryInfo dir = new DirectoryInfo(ConfigurationManager.AppSettings["RWorkDirPath"]);
            foreach (DirectoryInfo di in dir.GetDirectories())
            {
                foreach (FileInfo file in di.GetFiles())
                {
                    file.Delete();
                }
                foreach (DirectoryInfo dir2 in di.GetDirectories())
                {
                    dir2.Delete(true);
                    deletedDirectories++;
                }                
            }
            LogHelper.LogDailyTaskAction(DateTime.Now, deletedDirectories + " temporary R directories deleted");
        }

        private static void checkExpirationDateOfLicences()
        {
            //TODO: améliorer texte et mise en forme

            ObservableCollection<License> licenses = LicenceHelper.GetLicenses();

            DateTime today = DateTime.Now;

            int licenseChecked = 0;
            int mailSent = 0;

            foreach (License l in licenses)
            {
                if (l.ExpirationDate != null)
                {
                    DateTime expirationDate = Convert.ToDateTime(l.ExpirationDate);

                    int nbDays = 0;
                    bool expired = expirationDate.AddDays(+1).Date == today.Date;

                    // 30 jours avant expiration
                    if (expirationDate.AddDays(-30).Date == today.Date)
                    {
                        nbDays = 30;
                    }
                    // 7 jours avant expiration
                    if (expirationDate.AddDays(-7).Date == today.Date)
                    {
                        nbDays = 7;
                    }
                    // 3 jours avant expiration
                    if (expirationDate.AddDays(-3).Date == today.Date)
                    {
                        nbDays = 3;
                    }

                    //TODO : envoi de mail
                    if (nbDays > 0)
                    {
                        mailSent++;
                        //MailHelper.SendMail("", l.Mail, LocalizationHelper.Localize("LicenseExpirationClosedTitle",l.Language), String.Format(LocalizationHelper.Localize("LicenseExpirationClosedBody", l.Language), nbDays));
                    }
                    if (expired)
                    {
                        mailSent++;
                        //MailHelper.SendMail("", l.Mail, LocalizationHelper.Localize("LicenseExpiredTitle", l.Language), LocalizationHelper.Localize("LicenseExpiredBody", l.Language));
                    }

                    licenseChecked++;
                }
            }
            LogHelper.LogDailyTaskAction(today, licenseChecked + " licenses checked, " + mailSent + " mails sent.");
        }

        //private void loopForMails()
        //{
        //    try
        //    {
        //        DirectoryInfo dir = new DirectoryInfo(ConfigurationManager.AppSettings["SeanceDirPath"]);
        //        // Répertoires dans Seances
        //        DirectoryInfo[] seanceList = dir.GetDirectories();
        //        foreach (DirectoryInfo di in seanceList)
        //        {
        //            // Lecture du répertoire mail
        //            if (Directory.Exists(di.FullName + "\\Mails"))
        //            {
        //                foreach (string file in Directory.GetFiles(di.FullName + "\\Mails"))
        //                {
        //                    string currentDate = DateTime.Now.ToString("yyyyMMdd");
        //                    string rappelDate = Path.GetExtension(file).Remove(0, 1);
        //                    if (currentDate.CompareTo(rappelDate) > 0)
        //                    {
        //                        // Envoi de mail
        //                        EMail mail = Serializer.Deserialize<EMail>(file, ConfigurationManager.AppSettings["EncryptKey"]);
        //                        MailHelper.SendMail(mail.DisplayName, mail.To, mail.Subject, mail.Body);

        //                        // Définition date d'envoi du prochain mail
        //                        string newDate = DateTime.Now.AddDays((int)mail.Frequency).ToString("yyyyMMdd");
        //                        string newFile = Path.GetDirectoryName(file) + "\\" + Path.GetFileNameWithoutExtension(file) + "." + newDate;
        //                        File.Move(file, newFile);

        //                        //TODO : retourner date dernier envoi mail au panel leader
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        MailHelper.SendMail("Admin TimeSens", "michel.visalli@dijon.inra.fr", "Erreur pendant l'envoi de mails journaliers", ex.Message);
        //    }
        //}



        //private string h1 = "<h1 style='font-family: Arial; font-size: 19px; color: black; font-weight:bold'>{0}</h1>";
        //private string h2 = "<h2 style='font-family: Arial; font-size: 16px; color: black;'>{0}</h2>";
        //private string p = "<p style='font-family: Arial; font-size: 13px; color: black;'>{0}</p>";

        //public static string createCsv(string dir)
        //{
        //    try
        //    {
        //        string csv = Data.GetCsvHeader();
        //        if (Directory.Exists(dir))
        //        {
        //            DirectoryInfo Dir = new DirectoryInfo(dir);
        //            FileInfo[] FileList = Dir.GetFiles();
        //            foreach (FileInfo fi in FileList)
        //            {
        //                Progress p = Serializer.Deserialize<Progress>(fi.FullName, ConfigurationManager.AppSettings["EncryptKey"]);
        //                //Progress p = Serializer.Deserialize<Progress>(fi.FullName, null);
        //                foreach (Data d in p.ListData)
        //                {
        //                    csv += d.ToCsv();
        //                }
        //            }
        //        }
        //        return csv;
        //    }
        //    catch (Exception ex)
        //    {
        //        MailHelper.SendMail("Admin TimeSens", "michel.visalli@dijon.inra.fr", "Erreur pendant la création d'un fichier csv", ex.Message);
        //        return "";
        //    }
        //}

        //private void deleteFiles(string dir, double days)
        //{
        //    try
        //    {
        //        if (Directory.Exists(dir))
        //        {
        //            DirectoryInfo Dir = new DirectoryInfo(dir);
        //            FileInfo[] FileList = Dir.GetFiles();
        //            foreach (FileInfo fi in FileList)
        //            {
        //                if (fi.CreationTime.AddDays(days) < DateTime.Now)
        //                {
        //                    File.SetAttributes(fi.FullName, FileAttributes.Normal);
        //                    try
        //                    {
        //                        Directory.Delete(fi.FullName, true);
        //                    }
        //                    catch
        //                    {
        //                        Thread.Sleep(0);
        //                        Directory.Delete(fi.FullName, true);
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        MailHelper.SendMail("Admin TimeSens", "michel.visalli@dijon.inra.fr", "Erreur pendant la MAJ journalière, répertoire " + dir + "\n" + ex.Message, ex.Message);
        //    }
        //}

        //private void sendHebdoMail()
        //{
        //    try
        //    {
        //        // Envoi de mail hebdomadaire récapitulatif
        //        string path = ConfigurationManager.AppSettings["LogDirectory"] + "\\";
        //        DateTime maxDate = DateTime.Now;
        //        DateTime minDate = DateTime.Now.AddDays(-7);

        //        string html = "";
        //        string txt = "";
        //        string[] lines;
        //        List<Attachment> listAttachments = new List<Attachment>();

        //        html += string.Format(h1, "Rapport TimeSens hebdomadaire du " + minDate.ToShortDateString() + " au " + maxDate.ToShortDateString());

        //        if (File.Exists(path + "ConnexionPanelLeader\\ConnexionPanelLeader_Log_current.csv"))
        //        {
        //            txt = File.ReadAllText(path + "ConnexionPanelLeader\\ConnexionPanelLeader_Log_current.csv");
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            html += string.Format(h2, "Connexions de panel leaders");
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[1]))
        //                        {
        //                            dic[parts[1]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[1], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                html += string.Format(p, kvp.Key + " : " + kvp.Value + " connexion(s)");
        //            }
        //            listAttachments.Add(new Attachment(path + "ConnexionPanelLeader\\ConnexionPanelLeader_Log_current.csv"));
        //        }

        //        if (File.Exists(path + "ConnexionPanelist\\ConnexionPanelist_Log_current.csv"))
        //        {
        //            txt = File.ReadAllText(path + "ConnexionPanelist\\ConnexionPanelist_Log_current.csv");
        //            lines = txt.Split('\n');
        //            html += string.Format(h2, "Connexions de panélistes");
        //            int nbConnexions = 0;
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        nbConnexions++;
        //                    }
        //                }
        //            }
        //            html += string.Format(p, "Nombre de connexion(s) : " + nbConnexions);
        //            listAttachments.Add(new Attachment(path + "ConnexionPanelist\\ConnexionPanelist_Log_current.csv"));
        //        }

        //        if (File.Exists(path + "Analysis\\Analysis_Log_current.csv"))
        //        {
        //            txt = File.ReadAllText(path + "Analysis\\Analysis_Log_current.csv");
        //            lines = txt.Split('\n');
        //            html += string.Format(h2, "Analyses statistiques");
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[2]))
        //                        {
        //                            dic[parts[2]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[2], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                html += string.Format(p, kvp.Key + " : " + kvp.Value + " utilisation(s)");
        //            }
        //            listAttachments.Add(new Attachment(path + "Analysis\\Analysis_Log_current.csv"));
        //        }

        //        if (File.Exists(path + "Import\\Import_Log_current.csv"))
        //        {
        //            txt = File.ReadAllText(path + "Import\\Import_Log_current.csv");
        //            lines = txt.Split('\n');
        //            html += string.Format(h2, "Import de données");
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[2]))
        //                        {
        //                            dic[parts[2]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[2], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                html += string.Format(p, kvp.Key + " : " + kvp.Value + " import(s)");
        //            }
        //            listAttachments.Add(new Attachment(path + "Import\\Import_Log_current.csv"));
        //        }

        //        if (File.Exists(path + "Upload\\Upload_Log_current.csv"))
        //        {
        //            txt = File.ReadAllText(path + "Upload\\Upload_Log_current.csv");
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            html += string.Format(h2, "Déploiements");
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        int nbJuges = 0;
        //                        if (int.TryParse(parts[4], out nbJuges))
        //                        {
        //                            if (dic.ContainsKey(parts[1]))
        //                            {
        //                                dic[parts[1]] += nbJuges;
        //                            }
        //                            else
        //                            {
        //                                dic.Add(parts[1], nbJuges);
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                html += string.Format(p, kvp.Key + " : " + kvp.Value + " juge(s)</p>");
        //            }
        //            listAttachments.Add(new Attachment(path + "Upload\\Upload_Log_current.csv"));
        //        }

        //        if (File.Exists(path + "SMS\\SMS_Log_current.csv"))
        //        {
        //            txt = File.ReadAllText(path + "SMS\\SMS_Log_current.csv");
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            html += string.Format(h2, "Envoi de SMS");
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        int nbSms = 0;
        //                        if (int.TryParse(parts[2], out nbSms))
        //                        {
        //                            if (dic.ContainsKey(parts[1]))
        //                            {
        //                                dic[parts[1]] += nbSms;
        //                            }
        //                            else
        //                            {
        //                                dic.Add(parts[1], nbSms);
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                html += string.Format(p, kvp.Key + " : " + kvp.Value + " juge(s)");
        //            }
        //            listAttachments.Add(new Attachment(path + "SMS\\SMS_Log_current.csv"));
        //        }

        //        if (File.Exists(path + "SensoBase\\SensoBase_Log_current.csv"))
        //        {
        //            txt = File.ReadAllText(path + "SensoBase\\SensoBase_Log_current.csv");
        //            lines = txt.Split('\n');
        //            html += string.Format(h2, "Import SensoBase");
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[6]))
        //                        {
        //                            dic[parts[6]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[6], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                html += string.Format(p, kvp.Key + " : " + kvp.Value + " nouveau(x) jeu(x) de données");
        //            }
        //            listAttachments.Add(new Attachment(path + "SensoBase\\SensoBase_Log_current.csv"));
        //        }

        //        if (File.Exists(path + "ErrorAnalysis\\ErrorAnalysis_Log_current.csv"))
        //        {
        //            listAttachments.Add(new Attachment(path + "ErrorAnalysis\\ErrorAnalysis_Log_current.csv"));
        //        }
        //        if (File.Exists(path + "ErrorPanelLeader\\ErrorPanelLeader_Log_current.csv"))
        //        {
        //            listAttachments.Add(new Attachment(path + "ErrorPanelLeader\\ErrorPanelLeader_Log_current.csv"));
        //        }
        //        if (File.Exists(path + "ErrorPanelist\\ErrorPanelist_Log_current.csv"))
        //        {
        //            listAttachments.Add(new Attachment(path + "ErrorPanelist\\ErrorPanelist_Log_current.csv"));
        //        }
        //        if (File.Exists(path + "ErrorWeb\\ErrorWeb_Log_current.csv"))
        //        {
        //            listAttachments.Add(new Attachment(path + "ErrorWeb\\ErrorWeb_Log_current.csv"));
        //        }

        //        MailHelper.SendMailWithAttachments("Mail automatique TimeSens", "contact@timesens.com", "Rapport hebdomadaire", html, listAttachments);
        //    }
        //    catch (Exception ex)
        //    {
        //        MailHelper.SendMail("Admin TimeSens", "michel.visalli@dijon.inra.fr", "Erreur pendant le récapitulatif d'envoi" + "\n" + ex.Message, ex.Message);
        //    }
        //}

        
    }
}