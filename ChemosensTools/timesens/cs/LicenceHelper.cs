using System;
using System.Configuration;
using System.IO;
using System.ServiceModel;
using System.Collections.ObjectModel;
using TimeSens.webservices.models;

namespace TimeSens.webservices.helpers
{
    public class LicenceHelper
    {
        //public static Semaphore SemUpdateLicence = new Semaphore(1, 1);
        /// <summary>
        /// Clé de cryptage/décryptage
        /// </summary>
        /// 
        private static string hashKey = ConfigurationManager.AppSettings["EncryptKey"];

        /// <summary>
        /// Renvoie un booléen qui confirme si l'utilisateur est authentifié
        /// </summary>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public static bool Authentificate(string login, string password, bool LogConnexion = false)
        {
            License license = GetLicense(login, password);
            if (license != null && authentificate(license, login, password, "", LogConnexion))
            {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Renvoie un booléen qui vérifie si l'utilisateur fait partie du groupe administrateur
        /// </summary>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public static bool IsAdmin(string login, string password)
        {
            try
            {
                License l = GetAuthentificateLicense(login, password);
                if (l.NewLicenseType == License.NewLicenseTypeEnum.Admin)
                {
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Renvoie la licence actuelle d'un utilisateur authentifié
        /// </summary>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public static License GetAuthentificateLicense(string login, string password, string motherboardSerial = "", bool checkExpirationDate=false)
        {
            try
            {
                License license = GetLicense(login, password);
                if (license != null && authentificate(license, login, password, motherboardSerial, checkExpirationDate))
                {
                    return license;
                }
                return null;
            }
            catch (FaultException ex)
            {
                //TODO
                //LogHelper.LogException(ex, "LicenceHelper");
                throw ex;
            }
        }

        /// <summary>
        /// Mise à jour de la licence après un upload
        /// </summary>
        /// <param name="license"></param>
        /// <param name="subjectsCount"></param>
        public static void LogUpload(string login, string password, int subjectsCount, string Session, DateTime Expiration)
        {
            License license = GetLicense(login, password);
            license.LogSessionInLicence(Session, subjectsCount, DateTime.Now, Expiration, login);
            LicenceHelper.SaveLicenceFile(license, true);
        }

        //public static bool UpdateLogDailyDetails(string login, string password, LogSeance session, ObservableCollection<LogDailyDataDetails> Details)
        //{
        //    License license = GetLicense(login, password);

        //    if (!license.CheckSessionIsInLog(session))
        //        license.LogSessionInLicence(session.Session, session.NbSubject, session.DeploymentDate, session.ExpirationDate, session.InitialUploader);

        //    bool ok = license.UpdateSessionDataLog(session.Session, Details);

        //    if (ok)
        //        LicenceHelper.SaveLicenceFile(license, true);

        //    return ok;
        //}

        //public static bool UpdateLogSession(string login, string password, LogSeance session)
        //{
        //    License license = GetLicense(login, password);

        //    bool ok = true;

        //    //si la séance a été uploadé par une autre licence, on recréé le log dans cette licence.
        //    if (!license.CheckSessionIsInLog(session))
        //        license.LogSessionInLicence(session.Session, session.NbSubject, session.DeploymentDate, session.ExpirationDate, session.InitialUploader, session.DeleteFromServerDate);
        //    else
        //        ok = license.UpdateSessionLog(session);

        //    if (ok)
        //        LicenceHelper.SaveLicenceFile(license, true);

        //    return ok;
        //}

        //public static bool DeleteLogSession(string login, string password, string Session)
        //{
        //    License license = GetLicense(login, password);

        //    bool ok = license.DeleteSessionLog(Session);

        //    if (ok)
        //        LicenceHelper.SaveLicenceFile(license, true);

        //    return ok;
        //}

        public static bool LicenseExists(string login)
        {
            string file = ConfigurationManager.AppSettings["LicenseFileDirPath"].ToString() + login + ".xml";

            // Vérification : fichier xml existe
            return File.Exists(file);
        }

        public static bool RemoveLicenceFile(License lic)
        {
            try
            {
                string file = ConfigurationManager.AppSettings["LicenseFileDirPath"].ToString() + lic.Login + ".xml";


                // Vérification : fichier xml existe
                if (File.Exists(file))
                {
                    File.Delete(file);
                    return true;
                }
                else
                {
                    throw new FaultException(new FaultReason("DELETE_LICENSE_FAILURE"), new FaultCode("DELETE_LICENSE_FAILURE"));
                }
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "SeanceService");
                throw new FaultException(new FaultReason("DELETE_LICENSE_FAILURE"), new FaultCode("DELETE_LICENSE_FAILURE"));
            }
        }

        public static License GetLicense(string login, string password, bool checkPassword = true)
        {
            

            string file = getLicenseFile(login);

            // Désérialisation du fichier XML
            License license;
            try
            {
                license = Serializer.Deserialize<License>(file, hashKey);
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "SeanceService");
                throw new FaultException(new FaultReason("UNEXPECTED_ERROR"), new FaultCode("UNEXPECTED_ERROR"));
            }
            if (checkPassword && license.Password != password)
            {
                throw new FaultException(new FaultReason("INCORRECT_PASSWORD"), new FaultCode("INCORRECT_PASSWORD"));
            }

            return license;
        }

        public static string getLicenseFile(string login)
        {
            string file = ConfigurationManager.AppSettings["LicenseFileDirPath"].ToString() + login + ".xml";

            // Vérification : fichier xml existe
            if (!File.Exists(file))
            {
                throw new FaultException(new FaultReason("INCORRECT_LOGIN"), new FaultCode("INCORRECT_LOGIN"));
            }

            return file;
        }

        private static bool authentificate(License license, string login, string password, string motherboardSerial = "", bool checkExpirationDate = true, bool LogConnex = false)
        {
            // Vérification du mot de passe
            if (license.Password != password)
            {
                throw new FaultException(new FaultReason("INCORRECT_PASSWORD"), new FaultCode("INCORRECT_PASSWORD"));
            }

            if (checkExpirationDate == true && (license.ExpirationDate == null || license.ExpirationDate < DateTime.Now))
            {
                throw new FaultException(new FaultReason("EXPIRED_LICENSE"), new FaultCode("EXPIRED_LICENSE"));
            }

            if (!(license.Validated == true))
            {
                throw new FaultException(new FaultReason("LICENSE_NOT_VALIDATED"), new FaultCode("LICENSE_NOT_VALIDATED"));
            }

            //if (motherboardSerial.Length > 0)
            //{
            //    //if (license.ListAuthorizedMAC.Count == 0)
            //    if (license.ListAuthorizedMAC.Count < license.NbConcurrentAccess)
            //    {
            //        license.ListAuthorizedMAC.Add(motherboardSerial);
            //        SaveLicenceFile(license);
            //    }
            //    if (!license.ListAuthorizedMAC.Contains(motherboardSerial))
            //    {
            //        throw new FaultException(new FaultReason("LicenseNotValidOnThisComputer"), new FaultCode("LicenseNotValidOnThisComputer"));
            //    }
            //}

            if (LogConnex)
            {
                logConnexion(license);
            }

            return true;
        }

        private static void logConnexion(License license)
        {
            string file = getLicenseFile(license.Login);

            // Incrémente le nombre de connexions dans le fichier licenses.xml
            license.ActualConnexions++;
            license.LastAccess = DateTime.Now;

            // Enregistrement
            Serializer.Serialize(license, file, hashKey);
        }

        public static bool ValidateLicense(string licenseLogin)
        {
            try
            {
                License l = LicenceHelper.GetLicense(licenseLogin, "", false);
                l.Validated = true;
                l.ExpirationDate = DateTime.Now.AddDays(30);
                l.NewLicenseType = License.NewLicenseTypeEnum.Demo;
                LicenceHelper.SaveLicenceFile(l);
                return true;
            }
            catch
            {
                throw new FaultException(new FaultReason("VALIDATE_LICENSE_ERROR"), new FaultCode("VALIDATE_LICENSE_ERROR"));
            }
        }

        // Pour test
        public static bool IsAdminToken(string id)
        {
            if (ConfigurationManager.AppSettings["IdForTest"] == id.Replace("#", ""))
            {
                return true;
            }
            return false;
        }

        // Pour test
        public static bool DeleteAccountAsTest(string id, string licenseLogin)
        {
            if (IsAdminToken(id))
            {
                License l = LicenceHelper.GetLicense(licenseLogin, "", false);
                LicenceHelper.RemoveLicenceFile(l);
                return true;
            }
            return false;
        }

        public static bool DeleteAccountAsAdmin(string licenseLogin)
        {
            License l = LicenceHelper.GetLicense(licenseLogin, "", false);
            LicenceHelper.RemoveLicenceFile(l);
            return true;
        }

        private static string createAccount(License lic, bool sendMail, string lang)
        {
            if (lic.FirstName.Length <= 2 && lic.LastName.Length <= 2)
            {
                throw new FaultException(new FaultReason("INVALID_LICENSE_INFO"), new FaultCode("INVALID_LICENSE_INFO"));
            }
            string login = lic.FirstName.Substring(0, 1).ToLower() + lic.LastName.ToLower().Replace(" ", String.Empty).RemoveDiacritics();

            if (login.Length > 15)
                login = login.Substring(0, 15);

            if (LicenceHelper.LicenseExists(login))
            {
                int i = 1;
                while (LicenceHelper.LicenseExists(login + i.ToString()))
                {
                    i++;
                }
                login = login + i.ToString();
            }

            lic.Login = login;

            SaveLicenceFile(lic, false);

            if (sendMail)
            {
                // Message au client
                string body = "<p>" + LocalizationHelper.Localize("DearTimeSensUser", lang) + ",</p>";
                body += "<p>" + LocalizationHelper.Localize("RegisterMailMessage", lang) + " </p>";
                body += "<p><strong>" + LocalizationHelper.Localize("Id", lang) + ": " + lic.Login + " </strong></p>";
                body += "<p><strong>" + LocalizationHelper.Localize("Password", lang) + ": " + lic.Password + " </strong></p>";
                body += "<p align='right'><strong>" + LocalizationHelper.Localize("TheTimeSensTeam", lang) + " </strong></p>";
                MailHelper.SendMail(LocalizationHelper.Localize("AutomaticMailFromTimeSens", lang), lic.Mail, LocalizationHelper.Localize("NewTimeSensAccount", lang), body);

                // Message au compte timeSens
                body = "";
                if (lic.RegistrationDate != null)
                {
                    body += "le " + ((DateTime)lic.RegistrationDate).Day + "/" + ((DateTime)lic.RegistrationDate).Month + "/" + ((DateTime)lic.RegistrationDate).Year + "<br/><br/>";
                }
                body += "Prénom : " + lic.FirstName + "<br/>";
                body += "Nom : " + lic.LastName + "<br/>";
                body += "Société : " + lic.Society + "<br/>";
                body += "Mail : " + lic.Mail + "<br/><br/>";
                body += "Téléphone : " + lic.PhoneNumber + "<br/><br/>";
                body += "Addresse : " + lic.Address + "<br/><br/>";
                body += "Ville : " + lic.City + "<br/><br/>";
                body += "Pays : " + lic.Country + "<br/><br/>";
                body += "<a href='http://www.timesens.com/tools.aspx'>http://www.timesens.com/tools.aspx</a>";
                MailHelper.SendMail("Mail automatique de TimeSens", ConfigurationManager.AppSettings["NewOrderMail"], "Nouveau compte TimeSens", body);
            }

            return Serializer.SerializeToString(lic);
        }

        // Pour test
        public static string CreateAccountAsTest(string id, string jsonLicense)
        {
            if (IsAdminToken(id))
            {
                License l = Serializer.DeserializeFromString<License>(jsonLicense);
                return createAccount(l, false, "");
            }
            throw new FaultException(new FaultReason("ADMIN_ONLY"), new FaultCode("ADMIN_ONLY"));
        }

        public static string CreateAccountAsUser(string jsonLicense, bool sendMail, string lang)
        {
            License l = Serializer.DeserializeFromString<License>(jsonLicense);
            //l.ListAuthorizedMAC = new ObservableCollection<string>();
            l.NewLicenseType = License.NewLicenseTypeEnum.Undefined;
            l.Validated = true;
            l.RegistrationDate = DateTime.Now;
            l.TockenCount = 0;
            return createAccount(l, sendMail, lang);
        }

        public static string CreateAccountAsAdmin(string jsonLicense, bool sendMail, string lang)
        {
            License l = Serializer.DeserializeFromString<License>(jsonLicense);
            return createAccount(l, sendMail, lang);
        }

        public static string UpdateAccountAsAdmin(string jsonLicense)
        {
            License l = Serializer.DeserializeFromString<License>(jsonLicense);
            LicenceHelper.SaveLicenceFile(l);
            return Serializer.SerializeToString(l);
        }

        public static string UpdateAccountAsUser(License lic, string jsonLicense)
        {
            License newL = Serializer.DeserializeFromString<License>(jsonLicense);
            lic.Password = newL.Password;
            lic.FirstName = newL.FirstName;
            lic.LastName = newL.LastName;
            lic.Mail = newL.Mail;
            lic.Society = newL.Society;
            lic.Country = newL.Country;
            lic.Address = newL.Address;
            lic.City = newL.City;
            lic.ZipCode = newL.ZipCode;
            lic.PhoneNumber = newL.PhoneNumber;
            lic.PanelLeaderApplicationSettings = newL.PanelLeaderApplicationSettings;
            SaveLicenceFile(lic, false);
            return Serializer.SerializeToString(lic);
        }

        public static string GetLicenseFromWebsite(string login, string password)
        {
            try
            {
                //License license = LicenceHelper.GetAuthentificateLicense(login, password);
                License license = LicenceHelper.GetLicense(login, password);
                if (license != null)
                {
                    return Serializer.SerializeToString(license, null);
                }
                return null;
            }
            catch (FaultException ex)
            {
                if (ex is FaultException)
                {
                    throw (FaultException)ex;
                }
                else
                {
                    //TODO
                    //LogHelper.LogException(ex, "LogService");
                    throw new FaultException(new FaultReason("Unexpected error"), new FaultCode("UNEXPECTED_ERROR"));
                }
            }
        }

        //public static bool SaveLicenceFile(License lic, bool CheckIfExists = false)
        //{
        //    try
        //    {
        //        string file = ConfigurationManager.AppSettings["LicenseFileDirPath"].ToString() + lic.Login + ".xml";

        //        if (CheckIfExists)
        //        {
        //            // Vérification : fichier xml existe
        //            if (File.Exists(file))
        //            {
        //                Serializer.Serialize(lic, file, hashKey);
        //                return true;
        //            }
        //            else
        //            {
        //                throw new FaultException(new FaultReason("INCORRECT_LOGIN_OR_PASSWORD"), new FaultCode("INCORRECT_LOGIN_OR_PASSWORD"));
        //            }
        //        }
        //        else
        //        {
        //            Serializer.Serialize(lic, file, hashKey);
        //            return true;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.LogException(ex, "SeanceService");
        //        throw new FaultException(new FaultReason("SAVE_LICENSE_FAILURE"), new FaultCode("SAVE_LICENSE_FAILURE"));
        //    }
        //}

        public static ObservableCollection<License> GetLicenses()
        {
            try
            {
                ObservableCollection<License> list = new ObservableCollection<License>();

                // Lecture des licences
                DirectoryInfo di = new DirectoryInfo(ConfigurationManager.AppSettings["LicenseFileDirPath"].ToString());
                FileInfo[] rgFiles = di.GetFiles("*.xml");
                foreach (FileInfo fi in rgFiles)
                {
                    try
                    {
                        string file = ConfigurationManager.AppSettings["LicenseFileDirPath"].ToString() + fi.Name;
                        if (File.Exists(file))
                        {
                            // Décryptage de la licence
                            License l = Serializer.Deserialize<License>(file, hashKey);
                            list.Add(l);
                        }
                    }
                    catch (Exception ex)
                    {
                        //TODO
                        //LogHelper.LogException(ex, "LogService");
                    }
                }
                return list;
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "LogService");
                throw new FaultException(new FaultReason("GET_ALL_LICENSES_FAILURE"), new FaultCode("GET_ALL_LICENSES_FAILURE"));
            }
        }

        public static bool SaveLicenceFile(License lic, bool CheckIfExists = false)
        {
            try
            {
                string file = ConfigurationManager.AppSettings["LicenseFileDirPath"].ToString() + lic.Login + ".xml";

                if (CheckIfExists)
                {
                    // Vérification : fichier xml existe
                    if (File.Exists(file))
                    {
                        Serializer.Serialize(lic, file, hashKey);
                        return true;
                    }
                    else
                    {
                        throw new FaultException(new FaultReason("INCORRECT_LOGIN_OR_PASSWORD"), new FaultCode("INCORRECT_LOGIN_OR_PASSWORD"));
                    }
                }
                else
                {
                    Serializer.Serialize(lic, file, hashKey);
                    return true;
                }

            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "SeanceService");
                throw new FaultException(new FaultReason("SAVE_LICENSE_FAILURE"), new FaultCode("SAVE_LICENSE_FAILURE"));
            }
        }

        public static void RemindForgottenPassword(string email, string lang, bool sendMail)
        {
            // Lecture des licences
            DirectoryInfo di = new DirectoryInfo(ConfigurationManager.AppSettings["LicenseFileDirPath"].ToString());
            FileInfo[] rgFiles = di.GetFiles("*.xml");
            foreach (FileInfo fi in rgFiles)
            {
                try
                {
                    string file = ConfigurationManager.AppSettings["LicenseFileDirPath"].ToString() + fi.Name;
                    if (File.Exists(file))
                    {
                        // Décryptage de la licence
                        License l = Serializer.Deserialize<License>(file, hashKey);
                        if (l.Mail == email)
                        {
                            // Message au client
                            string body = "<p>" + LocalizationHelper.Localize("DearTimeSensUser", lang) + ",</p>";
                            body += "<p>" + LocalizationHelper.Localize("PasswordReminderMailMessage", lang) + " </p>";
                            body += "<p><strong>" + LocalizationHelper.Localize("Login", lang) + ": " + l.Login + " </strong></p>";
                            body += "<p><strong>" + LocalizationHelper.Localize("Password", lang) + ": " + l.Password + " </strong></p>";
                            body += "<p align='right'><strong>" + LocalizationHelper.Localize("TheTimeSensTeam", lang) + " </strong></p>";
                            if (sendMail)
                            {
                                MailHelper.SendMail(LocalizationHelper.Localize("AutomaticMailFromTimeSens", lang), l.Mail, LocalizationHelper.Localize("YourAccountInformation", lang), body);
                            }
                            return;
                        }
                    }
                }
                catch (Exception)
                {
                }
            }
            throw new FaultException(new FaultReason("REMIND_FORGOTTEN_LICENSE_FAILURE"), new FaultCode("REMIND_FORGOTTEN_LICENSE_FAILURE"));
        }

        public static void ResetLicenseMAC(License license)
        {
            try
            {
                //license.ListAuthorizedMAC = new ObservableCollection<string>();
                license.PanelLeaderApplicationSettings.ConnectionToken = "";
                SaveLicenceFile(license);
            }
            catch
            {
                throw new FaultException(new FaultReason("RESET_LICENSE_MAC"), new FaultCode("RESET_LICENSE_MAC"));
            }
        }

        //public static string UpdateLicense(string login, string password, string newPassword, string firstName, string lastName, string mail, string society, string country, string address, string city, string zip, string phone)
        //{
        //    //try
        //    //{
        //    License license = LicenceHelper.GetAuthentificateLicense(login, password);
        //    if (license == null)
        //    {
        //        throw new FaultException(new FaultReason("UPDATE_LICENSE_ERROR"), new FaultCode("UPDATE_LICENSE_ERROR"));
        //    }

        //    return updateLicense(license, newPassword, firstName, lastName, mail, society, country, address, city, zip, phone);

        //    //    if (license != null)
        //    //    {
        //    //        license.Password = newPassword;
        //    //        license.FirstName = firstName;
        //    //        license.LastName = lastName;
        //    //        license.Mail = mail;
        //    //        license.Society = society;
        //    //        license.Country = country;
        //    //        license.Address = address;
        //    //        license.City = city;
        //    //        license.ZipCode = zip;
        //    //        license.PhoneNumber = phone;
        //    //        SaveLicenceFile(license);
        //    //        return Serializer.SerializeToString(license, null);
        //    //    }
        //    //    throw new FaultException(new FaultReason("Unexpected error"), new FaultCode("UNEXPECTED_ERROR"));
        //    //}
        //    //catch (FaultException ex)
        //    //{
        //    //    if (ex is FaultException)
        //    //    {
        //    //        throw (FaultException)ex;
        //    //    }
        //    //    else
        //    //    {
        //    //        LogHelper.LogException(ex, "LogService");
        //    //        throw new FaultException(new FaultReason("Unexpected error"), new FaultCode("UNEXPECTED_ERROR"));
        //    //    }
        //    //}
        //}

        //private static string updateLicense(License lic, string newPassword, string firstName, string lastName, string mail, string society, string country, string address, string city, string zip, string phone, double? tokens = null, int? licenseType = null, DateTime? expirationDate = null, string mac = null, bool? validated = null)
        //{
        //    lic.Password = newPassword;
        //    lic.FirstName = firstName;
        //    lic.LastName = lastName;
        //    lic.Mail = mail;
        //    lic.Society = society;
        //    lic.Country = country;
        //    lic.Address = address;
        //    lic.City = city;
        //    lic.ZipCode = zip;
        //    lic.PhoneNumber = phone;
        //    if (mac != null)
        //    {
        //        lic.ListAuthorizedMAC = new ObservableCollection<string>();
        //        lic.ListAuthorizedMAC.Add(mac);
        //    }
        //    if (validated != null)
        //    {
        //        lic.Validated = Convert.ToBoolean(validated);
        //    }
        //    if (licenseType != null)
        //    {
        //        lic.NewLicenseType = (License.NewLicenseTypeEnum)licenseType;
        //    }
        //    if (expirationDate != null)
        //    {
        //        lic.ExpirationDate = expirationDate;
        //    }

        //    if (tokens != null)
        //    {
        //        lic.TockenCount = Convert.ToDouble(tokens);
        //    }

        //    try
        //    {
        //        SaveLicenceFile(lic, false);
        //        return Serializer.SerializeToString(lic);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.LogException(ex, "LicenceHelper");
        //        return null;
        //    }
        //}

        //public static string UpdateLicenseAsAdmin(string adminLogin, string adminPassword, string licenseLogin, string password, string firstName, string lastName, string mail, string society, string country, string address, string city, string zip, string phone, double tokens, int licenseType, DateTime expirationDate, string mac, bool validated)
        //{
        //    if (LicenceHelper.IsAdmin(adminLogin, adminPassword) == false)
        //    {
        //        throw new FaultException(new FaultReason("ADMIN_ONLY"), new FaultCode("ADMIN_ONLY"));
        //    }
        //    License license = LicenceHelper.GetAuthentificateLicense(licenseLogin, password);

        //    return updateLicense(license, password, firstName, lastName, mail, society, country, address, city, zip, phone, tokens, licenseType, expirationDate, mac, validated);
        //}


        //public static bool UpdateLicense(string login, string oldPassword, string newPassword, string firstName, string lastName, string mail, string society, string country, string address, string city, string zip, string phone, string lang)
        //{
        //    bool res = false;
        //    License lic = GetLicense(login, oldPassword);
        //    if (lic == null)
        //    {
        //        return false;
        //    }
        //    lic.Password = newPassword;
        //    lic.FirstName = firstName;
        //    lic.LastName = lastName;
        //    lic.Mail = mail;
        //    lic.Society = society;
        //    lic.Country = country;
        //    lic.Address = address;
        //    lic.City = city;
        //    lic.ZipCode = zip;
        //    lic.PhoneNumber = phone;
        //    res = SaveLicenceFile(lic, true);
        //    return res;
        //}

        //public static License RegisterNewLicense(string password, string firstName, string lastName, string mail, string society, string country, string address, string city, string zip, string phone, string lang)
        //{
        //    bool res = false;
        //    License lic = new License();
        //    lic.Password = password;
        //    lic.FirstName = firstName;
        //    lic.LastName = lastName;
        //    lic.Mail = mail;
        //    lic.Society = society;
        //    lic.Country = country;
        //    lic.Address = address;
        //    lic.City = city;
        //    lic.ZipCode = zip;
        //    lic.PhoneNumber = phone;
        //    lic.NewLicenseType = License.NewLicenseTypeEnum.Undefined;
        //    lic.ExpirationDate = null;
        //    lic.RegistrationDate = DateTime.Now;

        //    string login = lic.FirstName.Substring(0, 1).ToLower() + lic.LastName.ToLower().Replace(" ", String.Empty).RemoveDiacritics();

        //    if (login.Length > 15)
        //        login = login.Substring(0, 15);

        //    if (LicenceHelper.LicenseExists(login))
        //    {
        //        int i = 1;
        //        while (LicenceHelper.LicenseExists(login + i.ToString()))
        //        {
        //            i++;
        //        }
        //        login = login + i.ToString();
        //    }

        //    lic.Login = login;

        //    try
        //    {
        //        res = SaveLicenceFile(lic, false);

        //        // Message au client
        //        string body = "<p>" + LocalizedString.GetString("DearTimeSensUser") + ",</p>";
        //        body += "<p>" + LocalizedString.GetString("RegisterMailMessage") + " </p>";
        //        body += "<p><strong>" + LocalizedString.GetString("Login") + ": " + lic.Login + " </strong></p>";
        //        body += "<p><strong>" + LocalizedString.GetString("Password") + ": " + lic.Password + " </strong></p>";
        //        body += "<p align='right'><strong>" + LocalizedString.GetString("TheTimeSensTeam") + " </strong></p>";
        //        MailHelper.SendMail("contact@timesens.com", LocalizedString.GetString("TimeSensTeam"), lic.Mail, LocalizedString.GetString("TimeSensAccount"), body);

        //        // Message au compte timeSens
        //        body = "";
        //        if (lic.RegistrationDate != null)
        //        {
        //            body += "le " + ((DateTime)lic.RegistrationDate).Day + "/" + ((DateTime)lic.RegistrationDate).Month + "/" + ((DateTime)lic.RegistrationDate).Year + "<br/><br/>";
        //        }
        //        body += Language.FirstName + ": " + lic.FirstName + "<br/>";
        //        body += Language.LastName + ": " + lic.LastName + "<br/>";
        //        body += Language.Society + ": " + lic.Society + "<br/>";
        //        body += Language.Mail + ": " + lic.Mail + "<br/><br/>";
        //        body += Language.Phone + ": " + lic.PhoneNumber + "<br/><br/>";
        //        body += Language.Address + ": " + lic.Address + "<br/><br/>";
        //        body += Language.City + ": " + lic.City + "<br/><br/>";
        //        body += Language.Country + ": " + lic.Country + "<br/><br/>";
        //        body += "<a href='http://www.timesens.com/tools.aspx'>http://www.timesens.com/tools.aspx</a>";
        //        MailHelper.SendMail("contact@timesens.com", "Mail automatique de TimeSens", "contact@timesens.com", "Nouveau compte TimeSens", body);

        //        return lic;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.LogException(ex, "LicenceHelper");
        //        return null;
        //    }
        //}
    }


}