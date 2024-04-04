using System;
using System.Collections.ObjectModel;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel;
using System.Runtime.Serialization;


namespace TimeSens.webservices.models
{
    public enum Screentype { Begin, End, Repeated, NonRepeated }; // Begin et End gardé pour compatibilité

    public class Screen 
    {
        public Screentype Type {get;set;}   
        public int Id {get;set;}
        public int ExperimentalDesignId { get; set; }
       
        public Condition ListConditions { get; set; }
        public List<object> Controls { get; set; }
        public object Background { get; set; }

        private string resolution;
        public string Resolution
        {
            get { return resolution; }
            set
            {
                resolution = value;
            }
        }

        public Screen()
        {          
            Type = Screentype.NonRepeated;
            XamlContent = "";
            ExperimentalDesignId = 0;
            IsConditionnal = false;
            IsSelected = true;
            ListConditions = new Condition();
            Resolution = "1:1";
        }

        [IgnoreDataMember]
        public List<string> ListResolutions
        {
            get { return new List<string>() { "1:1", "4:3", "16:9", "16:10" }; }
        }


        private bool isConditionnal;
        public bool IsConditionnal 
        {
            get { return isConditionnal; }
            set { isConditionnal = value;  }
        }

        private bool isRepeated;
        [IgnoreDataMember]
        public bool IsRepeated
        {
            get { return (Type == Screentype.Repeated); }
            set 
            { 
                if ((bool)value==true)
                {
                    Type = Screentype.Repeated;
                }
                else
                {
                    Type = Screentype.NonRepeated;
                    ExperimentalDesignId = 0;
                }
            }
        }

        public bool IsConditionnalAndRepeated
        {
            get { return IsConditionnal && IsRepeated; }
        }

        private bool isSelected;

        [IgnoreDataMember]
        public bool IsSelected
        {
            get { return isSelected; }
            set
            {
                isSelected = value;
            }
        }


        private int index;

        [IgnoreDataMember]
        public int Index
        {
            get { return index; }
            set
            {
                index = value;
            }
        }

        private string xamlContent;
        public string XamlContent
        {
            get { return xamlContent; }
            set
            {
                xamlContent = value;
            }
        }

        
    }

    public class Condition
    {
        public Condition()
        {
            IntakeConditions = new ObservableCollection<int>();
            ReplicateConditions = new ObservableCollection<int>();
            ProductConditions = new ObservableCollection<string>();
            AttributeConditions = new ObservableCollection<string>();
            SubjectConditions = new ObservableCollection<string>();
            ProductRankConditions = new ObservableCollection<int>();
            BlockConditions = new ObservableCollection<int>();
        }

        public ObservableCollection<int> ProductRankConditions { get; set; }
        public ObservableCollection<int> ReplicateConditions { get; set; }
        public ObservableCollection<int> IntakeConditions { get; set; }
        public ObservableCollection<int> BlockConditions { get; set; }
        public ObservableCollection<string> ProductConditions { get; set; }
        public ObservableCollection<string> AttributeConditions { get; set; }
        public ObservableCollection<string> SubjectConditions { get; set; }
    }
}