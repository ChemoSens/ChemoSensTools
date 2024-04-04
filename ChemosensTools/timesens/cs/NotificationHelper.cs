using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.Text;
using TimeSense.Web.Helpers;

namespace TimeSens.webservices.helpers
{
    public class NotificationHelper
    {

        private static string panelLeaderDirectory = ConfigurationManager.AppSettings["TSIDir"] + "PanelLeaders";
        private static string serverKey = "AAAArp5n-vc:APA91bG4S4bthFh0_xo0h1NRTUjiYNtjTeMeYq5fvRhfeDC7bKPwcr6IBCRh8VtuGu4cIV-gW9jeChEviojldkYMf8-9iMLltvG4l3svVOUdQLajXqgz1AsyYe6p2fleb1PkARl1GYZQ";
        private static string firebaseGoogleUrl = "https://fcm.googleapis.com/fcm/send";

        public class Panelist
        {
            public string PanelistId;
            public string FirstName;
            public string LastName;
            public string Mail;
            public string Password;
            public string PanelLeaderId;
            public string Gender;
            public string BirthDate;
            public string City;
            public string Country;
            public string Phone;
            public string CSP;
            public ArrayList DeviceId = new ArrayList();
            public bool AcceptNotification;
            public bool AcceptSMS;
            public bool AcceptMail;
            public ArrayList Tags = new ArrayList();
            public ArrayList PanelistFilleul = new ArrayList();
            public ArrayList StatutFilleulPremiereParticipation = new ArrayList();
            public string ParrainId;
            //public string DateInscription;
            public string DateInscription;
        }

        public class PanelLeader
        {
            public string PanelLeaderId;
            public string Mail;
            public string Password;
            public string FirstName;
            public string LastName;
            public string Dossier;
        }

        public class Event
        {
            public string EventId;
            public string Type;
            public string PanelLeaderId;
            public string TitreEvenement;
            public string DescriptionCourte;
            public string Description;
            public string URL;
            public Tags Tags;
            //Panelistes invités par le panelleader
            public ArrayList PanelistsInvites;
            //Panelistes souhaitant participer à l'évenement
            public ArrayList PanelistsInteresses = new ArrayList();
            public ArrayList NotificationIds;
            public bool Masquer;
            public DateTime CreationDate;
        }

        public class Device
        {
            public string deviceId;
            public string panelistId;
            public string notificationId;
            //public ArrayList notificationId;
        }

        public class Notification
        {
            public string NotificationId;
            public string Title;
            public string Body;
            public string URL;
            public List<string> Received;
            public List<string> NotReceived;
            public string SendDate;
        }

        public class Tags
        {
            public string AgeMin;
            public string AgeMax;
            public ArrayList Gender;
            public string CSP;
        }


        public static void AddFilleul(string panelLeaderId, string panelistReferrerId, string panelistFilleulId)
        {
            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"));
            }

            try
            {
                string fileName = panelistReferrerId;

                string filePath = dirPath + fileName + ".json";
                
                string json = File.ReadAllText(filePath);
                Panelist panelist = JsonConvert.DeserializeObject<Panelist>(json);
                panelist.PanelistFilleul.Add(panelistFilleulId);
                //Statut en attente de la première participation à une étude
                panelist.StatutFilleulPremiereParticipation.Add("EA");

                FileHelper.createFile(filePath, JsonConvert.SerializeObject(panelist));
                
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static void AddParrain(string panelLeaderId, string panelistReferrerId, string panelistFilleulId)
        {
            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"));
            }

            try
            {
                string fileName = panelistFilleulId;

                string filePath = dirPath + fileName + ".json";

                string json = File.ReadAllText(filePath);
                Panelist panelist = JsonConvert.DeserializeObject<Panelist>(json);
                panelist.ParrainId = panelistReferrerId;

                FileHelper.createFile(filePath, JsonConvert.SerializeObject(panelist));

            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static void AjoutPanelistInteresseDansEvent(string panelLeaderId, string panelistId, string eventId)
        {
            string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Events\\" + eventId + ".json";

            if (!File.Exists(filePath))
            {
                throw new FaultException(new FaultReason("ERROR_EVENT_NOT_FOUND"), new FaultCode("ERROR_EVENT_NOT_FOUND"));
            }

            try
            {
                string json = File.ReadAllText(filePath);
                Event ev = JsonConvert.DeserializeObject<Event>(json);
                ev.PanelistsInteresses.Add(panelistId);

                FileHelper.createFile(filePath, JsonConvert.SerializeObject(ev));

            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        private static void AjoutNotificationDansEvent(string panelLeaderId, string eventId, string notificationId)
        {

            string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Events\\" + eventId + ".json";

            if (!File.Exists(filePath))
            {
                throw new FaultException(new FaultReason("ERROR_FILE_EVENT_NOT_FOUND"), new FaultCode("ERROR_FILE_EVENT_NOT_FOUND"));
            }

            try
            {
                string jsonOfEvent = File.ReadAllText(filePath);
                Event ev = JsonConvert.DeserializeObject<Event>(jsonOfEvent);
                ev.NotificationIds.Add(notificationId);

                var json = JsonConvert.SerializeObject(ev);

                FileHelper.createFile(filePath, json);
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        private static void AjoutNotificationDansDevice(string deviceId, string notificationId, string panelLeaderId)
        {
            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Devices\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_DEVICES_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_DEVICES_DIRECTORY_NOT_FOUND"));
            }

            try
            {
                string file = dirPath + deviceId + ".json";

                //var json = JsonConvert.SerializeObject(panelist);
                string json = File.ReadAllText(file);
                Device device = JsonConvert.DeserializeObject<Device>(json);
                device.notificationId = notificationId;
                FileHelper.createFile(file, JsonConvert.SerializeObject(device));
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string ConnexionComptePanelLeader(string mail, string password)
        {
            try
            {
                string dirPath = panelLeaderDirectory + "\\";
                foreach (string subFolderPath in Directory.GetDirectories(dirPath))
                {
                    var dir = subFolderPath;
                    dir += "\\Admins\\";
                    foreach (string s in Directory.GetFiles(dir, "*.json").Select(Path.GetFileName))
                    {
                        string jsonPanelLeader = File.ReadAllText(dir + s);
                        PanelLeader panelLeader = JsonConvert.DeserializeObject<PanelLeader>(jsonPanelLeader);
                        if (panelLeader.Mail==mail && panelLeader.Password == password)
                        {
                            return jsonPanelLeader;
                        }
                    }
                }
                throw new FaultException(new FaultReason("ERROR_FAILED_TO_CONNECT"), new FaultCode("ERROR_FAILED_TO_CONNECT"));
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string ConnexionComptePanelist(string mail, string password)
        {
            try
            {
                string dirPath = panelLeaderDirectory + "\\";
                foreach (string subFolderPath in Directory.GetDirectories(dirPath))
                {
                    var dir = subFolderPath;
                    dir += "\\Panelists\\";
                    foreach (string s in Directory.GetFiles(dir, "*.json").Select(Path.GetFileName))
                    {
                        string jsonPanelist = File.ReadAllText(dir + s);
                        Panelist panelist = JsonConvert.DeserializeObject<Panelist>(jsonPanelist);
                        if (panelist.Mail == mail && panelist.Password == password)
                        {
                            return jsonPanelist;
                        }
                    }
                }
                throw new FaultException(new FaultReason("ERROR_FAILED_TO_CONNECT"), new FaultCode("ERROR_FAILED_TO_CONNECT"));
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static void CreateAssociationAdminPassword(string panelLeaderId, string mail, string password)
        {
            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\FutursAdmins\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_PANEL_LEADER_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_PANEL_LEADER_DIRECTORY_NOT_FOUND"));
            }
            
            try
            {
                string fileNameEvent = FileHelper.CreateRandomName(dirPath);
                
                string filePathEvent = dirPath + fileNameEvent + ".json";

                var data = new
                {
                    mail = mail,
                    password = password
                };

                var json = JsonConvert.SerializeObject(data);

                FileHelper.createFile(filePathEvent, json);
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static void CreateDirectory(string dirPath)
        {
            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }
            else
            {
                throw new FaultException("ERROR_DIRECTORY_ALREADY_EXIST");
            }
        }

        public static string CreateEvent(string email, string password, string eventAsJson)
        {
            Event ev = new Event();

            try
            {
                ev = JsonConvert.DeserializeObject<Event>(eventAsJson);
                ev.CreationDate = DateTime.Now;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
            
            string dirPath = panelLeaderDirectory + "\\" + ev.PanelLeaderId + "\\Events\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_EVENT_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_EVENT_DIRECTORY_NOT_FOUND"));
            }


            try
            {
                string fileNameEvent = FileHelper.CreateRandomName(dirPath);
                ev.EventId = fileNameEvent;
                ev.NotificationIds = new ArrayList();

                string filePathEvent = dirPath + fileNameEvent + ".json";
                
                var notificationId = CreationPremiereNotification(ev.PanelLeaderId);
                ev.NotificationIds.Add(notificationId);

                var json = JsonConvert.SerializeObject(ev);

                FileHelper.createFile(filePathEvent, json);

                return fileNameEvent;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string CreateNotification(string panelLeaderId, string eventId, string titre, string body, string URL)
        {

            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Notifications\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_NOTIFICATIONS_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_NOTIFICATIONS_DIRECTORY_NOT_FOUND"));
            }

            try
            {
                string fileName = FileHelper.CreateRandomName(dirPath);

                string filePath = dirPath + fileName + ".json";

                Notification notification = new Notification
                {
                    NotificationId = fileName,
                    Title = titre,
                    Body = body,
                    URL = URL
                };

                var json = JsonConvert.SerializeObject(notification);

                FileHelper.createFile(filePath, json);

                AjoutNotificationDansEvent(panelLeaderId, eventId, notification.NotificationId);

                return fileName;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string CreatePanelist(string panelLeaderId, string mail, string password)
        {
            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_PANELISTS_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_PANELISTS_DIRECTORY_NOT_FOUND"));
            }

            try
            {
                string fileName = FileHelper.CreateRandomName(dirPath);

                string filePath = dirPath + fileName + ".json";

                Panelist panelist = new Panelist
                {
                    Mail = mail,
                    Password = password,
                    PanelistId = fileName,
                    PanelLeaderId = panelLeaderId,
                    DateInscription = DateTime.Now.ToShortDateString()
            };


                var json = JsonConvert.SerializeObject(panelist);

                FileHelper.createFile(filePath, json);

                return fileName;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }
        
        public static string CreatePanelLeader(string panelLeaderId, string email, string password, string nom, string prenom, string mailPassword)
        {
            string dirPathAdmins = panelLeaderDirectory + "\\" + panelLeaderId + "\\Admins\\";
            string dirPathFutursAdmins = panelLeaderDirectory + "\\" + panelLeaderId + "\\FutursAdmins\\";

            if (!Directory.Exists(dirPathAdmins))
            {
                throw new FaultException(new FaultReason("ERROR_ADMINISTRATORS_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_ADMINISTRATORS_DIRECTORY_NOT_FOUND"));
            }

            try
            {
                if (mailPassword != "null")
                {
                    var fini = false;
                    foreach (string panelleader in Directory.GetFiles(dirPathFutursAdmins, "*.json").Select(Path.GetFileName))
                    {
                        if (fini == false)
                        {
                            string jsonPanelLeader = File.ReadAllText(dirPathFutursAdmins + panelleader);
                            PanelLeader pl = JsonConvert.DeserializeObject<PanelLeader>(jsonPanelLeader);
                            if (pl.Mail == email)
                            {
                                if (pl.Password == mailPassword)
                                {
                                    fini = true;
                                }
                                else
                                {
                                    throw new FaultException(new FaultReason("ERROR_PASSWORD_MAIL_INCORRECT"), new FaultCode("ERROR_PASSWORD_MAIL_INCORRECT"));
                                }
                            }
                        }    
                    }

                    if (fini == true)
                    {
                        foreach (string panelleader in Directory.GetFiles(dirPathFutursAdmins, "*.json").Select(Path.GetFileName))
                        {
                            string jsonPanelLeader = File.ReadAllText(dirPathFutursAdmins + panelleader);
                            PanelLeader pl = JsonConvert.DeserializeObject<PanelLeader>(jsonPanelLeader);
                            if (pl.Mail == email && pl.Password == mailPassword)
                            {
                                File.Delete(dirPathFutursAdmins + panelleader);
                            }
                        }
                    }
                    else
                    {
                        throw new FaultException(new FaultReason("ERROR_NO_INVITATION_AVAILABLE"), new FaultCode("ERROR_NO_INVITATION_AVAILABLE"));
                    }
                }

                string fileName = FileHelper.CreateRandomName(dirPathAdmins);

                string filePath = dirPathAdmins + fileName + ".json";

                PanelLeader panelLeader = new PanelLeader
                {
                    Mail = email,
                    Password = password,
                    PanelLeaderId = fileName,
                    FirstName = prenom,
                    LastName = nom,
                    Dossier = panelLeaderId
                };


                var json = JsonConvert.SerializeObject(panelLeader);

                FileHelper.createFile(filePath, json);

                return fileName;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        private static string CreationPremiereNotification(string panelLeaderId)
        {
            Notification notification = new Notification();

            /*Pour le test*/
            notification.Title = "TSI";
            notification.Body = "Un nouvel évenement est disponible !";
            notification.URL = "testURL";

            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Notifications\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"));
            }

            try
            {
                string fileName = FileHelper.CreateRandomName(dirPath);

                notification.NotificationId = fileName;

                string filePath = dirPath + fileName + ".json";

                var json = JsonConvert.SerializeObject(notification);

                FileHelper.createFile(filePath, json);

                return fileName;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string CreateSociety(string name)
        {

            string dirPath = panelLeaderDirectory + "\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_SOCIETY_CREATION_UNAVAILABLE"), new FaultCode("ERROR_SOCIETY_CREATION_UNAVAILABLE"));
            }

            try
            {
                /*Création dossier de la société*/
                string dirName = FileHelper.CreateRandomName(dirPath);
                dirPath = dirPath + dirName;
                CreateDirectory(dirPath);

                /*Création des différents sous-dossiers*/
                CreateDirectory(dirPath + "\\Admins");
                CreateDirectory(dirPath + "\\Devices");
                CreateDirectory(dirPath + "\\Events");
                CreateDirectory(dirPath + "\\Notifications");
                CreateDirectory(dirPath + "\\Panelists");

                string filePath = dirPath + "\\society.json";

                var society = new
                {
                    SocietyId = dirName,
                    Name = name
                };


                var json = JsonConvert.SerializeObject(society);

                FileHelper.createFile(filePath, json);

                return dirName;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }
        
        //Pour test
        public static bool DeleteAccountAsTestPA(string id)
        {
            string dirPath = panelLeaderDirectory + "\\" + "123456" + "\\Panelists\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_TEST_FILE_NOT_FOUND"), new FaultCode("ERROR_TEST_FILE_NOT_FOUND"));
            }

            dirPath += id + ".json";

            if (File.Exists(dirPath))
            {
                File.Delete(dirPath);
                return true;
            }
            return false;
        }
        
        public static void DeleteAccount(string panelLeaderId, string panelistId)
        {
            string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\" + panelistId + ".json";
            
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            else
            {
                throw new FaultException(new FaultReason("ERROR_ACCOUNT_NOT_FOUND"), new FaultCode("ERROR_ACCOUNT_NOT_FOUND"));
            }
            
            string dirPathDevice = panelLeaderDirectory + "\\" + panelLeaderId + "\\Devices\\";

            foreach (string s in Directory.GetFiles(dirPathDevice, "*.json").Select(Path.GetFileName))
            {
                string jsonOfDevice = File.ReadAllText(dirPathDevice + s);
                Device d = JsonConvert.DeserializeObject<Device>(jsonOfDevice);
                if (d.panelistId == panelistId)
                {
                    try
                    {
                        File.Delete(dirPathDevice + s);
                    }
                    catch
                    {
                        throw new FaultException(new FaultReason("ERROR_DEVICE_FILE_NOT_FOUND"), new FaultCode("ERROR_DEVICE_FILE_NOT_FOUND"));
                    }
                    
                }
            }
        }

        public static void DeleteAccountPanelLeader(string dossierId, string panelLeaderId)
        {
            string filePath = panelLeaderDirectory + "\\" + dossierId + "\\Admins\\" + panelLeaderId + ".json";

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            else
            {
                throw new FaultException(new FaultReason("ERROR_ACCOUNT_NOT_FOUND"), new FaultCode("ERROR_ACCOUNT_NOT_FOUND"));
            }
        }

        public static void DeleteSociety(string dossierId, string panelLeaderId)
        {
            string dirPath = panelLeaderDirectory + "\\" + dossierId;
            string filePath = dirPath + "\\Admins\\" + panelLeaderId + ".json";


            if (File.Exists(filePath))
            {
                Directory.Delete(dirPath,true);
            }
            else
            {
                throw new FaultException(new FaultReason("ERROR_ACCOUNT_NOT_FOUND"), new FaultCode("ERROR_ACCOUNT_NOT_FOUND"));
            }
        }

        public static void DeleteTestEvents(string dossierId)
        {
            string dirPath = panelLeaderDirectory + "\\" + dossierId + "\\Events\\";

            foreach (string s in Directory.GetFiles(dirPath, "*.json").Select(Path.GetFileName))
            {
                string jsonOfEvent = File.ReadAllText(dirPath + s);
                Event e = JsonConvert.DeserializeObject<Event>(jsonOfEvent);
                if (e.Tags.AgeMax=="0" && e.Tags.AgeMin=="0" && e.TitreEvenement == "Test")
                {
                    File.Delete(dirPath + s);
                }
            }
        }

        public static void DeleteDevice(string panelLeaderId, string deviceId)
        {
            string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Devices\\" + deviceId + ".json";

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            else
            {
                throw new FaultException(new FaultReason("ERROR_FILE_NOT_FOUND"), new FaultCode("ERROR_FILE_NOT_FOUND"));
            }
        }

        /****************************************************************************/
        public static string GenerateurPassword(string taille)
		{
			string maj = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			string min = "abcdefghijklmnopqrstuvwxyz";
			string chiffres = "0123456789";
			string symboles = ".!-_/*+=&$";
			 
			string ensemble = "";
			ensemble += maj;
			ensemble += min;
			ensemble += chiffres;
			ensemble += symboles;
			 
			// Ici, ensemble contient donc la totalité des caractères autorisés
			string password = "";
			int taillePwd = Int32.Parse(taille);
			Random rand = new Random();
			for (int i = 0; i < taillePwd; i++)
			{
				// On ajoute un caractère parmi tous les caractères autorisés
				password += ensemble[rand.Next(0, ensemble.Length)];
			}
			return password;
		}
		
        public static string GetEvents(string panelLeaderId, string email, string password, string type)
        {
            VerificationConnexionPanelLeader(panelLeaderId, email, password);

            List<Event> list = new List<Event>();
            try
            {
                string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Events\\";
                foreach (string s in Directory.GetFiles(filePath, "*.json").Select(Path.GetFileName))
                {
                    string jsonOfEvent = File.ReadAllText(filePath + s);
                    Event e = JsonConvert.DeserializeObject<Event>(jsonOfEvent);
                    list.Add(e);
                }
                var json = JsonConvert.SerializeObject(list);
                return json;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string GetEventsPanelist(string panelLeaderId, string panelistId)
        {
            List<Event> list = new List<Event>();
            try
            {
                string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Events\\";
                foreach (string s in Directory.GetFiles(filePath, "*.json").Select(Path.GetFileName))
                {
                    string jsonOfEvent = File.ReadAllText(filePath + s);
                    Event e = JsonConvert.DeserializeObject<Event>(jsonOfEvent);
                    foreach(string pId in e.PanelistsInvites)
                    {
                        if (pId == panelistId)
                        {
                            var ajout = true;
                            foreach (string panelistInteresseId in e.PanelistsInteresses)
                            {
                                //On vérifie que le panéliste est autorisé à participer à l'étude, et qu'il n'a pas encore participer.
                                if (panelistInteresseId == panelistId)
                                {
                                    ajout = false;
                                }
                            }

                            if (ajout == true)
                            {
                                list.Add(e);
                            }
                        }
                        
                    }
                }
                var json = JsonConvert.SerializeObject(list);
                return json;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string GetHistoricEventsPanelist(string panelLeaderId, string panelistId)
        {
            List<Event> list = new List<Event>();
            try
            {
                string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Events\\";
                foreach (string s in Directory.GetFiles(filePath, "*.json").Select(Path.GetFileName))
                {
                    string jsonOfEvent = File.ReadAllText(filePath + s);
                    Event e = JsonConvert.DeserializeObject<Event>(jsonOfEvent);

                    foreach (string panelistInteresseId in e.PanelistsInteresses)
                    {
                        //On vérifie que le panéliste est autorisé à participer à l'étude, et qu'il n'a pas encore participer.
                        if (panelistInteresseId == panelistId)
                        {
                            list.Add(e);
                        }

                    }
                }
                var json = JsonConvert.SerializeObject(list);
                return json;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string GetFilleuls(string panelLeaderId, string filleulsIds)
        {
            List<Panelist> list = new List<Panelist>();
            
            try
            {
                List<string> ids = JsonConvert.DeserializeObject<List<string>>(filleulsIds);
                //string s = "";
                string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";
                foreach (string id in ids)
                {
                    string jsonOfPanelist = File.ReadAllText(dirPath + id + ".json");
                    Panelist panelist = JsonConvert.DeserializeObject<Panelist>(jsonOfPanelist);
                    list.Add(panelist);
                }
                var json = JsonConvert.SerializeObject(list);
                return json;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string GetPanelist(string panelLeaderId, string panelistId)
        {
            Panelist panelist = new Panelist();

            try
            {
                string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";
                string jsonOfPanelist = File.ReadAllText(dirPath + panelistId + ".json");
                panelist = JsonConvert.DeserializeObject<Panelist>(jsonOfPanelist);
                var json = JsonConvert.SerializeObject(panelist);
                return json;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string GetPanelistId(string mail)
        {
            try
            {
                string dirPath = panelLeaderDirectory + "\\";
                foreach (string s in Directory.GetDirectories(dirPath).Select(Path.GetFileName))
                {
                    string dirPathP = dirPath + s + "\\" + "Panelists" + "\\";
                    foreach (string filePanelist in Directory.GetFiles(dirPathP, "*.json").Select(Path.GetFileName))
                    {
                        string jsonOfPanelist = File.ReadAllText(dirPathP + filePanelist);
                        Panelist p = JsonConvert.DeserializeObject<Panelist>(jsonOfPanelist);
                        if (p.Mail == mail)
                        {
                            string panelistId = p.PanelistId;
                            return panelistId;
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string GetAdmins(string dossierId)
        {
            List<PanelLeader> list = new List<PanelLeader>();
            try
            {
                string filePath = panelLeaderDirectory + "\\" + dossierId + "\\Admins\\";
                foreach (string s in Directory.GetFiles(filePath, "*.json").Select(Path.GetFileName))
                {
                    string jsonOfAdmin = File.ReadAllText(filePath + s);
                    PanelLeader pL = JsonConvert.DeserializeObject<PanelLeader>(jsonOfAdmin);
                    list.Add(pL);
                }
                var json = JsonConvert.SerializeObject(list);
                return json;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        private static string getDeviceIdWithPanelistId(string panelistId, string panelLeaderId)
        {
            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"));
            }

            string filePath = dirPath + panelistId + ".json";

            string json = File.ReadAllText(filePath);
            Panelist panelist = JsonConvert.DeserializeObject<Panelist>(json);
            //string deviceId = panelist.DeviceId;

            //return deviceId;

            ArrayList devicesId = panelist.DeviceId;

            return devicesId.ToString();
        }

        public static string GetPanelists(string email, string password, string panelLeaderId)
        {
            VerificationConnexionPanelLeader(panelLeaderId, email, password);

            ArrayList list = new ArrayList();
            try
            {
                string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";
                foreach (string s in Directory.GetFiles(filePath, "*.json").Select(Path.GetFileName))
                {
                    string jsonPanelist = File.ReadAllText(filePath + s);
                    Panelist panelist = JsonConvert.DeserializeObject<Panelist>(jsonPanelist);
                    list.Add(panelist);

                }
                var json = JsonConvert.SerializeObject(list);
                return json;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        private static ArrayList getPanelistsId(string panelLeaderId)
        {
            ArrayList panelists = new ArrayList();
            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";

            foreach (string file in Directory.GetFiles(dirPath))
            {
                string panelistId = Path.GetFileNameWithoutExtension(file);
                panelists.Add(panelistId);
            }

            return panelists;
        }

        public static string GetNotification(string panelLeaderId, string panelistId, string deviceId)
        {
            //TODO : Accès concurrant (quand deux panélistes changent le fichier de notif en meme temps)
            try
            {
                string filePathDevice = panelLeaderDirectory + "\\" + panelLeaderId + "\\Devices\\" + deviceId + ".json";
                string jsonDevice = File.ReadAllText(filePathDevice);
                Device device = JsonConvert.DeserializeObject<Device>(jsonDevice);
                string notificationId = device.notificationId;

                string filePathNotification = panelLeaderDirectory + "\\" + panelLeaderId + "\\Notifications\\" + notificationId + ".json";
                string jsonNotification = File.ReadAllText(filePathNotification);
                Notification notification = JsonConvert.DeserializeObject<Notification>(jsonNotification);

                if (notification.NotReceived.Contains(panelistId))
                {
                    notification.NotReceived.Remove(panelistId);
                }
                notification.Received.Add(panelistId);

                FileHelper.createFile(filePathNotification, JsonConvert.SerializeObject(notification));

                var json = JsonConvert.SerializeObject(notification);

                //FileHelper.createFile("C:\\tmp\\text.txt", json);

                return json;
            }
            catch (Exception ex)
            {
                //FileHelper.createFile("C:\\tmp\\textCatch.txt", ex.Message);
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string GetNotification2(string panelLeaderId, string notificationId)
        {
            try
            {
                string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Notifications\\";

                string jsonOfNotification = File.ReadAllText(filePath + notificationId + ".json");
                Notification notification = JsonConvert.DeserializeObject<Notification>(jsonOfNotification);
                var json = JsonConvert.SerializeObject(notification);

                return json;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }
        
        public static string GetNotificationsWithEventId(string panelLeaderId, string eventId)
        {
            string list;
            try
            {
                string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Events\\";

                string jsonOfEvent = File.ReadAllText(filePath + eventId + ".json");
                Event e = JsonConvert.DeserializeObject<Event>(jsonOfEvent);
                list = JsonConvert.SerializeObject(e.NotificationIds);

                return list;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }
                
        public static bool MasquerEvent(string panelLeaderId, string eventId)
        {
            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Events\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"));
            }

            try
            {
                string file = dirPath + eventId + ".json";
                
                string json = File.ReadAllText(file);
                Event ev = JsonConvert.DeserializeObject<Event>(json);
                if (ev.Masquer == false)
                {
                    ev.Masquer = true;
                }
                else
                    ev.Masquer = false;
                
                FileHelper.createFile(file, JsonConvert.SerializeObject(ev));

                return ev.Masquer;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static void MailUnique(string mail)
        {
            try
            {
                string dirPath = panelLeaderDirectory + "\\";
                foreach (string s in Directory.GetDirectories(dirPath).Select(Path.GetFileName))
                {
                    string dirPathP = dirPath + s + "\\" + "Panelists" + "\\";
                    foreach (string filePanelist in Directory.GetFiles(dirPathP, "*.json").Select(Path.GetFileName))
                    {
                        string jsonOfPanelist = File.ReadAllText(dirPathP + filePanelist);
                        Panelist p = JsonConvert.DeserializeObject<Panelist>(jsonOfPanelist);
                        if (p.Mail == mail)
                        {
                            throw new FaultException(new FaultReason("ERROR_MAIL_ALREADY_USED"), new FaultCode("ERROR_MAIL_ALREADY_USED"));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static void MailUniqueAdministrateur(string mail)
        {
            try
            {
                string dirPath = panelLeaderDirectory + "\\";
                foreach (string s in Directory.GetDirectories(dirPath).Select(Path.GetFileName))
                {
                    string dirPathP = dirPath + s + "\\" + "Admins" + "\\";
                    foreach (string filePanelist in Directory.GetFiles(dirPathP, "*.json").Select(Path.GetFileName))
                    {
                        string jsonOfPanelist = File.ReadAllText(dirPathP + filePanelist);
                        PanelLeader p = JsonConvert.DeserializeObject<PanelLeader>(jsonOfPanelist);
                        if (p.Mail == mail)
                        {
                            throw new FaultException(new FaultReason("ERROR_MAIL_ALREADY_USED"), new FaultCode("ERROR_MAIL_ALREADY_USED"));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string RegisterDevice(string panelistId, string panelLeaderId, string deviceId)
        {
            string dirPathDevice = panelLeaderDirectory + "\\" + panelLeaderId + "\\Devices\\";
            string dirPathPanelist = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";

            if (!Directory.Exists(dirPathDevice) || !Directory.Exists(dirPathPanelist))
            {
                throw new FaultException(new FaultReason("ERROR_PANEL_LEADER_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_PANEL_LEADER_DIRECTORY_NOT_FOUND"));
            }

            try
            {

                string fileName = FileHelper.CreateRandomName(dirPathDevice);

                string filePath = dirPathDevice + fileName + ".json";

                Device device = new Device
                {
                    deviceId = deviceId,
                    panelistId = panelistId
                };

                var jsonDevice = JsonConvert.SerializeObject(device);

                FileHelper.createFile(filePath, jsonDevice);

                /*Modification de panelist.json*/

                string fileNameP = panelistId;

                string filePathP = dirPathPanelist + fileNameP + ".json";

                string jsonP = File.ReadAllText(filePathP);
                Panelist panelist = JsonConvert.DeserializeObject<Panelist>(jsonP);
                
                //panelist.DeviceId = deviceId;
                if (panelist.DeviceId == null)
                {
                    panelist.DeviceId = new ArrayList();
                }
                panelist.DeviceId.Add(fileName);
                panelist.AcceptNotification = true;
                var json2 = JsonConvert.SerializeObject(panelist);
                FileHelper.createFile(filePathP, json2);

                return fileName;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static string RefreshPanelist(string panelleaderId, string panelistId)
        {
            try
            {
                string filePath = panelLeaderDirectory + "\\" + panelleaderId + "\\Panelists\\" + panelistId + ".json";
                
                string jsonPanelist = File.ReadAllText(filePath);

                return jsonPanelist;
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static void SendNotification(string panelLeaderId, string panelistsId, string notificationId)
        {
            string dirPathPanelists = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";
            string dirPathDevices = panelLeaderDirectory + "\\" + panelLeaderId + "\\Devices\\";

            List<string> ids = JsonConvert.DeserializeObject<List<string>>(panelistsId);
            
            foreach (string id in ids)
            {

                string jsonPanelist = File.ReadAllText(dirPathPanelists + id + ".json");
                Panelist panelist = JsonConvert.DeserializeObject<Panelist>(jsonPanelist);
                
                ArrayList filesNameDevice = panelist.DeviceId;

                if (filesNameDevice != null)
                {
                    foreach (string fileNameDevice in filesNameDevice)
                    {
                        string jsonDevice = File.ReadAllText(dirPathDevices + fileNameDevice + ".json");
                        Device device = JsonConvert.DeserializeObject<Device>(jsonDevice);
                        device.notificationId = notificationId;
                        FileHelper.createFile(dirPathDevices + fileNameDevice + ".json", JsonConvert.SerializeObject(device));

                        string deviceId = device.deviceId;

                        var httpClient = new WebClient();
                        httpClient.Headers.Add("Content-Type", "application/json");
                        httpClient.Headers.Add(HttpRequestHeader.Authorization, "key=" + serverKey);
                        var timeToLiveInSecond = 24 * 60; // 1 day
                        var data = new
                        {
                            to = deviceId,
                            time_to_live = timeToLiveInSecond
                        };

                        var json2 = JsonConvert.SerializeObject(data);
                        Byte[] byteArray = Encoding.UTF8.GetBytes(json2);
                        try
                        {
                            var responsebytes = httpClient.UploadData(firebaseGoogleUrl, "POST", byteArray);
                            var str = System.Text.Encoding.Default.GetString(responsebytes);
                            //FileHelper.createFile("C:\\tmp\\" + fileNameDevice, str);
                            //Si l'utilisateur a vidé son cache, nettoie
                            if (str.Contains("\"failure\":1"))
                            {
                                string filePathDevice = panelLeaderDirectory + "\\" + panelLeaderId + "\\Devices\\" + fileNameDevice + ".json";
                                File.Delete(filePathDevice);

                                string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\" + panelist.PanelistId + ".json";

                                string jsonOfPanelist = File.ReadAllText(filePath);
                                panelist = JsonConvert.DeserializeObject<Panelist>(jsonOfPanelist);
                                panelist.DeviceId.Remove(fileNameDevice);

                                var json = JsonConvert.SerializeObject(panelist);

                                FileHelper.createFile(filePath, json);
                            }
                        }
                        catch(Exception ex)
                        {
                            FileHelper.createFile("C:\\tmp\\"+fileNameDevice,ex.Message);
                        }


                    }

                }
            }

			string filePathNotification = panelLeaderDirectory + "\\" + panelLeaderId + "\\Notifications\\" + notificationId + ".json";
			string jsonNotification = File.ReadAllText(filePathNotification);
			Notification notification = JsonConvert.DeserializeObject<Notification>(jsonNotification);
            notification.NotReceived = ids;
            notification.Received = new List<string>();
			string dateDuJour = System.DateTime.Now.ToShortDateString();
			notification.SendDate = dateDuJour;
			FileHelper.createFile(filePathNotification, JsonConvert.SerializeObject(notification));
            
		}
		
		public static void UpdatePanelist(string panelLeaderId, string panelistAsJson, string email, string password)
        {
            Panelist panelist = new Panelist();

            try
            {
                panelist = JsonConvert.DeserializeObject<Panelist>(panelistAsJson);
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }

            if (email != panelist.Mail || password != panelist.Password)
            {
                throw new FaultException(new FaultReason("ERROR_LOGIN_DETAILS_INCORRECT"), new FaultCode("ERROR_LOGIN_DETAILS_INCORRECT"));
            }

            string panelistId = panelist.PanelistId;
            string dirPath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\";

            if (!Directory.Exists(dirPath))
            {
                throw new FaultException(new FaultReason("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"), new FaultCode("ERROR_ACCOUNT_DIRECTORY_NOT_FOUND"));
            }

            try
            {
                string fileName = panelist.PanelistId;

                string filePath = dirPath + fileName + ".json";

                var json = JsonConvert.SerializeObject(panelist);

                FileHelper.createFile(filePath, json);
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static void UpdatePassword(string panelLeaderId, string panelistId, string password)
        {
            Panelist panelist = new Panelist();

            try
            {
                string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Panelists\\" + panelistId + ".json";

                string jsonOfPanelist = File.ReadAllText(filePath);
                panelist = JsonConvert.DeserializeObject<Panelist>(jsonOfPanelist);
                panelist.Password = password;

                var json = JsonConvert.SerializeObject(panelist);

                FileHelper.createFile(filePath, json);
            }
            catch (Exception ex)
            {
                throw new FaultException(new FaultReason(ex.Message), new FaultCode(ex.Message));
            }
        }

        public static void UnsuscribeNotification(string panelLeaderId, string email, string password, string deviceId)
        {
            string filePath = panelLeaderDirectory + "\\" + panelLeaderId + "\\Devices\\" + deviceId + ".json";
            string json = File.ReadAllText(filePath);
            Panelist panelist = JsonConvert.DeserializeObject<Panelist>(json);
            if (email == panelist.Mail && password == panelist.Password)
            {
                File.Delete(filePath);
            }
        }

        /*Ajouter le dossier, ex : 123456*/
        private static void VerificationConnexionPanelLeader(string panelLeaderId, string email, string password)
        {
            /*string filePathConnexion = panelLeaderDirectory + "\\" + panelLeaderId + "\\authorizations.json";
            string jsonConnexion = File.ReadAllText(filePathConnexion);
            Panelist panelist = JsonConvert.DeserializeObject<Panelist>(jsonConnexion);

            if (email != panelist.Mail || password != panelist.Password)
            {
                throw new FaultException(new FaultReason("ERROR_MAIL_OR_PASSWORD_NOT_OK"), new FaultCode("ERROR_MAIL_OR_PASSWORD_NOT_OK"));
            }*/
        }
    }
}