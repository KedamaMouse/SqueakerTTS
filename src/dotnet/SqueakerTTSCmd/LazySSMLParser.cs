using Superpower;
using Superpower.Display;
using Superpower.Parsers;
using Superpower.Tokenizers;
using System.Text.RegularExpressions;
using System.Xml;


//parser for what i'm calling Lazy SSML, a syntax for using ssml without typing out xml.
//The basic syntax is [effect shorthand]([some text])
//so if the shorthand for whisper is w, then you can do w(i'm whispering)
//Additionally, because this is parsing conversatinally typed text, it will be forgiving of missing closing parens by matching them at the end.
namespace LazySSMLParser
{
    public enum LazySSMLToken
    {
        [Token(Example = "(")]
        LParen,

        [Token(Example = ")")]
        RParen,
        Word,
        Space

    }

    public static class LazySSMLParser
    {

        public static Tokenizer<LazySSMLToken> Instance { get; } =
            new TokenizerBuilder<LazySSMLToken>()
            .Match(Span.Regex(@"\S+\("), LazySSMLToken.LParen) //really matching string followed by (. 
            .Match(Character.EqualTo(')'), LazySSMLToken.RParen)
            .Match(Span.WhiteSpace, LazySSMLToken.Space)
            .Match(Span.Regex(@"[^\)\s]*"), LazySSMLToken.Word)
            .Build();


//        static TokenListParser<LazySSMLToken, object> SSMLTag { get; } =
//            from begin in Token.EqualTo(LazySSMLToken.LParen)

        public static string TryParse(string text)
        {
            var tokens = LazySSMLParser.Instance.TryTokenize(text);

            //not the best way to do this, but atm too lazy to figure out the parsing side of superpower, and this is a really simple case.
            string output = "";
            Stack<string> closingTagStack = new Stack<string>();
            

            foreach (var token in tokens.Value) 
            {
                switch (token.Kind) 
                {
                    case LazySSMLToken.LParen:
                        string tag = token.ToStringValue().Remove(token.ToStringValue().Length - 1);
                        if (tag.Equals("w"))
                        {
                            output = output + "<amazon:effect name=\"whispered\">";
                            closingTagStack.Push("</amazon:effect>");
                        }
                        else if (tag.Equals("ee")) 
                        {
                            output = output + "<emphasis level=\"strong\">";
                            closingTagStack.Push("</emphasis>");
                        }
                        else if (tag.Equals("e"))
                        {
                            output = output + "<emphasis level=\"moderate\">";
                            closingTagStack.Push("</emphasis>");
                        }
                        else if (tag.Equals("r"))
                        {
                            output = output + "<emphasis level=\"reduced\">";
                            closingTagStack.Push("</emphasis>");
                        }
                        else if (tag.Equals("s"))
                        {
                            output = output + "<amazon:effect phonation=\"soft\">";
                            closingTagStack.Push("</amazon:effect>");
                        }


                        break;
                    case LazySSMLToken.RParen:
                        if (closingTagStack.Count > 0)
                        {
                            output = output + closingTagStack.Pop();
                        }
                        break;
                    
                    default:
                        string temp = token.ToStringValue();
                        temp = sanitizeForAmazonPolly(temp);
                        XmlDocument doc = new XmlDocument(); //would like to use this for the whole request.. but it's hard to make namespaces work with it how amazon expects when we're only making a partial document like this.
                        temp = doc.CreateTextNode(temp).OuterXml; //sanitizes/escapes characters for xml
                        output = output + temp;
                        break;
                }
            }

            //force closing tags to keep this valid.
            while (closingTagStack.Count > 0) {
                output = output + closingTagStack.Pop(); 
            }


            return output;

        }

        /// <summary>
        /// sending some strings with special characters to amazon polly crashes, even in a proper ssml request, so fix them.
        /// ' or ` at the end of strings causes issues, and doesn't affect the result, so remove them.
        /// <> can break if multiple are next to eachother, so add spaces.
        /// (){}[] all break it if there's no actual text in the string.
        /// multiple . in a row breaks it too, replace with one .
        /// </summary>
        /// <param name="Text"></param>
        /// <returns></returns>
        public static string sanitizeForAmazonPolly(string Text)
        {
            Text = Regex.Replace(Text, @"[\']+\Z", ""); //strip ' at the end of the string
            Text = Regex.Replace(Text, @"[\`\(\)\{\}\[\]\*]+", ""); //strip characters that can break it but aren't read
            //Text = Regex.Replace(Text, @"\.{2,}", "."); //replace multiple . with one
            return Text.Replace("<", "< ").Replace(">", "> ").Replace(".", " .");
        }
    }

    public class LazySSMLExpression 
    {
        public string Tag { get; set; } = "";
        public string Value { get; set; } = "";

        public LazySSMLExpression[] Children { get; set; }

    }

    public static class Program
    {
        public static void Test()
        {
            Console.Write("json > ");
            var line = Console.ReadLine();
            while (line != null)
            {
                if (!string.IsNullOrWhiteSpace(line))
                {
                    Console.WriteLine(LazySSMLParser.TryParse(line));
                }

                Console.WriteLine();
                Console.Write("lazy SSML> ");
                line = Console.ReadLine();
            }
        }
    }
}
