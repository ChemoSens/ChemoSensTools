using System;
using System.Linq;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Reflection;
using Newtonsoft.Json;
using TimeSens.webservices.models;
using System.Runtime.InteropServices;
using System.Threading;

namespace TimeSens.webservices.helpers
{
    public class Serializer
    {
        private static JsonSerializerSettings getJsonSerializerSettings()
        {

            JsonSerializerSettings settings = new JsonSerializerSettings()
            {
                NullValueHandling = NullValueHandling.Ignore,
                TypeNameHandling = TypeNameHandling.Auto,
                TypeNameAssemblyFormat = System.Runtime.Serialization.Formatters.FormatterAssemblyStyle.Full,
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                DateTimeZoneHandling = DateTimeZoneHandling.Local,
                DateParseHandling = DateParseHandling.DateTimeOffset
            };
            return settings;
        }

        public static void Serialize(object o, string filePath, string encryptKey = null)
        {
            try
            {
                string json = SerializeToString(o, encryptKey);
                File.WriteAllText(filePath, json, System.Text.Encoding.UTF8);
            }
            catch
            {
                throw;
            }
        }

        public static string SerializeToString(object o, string encryptKey = null)
        {
            try
            {
                string json = JsonConvert.SerializeObject(o, getJsonSerializerSettings());
                if (encryptKey != null && encryptKey != "")
                {
                    json = encrypt(GetHashKey(encryptKey), json);
                }
                return json;
            }
            catch
            {
                throw;
            }
        }

        public static string Encrypt(string text, string encryptKey = null)
        {
            if (encryptKey != null && encryptKey != "")
            {
                text = encrypt(GetHashKey(encryptKey), text);
            }
            return text;
        }

        public static T Deserialize<T>(string filePath, string decryptKey = null)
        {
            try
            {

                string txt = File.ReadAllText(filePath, System.Text.Encoding.UTF8);
                return DeserializeFromString<T>(txt, decryptKey);
            }
            catch
            {
                throw;
            }
        }

        public static string Decrypt(string txt, string decryptKey = null)
        {
            if (txt.StartsWith("{"))
            {
                // Fichier non encrypté
                decryptKey = null;
            }
            if (decryptKey != null && decryptKey != "")
            {
                txt = decrypt(GetHashKey(decryptKey), txt);
            }
            return txt;
        }

        public static T DeserializeFromString<T>(string txt, string decryptKey = null)
        {
            try
            {


                //var knownTypes = Assembly.GetExecutingAssembly().GetTypes().Where(t => typeof(ExperimentalDesignRow).IsAssignableFrom(t)).ToArray();
                if (txt.StartsWith("{") || txt.StartsWith("["))
                {
                    // Fichier non encrypté
                    decryptKey = null;
                }
                if (decryptKey != null && decryptKey != "")
                {
                    txt = decrypt(GetHashKey(decryptKey), txt);
                }


                // Fichier JSON crypté
                return (T)JsonConvert.DeserializeObject<T>(txt, getJsonSerializerSettings());
                throw new Exception(); ;
            }
            catch
            {
                throw;
            }
        }

        public static byte[] GetHashKey(string hashKey)
        {
            // Initialise
            UTF8Encoding encoder = new UTF8Encoding();

            // Get the salt
            string salt = "I am a nice little salt";
            byte[] saltBytes = encoder.GetBytes(salt);

            // Setup the hasher
            Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(hashKey, saltBytes);

            // Return the key
            return rfc.GetBytes(16);
        }

        public static string DecryptString(string input, string password)
        {

            byte[] encryptedBytes = Convert.FromBase64String(input);
            byte[] saltBytes = Encoding.UTF8.GetBytes(password);
            string decryptedString = string.Empty;
            using (var aes = new AesManaged())
            {
                Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(password, saltBytes);
                aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
                aes.KeySize = aes.LegalKeySizes[0].MaxSize;
                aes.Key = rfc.GetBytes(aes.KeySize / 8);
                aes.IV = rfc.GetBytes(aes.BlockSize / 8);

                using (ICryptoTransform decryptTransform = aes.CreateDecryptor())
                {
                    using (MemoryStream decryptedStream = new MemoryStream())
                    {
                        CryptoStream decryptor =
                            new CryptoStream(decryptedStream, decryptTransform, CryptoStreamMode.Write);
                        decryptor.Write(encryptedBytes, 0, encryptedBytes.Length);
                        decryptor.Flush();
                        decryptor.Close();

                        byte[] decryptBytes = decryptedStream.ToArray();
                        decryptedString =
                            UTF8Encoding.UTF8.GetString(decryptBytes, 0, decryptBytes.Length);
                    }
                }
            }

            return decryptedString;
        }

        public static string EncryptString(string input, string password)
        {

            byte[] utfData = UTF8Encoding.UTF8.GetBytes(input);
            byte[] saltBytes = Encoding.UTF8.GetBytes(password);
            string encryptedString = string.Empty;
            using (AesManaged aes = new AesManaged())
            {
                Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(password, saltBytes);

                aes.BlockSize = aes.LegalBlockSizes[0].MaxSize;
                aes.KeySize = aes.LegalKeySizes[0].MaxSize;
                aes.Key = rfc.GetBytes(aes.KeySize / 8);
                aes.IV = rfc.GetBytes(aes.BlockSize / 8);

                using (ICryptoTransform encryptTransform = aes.CreateEncryptor())
                {
                    using (MemoryStream encryptedStream = new MemoryStream())
                    {
                        using (CryptoStream encryptor =
                            new CryptoStream(encryptedStream, encryptTransform, CryptoStreamMode.Write))
                        {
                            encryptor.Write(utfData, 0, utfData.Length);
                            encryptor.Flush();
                            encryptor.Close();

                            byte[] encryptBytes = encryptedStream.ToArray();
                            encryptedString = Convert.ToBase64String(encryptBytes);
                        }
                    }
                }
            }
            return encryptedString;
        }

        private static string encrypt(byte[] key, string dataToEncrypt)
        {
            // Initialise
            AesManaged encryptor = new AesManaged();

            // Set the key
            encryptor.Key = key;
            encryptor.IV = key;

            // create a memory stream
            using (MemoryStream encryptionStream = new MemoryStream())
            {
                // Create the crypto stream
                using (CryptoStream encrypt = new CryptoStream(encryptionStream, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                {
                    // Encrypt
                    byte[] utfD1 = UTF8Encoding.UTF8.GetBytes(dataToEncrypt);
                    encrypt.Write(utfD1, 0, utfD1.Length);
                    encrypt.FlushFinalBlock();
                    encrypt.Close();

                    // Return the encrypted data
                    return Convert.ToBase64String(encryptionStream.ToArray());
                }
            }
        }

        public static string decrypt(byte[] key, string encryptedString)
        {
            // Initialise
            AesManaged decryptor = new AesManaged();
            byte[] encryptedData = Convert.FromBase64String(encryptedString);

            // Set the key
            decryptor.Key = key;
            decryptor.IV = key;

            // create a memory stream
            using (MemoryStream decryptionStream = new MemoryStream())
            {
                // Create the crypto stream
                using (CryptoStream decrypt = new CryptoStream(decryptionStream, decryptor.CreateDecryptor(), CryptoStreamMode.Write))
                {
                    // Encrypt
                    decrypt.Write(encryptedData, 0, encryptedData.Length);
                    decrypt.Flush();
                    decrypt.Close();

                    // Return the unencrypted data
                    byte[] decryptedData = decryptionStream.ToArray();
                    return UTF8Encoding.UTF8.GetString(decryptedData, 0, decryptedData.Length);
                }
            }
        }
    }
}