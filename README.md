## Improvements

### client
1. CSRF protection on the express server
2. Improve frontend validations
3. Add visual indicator on the frontend app so user knows a server load is in progress
4. Authenticate via third party providers (eg facebook)
5. lazy load images
6. Add a nice notification system to render alerts
7. Add a nice confirmation [dialog](https://github.com/Godofbrowser/vuejs-dialog/)
8. Import configs and credentials
9. infinite scroll
9. Props validation (propTypes)

### api
1. Add uuid to models to replace publicly available ids
2. Save multiple image dimensions for faster page load
3. (Efficiency) Find a way to prevent issuing too many redundant tokens
4. Properly take care of attributes that should be hidden
5. Ability to manage uploads
6. Create separate endpoint for upload so user gets to fill in image details while upload and image processing is running in the background, before finally saving.
7. Pagination
8. Import configs and credentials
