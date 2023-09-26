using System;
using System.Web;
using System.IO;
using System.Configuration;
using System.Net;
using System.Diagnostics;
using System.ServiceModel;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Text;

namespace TimeSens.webservices.helpers
{
    public class LogHelper
    {
        //private static string logOfPanelLeaderConnexionPath = ConfigurationManager.AppSettings["LogDirectory"] + "\\ConnexionPanelLeader\\ConnexionPanelLeader_Log_current.csv";
        //private static string logOfPanelistConnexionPath = ConfigurationManager.AppSettings["LogDirectory"] + "\\ConnexionPanelist\\ConnexionPanelist_Log_current.csv";
        //private static string logOfAnalysesPath = ConfigurationManager.AppSettings["LogDirectory"] + "\\Analysis\\Analysis_Log_current.csv";
        //private static string logOfImportsPath = ConfigurationManager.AppSettings["LogDirectory"] + "\\Import\\Import_Log_current.csv";
        //private static string logOfUploadsPath = ConfigurationManager.AppSettings["LogDirectory"] + "\\Upload\\Upload_Log_current.csv";

        //TODO private static string logOfAnalysesErrorPath = ConfigurationManager.AppSettings["LogDirectory"] + "\\ErrorAnalysis\\ErrorAnalysis_Log_current.csv";
        //TODO private static string logOfPanelLeaderErrorPath = ConfigurationManager.AppSettings["LogDirectory"] + "\\ErrorPanelLeader\\ErrorPanelLeader_Log_current.csv";
        //TODO private static string logOfPanelistErrorPath = ConfigurationManager.AppSettings["LogDirectory"] + "\\ErrorPanelist\\ErrorPanelist_Log_current.csv";
        //TODO private static string logOfWebSiteErrorPath = ConfigurationManager.AppSettings["LogDirectory"] + "\\ErrorWeb\\ErrorWeb_Log_current.csv";
        //TODO : SMS, sensobase
        //TODO : faire des fontions pour lire csv

        private static string connexionsLogPath = ConfigurationManager.AppSettings["LogPath"] + "\\Connexions\\";
        private static string panelLeaderLogPath = ConfigurationManager.AppSettings["LogPath"] + "\\PanelLeader\\";
        private static string dailyTaskLogPath = ConfigurationManager.AppSettings["LogPath"] + "\\DailyTasks\\";

        private static readonly object locker = new object();

        //public static void SaveInLog(string logType, string data)
        //{
        //    try
        //    {
        //        lock (locker)
        //        {
        //            string path = "";

        //            path = ConfigurationManager.AppSettings["LogDirectory"] + "\\" + logType;

        //            //Check if path exist
        //            if (!Directory.Exists(path))
        //            {
        //                Directory.CreateDirectory(path);
        //            }

        //            string filename = Path.GetFileName(path) + "_Log_";

        //            path += "\\";

        //            //on test si le fichier en cours de remplissage existe
        //            if (File.Exists(path + filename + "current.csv"))
        //            {
        //                FileInfo f = new FileInfo(path + filename + "current.csv");

        //                //s'il est plus grand que 5 mo, on le copie pour le stocker et on en crée un nouveau
        //                if (f.Length > 10000000)
        //                {
        //                    string date = DateTime.Now.Day + "_" + DateTime.Now.Month + "_" + DateTime.Now.Year + "_" + DateTime.Now.Hour + "h" + DateTime.Now.Minute;
        //                    string fullPathName = path + filename + date;
        //                    if (File.Exists(fullPathName + ".csv"))
        //                    {
        //                        int i = 1;
        //                        while (File.Exists(fullPathName + "_" + i.ToString() + ".csv"))
        //                        {
        //                            i++;
        //                        }
        //                        fullPathName = fullPathName + "_" + i.ToString();
        //                    }

        //                    File.Move(path + filename + "current.csv", fullPathName + ".csv");
        //                    createLogFile(path + filename + "current.csv", logType);
        //                }
        //            }
        //            else
        //            {
        //                createLogFile(path + filename + "current.csv", logType);
        //            }

        //            StreamWriter w = File.AppendText(path + filename + "current.csv");
        //            w.Write(data + "\n");
        //            w.Close();
        //        }
        //    }
        //    catch
        //    {
        //    }
        //}

        //private static void createLogFile(string path, string HeaderType)
        //{
        //    FileStream f = File.Create(path);
        //    f.Close();

        //    StreamWriter w = File.AppendText(path);

        //    string header = "";
        //    switch (HeaderType)
        //    {
        //        case "Connexion":
        //            header = "Date;Login;MotherboardSerial;TimeSensVersion;\n";
        //            break;
        //        case "ConnexionPanelLeader":
        //            header = "Date;Login;MotherboardSerial;TimeSensVersion;\n";
        //            break;
        //        case "ConnexionPanelist":
        //            header = "Date;Mode;Mobile;OS;Browser;Version;Javascript;UserAgent\n";
        //            break;
        //        case "Analysis":
        //            header = "Date;Login;Function;Parameters\n";
        //            break;
        //        case "Import":
        //            header = "Date;Login;DataType;NbJudges;NbData\n";
        //            break;
        //        case "Upload":
        //            header = "Date;Login;Directory;Expiration;NbJudges;AnonymousMode\n";
        //            break;
        //        case "SMS":
        //            header = "Date;Login;NbSms\n";
        //            break;
        //        case "SensoBase":
        //            header = "Date;Login;IDSeance;NbJudges;NbProducts;NbAttributes;DataType;NbData\n";
        //            break;
        //        case "ErrorAnalysis":
        //            header = "Date;Login;RWork\n";
        //            break;
        //        case "ErrorPanelLeader":
        //            header = "Date;Login;Page;Method;Message\n";
        //            break;
        //        case "ErrorPanelist":
        //            header = "Date;Page;Method;Message\n";
        //            break;
        //        case "ErrorWeb":
        //            header = "Date;Page;Method;Message\n";
        //            break;
        //    }
        //    w.Write(header);
        //    w.Close();
        //}

        //public static void LogException(Exception ex, string page)
        //{
        //    if (ex is FaultException)
        //    {
        //        // Exception généré par l'utilsateur : pas de log
        //        return;
        //    }
        //    StackFrame sf = new StackFrame(1);
        //    string callingMethod = sf.GetMethod().Name;
        //    string data = DateTime.Now.ToString() + ";" + page + ";" + callingMethod + ";" + ex.Message;
        //    SaveInLog("ErrorWeb", data);
        //}

        //private string getUserEnvironment(HttpRequest request)
        //{
        //    var browser = request.Browser;
        //    var platform = getUserPlatform(request);
        //    return string.Format("{0} {1} / {2}", browser.Browser, browser.Version, platform);
        //}

        private static string getUserPlatform(HttpRequest request)
        {
            var ua = request.UserAgent;

            if (ua.Contains("Android"))
                return string.Format("Android {0}", getMobileVersion(ua, "Android"));

            if (ua.Contains("iPad"))
                return string.Format("iPad OS {0}", getMobileVersion(ua, "OS"));

            if (ua.Contains("iPhone"))
                return string.Format("iPhone OS {0}", getMobileVersion(ua, "OS"));

            if (ua.Contains("Linux") && ua.Contains("KFAPWI"))
                return "Kindle Fire";

            if (ua.Contains("RIM Tablet") || (ua.Contains("BB") && ua.Contains("Mobile")))
                return "Black Berry";

            if (ua.Contains("Windows Phone"))
                return string.Format("Windows Phone {0}", getMobileVersion(ua, "Windows Phone"));

            if (ua.Contains("Mac OS"))
                return "Mac OS";

            if (ua.Contains("Windows NT 5.1") || ua.Contains("Windows NT 5.2"))
                return "Windows XP";

            if (ua.Contains("Windows NT 6.0"))
                return "Windows Vista";

            if (ua.Contains("Windows NT 6.1"))
                return "Windows 7";

            if (ua.Contains("Windows NT 6.2"))
                return "Windows 8";

            if (ua.Contains("Windows NT 6.3"))
                return "Windows 8.1";

            if (ua.Contains("Windows NT 10"))
                return "Windows 10";

            //fallback to basic platform:
            return request.Browser.Platform + (ua.Contains("Mobile") ? " Mobile " : "");
        }

        private static string getMobileVersion(string userAgent, string device)
        {
            var temp = userAgent.Substring(userAgent.IndexOf(device) + device.Length).TrimStart();
            var version = string.Empty;

            foreach (var character in temp)
            {
                var validCharacter = false;
                int test = 0;

                if (Int32.TryParse(character.ToString(), out test))
                {
                    version += character;
                    validCharacter = true;
                }

                if (character == '.' || character == '_')
                {
                    version += '.';
                    validCharacter = true;
                }

                if (validCharacter == false)
                    break;
            }

            return version;
        }

        private static ClientLog extractHttpRequestInfo(HttpRequest request)
        {
            ClientLog log = new ClientLog();
            log.Browser = request.Browser.Browser;
            log.BrowserVersion = request.Browser.Version;
            if (request.UserHostAddress.Length > 3)
            {
                log.IP = request.UserHostAddress;
            } else
            {
                log.IP = "";
            }
            if (request.UserHostName.Length > 3)
            {
                log.DNS = request.UserHostName;
            } else
            {
                log.DNS = "";
            }
            log.ECMAScriptVersion = request.Browser.EcmaScriptVersion.ToString();
            log.Language = request.UserLanguages[0];
            //log.OS = request.Browser.Platform;
            log.OS = getUserPlatform(request);
            log.UserAgent = request.UserAgent;
            if (request.Browser.IsMobileDevice)
            {
                log.Mobile = request.Browser.MobileDeviceManufacturer + ", " + request.Browser.MobileDeviceModel;
            } else
            {
                log.Mobile = "";
            }
            return log;
        }

        public static void LogConnexion(HttpRequest request, string client, string version, string login)
        {
            ClientLog log = extractHttpRequestInfo(request);
            log.Date = DateTime.Now;
            log.Client = client;
            log.Location = Geolocation(log.IP);
            log.Login = login;
            log.Version = version;
            save(log);
        }

        public static List<ClientLog> GetClientLog()
        {
            string jsonText = File.ReadAllText(connexionsLogPath + "current.json");
            List<ClientLog> list = JsonConvert.DeserializeObject<List<ClientLog>>(jsonText);
            return list;
        }

        private static void save<T>(T data)
        {

            lock (locker)
            {
                string path = "";
                string file = "";
                
                if (data is ClientLog)
                {
                    path = connexionsLogPath;
                    file = path + "\\current.json";
                }

                if (data is PanelLeaderActionLog)
                {
                    path = panelLeaderLogPath;
                    file = path + "\\current.json";
                }

                if (data is DailyTaskLog)
                {
                    path = dailyTaskLogPath;
                    file = path + "\\current.json";
                }

                //Check if path exist
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                //bool createFile = true;

                //on test si le fichier en cours de remplissage existe
                if (File.Exists(file))
                {
                    FileInfo f = new FileInfo(file);

                    //s'il est plus grand que 5 mo, on le copie pour le stocker et on en crée un nouveau
                    if (f.Length > 10000000)
                    {
                        string date = DateTime.Now.Day + "_" + DateTime.Now.Month + "_" + DateTime.Now.Year + "_" + DateTime.Now.Hour + "h" + DateTime.Now.Minute;
                        string fullPathName = path + "\\" + date;
                        if (File.Exists(fullPathName + ".csv"))
                        {
                            int i = 1;
                            while (File.Exists(fullPathName + "_" + i.ToString() + ".csv"))
                            {
                                i++;
                            }
                            fullPathName = fullPathName + "_" + i.ToString();
                        }                        
                        File.Move(file, fullPathName + ".csv");
                        
                    }
                    //else
                    //{
                    //    createFile = false;
                    //}
                }

                append<T>(file, data);

                //string txtToWrite = "";
                //StreamWriter w;

                //if (createFile == true)
                //{
                //    File.Create(file).Close();
                //    List<T> list = new List<T>();
                //    list.Add(data);
                //    txtToWrite = JsonConvert.SerializeObject(list);
                //    w = File.CreateText(file);
                //} else
                //{
                //    txtToWrite = JsonConvert.SerializeObject(data);
                //    w = File.AppendText(file);
                //}
                
                ////string txt = JsonConvert.SerializeObject(data);
                ////w.Write(data + "\n");
                //w.Write(txtToWrite);
                //w.Close();
            }

        }

        private static void append<T>(string filename, T data)
        {           
            bool firstTransaction = !File.Exists(filename);

            JsonSerializer ser = new JsonSerializer();
            //ser.Formatting = Formatting.Indented;
            //ser.TypeNameHandling = TypeNameHandling.Auto;

            using (var fs = new FileStream(filename, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.Read))
            {
                Encoding enc = firstTransaction ? new UTF8Encoding(true) : new UTF8Encoding(false);

                using (var sw = new StreamWriter(fs, enc))
                using (var jtw = new JsonTextWriter(sw))
                {
                    if (firstTransaction)
                    {
                        sw.Write("[");
                        sw.Flush();
                    }

                    else
                    {
                        fs.Seek(-Encoding.UTF8.GetByteCount("]"), SeekOrigin.End);
                        sw.Write(",");
                        sw.Flush();
                    }

                    ser.Serialize(jtw, data);
                    sw.Write(']');
                }
            }


        }


        //public static void LogConnexionClient(HttpRequest Request, string mode)
        //{
        //    try
        //    {
        //        //on récupère l'OS
        //        bool mobile = false;
        //        string OS = "inconnu";

        //        if (Request.UserAgent.Contains("Windows"))
        //        {
        //            if (Request.UserAgent.Contains("Windows 98"))
        //            {
        //                OS = "Windows 98";
        //            }
        //            else if (Request.UserAgent.Contains("Windows NT 5.0"))
        //            {
        //                OS = "Windows 2000";
        //            }
        //            else if (Request.UserAgent.Contains("Windows NT 5.1"))
        //            {
        //                OS = "Windows XP";
        //            }
        //            else if (Request.UserAgent.Contains("Windows NT 6.0"))
        //            {
        //                OS = "Windows Vista";
        //            }
        //            else if (Request.UserAgent.Contains("Windows NT 6.1"))
        //            {
        //                OS = "Windows 7";
        //            }
        //            else if (Request.UserAgent.Contains("Windows NT 6.2"))
        //            {
        //                OS = "Windows 8";
        //                if (Request.UserAgent.Contains("ARM"))
        //                {
        //                    OS = "Windows 8 RT";
        //                }
        //            }

        //            if (Request.UserAgent.Contains("Tablet"))
        //                mobile = true;
        //        }
        //        else if (Request.UserAgent.Contains("Mac"))
        //        {
        //            OS = "Mac";
        //        }
        //        else if (Request.UserAgent.Contains("X11"))
        //        {
        //            OS = "UNIX";
        //        }
        //        else if (Request.UserAgent.Contains("Linux"))
        //        {
        //            OS = "Linux";
        //        }
        //        else if (Request.UserAgent.Contains("ipod") || Request.UserAgent.Contains("iphone") || Request.UserAgent.Contains("ipad"))
        //        {
        //            OS = "IOS";
        //            mobile = true;
        //        }
        //        else if (Request.UserAgent.Contains("android") || Request.UserAgent.Contains("Android"))
        //        {
        //            OS = "Android";
        //            mobile = true;
        //        }

        //        LogHelper.SaveInLog("ConnexionPanelist", DateTime.Now.ToString() + ";" + mode + ";" + mobile.ToString() + ";" + OS + ";" + Request.Browser.Browser + ";" + Request.Browser.Version + ";" + Request.Browser.EcmaScriptVersion + ";" + Request.UserAgent.Replace(";", " "));
        //    }
        //    catch
        //    {
        //    }
        //}

        public static string Geolocation(string customerIp)
        {
            string country = "Unknown";
            string city = "Unknown";

            if (!String.IsNullOrEmpty(customerIp))
            {
                try
                {
                    WebRequest request = WebRequest.Create("http://www.geoplugin.net/asp.gp?ip=" + customerIp);
                    WebResponse response = request.GetResponse();
                    Stream dataStream = response.GetResponseStream();
                    StreamReader reader = new StreamReader(dataStream);
                    string responseFromServer = reader.ReadToEnd();

                    if (!String.IsNullOrEmpty(responseFromServer))
                    {
                        //on extrait le pays
                        int iCountry = responseFromServer.IndexOf("@16");
                        int iCountryEnd = responseFromServer.IndexOf("@17");
                        if (iCountry >= 0 && iCountryEnd >= 0)
                        {
                            string s = responseFromServer.Substring(iCountry + 4, (iCountryEnd - iCountry - 5));
                            if (!String.IsNullOrEmpty(s))
                                country = s;
                        }

                        //on extrait la ville (plus ou moins précise)
                        int iCity = responseFromServer.IndexOf("@6");
                        int iCityEnd = responseFromServer.IndexOf("@7");
                        if (iCity >= 0 && iCityEnd >= 0)
                        {
                            string s = responseFromServer.Substring(iCity + 3, (iCityEnd - iCity - 4));
                            if (!String.IsNullOrEmpty(s))
                                city = s;
                        }
                    }


                }
                catch (Exception ex)
                {
                    //TODO
                    //LogHelper.LogException(ex, "LogHelper");
                }
            }

            if (country != city)
            {
                return country + " - " + city;
            } else
            {
                return country;
            }
        }

        //TODO : downloadcsv

        //TODO : lire les fichiers csv et les transformer en objet et faire l'agrégation côté client (datatable)
        //private static void getStatistics(DateTime minDate, DateTime maxDate)
        //{
        //    try
        //    {                
        //        string txt = "";
        //        string[] lines;
        //        Statistics stat = new Statistics();
        //        stat.PanelLeaderStatistics = new List<PanelLeaderStatistics>();
        //        stat.PanelistStatistics = new PanelistStatistics();
        //        stat.AnalysisStatistics = new List<AnalysisStatistics>();

        //        if (File.Exists(logOfPanelLeaderConnexionPath))
        //        {
        //            txt = File.ReadAllText(logOfPanelLeaderConnexionPath);
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();

        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[1]))
        //                        {
        //                            dic[parts[1]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[1], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                stat.PanelLeaderStatistics.Add(new PanelLeaderStatistics() { Login = kvp.Key, Connexions = kvp.Value });                  
        //            }

        //        }

        //        if (File.Exists(logOfPanelistConnexionPath))
        //        {
        //            txt = File.ReadAllText(logOfPanelistConnexionPath);
        //            lines = txt.Split('\n');
        //            int nbConnexions = 0;
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        nbConnexions++;
        //                    }
        //                }
        //            }
        //            stat.PanelistStatistics.Connexions = nbConnexions;

        //        }

        //        if (File.Exists(logOfAnalysesPath))
        //        {
        //            txt = File.ReadAllText(logOfAnalysesPath);
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[2]))
        //                        {
        //                            dic[parts[2]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[2], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                stat.AnalysisStatistics.Add(new AnalysisStatistics() { Function = kvp.Key, Usages = kvp.Value });                        
        //            }

        //        }

        //        if (File.Exists(logOfImportsPath))
        //        {
        //            txt = File.ReadAllText(logOfImportsPath);
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[2]))
        //                        {
        //                            dic[parts[2]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[2], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                stat.PanelLeaderStatistics.Add(new PanelLeaderStatistics() { Login = kvp.Key, Imports = kvp.Value });
        //            }

        //        }

        //        if (File.Exists(logOfUploadsPath))
        //        {
        //            txt = File.ReadAllText(logOfUploadsPath);
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        int nbJuges = 0;
        //                        if (int.TryParse(parts[4], out nbJuges))
        //                        {
        //                            if (dic.ContainsKey(parts[1]))
        //                            {
        //                                dic[parts[1]] += nbJuges;
        //                            }
        //                            else
        //                            {
        //                                dic.Add(parts[1], nbJuges);
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                stat.PanelLeaderStatistics.Add(new PanelLeaderStatistics() { Login = kvp.Key, Uploads = kvp.Value });
        //            }

        //        }

        //        //if (File.Exists(path + "SMS\\SMS_Log_current.csv"))
        //        //{
        //        //    txt = File.ReadAllText(path + "SMS\\SMS_Log_current.csv");
        //        //    lines = txt.Split('\n');
        //        //    Dictionary<string, int> dic = new Dictionary<string, int>();
        //        //    html += string.Format(h2, "Envoi de SMS");
        //        //    for (int i = 1; i < lines.Length; i++)
        //        //    {
        //        //        string line = lines[i];
        //        //        string[] parts = line.Split(';');
        //        //        DateTime dt;
        //        //        if (DateTime.TryParse(parts[0], out dt))
        //        //        {
        //        //            if (dt >= minDate && dt <= maxDate)
        //        //            {
        //        //                int nbSms = 0;
        //        //                if (int.TryParse(parts[2], out nbSms))
        //        //                {
        //        //                    if (dic.ContainsKey(parts[1]))
        //        //                    {
        //        //                        dic[parts[1]] += nbSms;
        //        //                    }
        //        //                    else
        //        //                    {
        //        //                        dic.Add(parts[1], nbSms);
        //        //                    }
        //        //                }
        //        //            }
        //        //        }
        //        //    }
        //        //    foreach (KeyValuePair<string, int> kvp in dic)
        //        //    {
        //        //        html += string.Format(p, kvp.Key + " : " + kvp.Value + " juge(s)");
        //        //    }
        //        //    listAttachments.Add(new Attachment(path + "SMS\\SMS_Log_current.csv"));
        //        //}

        //        //if (File.Exists(path + "SensoBase\\SensoBase_Log_current.csv"))
        //        //{
        //        //    txt = File.ReadAllText(path + "SensoBase\\SensoBase_Log_current.csv");
        //        //    lines = txt.Split('\n');
        //        //    html += string.Format(h2, "Import SensoBase");
        //        //    Dictionary<string, int> dic = new Dictionary<string, int>();
        //        //    for (int i = 1; i < lines.Length; i++)
        //        //    {
        //        //        string line = lines[i];
        //        //        string[] parts = line.Split(';');
        //        //        DateTime dt;
        //        //        if (DateTime.TryParse(parts[0], out dt))
        //        //        {
        //        //            if (dt >= minDate && dt <= maxDate)
        //        //            {
        //        //                if (dic.ContainsKey(parts[6]))
        //        //                {
        //        //                    dic[parts[6]]++;
        //        //                }
        //        //                else
        //        //                {
        //        //                    dic.Add(parts[6], 1);
        //        //                }
        //        //            }
        //        //        }
        //        //    }
        //        //    foreach (KeyValuePair<string, int> kvp in dic)
        //        //    {
        //        //        html += string.Format(p, kvp.Key + " : " + kvp.Value + " nouveau(x) jeu(x) de données");
        //        //    }
        //        //    listAttachments.Add(new Attachment(path + "SensoBase\\SensoBase_Log_current.csv"));
        //        //}

        //        //if (File.Exists(logOfAnalysesErrorPath))
        //        //{

        //        //}
        //        //if (File.Exists(logOfPanelLeaderErrorPath))
        //        //{

        //        //}
        //        //if (File.Exists(logOfPanelistErrorPath))
        //        //{

        //        //}
        //        //if (File.Exists(logOfWebSiteErrorPath))
        //        //{

        //        //}


        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //}

        //private static void getStatistics(DateTime minDate, DateTime maxDate)
        //{
        //    try
        //    {
        //        string txt = "";
        //        string[] lines;
        //        Statistics stat = new Statistics();
        //        stat.PanelLeaderStatistics = new List<PanelLeaderStatistics>();
        //        stat.PanelistStatistics = new PanelistStatistics();
        //        stat.AnalysisStatistics = new List<AnalysisStatistics>();

        //        if (File.Exists(logOfPanelLeaderConnexionPath))
        //        {
        //            txt = File.ReadAllText(logOfPanelLeaderConnexionPath);
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();

        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[1]))
        //                        {
        //                            dic[parts[1]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[1], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                stat.PanelLeaderStatistics.Add(new PanelLeaderStatistics() { Login = kvp.Key, Connexions = kvp.Value });
        //            }

        //        }

        //        if (File.Exists(logOfPanelistConnexionPath))
        //        {
        //            txt = File.ReadAllText(logOfPanelistConnexionPath);
        //            lines = txt.Split('\n');
        //            int nbConnexions = 0;
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        nbConnexions++;
        //                    }
        //                }
        //            }
        //            stat.PanelistStatistics.Connexions = nbConnexions;

        //        }

        //        if (File.Exists(logOfAnalysesPath))
        //        {
        //            txt = File.ReadAllText(logOfAnalysesPath);
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[2]))
        //                        {
        //                            dic[parts[2]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[2], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                stat.AnalysisStatistics.Add(new AnalysisStatistics() { Function = kvp.Key, Usages = kvp.Value });
        //            }

        //        }

        //        if (File.Exists(logOfImportsPath))
        //        {
        //            txt = File.ReadAllText(logOfImportsPath);
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        if (dic.ContainsKey(parts[2]))
        //                        {
        //                            dic[parts[2]]++;
        //                        }
        //                        else
        //                        {
        //                            dic.Add(parts[2], 1);
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                stat.PanelLeaderStatistics.Add(new PanelLeaderStatistics() { Login = kvp.Key, Imports = kvp.Value });
        //            }

        //        }

        //        if (File.Exists(logOfUploadsPath))
        //        {
        //            txt = File.ReadAllText(logOfUploadsPath);
        //            lines = txt.Split('\n');
        //            Dictionary<string, int> dic = new Dictionary<string, int>();
        //            for (int i = 1; i < lines.Length; i++)
        //            {
        //                string line = lines[i];
        //                string[] parts = line.Split(';');
        //                DateTime dt;
        //                if (DateTime.TryParse(parts[0], out dt))
        //                {
        //                    if (dt >= minDate && dt <= maxDate)
        //                    {
        //                        int nbJuges = 0;
        //                        if (int.TryParse(parts[4], out nbJuges))
        //                        {
        //                            if (dic.ContainsKey(parts[1]))
        //                            {
        //                                dic[parts[1]] += nbJuges;
        //                            }
        //                            else
        //                            {
        //                                dic.Add(parts[1], nbJuges);
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //            foreach (KeyValuePair<string, int> kvp in dic)
        //            {
        //                stat.PanelLeaderStatistics.Add(new PanelLeaderStatistics() { Login = kvp.Key, Uploads = kvp.Value });
        //            }

        //        }

        //        //if (File.Exists(path + "SMS\\SMS_Log_current.csv"))
        //        //{
        //        //    txt = File.ReadAllText(path + "SMS\\SMS_Log_current.csv");
        //        //    lines = txt.Split('\n');
        //        //    Dictionary<string, int> dic = new Dictionary<string, int>();
        //        //    html += string.Format(h2, "Envoi de SMS");
        //        //    for (int i = 1; i < lines.Length; i++)
        //        //    {
        //        //        string line = lines[i];
        //        //        string[] parts = line.Split(';');
        //        //        DateTime dt;
        //        //        if (DateTime.TryParse(parts[0], out dt))
        //        //        {
        //        //            if (dt >= minDate && dt <= maxDate)
        //        //            {
        //        //                int nbSms = 0;
        //        //                if (int.TryParse(parts[2], out nbSms))
        //        //                {
        //        //                    if (dic.ContainsKey(parts[1]))
        //        //                    {
        //        //                        dic[parts[1]] += nbSms;
        //        //                    }
        //        //                    else
        //        //                    {
        //        //                        dic.Add(parts[1], nbSms);
        //        //                    }
        //        //                }
        //        //            }
        //        //        }
        //        //    }
        //        //    foreach (KeyValuePair<string, int> kvp in dic)
        //        //    {
        //        //        html += string.Format(p, kvp.Key + " : " + kvp.Value + " juge(s)");
        //        //    }
        //        //    listAttachments.Add(new Attachment(path + "SMS\\SMS_Log_current.csv"));
        //        //}

        //        //if (File.Exists(path + "SensoBase\\SensoBase_Log_current.csv"))
        //        //{
        //        //    txt = File.ReadAllText(path + "SensoBase\\SensoBase_Log_current.csv");
        //        //    lines = txt.Split('\n');
        //        //    html += string.Format(h2, "Import SensoBase");
        //        //    Dictionary<string, int> dic = new Dictionary<string, int>();
        //        //    for (int i = 1; i < lines.Length; i++)
        //        //    {
        //        //        string line = lines[i];
        //        //        string[] parts = line.Split(';');
        //        //        DateTime dt;
        //        //        if (DateTime.TryParse(parts[0], out dt))
        //        //        {
        //        //            if (dt >= minDate && dt <= maxDate)
        //        //            {
        //        //                if (dic.ContainsKey(parts[6]))
        //        //                {
        //        //                    dic[parts[6]]++;
        //        //                }
        //        //                else
        //        //                {
        //        //                    dic.Add(parts[6], 1);
        //        //                }
        //        //            }
        //        //        }
        //        //    }
        //        //    foreach (KeyValuePair<string, int> kvp in dic)
        //        //    {
        //        //        html += string.Format(p, kvp.Key + " : " + kvp.Value + " nouveau(x) jeu(x) de données");
        //        //    }
        //        //    listAttachments.Add(new Attachment(path + "SensoBase\\SensoBase_Log_current.csv"));
        //        //}

        //        //if (File.Exists(logOfAnalysesErrorPath))
        //        //{

        //        //}
        //        //if (File.Exists(logOfPanelLeaderErrorPath))
        //        //{

        //        //}
        //        //if (File.Exists(logOfPanelistErrorPath))
        //        //{

        //        //}
        //        //if (File.Exists(logOfWebSiteErrorPath))
        //        //{

        //        //}


        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //}

        public static void LogPanelLeaderAction(string login, DateTime date, string action, string detail)
        {
            PanelLeaderActionLog log = new PanelLeaderActionLog();
            log.Date = date;
            log.Action = action;
            log.Detail = detail;
            log.Login = login;            
            save(log);
        }

        public static void LogDailyTaskAction(DateTime date, string action)
        {

            DailyTaskLog log = new DailyTaskLog();
            log.Date = date;
            log.Action = action;            
            save(log);
        }
    }

    public class DailyTaskLog
    {
        public DateTime Date;
        public string Action;
    }

    public class ClientLog
    {
        public DateTime Date;
        public string DNS;
        public string IP;
        public string Location;
        public string Client; // WebSite, Panelist, PanelLeader
        public string Version;
        public string Login;
        //public string UniqueId; //TODO (ancienne identification par carte mère)
        public string OS;
        public string Mobile;
        public string Browser;
        public string BrowserVersion;
        public string ECMAScriptVersion;
        public string UserAgent;
        public string Language;        
    }

    //TODO
    public class PanelLeaderActionLog
    {
        public DateTime Date;        
        public string Login;
        public string Action;
        public string Detail;
        //Import : DataType //NbJudges  //NbData
        //Upload : Repertoire Expiration  NbJuges AnonymousMode
    }

    //TODO
    public class ErrorLog
    {
        public DateTime Date;
        public string Login;
        public string Client; // WebSite Panelist PanelLeader WebService Analysis

        //public string OS;
        //public string Mobile;
        //public string Browser;
        //public string BrowserVersion;
        //public string ECMAScriptVersion;

        // Page Methode Message

    }

    //TODO
    public class AnalysisLog
    {
        public DateTime Date;
        public string Login;
        // Function Parameters RWork Status
    }

    //public class Statistics
    //{
    //    public List<PanelLeaderStatistics> PanelLeaderStatistics;
    //    public PanelistStatistics PanelistStatistics;
    //    public List<AnalysisStatistics> AnalysisStatistics;
    //}

    //public class PanelLeaderStatistics
    //{
    //    public string Login;
    //    public int Connexions;
    //    public int Imports;
    //    public int Uploads;
    //    public int Analyses; //TODO
    //}

    //public class PanelistStatistics
    //{
    //    public int Connexions;
    //}

    //public class AnalysisStatistics
    //{
    //    public string Function;
    //    public int Usages;
    //}

}