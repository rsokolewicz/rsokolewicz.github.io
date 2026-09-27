+++
title = "Solving Epson printer error code 302608"
date = "2026-09-27"
author = "Robert"
cover = ""
description = ""
draft = false
+++

I have a Epson XP-970 printer that broke the other day. Ten-twenty seconds after
booting the printer stops whatever it was doing and the display shows a

> system error "302608"

Customer support wasn't very helpful, and a Google search showed me exactly one
hit of someone who also had this problem, but on solution.

With the help of Gemini, we cracked the case. I installed the firmware updater
from Epson's website, connected my laptop to the printer using a usb-c to usb-b
cable. I then booted the printer in "recovery mode", by putting my fingers in
the top right corner of the touch screen and holding the power button for about
15 seconds. Right after the power button starts to flash I let go of screen and
button. Some white text appeared (if you don't let go fast enough red text
appears and you have to try again). I then updated the firmware using the
updater. The updater said "upload complete", but apparently this doesn't mean
that the update is complete. You have to wait for about 2-3 minutes for the
firmware to install (no indication from printer that something is happening). If
you reboot before it finishes, you are cooked because the printer wil be in a
non-recoverable state. When the update is complete white text appears on the
touch screen saying something like

> update mode FINISHED ROM VERSION 02.77.PI 2205 ROM1 FIXSUM E9C4 ROM2 FIXSUM
> CDEF

and the power button starts flashing. To reboot, instead of pressing the power
button you have to touch the touch screen, and only then can you use the button
the reboot the printer.

Not very friendly, but it made my printer work again.
