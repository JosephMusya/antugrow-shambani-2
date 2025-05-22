import { createContext, useContext, useEffect, useState } from "react";
import type {
    AuthUser,
    FarmerProfile,
    ProviderProps,
} from "../types/Types";
import type { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import supabase from "@/config/supabase/supabase";

type UserContextType = {
    loggedIn: boolean;
    openDrawer: boolean;
    loadingUser: boolean;
    farmerProfile: FarmerProfile | undefined;
    authUser: AuthUser | User | undefined;
    toggleLogin?: (status: boolean) => void;
    toggleDrawer: (status: boolean) => void;
    logoutUser: () => void;
    updateCreditScore: (crediSize: number) => void;
    updateProfile: (profile: FarmerProfile) =>void;
};

const defaultUserContextValue: UserContextType = {
    loggedIn: false,
    openDrawer: false,
    loadingUser: true,
    farmerProfile: undefined,
    authUser: undefined,
    toggleDrawer: () => {},
    logoutUser: () => {},
    updateCreditScore: () => {},
    updateProfile: ()=>{}
};

const UserContext = createContext<UserContextType>(defaultUserContextValue);

export const UserProvider = (props: ProviderProps) => {
    const [loginState, setLoginState] = useState<boolean>(
        defaultUserContextValue.loggedIn
    );
    const [authUser, setAuthUser] = useState<AuthUser | User | undefined>();
    const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | undefined>();
    const [loadingUser, setLoadingUser] = useState<boolean>(
        defaultUserContextValue.loadingUser
    );
    const [openDrawer, setOpenDrawer] = useState<boolean>(
        defaultUserContextValue.openDrawer
    );

    const toggleDrawer = (state: boolean) => {
        setOpenDrawer(state);
    };

    const toggleLogin = (status: boolean) => {
        setLoginState(status);
    };

    const getFarmerProfileById = async (id: string) => {
        const { data, error } = await supabase
            .from("farmers")
            .select("*")
            .eq("user_id", id)
            .single();

        if (error) {
            console.error("Error fetching farmer information:", error.message);
            return null;
        }
        setFarmerProfile(data);
    };

    const updateProfile = (profileInformation: FarmerProfile)  => {
        setFarmerProfile((prev)=>({
            ...prev!,
            ...profileInformation
        }))
    }

    const authChange = async() => {
        setLoadingUser(true);
        try {
            const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log(event);
                if (event === "SIGNED_IN" || event === "USER_UPDATED" ||  event==="INITIAL_SESSION") {

                    // const authDetails: AuthUserDetails = {
                    //     token: session?.access_token,
                    //     expires_at: session?.expires_at,
                    //     expires_in: session?.expires_in,
                    //     refresh_token: session?.refresh_token,
                    // };

                    // storeToken(JSON.stringify(authDetails));
                    setAuthUser(session?.user);
                    getFarmerProfileById(session?.user.id ?? "");
                    
                } else if (event === "SIGNED_OUT") {
                    // removeToken("token");
                    setAuthUser(undefined);
                    setFarmerProfile(undefined);
                }
            }
        );
        return () => {
            authListener?.subscription?.unsubscribe();
        };
        } finally{
            setLoadingUser(false);
        }
    };

    const updateCreditScore = async (creditSize: number) => {

        console.log("Updating user with credit size of -> ", creditSize);

        if (!authUser?.id) {
            console.error("No user ID found in localStorage.");
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from("farmers")
            .select("credit")
            .eq("user_id", authUser?.id)
            .single();

        if (profileError) {
            console.error("Error fetching profile:", profileError.message);
            return;
        }

        let currentCredit = profile?.credit || 300;

        // Ensure the base starts at 300
        if (currentCredit < 300) {
            currentCredit = 300;
        }

        // Add the provided creditSize
        let updatedCredit = currentCredit + creditSize;

        // Cap the credit at 800
        if (updatedCredit > 800) {
            updatedCredit = 800;
        }

        const { error: updateError } = await supabase
            .from("farmers")
            .update({ credit: updatedCredit })
            .eq("user_id", authUser?.id);

        if (updateError) {
            console.error("Error updating credit score:", updateError.message);
        } else {
            console.log("Credit score updated to", updatedCredit);
            setFarmerProfile((prev) => ({
                ...prev!,
                credit: updatedCredit,
            }));
        }
    };

    const logoutUser = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw new Error(error.message);
            }
            toast.success("You have been logged out!");
        } catch (error) {
            console.error(error);
        } finally {
        }
    };

    useEffect(() => {
        authChange();
    }, []);

    const contextValues: UserContextType = {
        loggedIn: loginState,
        openDrawer,
        loadingUser,
        farmerProfile,
        authUser,
        updateCreditScore,
        toggleDrawer,
        toggleLogin,
        logoutUser,
        updateProfile,
    };

    return (
        <UserContext.Provider value={contextValues}>
            {props.children}
        </UserContext.Provider>
    );
};

export function useUserContext() {
    return useContext(UserContext);
}
