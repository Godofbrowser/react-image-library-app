module.exports = {
    ROUTES: {
        home: '/',
        auth: {
            register: '/auth/register',
            login: '/auth/login',
            logout: '/auth/logout'
        },
        app: {
            dashboard: '/dashboard',
            upload: '/upload',
            images: '/images',
            tags: '/tags',
            tagImages: '/tag/:id/images'
        }
    }
}