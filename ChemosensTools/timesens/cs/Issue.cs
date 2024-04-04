using System;
using System.Collections.ObjectModel;

namespace TimeSens.webservices.models
{
    public class Issue
    {
        public enum CategUserEnum { Admin, Developer, User, Guest }

        public enum TypeEnum { Defect, Enhancement, Question, Cosmetic }

        public enum TagEnum { Security, Performance, Usability, Maintainability }

        public enum SeverityEnum { Critical, High, Medium, Low }

        public enum StatusEnum { New, Accepted, Started, Repaired }

        public enum ModuleEnum { PanelLeader, Panelist, RLibrary, WebSite }

        public enum OSEnum { Windows, MacOSX, Linux }

        public enum BrowserEnum { InternetExplorer, Firefox, Opera, Chrome, Other }

        public int? Id { get; set; }

        public string OwnerPseudo { get; set; }

        public string Owner { get; set; }

        public ObservableCollection<string> ListMails { get; set; }

        public string Reader { get; set; }

        public CategUserEnum OwnerCateg { get; set; }

        public DateTime? CreationDate { get; set; }

        public DateTime? LastUpdateDate { get; set; }

        public TypeEnum? Type { get; set; }

        public ObservableCollection<TagEnum> ListTags { get; set; }

        public StatusEnum Status { get; set; }

        public SeverityEnum? Severity { get; set; }

        public ModuleEnum? Module { get; set; }

        public string AssignTo { get; set; }

        public OSEnum? OS { get; set; }

        public BrowserEnum? Browser { get; set; }

        public bool IsVisibleToAllReaders { get; set; }

        public string Title { get; set; }

        public string TimeSensVersion { get; set; }

        public string Detail { get; set; }

        public ObservableCollection<Reply> ListReplies { get; set; }

        public Issue()
        {
            Id = null;
            Owner = null;
            OwnerPseudo = null;
            Reader = null;
            OwnerCateg = CategUserEnum.Guest;
            CreationDate = LastUpdateDate = DateTime.Now;
            Type = null;
            Status = StatusEnum.New;
            Severity = null;
            Module = null;
            AssignTo = null;
            OS = null;
            Browser = null;
            Title = null;
            Detail = null;
            ListTags = new ObservableCollection<TagEnum>();
            ListReplies = new ObservableCollection<Reply>();
            ListMails = new ObservableCollection<string>();
            IsVisibleToAllReaders = true;
        }

        public class Reply
        {
            public DateTime? Date { get; set; }

            public string Author { get; set; }

            public CategUserEnum AuthorCateg { get; set; }

            public string Content { get; set; }

            public Reply()
            {
                Date = DateTime.Now;
                Author = null;
                AuthorCateg = CategUserEnum.Guest;
            }
        }
    
}
}