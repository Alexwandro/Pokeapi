// Importazione delle dipendenze necessarie
import React, { useContext, useState } from 'react'
import { parametri } from './App.js'        // Importa il context per i dati Pokemon
import { useNavigate } from 'react-router-dom'  // Hook per la navigazione
import '../Layout/Elenco.css'  // Importa il file CSS per lo stile

const Home = () => {
	// Hook per la navigazione tra le pagine
	const navigate = useNavigate()
	// Recupera i dati dei Pokemon dal context
	const contextData = useContext(parametri)
	// State per gestire il termine di ricerca
	const [searchTerm, setSearchTerm] = useState('')

	// Funzione che gestisce il cambiamento del testo nella barra di ricerca
	// Converte il testo inserito in minuscolo per una ricerca case-insensitive
	const handleSearch = (event) => {
		setSearchTerm(event.target.value.toLowerCase())
	}

	// Funzione principale per la visualizzazione dei Pokemon
	const Visualizza = () => {
		// Controlla se i dati sono stati caricati
		if (!contextData.Pokemons || contextData.Pokemons.length === 0) {
			return <div>Caricamento in corso...</div>
		}
		
		// Filtra i Pokemon in base al termine di ricerca
		// Includes verifica se il nome del Pokemon contiene la stringa cercata
		const filteredPokemon = contextData.Pokemons.filter(pokemon => 
			pokemon.name.toLowerCase().includes(searchTerm)
		)

		// Se nessun Pokemon corrisponde alla ricerca
		if (filteredPokemon.length === 0) {
			return <div>Nessun Pokemon trovato</div>
		}
		
		// Mappa i Pokemon filtrati e crea gli elementi della lista
		// Al click su un Pokemon, naviga alla pagina dei dettagli usando il nome come parametro
		return filteredPokemon.map((elemento, indice) => (
			<div 
				className='elemento'
				key={indice} 
				onClick={() => navigate(`/Dettagli/${elemento.name}`)}
			>
				{indice + 1} -
				{elemento.name}
			</div>
		))
	}

	return (
		<div id='container'>
			<h1>Pokemon List</h1>
			{/* Input per la ricerca dei Pokemon */}
			<input
				type="text"
				placeholder="Cerca Pokemon..."
				value={searchTerm}
				onChange={handleSearch}
			/>
			{/* Visualizza la lista dei Pokemon filtrati */}
			{Visualizza()}
		</div>
	)
}

export default Home