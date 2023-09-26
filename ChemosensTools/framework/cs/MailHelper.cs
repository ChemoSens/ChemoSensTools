using System.Net.Mail;
using System.Configuration;
using System.Collections.Generic;
using System.Net;
using System;
using System.ServiceModel;

namespace TimeSens.webservices.helpers
{
    public class MailHelper
    {

        public static void SendMail2(string toEmail, string subject, string body, string displayName, string replyTo = "", bool test = false, string cc = null)        
        {
            try
            {
                MailHelper.SendMail(displayName, toEmail, subject, body, null, cc);
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode("MAIL_NOT_SENT"));
            }
        }

        public static void SendMail(string displayName, string to, string subject, string body, Attachment attachment = null, string cc=null)
        {
            try
            {
                MailAddress fromAddress = new MailAddress(ConfigurationManager.AppSettings["SmtpFrom"], displayName);
                MailAddress toAddress = new MailAddress(to);
                
                MailMessage message = new MailMessage(fromAddress, toAddress);

                if (cc != null)
                {
                    MailAddress ccAddress = new MailAddress(cc);
                    message.CC.Add(cc);
                }

                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = true;
                if (attachment != null)
                {
                    message.Attachments.Add(attachment);
                }
                SmtpClient smtp = new SmtpClient();
                smtp.Host = ConfigurationManager.AppSettings["SmtpHost"];
                smtp.Port = int.Parse(ConfigurationManager.AppSettings["SmtpPort"]);
                smtp.Credentials = new NetworkCredential(ConfigurationManager.AppSettings["SmtpUser"], ConfigurationManager.AppSettings["SmtpPassword"]);
                smtp.EnableSsl = true;
                smtp.Send(message);
            }
            catch (Exception ex)
            {
            }
        }

        public static void SendMailWithAttachments(string displayName, string to, string subject, string body, List<Attachment> attachment = null)
        {
            try
            {
                MailAddress fromAddress = new MailAddress(ConfigurationManager.AppSettings["SmtpFrom"], displayName);
                MailAddress toAddress = new MailAddress(to);
                MailMessage message = new MailMessage(fromAddress, toAddress);
                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = true;
                if (attachment != null)
                {
                    foreach (Attachment a in attachment)
                    {
                        message.Attachments.Add(a);
                    }
                }
                SmtpClient smtp = new SmtpClient();
                smtp.Host = ConfigurationManager.AppSettings["SmtpHost"];
                smtp.Port = int.Parse(ConfigurationManager.AppSettings["SmtpPort"]);
                smtp.Credentials = new NetworkCredential(ConfigurationManager.AppSettings["SmtpUser"], ConfigurationManager.AppSettings["SmtpPassword"]);
                smtp.EnableSsl = true;
                smtp.Send(message);
            }
            catch
            {
            }
        }
    }
}