import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
const CLIENT_ID = '323779904995-4pbai70981e06jt4l6ua6odfv1npcetp.apps.googleusercontent.com';

const GoogleAuth = () => {
    const navigate = useNavigate();
    const handleLoginSuccess = (response) => {
        const token = response.credential; // Get the token (response.credential) returned by Google
        console.log(token);
        // Send token to your Laravel backend
        fetch('https://develop.quakbox.com/admin/api/auth/google', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        })
        .then((response) => response.json())
        .then((data) => {
            const token = data.token;
            // Store the token (optional)
            localStorage.setItem("api_token", token);
            navigate("/dashboard", {});
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleLoginFailure = (error) => {
        console.error('Login failed:', error);
    };

    return (
            <div>
                <GoogleLogin
                    style={{ visibility: 'hidden' }}
                    id="google-login-button"
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    clientId={CLIENT_ID}
                    scope="email profile"
                    useOneTap
                />
            </div>
    );
};

export default GoogleAuth;
