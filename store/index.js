import {
    createStore,
    applyMiddleware
} from 'redux'
import {
    composeWithDevTools
} from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { toast } from 'react-toastify';
import api from '../lib/api'

const dev = process.env.NODE_ENV === 'development'

const appInitialState = {
    user: {
        authenticated: false,
        attributes: {},
        accessToken: null
    },
    ratingDialog: {
        isOpen: false,
        image: null
    }
}

export const actionTypes = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    RATING_SUCCESS: 'RATING_SUCCESS',
    SHOW_RATING_DIALOG: 'SHOW_RATING_DIALOG'
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
        case actionTypes.SHOW_RATING_DIALOG:
            return Object.assign({}, state, {
                ratingDialog: {
                    isOpen: action.status === null 
                        ? !state.ratingDialog.isOpen 
                        : !!action.status,
                    image: action.image
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

export const toggleRatingDialog = (status = null, image = null) => {
    return {
        type: actionTypes.SHOW_RATING_DIALOG,
        status,
        image
    }
}

export const submitRating = (dispatch, value) => {
    api.images.submitRating(value)
    .then(resp => {
        toast.success(resp.data.info || 'Your rating has been saved')
        // dispatch(ratingSuccess(resp.data.data.id))
    })

    return {
        type: actionTypes.SHOW_RATING_DIALOG,
        status: false,
        image: null
    }
}

const devEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));
const prodEnhancer = applyMiddleware(thunkMiddleware);
const enhancer = dev ? devEnhancer : prodEnhancer;

export function initializeStore(initialState = appInitialState) {
    return createStore(reducer, initialState, enhancer)
}