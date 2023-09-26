using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Security.Cryptography;

namespace TimeSens.webservices.helpers
{
    public static class StringHelper
    {
        private static Dictionary<char, char> _replacementMap;
        private static Regex _replacementRegex;
        private static MatchEvaluator _replacementCallback;

        static StringHelper()
        {
            _replacementMap = new Dictionary<char, char>
            {
                { 'é', 'e' },
                { 'è', 'e' },
                { 'ê', 'e' },
                { 'ë', 'e' },
                { 'à', 'a' },
                { 'â', 'a' },
                { 'ô', 'o' },
                { 'ö', 'o' },
                { 'î', 'i' },
                { 'ï', 'i' },
                { 'ù', 'u' },
                { 'û', 'u' },
                { 'ü', 'u' },
                { 'ç', 'c' },
                { ' ', '_'},
                { '-', '_'},
                { '"', '_'},
                { '\'', '_'}
            };

            string chars = new string(_replacementMap.Keys.ToArray());
            _replacementRegex = new Regex(string.Format("[{0}]", chars), RegexOptions.CultureInvariant);
            _replacementCallback =
                m =>
                {
                    char c = m.Value[0];
                    char newChar;
                    if (_replacementMap.TryGetValue(c, out newChar))
                        return newChar.ToString();
                    return m.Value;
                };
        }

        public static string RemoveSpecialCharacters(string str)
        {
            if (str == null)
            {
                return null;
            }
            return Regex.Replace(str, "[^a-zA-Z0-9_|]+", "_", RegexOptions.None);
        }

        public static string RemoveDiacritics(this string s)
        {
            if (s == null)
            {
                return null;
            }
            return RemoveSpecialCharacters(_replacementRegex.Replace(s, _replacementCallback));
        }

        public static string RemoveTrimming0(this string s)
        {
            if (s == null)
            {
                return null;
            }
            s.Trim();
            while (s.StartsWith("0"))
            {
                s = s.Substring(1);
            }
            return s;
        }

        public static string SpecialCharactersToHtml(this string s)
        {
            if (s == null)
            {
                return null;
            }

            s = s.Replace("<", "&lt;");
            s = s.Replace(">", "&gt;");
            s = s.Replace(" ", "&nbsp;");

            Regex regex = new Regex(@"(\r\n|\r|\n)+");
            s = regex.Replace(s, "<br />");

            return s;
        }

        public static bool isHourFormated(this string s)
        {
            Regex myRegex = new Regex(@"^(([0-1]){1,}([0-9]{1,})|(2[0-3]))(:)([0-5]{1}[0-9]{1})$");
            if (String.IsNullOrEmpty(s))
                return false;
            else
                return myRegex.IsMatch(s);
        }

        public static bool isHourListFormated(this string s)
        {
            Regex myRegex = new Regex(@"^(([0-1]){1,}([0-9]{1,})|(2[0-3]))(:)([0-5]{1}[0-9]{1})(;(([0-1]){1,}([0-9]{1,})|(2[0-3]))(:)([0-5]{1}[0-9]{1})+)*;?$");
            if (String.IsNullOrEmpty(s))
                return false;
            else
                return myRegex.IsMatch(s);
        }
    }

    public class RandomStringGenerator
    {
        public int NbCarMin { get; set; }
        public int NbCarMax { get; set; }
        public string StartWith { get; set; }
        public bool IncludeChars { get; set; }
        public bool IncludeNumerics { get; set; }
        public bool IsCaseSensitive { get; set; }

        private static string PASSWORD_CHARS_LCASE = "abcdefgijkmnopqrstwxyz";
        private static string PASSWORD_CHARS_UCASE = "ABCDEFGHJKLMNPQRSTWXYZ";
        private static string PASSWORD_CHARS_NUMERIC = "23456789";

        public string Generate()
        {
            
            // Création de la table des caractères éligibles
            List<char[]> chars = new List<char[]>();
            if (this.IncludeChars == true)
            {
                chars.Add(PASSWORD_CHARS_LCASE.ToCharArray());
            }
            if (this.IsCaseSensitive == true)
            {
                chars.Add(PASSWORD_CHARS_UCASE.ToCharArray());
            }
            if (this.IncludeNumerics == true)
            {
                chars.Add(PASSWORD_CHARS_NUMERIC.ToCharArray());
            }
            char[][] charGroups = chars.ToArray();

            // Use this array to track the number of unused characters in each
            // character group.
            int[] charsLeftInGroup = new int[charGroups.Length];

            // Initially, all characters in each group are not used.
            for (int i = 0; i < charsLeftInGroup.Length; i++)
            {
                charsLeftInGroup[i] = charGroups[i].Length;
            }

            // Use this array to track (iterate through) unused character groups.
            int[] leftGroupsOrder = new int[charGroups.Length];

            // Initially, all character groups are not used.
            for (int i = 0; i < leftGroupsOrder.Length; i++)
            {
                leftGroupsOrder[i] = i;
            }

            // Because we cannot use the default randomizer, which is based on the
            // current time (it will produce the same "random" number within a
            // second), we will use a random number generator to seed the
            // randomizer.

            // Use a 4-byte array to fill it with random bytes and convert it then
            // to an integer value.
            byte[] randomBytes = new byte[4];

            // Generate 4 random bytes.
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetBytes(randomBytes);

            // Convert 4 bytes into a 32-bit integer value.
            int seed = (randomBytes[0] & 0x7f) << 24 |
                        randomBytes[1] << 16 |
                        randomBytes[2] << 8 |
                        randomBytes[3];

            // Now, this is real randomization.
            Random random = new Random(seed);

            // This array will hold password characters.
            char[] password = null;

            // Allocate appropriate memory for the password.
            
                password = new char[this.NbCarMin];
            

            // Index of the next character to be added to password.
            int nextCharIdx;

            // Index of the next character group to be processed.
            int nextGroupIdx;

            // Index which will be used to track not processed character groups.
            int nextLeftGroupsOrderIdx;

            // Index of the last non-processed character in a group.
            int lastCharIdx;

            // Index of the last non-processed group.
            int lastLeftGroupsOrderIdx = leftGroupsOrder.Length - 1;

            int length = 0;
            

            // Generate password characters one at a time.
            for (int i = length; i < password.Length; i++)
            {
                // If only one character group remained unprocessed, process it;
                // otherwise, pick a random character group from the unprocessed
                // group list. To allow a special character to appear in the
                // first position, increment the second parameter of the Next
                // function call by one, i.e. lastLeftGroupsOrderIdx + 1.
                if (lastLeftGroupsOrderIdx == 0)
                {
                    nextLeftGroupsOrderIdx = 0;
                }
                else
                {
                    nextLeftGroupsOrderIdx = random.Next(0, lastLeftGroupsOrderIdx);
                }

                // Get the actual index of the character group, from which we will
                // pick the next character.
                nextGroupIdx = leftGroupsOrder[nextLeftGroupsOrderIdx];

                // Get the index of the last unprocessed characters in this group.
                lastCharIdx = charsLeftInGroup[nextGroupIdx] - 1;

                // If only one unprocessed character is left, pick it; otherwise,
                // get a random character from the unused character list.
                if (lastCharIdx == 0)
                {
                    nextCharIdx = 0;
                }
                else
                {
                    nextCharIdx = random.Next(0, lastCharIdx + 1);
                }

                // Add this character to the password.
                password[i] = charGroups[nextGroupIdx][nextCharIdx];

                // If we processed the last character in this group, start over.
                if (lastCharIdx == 0)
                {
                    charsLeftInGroup[nextGroupIdx] = charGroups[nextGroupIdx].Length;
                }
                // There are more unprocessed characters left.
                else
                {
                    // Swap processed character with the last unprocessed character
                    // so that we don't pick it until we process all characters in
                    // this group.
                    if (lastCharIdx != nextCharIdx)
                    {
                        char temp = charGroups[nextGroupIdx][lastCharIdx];
                        charGroups[nextGroupIdx][lastCharIdx] = charGroups[nextGroupIdx][nextCharIdx];
                        charGroups[nextGroupIdx][nextCharIdx] = temp;
                    }
                    // Decrement the number of unprocessed characters in
                    // this group.
                    charsLeftInGroup[nextGroupIdx]--;
                }

                // If we processed the last group, start all over.
                if (lastLeftGroupsOrderIdx == 0)
                {
                    lastLeftGroupsOrderIdx = leftGroupsOrder.Length - 1;
                }
                // There are more unprocessed groups left.
                else
                {
                    // Swap processed group with the last unprocessed group
                    // so that we don't pick it until we process all groups.
                    if (lastLeftGroupsOrderIdx != nextLeftGroupsOrderIdx)
                    {
                        int temp = leftGroupsOrder[lastLeftGroupsOrderIdx];
                        leftGroupsOrder[lastLeftGroupsOrderIdx] = leftGroupsOrder[nextLeftGroupsOrderIdx];
                        leftGroupsOrder[nextLeftGroupsOrderIdx] = temp;
                    }
                    // Decrement the number of unprocessed groups.
                    lastLeftGroupsOrderIdx--;
                }
            }

            // Convert password characters into a string and return the result.
            return new string(password);
        }
    }

}
