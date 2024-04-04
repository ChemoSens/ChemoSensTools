using System;
using TimeSens.webservices.helpers;

namespace TimeSens.webservices.models
{
    /// <summary>
    /// This class is a Subject
    /// </summary>
    //[CustomValidation(typeof(ExistingCodeSubject), "IsValid")]
    public partial class Subject 
    {
        #region Fields

        public string CustomField1 { get; set; }
        public string CustomField2 { get; set; }
        public string CustomField3 { get; set; }

        private string code, firstName, password;

        #endregion

        public Subject()
        {
            this.Address = "";
            this.BirthDate = null;
            this.City = "";
            this.Code = "CODE";
            this.Country = "NR";
            this.EducationLevel = "NR";           
            this.FamilialStatus = "NR";
            this.FirstName = "";
            this.Gender = "NR";           
            this.LastName = "";           
            this.Mail = "";
            this.Notes = "";
            this.Password = "";
            this.Phone = "";
            this.ProfessionalActivity = "NR";
        }

        public enum GenderEnum { Male, Female, NR}       
        public enum EducationLevelEnum { PrimaryStudies, SecondaryStudies, GraduateStudies, NR }
        public enum ProfessionalActivityEnum { Student, Unemployed, Retired, Farmer, CraftmanOrMerchant, ExecutiveAndUpperIntellectualProfession, IntermediateProfession, Employee, Worker, Other, NR }
        public enum FamilialStatusEnum { Alone, Couple, AloneWithOneChild, AloneWithTwoOrMoreChild, CoupleWithOneChild, CoupleWithTwoOrMoreChild, NR }

        public string Code
        {
            get { return code; }
            set 
            {
                if (value == "NA") value = "N_A";
                code = StringHelper.RemoveTrimming0(StringHelper.RemoveDiacritics(value));
            }
        }

        /// <summary>
        /// Gets or sets the surname
        /// </summary>
        public string FirstName 
        {
            get { return firstName; }
            set { firstName = value; } 
        }

        /// Gets or sets the name
        /// </summary>
        public string LastName { get; set; }

        /// Gets or sets the name
        /// </summary>
        public string Password
        {
            get { return password; }
            set { password = value; }
        }

        /// Gets or sets the name
        /// </summary>        
        public string Country { get; set; }

        /// <summary>
        /// Gets or sets the mail
        /// </summary>
        public string Mail { get; set; }

        /// <summary>
        /// Gets or sets the phone
        /// </summary>
        public string Phone { get; set; }

        /// <summary>
        /// Gets or sets the adress
        /// </summary>
        public string City { get; set; }

        /// <summary>
        /// Gets or sets the adress
        /// </summary>
        public string Address { get; set; }       

        /// <summary>
        /// Gets or sets the birth date
        /// </summary>
        public Nullable<DateTime> BirthDate { get; set; }

        /// <summary>
        /// Gets or sets the gender
        /// </summary>

        public string Gender { get; set; }      

        /// <summary>
        /// Gets or sets the education level
        /// </summary>
        public string EducationLevel{ get; set; }

        public string ProfessionalActivity { get; set; }

        /// <summary>
        /// Gets or sets the marital status
        /// </summary>
        public string FamilialStatus { get; set; }      

        /// <summary>
        /// Gets or sets the notes
        /// </summary>
        public string Notes { get; set; }

        public Nullable<DateTime> LastUpdate { get; set; }


        //attribut qui sert lorsqu'on change le code d'un sujet dans le protocol alors qu'il est déjà déployé.
        //ça permet de faire la mise à jour du déploiement et de retrouver le fichier nommé avec l'ancien code.
        public string OldCode { get; set; }

        

        public static bool operator ==(Subject a, Subject b)
        {
            // If both are null, or both are same instance, return true.
            if (System.Object.ReferenceEquals(a, b))
            {
                return true;
            }

            // If one is null, but not both, return false.
            if (((object)a == null) || ((object)b == null))
            {
                return false;
            }

            // Return true if the fields match:
            return a.Address == b.Address 
                && a.BirthDate == b.BirthDate 
                && a.City == b.City 
                && a.Code == b.Code 
                && a.Country == b.Country 
                && a.EducationLevel == b.EducationLevel 
                && a.FamilialStatus == b.FamilialStatus
                && a.FirstName == b.FirstName
                && a.Gender == b.Gender
                && a.LastName == b.LastName
                && a.Mail == b.Mail
                && a.Notes == b.Notes
                && a.Password == b.Password
                && a.Phone == b.Phone
                && a.ProfessionalActivity == b.ProfessionalActivity;
        }

        public static bool operator !=(Subject a, Subject b)
        {
            return !(a == b);
        }

    }
}
