import {
    createStore,
    applyMiddleware
} from 'redux'
import {
    composeWithDevTools
} from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const dev = process.env.NODE_ENV === 'development'

const appInitialState = {
    user: {
        authenticated: false,
        attributes: {},
        accessToken: null
    }
}

export const actionTypes = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT'
}

// REDUCERS
export const reducer = (state = appInitialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return Object.assign({}, state, {
                user: {
                    authenticated: true,
                    attributes: action.attributes,
                    accessToken: action.accessToken
                }
            })
        case actionTypes.LOGOUT:
            return Object.assign({}, state, {
                user: {
                    authenticated: false,
                    attributes: {},
                    accessToken: null
                }
            })
        default:
            return state
    }
}

// ACTIONS
export const serverRenderClock = (isServer) => dispatch => {
    return dispatch({
        type: actionTypes.TICK,
        light: !isServer,
        ts: Date.now()
    })
}

export const loginUser = (dispatch, attributes, accessToken) => {
    return dispatch({
        type: actionTypes.LOGIN,
        attributes,
        accessToken: accessToken
    })
}

export const logoutUser = dispatch => {
    return dispatch({
        type: actionTypes.LOGOUT
    })
}

const devEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));
const prodEnhancer = applyMiddleware(thunkMiddleware);
const enhancer = dev ? devEnhancer : prodEnhancer;

export function initializeStore(initialState = appInitialState) {
    return createStore(reducer, initialState, enhancer)
}