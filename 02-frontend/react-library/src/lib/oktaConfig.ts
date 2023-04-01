export const oktaConfig = {
    clientId:'0oa7yjz9jrcuJbXMa5d7',
    issuer:'https://dev-75842864.okta.com/oauth2/default',
    redirectUri:'https://localhost:3000/login/callback',
    scopes:['openid','profile','email'],
    pkce:true,
    disableHttpsCheck:true
}