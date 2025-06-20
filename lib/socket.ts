import { io } from "socket.io-client";
import { BACKEND_URL } from '@/Constants/backend';

const socket = io(BACKEND_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 10000,
    reconnectionDelayMax: 50000,
});

export default socket;