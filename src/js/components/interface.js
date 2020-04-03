// -------------------------------------------------------------------
// :: Modal
// -------------------------------------------------------------------

import Component from '../base/component'
import Dispatcher from '../helpers/dispatcher'

export default class Interface extends Component { 

	constructor(selector) {

        super(selector)

        this.settings = {
            colors: 'grayscale',
            state: 1
        }

        this.ALLOWED_ELEMENTS = ['BUTTON', 'SELECT', 'ANCHOR', 'INPUT']

    }

    click(e) {

        e.preventDefault()

        if (!this.ALLOWED_ELEMENTS.includes(e.target.nodeName)) return

        const tmpSettings = JSON.stringify(this.settings)

        switch(e.target.name) {
            case 'colors':
                this.settings.colors = e.target.options[e.target.selectedIndex].value
                break
        }

        if (JSON.stringify(this.settings) === tmpSettings) return

        super.click(e)

    }

}