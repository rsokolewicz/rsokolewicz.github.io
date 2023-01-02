+++
title = "How to ssh over WiFi between two machines running wsl"
date = "2022-02-16"
author = "Robert"
cover = ""
description = ""
+++

We first follow a tutorial by [Scott Hanselman](https://www.hanselman.com/blog/the-easy-way-how-to-ssh-into-bash-and-wsl2-on-windows-10-from-an-external-machine) where we will use Windows' openSSH to handle ssh connections and set the default ssh shell to be bash on wsl.

## Setup ssh on your machine
Choose one of your two machines to be the host. On the host, we need to first check if OpenSSH.Server is installed. Open powershell with elevated rights and run the following
```{cmd}
> Get-WindowsCapability -Online | ? Name -like 'OpenSSH*'

Name  : OpenSSH.Client~~~~0.0.1.0
State : Installed

Name  : OpenSSH.Server~~~~0.0.1.0
State : NotPresent
```
If the state under OpenSSH.server is `NotPresent`, we need to run

```{cmd]
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

and start the ssh daemon

```{cmd}
Start-Service sshd
Get-Service sshd
```

If you expect to use the Host more often, you can consider starting the ssh daemon automatically on the host

```{cmd}
Set-Service -Name sshd -StartupType 'Automatic'
```

Next, we will set the default shell used by OpenSSH to be the one used by wsl

```{cmd}
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\WINDOWS\System32\bash.exe" -PropertyType String -Force
```

## Make your machine discoverable over network
To be able to find your host machine that runs the ssh daemon, you need to make some configurations in the network settings first. On both machines, go to network settings and under "network profile", select "private network". This will allow both machines to be discoverable on the WiFi network. If all is well, when you open File Explorer, under Network you should see your two machines. If you don't see it, you might need to restart your computer(s), or temporary turn off Windows firewall. 

## Preparing to copy
Now that this is all set-up, you should be able to ssh into your host computer via

```{bash}
ssh user@host
```
where `user` is your Windows login username (not your wsl linux username), and `host` is your host computer's local private ip address that looks like `192.168.x.x` or `172.x.x.x`. You can get the ip address by either running `ifconfig eth0` in your terminal, or by opening your Windows Network Settings (win-key > "network settings").

If you do not manage to connect, make sure the ssh daemon is running on your host computer by running `sudo service ssh status`. If it is not running you can start it with `sudo service ssh start`. If you still cannot connect, try to open port 22 in your firewall on the host computer, or temporary turn off Windows firewall. 

If all is correct you should get inside your host's wsl partition directly. 



