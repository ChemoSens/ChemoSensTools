using System;
using TimeSens.webservices.helpers;

namespace TimeSens.webservices.models
{
    /// <summary>
    /// Mesures (Temps, Score, Produit, Répétition) pour un sujet lors d'une répétition
    /// </summary>
    public partial class Data
    {
        public enum DataTypeEnum { None, Profile, TDS, Hedonic, ITIP, PSP, Question, Sorting, Napping, TriangleTest, ProgressiveProfile, Ranking, AFC3, Event, TOS, Ethologic, CATA, TCATA, DynamicLiking, TDL, FlashProfile, LongitudinalProfile, ProgressiveLiking, DynamicProfile, AlternatedProfile, TI, Emotion, FreeTextQuestion, MultipleAnswersQuestion, SingleAnswerQuestion, SpeechToText, Sentiment, BDM }

        public int DataControlId { get; set; }

        public DataTypeEnum Type { get; set; }

        public int Replicate { get; set; }

        public int Intake { get; set; }

        private string subjectCode;

        public string SubjectCode
        {
            get { return subjectCode; }
            set
            {
                if (value != null && value.Length > 0)
                {
                    subjectCode = StringHelper.RemoveDiacritics(value);
                }
                else
                {
                    subjectCode = value;
                }               
            }
        }

        private string productCode;

        public string ProductCode
        {
            get { return productCode; }
            set
            {
                if (value != null && value.Length > 0)
                {
                    productCode = StringHelper.RemoveDiacritics(value);
                }
                else
                {
                    productCode = value;
                }
            }
        }

        private string attributeCode;

        /// <summary>
        /// Si Type = Question, AttributeCode = identifiant de la question
        /// Si type = TriangleTest, AttributeCode = code du produit auquel est comparé le produit
        /// </summary>
        //[Required]
        public string AttributeCode
        {
            get { return attributeCode; }
            set
            {
                if (value != null && value.Length > 0)
                {
                    attributeCode = StringHelper.RemoveDiacritics(value);
                }
                else
                {
                    attributeCode = value;
                }
            }
        }        

        public Nullable<decimal> Time { get; set; }

        public Nullable<decimal> StandardizedTime { get; set; }

        public Nullable<decimal> Duration { get; set; }
        
        public Nullable<decimal> Score { get; set; }

        public Nullable<int> ProductRank { get; set; }

        public Nullable<int> AttributeRank { get; set; }

        public Nullable<DateTime> RecordedDate { get; set; }

        public string Session { get; set; }

        public Nullable<decimal> X { get; set; }

        public Nullable<decimal> Y { get; set; }

        public Nullable<decimal> Dataset { get; set; }

        public Nullable<decimal> MinScore { get; set; }

        public Nullable<decimal> MaxScore { get; set; }

        public string ControlName { get; set; }

        public string QuestionLabel { get; set; }

        /// <summary>
        /// Si Type = Napping ou Sorting, Group = groupe dans lequel le produit a été placé
        /// </summary>
        public string Group { get; set; }

        /// <summary>
        /// Si Type = Nappig ou Sorting, Description = description du groupe, séparateur = ;
        /// Si Type = Question, Description = réponse(s) à la question, séparateur = ;
        /// </summary>
        public string Description { get; set; }

        public DataStateTypeEnum State { get; set; }

        public enum DataStateTypeEnum { Fresh, Downloaded, Pending, Imported, Transformed }

        public Data()
        {
            this.AttributeCode = "";
            this.AttributeRank = null;
            this.Description = "";
            this.Group = "";
            this.ProductCode = "";
            this.ProductRank = null;
            this.RecordedDate = null;
            this.Replicate = 1;
            this.Intake = 1;
            this.Score = null;
            this.Session = "1";
            this.SubjectCode = "";
            this.Time = null;
            this.Type = DataTypeEnum.None;
            this.X = null;
            this.Y = null;
            this.QuestionLabel = null;
            this.State = DataStateTypeEnum.Fresh;
        }

        public bool IsEqual(Data d)
        {
            try
            {
                bool b = this.AttributeCode == d.AttributeCode
                    && this.Description == d.Description
                    && this.AttributeRank == d.AttributeRank
                    && this.DataControlId == d.DataControlId
                    && this.Description == d.Description
                    && this.Group == d.Group
                    && this.ProductCode == d.ProductCode
                    && this.ProductRank == d.ProductRank
                    && this.Replicate == d.Replicate
                    && this.Score == d.Score
                    && this.Session == d.Session
                    && this.SubjectCode == d.SubjectCode
                    && /*this.Time != null &&*/ this.Time == d.Time
                    && this.Type == d.Type
                    && /*this.X != null &&*/ this.X == d.X
                    && /*this.Y != null &&*/ this.Y == d.Y
                    && /*this.RecordedDate != null &&*/ this.RecordedDate.Value.Date == d.RecordedDate.Value.Date
                    && this.RecordedDate.Value.Hour == d.RecordedDate.Value.Hour
                    && this.RecordedDate.Value.Minute == d.RecordedDate.Value.Minute
                    && this.RecordedDate.Value.Second == d.RecordedDate.Value.Second
                    && /*this.QuestionLabel != null &&*/ this.QuestionLabel == d.QuestionLabel;

                return b;
            }
            catch
            {
                return false;
            }
        }

    }
}