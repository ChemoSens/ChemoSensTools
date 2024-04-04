using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.IO;
using System.Linq;
using TimeSens.webservices.models;
using TimeSense.Web.Helpers;
using System.Diagnostics;
using System.Net;
using System.Globalization;
using Newtonsoft.Json.Linq;

namespace TimeSens.webservices.helpers
{

    public class EmotionHelper
    {

        private static string seanceDir = ConfigurationManager.AppSettings["SeanceDirPath"];

        // Découpage d'une vidéo en images
        private static void extractFrames(string videoPath, string imageDirPath, int framePerSecond = 10)
        {
            Process process = new Process();
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardError = true;
            string apPath = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "\\utils\\ffmpeg.exe";
            process.StartInfo.FileName = apPath;
            process.StartInfo.Arguments = "-i " + videoPath + " -vf fps=" + framePerSecond + " " + imageDirPath + "\\thumb%04d.jpg -hide_banner";
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.CreateNoWindow = true;
            process.Start();
            process.WaitForExit();
            //string s = "C:\michel.visalli\Test\TimeSens\TimeSens\utils\ffmpeg.exe -i C:\michel.visalli\serveur_TimeSens\directories\Seances\537719875\Uploads\537719875_S001_Product_02_1_20182511028.webm C:\michel.visalli\serveur_TimeSens\directories\Seances\537719875\Uploads\259624433\thumb%04d.jpg -hide_banner -vf fps=10";
        }

        private static byte[] getImageAsByteArray(string imageFilePath)
        {
            FileStream fileStream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read);
            BinaryReader binaryReader = new BinaryReader(fileStream);
            return binaryReader.ReadBytes((int)fileStream.Length);
        }

        private static List<byte[]> getImagesAsByteArray(string imageDirPath)
        {
            List<byte[]> list = new List<byte[]>();
            if (Directory.Exists(imageDirPath))
            {
                foreach (var imageFile in Directory.GetFiles(imageDirPath))
                {
                    byte[] b = getImageAsByteArray(imageFile);
                    list.Add(b);
                }
            }
            return list;
        }

        private static List<byte[]> extractFramesFromVideoAsByteArray(string videoPath, string tmpDirPath, int framePerSecond = 10)
        {
            List<byte[]> list = new List<byte[]>();
            string tmpDirectoryName = tmpDirPath + "\\" + FileHelper.CreateRandomName(tmpDirPath);
            DirectoryInfo di = Directory.CreateDirectory(tmpDirectoryName);

            // Extraction des frames de la vidéo dans un fichier temporaire
            extractFrames(videoPath, tmpDirectoryName, framePerSecond);
            list = getImagesAsByteArray(tmpDirectoryName);

            // TODO Suppression du fichier temporaire
            //di.Delete(true);

            return list;
        }

        class VideoParts
        {
            //TODO : intake
            public string Session;
            public string SubjectCode;
            public string ProductCode;
            public string Replicate;

            public static VideoParts Parse(string videoName)
            {
                string[] parts = videoName.Split('_');

                VideoParts p = new VideoParts();
                p.Session = parts[0];
                p.SubjectCode = parts[1];
                p.ProductCode = parts[2];
                p.Replicate = parts[parts.Length - 2];

                return p;
            }
        }

        // TODO : dossier en paramètre
        // sortie : 1 fichier / vidéo
        //public static void AnalyseEmotionsInDirectory()
        //{
        //    // Compte azur associé à sensostat@orange.net
        //    int framePerSecond = 24;
        //    string path = "C:\\benjamin";

        //    List<string> listVideos = Directory.EnumerateFiles(path).ToList();

        //    CultureInfo culture = new CultureInfo("en-US");

        //    string requestParameters = "returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";
        //    string uri = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect" + "?" + requestParameters;


        //    // Parcours des vidéos            
        //    foreach (string file in listVideos)
        //    {
        //        if (File.Exists(file))
        //        {
        //            List<byte[]> list = extractFramesFromVideoAsByteArray(file, path, framePerSecond);
        //            VideoParts p = VideoParts.Parse(Path.GetFileNameWithoutExtension(file));
        //            double time = 0;

        //            string txt = "Session;ProductCode;SubjectCode;Time;Emotion;Score\n";

        //            Task[] tasks = new Task[list.Count];

        //            for (var i = 0; i < list.Count; i++)
        //            {
        //                byte[] b = list.ElementAt(i);
        //                tasks[i] = Task.Factory.StartNew(() =>
        //                {
        //                    WebClient client = new WebClient();
        //                    client.Headers.Add("Ocp-Apim-Subscription-Key", "1e2503e1779e40e99766b865f48ea4a8");
        //                    client.Headers.Add("Content-Type", "application/octet-stream");
        //                    var response = client.UploadData(uri, "POST", b);

        //                    string jsonString = client.Encoding.GetString(response);

        //                    JToken rootToken = JArray.Parse(jsonString).First;

        //                    txt += p.Session + ";" + p.SubjectCode + ";" + p.ProductCode + ";" + time + ";";

        //                    if (rootToken != null)
        //                    {
        //                        JToken scoresToken = rootToken.Last;
        //                        JEnumerable<JToken> scoreList = scoresToken.First.Children();
        //                        var emotions = scoreList.ElementAt(6).Children();
        //                        foreach (var emotionToken in emotions.Children())
        //                        {
        //                            var s = emotionToken.ToString().Split(':');
        //                            var emotion = s[0];
        //                            var score = s[1];
        //                            Console.WriteLine(emotion);
        //                            Data d = new Data();

        //                            txt+= emotion.ToString() + ";" + score + "\n";

        //                            //try
        //                            //{
        //                            //    d.Session = p.Session;
        //                            //}
        //                            //catch
        //                            //{
        //                            //    d.Session = "";
        //                            //}
        //                            //try
        //                            //{
        //                            //    d.SubjectCode = p.SubjectCode;
        //                            //}
        //                            //catch
        //                            //{
        //                            //    d.SubjectCode = "";
        //                            //}
        //                            //try
        //                            //{
        //                            //    d.ProductCode = p.ProductCode;
        //                            //}
        //                            //catch
        //                            //{
        //                            //    d.ProductCode = "";
        //                            //}
        //                            //try
        //                            //{
        //                            //    d.Replicate = int.Parse(p.Replicate);
        //                            //}
        //                            //catch
        //                            //{
        //                            //    d.Replicate = 1;
        //                            //}
        //                            //try
        //                            //{
        //                            //    d.AttributeCode = emotion.ToString();
        //                            //}
        //                            //catch
        //                            //{
        //                            //    d.AttributeCode = "";
        //                            //}
        //                            //try
        //                            //{
        //                            //    d.Score = Convert.ToDecimal(score, culture);
        //                            //}
        //                            //catch
        //                            //{
        //                            //    d.Score = null;
        //                            //}
        //                            //try
        //                            //{
        //                            //    d.Time = Convert.ToDecimal(time, culture);
        //                            //}
        //                            //catch
        //                            //{
        //                            //    d.Time = null;
        //                            //}

        //                            //d.Type = Data.DataTypeEnum.Emotion;
        //                            //listData.Add(d);
        //                        }
        //                    }

        //                    time += 1.0 / framePerSecond;



        //                });
        //            }

        //            Task.WaitAll(tasks);
        //            File.WriteAllText("C:\\benjamin\\converted\\" + p.Session + "_" + p.SubjectCode + "_" + p.ProductCode + ".txt", txt);
        //        }
        //    }

        //}

        public static void AnalyseEmotionsInDirectory()
        {
            // Compte azur associé à sensostat@orange.net
            int framePerSecond = 6;
            string path = "C:\\benjamin";

            List<string> listVideos = Directory.EnumerateFiles(path).ToList();

            CultureInfo culture = new CultureInfo("en-US");

            string requestParameters = "returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";
            string uri = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect" + "?" + requestParameters;

            


            // Parcours des vidéos            
            foreach (string file in listVideos)
            {
                List<Data> listData = new List<Data>();

                if (File.Exists(file))
                {
                    List<byte[]> list = extractFramesFromVideoAsByteArray(file, path, framePerSecond);
                    VideoParts p = VideoParts.Parse(Path.GetFileNameWithoutExtension(file));
                    double time = 0;

                    //string txt = "Session;ProductCode;SubjectCode;Time;Emotion;Score\n";

                    //Task[] tasks = new Task[list.Count];
                    //Task[] tasks = new Task[1];

                    for (var i = 0; i < list.Count; i++)
                    //for (var i = 0; i < 1; i++)
                    {
                        byte[] b = list.ElementAt(i);
                        //tasks[i] = Task.Factory.StartNew(() =>
                        //{
                        WebClient client = new WebClient();
                        client.Headers.Add("Ocp-Apim-Subscription-Key", "08c12b867da0413a87302500a5e8e8ea");
                        client.Headers.Add("Content-Type", "application/octet-stream");
                        var response = client.UploadData(uri, "POST", b);

                        string jsonString = client.Encoding.GetString(response);

                        JToken rootToken = JArray.Parse(jsonString).First;

                        //txt += p.Session + ";" + p.SubjectCode + ";" + p.ProductCode + ";" + time + ";";

                        if (rootToken != null)
                        {
                            JToken scoresToken = rootToken.Last;
                            JEnumerable<JToken> scoreList = scoresToken.First.Children();
                            var emotions = scoreList.ElementAt(6).Children();
                            foreach (var emotionToken in emotions.Children())
                            {
                                var s = emotionToken.ToString().Split(':');
                                var emotion = s[0];
                                var score = s[1];
                                Console.WriteLine(emotion);
                                Data d = new Data();

                                //txt += emotion.ToString() + ";" + score + "\n";

                                try
                                {
                                    d.Session = p.Session;
                                }
                                catch
                                {
                                    d.Session = "";
                                }
                                try
                                {
                                    d.SubjectCode = p.SubjectCode;
                                }
                                catch
                                {
                                    d.SubjectCode = "";
                                }
                                try
                                {
                                    d.ProductCode = p.ProductCode;
                                }
                                catch
                                {
                                    d.ProductCode = "";
                                }
                                try
                                {
                                    d.Replicate = int.Parse(p.Replicate);
                                }
                                catch
                                {
                                    d.Replicate = 1;
                                }
                                try
                                {
                                    d.AttributeCode = emotion.ToString();
                                }
                                catch
                                {
                                    d.AttributeCode = "";
                                }
                                try
                                {
                                    d.Score = Convert.ToDecimal(score, culture);
                                }
                                catch
                                {
                                    d.Score = null;
                                }
                                try
                                {
                                    d.Time = Convert.ToDecimal(time, culture);
                                }
                                catch
                                {
                                    d.Time = null;
                                }

                                d.Type = Data.DataTypeEnum.Emotion;
                                listData.Add(d);
                            }
                        }

                        time += 1.0 / framePerSecond;

                        System.Threading.Thread.Sleep(151);

                        //});
                    }

                    //Task.WaitAll(tasks);

                    string txt = "Session;ProductCode;SubjectCode;Time;Emotion;Score\n";

                    listData.ForEach((x) =>
                    {
                        txt += x.Session + ";" + x.ProductCode + ";" + x.SubjectCode + ";" + x.Time + ";" + x.AttributeCode + ";" + x.Score + "\n";
                    });

                    File.WriteAllText("C:\\benjamin\\converted\\" + p.Session + "_" + p.SubjectCode + "_" + p.ProductCode + ".txt", txt);
                     File.Delete(file);
                }
            }

        }


        public static string AnalyseEmotionsInVideos(ObservableCollection<string> listVideos, int framePerSecond)
        {

            //30000 transactions / mois
            //20 transactions par minute
            // Compte azur associé à contact@timesens.net

            DateTime startTime = DateTime.Now;
            int nbTransactions = 0;

            CultureInfo culture = new CultureInfo("en-US");


            List<Data> listData = new List<Data>();

            // Parcours des vidéos            
            foreach (string file in listVideos)
            {
                string videoFilePath = seanceDir + file;
                string dir = Path.GetDirectoryName(videoFilePath);
                if (File.Exists(videoFilePath))
                {
                    List<byte[]> list = extractFramesFromVideoAsByteArray(videoFilePath, dir, framePerSecond);
                    // VideoFilePath 
                    VideoParts p = VideoParts.Parse(Path.GetFileNameWithoutExtension(videoFilePath));
                    double time = 0;
                    foreach (byte[] b in list)
                    {
                        // Appel au web service 

                        string requestParameters = "returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";

                        //// Assemble the URI for the REST API Call.
                        //https://westcentralus.api.cognitive.microsoft.com/face/v1.0
                        string uri = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect" + "?" + requestParameters;

                        //                        Clé 1: e3b9b0f794eb4c8183e873772b49b39f

                        //Clé 2: e19b0ef5c369422f934a340cd43fdb76


                        using (WebClient client = new WebClient())
                        {
                            // Request headers
                            //client.Headers.Add("Ocp-Apim-Subscription-Key", "1ab8cce663204a9c957ce761fefc713e");
                            client.Headers.Add("Ocp-Apim-Subscription-Key", "e3b9b0f794eb4c8183e873772b49b39f");
                            client.Headers.Add("Content-Type", "application/octet-stream");

                            var response = client.UploadData(uri, "POST", b);

                            nbTransactions++;

                            //TODO : traiter le cas où il n'y a pas de réponse

                            string jsonString = client.Encoding.GetString(response);

                            JToken rootToken = JArray.Parse(jsonString).First;

                            // First token is always the faceRectangle identified by the API.
                            //JToken faceRectangleToken = rootToken.First;

                            // Second token is all emotion scores.
                            if (rootToken != null)
                            {
                                JToken scoresToken = rootToken.Last;

                                // Show all face rectangle dimensions
                                //JEnumerable<JToken> faceRectangleSizeList = faceRectangleToken.First.Children();
                                //foreach (var size in faceRectangleSizeList)
                                //{
                                //    Console.WriteLine(size);
                                //}

                                // Show all scores
                                JEnumerable<JToken> scoreList = scoresToken.First.Children();
                                var emotions = scoreList.ElementAt(6).Children();
                                foreach (var emotionToken in emotions.Children())
                                {
                                    var s = emotionToken.ToString().Split(':');
                                    var emotion = s[0];
                                    var score = s[1];
                                    Console.WriteLine(emotion);
                                    Data d = new Data();
                                    try
                                    {
                                        d.Session = p.Session;
                                    }
                                    catch
                                    {
                                        d.Session = "";
                                    }
                                    try
                                    {
                                        d.SubjectCode = p.SubjectCode;
                                    }
                                    catch
                                    {
                                        d.SubjectCode = "";
                                    }
                                    try
                                    {
                                        d.ProductCode = p.ProductCode;
                                    }
                                    catch
                                    {
                                        d.ProductCode = "";
                                    }
                                    try
                                    {
                                        d.Replicate = int.Parse(p.Replicate);
                                    }
                                    catch
                                    {
                                        d.Replicate = 1;
                                    }
                                    try
                                    {
                                        d.AttributeCode = emotion.ToString();
                                    }
                                    catch
                                    {
                                        d.AttributeCode = "";
                                    }
                                    try
                                    {
                                        d.Score = Convert.ToDecimal(score, culture);
                                    }
                                    catch
                                    {
                                        d.Score = null;
                                    }
                                    try
                                    {
                                        d.Time = Convert.ToDecimal(time, culture);
                                    }
                                    catch
                                    {
                                        d.Time = null;
                                    }

                                    d.Type = Data.DataTypeEnum.Emotion;
                                    listData.Add(d);
                                }
                            }

                            time += 1.0 / framePerSecond;

                            // TODO :  Limitations à 20 transactions par minute, 5 par seconde -> 1 transaction toutes les 3 secondes
                            //if (nbTransactions == 19)                            
                            //    {
                            //    while ((DateTime.Now - startTime).TotalSeconds < 60)
                            //    {
                            System.Threading.Thread.Sleep(3000);
                            //    }
                            //    nbTransactions = 0;
                            //    startTime = DateTime.Now;
                            //}
                        }
                    }

                }
            }


            string res = Serializer.SerializeToString(listData);

            return res;
        }

        //public static string AnalyseEmotionsInVideos(ObservableCollection<string> listVideos, int framePerSecond)
        //{

        //    //30000 transactions / mois
        //    //20 transactions par minute
        //    // Compte azur associé à contact@timesens.net

        //    DateTime startTime = DateTime.Now;
        //    //int nbTransactions = 0;

        //    CultureInfo culture = new CultureInfo("en-US");

        //    string requestParameters = "returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";
        //    string uri = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect" + "?" + requestParameters;



        //    List<Data> listData = new List<Data>();



        //    // Parcours des vidéos            
        //    foreach (string file in listVideos)
        //    {
        //        string videoFilePath = seanceDir + file;
        //        string dir = Path.GetDirectoryName(videoFilePath);
        //        if (File.Exists(videoFilePath))
        //        {
        //            List<byte[]> list = extractFramesFromVideoAsByteArray(videoFilePath, dir, framePerSecond);
        //            VideoParts p = VideoParts.Parse(Path.GetFileNameWithoutExtension(videoFilePath));
        //            double time = 0;

        //            Task[] tasks = new Task[list.Count];

        //            //foreach (byte[] b in list)
        //            for (var i=0; i<list.Count;i++)
        //            {
        //                byte[] b = list.ElementAt(i);
        //                tasks[i] = Task.Factory.StartNew(() =>
        //                {
        //                    WebClient client = new WebClient();
        //                    client.Headers.Add("Ocp-Apim-Subscription-Key", "e3b9b0f794eb4c8183e873772b49b39f");
        //                    client.Headers.Add("Content-Type", "application/octet-stream");
        //                    var response = client.UploadData(uri, "POST", b);

        //                    //nbTransactions++;

        //                    string jsonString = client.Encoding.GetString(response);

        //                    JToken rootToken = JArray.Parse(jsonString).First;

        //                    if (rootToken != null)
        //                    {
        //                        JToken scoresToken = rootToken.Last;
        //                        JEnumerable<JToken> scoreList = scoresToken.First.Children();
        //                        var emotions = scoreList.ElementAt(6).Children();
        //                        foreach (var emotionToken in emotions.Children())
        //                        {
        //                            var s = emotionToken.ToString().Split(':');
        //                            var emotion = s[0];
        //                            var score = s[1];
        //                            Console.WriteLine(emotion);
        //                            Data d = new Data();
        //                            try
        //                            {
        //                                d.Session = p.Session;
        //                            }
        //                            catch
        //                            {
        //                                d.Session = "";
        //                            }
        //                            try
        //                            {
        //                                d.SubjectCode = p.SubjectCode;
        //                            }
        //                            catch
        //                            {
        //                                d.SubjectCode = "";
        //                            }
        //                            try
        //                            {
        //                                d.ProductCode = p.ProductCode;
        //                            }
        //                            catch
        //                            {
        //                                d.ProductCode = "";
        //                            }
        //                            try
        //                            {
        //                                d.Replicate = int.Parse(p.Replicate);
        //                            }
        //                            catch
        //                            {
        //                                d.Replicate = 1;
        //                            }
        //                            try
        //                            {
        //                                d.AttributeCode = emotion.ToString();
        //                            }
        //                            catch
        //                            {
        //                                d.AttributeCode = "";
        //                            }
        //                            try
        //                            {
        //                                d.Score = Convert.ToDecimal(score, culture);
        //                            }
        //                            catch
        //                            {
        //                                d.Score = null;
        //                            }
        //                            try
        //                            {
        //                                d.Time = Convert.ToDecimal(time, culture);
        //                            }
        //                            catch
        //                            {
        //                                d.Time = null;
        //                            }

        //                            d.Type = Data.DataTypeEnum.Emotion;
        //                            listData.Add(d);
        //                        }
        //                    }

        //                    time += 1.0 / framePerSecond;
        //                });
        //            }

        //            Task.WaitAll(tasks);
        //        }
        //    }


        //    string res = Serializer.SerializeToString(listData);
        //    return res;
        //}


        //public async Task<string> sendRequest(WebClient client, string url, byte[] b)
        //{
        //    var response = await client.UploadDataTaskAsync(url, "POST", b);

        //    string jsonString = client.Encoding.GetString(response);

        //    JToken rootToken = JArray.Parse(jsonString).First;

        //    if (rootToken != null)
        //    {
        //        JToken scoresToken = rootToken.Last;
        //        JEnumerable<JToken> scoreList = scoresToken.First.Children();
        //        var emotions = scoreList.ElementAt(6).Children();
        //        foreach (var emotionToken in emotions.Children())
        //        {
        //            var s = emotionToken.ToString().Split(':');
        //            var emotion = s[0];
        //            var score = s[1];
        //            Console.WriteLine(emotion);
        //            Data d = new Data();
        //            try
        //            {
        //                d.Session = p.Session;
        //            }
        //            catch
        //            {
        //                d.Session = "";
        //            }
        //            try
        //            {
        //                d.SubjectCode = p.SubjectCode;
        //            }
        //            catch
        //            {
        //                d.SubjectCode = "";
        //            }
        //            try
        //            {
        //                d.ProductCode = p.ProductCode;
        //            }
        //            catch
        //            {
        //                d.ProductCode = "";
        //            }
        //            try
        //            {
        //                d.Replicate = int.Parse(p.Replicate);
        //            }
        //            catch
        //            {
        //                d.Replicate = 1;
        //            }
        //            try
        //            {
        //                d.AttributeCode = emotion.ToString();
        //            }
        //            catch
        //            {
        //                d.AttributeCode = "";
        //            }
        //            try
        //            {
        //                d.Score = Convert.ToDecimal(score, culture);
        //            }
        //            catch
        //            {
        //                d.Score = null;
        //            }
        //            try
        //            {
        //                d.Time = Convert.ToDecimal(time, culture);
        //            }
        //            catch
        //            {
        //                d.Time = null;
        //            }

        //            d.Type = Data.DataTypeEnum.Emotion;
        //            listData.Add(d);
        //        }
        //    }

        //    time += 1.0 / framePerSecond;

        //    return response;
        //}

        //static async void MakeRequest(string imageFilePath)
        //{
        //    var client = new HttpClient();

        //    // Request headers - replace this example key with your valid key.
        //    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "<your-subscription-key>"); // 

        //    // NOTE: You must use the same region in your REST call as you used to obtain your subscription keys.
        //    //   For example, if you obtained your subscription keys from westcentralus, replace "westus" in the 
        //    //   URI below with "westcentralus".
        //    string uri = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?";
        //    HttpResponseMessage response;
        //    string responseContent;

        //    // Request body. Try this sample with a locally stored JPEG image.
        //    byte[] byteData = GetImageAsByteArray(imageFilePath);

        //    using (var content = new ByteArrayContent(byteData))
        //    {
        //        // This example uses content type "application/octet-stream".
        //        // The other content types you can use are "application/json" and "multipart/form-data".
        //        content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        //        response = await client.PostAsync(uri, content);
        //        responseContent = response.Content.ReadAsStringAsync().Result;
        //    }

        //    // A peek at the raw JSON response.
        //    Console.WriteLine(responseContent);

        //    // Processing the JSON into manageable objects.
        //    JToken rootToken = JArray.Parse(responseContent).First;

        //    // First token is always the faceRectangle identified by the API.
        //    JToken faceRectangleToken = rootToken.First;

        //    // Second token is all emotion scores.
        //    JToken scoresToken = rootToken.Last;

        //    // Show all face rectangle dimensions
        //    JEnumerable<JToken> faceRectangleSizeList = faceRectangleToken.First.Children();
        //    foreach (var size in faceRectangleSizeList)
        //    {
        //        Console.WriteLine(size);
        //    }

        //    // Show all scores
        //    JEnumerable<JToken> scoreList = scoresToken.First.Children();
        //    foreach (var score in scoreList)
        //    {
        //        Console.WriteLine(score);
        //    }
        //}
    }

}