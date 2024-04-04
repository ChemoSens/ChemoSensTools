namespace TimeSens.webservices.models
{
    public class AnonymousAccess
    {
        public bool IsEnabled { get; set; } // Depreciated
        public bool ForceEmail { get; set; }
        public string Password { get; set; }
        public enum ModeEnum { NotAuthorized, CreateJudgeAuto, UseExperimentalDesign }
        public string Mode;        
    }
}