function updateOutput() {
	const tab = '&nbsp;&nbsp;&nbsp;&nbsp;'
	const output = document.getElementById('output-text'),
		name = document.getElementById('name').value,
		canform = document.getElementById('canform').value,
		required = document.getElementById('required').value,
		tiles = document.getElementById('tiles').value,
		exclusive = document.getElementById('exclusive').value,
		buttonName = document.getElementById('button-name').value,
		buttonDesc = document.getElementById('button-desc').value,
		alertTitle = document.getElementById('alert-title').value,
		alertDesc = document.getElementById('alert-desc').value,
		alertButton = document.getElementById('alert-button').value,
		flagLink = document.getElementById('flag-link').value,
		modifierNames = [].slice.call(document.getElementsByClassName('modifier-name')).map(input => input.value).filter(input => input),
		modifierLengths = [].slice.call(document.getElementsByClassName('modifier-length')).map(input => input.value).filter(input => input),
		modifierDonotclears = [].slice.call(document.getElementsByClassName('modifier-donotclear')).map(input => input.checked).filter(input => input),
		attributeNames = [].slice.call(document.getElementsByClassName('attribute-name')).map(input => input.value).filter(input => input),
		attributeValues = [].slice.call(document.getElementsByClassName('attribute-value')).map(input => input.value).filter(input => input),

		canformlist = formListString(canform),
		requiredlist = formListString(required),
		tilelist = formListString(tiles),
		exclusivelist = formListString(exclusive)

	if (!isEmpty(name) && !isEmpty(canform) && !isEmpty(required) && !isEmpty(buttonName) && !isEmpty(buttonDesc)) {

		const isAlertVisible = (!isEmpty(alertTitle) || !isEmpty(alertDesc) || !isEmpty(alertButton))

		let modifiers = ''
		if (modifierNames.length > 0 && modifierLengths.length > 0) {
			modifiers += `<br><br>${tab}AddModifiers = {<br>`
			for (const index in modifierNames) {
				modifiers += `${tab}${tab}["${modifierNames[index]}"] = {<br>${tab}${tab}${tab}Length = ${modifierLengths[index] ? modifierLengths[index] : 0},<br>${tab}${tab}${tab}DoNotClear = ${modifierDonotclears[index] ? 'True' : 'False'},<br>${tab}${tab}},<br>`
			}
			modifiers += `${tab}}`
		}

		let attributes = ''
		if (attributeNames.length > 0 && attributeValues.length > 0) {
			attributes += `<br><br>${tab}CustomAttributes = {<br>`
			for (const index in attributeNames) {
				attributes += `${tab}${tab}["${attributeNames[index]}"] = ${attributeValues[index] ?? 0},<br>`
			}
			attributes += `${tab}}`
		}

		buttonVisibility('visible')
		output.innerHTML = 
		`{<br>${tab}FormableName = "${name}",
		<br>${tab}CountriesCanForm = {${canformlist}},
		<br>${tab}RequiredCountries = {${requiredlist}},
		${isEmpty(tiles) ? '' : `<br>${tab}RequiredTiles = {${tilelist}},`}
		${isEmpty(exclusive) ? '' : `<br>${tab}ExclusiveFormables = {${exclusivelist}},`}
		<br><br>${tab}FormableButton = {<br>${tab}${tab}ButtonName = "${buttonName}",
		<br>${tab}${tab}ButtonDescription = "${buttonDesc}",
		<br>${tab}},
		${!isAlertVisible ? '' : `<br><br>${tab}CustomAlert = {<br>${tab}${tab}Title = "${isEmpty(alertTitle) ? '' : alertTitle}",
		<br>${tab}${tab}Desc = "${isEmpty(alertDesc) ? '' : alertDesc}",
		<br>${tab}${tab}Button = "${isEmpty(alertButton) ? '' : alertButton}",<br>${tab}},`}
		${modifiers}
		${attributes}
		<br>},${isEmpty(flagLink) ? '' : '<br><br>Link to the flag: ' + flagLink}`

	} else {
		output.innerHTML = 'Fill in the required labels to proceed (marked with asterisks). Italic labels are optional.'
		buttonVisibility('hidden')
	}

}

function isEmpty(input) {
	if (input.replaceAll(' ', '').length == 0) return true
	return false
}

function formListString(input) {
	let newlist = ''
	for (const nation of input.split(',')) newlist = `${newlist}, "${nation.trim()}"`
	return newlist.replace(', ', '')
}

function copyOutput() {

	const output = document.getElementById('output-text'),
		buttonText = document.getElementById('copy-output-label'),
		button = document.getElementById('copy-output')
	if (output.innerHTML.length <= 91) return
	navigator.clipboard.writeText(output.innerText)

	buttonText.innerText = 'Copied!'
	button.style.backgroundColor = '#2f423a'
	setTimeout(() => {
		buttonText.innerText = 'Copy to clipboard'
		button.removeAttribute('style')
	}, 1000)

}

function buttonVisibility(state) {
	document.getElementById('copy-output').style.visibility = state
}

function addModifier() {
	document.getElementById('input-content').insertAdjacentHTML('beforeend', '<div class="input-label"><div class="input-name modifier-label">NAME <input class="input modifier-name" placeholder="Popular War Support">LENGTH <input class="input modifier-length" placeholder="365">DO NOT CLEAR <input class="input modifier-donotclear" type="checkbox"><button class="close-modifier">X</button></div></div>')
	document.querySelectorAll('input').forEach(input => input.oninput = updateOutput)
	for (const button of document.getElementsByClassName('close-modifier')) {
		button.addEventListener('click', () => {
			button.parentElement.parentElement.remove()
			updateOutput()
		})
	}	
}

function addAttribute() {
	document.getElementById('input-content').insertAdjacentHTML('beforeend', '<div class="input-label"><div class="input-name modifier-label">NAME <input class="input attribute-name" placeholder="Stability_Gain">VALUE <input class="input attribute-value" placeholder="10"><button class="close-attribute">X</button></div></div>')
	document.querySelectorAll('input').forEach(input => input.oninput = updateOutput)
	for (const button of document.getElementsByClassName('close-attribute')) {
		button.addEventListener('click', () => {
			button.parentElement.parentElement.remove()
			updateOutput()
		})
	}	
}

// Send anonymous webhook to 3meraldK's private Discord server about page visit, to know how many people use my generator 
// earthmc-poland.fly.dev is my personal back-end middle-man used to hide webhook's url, avoiding its removal by trolls
// (anyway it's probably a temporary solution for testing purposes lol)
function visitNotification() {
	fetch('https://earthmc-poland.fly.dev', { method: 'post', mode: 'no-cors' })
}

window.onload = function() {
	updateOutput()
	document.getElementById('copy-output').onclick = copyOutput
	document.querySelectorAll('input').forEach(input => input.oninput = updateOutput)
	document.getElementById('modifier-button').addEventListener('click', () => addModifier())
	document.getElementById('attribute-button').addEventListener('click', () => addAttribute())
	visitNotification()
}