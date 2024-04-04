using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Runtime.Serialization;

#pragma warning disable

namespace TimeSens.webservices.models
{
    public partial class Progress
    {
        public Progress()
        {
            this.DisplayedScreenIndex = new ObservableCollection<int>(); ;
        }

        public ObservableCollection<Data> ListData { get; set; }

        public State CurrentState { get; set; }

        public ObservableCollection<int> DisplayedScreenIndex { get; set; }

        public string Notification { get; set; }

        public string ShowSubjectCodeOnClient { get; set; }

        public bool CanBeAddedToSubjectList()
        {
            return (this.ShowSubjectCodeOnClient == "NotFinished" || (this.ShowSubjectCodeOnClient == "NotStarted" && this.CurrentState != null && this.CurrentState.CurrentScreen == 0));
        }

        public class State
        {
            public int CurrentScreen { get; set; }

            public int CountScreen { get; set; }

            public bool? PanellistHasFinished { get; set; }

            public bool? MustBeDownloaded { get; set; }

            public Nullable<DateTime> LastAccess { get; set; }

            public string SubjectCode { get; set; }

            public string OS { get; set; }
            public string Browser { get; set; }
            public string Geolocation { get; set; }

            public string Issue { get; set; }

            public string ServerCode { get; set; }

            public string MailStatus { get; set; }

            public Nullable<DateTime> LastDownload { get; set; }
            public Nullable<DateTime> LastUpload { get; set; }

            public ActionTypeEnum LastAction { get; set; }

            public enum ActionTypeEnum { Panelleader, Panelist }

            public State()
            {
            }
        }
    }

    public class MonitoringProgress
    {
        public string SubjectCode;
        public string FirstName;
        public string LastName;
        public string LastAccess;
        public string Progress;
        public string MailStatus;
        public string URL;        
    }

    //public class MonitoringProgressReturn
    //{
    //    public ObservableCollection<MonitoringProgress> MonitoringProgress;
    //    public int AvailableTokens;
    //    public int RequiredTokens;
    //}

    public partial class MonitoringInfo
    {

        //[IgnoreDataMember]
        public ObservableCollection<MonitoringProgress> MonitoringProgress;
        //[IgnoreDataMember]
        //public ObservableCollection<TockensBySession> ListTockensBySession { get; set; }
        //public double AvailableTokens;
        public int RequiredTokens;
        public int DataCount;
        public ObservableCollection<string> Subjects;
        //public string Error { get; set; }        
        public ObservableCollection<string> Videos;
        public double VideosSize;
        public int AvailableTokens;
       

        public MonitoringInfo()
        {
            MonitoringProgress = new ObservableCollection<MonitoringProgress>();
            Videos = new ObservableCollection<string>();
            VideosSize = 0;
            RequiredTokens = 0;
            DataCount = 0;
            Subjects = new ObservableCollection<string>();
            //ListTockensBySession = new ObservableCollection<TockensBySession>();
        }

        //public ObservableCollection<MonitoringProgress> MonitoringProgress
        //{
        //    get
        //    {
        //        ObservableCollection<MonitoringProgress> res = new ObservableCollection<MonitoringProgress>();
        //        foreach (Progress p in ListProgress)
        //        {
        //            MonitoringProgress m = new MonitoringProgress();
        //            m.LastAccess = p.CurrentState.LastAccess.ToString();
        //            m.Progress = p.CurrentState.CurrentScreen + "/" + p.CurrentState.CountScreen;
        //            m.SubjectCode = p.CurrentState.SubjectCode;                    
        //            res.Add(m);
        //        }
        //        return res;
        //    }
        //}

        //public ObservableCollection<Data> ListData
        //{
        //    get
        //    {
        //        ObservableCollection<Data> res = new ObservableCollection<Data>();
        //        foreach (Progress p in ListProgress)
        //        {
        //            foreach (Data d in p.ListData) {
        //                res.Add(d);
        //            }
        //        }
        //        return res;
        //    }
        //}

        //public double TockensCount
        //{
        //    get
        //    {
        //        try
        //        {
        //            double Count = 0;
        //            foreach (TockensBySession T in ListTockensBySession)
        //            {
        //                Count += T.TockensCount;
        //            }

        //            return Count;
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //    }
        //    set { }
        //}

        //public int DataCount
        //{
        //    get
        //    {
        //        try
        //        {
        //            int Count = 0;
        //            foreach (Progress p in ListProgress)
        //            {
        //                Count += p.ListData.Count;
        //            }

        //            return Count;
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //    }
        //    set { }
        //}

        //public partial class TockensBySession
        //{
        //    public string SessionCode { get; set; }
        //    public ObservableCollection<TockensByDate> ListTockensByDate { get; set; }

        //    public TockensBySession()
        //    {
        //        ListTockensByDate = new ObservableCollection<TockensByDate>();
        //    }

        //    public TockensBySession(string Session)
        //    {
        //        ListTockensByDate = new ObservableCollection<TockensByDate>();
        //        SessionCode = Session;
        //    }

        //    public double TockensCount
        //    {
        //        get
        //        {
        //            try
        //            {
        //                return (from x in ListTockensByDate
        //                        select x.TockensCount).Sum();
        //            }
        //            catch (Exception ex)
        //            {
        //                throw ex;
        //            }
        //        }
        //        set { }
        //    }

        //    public void AddTocken(DateTime d)
        //    {
        //        bool found = false;
        //        foreach (TockensByDate T in ListTockensByDate)
        //        {
        //            if (((DateTime)T.Day).Date == d.Date)
        //            {
        //                T.TockensCount++;
        //                found = true;
        //                break;
        //            }
        //        }
        //        if (!found)
        //            this.ListTockensByDate.Add(new TockensByDate(d));
        //    }

        //}

        public partial class TockensByDate
        {
            public DateTime? Day { get; set; }
            public double TockensCount { get; set; }

            public TockensByDate()
            {
                Day = new DateTime();
                TockensCount = 0;
            }

            public TockensByDate(DateTime d)
            {
                Day = d;
                TockensCount = 1;
            }
        }
    }
}
