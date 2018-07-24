const BASE_URL = 'http://okada-images-api.devv/api'

const ImagesApi = function(client) {
    this.client = client
}

ImagesApi.prototype.getRecentUploads = function (limit = 12) {
    let url = BASE_URL + '/images/recent'
    return this.client.get(url, {
        query: { limit }
    })
}

ImagesApi.prototype.getUserUploads = function (page = 1, perpage = 12) {
    let url = BASE_URL + '/user/images'
    return this.client.get(url, {
        query: { page, perpage }
    })
}

ImagesApi.prototype.getAllUploads = function (page = 1, perpage = 12, search = null) {
    let url = BASE_URL + '/images'
    return this.client.get(url, {
        query: { page, perpage, search }
    })
}

ImagesApi.prototype.upload = function (formData) {
    let url = BASE_URL + '/images/upload';
    return this.client.post(url, formData, {
        headers: formData.getHeaders()
    })
}

module.exports = ImagesApi