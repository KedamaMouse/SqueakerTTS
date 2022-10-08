Mainly writing this so I don't forget important details in the breaks between having time to work on this. 
Also a good reference for tackling fixing wonky build stuff.

# Design
Front end is using Electron and React.
This starts and connects to a C# process through https://github.com/ruidfigueiredo/electron-cgi
The C# process (SqueakerTTSCmd) can also be used as a command line tool and is what parses and passes things to the TTS.

For Windows(currently only support this, since these are platform dependent APIs)
This uses the System.Speach Nuget package to interact with the windows speach API(SAPI)

By installing Amazon Polly for windows, this can interact with those voices/support amazon polly only ssml.
Because i've run into bugs with this, it may make sense at some point to support these voices via directly sending web requests, instead of through SAPI. 
I would still require users to supply their own API key, because not doing that is a whole can of worms. Amazon charges per character. It's super cheap for indivual uses, but paying for all usage of squeakerTTS could get out of hand, is open to abuse, and would require doing that from a webserver to keep it secure which is a whole lot of extra complexity.


# Setup
Currently have things setup for c# .net dev in visual studio, and electron/react dev in visual studio code.

*  Run ```npm install```. Generally just once, or if we need to run npm update.
*  If using visual studio code, install the styled components extension.

# Build
* In VSCode run the default build task(ctrl+shift+b). This:
* * Runs ```npm run build```. compiles main process code/dependencies into main.js. Also compiles the preload script into preload.js
* * Runs ```npm run build:react```. compiles render process code/dependencies into render.js. This also copies index.html over to dist. 
* * copies ```.\src\Styles.css``` to ```.\dist\Styles.css```
* compile the .net projects in SqueakerTTS.sln. if using visual studio this has a post-build task to copy the binaries to the appropriate place in the dist folder.


# Run
run  ```npm start```
This is set up in VSCode as a debug and run option. 
It doesn't attach debugging for the renderer process though.
There are currently some attach on debug options in the launch.json, but these don't seem to work. You can launch developer tools via ctrl+shift+I with SqueakerTTS open.

# Package

* run ```npm run package-win```.
* copy the .net bin folder into the released folder

