+++
title = "Copy large amounts of files over ssh"
date = "2022-04-13"
author = "Robert"
cover = ""
description = "To copy large amounts of files over ssh you have a few options. The slowest option is using `scp -r` to recursively copy each file one by one, but it is faster and more convenient to first tar or gzip your home directory, copy it over to..."
+++

To copy large amounts of files over ssh you have a few options. The slowest option is using `scp -r` to recursively copy each file one by one, but it is faster and more convenient to first tar or gzip your home directory, copy it over to your host computer and unpack it there. This is possible to do in a single line

```{bash}
tar czf - <files> | ssh user@host "tar -C <destination> xvzf -"
```
where `<files>` are paths to the files and directories to tar and `<destination>` is the destination folder on the host computer. One downside of this approach is that you won't have a clear indication on how long it will take. An alternative approach is to first tar everything, and then use `rsync` to send everything over. 

````{bash}
tar czf <files>
rsync -av --progress /foo/*.tar.gz user@host:<directory>

```