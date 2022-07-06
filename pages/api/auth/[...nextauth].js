import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";

const providers = [
    Providers.Credentials({
        name: "Credentials",
        authorize: async (credentials) => {
            try {
                const response = await axios.post(
                    `${process.env.HOST}/auth/login`,
                    {
                        username: credentials.username,
                        password: credentials.password,
                    }
                );
                const user = response.data;

                if (user) {
                    var dateObj = Date.now();
                    dateObj += 1000 * 60 * 60 * 24 * 3;
                    // dateObj += 1000 * 60 * 5;
                    dateObj = new Date(dateObj);
                    user.expires = dateObj;
                    return user;
                }
            } catch (e) {
                const errorMessage = e.response.data.message;
                // console.log(errorMessage);
                // Redirecting to the login page with error message          in the URL
                throw new Error(errorMessage);
            }
        },
    }),
];

const callbacks = {
    // async signIn(user, account, profile) {
    //   if (account.provider === "google" && profile.verified_email === true) {
    //     console.log(profile);
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    // Getting the JWT token from API response
    async jwt(token, user) {
        if (user) {
            token.user = user.data;
            token.user.expires = user.expires;
            token.accessToken = user.token;
            // token.user.token = user.token;
            // token.user = user;
            // token.expires = false;
        }

        return token;
    },

    async session(session, token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        return session;
    },
};

const options = {
    providers,
    callbacks,
    pages: {
        error: "/", // Changing the error redirect page to our custom login page
    },
    // session: {
    //   jwt: true,
    //   maxAge: 5, // 24 hours
    // },
    // jwt: {
    //   secret: "sdsadsad",
    // },
};

export default (req, res) => NextAuth(req, res, options);
