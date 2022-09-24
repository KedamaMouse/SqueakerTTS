using System;

namespace SqueakerTTSInterfaces
{
    public interface IPlatformDependantUtils
    {
        public void SetVolume(int volume);
        public void sendStart();
        public void sendStop();

    }
}
