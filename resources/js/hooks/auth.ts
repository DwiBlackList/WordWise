import { useEffect, useState } from "react";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/data/users/login");
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };

        fetchUser();
    }, []);

    return { user };
};
