
using ElectronCgi.DotNet;
using SqueakerTTSInterfaces;
using System.Collections.ObjectModel;
using System.CommandLine;
using System.CommandLine.NamingConventionBinder;
using System.Runtime.InteropServices;
using System.Speech.Synthesis;

public class SqueakerTTSCmd {



    static int Main(string[] args)
    {
        var rootCommand = new RootCommand
        {
            new Option<bool>("--connect"),
            new Option<bool>("--ssml"),
            new Option<string>("--voice"),
            new Option<string>("--text")
        };
        rootCommand.Handler = CommandHandler.Create<bool,bool,string,string>(mainHandler);
        return rootCommand.Invoke(args);
    }

    static int mainHandler(bool connect,bool ssml, string voice,string text) 
    {
        SqueakerTTSCmd connector = new SqueakerTTSCmd(connect);
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
            if (ssml)
            {
                connector.SpeakSSML(text);
            }
            else
            {
                connector.Speak(new TTSRequest() {text=text, vocalLength=100, rate=100,pitch=0 });
            }
        }
        return 0;
    }

    private readonly Connection? connection;
    SpeechSynthesizer? synthesizer;
    IPlatformDependantUtils platformUtils;
    public SqueakerTTSCmd(bool MakeConnection) {
        
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return; //Not yet supported.
        }

        platformUtils = new SqueakerTTSWin.WidowsUtils();
        synthesizer = new SpeechSynthesizer();

        if (MakeConnection)
        {
            connection = new ConnectionBuilder().WithLogging().Build();
            connection.On<TTSRequest>("speak", Speak);
            connection.On("getVoices", GetVoices);
            connection.On("stop", Stop);
            connection.On<string>("setVolume", SetVolume);
        }
     }

    public void Listen() 
    {
        connection?.Listen();
    }
    public void Speak(TTSRequest request) 
    {
        if (String.IsNullOrEmpty(request.text)) { return;}
        SetVoice(request.voice);

        if (synthesizer.Voice != null && synthesizer.Voice.Name.Contains("Amazon")) 
        {
            if (String.IsNullOrEmpty(request.text)) { return; }

            //always use ssml for amazon polly,otherwise it's harder to handle special characters and you might get "invalid ssml request" accidently. 
            request.text = LazySSMLParser.LazySSMLParser.TryParse(request.text);


            if (request.vocalLength != 100 && !synthesizer.Voice.Name.Contains("Neural")) 
            {
                request.text = "<amazon:effect vocal-tract-length=\"" + request.vocalLength+"%\">"+request.text+"</amazon:effect>";
            }

            bool adjustPitch = (request.pitch != 0 && !synthesizer.Voice.Name.Contains("Neural"));
            if (adjustPitch || request.rate !=100) 
            {
                var opentag = "<prosody rate=\"" + request.rate + "%\"";
                if (adjustPitch) 
                {
                    var pitchString = request.pitch > 0 ? "+" + request.pitch : request.pitch.ToString();
                    opentag = opentag + " pitch=\"" + pitchString + "%\"";
                }
                opentag = opentag + ">";

                request.text = opentag + request.text + "</prosody>";

            }

            if (request.autoBreaths) 
            {
                request.text = "<amazon:auto-breaths>" + request.text + "</amazon:auto-breaths>";
            }

            request.text = "<speak>" + request.text + "</speak>";
            synthesizer.Speak(request.text);
        }
        else 
        {
            synthesizer.Speak(request.text);
            
        }
    }

    public void SpeakSSML(string text) 
    {
        if (!String.IsNullOrEmpty(text)) 
        {
            synthesizer.SpeakSsml(text);
        }
    }

    public void Stop() 
    {
        synthesizer.SpeakAsyncCancelAll();
 
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

    public void SetVolume(string volume)
    {
        platformUtils.SetVolume(int.Parse(volume));
    }

    [Serializable()]
    public class TTSRequest 
    {
        public string? text { get; set; }
        public int vocalLength { get; set; }

        public int pitch { get; set; }
        public int rate { get; set; }

        public string? voice { get; set; }

        public bool autoBreaths { get; set; }
    }
}