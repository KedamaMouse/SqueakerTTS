using ElectronCgi.DotNet;
using SpeechLib;
using System.Collections.ObjectModel;
using System.CommandLine;
using System.CommandLine.NamingConventionBinder;
using System.Runtime.InteropServices;
using System.Speech.Synthesis;
using System.Text.RegularExpressions;

public class TTSAPIConnector {



    static int Main(string[] args)
    {
        var rootCommand = new RootCommand
        {
            new Option<bool>("--connect"),
            new Option<string>("--voice"),
            new Option<string>("--text")
        };
        rootCommand.Handler = CommandHandler.Create<bool,string,string>(mainHandler);
        return rootCommand.Invoke(args);
    }

    static int mainHandler(bool connect,string voice,string text) 
    {
        TTSAPIConnector connector = new TTSAPIConnector(connect);
        if (connect)
        {
            connector.Listen();
            return 0;
        }
        if (voice != null) 
        {
            if (!connector.SmartSetVoice(voice)) 
            {
                return -1;
            }
        }
        if (text != null) 
        {
            connector.Speak(text);
        }
        return 0;
    }

    private readonly Connection? connection;
    SpeechSynthesizer? synthesizer;
    public TTSAPIConnector(bool MakeConnection) {
        
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return; //Not yet supported.
        }
        
        synthesizer = new SpeechSynthesizer();

        if (MakeConnection)
        {
            connection = new ConnectionBuilder().WithLogging().Build();
            connection.On<string>("speak", Speak);
            connection.On("getVoices", GetVoices);
            connection.On<string>("setVoice", SetVoice);
        }
     }

    public void Listen() 
    {
        connection?.Listen();
    }
    public void Speak(string Text) 
    {
        if (synthesizer.Voice != null && synthesizer.Voice.Name.Contains("Amazon")) 
        {
            Text = sanitizeForAmazonPolly(Text);
        }

        if (!String.IsNullOrEmpty(Text))
        {
            synthesizer.Speak(Text);
        }
    }

    /// <summary>
    /// sending some strings with special characters to amazon polly crashes, so fix them.
    /// ' or ` at the end of strings causes issues, and doesn't affect the result, so remove them.
    /// <> can break if multiple are next to eachother, so add spaces.
    /// (){}[] all break it if there's no actual text in the string.
    /// multiple . in a row breaks it too, replace with one .
    /// </summary>
    /// <param name="Text"></param>
    /// <returns></returns>
    private string sanitizeForAmazonPolly(string Text) 
    {

        return Regex.Replace(Regex.Replace(Text, @"[\'\`\(\)\{\}\[\]\*]+", "").Replace("<", "< ").Replace(">", "> "), @"\.{2,}", ".");
    }

    public ReadOnlyCollection<InstalledVoice> GetVoices() 
    {
        var voices = synthesizer.GetInstalledVoices();

        return voices;
    }

    public bool SmartSetVoice(string voice) 
    {
        string[] keywords = voice.Split(" ");

        ReadOnlyCollection<InstalledVoice> voices = synthesizer.GetInstalledVoices();

        foreach (InstalledVoice v in voices) 
        {
            bool matches = true;
            foreach (string keyword in keywords) 
            {
                if (!v.VoiceInfo.Name.Contains(keyword,StringComparison.OrdinalIgnoreCase))
                {
                    matches = false; 
                }
            }
            if (matches) 
            {
                SetVoice(v.VoiceInfo.Name);
                return true;
            }
        }

        Console.WriteLine("No match found for voice " + voice);
        return false;
        
    }

    public void SetVoice(string name) 
    {
        synthesizer.SelectVoice(name);
    }
}