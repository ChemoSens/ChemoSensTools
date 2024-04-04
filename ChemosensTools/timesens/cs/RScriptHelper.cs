using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.ServiceModel;
using System.Text;
using TimeSens.webservices.models;
using TimeSense.Web.Helpers;

namespace TimeSens.webservices.helpers
{
    public class RScriptHelper
    {
        private static string R_PATH = ConfigurationManager.AppSettings["RBinPath"];
        private static string fixedDirPath = ConfigurationManager.AppSettings["RWorkDirPath"];

        /// <summary>
        /// Exécute le script R
        /// </summary>
        private static void launchScript(string fullDirPath)
        {
            try
            {
                // Remplacement de $TMPDIR$ dans script.r
                StreamReader reader = new StreamReader(fullDirPath + "\\script.r");
                string myString = reader.ReadToEnd().Replace("$TMPDIR$", ConfigurationManager.AppSettings["TmpDirPath"]);
                reader.Close();
                StreamWriter sw = new StreamWriter(fullDirPath + "\\script.r");
                sw.Write(myString);
                sw.Close();

                Process rProcess = new Process();
                rProcess.StartInfo.FileName = R_PATH;
                rProcess.StartInfo.Arguments = "CMD BATCH " + fullDirPath + "\\script.r";
                rProcess.StartInfo.CreateNoWindow = true;
                rProcess.StartInfo.UseShellExecute = false;
                rProcess.StartInfo.WorkingDirectory = fullDirPath;
                rProcess.Start();
                rProcess.WaitForExit();


                //if (rProcess.Responding)
                //{
                //    rProcess.Kill();
                //}
                //int cpt = 0;
                //while (cpt < MAX_SLEEP_AMOUNT)
                //{
                //    if (!rProcess.HasExited)
                //    {
                //        Thread.Sleep(SLEEP_AMOUNT);
                //        cpt += SLEEP_AMOUNT;
                //    }
                //    else
                //    {
                //        break;
                //    }
                //}
                //rProcess.Close();
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService");
                throw new FaultException(new FaultReason(ex.Message), new FaultCode("EXECUTE_SCRIPT_FAILED"));
            }
        }

        private static List<KeyValuePair<string, string>> getFunctionsFromRScript(string script)
        {
            try
            {
                List<KeyValuePair<string, string>> l = new List<KeyValuePair<string, string>>();
                string[] lines = script.Split('\n');
                foreach (string line in lines)
                {
                    if (line.StartsWith("TS") == true && line.StartsWith("TS_StartLogAnalysis") == false && line.StartsWith("TS_StopLogAnalysis") == false && line.StartsWith("TS_LogEntry") == false)
                    {
                        string function = line.Split('(').ElementAt(0);
                        string parameters = line.Replace(function, "");
                        l.Add(new KeyValuePair<string, string>(function, parameters));
                    }
                }
                return l;
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService");
                return null;
            }
        }

        private static ObservableCollection<Data> downloadSubjectData(string serverCode, string login, string password)
        {
            //TODO
            ObservableCollection<string> listServerCodes = new ObservableCollection<string>();
            listServerCodes.Add(serverCode);

            License l = LicenceHelper.GetAuthentificateLicense(login, password);


            //string progress = SeanceHelper.DownloadSubjectProgress(Serializer.SerializeToString(listServerCodes), null, l);

            ObservableCollection<Data> dataList = new ObservableCollection<Data>();
            //JObject root = JObject.Parse(progress);
            //var serializer = new JsonSerializer();
            //List<JToken> results = root["ListProgress"].Children().ToList();
            //foreach (JToken result in results)
            //{
            //    ObservableCollection<Data> listData = serializer.Deserialize<ObservableCollection<Data>>(result["ListData"].CreateReader());
            //    dataList = new ObservableCollection<Data>(dataList.Concat(listData));
            //}

            // Envoi au client des données non cryptées
            return dataList;
        }

        public static string ExecuteScriptForSubjectSummary(string serverCode, string xmlScript, string login, string password)
        {
            try
            {
                // Test : utilisateur authentifié
                //if (!LicenceHelper.Authentificate(login, password))
                //{
                //    throw new FaultException(new FaultReason(Language.AuthentificationFailed), new FaultCode("AUTHENTIFICATION_FAILED"));
                //}
                ObservableCollection<Data> res = downloadSubjectData(serverCode, login, password);
                //RScript rScript = Serializer.DeserializeFromString<RScript>(xmlScript, null);
                RScript rScript = new RScript();
                rScript.Script = xmlScript;
                rScript.Data = "Type;Replicate;SubjectCode;ProductCode;AttributeCode;Time;Score;ProductRank;AttributeRank;RecordedDate;Session;X;Y;QuestionLabel;Group;Description;DataControlId\r\n";
                foreach (Data d in res)
                {
                    rScript.Data += d.Type.ToString() + ";";
                    rScript.Data += d.Replicate != null ? d.Replicate.ToString() + ";" : ";";
                    rScript.Data += d.SubjectCode != null ? d.SubjectCode.ToString() + ";" : ";";
                    rScript.Data += d.ProductCode != null ? d.ProductCode.ToString() + ";" : ";";
                    rScript.Data += d.AttributeCode != null ? d.AttributeCode.ToString() + ";" : ";";
                    rScript.Data += d.Time != null ? d.Time.ToString().Replace(',', '.') + ";" : ";";
                    rScript.Data += d.Score != null ? d.Score.ToString().Replace(',', '.') + ";" : ";";
                    rScript.Data += d.ProductRank != null ? d.ProductRank.ToString() + ";" : ";";
                    rScript.Data += d.AttributeRank != null ? d.AttributeRank.ToString() + ";" : ";";
                    rScript.Data += d.RecordedDate != null ? d.RecordedDate.ToString() + ";" : ";";
                    rScript.Data += d.Session != null ? d.Session.ToString() + ";" : ";";
                    rScript.Data += d.X != null ? d.X.ToString() + ";" : ";";
                    rScript.Data += d.Y != null ? d.Y.ToString() + ";" : ";";
                    rScript.Data += d.QuestionLabel != null ? d.QuestionLabel.ToString() + ";" : ";";
                    rScript.Data += d.Group != null ? d.Group.ToString() + ";" : ";";
                    rScript.Data += d.Description != null ? d.Description.ToString() + ";" : ";";
                    rScript.Data += d.DataControlId.ToString() + "\r\n";
                }

                RScriptResult result = executeScript(rScript, login);
                //deleteDirectory();
                return Serializer.SerializeToString(result, null);
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService");
                throw new FaultException(new FaultReason(ex.Message), new FaultCode("EXECUTE_SCRIPT_FAILED"));
            }
        }

        public static string RunRScript(string script, string directory, string returnType)
        {
            try
            {

                // Créer un fichier avec un nom aléatoire dans le dossier du panel leader
                string randomName = FileHelper.CreateRandomName(fixedDirPath);
                string fdp = fixedDirPath + directory + "\\" + randomName;
                //string fdp = fixedDirPath + directory + "\\1873822655";
                System.IO.Directory.CreateDirectory(fdp);

                // Création du fichier
                FileStream filer = new FileStream(fdp + "\\script.R", FileMode.Create, FileAccess.Write);
                StreamWriter sw = new StreamWriter(filer);
                sw.Write(script);
                sw.Close();
                filer.Close();

                // Execution du script
                Process rProcess = new Process();
                rProcess.StartInfo.FileName = R_PATH;
                rProcess.StartInfo.Arguments = "CMD BATCH " + fdp + "\\script.r";
                rProcess.StartInfo.CreateNoWindow = true;
                rProcess.StartInfo.UseShellExecute = false;
                rProcess.StartInfo.WorkingDirectory = fdp;
                rProcess.Start();
                rProcess.WaitForExit();

                // Lecture du fichier résultat
                if (returnType == "html")
                {
                    FileStream file = new FileStream(fdp + "\\result.html", FileMode.Open); //TODO
                    StreamReader sww = new StreamReader(file);
                    string html = sww.ReadToEnd();
                    sww.Close();
                    file.Close();

                    FileHelper.DeleteDirectory(fixedDirPath, fdp);

                    return html;
                }

                return "";
                
            }
            catch (Exception e)
            {
                throw new FaultException(""); //TODO
            }
        }


          

        private static RScriptResult executeScript(RScript rScript, string login)
        {
            RScriptResult rScriptResult = new RScriptResult();
            try
            {
                //setDirectory(login);
                string randomName = FileHelper.CreateRandomName(fixedDirPath);
                string fdp = fixedDirPath + login + "\\" + randomName;

                //createRDirectory();
                System.IO.Directory.CreateDirectory(fdp);

                FileHelper.UploadFile(fdp, "data.txt", rScript.Data);
                FileHelper.UploadFile(fdp, "script.r", rScript.Script);
                launchScript(fdp);

                try
                {
                    // Log de l'analyse et des erreurs
                    List<KeyValuePair<string, string>> l = getFunctionsFromRScript(rScript.Script);
                    string data = "";
                    foreach (KeyValuePair<string, string> kvp in l)
                    {
                        data += DateTime.Now.ToString() + ";" + login + ";" + kvp.Key + ";" + kvp.Value + ";" + "\n";
                    }
                    //TODO : Log
                    //LogHelper.SaveInLog("Analysis", data);

                    // Log des erreurs
                    FileStream file = new FileStream(fdp + "\\log.html", FileMode.Open);
                    StreamReader sw = new StreamReader(file);
                    string html = sw.ReadToEnd();
                    sw.Close();
                    file.Close();
                    if (html.Contains("Error") == true || html.Contains("Erreur") == true)
                    {
                        string error = DateTime.Now.ToString() + ";" + login + ";" + fdp.Split('\\').Last();
                        //TODO : Log
                        //LogHelper.SaveInLog("ErrorAnalysis", error);

                        List<Attachment> listAttachments = new List<Attachment>();
                        listAttachments.Add(new Attachment(fdp + "\\data.txt"));
                        listAttachments.Add(new Attachment(fdp + "\\script.r"));


                        // Envoi de mail
                        MailHelper.SendMailWithAttachments("Mail automatique de TimeSens", "michel.visalli@inra.fr", "Erreur d'analyse dans TimeSens", error, listAttachments);
                        MailHelper.SendMailWithAttachments("Mail automatique de TimeSens", "crln.peltier@gmail.com", "Erreur d'analyse dans TimeSens", error, listAttachments);
                    }
                }
                catch (Exception ex)
                {

                }

                // Transformation pdf -> xml
                string[] filePathsPdf = Directory.GetFiles(fdp, "*.pdf");
                foreach (string file in filePathsPdf)
                {
                    string xamlName = file.Replace("pdf", "xaml");
                    //PdfToXaml.ConvertPdfToXaml(file, xamlName);
                }

                string[] filePaths = Directory.GetFiles(fdp, "*.*");

                foreach (string file in filePaths)
                {
                    string type = Path.GetExtension(file).Substring(1);
                    string fileName = Path.GetFileNameWithoutExtension(file);
                    if (fileName != "Rplots" && fileName != "errors" && (type == "xaml" || type == "html" || type == "wmf" || type == "csv"))
                    {
                        RScriptResult.Output o = new RScriptResult.Output();
                        o.Name = Path.GetFileNameWithoutExtension(file);
                        int length = o.Name.Length;

                        var outputs = (from x in rScript.ListOutputs
                                       where o.Name.Contains(x.Name)
                                       select x);
                        if (outputs != null && outputs.Count() > 0)
                        {
                            RScriptResult.Output output = outputs.First();
                            o.Description = output.Description;
                            o.Title = output.Title;
                            o.Function = output.Function;
                        }
                        else
                        {
                            o.Description = "";
                            o.Function = "";
                            o.Title = o.Name;
                        }
                        // Découpage du nom avec "_"
                        string[] tab = o.Name.Split('_');
                        string name = tab[0];
                        string ext = "";
                        if (tab.Length > 1)
                        {
                            for (int i = 1; i < tab.Length; i++)
                            {
                                ext += " " + tab[i];
                            }
                        }
                        o.GeneratedName = ext;
                        o.Type = Path.GetExtension(file).Substring(1);

                        if (o.Type == "wmf")
                        {
                            o.BinaryContent = downloadFile(fdp, Path.GetFileName(file), false);
                        }
                        else
                        {
                            o.BinaryContent = downloadFile(fdp, Path.GetFileName(file));
                        }
                        if (o.Title != "")
                        {
                            rScriptResult.Outputs.Add(o);
                        }
                    }
                }

                FileHelper.DeleteDirectory(fixedDirPath, fdp);

                return rScriptResult;
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService");
                rScriptResult.Errors.Add(ex.Message);
                return rScriptResult;
            }
        }

        private static byte[] downloadFile(string fullDirPath, string fileName, bool utf8 = true)
        {
            try
            {
                if (utf8 == true)
                {
                    Encoding enc = FileHelper.ObtientENcoding(fullDirPath + "\\" + fileName);
                    string s = enc.EncodingName;
                    string txt = File.ReadAllText(fullDirPath + "\\" + fileName, enc);
                    byte[] utf8String = Encoding.UTF8.GetBytes(txt);
                    return utf8String;
                }
                else
                {
                    FileStream fs = new FileStream(fullDirPath + "\\" + fileName, FileMode.Open, FileAccess.Read);
                    BinaryReader r = new BinaryReader(fs);
                    byte[] res = r.ReadBytes((int)fs.Length);
                    return res;
                }
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService");
                return null;
            }
        }

    }
}