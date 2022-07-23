using System.Diagnostics;
using AudioSwitcher.AudioApi.CoreAudio;
using AudioSwitcher.AudioApi.Session;

namespace SqueakerTTSWin
{
    public static class WidowsUtils
    {

        public static void SetVolume(int volume) 
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
