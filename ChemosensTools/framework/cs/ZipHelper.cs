using System;
using System.Collections.Generic;
using System.IO;
using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip;

namespace TimeSens.webservices.helpers
{
    public class ZipHelper
    {
        //TODO : utiliser creatememotystream
        public static Stream ZipToMemoryStream(IEnumerable<string> filePaths, string password)
        {

           

            var zipFile = new MemoryStream();
            var zipOutputStream = new ZipOutputStream(zipFile) { IsStreamOwner = false };
            zipOutputStream.SetLevel(6);
            zipOutputStream.Password = password;
            foreach (var path in filePaths)
            {
                try
                {
                    var entry = new ZipEntry(Path.GetFileName(path))
                    {
                        DateTime = DateTime.Now
                    };
                    zipOutputStream.PutNextEntry(entry);
                    var source = File.OpenRead(path);
                    StreamUtils.Copy(source, zipOutputStream, new byte[4096]);

                    zipOutputStream.CloseEntry();
                    source.Close();
                }
                catch
                {

                }
            }
            zipOutputStream.Finish();
            zipOutputStream.Close();

            zipFile.Position = 0;
            zipFile.Flush();

            return zipFile;
        }

        public static Stream CreateMemoryStream(List<KeyValuePair<string, byte[]>> listKvp)
        {
            var zipFile = new MemoryStream();
            var zipOutputStream = new ZipOutputStream(zipFile) { IsStreamOwner = false };
            zipOutputStream.SetLevel(6);
            foreach (KeyValuePair<string, byte[]> kvp in listKvp)
            {
                var entry = new ZipEntry(kvp.Key)
                {
                    DateTime = DateTime.Now
                };
                zipOutputStream.PutNextEntry(entry);
                zipOutputStream.Write(kvp.Value, 0, kvp.Value.Length);
                zipOutputStream.CloseEntry();

            }
            zipOutputStream.Finish();
            zipOutputStream.Close();

            zipFile.Position = 0;
            zipFile.Flush();

            return zipFile;
        }

        /// <summary>
        /// Get file name in zip file.
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        private static string GetFileNameInZip(string fileName)
        {
            var parts = fileName.Split('@');
            if (parts.Length == 2)
            {
                return parts[1];
            }
            return string.Empty;
        }
    }
}