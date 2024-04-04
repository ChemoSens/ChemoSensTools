using System;


namespace TimeSens.webservices.models
{
    public class EMail
    {
        public string From { get; set; }
        public string To { get; set; }
        public string ReplyTo { get; set; }
        public string DisplayName { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string SubjectCode { get; set; }
        public int? Frequency { get; set; }
        public string ServerCode { get; set; }
        public string RecallBody { get; set; }
    }

    public class SentMail
    {
        public bool IsSent { get; set; }
        public string Email { get; set; }
        public Exception Exception { get; set; }

        public SentMail()
        {
        }
    }
}