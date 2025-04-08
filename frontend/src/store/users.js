import { create } from "zustand";

export const useUserStore = create((set)=>{
    return ({
        users: [],
        setUsers: (users) => set({ users }),
        createUser: async (newUser) => {
            if (!newUser.username || !newUser.email || !newUser.phone || !newUser.password) {
                return { success: false, message: "Please fill all fields" };
            }
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
            const data = await res.json();
            set((state) => ({ users: [...state.users, data.user] }));
            return { success: true, message: "User created successfully" };
        },

        fetchUsers: async () => {
            const res = await fetch("/api/users/getAllUsers");
            const data = await res.json();
            set({ users: data });
        },

        deleteUser: async (id) => {
            const res = await fetch(`/api/users/deleteUser/${id}`, { method: "DELETE" }); 
            const data = await res.json();
        
            if (!data.success) {
                return { success: false, message: data.message };
            }
        
            set(state => ({ users: state.users.filter(user => user._id !== id) }));
        
            return { success: true, message: data.message };
        },
    });
})