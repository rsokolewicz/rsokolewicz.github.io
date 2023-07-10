+++
title = "Git ahoy! A Pirate's Tale of Version Control"
date = "2023-07-10"
author = "Robert"
description = "Yo-ho-ho and a bottle of Git! Follow the daring exploits of Captain Blackbeard's rum-soaked crew as they navigate treacherous seas, correct their plundering mistakes with cunning commits, and master the art of version control on their ship, the Jolly Git Committer."
+++


## Adventure Begins

As the dawn cracks over the horizon, Captain Gitbeard, a notorious pirate, and his crew of misfits aboard the ship, "The Digital Marauder," sail through the emerald waves of the Caribbean. They maintain an inventory of their loot with a shared file named `loot.txt` version controlled through git. But as the crew is always a bit tipsy, they've been known to commit a few mistakes now and then.

Their `loot.txt` file at the moment looks like this:

```
Pieces of Eight: 500
Gold Bars: 20
Jewelled Necklaces: 15
Diamonds: 7
```

The git log shows:

```
commit 1234567
Author: Captain Gitbeard <gitbeard@pirate.net>
Date: Fri Jul 7 10:00:00 2023
Initial loot list.
```

## A Blunder at Plunder

After a successful raid on a Spanish galleon, the crew updates the `loot.txt` file with their new treasures. First Mate Morgan, a bit too merry with rum, updates the file as:

```
Pieces of Eight: 1500
Gold Bars: 120
Jewelled Necklaces: 150
Diamonds: 170
```

He then commits this with the message "Plunder from the Spanish galleon". He forgot that the crew only found 100 new Pieces of Eight, 10 new Gold Bars, 5 new Necklaces, and 3 new Diamonds.

The git history now looks like:

```
commit 7654321
Author: First Mate Morgan <morgan@pirate.net>
Date: Sat Jul 8 12:00:00 2023
Plunder from the Spanish galleon.

commit 1234567
Author: Captain Gitbeard <Gitbeard@pirate.net>
Date: Fri Jul 7 10:00:00 2023
Initial loot list.
```

Captain Gitbeard realizes the blunder and orders Morgan to amend the last commit with the correct numbers. Morgan runs:

```
git checkout HEAD
```

Corrects `loot.txt`:

```
Pieces of Eight: 600
Gold Bars: 30
Jewelled Necklaces: 20
Diamonds: 10
```

And then amends the previous commit:

```
git add loot.txt
git commit --amend -m "Plunder from the Spanish galleon"
```

Now the git history shows the correct values:

```
commit abcdefg
Author: First Mate Morgan <morgan@pirate.net>
Date: Sat Jul 8 12:00:00 2023
Plunder from the Spanish galleon.

commit 1234567
Author: Captain Gitbeard <Gitbeard@pirate.net>
Date: Fri Jul 7 10:00:00 2023
Initial loot list.
```

## The Tale of the Missing Loot

During an audit by Quartermaster Anne, she notices the `loot.txt` file doesn't list their cache of rum. As she tries to insert this into the initial inventory, she realizes she can't simply amend the commit as it would rewrite everyone's history after that commit.

To remedy this, she decides to use the interactive rebase to modify the initial commit. She runs:

```
git rebase -i --root
```

In the text editor that opens up, she changes the word 'pick' to 'edit' for the initial commit, then saves and exits. Git now pauses at the commit she wants to edit.

She updates `loot.txt` to:

```
Pieces of Eight: 500
Gold Bars: 20
Jewelled Necklaces: 15
Diamonds: 7
Rum: 100 barrels
```

Then, she stages the changes and commits them with:

```
git add loot.txt
git commit --amend -m "Initial loot list."
```

To continue the rebase, she runs:

```
git rebase --continue
```

The `loot.txt` file is corrected, and the git history remains consistent for all crew members.

## The End

The "Digital Marauder" continues to sail through the digital seas, correcting and updating their loot list with each new raid. The crew finds that despite their tipsiness, git gives them the power to make their mistakes disappear - as if they'd never happened.
