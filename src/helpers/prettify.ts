export const prettify = (message: any) => {
    try {
        if (typeof message === 'string') {
            message = JSON.parse(message)
        }
        return JSON.stringify(message, null, 2)
    } catch (e) {
        return message
    }
}

export default prettify