import { bindEventListener } from "./util/events";

// Check that service workers are registered
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    bindEventListener(window, 'load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(function (reg) {
                console.log('sw registered')
            })
            .catch(function (e) {
                console.error('sw registration failed:', e)
            })
    })
}