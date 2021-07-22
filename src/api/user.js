import fetch from '../utils/fetch'

const GET_CODE = "/v1/user/code"
const LOGIN = "/v1/user/login"
const SET_NICK_NAME = "/v1/user/name"


export const getCode = () => {
    return fetch({
        url: GET_CODE,
        method: "GET"
    })
}

export const login = (code) => {
    return fetch({
        url: LOGIN + "?code=" + code,
        method: "GET"
    })
}

export const setNickName = (data) => {
    return fetch({
        url: SET_NICK_NAME,
        method: "PUT",
        data
    })
}