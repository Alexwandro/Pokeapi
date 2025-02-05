import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../Layout/Dettagli.css'

const Dettagli = () => {
	// Per utilizzare sweetalert2
	const Swal = require('sweetalert2')
	// Hook per la navigazione tra le pagine	
	let indietro = useNavigate()
	// Ottiene il nome del pokemon dall'URL
	const { name } = useParams()
	// State per i dati del pokemon
	const [pokemon, setPokemon] = useState(null)
	// Controllo se la pagina sta caricando
	const [isLoading, setIsLoading] = useState(true)
	// State per la linea evolutiva del pokemon
	const [evolutionChain, setEvolutionChain] = useState(null)
	//Fetch del pokemon richiesto
	useEffect(() => {
		setIsLoading(true)
		
		fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
			.then((response) => {
				return response.json()
			})
			.then((infoJson) => {
				setPokemon(infoJson)
				// Fetch delle informazioni sulla specie del pokemon
				return fetch(infoJson.species.url)
			})
			.then((response) =>{
				return response.json()
			})
			.then((speciesJson) => {
				// Fetch della linea evolutiva del pokemon
				return fetch(speciesJson.evolution_chain.url)
			})
			.then((response) => {
				return response.json()
			})
			.then((evolutionData) => {
				const getEvolutionNames = (chain) => {
					return [chain.species.name, ...chain.evolves_to.flatMap(getEvolutionNames)];
				};		
				// Chiama la funzione passando la radice della catena evolutiva
				// e salva il risultato nello state
				setEvolutionChain(getEvolutionNames(evolutionData.chain))
			})
			.catch((error) => {
				// Redirect alla pagina di errore in caso di problemi
				indietro('/errore')
				console.error('Errore:', error);
				indietro('/errore', { state: { message: error.message } });
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [name, indietro])

	//Fetch della linea evolutiva del pokemon
	
	// Mostra un messaggio di caricamento mentre fetch è in corso
	if (isLoading) {
		return <div className='loader'></div>
	}
	// Funzione per l'audio
	const Verso = () => {
		const audio = new Audio(pokemon.cries.latest);
		audio.play()
	};
	// Renderizza i dati del pokemon
	return (
		<div id='container'>
			{/* Pulsanti per navigare tra i pokemon */}
			<div id='pulsanti'>
				<button onClick={() => {if (pokemon.id > 1) {indietro(`/Dettagli/${pokemon.id - 1}`);}
				else{
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: "Non ci sono Pokemon precedenti a questo!",
						});
				}
				}}>Pokemon precedente</button>
				<button onClick={() => indietro('/')}>Home</button>
				<button onClick={() => indietro(`/Dettagli/${pokemon.id + 1}`)}>Pokemon successivo</button> 
			</div>
			<h1>{pokemon.name}</h1>

			<div id='immagini'>
				<div>Forma normale:</div>
				<img alt='immagine.pokemon' src={pokemon.sprites.front_default}></img>
				<div>Forma shiny:</div>
				<img alt='immagine.pokemon' src={pokemon.sprites.front_shiny}></img>
			</div>

			<div id='Verso'>
				<input type='button' onClick={()=>Verso()} value={"Riproduci verso  🔊"}></input>
			</div>

			<div id='info'>
				<h2>Informazioni:</h2>
				<div>Altezza: {pokemon.height / 10} (m)</div>
				<div>Peso: {pokemon.weight / 10} (kg)</div>
				<div>Tipo: {pokemon.types.map(type => type.type.name).join(', ')}</div>
			</div>

			<div id="evoluzione">
				<h2>Linea Evolutiva:</h2>
				<div className="evolution-chain">
					{evolutionChain && evolutionChain.map((evoName, index) => (
						<div key={evoName} className="evolution-item">
							{/* Nome del Pokémon nell'evoluzione. Se è il Pokémon corrente, aggiunge una classe evidenziata */}
							<span 
								className={`evolution-name ${evoName === pokemon.name ? 'current-pokemon' : ''}`}
								onClick={() => indietro(`/Dettagli/${evoName}`)} // Naviga ai dettagli del Pokémon selezionato
							>
								{evoName}
							</span>
							
							{/* Freccia che separa i Pokémon nella linea evolutiva, mostrata solo se non è l'ultimo elemento */}
							{index < evolutionChain.length - 1 && (
								<span className="evolution-arrow">→</span>
							)}
						</div>
					))}
				</div>
			</div>

			<div id='abilita'>
				<h2>Abilità:</h2>
				{pokemon.abilities.map((ability, index) => (
					<div key={index}>
						{ability.ability.name}
						{ability.is_hidden && " (Abilità Nascosta)"}
					</div>
				))}
			</div>
			
			<div id='statistiche'>
				<h2>Statistiche:</h2>
				{pokemon.stats.map((stat, index) => (
					<div key={index}>
						{stat.stat.name}: {stat.base_stat}
					</div>
				))}
			</div>
		</div>
	)
}

export default Dettagli