import {
    createStore,
    applyMiddleware
} from 'redux'
import {
    composeWithDevTools
} from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const appInitialState = {
    user: {
        authenticated: false,
        email: null,
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
                    email: action.email,
                    accessToken: action.accessToken
                }
            })
        case actionTypes.LOGOUT:
            return Object.assign({}, state, {
                user: {
                    authenticated: false,
                    email: null,
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
        email: attributes.email,
        accessToken: accessToken
    })
}

export const logoutUser = dispatch => {
    return dispatch({
        type: actionTypes.LOGOUT
    })
}

export function initializeStore(initialState = appInitialState) {
    return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}