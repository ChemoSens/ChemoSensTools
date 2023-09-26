using System;
using System.Collections.Generic;
using System.IO;
using TimeSens.webservices.helpers;
using System.ServiceModel;
using System.Configuration;
using System.ServiceModel.Web;
using System.Text;
using TimeSens.webservices.models;

namespace TimeSense.Web.Helpers
{
    public class FileHelper
    {

        //private static string fixedDirPath = ConfigurationManager.AppSettings["RWorkDirPath"];

        /// <summary>
        /// Crée un nom de répertoire aléatoire. Ce répertoire sera créé sur le serveur via le web service
        /// </summary>
        /// <returns></returns>
        public static string CreateRandomName(string fixedDirPath)
        {
            try
            {
                Random random = new Random();
                string randomName = random.Next().ToString();
                while (Directory.Exists(fixedDirPath + randomName))
                {
                    randomName = random.Next().ToString();
                }
                return randomName;
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService");
                return "random";
            }
        }

        /// <summary>
        /// Efface la partie aléatoire du répertoire
        /// </summary>
        /// <returns></returns>
        public static void DeleteDirectory(string fixedDirPath, string fullDirPath)
        {
            try
            {
                FileHelper.MarkFileToDelete(fullDirPath);

                // Suppression des répertoires les plus anciens
                if (Directory.Exists(fixedDirPath))
                {
                    foreach (var item in Directory.GetDirectories(fixedDirPath))
                    {
                        string rep = fullDirPath + "/" + item;
                        if (Directory.GetCreationTime(rep).Date < DateTime.Now)
                        {
                            FileHelper.MarkFileToDelete(rep);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService " + fullDirPath + " " + fixedDirPath);
            }
        }

        //private void deleteDirectory(string dir, double days, bool verifyExpirationDate = false)
        //{
        //    try
        //    {
        //        if (Directory.Exists(dir))
        //        {
        //            DirectoryInfo Dir = new DirectoryInfo(dir);
        //            DirectoryInfo[] DirList = Dir.GetDirectories();
        //            foreach (DirectoryInfo di in DirList)
        //            {
        //                try
        //                {
        //                    bool mustDelete = false;

        //                    if (verifyExpirationDate == true && File.Exists(di.FullName + "\\expiration"))
        //                    {
        //                        string text = File.ReadAllText(di.FullName + "\\expiration");
        //                        DateTime expiration = DateTime.Parse(text);

        //                        FileInfo[] FileList = di.GetFiles("mail.*");

        //                        foreach (FileInfo fi in FileList)
        //                        {
        //                            string culture = fi.Extension.Replace(".", "");
        //                            string mail = File.ReadAllText(fi.FullName);

        //                            // 3 jours avant expiration, envoi de mail pour prévenir
        //                            if (expiration > DateTime.Now && expiration.AddDays(-3).Date < DateTime.Now.Date)
        //                            {

        //                                string subject = TimeSense.SLResources.LocalizedString.GetString("SessionExpirationNear", new System.Globalization.CultureInfo(culture));
        //                                string message = String.Format(TimeSense.SLResources.LocalizedString.GetString("SessionExpirationNearContent", new System.Globalization.CultureInfo(culture)), di.Name);
        //                                MailHelper.SendMail("Admin TimeSens", mail, subject, message);
        //                            }
        //                            // Dernier jour : envoi d'un lien pour la possibilité de téléchargé les données en csv
        //                            if (expiration < DateTime.Now)
        //                            {
        //                                //récupération du login du panelleader
        //                                if (Directory.Exists(di.FullName + "\\login"))
        //                                {
        //                                    string login = File.ReadAllText(di.FullName + "\\login");
        //                                    login = login.TrimEnd('\r', '\n');
        //                                    string subject = TimeSense.SLResources.LocalizedString.GetString("SessionExpired", new System.Globalization.CultureInfo(culture));
        //                                    string lien = "https://www.timesens.com/getcsv.aspx?param=";

        //                                    lien += Serializer.EncryptString(login + ";" + di.Name + ";" + expiration, "abcdefgh");

        //                                    string message = String.Format(TimeSense.SLResources.LocalizedString.GetString("SessionExpiredContent", new System.Globalization.CultureInfo(culture)), di.Name, lien);
        //                                    MailHelper.SendMail("Admin TimeSens", mail, subject, message);
        //                                }
        //                                //déplacement du répertoire
        //                                FileHelper.MarkDirToDelete(di.FullName);
        //                            }
        //                        }

        //                        if (expiration < DateTime.Now)
        //                        {
        //                            mustDelete = true;

        //                            //suppression des medias dans clientHTML
        //                            string dirName = MapPath("~") + "ClientHTML\\Medias\\" + di.Name;

        //                            if (Directory.Exists(dirName))
        //                                Directory.Delete(dirName, true);
        //                        }
        //                    }

        //                    if (days > 0 && di.CreationTime.AddDays(days) < DateTime.Now)
        //                    {
        //                        mustDelete = true;
        //                    }

        //                    if (mustDelete)
        //                    {
        //                        File.SetAttributes(di.FullName, FileAttributes.Normal);
        //                        try
        //                        {
        //                            Directory.Delete(di.FullName, true);
        //                        }
        //                        catch
        //                        {
        //                            Thread.Sleep(0);
        //                            Directory.Delete(di.FullName, true);
        //                        }
        //                    }
        //                }
        //                catch (Exception ex)
        //                {
        //                    MailHelper.SendMail("Admin TimeSens", "michel.visalli@dijon.inra.fr", "Erreur pendant la MAJ journalière, répertoire " + dir + "\\" + di + "\n" + ex.Message, ex.Message);
        //                }

        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        MailHelper.SendMail("Admin TimeSens", "michel.visalli@dijon.inra.fr", "Erreur pendant la MAJ journalière", ex.Message);
        //    }
        //}


        /// <summary>
        /// Crée un fichier à partir d'une chaine de caractères 
        /// </summary>
        /// <param name="fileName">Nom du fichier à créer</param>
        /// <param name="data">Contenu du fichier</param>
        public static void UploadFile(string fullDirPath, string fileName, string data)
        {
            try
            {
                FileStream file = new FileStream(fullDirPath + "\\" + fileName, FileMode.Create, FileAccess.Write);
                StreamWriter sw = new StreamWriter(file);
                sw.Write(data);
                sw.Close();
                file.Close();
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService");
                throw new FaultException(new FaultReason(ex.Message), new FaultCode("EXECUTE_SCRIPT_FAILED"));
            }
        }

        public static void UploadBinary(string fullDirPath, string fileName, byte[] data)
        {
            try
            {
                FileStream file = new FileStream(fullDirPath + "\\" + fileName, FileMode.Create, FileAccess.Write);
                file.Write(data, 0, data.Length);                
                file.Close();
            }
            catch (Exception ex)
            {
                //TODO
                //LogHelper.LogException(ex, "RService");
                throw new FaultException(new FaultReason(ex.Message), new FaultCode("EXECUTE_SCRIPT_FAILED"));
            }
        }

        public static void MarkFileToDelete(string filePath)
        {
            try
            {
                if (File.Exists(filePath))
                {
                    string newFilePath = filePath.Replace("directories", "todelete_directories");
                    Directory.CreateDirectory(Path.GetDirectoryName(newFilePath));
                    File.Move(filePath, newFilePath);
                }
            }
            catch
            {
            }
        }

        public static void MarkDirToDelete(string dirPath)
        {
            try
            {
                if (Directory.Exists(dirPath))
                {
                    string newDirPath = dirPath.Replace("directories", "todelete_directories");
                    MoveDirectory(dirPath, newDirPath);

                    if (!Directory.Exists(newDirPath))
                        throw new Exception("Move directory error");
                }
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
            }
        }

        public static void MoveDirectory(string source, string target)
        {
            var stack = new Stack<Folders>();
            stack.Push(new Folders(source, target));

            while (stack.Count > 0)
            {
                var folders = stack.Pop();
                Directory.CreateDirectory(folders.Target);
                foreach (var file in Directory.GetFiles(folders.Source, "*.*"))
                {
                    string targetFile = Path.Combine(folders.Target, Path.GetFileName(file));
                    if (File.Exists(targetFile)) File.Delete(targetFile);
                    File.Move(file, targetFile);
                }

                foreach (var folder in Directory.GetDirectories(folders.Source))
                {
                    stack.Push(new Folders(folder, Path.Combine(folders.Target, Path.GetFileName(folder))));
                }
            }
            Directory.Delete(source, true);
        }

        public static Stream DownloadFile(string login, string password, string filePath)
        {
            string headerInfo = "";
            headerInfo = "attachment; filename=" + "error.txt";
            WebOperationContext.Current.OutgoingResponse.Headers["Content-Disposition"] = headerInfo;
            string errortext = "File not found";
            byte[] byteArray = Encoding.ASCII.GetBytes(errortext);
            MemoryStream stream = new MemoryStream(byteArray);            
            String[] filename = filePath.Split('\\');
            WebOperationContext.Current.OutgoingResponse.ContentType = "application/octet-stream";
            if (File.Exists(filePath))
            {
                headerInfo = "attachment; filename=" + filename[filename.Length - 1];
                WebOperationContext.Current.OutgoingResponse.Headers["Content-Disposition"] = headerInfo;
                return File.OpenRead(filePath);
            }
            return stream;
        }

        public static string createRandomDirName()
        {
            Random random = new Random();
            string randomName = random.Next(100000000, 999999999).ToString();
            return randomName;
        }

        public static void createFile(string filePath, string content)
        {
            // Création d'un fichier expiration sur le serveur
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            // Create a new file 
            using (StreamWriter sw = File.CreateText(filePath))
            {
                sw.WriteLine(content);
            }
        }

        public static Encoding ObtientENcoding(string CheminFichier)
        {
            try
            {
                Encoding enc = null;
                FileStream file = new FileStream(CheminFichier, FileMode.Open, FileAccess.Read, FileShare.Read);
                if (file.CanSeek)
                {
                    byte[] bom = new byte[4]; // Get the byte-order mark, if there is one
                    file.Read(bom, 0, 4);
                    if (bom[0] == 0xef && bom[1] == 0xbb && bom[2] == 0xbf) // utf-8
                    {
                        enc = Encoding.UTF8;
                    }
                    else if ((bom[0] == 0xff && bom[1] == 0xfe) || // ucs-2le, ucs-4le, and ucs-16le
                    (bom[0] == 0 && bom[1] == 0 && bom[2] == 0xfe && bom[3] == 0xff)) // ucs-4
                    {
                        enc = Encoding.Unicode;
                    }
                    else if (bom[0] == 0xfe && bom[1] == 0xff) // utf-16 and ucs-2
                    {
                        enc = Encoding.BigEndianUnicode;
                    }
                    else // ANSI, Default
                    {
                        enc = Encoding.Default;
                    }
                    // Now reposition the file cursor back to the start of the file
                    file.Seek(0, SeekOrigin.Begin);
                }
                else
                {
                    // The file cannot be randomly accessed, so you need to decide what to set the default to
                    // based on the data provided. If you're expecting data from a lot of older applications,
                    // default your encoding to Encoding.ASCII. If you're expecting data from a lot of newer
                    // applications, default your encoding to Encoding.Unicode. Also, since binary files are
                    // single byte-based, so you will want to use Encoding.ASCII, even though you'll probably
                    // never need to use the encoding then since the Encoding classes are really meant to get
                    // strings from the byte array that is the file.

                    enc = Encoding.Default;
                }
                return enc;
            }
            catch
            {
                return Encoding.Default;
            }
        }

        public class Folders
        {
            public string Source { get; private set; }
            public string Target { get; private set; }

            public Folders(string source, string target)
            {
                Source = source;
                Target = target;
            }
        }
    }
}