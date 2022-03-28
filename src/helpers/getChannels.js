import axios from "axios";

const api = process.env.REACT_APP_API

export const getChannels = async() => {
    const URL = `${api}ibc/core/channel/v1/channels?pagination.limit=1000`
    const res = await axios.get(URL)
    if ( res.status !== 200) return
    return res.data
}

export const getClientState = async(channel_id) => {
    const URL = `${api}ibc/core/channel/v1/channels/${channel_id}/ports/transfer/client_state`
    const res = await axios.get(URL)
    if ( res.status !== 200) return
    return res.data
}