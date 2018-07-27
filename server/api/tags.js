const Api = function(client) {
    this.client = client
}

Api.prototype.getAllTags = function (limit = 25) {
    let url = 'tags'
    return this.client.get(url, {
        params: { limit, t: Date.now() }
    })
}

Api.prototype.getTagImages = function (slug, page = 1, perpage = 12) {
    let url = `tag/${slug}/images`
    return this.client.get(url, {
        params: { page, perpage, t: Date.now() }
    })
}

module.exports = Api