using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.Web;
using System.Web.Script.Serialization;
using TimeSense.Web.Helpers;

namespace ChemosensTools.analyses.cs
{
    public class RAnalysisResult
    {
        //public string Log;
        //public string PPTasString;
        public string URL;
    }

    public class RAnalysis
    {
        public static string Run(string login, string analysis, byte[] data, List<string> authorizedApps)
        {
            RAnalysisResult result = new RAnalysisResult();

            // Crée un répertoire avec un nom aléatoire dans le dossier du panel leader
            string id = FileHelper.CreateRandomName(RWORK_PATH + login);
            string fdp = RWORK_PATH + login + "\\" + id;
            System.IO.Directory.CreateDirectory(fdp);

            // Crée le fichier de données
            FileHelper.UploadBinary(fdp, "data.xlsx", data);

            // Crée le fichier de script
            string script = RSCRIPT_PATH + analysis + ".r";
            FileHelper.UploadFile(fdp, "script.r", File.ReadAllText(script));

            // Crée le fichier css
            string css = RSCRIPT_PATH + "style.css";
            FileHelper.UploadFile(fdp, "style.css", File.ReadAllText(css));

            // Crée le fichier d'authorisation
            FileHelper.UploadFile(fdp, "access.txt", String.Join(";",authorizedApps));

            Process rProcess = new Process();
            rProcess.StartInfo.FileName = RBIN_PATH;
            rProcess.StartInfo.Arguments = "CMD BATCH --save " + fdp + "\\script.r";
            rProcess.StartInfo.CreateNoWindow = true;
            rProcess.StartInfo.UseShellExecute = false;
            rProcess.StartInfo.WorkingDirectory = fdp;
            rProcess.Start();
            rProcess.WaitForExit();

            // Lecture du fichier log   
            //string log = File.ReadAllText(RWORK_PATH + login + "\\" + id + "\\log.txt");

            // Lecture du fichier résultat            
            //byte[] bytes = File.ReadAllBytes(RWORK_PATH + login + "\\" + id + "\\report.pptx");
            //byte[] bytes = File.ReadAllBytes(RWORK_PATH + login + "\\" + id + "\\report.html");

            // TODO Suppression
            //File.Delete(RWORK_PATH + login + "\\" + id);

            //result.Log = log;
            //result.PPTasString = Convert.ToBase64String(bytes);
            result.URL = ConfigurationManager.AppSettings["AnalysesURL"] + login + "/" + id + "/report.html";


            string jsonString = new JavaScriptSerializer().Serialize(result);
            return jsonString;

        }

        public static string RunFromCsv(string login, string analysis, string data, string analysisOptions, ExcelPackage xlPackage)
        {
            RAnalysisResult result = new RAnalysisResult();

            // Crée le fichier XLS
            
            // Crée un répertoire avec un nom aléatoire dans le dossier du panel leader
            string id = FileHelper.CreateRandomName(RWORK_PATH + login);
            string fdp = RWORK_PATH + login + "\\" + id;
            System.IO.Directory.CreateDirectory(fdp);

            xlPackage.SaveAs(new FileInfo(fdp + "\\data.xlsx"));

            // Crée le fichier de données
            File.WriteAllText(fdp + "\\data.txt", data);

            // Crée le fichier de paramètres
            File.WriteAllText(fdp + "\\parameters.txt", analysisOptions);

            // Crée le fichier de script
            string script = RSCRIPT_PATH + analysis + ".r";
            FileHelper.UploadFile(fdp, "script.r", File.ReadAllText(script));

            // Crée le fichier css
            string css = RSCRIPT_PATH + "style.css";
            FileHelper.UploadFile(fdp, "style.css", File.ReadAllText(css));

           
            Process rProcess = new Process();
            rProcess.StartInfo.FileName = RBIN_PATH;
            rProcess.StartInfo.Arguments = "CMD BATCH --save " + fdp + "\\script.r";
            rProcess.StartInfo.CreateNoWindow = true;
            rProcess.StartInfo.UseShellExecute = false;
            rProcess.StartInfo.WorkingDirectory = fdp;
            rProcess.Start();
            rProcess.WaitForExit();

            // Lecture du fichier log   
            //string log = File.ReadAllText(RWORK_PATH + login + "\\" + id + "\\log.txt");

            // Lecture du fichier résultat            
            //byte[] bytes = File.ReadAllBytes(RWORK_PATH + login + "\\" + id + "\\report.pptx");
            //byte[] bytes = File.ReadAllBytes(RWORK_PATH + login + "\\" + id + "\\report.html");

            // TODO Suppression
            //File.Delete(RWORK_PATH + login + "\\" + id);

            //result.Log = log;
            //result.PPTasString = Convert.ToBase64String(bytes);
            result.URL = ConfigurationManager.AppSettings["AnalysesURL"] + login + "/" + id + "/report.html";


            string jsonString = new JavaScriptSerializer().Serialize(result);
            return jsonString;

        }

        private static string RBIN_PATH = ConfigurationManager.AppSettings["RBinPath"];
        private static string RWORK_PATH = ConfigurationManager.AppSettings["RWorkDirPath"];
        private static string RSCRIPT_PATH = ConfigurationManager.AppSettings["RScriptDirPath"];
       
    }
}