const routes = require('next-routes')

module.exports = routes()
.add('index')
.add({name: 'tag.images', pattern: '/tag/:slug/images', page: 'tag-images'})
