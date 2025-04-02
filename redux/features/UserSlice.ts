"use client";

import { createSlice } from "@reduxjs/toolkit";
import { AdminInteract } from "@/types/adminUser";

const initialState: AdminInteract = {
    createUser: {
        email: "",
        name: "",
        role: "",
        username: "",
    },
    viewUser: {
        id: -1,
        email: "",
        name: "",
        role: "",
        username: "",
        createdAt: "",
        updatedAt: "",
        isBlacklisted: false,
        createdBy: "",
        updatedBy: "",
        blackelistedReason: "",
    },
    editBlocked: true,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

        // Create User
        setCreateUserDefault: (state) => {
            state.createUser = initialState.createUser;
        },
        setCreateUser : (state, action) => {
            state.createUser = action.payload;
        },
        setCreateUsername: (state, action) => {
            state.createUser.username = action.payload;
        },
        setcreateName: (state, action) => {
            state.createUser.name = action.payload;
        },
        setcreateUserEmail: (state, action) => {
            state.createUser.email = action.payload;
        },
        setcreateRole: (state, action) => {
            state.createUser.role = action.payload;
        },


        // View User
        setEditBlocked: (state, action) => {
            state.editBlocked = action.payload;
        },
       
        setviewUser: (state, action) => {
            state.viewUser = action.payload;
        },
        setviewUserDefault: (state) => {
            state.viewUser = initialState.viewUser;
        },

        setViewEmail: (state, action) => {
            state.viewUser.email = action.payload;
        },
        setViewName: (state, action) => {
            state.viewUser.name = action.payload;
        },
        setViewRole: (state, action) => {
            state.viewUser.role = action.payload;
        },

    },
});

export const {
    // Create User
    setCreateUsername,
    setcreateName,
    setcreateUserEmail,
    setcreateRole,
    setCreateUserDefault,
    setCreateUser,

    // View User
    setEditBlocked,
    setviewUser,
    setViewEmail,
    setViewName,
    setViewRole,
    setviewUserDefault
} = userSlice.actions;
export default userSlice.reducer;
