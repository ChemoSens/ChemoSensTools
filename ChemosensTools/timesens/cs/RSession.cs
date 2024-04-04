using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.Web;
using TimeSense.Web.Helpers;

namespace TimeSens.webservices.helpers
{
    public class RSession
    {
        private static string RBIN_PATH = ConfigurationManager.AppSettings["RBinPath"];
        private static string RWORK_PATH = ConfigurationManager.AppSettings["RWorkDirPath"];

        public static string Open(string login, string data, string script)
        {
            try
            {
                // Crée un répertoire avec un nom aléatoire dans le dossier du panel leader
                string id = FileHelper.CreateRandomName(RWORK_PATH + login);
                string fdp = RWORK_PATH + login + "\\" + id;
                System.IO.Directory.CreateDirectory(fdp);

                // Crée le fichier de données
                FileHelper.UploadFile(fdp, "data.txt", data);

                // Upload et execute le script de base (chargement de la librairie, ...)                
                FileHelper.UploadFile(fdp, "script.r", script);

                Process rProcess = new Process();
                rProcess.StartInfo.FileName = RBIN_PATH;
                rProcess.StartInfo.Arguments = "CMD BATCH --save " + fdp + "\\script.r";
                rProcess.StartInfo.CreateNoWindow = true;
                rProcess.StartInfo.UseShellExecute = false;
                rProcess.StartInfo.WorkingDirectory = fdp;
                rProcess.Start();
                rProcess.WaitForExit();

                return id;

            }
            catch (Exception e)
            {
                throw new FaultException(""); //TODO
            }

        }

        public static void Close(string login, string id)
        {
            string fdp = RWORK_PATH + login + "\\" + id;
            FileHelper.DeleteDirectory(RWORK_PATH, fdp);
        }

        public static string RunFunction(string login, string id, string functionAsText)
        {
            string fdp = RWORK_PATH + login + "\\" + id;

            // Lecture de l'objet R en mémoire + ajout de la fonction
            FileHelper.UploadFile(fdp, "newScript.r", functionAsText);

            // Execution du script
            Process rProcess = new Process();
            rProcess.StartInfo.FileName = RBIN_PATH;
            rProcess.StartInfo.Arguments = "CMD BATCH --save --restore " + fdp + "\\newScript.r";
            rProcess.StartInfo.CreateNoWindow = true;
            rProcess.StartInfo.UseShellExecute = false;
            rProcess.StartInfo.WorkingDirectory = fdp;
            rProcess.Start();
            rProcess.WaitForExit();

            // Lecture du fichier résultat
            FileStream file = new FileStream(fdp + "\\result.json", FileMode.Open); 
            StreamReader sww = new StreamReader(file);
            string res = sww.ReadToEnd();
            sww.Close();
            file.Close();

            return res;


        }
    }
}