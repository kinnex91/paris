import React from 'react';
import '../css/style.css'; 

function AboutPage() {
    return (
        <>

          
    <div class="about-container">
        <h2>À propos de notre plateforme</h2>
        <p>
            Bienvenue sur notre plateforme de paris sportifs. Nous proposons un espace pour les passionnés de sport qui souhaitent parier sur leurs équipes et événements sportifs préférés.
        </p>
        <h3>Disclaimer</h3>
        <p class="disclaimer">
            <strong>Attention :</strong> Cette plateforme ne propose pas de jeux d'argent. Les paris effectués ici ne sont pas associés à des gains financiers réels.
            Conformément à la législation française, les jeux d'argent en ligne sont strictement réglementés. Ce site est destiné uniquement à des fins de divertissement.
            Aucun échange d'argent ou de gains monétaires n'est proposé ici.
        </p>
        <p>
            Nous vous remercions de respecter cette règle pour éviter tout problème légal et pour profiter d'une expérience de pari sans risque.
        </p>

       
        <div class="linkedin-container">
            <a href="https://www.linkedin.com/in/emmanuel-frenot-ef75000123456789abc-senior-edf-java-it-project-manager-france-arkance-systems-com-fr/" target="_blank" class="linkedin-button">
                Voir mon profil LinkedIn
            </a>
        </div>
    </div>
        </>
    );
}

export default AboutPage;
