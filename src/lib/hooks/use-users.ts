import {fetchUsers} from "@/api/users";
import {User} from "@/types";
import { useEffect, useState } from "react";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers().then(setUsers);
    }, []);

    const addUser = (newUser: User) => setUsers(prev => [newUser, ...prev]);

    const addUserAfter = (index: number, newUser: User) => {
        setUsers(prev => {
            const updated = [...prev];
            updated.splice(index + 1, 0, newUser);
            return updated;
        });
    };

    const removeUser = (index: number) => {
        setUsers(prev => prev.filter((_, i) => i !== index));
    };

    return { users, setUsers, addUser, addUserAfter, removeUser };
};
