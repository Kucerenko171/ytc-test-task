import {User} from "@/types";
import React from "react";
import { UseFieldArrayRemove, UseFieldArrayInsert, UseFormRegister } from "react-hook-form";

type Props = {
    index: number;
    register: UseFormRegister<{ users: User[] }>;
    remove: UseFieldArrayRemove;
    insert: UseFieldArrayInsert<{ users: User[] }>;
};

const styles = {
    row: {
        display: 'flex',
        flexDirection: 'row' as const,
        gap: '32px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        outline: 'none',
    },
    buttonContainer: {
        display: 'flex',
        gap: '8px',
    },
    actionButton: {
        padding: '8px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    },
};

const UserRow: React.FC<Props> = ({ index, register, remove, insert }) => {
    return (
        <div style={styles.row}>
            <div style={styles.inputContainer}>
                <input
                    {...register(`users.${index}.username`, { required: true })}
                    placeholder="Username"
                    style={styles.input}
                />
            </div>

            <div style={styles.inputContainer}>
                <input
                    {...register(`users.${index}.email`, { required: true })}
                    placeholder="Email"
                    type="email"
                    style={styles.input}
                />
            </div>

            <div style={styles.buttonContainer}>
                <button
                    type="button"
                    onClick={() => insert(index + 1, { id: 0, username: "", email: "" })}
                    style={{...styles.actionButton, color: '#3b82f6'}}
                    title="Insert Below"
                >
                    Add after
                </button>

                <button
                    type="button"
                    onClick={() => remove(index)}
                    style={{...styles.actionButton, color: '#ef4444'}}
                    title="Delete"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default UserRow;
