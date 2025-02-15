import {User} from "@/types";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = async (): Promise<User[]> => {
    const { data } = await axios.get<User[]>(API_URL);
    return data.map(({ id, username, email }) => ({ id, username, email }));
};

//This end point doesn't work actually. But it's an example how it could looks like
export const saveUsers = async (users: User[]): Promise<User[]> => {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(users),
    });
    
    if (!response.ok) {
        throw new Error('Failed to save users');
    }
    
    return response.json();
};

//This end point doesn't work actually. But it's an example how it could looks like
export const deleteUser = async (userId: number): Promise<void> => {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
};
