using System;
using System.Linq;
using System.Runtime.Serialization;
using System.Configuration;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Reflection;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

#pragma warning disable

namespace TimeSens.webservices.models
{
    public partial class SubjectSeance
    {
        public string Description { get; set; }

        public DateTime? UploadedDate { get; set; } // Date à laquelle la séance a été publiée

        public Nullable<DateTime> LastUpload { get; set; } // Dernière date à laquelle la séance a été uploadée depuis TS client

        public Access Access { get; set; }

        public Progress Progress { get; set; }

        public ObservableCollection<ExperimentalDesign> ListExperimentalDesigns { get; set; }

        public ObservableCollection<Screen> ListScreens { get; set; }

        public Subject Subject { get; set; }

        public string BrowserCheckMode { get; set; }

        public int UploadId { get; set; }

        public SubjectSeance()
        {
            this.Access = new Access();
            this.Progress = new Progress();
            this.ListScreens = new ObservableCollection<Screen>();
            this.Subject = new Subject();
            this.ListExperimentalDesigns = new ObservableCollection<ExperimentalDesign>();            
        }


    }

    public partial class TemplatedSubjectSeance : SubjectSeance
    {
        public ObservableCollection<Subject> ListSubjects { get; set; }

        public string ShowSubjectCodeOnClient { get; set; }

        public string UploadPassword { get; set; }

        public string Password { get; set; }

        public string Login { get; set; }

        public DateTime ExpirationDate { get; set; }

        public string MailPath { get; set; }

        public int MinTimeBetweenConnexions { get; set; }

        public string Culture { get; set; }

        public string ServerCode { get; set; }

        public ObservableCollection<AuthorizedDates> ListAuthorizedDates { get; set; }
    }

}