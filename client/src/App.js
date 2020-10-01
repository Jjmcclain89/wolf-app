import React, { useEffect } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Head from './components/Head';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

function App() {
    const client = new W3CWebSocket('ws://localhost:1337');

    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        
        client.onmessage = (message) => {
            console.log(message);
        };
    }, [client.onopen, client.onmessage]);

    return (
        <>
            <Head />
            <div className='App'>
                <Form className='col col-xs-12 col-4'>
                    <Form.Group>
                        <Form.Label> Name </Form.Label>
                        <Form.Control type='text' placeholder='Name' />
                    </Form.Group>
                    <Button> Join Game </Button>
                </Form>
            </div>
        </>
    );
}

export default App;
