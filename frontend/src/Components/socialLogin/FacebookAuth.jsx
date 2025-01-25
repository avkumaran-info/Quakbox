import React from "react";
import FacebookLogin from "react-facebook-login";
import { useNavigate } from "react-router-dom";

const FacebookSignIn = () => {
    const navigate = useNavigate();
    const responseFacebook = (response) => {
        if (response.accessToken) {
            // Send the access token to your backend
            fetch("https://develop.quakbox.com/admin/api/auth/facebook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: response.accessToken,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    const token = data.token;
                    // Store the token (optional)
                    localStorage.setItem("api_token", token);
                    navigate("/dashboard", {});
                })
                .catch((error) => {
                    console.error("Error from backend:", error);
                });
        } else {
            console.error("Facebook login failed:", response);
        }
    };

    return (
        <div style={{ textAlign: "center", width: "450px" }}>
            <FacebookLogin
                appId="1280230076561631"
                fields="name,email,picture"
                callback={responseFacebook}
                icon="fa-facebook"
                textButton="Continue with Facebook"
            />
        </div>
    );
};

export default FacebookSignIn;
