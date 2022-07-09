using ElectronCgi.DotNet;
using SpeechLib;

TTSAPIConnector connector = new TTSAPIConnector();
connector.Listen();

public class TTSAPIConnector {


    private readonly Connection connection;
    SpVoice voice;
    public TTSAPIConnector() {
        connection = new ConnectionBuilder().WithLogging().Build();
        voice = new SpVoice();
        connection.On<string>("speak", Speak);
     }

    public void Listen() 
    {
        connection.Listen();
    }
    public void Speak(string Text) 
    {
        voice.Speak(Text);
    }
}