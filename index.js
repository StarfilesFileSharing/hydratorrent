import WebTorrent from 'webtorrent'
import Hydrafiles from 'hydrafiles'

/**
 * WebTorrent Client
 * @param {Object=} opts
 */
class HydraTorrent extends WebTorrent {
    constructor (webtorrentOpts = {}, hydrafilesOpts = {}) {
        const hydrafiles = new Hydrafiles(hydrafilesOpts)
        super(webtorrentOpts)
        this.Hydrafiles = hydrafiles
    }

    /**
     * Start downloading a new torrent. Aliased as `client.download`.
     * @param {string|Buffer|Object} torrentId
     * @param {Object} opts torrent-specific options
     * @param {function=} ontorrent called when the torrent is ready (has metadata)
     */
    add (torrentId, opts = {}, ontorrent = () => {}) {
        super.add(torrentId, opts, (torrent) => {
            const webseeds = client.Hydrafiles.nodes.getNodes({ includeSelf: false }).map((node => `${node.host}/infohash/${torrent.infoHash}`))
            for (let i = 0; i < webseeds.length; i++) {
                torrent.addWebSeed(webseeds)
            }
            ontorrent(torrent)
        })
    }
    
    /**
     * Start seeding a new file/folder.
     * @param  {string|File|FileList|Buffer|Array.<string|File|Buffer>} input
     * @param  {Object=} opts
     * @param  {function=} onseed called when torrent is seeding
     */
    seed (input, opts, onseed) {
        super.seed(input, opts, (torrent) => {
            const file = torrent.files[0]
            console.log(file.path)
            onseed(torrent)
        })
    }

    async search (where, cache) {
        await this.HydraTorrent.search(where, cache)
    }
}
