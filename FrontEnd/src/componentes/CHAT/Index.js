import React from 'react';
import ChatContenedor from './ChatContenedor';
import './Index.css';

export function Index() {

    return (
        <section className="chat">
            <div id="section-diviser"></div>
            <div>
                <h1 id='titulo-chat'>Chat</h1>
            </div>
            <ChatContenedor />
        </section>
    );
}

