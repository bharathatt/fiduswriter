import {Dialog} from "../../common"

import {languageTemplate} from "./templates"
import {LANGUAGES} from "../common"


export class LanguageDialog {
    constructor(editor, language) {
        this.editor = editor
        this.language = language
        this.dialog = false
    }

    init() {
        let buttons = []
        buttons.push({
            text: gettext('Change'),
            classes: 'fw-dark',
            click: () => {
                let language = this.dialog.dialogEl.querySelector('select').value
                this.dialog.close()

                if (language === this.language) {
                    // No change.
                    return
                }

                let article = this.editor.view.state.doc.firstChild
                let attrs = Object.assign({}, article.attrs)
                attrs.language = language
                this.editor.view.dispatch(
                    this.editor.view.state.tr.setNodeMarkup(0, false, attrs)
                )
                return
            }
        })

        buttons.push({
            type: 'cancel'
        })

        this.dialog = new Dialog({
            width: 300,
            height: 180,
            id: 'select-document-language',
            title: gettext('Change language of the document'),
            body: languageTemplate({
                currentLanguage: this.language,
                LANGUAGES
            }),
            buttons,
            onClose: () => this.editor.currentView.focus()
        })

        this.dialog.open()

    }
}