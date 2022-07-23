using System.Diagnostics;
using AudioSwitcher.AudioApi.CoreAudio;
using AudioSwitcher.AudioApi.Session;
using SqueakerTTSInterfaces;

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

        

    }
}
