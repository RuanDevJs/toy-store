const JSON_SERVER_API = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_JSON_SERVER_PORT}`
const BACKEND_API = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_BACKEND_PORT}`

const ENV = {
    JSON_SERVER_API,
    BACKEND_API
}

export default ENV;
