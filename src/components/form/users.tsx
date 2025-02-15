import {useUsers} from "@/lib/hooks/use-users";
import {UserFormSchema, userSchema} from "@/lib/validation/user-schema";
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { User } from '@/types';
import { saveUsers, deleteUser } from '@/api/users';
import UserRow from '../user-row';
import { zodResolver } from '@hookform/resolvers/zod';

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    addButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
    },
    submitButton: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '24px',
    },
    alert: {
        padding: '12px',
        marginBottom: '16px',
        borderRadius: '4px',
    },
    successAlert: {
        backgroundColor: '#86efac',
        color: '#166534',
    },
    errorAlert: {
        backgroundColor: '#fecaca',
        color: '#991b1b',
    },
};

const UserForm: React.FC = () => {
    const { users, setUsers } = useUsers();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const { register, control, handleSubmit, formState: { errors, isValid }, reset } = useForm<UserFormSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: { users },
        mode: "onChange"
    });

    const { fields, prepend, insert, remove } = useFieldArray({ control, name: "users" });

    useEffect(() => {
        reset({ users });
    }, [users, reset]);

    const onSubmit = async (data: { users: User[] }) => {
        try {
            setIsSubmitting(true);
            const updatedUsers = await saveUsers(data.users);
            setUsers(updatedUsers);
            setAlert({ type: 'success', message: 'Users saved successfully' });
        } catch (error) {
            console.error('Failed to save users:', error);
            setAlert({ type: 'error', message: 'Failed to save users' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setAlert(null), 3000);
        }
    };

    const handleDeleteUser = async (index: number | number[] | undefined) => {
        try {
            const actualUserId = users[index as number]?.id;

            if (!actualUserId) {
                remove(index);
                return;
            }

            await deleteUser(actualUserId);
            remove(index);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== actualUserId));
            setAlert({ type: 'success', message: 'User deleted successfully' });
        } catch (error) {
            console.error('Failed to delete user:', error);
            setAlert({ type: 'error', message: 'Failed to delete user' });
        } finally {
            setTimeout(() => setAlert(null), 3000);
        }
    };

    return (
        <div style={styles.container}>
            {alert && (
                <div style={{
                    ...styles.alert,
                    ...(alert.type === 'success' ? styles.successAlert : styles.errorAlert)
                }}>
                    {alert.message}
                </div>
            )}

            {fields.map((field, index) => (
                <div key={field.id}>
                    {errors.users?.[index]?.username && (
                        <div style={{ ...styles.alert, ...styles.errorAlert }}>
                            {errors.users[index]?.username?.message}
                        </div>
                    )}
                    {errors.users?.[index]?.email && (
                        <div style={{ ...styles.alert, ...styles.errorAlert }}>
                            {errors.users[index]?.email?.message}
                        </div>
                    )}
                </div>
            ))}

            <div style={styles.header}>
                <h2 style={styles.title}>Users</h2>
                <button
                    type="button"
                    onClick={() => prepend({id: 0, username: "", email: ""})}
                    style={styles.addButton}
                >
                    Add New
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                {fields.map((field, index) => (
                    <UserRow
                        key={field.id}
                        index={index}
                        register={register}
                        remove={(index) => handleDeleteUser(index)}
                        insert={insert}
                    />
                ))}

                <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    style={{
                        ...styles.submitButton,
                        backgroundColor: !isSubmitting && isValid ? '#22c55e' : '#d1d5db',
                        color: !isSubmitting && isValid ? 'white' : '#6b7280',
                        cursor: !isSubmitting && isValid ? 'pointer' : 'not-allowed',
                    }}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default UserForm;
