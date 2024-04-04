using System;
using System.Runtime.Serialization;
using System.Collections.ObjectModel;
using System.Linq;
using System.Collections.Generic;

namespace TimeSens.webservices.models
{
    
    public partial class License
    {
        public License()
        {
            this.ActualConnexions = 0;
            this.Address = "";
            this.NbConcurrentAccess = 1;
            //this.AuthorizedConnexions = -1;
            //this.AuthorizedSubjects = -1;
            //this.AuthorizedUploads = -1;
            this.City = "";
            this.Country = "";
            this.FirstName = "";
            this.LastAccess = DateTime.Now;
            this.LastName = "";
            this.LicenseType = LicenseTypeEnum.Undefined;
            this.NewLicenseType = NewLicenseTypeEnum.Undefined;
            this.Login = "";
            this.Mail = "";
            this.Password = "";
            this.PhoneNumber = "";
            this.Society = "";
            this.ZipCode = "";
            //this.Token = "";
            this.Validated = false;
            this.HasApprovedSensobaseConvention = false;
            this.Activity = new ObservableCollection<LogSeance>();
            this.Consumptions = new ObservableCollection<Consumption>();
            //this.ListAuthorizedMAC = new ObservableCollection<string>();
            this.PanelLeaderApplicationSettings = new PanelLeaderApplicationSettings();
        }

        public string Language
        {
            get
            {
                if (this.Country.ToLower() == "france")
                {
                    return "fr";
                }
                return "en";
            }
        }

        //public ObservableCollection<string> ListAuthorizedMAC { get; set; }
        
        public PanelLeaderApplicationSettings PanelLeaderApplicationSettings { get; set; }

        //public string Token { get; set; }

        public string Pseudo { get; set; }

        public bool CanAccessToSensoBase
        {
            //get { return (this.LicenseType == LicenseTypeEnum.Admin || this.LicenseType == LicenseTypeEnum.SensoBase); }
            get { return true; }
        }

        //public enum LicenseTypeEnum { Undefined, Admin, Commercial1, Commercial2, SensoBase, Academic, Free }
        public enum LicenseTypeEnum { Undefined, Admin, Commercial1, Commercial2, Academic, SensoBase, Free, Corporate, Educational, Research, TryOut }

        /// <summary>
        /// Undefined : par défaut, en attente de validation
        /// Admin : visibilité sur certaines fonctionnalités + accès à TimeSens tools
        /// FullPrice : 2€/jeton
        /// LowPrice : 1€/jeton
        /// Academic : gratuit, limitations (message au démarrage et sur les outputs, pas d'envoi de SMS)
        /// Free : gratuit, sans limitations (licences INRA, partenaires)
        /// Demo : gratuit, limité en temps, limitations (message au démarrage et sur les outputs, téléchargements et uploads limités, pas d'envoi de SMS, pas d'achat de tokens)
        /// </summary>
        public enum NewLicenseTypeEnum { Undefined, Admin, FullPrice, LowPrice, Academic, Free, Demo }

        public bool HasApprovedSensobaseConvention { get; set; }

        public int NbConcurrentAccess { get; set; }

        public string Login {get;set;}

        public string Id {get;set;}

        public string VATZone { get; set; }

        public string VATNumber { get; set; }

        //public int AuthorizedConnexions {get;set;} //obsolète

        public int ActualConnexions {get;set;}

        //public int AuthorizedUploads { get; set; }

        public int ActualUploads 
        {
            get
            {
                if (Activity != null)
                    return Activity.Count;
                else
                    return 0;
            }
            set{}
        }

        public int OnGoingUploads
        {
            get
            {
                if (Activity != null)
                    return (from x in Activity
                            where x.SessionOnGoing == true
                            select x).Count();
                else
                    return 0;
            }
            set { }
        }       

        public string Password {get;set;}

        public string FirstName {get;set;}
        public string OrderFirstName { get; set; }

        public string LastName {get;set;}
        public string OrderLastName { get; set; }
       
        public string PhoneNumber { get; set; }
        public string OrderPhoneNumber { get; set; }

        public string Society {get;set;}
        public string OrderSociety { get; set; }

        public string ZipCode { get; set; }
        public string OrderZipCode { get; set; }
        
        public string Address {get;set;}
        public string OrderAddress { get; set; }

        public string City {get;set;}
        public string OrderCity { get; set; }

        public string Country {get;set;}
        public string OrderCountry { get; set; }

        public string Mail {get;set;}
        public string OrderMail { get; set; }

        // Conservé pour compatibilité mais non utilisé
        public LicenseTypeEnum LicenseType { get; set; }
        public NewLicenseTypeEnum NewLicenseType { get; set; }

        public DateTime? LastAccess {get;set;}

        public DateTime? RegistrationDate { get; set; }

        public DateTime? PurchaseDate { get; set; }

        public DateTime? ExpirationDate { get; set; }

        public bool Validated { get; set; }

        public ObservableCollection<LogSeance> Activity { get; set; }

        public ObservableCollection<Consumption> Consumptions { get; set; }

        public double TockenCount
        {
            get
            {
                double count = 0;
                foreach (Consumption c in Consumptions)
                {
                    if (!(c.Action == Consumption.ActionTypeEnum.Purchase))
                    {
                        count += c.NbTockens;
                    }
                }
                return count;
            }
            set { }
        }

        public double DownloadedTockenCount
        {
            get
            {
                double count = 0;
                foreach (Consumption c in Consumptions)
                {
                    if (c.Action == Consumption.ActionTypeEnum.Download)
                    {
                        count += c.NbTockens;
                    }
                }
                return count;
            }
            set { }
        }

        public double ImportedTockenCount
        {
            get
            {
                double count = 0;
                foreach (Consumption c in Consumptions)
                {
                    if (c.Action == Consumption.ActionTypeEnum.Import)
                    {
                        count += c.NbTockens;
                    }
                }
                return count;
            }
            set { }
        }

        public int NbDataLine
        {
            get
            {
                if (Activity.Count > 0)
                    return (from x in Activity
                            from y in x.SessionDailyDataDetails
                            select y.NbDataLine).Sum();
                else
                    return 0;
            }
            set { }
        }

        //public int AuthorizedSubjects { get; set; }

        public int TotalSubjects
        {
            get
            {
                if (Activity != null)
                    return (from x in Activity
                            select x.NbSubject).Sum();
                else
                    return 0;
            }
            set { }
        }

        public int DeployedSubjects
        {
            get
            {
                if (Activity != null)
                    return (from x in Activity
                            where x.SessionOnGoing == true
                            select x.NbSubject).Sum();
                else
                    return 0;
            }
            set { }
        }      

        public void LogSessionInLicence(string Session, int subjectsCount, DateTime? deployment, DateTime? Expiration, string initialUploader, DateTime? delete = null)
        {
            try
            {
                LogSeance ls = new LogSeance();
                ls.LogDate = DateTime.Now;
                ls.DeploymentDate = deployment;
                ls.LastUpdate = DateTime.Now;
                ls.Session = Session;
                ls.NbSubject = subjectsCount;
                ls.ExpirationDate = Expiration;
                ls.DeleteFromServerDate = delete;
                ls.InitialUploader = initialUploader;
                this.Activity.Add(ls);
            }
            catch (Exception ex)
            {
                throw ex;
            }
             
        }

        public bool UpdateSessionDataLog(string Session, ObservableCollection<LogDailyDataDetails> Datas)
        {
            try
            {
                LogSeance log = GetLogSeance(Session);

                log.SessionDailyDataDetails = Datas;
                log.LastUpdate = DateTime.Now;
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public bool UpdateSessionLog(LogSeance session)
        {
            try
            {
                LogSeance log = GetLogSeance(session.Session);

                log.NbSubject = session.NbSubject;
                log.ExpirationDate = session.ExpirationDate;
                log.DeleteFromServerDate = session.DeleteFromServerDate;
                log.LastUpdate = DateTime.Now;
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;           
        }

        public bool DeleteSessionLog(string Session)
        {
            try
            {
                LogSeance log = GetLogSeance(Session);

                log.DeleteFromServerDate = DateTime.Now;
                log.LastUpdate = DateTime.Now;
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public bool CheckSessionIsInLog(LogSeance LogS)
        {
            List<LogSeance> listSession = (from x in Activity
                                           where x.Session == LogS.Session
                                           select x).ToList();
            if (listSession.Count > 0)
                return true;
            else
                return false;
        }

        private LogSeance GetLogSeance(string SessionNumber)
        {
            List<LogSeance> l = (from x in this.Activity
                                 where x.Session == SessionNumber
                                 select x).ToList();
            if (l.Count > 0)
                return l.First();
            else
                throw new System.Exception("Le numéro de Session n'existe pas");
        }

        //public void RegisterDownloadInComsumptionLog(ObservableCollection<ProgressInfo.TockensBySession> ListTockensBySession)
        //{
        //    try
        //    {
        //        foreach (ProgressInfo.TockensBySession tockensBySession in ListTockensBySession)
        //        {
        //            foreach (ProgressInfo.TockensByDate tockensByDate in tockensBySession.ListTockensByDate)
        //            {
        //                Consumption c = new Consumption();
        //                c.Action = Consumption.ActionTypeEnum.Download;
        //                c.Date = tockensByDate.Day;
        //                c.RegisterDate = DateTime.Now;
        //                c.NbTockens = -tockensByDate.TockensCount;
        //                c.NbJudges = (int)Math.Round(tockensByDate.TockensCount);
        //                c.SessionCode = tockensBySession.SessionCode; 

        //                this.Consumptions.Add(c);
        //            }                   
        //        }
               
        //        //mise à jour du nombre de tockens total de la licence
        //        //this.TockenCount -= ListTockens.Values.Sum();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        public void DebiteTocken(double TockenCount, Consumption.ActionTypeEnum Action, string SessionCode)
        {
            try
            {
                if (this.TockenCount >= TockenCount)
                {
                    Consumption c = new Consumption();
                    c.Action = Action;
                    c.Date = DateTime.Now;
                    c.RegisterDate = DateTime.Now;
                    c.NbTockens = -TockenCount;
                    c.SessionCode = SessionCode;

                    this.Consumptions.Add(c);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [OnSerializing]
        public void OnSerializing(StreamingContext context)
        {
            if (this.RegistrationDate == DateTime.MinValue)
            {
                this.RegistrationDate = null;
            }
            if (this.LastAccess == DateTime.MinValue)
            {
                this.LastAccess = null;
            }
            if (this.PurchaseDate == DateTime.MinValue)
            {
                this.PurchaseDate = null;
            }
            if (this.ExpirationDate == DateTime.MinValue)
            {
                this.ExpirationDate = null;
            }
        }
    }

    public class LogSeance
    {
        public DateTime? LogDate;
        public DateTime? DeploymentDate;
        public DateTime? LastUpdate;
        public string Session;
        public int NbSubject;
        public DateTime? ExpirationDate;
        public DateTime? DeleteFromServerDate;
        public string InitialUploader;
        public ObservableCollection<LogDailyDataDetails> SessionDailyDataDetails;

        #region Constructors

        public LogSeance()
        {
            SessionDailyDataDetails = new ObservableCollection<LogDailyDataDetails>();          
        }

        public LogSeance(string session, DateTime? deploymentDate, DateTime? expirationDate, int nbSubject, string initialUploader)
        {
            Session = session;
            if(deploymentDate != null)
                DeploymentDate = (DateTime)deploymentDate;
            if(expirationDate != null)
                ExpirationDate = (DateTime)expirationDate;
            NbSubject = nbSubject;
            InitialUploader = initialUploader;
            SessionDailyDataDetails = new ObservableCollection<LogDailyDataDetails>();          
        }

        [OnSerializing]
        public void OnSerializing(StreamingContext context)
        {
            if (this.LogDate == DateTime.MinValue)
            {
                this.LogDate = null;
            }
            if (this.DeploymentDate == DateTime.MinValue)
            {
                this.DeploymentDate = null;
            }
            if (this.LastUpdate == DateTime.MinValue)
            {
                this.LastUpdate = null;
            }
            if (this.ExpirationDate == DateTime.MinValue)
            {
                this.ExpirationDate = null;
            }
            if (this.DeleteFromServerDate == DateTime.MinValue)
            {
                this.DeleteFromServerDate = null;
            }
        }

        #endregion

        public int NbSubjectsByDay
        {
            get
            {
                if (SessionDailyDataDetails.Count > 0)
                    return (from y in SessionDailyDataDetails
                            select y.NbActiveSubjects).Sum();
                else
                    return 0;
            }
            set { }
        }
        public int NbLineTotal
        {
            get
            {
                return (from x in SessionDailyDataDetails
                        select x.NbDataLine).Sum();

            }
            set { }
        }

        public bool SessionOnGoing
        {
            get
            {
                if (ExpirationDate < DateTime.Now)
                    return false;

                if (DeleteFromServerDate != null && DeleteFromServerDate < DateTime.Now)
                    return false;

                return true;
            }
            set { }
        }   
    }

    public class LogDailyDataDetails
    {
        public DateTime? Day;
        public int NbActiveSubjects;
        public List<LogDataDetails> ListDataDetails;

        #region constructors

        public LogDailyDataDetails()
        {
            Day = null;
            ListDataDetails = new List<LogDataDetails>();
        }

        public LogDailyDataDetails(DateTime d, int ActiveSubject)
        {
            ListDataDetails = new List<LogDataDetails>();
            NbActiveSubjects = ActiveSubject;
            Day = d;
        }

        public LogDailyDataDetails(DateTime date, int ActiveSubject, List<LogDataDetails> DataDetails)
        {
            ListDataDetails = DataDetails;
            NbActiveSubjects = ActiveSubject;
            Day = date;
        }

        #endregion

        public int NbDataLine
        {
            get
            {
                return (from x in ListDataDetails
                        select x.NbdataLine).Sum();
            }
            set { }
        }       
    }

    public class LogDataDetails
    {
        public string DataType;
        public int NbSubjects;
        public int NbdataLine;

        public LogDataDetails() { }
        public LogDataDetails(string dataType, int nbSubjects, int nbDataLine)
        {
            this.DataType = dataType;
            this.NbSubjects = nbSubjects;
            this.NbdataLine = nbDataLine;
        }
    }
}
