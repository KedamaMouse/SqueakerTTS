using ElectronCgi.DotNet;
using SpeechLib;
using System.CommandLine;
using System.CommandLine.NamingConventionBinder;
using System.Runtime.InteropServices;
using System.Speech.Synthesis;

public class TTSAPIConnector {



    static int Main(string[] args)
    {
        var rootCommand = new RootCommand
        {
            new Option<bool>("--connect")
        };
        rootCommand.Handler = CommandHandler.Create<bool>(mainHandler);
        return rootCommand.Invoke(args);
    }

    static int mainHandler(bool connect) 
    {
        TTSAPIConnector connector = new TTSAPIConnector();
        if (connect)
        {
            connector.Listen();
            return 0;
        }
        return 0;
    }

    private readonly Connection connection;
    SpeechSynthesizer? synthesizer;
    public TTSAPIConnector() {
        connection = new ConnectionBuilder().WithLogging().Build();
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return; //Not yet supported.
        }
        
        synthesizer = new SpeechSynthesizer(); 
        connection.On<string>("speak", Speak);
        connection.On("getVoices", GetVoices);
        connection.On<string>("setVoice", SetVoice);
     }

    public void Listen() 
    {
        connection.Listen();
    }
    public void Speak(string Text) 
    {
        synthesizer.Speak(Text);
    }

    public System.Collections.ObjectModel.ReadOnlyCollection<InstalledVoice> GetVoices() 
    {
        var voices = synthesizer.GetInstalledVoices();

        return voices;
    }

    public void SetVoice(string name) 
    {
        synthesizer.SelectVoice(name);
    }
}