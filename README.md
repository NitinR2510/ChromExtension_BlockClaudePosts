# Claude Blocker

A Chrome extension that cleans up your LinkedIn feed by replacing posts mentioning “Claude” with a dark fact card and a random fun fact.

Instead of another AI hot take, you get something more useful: trivia.

## What it does

* Watches your LinkedIn feed as you scroll (including infinite scroll)
* Detects posts mentioning “Claude”
* Hides the full post body (text, reshares, images, videos, link previews, embeds)
* Replaces it with a dark fact card and a random fact
* Keeps the author header visible (profile, name, timestamp)
* Adds a “Reveal post” button in case you want to inspect the original content
* Fetches live facts from `uselessfacts.jsph.pl`
* Falls back to built-in facts if the API is slow or unavailable

## How it works

LinkedIn posts are rendered inside dynamic feed containers and re-render constantly as you scroll. This extension observes the feed in real time and:

1. Detects new posts as they load
2. Scans post text for the keyword `Claude`
3. Preserves the author row
4. Hides the rest of the post body
5. Injects a replacement card with a random fact
6. Restores the original post when “Reveal post” is clicked

The extension is built to handle:

* Infinite scroll
* Reshared posts
* Link preview cards
* Images
* Videos
* Embedded content

## Installation

1. Download or clone this repository
2. Unzip the extension folder
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer mode** (top right)
5. Click **Load unpacked**
6. Select the unzipped `claude-blocker-extension` folder
7. Open LinkedIn and scroll

Any post mentioning “Claude” will be replaced automatically.

## Example behavior

A normal LinkedIn post:

> “Claude helped me 10x my workflow…”

Becomes:

> `Claude blocked`
>
> Did you know? Scotland’s national animal is the unicorn.
>
> [Reveal post]

## Notes

LinkedIn changes its DOM structure often, and this extension depends on LinkedIn’s current feed selectors.

If LinkedIn updates their HTML class names, post detection may break. When that happens, the selectors in `content.js` will need to be updated.

The current implementation is built against LinkedIn’s 2026 feed structure, including:

* `.occludable-update`
* `.feed-shared-update-v2`
* `.feed-shared-inline-show-more-text`
* `.update-components-text`

## Known limitations

* LinkedIn DOM changes may break selectors
* Sponsored posts / ads may not always behave like standard feed posts
* Some experimental LinkedIn layouts may require selector updates

## Possible upgrades

* Block more keywords (`GPT`, `Gemini`, `Copilot`, etc.)
* Add popup stats (`Blocked 12 posts today`)
* Add temporary whitelist / pause toggle
* Add custom keyword filters
* Publish to Chrome Web Store

## Why

Because not every scroll needs another AI productivity sermon.

Sometimes it should be a fact about octopuses.
