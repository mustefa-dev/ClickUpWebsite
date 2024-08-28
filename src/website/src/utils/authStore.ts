import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type TUserInfo = {
    accessToken: string;
    refreshToken: string;
    username: string;
    firstName: string;
    lastName: string;
    id: string;
};

const initialAuthValue: { userInfo: TUserInfo | null } = {
    userInfo: null,
};

export class AuthStore {
    static State = create<typeof initialAuthValue>()(
        persist(
            immer(() => initialAuthValue),
            { name: "user-info" },
        ),
    );

    static onLogin = (payload: TUserInfo) => {
        AuthStore.State.setState(() => ({ userInfo: payload }));
        window.location.href = "/";
    };

    static onLogout = () => {
        AuthStore.State.setState(() => ({ userInfo: null }));
        window.location.href = "/";
    };
    static getAccessToken = () => {
        return AuthStore.State.getState()?.userInfo?.accessToken;
    };
}
