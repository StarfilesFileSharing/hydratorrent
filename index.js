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
        super.add(torrentId, opts, async (torrent) => {
            const nodes = client.Hydrafiles.nodes.getNodes({ includeSelf: false })
            const webseeds = nodes.map((node => `${node.host}/infohash/${torrent.infoHash}`))
            for (let i = 0; i < webseeds.length; i++) {
                torrent.addWebSeed(webseeds)
            }
            let files = await this.search({ where: { infohash: torrent.infoHash } }, false)
            for (let i = 0; i < files.length; i++) {
                files = [...files, await this.search({ where: { hash: files[i].hash } }, false)]
            }
            for (let i = 0; i < files.length; i++) {
                const file = await this.Hydrafiles.FileHandler.init(files[0], this.Hydrafiles)
                const webseeds = [...nodes.map((node => `${node.host}/sha256/${file.hash}`)), ...nodes.map((node => `${node.host}/infohash/${file.infohash}`))]
                for (let i = 0; i < webseeds.length; i++) {
                    torrent.addWebSeed(webseeds[i])
                }
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
