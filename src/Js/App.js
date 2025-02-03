import React, {useState,useEffect, createContext} from "react";
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './Elenco.js';
import Dettagli from './Dettagli.js';
import Errore from './Errore.js';
export const parametri=createContext()


const App = () =>{
	const [Pokemons, setPokemons] = useState([])
	useEffect(() => {
		fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
		.then((testo)=>testo.json())
		.then((mioJson)=>{
			setPokemons(mioJson.results)
		})
	}, [])

	return (
		<div>
			<parametri.Provider value={{Pokemons:Pokemons, setPokemons:setPokemons}}>
				<BrowserRouter>
					<Routes>
						<Route element={<Home/>} path='/'/>
						<Route element={<Dettagli/>} path='/Dettagli/:name'/>
						<Route element={<Errore/>} path='*'/>
					</Routes>
				</BrowserRouter>
			</parametri.Provider>
		</div>
	)
}

export default App;
