# Squeaker TTS
The purpose of this is to make a TTS app that's easy to use as your voice/as a microphone, and is flexable with various TTS features.


trello: https://trello.com/b/JfeKwULg/squeakertts-features

# Installing amazon voices to windows
I'm doing everything through standard windows speach synthasis APIs. That means to use some of the popular amazon voices, you have to install them:
https://docs.aws.amazon.com/polly/latest/dg/install-voice-plugin2.html

This does mean giving them a credit card and being potentially charged for usage, but it's really cheap(1 million characters is $4), and you also get a year of 5 million free characters per month. https://aws.amazon.com/polly/pricing/
And as stated here, ssml tags aren't counted as billible characters, so it appears to be just the actual text you're charged for: https://docs.aws.amazon.com/polly/latest/dg/limits.html
