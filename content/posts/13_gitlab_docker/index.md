+++
title = "Debugging gitlab pipeline docker containers"
date = "2023-08-24"
author= "Robert"
description = "Sometimes a pipeline that is running on GitLab has unexpected behavior, but how do we access the docker image so that we can debug locally?"
+++

## docker images and containers

Sometimes a pipeline that is running on GitLab has unexpected behavior, for example when a build is different from when you execute a build locally on your laptop. For debugging it is very useful to have the same environment, and sometimes just running a fresh conda environment and installing all the requirements is not enough. 

A container is merely an instance that is running a docker image, and so all we need to do is find the Docker image reference in the GitLab registry and we're good to go. 

## looking up the docker image reference

1. in your GitLab repository, navigate in the menu on the left, to Deploy > Container Registry
{{< figure src="images/image.png" position="center" >}}
2. search for the branch name
3. click the copy-to-clipboard button

{{< figure src="images/image-2.png" position="center" >}}

Sometimes you have a pipeline that creates another docker image, in which case you can often find the image name in the log of your pipeline. In each case, the reference will look similar to:

```
registry.gitlab.com/<repo>/<pipeline name>/python3.8@sha256:ce3f78d603803740615069e7680715d3707998671db4ee32fbec3e98f4dc2d53
```

## executing the docker container
The registry is not publicly available by default, so before creating a new docker container, you'll have to log into the registry first:

```bash
docker login registry.gitlab.com
```

which will ask for your GitLab username and password. If you have two-factor authentication enabled, you'll have to create an authentication token in the browser and use that as your password instead.

Now that we are logged in, you can create a new container that will run this image for you with the command:

```bash
docker run -it --name my-container <image-path> /bin/bash
```

here:

- the `-it` flag makes sure that the container runs in an interactive mode
- `<image-path>` should be replaced with the image path that we just copied
- and `/bin/bash` is the command that will be executed first. This is often optional, but sometimes there's a default `CMD` specified in the image that we would like to override while debugging.

