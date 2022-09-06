Mainly writing this so I don't forget important details in the breaks between having time to work on this. 
Also a good reference for tackling fixing wonky build stuff.

# Design





# Build
* Run ```npm install```. Generally just once, or if we need to run npm update.
* Run the typesscript comipler to output the results in the dist folder. In VSCode this is setup as the default build task(ctrl+shift+b)
* Run ```npm run build:react```. This copies index.html over to dist, it also necessary for react changes currently though i'm not sure what isn't caught by the ts compile.
* Run ```sass .\src\Styles.scss .\dist\Styles.css```
* compile the .net projects in SqueakerTTS.sln. if using visual studio this has a post-build task to copy the binaries to the appropriate place in the dist folder.


# Run
run  ```npm start```
This is set up in VSCode as a debug and run option. 
It doesn't attach debugging for the renderer process though.
There are currently some attach on debug options in the launch.json, but these don't seem to work. You can launch developer tools via ctrl+shift+I with SqueakerTTS open.

# Package
