import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
const resources = {
    en: {
        translation: {
            subtitle: "A platform to connect and share",
            news: "News",
            chat: "Chat",
            share: "Share",
            cast: "Cast",
            login: "Login",
            emailLabel: "Email Address",
            passwordLabel: "Password",
            remember: "Remember Me",
            forgotPassword: "Forgot Password?",
            loginButton: "Login",
            registerPrompt: "Don't have an account?",
            register: "Register",
        },
    },
    ar: {
        translation: {
            subtitle: "منصة للتواصل والمشاركة",
            news: "الأخبار",
            chat: "الدردشة",
            share: "المشاركة",
            cast: "البث",
            login: "تسجيل الدخول",
            emailLabel: "البريد الإلكتروني",
            passwordLabel: "كلمة المرور",
            remember: "تذكرني",
            forgotPassword: "نسيت كلمة المرور؟",
            loginButton: "تسجيل الدخول",
            registerPrompt: "ليس لديك حساب؟",
            register: "إنشاء حساب",
        },
    },
    fr: {
        translation: {
            subtitle: "Une plateforme pour se connecter et partager",
            news: "Actualités",
            chat: "Discussion",
            share: "Partager",
            cast: "Diffuser",
            login: "Connexion",
            emailLabel: "Adresse e-mail",
            passwordLabel: "Mot de passe",
            remember: "Se souvenir de moi",
            forgotPassword: "Mot de passe oublié?",
            loginButton: "Connexion",
            registerPrompt: "Vous n'avez pas de compte?",
            register: "S'inscrire",
        },
    },
    // Add more languages here...
};

i18n
    .use(initReactI18next) // Integrates react-i18next
    .init({
        resources,
        lng: "en", // Default language
        fallbackLng: "en", // Fallback language if translation is missing
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
