import * as signalR from '@microsoft/signalr';
import { MessageType } from '../Types/123types';

const HUB_URL = process.env.REACT_APP_HUB_URL;
let connection: signalR.HubConnection | null = null;

// ממתין לחיבור יציב לפני Invoke
const waitForConnection = async (timeout = 5000) => {
    const start = Date.now();
    while (connection && connection.state !== signalR.HubConnectionState.Connected) {
        if (Date.now() - start > timeout) {
            throw new Error('Timeout waiting for SignalR connection');
        }
        await new Promise((res) => setTimeout(res, 100)); // sleep 100ms
    }
};

// קריאה בטוחה ל-invoke עם המתנה לחיבור
const safeInvoke = async (methodName: string, ...args: any[]) => {
    args.map((arg) => console.log(typeof(arg)));
    if (!connection) throw new Error('SignalR connection is not initialized');
    await waitForConnection();
    console.log('Invoking:', methodName, args);
    
    return connection.invoke(methodName, ...args);
};

// יצירת חיבור ל-SignalR
export const startChatConnection = async (
    userId: number,
    exchangeId: number,
    onReceive: (msg: MessageType) => void
) => {
    console.log(1, '\nStarting SignalR connection...');

    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No auth token found in localStorage');
        alert('No authentication token found.');
        return;
    }

    const connectionUrl = `${HUB_URL}`;
    console.log(2.5, 'connectionUrl:', connectionUrl);

    connection = new signalR.HubConnectionBuilder()
        .withUrl(connectionUrl, {
            accessTokenFactory: () => token,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

    connection.on('ReceiveMessage', (fromId: number, text: string, time: string) => {
        onReceive({ fromId, text, time });
    });

    connection.onclose((error) => {
        console.error('SignalR connection closed:', error);
    });

    connection.onreconnected(async () => {
        console.log('Reconnected to SignalR. Rejoining the chat...');
        try {
            await safeInvoke('Join', userId, exchangeId);
            console.log('Rejoined chat successfully');
        } catch (err) {
            console.error('Failed to re-Join after reconnect:', err);
        }
    });

    try {
        console.log(11, 'Attempting to connect...');
        await connection.start();
        console.log(22, 'Connected. State:', connection.state);
        console.log('userid', userId);
        console.log('exchangeId', exchangeId);
        
        await safeInvoke('Join', parseInt(userId.toString()), parseInt(exchangeId.toString()));
        console.log(33, 'Joined chat');

    } catch (err: unknown) {
        console.error('Failed :', err);
        //alert(`Failed to connect to the chat server. Please check your connection.\nError: ${err instanceof Error ? err.message : String(err)}`);
    }
};

// שליחת הודעה
export const sendMessage = async (exchangeId: number, userId: number, text: string) => {
    console.log('Sending message:', { exchangeId, userId, text });
    try {
        await safeInvoke('SendMessage', parseInt(exchangeId.toString()), parseInt(userId.toString()), text);
        console.log('Message sent successfully');
    } catch (err) {
        console.error('Failed to send message:', err);
    }
};

// ניתוק חיבור
export const stopChatConnection = async () => {
    if (connection) {
        try {
            await connection.stop();
            console.log('SignalR connection stopped');
        } catch (err) {
            console.error('Failed to stop SignalR connection:', err);
        }
    }
};
