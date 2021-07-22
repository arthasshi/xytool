import fetch from '../utils/fetch'

const STATIS = '/v1/statis/'
const TOTAL = '/v1/statis/total/'
const RANK = '/v1/statis/rank'

export const AddSi = (uid, data) => {
    return fetch({
        url: STATIS + uid,
        method: "POST",
        data
    })
}

export const GetSis = (uid, type, page, size) => {
    return fetch({
        url: STATIS + `${uid}/${type}/${page}/${size}`,
        method: "GET"
    })
}

export const getSisByUid = (uid) => {
    return fetch({
        url: STATIS + `${uid}`,
        method: "GET"
    })
}

export const getTotalByUid = (uid) => {
    return fetch({
        url: TOTAL + uid,
        method: "GET"
    })
}

export const getRank = () => {
    return fetch({
        url: RANK,
        method: "GET"
    })
}