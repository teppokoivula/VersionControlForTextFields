Version Control For Text Fields
===============================

Simplified version control for text type fields in ProcessWire CMS/CMF.

This module attempts to use hooks provided by ProcessWire to catch page edits,
find out which fields were changed and if text fields (such as FieldtypeText,
FieldtypeTextarea etc.) were changed their values are saved for later use.

PLEASE KEEP IN MIND THAT THIS MODULE IS EXPERIMENTAL AND IT'S DEVELOPER TAKES
NO RESPONSIBILITY FOR ANY LOSS OF DATA, MONEY OR SANITY IT MIGHT CAUSE.

Sorry for shouting, but it really is quite important that you understand the
point I'm trying to make above. This is a proof-of-concept module rather than
anything production ready. It may or may not work properly at the moment and
if it doesn't, there's no guarantee that it'll ever get properly fixed.

That said, if you do decide to install it anyway, I'd love to hear how it
worked (or didn't work) for you. All suggestions are welcome too!

## Getting started

Copy VersionControlForTextFields folder to /site/modules/, go to Admin > Modules,
hit "Check for new modules" and install Process Changelog. Revision History For 
Text Fields module will be installed automatically with Version Control For Text 
Fields.

After installing this module you need to configure it before anything really
starts happening. Most configuration options (essentially templates and fields
this module is switched on for) can be found from Admin > Modules > Version
Control For Text Fields (module config.) Minor settings can also be found from
related Process modules config: Admin > Modules > Revision History For Text
Fields.
