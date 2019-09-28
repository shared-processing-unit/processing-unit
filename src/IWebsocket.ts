export interface IWebsocket {
    onopen: (ev: Event) => any
    send: (message: string) => void
    onmessage: ({ data: string }) => void
}
