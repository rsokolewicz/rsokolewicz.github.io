+++
title = "Custom matplotlib styles"
date = "2025-01-26"
author = "Robert"
cover = ""
description = ""
draft = false
+++

Creating custom matplotlib styles is apparently super easy! For this blog I gathered all the matplotlib parameters and added them to a file called `orange_dark.mplstyle`. You're supposed to put this inside the `.matplotlib` folder in your home directory, but for some reason that didn't work out for me, so I put it inside the root of this blog folder and refer to it with a full path. 

Now, if I want to make a simple plot, I can just do this:

```python
import matplotlib.pyplot as plt
import numpy as np
from dotenv import find_dotenv
import os

ROOT = os.path.dirname(find_dotenv())

plt.style.use(f'{ROOT}/orange_dark.mplstyle')

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.show()
```

{{< figure src="hello.svg" >}}

The contents of the `orange_dark.mplstyle` file are:

```yaml
# Using dark background as base
axes.facecolor: "#222129"
figure.facecolor: "#222129"
savefig.facecolor: "#222129"

# Main orange color scheme
axes.prop_cycle: cycler('color', ['"#ffa86a"'])
text.color: white
axes.labelcolor: white
xtick.color: white
ytick.color: white
grid.color: white
grid.alpha: 0.3
axes.edgecolor: white

# Legend
legend.facecolor: "#222129"
legend.edgecolor: white
legend.labelcolor: white

# Font
font.family: FiraCode Nerd Font
font.size: 10
axes.titlesize: 12
axes.labelsize: 10
xtick.labelsize: 10
ytick.labelsize: 10
legend.fontsize: 10
```

Finding and registering the font was a bit of a hassle. I basically had to find the font on my laptop, and run

```python
import matplotlib.font_manager as fm
fm.fontManager.addfont(
    "/Users/rsoko/Library/Fonts/FiraCodeNerdFont-Regular.ttf"
) 
fm._load_fontmanager(try_read_cache=False)
```

to register it. Then to find the font family name, I ran

```python
import matplotlib.font_manager as fm

available_fonts = [font.name for font in fm.fontManager.ttflist]
[name for name in available_fonts if "fira" in name.lower()]
```

