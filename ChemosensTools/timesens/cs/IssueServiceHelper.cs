using System;
using System.Collections.ObjectModel;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.ServiceModel;
using System.Web;
using TimeSens.webservices.models;
using TimeSense.Web.Helpers;

namespace TimeSens.webservices.helpers
{
    public class IssueHelper
    {        
        private static string hashKey = ConfigurationManager.AppSettings["EncryptKey"];
                                                                      
        public static string GetIssues(Account l)
        {
            try
            {

                ObservableCollection<Issue> list = new ObservableCollection<Issue>();
                DirectoryInfo di = new DirectoryInfo(ConfigurationManager.AppSettings["IssueFileDirPath"].ToString());
                FileInfo[] rgFiles = di.GetFiles("*.xml");
                foreach (FileInfo fi in rgFiles)
                {
                    string file = ConfigurationManager.AppSettings["IssueFileDirPath"].ToString() + fi.Name;
                    if (File.Exists(file))
                    {
                        try
                        {
                            Issue issue = Serializer.Deserialize<Issue>(file, hashKey);
                            if (issue.Owner == l.Login || l.Type == "admin")
                            {
                                list.Add(issue);
                            }
                        }
                        catch (Exception ex)
                        {
                            //TODO
                            //LogHelper.LogException(ex, "BasicHttpSeanceService");
                            //throw new FaultException(new FaultReason("GET_ISSUES_FAILURE"), new FaultCode("GET_ISSUES_FAILURE"));
                        }
                    }
                }
                return Serializer.SerializeToString(list);
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "BasicHttpSeanceService");
                throw new FaultException(new FaultReason("GET_ISSUES_FAILURE"), new FaultCode("GET_ISSUES_FAILURE"));
            }
        }

        //public static string CreateIssue(string browser, string os, string software, string type, string login, string password, string title, string detail, bool sendMail)
        //{
        //    try
        //    {

        //        //TODO/TOFIX : browser, OS, ... -> string

        //        // Test : utilisateur authentifié
        //        if (!LicenceHelper.Authentificate(login, password))
        //        {
        //            throw new FaultException(new FaultReason("AUTHENTIFICATION_FAILED"), new FaultCode("AUTHENTIFICATION_FAILED"));
        //        }

        //        Issue issue = new Issue();
        //        issue.CreationDate = DateTime.Now;
        //        issue.Owner = login;
        //        //issue.OwnerPseudo = pseudo;
        //        issue.Reader = login;
        //        //issue.OwnerCateg = (Issue.CategUserEnum)Enum.Parse(typeof(Issue.CategUserEnum), categUser, true);
        //        issue.Browser = (Issue.BrowserEnum)Enum.Parse(typeof(Issue.BrowserEnum), browser, true);
        //        issue.OS = (Issue.OSEnum)Enum.Parse(typeof(Issue.OSEnum), os, true);
        //        issue.Status = Issue.StatusEnum.New;
        //        issue.Module = (Issue.ModuleEnum)Enum.Parse(typeof(Issue.ModuleEnum), software, true);
        //        issue.ListReplies = new ObservableCollection<Issue.Reply>();
        //        issue.Type = (Issue.TypeEnum)Enum.Parse(typeof(Issue.TypeEnum), type, true);
        //        issue.Title = title;
        //        issue.Detail = detail;

        //        Random random = new Random();
        //        int id = Math.Abs(random.Next());
        //        while (File.Exists(ConfigurationManager.AppSettings["IssueFileDirPath"].ToString() + id + ".xml"))
        //        {
        //            id = Math.Abs(random.Next());
        //        }

        //        issue.Id = id;

        //        if (sendMail == true)
        //        {
        //            string body = "";
        //            body += "<p><b>Title:</b> " + HttpUtility.HtmlEncode(issue.Title) + "</p>";
        //            body += "<p><b>Details:</b> " + HttpUtility.HtmlEncode(issue.Detail) + "</p>";
        //            if (issue.ListReplies.Count > 0)
        //            {
        //                body += "<p><b>Last reply on " + issue.ListReplies.Last().Date + " by " + issue.ListReplies.Last().Author + " (" + issue.ListReplies.Last().AuthorCateg + "):</b></p>";
        //                body += "<p>" + HttpUtility.HtmlEncode(issue.ListReplies.Last().Content) + "</p>";
        //            }
        //            if (issue.Status != Issue.StatusEnum.New)
        //            {
        //                body += "<p><b>New status: " + issue.Status.ToString() + "</b></p>";
        //            }
        //            MailHelper.SendMail("Mail automatique de TimeSens", ConfigurationManager.AppSettings["NewIssueMail"], "Nouveau ticket", body);
        //            //TODO : envoi mail à la personne
        //            //MailHelper.SendMail("contact@timesens.com", "Mail automatique de TimeSens", ConfigurationManager.AppSettings["NewIssueMail"], "Nouveau ticket", body);
        //        }

        //        string file = ConfigurationManager.AppSettings["IssueFileDirPath"].ToString() + issue.Id + ".xml";
        //        Serializer.Serialize(issue, file, hashKey);
        //        return Serializer.SerializeToString(issue);
        //    }
        //    catch (Exception ex)
        //    {
        //        //TODO
        //        //LogHelper.LogException(ex, "BasicHttpSeanceService");
        //        throw new FaultException(new FaultReason("CREATE_ISSUE_FAILURE"), new FaultCode("CREATE_ISSUE_FAILURE"));
        //    }
        //}

        public static void SaveIssue(string xmlIssue, string attachment = null, bool sendMail = true)
        {
            try
            {
                Issue issue = Serializer.DeserializeFromString<Issue>(xmlIssue);
                string file = ConfigurationManager.AppSettings["IssueFileDirPath"].ToString() + issue.Id + ".xml";
                Serializer.Serialize(issue, file, hashKey);

                // Envoi de mail
                try
                {
                    if (sendMail == true)
                    {
                        MailMessage message = new MailMessage() { From = new MailAddress("contact@timesens.com"), IsBodyHtml = true };
                        message.To.Add(new MailAddress("contact@timesens.com"));
                        foreach (string email in issue.ListMails)
                        {
                            message.To.Add(new MailAddress(email));
                        }
                        message.Subject = "TimeSens: Issue n°" + issue.Id;
                        if (issue.Status == Issue.StatusEnum.New)
                        {
                            message.Subject += " submitted.";
                        }
                        else
                        {
                            message.Subject += " updated.";
                        }

                        message.Body = "";
                        message.Body += "<p><b>Title:</b> " + HttpUtility.HtmlEncode(issue.Title) + "</p>";
                        message.Body += "<p><b>Details:</b> " + HttpUtility.HtmlEncode(issue.Detail) + "</p>";
                        if (issue.ListReplies.Count > 0)
                        {
                            message.Body += "<p><b>Last reply on " + issue.ListReplies.Last().Date + " by " + issue.ListReplies.Last().Author + " (" + issue.ListReplies.Last().AuthorCateg + "):</b></p>";
                            message.Body += "<p>" + HttpUtility.HtmlEncode(issue.ListReplies.Last().Content) + "</p>";
                        }
                        if (issue.Status != Issue.StatusEnum.New)
                        {
                            message.Body += "<p><b>New status: " + issue.Status.ToString() + "</b></p>";
                        }
                        if (attachment != null)
                        {
                            Stream attachmentStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(attachment));
                            Attachment at = new Attachment(attachmentStream, "session.xml");
                            message.Attachments.Add(at);
                        }
                        SmtpClient smtp = new SmtpClient() { Host = "dijon.inra.fr" };
                        smtp.Send(message);
                    }
                }
                catch (Exception ex)
                {
                    throw new FaultException(new FaultReason("SAVE_ISSUE_FAILURE"), new FaultCode(ex.Message));
                }
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "BasicHttpSeanceService");
                throw new FaultException(new FaultReason("SAVE_ISSUE_FAILURE"), new FaultCode("SAVE_ISSUE_FAILURE"));
            }
        }

        public static void DeleteIssue(string id, Account license, string owner)
        {
            try
            {
                if (license.Type != "admin" && license.Login != owner)
                {
                    throw new FaultException(new FaultReason("OWNER_ONLY"), new FaultCode("OWNER_ONLY"));
                }

                string file = ConfigurationManager.AppSettings["IssueFileDirPath"].ToString() + id + ".xml";
                FileHelper.MarkFileToDelete(file);
            }
            catch
            {                
                throw new FaultException(new FaultReason("DELETE_ISSUE_FAILURE"), new FaultCode("DELETE_ISSUE_FAILURE"));
            }
        }                               
    }
}