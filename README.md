# HydraTorrent
This is an experimental integration of (the also experimental) [Hydrafiles](https://github.com/StarfilesFileSharing/Hydrafiles/) and BitTorrent/WebTorrent P2P networks.

Some enhancements this integration would make possible include:
1. Torrent Privacy: Leechers and Seeders gain plausible deniability over their involvement with any specific Torrent.
2. Torrent Network Health: Seeders can opt into donating storage to keep less popular torrents alive with any spare storage they have.
3. Torrent Indexing: Clients exchange metadata about individual files allowing nodes to build a searchable index of files in the network.
4. Find Similar Torrents: If leeching a dead torrent, client automatically find other infohashes in index that contain the same file.
5. Webseeds (Half Done): Clients can optionally act as webseeds, ~~with known Hydrafiles peers automatically added as webseeds on all torrents~~.

HydraTorrent extends WebTorrent, with no breaking changes to existing APIs. This allows existing codebases to use HydraTorrent by replacing only 2 lines.

## Usage

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
A second object can now be passed in, defining custom [Hydrafiles config](https://github.com/StarfilesFileSharing/Hydrafiles/wiki/Configuration).

Before
```js
const client = new WebTorrent({})
```
After
```js
const client = new HydraTorrent({}, {})
```
### Hydrafiles Object
A `Hydrafiles` object is accessible on the HydraTorrent class. This can be used to directly interact with the Hydrafiles network.

Before
```js
const client = new WebTorrent()
console.log(client.Hydrafiles === undefined) // true
```

After
```js
const client = new HydraTorrent()
console.log(client.Hydrafiles === undefined) // false
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
- Runs `hydrafiles.nodes.getNodes()` and adds all nodes as webseeds

Planned:
- Check for SHA256 in Hydrafiles and try download that
- Find other infohashes for SHA256 and add those

### client.seed()
Planned:
- Pass file to Hydrafiles & seed
