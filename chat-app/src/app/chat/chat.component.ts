import { Component, OnInit } from '@angular/core';

interface ChatMessage {
    sender: string;
    content: string;
}

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    messages: ChatMessage[] = [];
    newMessage: string = '';
    socket: WebSocket = new WebSocket('ws://localhost:3000');

    ngOnInit() {
        this.connectToWebSocket();
    }

    private connectToWebSocket() {
        this.socket = new WebSocket('ws://localhost:3000');
        this.socket.addEventListener('open', () => {
            console.log('WebSocket connection established.');
        });

        this.socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data) as { type: string, data: ChatMessage };

            if (message.type === 'messages') {
                // Received existing messages
                this.messages = Array(message.data);
            } else if (message.type === 'message') {
                // Received a new message
                this.messages.push(message.data);
            }
        });

        this.socket.addEventListener('close', () => {
            console.log('WebSocket connection closed. Retrying in 3 seconds...');
            setTimeout(() => {
                console.log('Hi')
                this.connectToWebSocket(); // Retry connection after 3 seconds
            }, 3000);
        });
    }

    public getMessageGroupClass(index: number) {
        const message = this.messages[index];
        const previousMessage = this.messages[index - 1];
        if (previousMessage && previousMessage.sender === message.sender) {
            return 'message-group';
        }
        return '';
    }

    public shouldDisplaySenderName(index: number) {
        const message = this.messages[index];
        const previousMessage = this.messages[index - 1];
        return !previousMessage || previousMessage.sender !== message.sender;
    }

    public sendMessage() {
        if (this.newMessage) {
            console.log(this.newMessage)
            const message: ChatMessage = {
                sender: 'Me',
                content: this.newMessage
            };
            this.socket.send(JSON.stringify(message));
            this.messages.push(message);
            this.newMessage = '';
        }
    }
}
