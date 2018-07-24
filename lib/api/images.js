const ImagesApi = function(client) {
    this.client = client
}

ImagesApi.prototype.getRecentUploads = function (limit = 12) {
    let url ='xhr/images/recent'
    return this.client.get(url, {
        query: { limit }
    })
}

ImagesApi.prototype.getUserUploads = function (page = 1, perpage = 12) {
    let url = 'xhr/user/images'
    return this.client.get(url, {
        query: { page, perpage }
    })
}

ImagesApi.prototype.getAllUploads = function (page = 1, perpage = 12, search = null) {
    let url = 'xhr/images'
    return this.client.get(url, {
        query: { page, perpage, search }
    })
}

ImagesApi.prototype.upload = function (payload) {
    let url = 'xhr/images/upload'

    let formData = new FormData()

    formData.append('image', payload.image)
    formData.append('name', payload.name)

    return this.client.post(url, formData)
}

export default ImagesApi