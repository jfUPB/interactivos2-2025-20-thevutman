# **Unidad 3**

## 🔎 Fase: Set + Seek

### **Actividad 1**
#### **Diagrama de Bloques**

#### **Paso a Paso**
1. Se ingresan a los links de mobile y desketop
2. Estos establecen una conexion con un servidor 
3. El sketch de mobile guarda la posicio  de touch en la pantalla y se normalizan al tamaño del canvas
4. El mobile emite un mensaje atravez de socket con las cordenadas anteriormente recibidas
5. El servidor recibe este mensaje y se encarga de enviarlo o a todos o a alguno en especifico
6. El servidor al emitir se encarga de enviar el mensaje con los daots
7. El desktop con p5 recibe estos datos y actualiza con el draw la posicion del circulo rojo con los recibidos por el mensaje enviador por el servidor
   
### **Actividad 2**
#### **Video YouTube**
[Código Muestra](https://youtu.be/T1bYGf-kiOI?si=v7O-9D8Cv1Lo1GYU)
#### **Desktop Application**
``` js
const socket = io();

socket.on('connect', () => {
    console.log('Cliente escritorio conectado');
    // Simula envío de datos
    setInterval(() => {
        const data = {
            type: 'desktop',
            value: Math.random()
        };
        socket.emit('message', data);
        console.log('Enviado:', data);
    }, 3000);
});
```
#### **Mobile Application**
``` js
const socket = io();

socket.on('connect', () => {
    console.log('Cliente móvil conectado');
    // Simula envío de datos touch
    setInterval(() => {
        const touchData = {
            type: 'touch',
            x: Math.floor(Math.random() * 300),
            y: Math.floor(Math.random() * 400)
        };
        socket.emit('message', touchData);
        console.log('Enviado:', touchData);
    }, 2000);
});
```
#### **Visual Application**
``` js
const socket = io();

socket.on('connect', () => {
    console.log('Visuales conectado al servidor');
});

socket.on('message', (data) => {
    console.log('Datos recibidos en visuales:', data);
});

socket.on('disconnect', () => {
    console.log('Visuales desconectado del servidor');
});
```
#### **Server Application**
``` js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app); 
const io = socketIO(server); 
const port = 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('message', (message) => {
        console.log(`Received message => ${message}`);
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
```
