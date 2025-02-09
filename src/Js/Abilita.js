import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Layout/Abilita.css';

const Abilita = () => {
    const navigate = useNavigate();
    const { name } = useParams();
    const [ability, setAbility] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Effettua una richiesta alla PokeAPI per ottenere i dettagli dell'abilità
        fetch(`https://pokeapi.co/api/v2/ability/${name}`)
            .then(response => {
                // Controlla se la risposta è valida
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Imposta i dati dell'abilità nello stato
                setAbility({
                    ...data,
                    description: data.flavor_text_entries.find(
                        entry => entry.language.name === "en"
                    )?.flavor_text || "Description not available",
                    localizedName: data.name
                });
            })
            .catch(error => {
                // Gestisce eventuali errori durante la fetch
                console.error('Error loading ability:', error);
                navigate('/errore');
            })
            .finally(() => {
                // Imposta lo stato di caricamento su false al termine della fetch
                setIsLoading(false);
            });
    }, [name, navigate]);

    if (isLoading) {
        return <div className="loader"></div>;
    }

    if (!ability) {
        return <div>Ability not found</div>;
    }

    return (
        <div className="ability-container">
            <div className="ability-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    Back
                </button>
                <h1>{ability.localizedName}</h1>
            </div>

            <div className="ability-content">
                <div className="ability-description">
                    <h2>Description</h2>
                    <p>{ability.description}</p>
                </div>

                <div className="ability-effect">
                    <h2>Effect</h2>
                    <p>{
                        ability.effect_entries.find(
                            entry => entry.language.name === "en"
                        )?.effect || "Effect not available"
                    }</p>
                </div>

                <div className="pokemon-with-ability">
                    <h2>Pokemon with this ability</h2>
                    <div className="pokemon-list">
                        {ability.pokemon.map((p, index) => (
                            <div
                                key={index}
                                className="pokemon-item"
                                onClick={() => navigate(`/Dettagli/${p.pokemon.name}`)}
                            >
                                {p.pokemon.name}
                                {p.is_hidden && " (Hidden Ability)"}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Abilita;
