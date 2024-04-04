using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace TimeSens.webservices.models
{
    public partial class RScriptResult
    {               
        public RScriptResult()
        {
            this.Name = "";
            this.Time = DateTime.Now.ToShortTimeString();
            this.Errors = new List<string>();
            this.Outputs = new ObservableCollection<Output>();
            this.IsSelected = false;
        }

        private string name;
        public string Name
        {
            get { return name; }
            set
            {
                name = value;
            }
        }

        private bool isSelected;
        public bool IsSelected
        {
            get { return isSelected; }
            set
            {
                isSelected = value;
            }
        }

        private string time;
        public string Time
        {
            get { return time; }
            set
            {
                time = value;
            }
        }
        
        public List<string> Errors
        {
            get;
            set;
        }

        public ObservableCollection<Output>Outputs
        {
            get;
            set;
        }

        public class Output
        {
            private bool isSelected;
            public bool IsSelected
            {
                get { return isSelected; }
                set
                {
                    isSelected = value;
                }
            }

            public Output()
            {
                this.IsSelected = false;
                this.BinaryContent = new byte[0];
                this.Description = "";
                this.Function = "";
                this.GeneratedName = "";
                this.Image = "";
                this.Name = "";
                this.Title = "";
                this.Type = "";
                this.Path = "";
            }

            public string Path
            {
                get;
                set;
            }
            
            public string Function
            {
                get;
                set;
            }

            private string title;
            public string Title
            {
                get { return title; }
                set
                {
                    title = value;
                }
            }

            private string type;

            public string Type
            {
                get
                {
                    return type;
                }
                set
                {
                    type = value;
                    Image = "/TimeSense;component/Assets/Images/16/file_extension_tmp.png";
                    if ("xaml" == type)
                    {
                        Image = "/TimeSense;component/Assets/Images/16/file_extension_png.png";
                    }
                    if ("csv" == type)
                    {
                        Image = "/TimeSense;component/Assets/Images/16/file_extension_xls.png";
                    }
                    if ("html" == type)
                    {
                        Image = "/TimeSense;component/Assets/Images/16/file_extension_html.png";
                    }
                    if ("wmf" == type)
                    {
                        Image = "/TimeSense;component/Assets/Images/16/file_extension_wmf.png";
                    }
                    if (Name == "log")
                    {
                        Image = "/TimeSense;component/Assets/Images/16/file_extension_log.png";
                    }
                }
            }

            public string Name
            {
                get;
                set;
            }

            public string GeneratedName
            {
                get;
                set;
            }

            private string description;
            public string Description
            {
                get { return description; }
                set
                {
                    description = value;
                }
            }


            private byte[] binaryContent;
            public byte[] BinaryContent
            {
                get { return binaryContent; }
                set
                {
                    binaryContent = value;
                }
            }

            //public bool IsSelected
            //{
            //    get;
            //    set;
            //}

            public string Image
            {
                get;
                set;
            }
        }
    }
}