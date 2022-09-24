using System.Diagnostics;
using AudioSwitcher.AudioApi.CoreAudio;
using AudioSwitcher.AudioApi.Session;
using SqueakerTTSInterfaces;
using NAudio.Wasapi;


namespace SqueakerTTSWin
{
    public class WidowsUtils: IPlatformDependantUtils
    {

        public void SetVolume(int volume) 
        {
            var controler = new CoreAudioController();
            
            var devices = controler.GetPlaybackDevices();
            foreach (var device in devices) 
            {
                
                foreach (var session in device.GetCapability<IAudioSessionController>()) 
                {
                    if (session.ProcessId == Process.GetCurrentProcess().Id) 
                    {
                        session.SetVolumeAsync(volume);
                    }
                    
                }
                
            }

        }

        public void sendStart()
        {
            Process.Start("dist/startSpeakingScript.exe");
        }
        public void sendStop()
        {
            Process.Start("dist/stopSpeakingScript.exe");
        }

    }
}
