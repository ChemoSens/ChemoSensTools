using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace ChemosensTools.cs
{
    public class Helpers
    {
        public static class TextHelper
        {
            //public static string RemoveAtBegin(string text, string begin)
            //{
            //    if (text.Length > begin.Length && text.Substring(0, begin.Length) == begin)
            //    {
            //        text = text.Remove(0, begin.Length);
            //    }
            //    return text;
            //}

            //public static string RemoveNumbers(string text)
            //{
            //    if (text.Length == 0)
            //    {
            //        return "";
            //    }
            //    List<string> res1 = new List<string>();
            //    List<string> tab = text.Split(' ').ToList();
            //    int index1 = 0;
            //    int n;
            //    while (index1 < tab.Count && int.TryParse(tab.ElementAt(index1), out n) == false)
            //    {
            //        res1.Add(tab.ElementAt(index1));
            //        index1++;
            //    }
            //    List<string> res2 = new List<string>();
            //    int index2 = tab.Count - 1;
            //    while (index2 > index1 && int.TryParse(tab.ElementAt(index2), out n) == false)
            //    {
            //        res2.Add(tab.ElementAt(index2));
            //        index2--;
            //    }
            //    res2.Reverse();
            //    return String.Join(" ", res1.Concat(res2));
            //}

            //public static string RemoveBracketsIf(string text, string contains)
            //{
            //    int startIndex = text.IndexOf(contains);
            //    if (startIndex > 0)
            //    {
            //        while (text.ElementAt(startIndex) != '(' && startIndex > 0)
            //        {
            //            startIndex--;
            //        }
            //        int stopIndex = text.IndexOf(")");
            //        text = text.Remove(startIndex, stopIndex - startIndex + 1);
            //    }
            //    return text;
            //}

            public static string RemoveNestedBrackets(string text, int begin = 0)
            {
                int startIndex = text.IndexOf("(", begin);
                if (startIndex > -1)
                {
                    int stopIndex = text.IndexOf(")", startIndex);
                    if (stopIndex > startIndex)
                    {
                        for (int i = startIndex + 1; i < stopIndex; i++)
                        {
                            char ch = text.ElementAt(i);
                            if (ch == '(' || ch == ')')
                            {
                                text = text.Remove(i, 1);
                                if (ch == '(')
                                {
                                    text = text.Insert(i, ","); //RAjouté, vérifier
                                }
                            }
                        }
                        text = RemoveNestedBrackets(text, stopIndex);
                    }
                }
                return text;
            }

            public static string ContentBetween(string text, string begin, string end)
            {
                string res = "";
                int beginIndex = text.IndexOf(begin);
                if (beginIndex == -1)
                {
                    return "";
                }
                int lastIndex = text.IndexOf(end, beginIndex);
                if (lastIndex == -1)
                {
                    return "";
                }
                if (lastIndex > beginIndex)
                {
                    res = text.Substring(beginIndex, lastIndex - beginIndex + 1);
                }
                return res;
            }

            public static string RemoveBetween(string text, string begin, string end)
            {
                int beginIndex = text.IndexOf(begin);
                if (beginIndex == -1)
                {
                    return text;
                }
                int lastIndex = text.IndexOf(end, beginIndex);
                if (lastIndex == -1)
                {
                    return text;
                }
                if (lastIndex > beginIndex)
                {
                    string sub = text.Substring(beginIndex, lastIndex - beginIndex);
                    if (sub.Contains(".") || sub.Contains(")"))
                    {
                        return text;
                    }
                    text = text.Remove(beginIndex, lastIndex - beginIndex + end.Length);
                }
                if (text.IndexOf(begin) > -1)
                {
                    text = RemoveBetween(text, begin, end);
                }
                return text;
            }

            //public static string ReplaceAfter(string text, string search, string replace, int startIndex)
            //{
            //    string res = text;

            //    if (startIndex >= text.Length)
            //    {
            //        return res;
            //    }

            //    string sub1 = text.Substring(0, startIndex);
            //    string sub2 = text.Substring(startIndex);

            //    sub2 = sub2.Replace(search, replace);
            //    res = sub1 + sub2;

            //    return res;
            //}

            //public static List<KeyValuePair<int, int>> FindAllBrackets(string text)
            //{
            //    List<int> indexesOfOpenBracket = new List<int>();
            //    int ind = 0;

            //    while ((ind = text.IndexOf("(", ind)) != -1)
            //    {
            //        indexesOfOpenBracket.Add(ind++);
            //    }

            //    List<KeyValuePair<int, int>> matchingBrackets = new List<KeyValuePair<int, int>>();

            //    int find(String expression, int index)
            //    {
            //        int i;

            //        // If index given is invalid and is  not an opening bracket.  
            //        if (expression[index] != '(')
            //        {

            //            return -1;
            //        }

            //        // Stack to store opening brackets.  
            //        Stack st = new Stack();

            //        // Traverse through string starting from  given index.  
            //        for (i = index; i < expression.Length; i++)
            //        {

            //            // If current character is an opening bracket push it in stack.  
            //            if (expression[i] == '(')
            //            {
            //                st.Push((int)expression[i]);
            //            } // If current character is a closing  bracket, pop from stack. If stack is empty, then this closing bracket is required bracket.  
            //            else if (expression[i] == ')')
            //            {
            //                st.Pop();
            //                if (st.Count == 0)
            //                {
            //                    return (i);
            //                }
            //            }
            //        }

            //        return (-1);
            //    }

            //    for (int i = 0; i < indexesOfOpenBracket.Count; i++)
            //    {
            //        int closeIndex = find(text, indexesOfOpenBracket.ElementAt(i));
            //        if (closeIndex > -1)
            //        {
            //            matchingBrackets.Add(new KeyValuePair<int, int>(indexesOfOpenBracket.ElementAt(i), closeIndex));
            //        }
            //    }

            //    return matchingBrackets;

            //}

            //static string ReplaceBracket(string text)
            //{
            //    string res = text;

            //    List<KeyValuePair<int, int>> matchingBrackets = FindAllBrackets(text);
            //    if (matchingBrackets.Count > 0)
            //    {
            //        KeyValuePair<int, int> kvp = matchingBrackets.ElementAt(0);

            //        int startBracketIndex = kvp.Key;
            //        int stopBracketIndex = kvp.Value;
            //        int textBeforeBracketStartIndex = startBracketIndex;

            //        string textBetweenBrackets = text.Substring(startBracketIndex, stopBracketIndex - startBracketIndex + 1);

            //        while (textBeforeBracketStartIndex > -1 && text.ElementAt(textBeforeBracketStartIndex) != '.' && text.ElementAt(textBeforeBracketStartIndex) != ',' && text.ElementAt(textBeforeBracketStartIndex) != '|')
            //        {
            //            textBeforeBracketStartIndex--;
            //        }

            //        if (textBeforeBracketStartIndex == -1)
            //        {
            //            textBeforeBracketStartIndex = 0;
            //        }

            //        string textBeforeBracket = text.Substring(textBeforeBracketStartIndex, startBracketIndex - textBeforeBracketStartIndex);

            //        List<string> elementsBetweenBracket = textBetweenBrackets.Split(',').ToList();
            //        List<string> newElementsBetweenBracket = new List<string>();
            //        for (int cpt = 0; cpt < elementsBetweenBracket.Count; cpt++)
            //        {
            //            string element = elementsBetweenBracket.ElementAt(cpt);
            //            newElementsBetweenBracket.Add(element + " | " + textBeforeBracket.Replace("(", "").Replace("%", "").Trim());
            //        }

            //        string beginOfText = text.Substring(0, textBeforeBracketStartIndex);
            //        //string middleOfText = text.Substring(textBeforeBracketStartIndex, stopBracketIndex - textBeforeBracketStartIndex  + 1);
            //        string endOfText = text.Substring(stopBracketIndex + 1);

            //        string middleOfText = String.Join(",", newElementsBetweenBracket);


            //        res = beginOfText + middleOfText.Substring(1, middleOfText.Length - 1) + endOfText;

            //        matchingBrackets = FindAllBrackets(res);
            //        if (matchingBrackets.Count > 0)
            //        {
            //            return ReplaceBracket(res);
            //        }
            //    }
            //    return res;
            //}

            //static string ReplaceNestingBracket(string text)
            //{


            //    List<KeyValuePair<int, int>> matchingBrackets = FindAllBrackets(text);
            //    List<KeyValuePair<int, int>> toRemoveBrackets = new List<KeyValuePair<int, int>>();



            //    for (int i = 0; i < matchingBrackets.Count - 1; i++)
            //    {
            //        int start = matchingBrackets.ElementAt(i).Key;
            //        int stop = matchingBrackets.ElementAt(i).Value;

            //        List<KeyValuePair<int, int>> nested = (from x in matchingBrackets
            //                                               where x.Key > start && x.Value < stop
            //                                               select x).ToList();
            //        nested.ForEach(kvp=> { toRemoveBrackets.Add(new KeyValuePair<int, int>(kvp.Key, kvp.Value)); });
            //    }

            //    int offset = 0;
            //    toRemoveBrackets.ForEach(kvp =>
            //    {
            //        text = text.Remove(kvp.Key - offset, 1);
            //        offset++;

            //        text = text.Remove(kvp.Value - offset, 1);
            //        offset++;
            //        //text.Insert(kvp.Key - offset, ",");

            //    });

            //    return text;
            //}

            public static string ReplaceContentBetweenBrackets(string textBetweenBrackets, string textBeforeBracket)
            {
                List<string> elementsBetweenBracket = textBetweenBrackets.Split(' ').ToList();
                List<string> newElementsBetweenBracket = new List<string>();
                for (int cpt = 0; cpt < elementsBetweenBracket.Count; cpt++)
                {
                    string element = elementsBetweenBracket.ElementAt(cpt);
                    newElementsBetweenBracket.Add(element + "|" + textBeforeBracket.Replace(".", "").Replace(",", "").Replace("(", "").Replace("%", "").Trim());
                }

                string res = "";
                //if (textBeforeBracket != "")
                //{
                //    res += textBeforeBracket.ElementAt(0).ToString();
                //}

                res += String.Join(" ", newElementsBetweenBracket);
                return (res);
            }

            public static string RemoveBrackets(string text, int startIndex = 0)
            {
                int startBracketIndex = text.IndexOf('(', startIndex);

                if (startBracketIndex == -1)
                {
                    return text;
                }

                int stopBracketIndex = FindClosingBracket(text, startBracketIndex);

                if (stopBracketIndex == -1)
                {
                    return text;
                }

                string textBetweenBrackets = text.Substring(startBracketIndex + 1, stopBracketIndex - startBracketIndex - 1);

                if (textBetweenBrackets.IndexOf('(') > -1)
                {
                    //return RemoveBrackets(text, textBetweenBrackets.IndexOf('('));
                    return RemoveBrackets(text, startBracketIndex + 1);
                }

                int textBeforeBracketStartIndex = startBracketIndex - 2;

                //while (textBeforeBracketStartIndex > -1 && text.ElementAt(textBeforeBracketStartIndex) != '.' && text.ElementAt(textBeforeBracketStartIndex) != ',' && text.ElementAt(textBeforeBracketStartIndex) != '|' && text.ElementAt(textBeforeBracketStartIndex) != '(')
                while (textBeforeBracketStartIndex > -1 && text.ElementAt(textBeforeBracketStartIndex) != ' ' && text.ElementAt(textBeforeBracketStartIndex) != '|' && text.ElementAt(textBeforeBracketStartIndex) != '(')
                {
                    textBeforeBracketStartIndex--;
                }

                if (textBeforeBracketStartIndex == -1)
                {
                    textBeforeBracketStartIndex = 0;
                }

                string textBeforeBracket = text.Substring(textBeforeBracketStartIndex, startBracketIndex - textBeforeBracketStartIndex - 1);
                string beginOfText = text.Substring(0, textBeforeBracketStartIndex);
                string endOfText = text.Substring(stopBracketIndex + 1);
                string middleOfText = ReplaceContentBetweenBrackets(textBetweenBrackets, textBeforeBracket);

                text = beginOfText + " " + middleOfText + " " + endOfText;
                text = Regex.Replace(text, @"\s+", " ").Trim();


                return RemoveBrackets(text, 0);

            }

            public static int FindClosingBracket(string text, int startingBracketIndex)
            {
                try
                {

                    int i;

                    // If index given is invalid and is  not an opening bracket.  
                    if (text[startingBracketIndex] != '(')
                    {

                        return -1;
                    }

                    // Stack to store opening brackets.  
                    Stack st = new Stack();

                    // Traverse through string starting from  given index.  
                    for (i = startingBracketIndex; i < text.Length; i++)
                    {

                        // If current character is an opening bracket push it in stack.  
                        if (text[i] == '(')
                        {
                            st.Push((int)text[i]);
                        } // If current character is a closing  bracket, pop from stack. If stack is empty, then this closing bracket is required bracket.  
                        else if (text[i] == ')')
                        {
                            st.Pop();
                            if (st.Count == 0)
                            {
                                return (i);
                            }
                        }
                    }

                    return (-1);
                }
                catch (Exception ex)
                {
                    string s = "";
                    return -1;
                }
            }

            //public static string SubIngredient(string text, string ingredient)
            //{
            //    int indexOfIngredient = text.IndexOf(ingredient);
            //    if (indexOfIngredient == -1)
            //    {
            //        return text;
            //    }
            //    int indexOfColon = text.IndexOf(":", indexOfIngredient);
            //    if (indexOfColon == -1)
            //    {
            //        return text;
            //    }
            //    //if (indexOfColon - indexOfIngredient - ingredient.Length > 10)
            //    //{
            //    //    // Espace trop grand entre ingredient et :
            //    //    return text;
            //    //}

            //    int indexOfPoint = text.IndexOf(".", indexOfIngredient);

            //    if (indexOfPoint == -1)
            //    {
            //        return text;
            //    }

            //    if (indexOfPoint > -1 && indexOfPoint < indexOfColon)
            //    {
            //        return text;
            //    }

            //    int indexOfComma = text.IndexOf(",", indexOfIngredient);

            //    if (indexOfComma > -1 && indexOfComma < indexOfColon)
            //    {
            //        return text;
            //    }

            //    int indexOfOpenBracket = text.IndexOf("(", indexOfIngredient);

            //    if (indexOfOpenBracket > -1 && indexOfOpenBracket < indexOfColon)
            //    {
            //        return text;
            //    }

            //    int indexOfCloseBracket = text.IndexOf(")", indexOfIngredient);

            //    if (indexOfCloseBracket > -1 && indexOfCloseBracket < indexOfColon)
            //    {
            //        return text;
            //    }

            //    text = text.Remove(indexOfColon, 1);
            //    text = text.Insert(indexOfColon, "(");
            //    text = text.Insert(indexOfPoint, ")");

            //    return text;
            //}

            public static bool ContainsWords(string text, string[] words)
            {
                for (int i = 0; i < words.Count(); i++)
                {
                    if (text.IndexOf(words[i]) == -1)
                    {
                        return false;
                    }
                }

                return true;
            }

            //public static string ReplaceTextContainingWords(string text, string[] words, string replace)
            //{
            //    if (ContainsWords(text, words))
            //    {
            //        return replace;
            //    }
            //    return text;
            //}
        }

    }
}