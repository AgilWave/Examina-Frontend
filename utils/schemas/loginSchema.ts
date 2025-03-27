const loginSchema = {
    email: {
        type: "string",
        required: true,
        email: true,
        message: "Please enter a valid email address",
    },
    password: {
        type: "string",
        required: true,
        min: 6,
        message: "Password must be at least 6 characters long",
    },
};

export default loginSchema;
export type LoginSchema = typeof loginSchema;