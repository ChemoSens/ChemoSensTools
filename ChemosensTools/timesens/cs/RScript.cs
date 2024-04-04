using System.Collections.ObjectModel;

namespace TimeSens.webservices.models
{
    public class RScript
    {
        public string Script;
        public string Data;
        public ObservableCollection<RScriptResult.Output> ListOutputs;


        public RScript()
        {
            ListOutputs = new ObservableCollection<RScriptResult.Output>();
        }
    }
}