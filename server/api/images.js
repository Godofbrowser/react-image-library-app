const ImagesApi = function(client) {
    this.client = client
}

ImagesApi.prototype.getRecentUploads = function (limit = 12) {
    let url = 'images/recent'
    return this.client.get(url, {
        params: { limit, t: Date.now() }
    })
}

ImagesApi.prototype.getUserUploads = function (page = 1, perpage = 12) {
    let url = 'user/images'
    return this.client.get(url, {
        params: { page, perpage, t: Date.now() }
    })
}

ImagesApi.prototype.getAllUploads = function (page = 1, perpage = 12, search = null) {
    let url = 'images'
    return this.client.get(url, {
        params: { page, perpage, search, t: Date.now() }
    })
}

ImagesApi.prototype.upload = function (payload) {
    let url = 'images/upload'

    return this.client.post(url, payload)
}

ImagesApi.prototype.updateImage = function (id, payload) {
    let url = `image/${id}`

    let data = {}

    payload.name && (data['name'] = payload.name)
    payload.tags && (data['tags'] = payload.tags)
    payload.visibility && (data['visibility'] = payload.visibility)

    return this.client.put(url, data)
}

module.exports = ImagesApi