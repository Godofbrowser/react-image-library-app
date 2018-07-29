export const bindEventListener = (root, eventName, cb) => {
    if (root.addEventListener) {
        root.addEventListener(eventName, cb)
    } else {
        root.attachEvent(`on${eventName}`, cb)
    }
}