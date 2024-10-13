<div align="center">
  <h1>HydraTorrent</h1>
  <p>A (backwards compatible) replacement of <a href="https://github.com/webtorrent/webtorrent">WebTorrent</a> integrating the <a href="https://github.com/StarfilesFileSharing/Hydrafiles">Hydrafiles</a> and BitTorrent/WebTorrent P2P networks.</p>
  <p>HydraTorrent wraps WebTorrent, hooking into certain methods enabling Hydrafiles functionality.</p>
</div>

## Features
Some enhancements this integration would make possible include:
1. **Torrent Privacy**: Leechers and Seeders gain plausible deniability over their involvement with any specific Torrent.
2. **~~Improves Torrent Network Health~~** (Finished): Seeders can opt into donating storage to keep less popular torrents alive with any spare storage they have.
3. **~~Torrent Indexing~~** (Finished): Clients exchange metadata about individual files allowing nodes to build a searchable index of files in the network.
4. **~~Find Similar Torrents~~** (Finished): If leeching a dead torrent, client automatically find other infohashes in index that contain the same file.
5. **Webseeds** (Half Finished): Clients can optionally act as webseeds, ~~with known Hydrafiles peers automatically added as webseeds on all torrents~~.

HydraTorrent extends WebTorrent, with no breaking changes to existing APIs. This allows existing codebases to use HydraTorrent by replacing only 2 lines.

## Usage
HydraTorrent is under heavy development and not production ready.

### Before
```js
import WebTorrent from 'webtorrent'
const client = new WebTorrent()

client.seed('08ada5a7a6183aae1e09d831df6748d566095a10')
```

### After
```js
import HydraTorrent from 'hydratorrent'
const client = new HydraTorrent()

client.seed('08ada5a7a6183aae1e09d831df6748d566095a10')
```

## Non-Breaking API Changes
### Global Config
A second object can optionally be passed, defining custom [Hydrafiles config](https://github.com/StarfilesFileSharing/Hydrafiles/wiki/Configuration).

```js
const client = new HydraTorrent({ /* WebTorrent Config */ }, { /* Hydrafiles Config */ })
```
### Hydrafiles Object
A `Hydrafiles` object is accessible on the HydraTorrent class. This can be used to directly interact with the Hydrafiles network.

```js
const client = new HydraTorrent()
const hydrafilesClient = client.Hydrafiles
```

### Search Method
```js
const client = new HydraTorrent()
const files = await client.search({ where: { name: 'i-am-spartacus-its-me.gif' } })
```

## Hooks
### new WebTorrent()
- Creates `new Hydrafiles()`

### client.add() -> callback()
- Runs `hydrafiles.nodes.getNodes()` and adds all nodes as webseeds using `torrent.addWebSeed()`
- Runs `hydrafiles.search()` to find all SHA256 files for infohash and adds all nodes as webseeds using `torrent.addWebSeed()`
- Runs `hydrafiles.search()` to find all infohashes for SHA256 and adds all nodes as webseeds using `torrent.addWebSeed()`

Planned:
- Run `hydrafiles.FileHandler.getFile()` and pipe to torrent to eventually remove `torrent.addWebSeed()` hook calls (and move `hydrafiles.search()` logic to Hydrafiles lib)

### client.seed()
Planned:
- Run `hydrafiles.FileHandler.cacheFile()`
