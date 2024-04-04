using System;

namespace TimeSens.webservices.models
{
    public class AuthorizedDates
    {
        public DateTime? BeginDate { get; set; }

        public DateTime? EndDate { get; set; }

        public AuthorizedDates()
        {
            BeginDate = DateTime.Now;
            EndDate = DateTime.Now.AddDays(1);
        }
    }
}