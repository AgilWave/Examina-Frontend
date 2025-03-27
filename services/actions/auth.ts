'use server';

export async function loginAction(credentials: { username: string, password: string }) {
    const { username, password } = credentials;
    
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock response
    if (username === 'admin' && password === 'password') {
        return { success: true, message: 'Login successful' };
    } else {
        return { success: false, message: 'Invalid username or password' };
    }
}