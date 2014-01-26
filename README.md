Version Control For Text Fields
===============================

Simplified version control for text type fields in ProcessWire CMS/CMF.
Copyright (c) 2013 Teppo Koivula

This module uses hooks provided by ProcessWire to catch page edits, finds out
which fields were changed and if text fields (see list of currently supported
fields below) were changed their values are saved for later use. Note that at
module settings you can define which specific fieldtypes and fields to track
and for which templates tracking values should be enabled.

While editing a page with version control enabled, revision toggle (link which
opens list of previous revisions) is shown for fields with earlier revisions
available. From this list user can select a revision and rollback value of
the field to that specific revision.

## Supported fieldtypes and inputfields

Currently supported fieldtypes:

  * Email
  * Datetime
  * Text (regular and multi-language)
  * Textarea (regular and multi-language)
  * Page Title (regular and multi-language)
  * Checkbox
  * Integer
  * Float
  * URL
  * Page
  * Module
  
These fieldtypes are confirmed to work properly with this module. If fieldtype
isn't listed here, it doesn't necessarily mean that it's not supported - just
that it hasn't been tested yet. If you know a fieldtype which works properly
but isn't included here, please inform the author of this module via GitHub.

Following inputfields are supported:

  * TinyMCE
  * CKEditor (regular and inline mode)
  * Text (+ other inputfields using `<input>` HTML element, such as Email)
  * Textarea (+ other inputfields using regular `<textarea>` HTML element)
  * Select

## Getting started

Copy (or clone with git) VersionControlForTextFields folder to /site/modules/,
go to Admin > Modules, hit "Check for new modules" and install Version Control
For Text Fields. Revision History For Text Fields module will be installed
automatically.

After installing this module you need to configure it before anything really
starts happening. Most configuration options (essentially templates and fields
this module is switched on for) can be found from Admin > Modules > Version
Control For Text Fields (module config.) Minor settings can also be found from
related Process modules config: Admin > Modules > Revision History For Text
Fields.

## License

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

(See included LICENSE file for full license text.)