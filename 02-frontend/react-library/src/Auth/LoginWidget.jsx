import { Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import OktaSignInWidget from "./OktaSignInWidget";
import { SpinnerLoader } from "../layouts/Utils/SpinnerLoader";

const LoginWidget = ({config})=>{


const {oktaAuth,authState} = useOktaAuth();

const onSuccess = (tokens)=>{
    oktaAuth.handleLoginRedirect(tokens);
}

const onError = (err)=>{
    console.log('Unable to log in!');
}

if(!authState) return <SpinnerLoader/>

return(

authState.isAuthenticated?
<Redirect to={{pathname:"/"}}/>
:
<OktaSignInWidget onError={onError} onSuccess={onSuccess} config={config}/>
)
}

export default LoginWidget;