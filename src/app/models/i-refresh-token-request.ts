export interface IRefreshTokenRequest {
    client_id: string,
    grant_type: string,
    refresh_token: string,
    client_secret: string
}