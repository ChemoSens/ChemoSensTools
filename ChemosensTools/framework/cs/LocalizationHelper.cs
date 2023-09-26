using Newtonsoft.Json;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;

namespace TimeSens.webservices.helpers
{
    public class LocalizationHelper
    {
        private static List<Item> resources = new List<Item>();
        public static List<Item> Resources
        {
            get
            {
                if (resources.Count == 0)
                {
                    using (StreamReader r = new StreamReader(ConfigurationManager.AppSettings["JsonResourcesPath"]))
                    {
                        string json = r.ReadToEnd();     
                        resources = JsonConvert.DeserializeObject<List<Item>>(json);
                    }
                }                
                return resources;
            }
        }

        public class Item
        {
            public string key;
            public string en;
            public string fr;

            public Item(string key, string en, string fr)
            {
                this.key = key;
                this.en = en;
                this.fr = fr;
            }
        }


        public static string Localize(string key, string language="en")
        {
            string res = key;

            var items = from x in Resources
                        where x.key == key
                        select x;

            if (items.Count() > 0)
            {
                if (language == "en")
                {
                    return items.ElementAt(0).en;
                }
                else if (language == "fr")
                {
                    return items.ElementAt(0).fr;
                }
                else
                {
                    return items.ElementAt(0).en;
                }
            }
            else
            {
                return key;
            }
        }
    }
}