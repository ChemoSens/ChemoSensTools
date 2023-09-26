using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.ServiceModel;
using TimeSens.webservices.helpers;

namespace TimeSens.webservices.models
{
    public class Synchronizable
    {
        //TODO : cryptage

        //public static dynamic GetServerItem(dynamic obj, string dirPath)
        //{
        //    string path = dirPath + "/" + obj.ID;            
        //    if (File.Exists(path))
        //    {
        //        string json = File.ReadAllText(path);
        //        dynamic itemOnServer = JsonConvert.DeserializeObject(json);
        //        return itemOnServer;
        //    }
        //    return null;
        //}

        //public static string CheckStatus(dynamic obj, string dirPath)
        //{
        //    dynamic itemOnServer = GetServerItem(obj, dirPath);
        //    if (itemOnServer != null)
        //    {
        //        if (itemOnServer.LastUpdate < obj.LastUpdate)
        //        {
        //            obj.Status = "LocalFileMostRecent";
        //        }
        //        else if (itemOnServer.LastUpdate > obj.LastUpdate)
        //        {
        //            obj.Status = "ServerFileMostRecent";
        //        }
        //        else
        //        {
        //            obj.Status = "Synchronized";
        //        }
        //    }
        //    else
        //    {
        //        obj.Status = "MissingOnServer";
        //    }
        //    return obj.Status;
        //}

        public static string Download(string path, string id)
        {
            if (File.Exists(path + "/" + id))
            {
                return File.ReadAllText(path + "/" + id);
            }
            throw new FaultException("FILE_NOT_EXISTS");
        }

        public static string DownloadAll(string path)
        {
            if (Directory.Exists(path) == false)
            {
                Directory.CreateDirectory(path);
            }

            List<dynamic> list = new List<dynamic>();
            foreach (string file in Directory.EnumerateFiles(path))                
            {
                string json = File.ReadAllText(file);
                dynamic itemOnServer = JsonConvert.DeserializeObject(json);
                list.Add(itemOnServer);
            }

            return Serializer.SerializeToString(list);

        }

        public static string Upload(dynamic obj, string path)
        {
            try
            {
                if (Directory.Exists(path) == false)
                {
                    Directory.CreateDirectory(path);
                }

                //Serializer.Serialize(obj, path + "/" + obj.ID);
                DateTime d = DateTime.Now;
                if (obj.ID == null)
                {
                    // Créé un ID
                    Guid guid = Guid.NewGuid();
                    obj.ID = String.Format("{0:yyyyMMddHHmmss}", d) + guid.ToString();
                }
                obj.LastUpdate = d;
                Serializer.Serialize(obj, path + "/" + obj.ID);
                return obj.ID;
            }
            catch
            {
                return null;
            }
        }

        public static void Delete(dynamic obj, string path)
        {
            if (Directory.Exists(path + "\\Trash\\") == false)
            {
                Directory.CreateDirectory(path + "\\Trash\\");
            }

            if (File.Exists(path + "/" + obj.ID))
            {
                if (File.Exists(path + "\\Trash\\" + obj.ID))
                {
                    File.Delete(path + "\\Trash\\" + obj.ID);
                }
                File.Move(path + "\\" + obj.ID, path + "\\Trash\\" + obj.ID);
            }
            
        }
       
        //public static dynamic Save(dynamic obj, string path)
        //{
        //    if (Directory.Exists(path) == false)
        //    {
        //        Directory.CreateDirectory(path);
        //    }
        //    DateTime d = DateTime.Now;
        //    if (obj.ID==null)
        //    {
        //        // Créé un ID
        //        Guid guid = Guid.NewGuid();                
        //        obj.ID = String.Format("{0:yyyyMMddHHmmss}", d) +  guid.ToString();
        //    }
        //    obj.LastUpdate = d;
        //    Serializer.Serialize(obj, path + "/" + obj.ID);
        //    return obj;
        //}
    }

    
}