using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.ServiceModel;
using TimeSens.webservices.helpers;

namespace TimeSens.webservices.models
{
    public class Account
    {
        public Account()
        {
            this.AuthorizedApps = new List<string>();
            this.Country = "";
            this.FirstName = "";
            this.LastAccess = DateTime.Now;
            this.LastName = "";
            this.Login = "";
            this.Mail = "";
            this.Password = "";
            this.IsValid = false;
            this.PanelLeaderApplicationSettings = new PanelLeaderApplicationSettings();
        }

        public PanelLeaderApplicationSettings PanelLeaderApplicationSettings { get; set; }

        public List<string> AuthorizedApps { get; set; }
        
        public string Login { get; set; }

        public string Apps {
            get {
                return string.Join(",", AuthorizedApps);
            }
            set {
                string[] list = value.Split(',');
                AuthorizedApps = new List<string>(list);
            }
        }

        private string expiration;
        public string Expiration
        {
            get
            {
                return expiration;
            }
            set
            {
                int year = Convert.ToInt32(value.Substring(6, 4));
                int month = Convert.ToInt32(value.Substring(3, 2));
                int day = Convert.ToInt32(value.Substring(0, 2));
                ExpirationDate = new DateTime(year, month, day);
                expiration = ExpirationDate.ToString("dd/MM/yyyy");
            }
        }

        public string Password { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Organization { get; set; }

        public string Type { get; set; }

        public string Country { get; set; }

        public string Mail { get; set; }

        public DateTime LastAccess { get; set; }

        public DateTime RegistrationDate { get; set; }

        public DateTime ExpirationDate { get; set; }

        public bool IsValid { get; set; }

        public void Save(string accountDir, string hashKey)
        {
            string file = accountDir + this.Login + ".json";
            this.LastAccess = DateTime.Now;
            //TODO
            //Serializer.Serialize(this, file, hashKey);
        }

        public static Account Check(string login, string password, string accountDir, string hashKey, string app = "", string type = "")
        {
            //login = "mvisalli";

            string file = accountDir + login + ".json";

            //Account aa = new Account();
            //aa.AuthorizedApps = new List<string>();
            //aa.AuthorizedApps.Add("TimeSens");
            //aa.Country = "France";
            //aa.FirstName = "Michel";
            //aa.IsValid = true;
            //aa.LastAccess = DateTime.Now;
            //aa.LastName = "Visalli";
            //aa.Login = "mvisalli";
            //aa.Mail = "michel.visalli@inrae.fr";
            //aa.Organization = "INRAE - CSGA";
            //aa.PanelLeaderApplicationSettings = new PanelLeaderApplicationSettings();
            //aa.Password = "mi8Shib!1976";
            //aa.RegistrationDate = DateTime.Now;
            //aa.Type = "admin";
            //Serializer.Serialize(aa, file, hashKey);
            //return null;


            if (!File.Exists(file))
            {
                throw new FaultException(new FaultReason("INCORRECT_LOGIN"), new FaultCode("INCORRECT_LOGIN"));
            }


            Account a = Serializer.Deserialize<Account>(file, hashKey);


            if (a == null)
            {
                throw new FaultException(new FaultReason("CORRUPTED_ACCOUNT"), new FaultCode("CORRUPTED_ACCOUNT"));
            }

            //a.Save(accountDir, hashKey);

            if (a.Password != password)
            {
                throw new FaultException(new FaultReason("INCORRECT_PASSWORD"), new FaultCode("INCORRECT_PASSWORD"));
            }

            if (a.IsValid == false)
            {
                throw new FaultException(new FaultReason("LICENSE_NOT_VALIDATED"), new FaultCode("LICENSE_NOT_VALIDATED"));
            }

            if (a.ExpirationDate == null || a.ExpirationDate < DateTime.Now)
            {
                throw new FaultException(new FaultReason("EXPIRED_LICENSE"), new FaultCode("EXPIRED_LICENSE"));
            }
            
            if (app != "" && a.AuthorizedApps.Contains(app) == false)
            {
                throw new FaultException(new FaultReason("NOT_ALLOWED_TO_USE_THIS_APP"), new FaultCode("NOT_ALLOWED_TO_USE_THIS_APP"));
            }

            if (type != "" && a.Type != type)
            {
                throw new FaultException(new FaultReason("ADMIN_ONLY"), new FaultCode("ADMIN_ONLY"));
            }
            //TODO logConnexion(license);

            return a;
        }

        public static Account CheckTimeSens(string login, string password, string accountDir, string hashKey, string serverCode = null)
        {
            Account l = Account.Check(login, password, accountDir, hashKey, "TimeSens");

            if (serverCode != null)
            {
                if (SeanceHelper.IsSeanceOwner(login, serverCode) == false)
                {
                    throw new FaultException(new FaultReason("SESSION_OWNER_ONLY"), new FaultCode("SESSION_OWNER_ONLY"));
                }
            }
            return l;
        }

        public static string UpdateAccountAsUser(string accountDir, string hashKey, Account lic, string jsonLicense)
        {
            Account newL = Serializer.DeserializeFromString<Account>(jsonLicense);
            lic.Password = newL.Password;
            lic.FirstName = newL.FirstName;
            lic.LastName = newL.LastName;
            lic.Mail = newL.Mail;
            //lic.Society = newL.Society;
            lic.Country = newL.Country;
            //lic.Address = newL.Address;
            //lic.City = newL.City;
            //lic.ZipCode = newL.ZipCode;
            //lic.PhoneNumber = newL.PhoneNumber;
            lic.PanelLeaderApplicationSettings = newL.PanelLeaderApplicationSettings;
            lic.Save(accountDir, hashKey);
            return Serializer.SerializeToString(lic);
        }

        public static string DownloadAccounts(string accountDir, string hashKey)
        {
            List<Account> res = new List<Account>();

            foreach (string f in Directory.EnumerateFiles(accountDir))
            {
                Account a = Serializer.Deserialize<Account>(f, hashKey);
                res.Add(a);
            }

            //TODO : cryptage
            return Serializer.SerializeToString(res);
        }


        public static void UpdateAccounts(string accountDir, string hashKey, string list)
        {
            List<Account> List = Serializer.DeserializeFromString<List<Account>>(list, hashKey);
            foreach (Account cb in List)
            {
                string file = accountDir + "//" + cb.Login + ".json";
                Account a;
                if (File.Exists(file))
                {
                    a = Serializer.Deserialize<Account>(file, hashKey);
                } else
                {
                    a = new Account();
                    a.Login = cb.FirstName.Substring(0,1).ToLower() + cb.LastName.ToLower();
                    int index = 0;
                    while (File.Exists(file))
                    {
                        index++;
                        a.Login = cb.FirstName.Substring(0, 1).ToLower() + cb.LastName.ToLower() + index;
                        file = accountDir + "//" + a.Login + ".json";
                    }
                    file = accountDir + "//" + a.Login + ".json";
                }
                a.IsValid = cb.IsValid;
                a.AuthorizedApps = cb.AuthorizedApps;
                a.FirstName = cb.FirstName;
                a.LastName = cb.LastName;
                a.Mail = cb.Mail;
                a.Password = cb.Password;
                a.Type = cb.Type;
                a.Organization = cb.Organization;
                a.Expiration = cb.Expiration;
                Serializer.Serialize(a, file, hashKey);
            }
        }

    }

}
