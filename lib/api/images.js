const ImagesApi = function(client) {
    this.client = client
}

ImagesApi.prototype.getRecentUploads = function (limit = 12) {
    let url ='xhr/images/recent'
    return this.client.get(url, {
        params: { limit, t: Date.now() }
    })
}

ImagesApi.prototype.getUserUploads = function (page = 1, perpage = 12) {
    let url = 'xhr/user/images'
    return this.client.get(url, {
        params: { page, perpage, t: Date.now() }
    })
}

ImagesApi.prototype.getAllUploads = function (page = 1, perpage = 12, search = null) {
    let url = 'xhr/images'
    return this.client.get(url, {
        params: { page, perpage, search, t: Date.now() }
    })
}

ImagesApi.prototype.upload = function (payload) {
    let url = 'xhr/images/upload'

    let formData = new FormData()

    formData.append('image', payload.image)
    formData.append('name', payload.name)

    return this.client.post(url, formData)
}

ImagesApi.prototype.updateImage = function (id, payload) {
    let url = `xhr/image/${id}`

    let data = {}

    payload.name && (data['name'] = payload.name)
    payload.tags && (data['tags'] = payload.tags)
    payload.visibility && (data['visibility'] = payload.visibility)

    return this.client.put(url, data)
}

ImagesApi.prototype.submitRating = function (id, value) {
    let url = `xhr/image/${id}/rating`

    let data = {value}

    return this.client.post(url, data)
}

export default ImagesApi