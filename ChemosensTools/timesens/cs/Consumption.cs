using System;
using System.Runtime.Serialization;

namespace TimeSens.webservices.models
{
    public class Consumption
    {
        public DateTime? Date {get;set;}//date à laquelle les données ont été enregistré sur le serveur
        public DateTime? RegisterDate { get; set; }//date à laquelle on a enregistré la conso
        public double NbTockens { get; set; }
        public ActionTypeEnum Action { get; set; }
        public int? NbJudges { get; set; }
        public int? Data { get; set; }
        public string SessionCode { get; set; }
        public string NumFacture { get; set; }

        public enum ActionTypeEnum { Download, Purchase, Import, SMSSending, Subscription, Reset, AdminCreditDebit }

        public Consumption()
        {
        }

        [OnSerializing]
        public void OnSerializing(StreamingContext context)
        {
            if (this.Date == DateTime.MinValue)
            {
                this.Date = null;
            }
            if (this.RegisterDate == DateTime.MinValue)
            {
                this.RegisterDate = null;
            }
        }
    }
}