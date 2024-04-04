using System;
using System.Runtime.Serialization;
using System.Collections.ObjectModel;
using System.Linq;
using System.Collections.Generic;

namespace TimeSens.webservices.models
{

    public class PanelLeaderApplicationSettings
    {
        public bool LicenceWarningEnabled { get; set; }
        public bool DatabaseSynchronization { get; set; }
        public bool Autosave { get; set; }
        public string ConnectionToken { get; set; }
        public string Language { get; set; }
        public string ReturnMailAddress { get; set; }
        public string DisplayName { get; set; }
    }

}
