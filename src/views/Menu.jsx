import React from 'react';
import '../css/style.css';

function Menu() {
    return (
        <>
           
            <nav className  ="navbar centerAPPBodyPanel">
                <ul>
                    <li><a href="/login">Connexion</a></li>
                    <li><a href="/signup">Inscription</a></li>
                    <li><a href="/about">À propos</a></li>
                    <li><a href="/metrics">Metriques Web</a></li>
                </ul>
            </nav>

        </>
    );
}

export default Menu;
