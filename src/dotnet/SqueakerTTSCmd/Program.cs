
using ElectronCgi.DotNet;
using SqueakerTTSInterfaces;
using System.Collections.ObjectModel;
using System.CommandLine;
using System.CommandLine.NamingConventionBinder;
using System.Globalization;
using System.Runtime.InteropServices;
using System.Speech.Synthesis;
using System.Diagnostics;

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
            voice = connector.SmartSetVoice(voice);
            if (voice == null) 
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
                connector.Speak(new TTSRequest() { text = text, vocalLength = 100, rate = 100, pitch = 0, voice = voice }); ;
            }
        }
        return 0;
    }

    private readonly Connection? connection;
    SpeechSynthesizer? synthesizer;
    IPlatformDependantUtils platformUtils;
    private string StartCommand { get; set; }
    private string StopCommand { get; set; }
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
            connection.On<string>("setStartCommand", SetStartCommand);
            connection.On<string>("setStopCommand", SetStopCommand);
        }
     }

    public void Listen() 
    {
        connection?.Listen();
    }
    public void Speak(TTSRequest request) 
    {
        //System.Console.WriteLine("start speaking");
        if (String.IsNullOrEmpty(request.text)) { return;}

        if (!String.IsNullOrEmpty(StartCommand))
        {
            Process.Start(StartCommand);
        }
        SetVoice(request.voice);
        synthesizer.SpeakCompleted += onSpeakCompleted;

        if (synthesizer.Voice != null && synthesizer.Voice.Name.Contains("Amazon")) 
        {
            //always use ssml for amazon polly,otherwise it's harder to handle special characters and you might get "invalid ssml request" accidently. 
            synthesizer.SpeakAsync(GetAmazonSSML(request, GetVoiceCapabilities(synthesizer.Voice)));
        }
        else 
        {
            synthesizer.SpeakAsync(request.text);
            
        }
    }

    private void onSpeakCompleted(Object? sender,SpeakCompletedEventArgs args) {
        if (!String.IsNullOrEmpty(StopCommand))
        {
            Process.Start(StopCommand);
        }
    }

    private ExtendedVoiceInfo GetVoiceCapabilities(VoiceInfo voice) 
    {
        string isNeuralString = "";
        voice.AdditionalInfo.TryGetValue("IsNeural", out isNeuralString);
        bool isNeural = (isNeuralString != null && isNeuralString.Equals("1"));
        string vendor = voice.AdditionalInfo["Vendor"];

        bool isAmazonPoly = vendor.Equals("Amazon");



        return new ExtendedVoiceInfo() 
        {
            SupportsVocalLength= isAmazonPoly && !isNeural,
            SupportsPitch = !isNeural,
            Description = voice.Description,
            Id=voice.Id,
            Name = voice.Name,
            Vendor = vendor,
            CultureKey= voice.Culture?.Name,
            SupportsAutoBreaths = isAmazonPoly && !isNeural,
            
            //Amazon polly has this wrong on a lot of voices in sapi
            CultureDisplayName = isAmazonPoly ? getLocaleForAmazonPolly(voice.Name) : voice.Culture?.DisplayName,
        };
    }

    private string getLocaleForAmazonPolly(string name) 
    {
        string amazonLocaleName = name.Split("-")[1].Trim();

        string cultureCode;

        switch (amazonLocaleName) 
        {
            case "Arabic":
                cultureCode = "ar"; break;
            case "US English":
                cultureCode = "en-us"; break;
            case "Catalan":
                cultureCode = "ca-ES"; break;
            case "Chinese Mandarin":
                cultureCode = "zh-CN"; break;
            case "Welsh":
                cultureCode = "cy-GB"; break;
            case "Danish":
                cultureCode = "da-DK"; break;
            case "German":
                cultureCode = "de-De"; break;
            case "Australian English":
                cultureCode = "en-AU"; break;
            case "Welsh English":
                cultureCode = "en-GB-Welsh"; break;
            case "British English":
                cultureCode = "en-GB"; break;
            case "Indian English":
                cultureCode = "en-IN"; break;
            case "New Zealand English":
                cultureCode = "en-NZ"; break;
            case "South African English":
                cultureCode = "en-ZA"; break;
            case "Castilian Spanish":
                cultureCode = ""; break;
            case "Mexican Spanish":
                cultureCode = "es-MX"; break;
            case "US Spanish":
                cultureCode = "es-US"; break;
            case "Canadian French":
                cultureCode = "fr-CA"; break;
            case "French":
                cultureCode = "fr-FR"; break;
            case "Icelandic":
                cultureCode = "is-IS"; break;
            case "Italian":
                cultureCode = "it-IT"; break;
            case "Japanese":
                cultureCode = "ja-JP"; break;
            case "Korean":
                cultureCode = "ko-KR"; break;
            case "Norwegian":
                cultureCode = "nb-NO"; break;
            case "Dutch":
                cultureCode = "nl-NL"; break;
            case "Polish":
                cultureCode = "pl-PL"; break;
            case "Brazilian Portuguese":
                cultureCode = "pt-BR"; break;
            case "Portuguese":
                cultureCode = "pt-PT"; break;
            case "Romanian":
                cultureCode = "ro-RO"; break;
            case "Russian":
                cultureCode = "ru-RU"; break;
            case "Swedish":
                cultureCode = "sv-SE"; break;
            case "Turkish":
                cultureCode = "tr-TR"; break;
            default:
                cultureCode = ""; break;
        }

        if (cultureCode.Length > 0)
        {
            return new CultureInfo(cultureCode).DisplayName;
        }
        else { 
            return amazonLocaleName;
        }
    }



    protected string GetAmazonSSML(TTSRequest request, ExtendedVoiceInfo voiceCapabilities)
    {

        string text = LazySSMLParser.LazySSMLParser.TryParse(request.text);


        if (request.vocalLength != 100 && voiceCapabilities.SupportsVocalLength)
        {
            text = "<amazon:effect vocal-tract-length=\"" + request.vocalLength + "%\">" + text + "</amazon:effect>";
        }

        bool adjustPitch = (request.pitch != 0 && voiceCapabilities.SupportsPitch);
        if (adjustPitch || request.rate != 100)
        {
            var opentag = "<prosody rate=\"" + request.rate + "%\"";
            if (adjustPitch)
            {
                var pitchString = request.pitch > 0 ? "+" + request.pitch : request.pitch.ToString();
                opentag = opentag + " pitch=\"" + pitchString + "%\"";
            }
            opentag = opentag + ">";

            text = opentag + text + "</prosody>";

        }

        if (request.autoBreaths && voiceCapabilities.SupportsAutoBreaths)
        {
            text = "<amazon:auto-breaths>" + text + "</amazon:auto-breaths>";
        }

        text = "<speak>" + text + "</speak>";

        return text;
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

    public void SetStartCommand(string command) 
    {
        StartCommand = command;
    }
    public void SetStopCommand(string command)
    {
        StopCommand = command;
    }


    protected List<ExtendedVoiceInfo> GetVoices() 
    {
        var voices = synthesizer.GetInstalledVoices();
        var extendedVoices = new List<ExtendedVoiceInfo>();

        foreach (var voice in voices) 
        {
            extendedVoices.Add(GetVoiceCapabilities(voice.VoiceInfo));
        }

        return extendedVoices;
    }

    public string SmartSetVoice(string voiceSearch) 
    {
        string[] keywords = voiceSearch.Split(" ");

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
                return v.VoiceInfo.Name;   
            }
        }

        Console.WriteLine("No match found for voice " + voiceSearch);
        return null;
        
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

    protected class ExtendedVoiceInfo
    {
        public bool SupportsVocalLength { get; set; }
        public bool SupportsPitch { get; set; }

        public bool SupportsAutoBreaths { get; set; }

        public string? Name { get; set; }
        public string? Id { get; set; }

        public string? Description { get; set; }

        public string? Vendor { get; set; }

        public string? CultureKey { get; set; }

        public string? CultureDisplayName { get; set; }





    }
}