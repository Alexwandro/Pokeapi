import React from 'react'
import {useNavigate } from 'react-router-dom'
import '../Layout/Errore.css'

const Errore = () => {
	let indietro = useNavigate()
	return (
		<div id='container'>
			<div>404</div>
			<div>LA PAGINA È FUGGITA</div>
			<div>
				<img src='https://www.kindpng.com/picc/m/74-743336_global-link-question-question-mark-unknown-pokemon-hd.png' alt='???'></img>
			</div>
			<input type='button' value={'Torna alla home'} onClick={() => indietro('/')}></input>
		</div>
	)
}

export default Errore