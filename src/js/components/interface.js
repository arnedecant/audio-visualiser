// -------------------------------------------------------------------
// :: Modal
// -------------------------------------------------------------------

import Component from '../base/component'
import Dispatcher from '../helpers/dispatcher'

export default class Interface extends Component { 

	constructor(selector) {

        super(selector)

        this.settings = {
            colors: 'grayscale'
        }

    }

    click(e) {

        e.preventDefault()

        switch(e.target.name) {
            case 'colors':
                this.settings.colors = e.target.options[e.target.selectedIndex].value
                break
        }

        super.click(e)

    }

}