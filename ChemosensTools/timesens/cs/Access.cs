using System.Collections.ObjectModel;

namespace TimeSens.webservices.models
{
    public partial class Access
    {
        public string SubjectCode { get; set; }

        public string Password { get; set; }

        public string ServerCode { get; set; }

        public ObservableCollection<AuthorizedDates> ListAuthorizedDates { get; set; }

        public int MinTimeBetweenConnexions { get; set; }

        public bool Anonymous { get; set; }

        public bool AnonymousForcedMail { get; set; }

        public string AnonymousMode { get; set; }

        public bool LocalSession { get; set; }

        public Access()
        {
            this.Password = "";
            this.ServerCode = "";
            this.SubjectCode = "";
            this.ListAuthorizedDates = new ObservableCollection<AuthorizedDates>();
            this.MinTimeBetweenConnexions = 0;
            this.Anonymous = false;
            this.AnonymousForcedMail = false;
            this.LocalSession = false;
        }
    }
}
