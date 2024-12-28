+++
title = "Managing multiple hugo versions"
date = "2024-12-28"
author = "Robert"
cover = ""
description = "Some tips on managing multiple hugo versions between projects"
draft = false
+++

I'm maintaining a few Hugo sites (this one and [www.ai-stories.io](https://www.ai-stories.io)), and unfortunately this website uses a quite old version of Hugo. I need to be able to easilyswitch between versions v0.68.3 and v0.140.0. 

My approach is this:

- Install Hugo globally with `brew install hugo` (so that running `hugo` will use v0.140.0)
- Install a specific version of Hugo for this website and run a simple shell script to use the v0.68.3 version. 

Unfortunately you cannot directly install a specific version of Hugo, so I had to use a workaround that I found on the Hugo forums.

First I try to find [the correct bottle version on github](https://github.com/search?q=repo%3AHomebrew%2Fhomebrew-core+hugo+0.68.3&type=commits) then get the raw file. Unfortunately, with the current version of brew this bottle is not entirely compatible, but we can easily change it (thanks Claude :'))

Original file:

```ruby
# hugo.rb
class Hugo < Formula
  desc "Configurable static site generator"
  homepage "https://gohugo.io/"
  url "https://github.com/gohugoio/hugo/archive/v0.68.3.tar.gz"
  sha256 "38e743605e45e3aafd9563feb9e78477e72d79535ce83b56b243ff991d3a2b6e"
  head "https://github.com/gohugoio/hugo.git"

  bottle do
    cellar :any_skip_relocation
    sha256 "202cb22f91d546939c3e7d11a360b39eb67e445b41f8a8114c35c6cb26d7a7d1" => :catalina
    sha256 "9b93809ed925204a4d34458044e5d81e152c43c10debaf87509007f45b84bec3" => :mojave
    sha256 "71684aacddbb3d971ea53de453cc8de91c15501ef3db9fab5077a43aa6bd73ee" => :high_sierra
  end

  depends_on "go" => :build

  def install
    ENV["GOPATH"] = HOMEBREW_CACHE/"go_cache"
    (buildpath/"src/github.com/gohugoio/hugo").install buildpath.children

    cd "src/github.com/gohugoio/hugo" do
      system "go", "build", "-o", bin/"hugo", "-tags", "extended", "main.go"

      # Build bash completion
      system bin/"hugo", "gen", "autocomplete", "--completionfile=hugo.sh"
      bash_completion.install "hugo.sh"

      # Build man pages; target dir man/ is hardcoded :(
      (Pathname.pwd/"man").mkpath
      system bin/"hugo", "gen", "man"
      man1.install Dir["man/*.1"]

      prefix.install_metafiles
    end
  end

  test do
    site = testpath/"hops-yeast-malt-water"
    system "#{bin}/hugo", "new", "site", site
    assert_predicate testpath/"#{site}/config.toml", :exist?
  end
end
```

updated file:

```ruby
# hugo.rb
class Hugo < Formula
    desc "Configurable static site generator"
    homepage "https://gohugo.io/"
    url "https://github.com/gohugoio/hugo/archive/v0.68.3.tar.gz"
    sha256 "38e743605e45e3aafd9563feb9e78477e72d79535ce83b56b243ff991d3a2b6e"
    head "https://github.com/gohugoio/hugo.git"
  
    bottle do
      root_url "https://homebrew.bintray.com/bottles"
      rebuild 0
      sha256 catalina: "202cb22f91d546939c3e7d11a360b39eb67e445b41f8a8114c35c6cb26d7a7d1"
      sha256 mojave: "9b93809ed925204a4d34458044e5d81e152c43c10debaf87509007f45b84bec3"
      sha256 high_sierra: "71684aacddbb3d971ea53de453cc8de91c15501ef3db9fab5077a43aa6bd73ee"
    end
  
    depends_on "go" => :build
  
    def install
      ENV["GOPATH"] = HOMEBREW_CACHE/"go_cache"
      (buildpath/"src/github.com/gohugoio/hugo").install buildpath.children
  
      cd "src/github.com/gohugoio/hugo" do
        system "go", "build", "-o", bin/"hugo", "-tags", "extended", "main.go"
  
        # Build bash completion
        system bin/"hugo", "gen", "autocomplete", "--completionfile=hugo.sh"
        bash_completion.install "hugo.sh"
  
        # Build man pages; target dir man/ is hardcoded :(
        (Pathname.pwd/"man").mkpath
        system bin/"hugo", "gen", "man"
        man1.install Dir["man/*.1"]
  
        prefix.install_metafiles
      end
    end
  
    test do
      site = testpath/"hops-yeast-malt-water"
      system "#{bin}/hugo", "new", "site", site
      assert_predicate testpath/"#{site}/config.toml", :exist?
    end
  end
```

(changes are in the `bottle do` section, but easiest to ask AI to do the changes for you :P)

Then I create a simple shell script to use the v0.68.3 version:

```bash
#!/bin/bash
/opt/homebrew/Cellar/hugo/0.68.3/bin/hugo "$@"
```

and make it executable with `chmod +x hugo`. Then I can simply run `./hugo` to use the v0.68.3 version.
