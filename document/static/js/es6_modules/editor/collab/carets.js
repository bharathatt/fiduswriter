import {getVersion, sendableSteps} from "prosemirror-collab"
import fastdom from "fastdom"

export class ModCollabCarets {
    constructor(mod) {
        mod.carets = this
        this.mod = mod
        this.caretPositions = {}
        this.caretContainer = false
        this.caretPlacementStyle = false
        this.setup()
        this.bindEvents()
    }

    setup() {
        // Add one elements to hold dynamic CSS info about carets
        let styleContainers = document.createElement('temp')
        styleContainers.innerHTML = `<style type="text/css" id="caret-placement-style"></style>`
        while (styleContainers.firstElementChild) {
            document.head.appendChild(styleContainers.firstElementChild)
        }
        this.caretPlacementStyle = document.getElementById('caret-placement-style')
        // Add one container element to hold carets
        this.caretContainer = document.createElement('div')
        this.caretContainer.id = 'caret-markers'
        document.getElementById('paper-editable').appendChild(this.caretContainer)
    }

    bindEvents() {
        let pm = this.mod.editor.pm
        pm.updateScheduler([pm.on.change], () => this.updatePositionCSS())
        let fnPm = this.mod.editor.mod.footnotes.fnPm
        fnPm.updateScheduler([fnPm.on.change], () => this.updatePositionCSS())
        // Limit sending of selection to once every 250 ms. This is also
        // important to work correctly with editing, which otherwise triggers
        // three selection changes that result in an incorrect caret placement.
        let sendSelection = _.debounce(() => {
            this.sendSelectionChange()
        }, 250)
        pm.on.selectionChange.add(sendSelection)
        fnPm.on.selectionChange.add(sendSelection)
    }

    // Create a new caret as the current user
    getCaretPosition() {
        return {
            id: this.mod.editor.user.id,
            sessionId: this.mod.editor.docInfo.session_id,
            from: this.mod.editor.currentView.state.selection.from,
            to: this.mod.editor.currentView.state.selection.to,
            head: Number.isFinite(this.mod.editor.currentView.state.selection.head) ?
                this.mod.editor.currentView.state.selection.head : this.mod.editor.currentView.state.selection.to,
            // Whether the selection is in the footnote or the main editor
            view: this.mod.editor.currentView === this.mod.editor.view ? 'view' : 'fnView'
        }
    }

    sendSelectionChange() {
        let toSend = sendableSteps(this.mod.editor.currentView.state)
        if (toSend) {
            // TODO: Positions really need to be reverse-mapped through all
            // unconfirmed maps. As long as we don't do this, we just don't send
            // anything if there are unconfirmed maps to avoid potential problems.
            window.setTimeout(() => {this.sendSelectionChange()},500)
            return
        }
        this.mod.editor.mod.serverCommunications.send({
            type: 'selection_change',
            caret_position: this.getCaretPosition(),
            diff_version: getVersion(this.mod.editor.view.state)
        })
    }

    receiveSelectionChange(data) {
        this.updateCaret(data.caret_position)
        let pm = data.caret_position.view === 'view' ? this.mod.editor.view : this.mod.editor.mod.footnotes.fnView
        this.updatePositionCSS()
    }

    // Update the position of a collaborator's caret
    updateCaret(caretPosition){
        let participant = this.mod.participants.find(participant => participant.id === caretPosition.id)
        if (!participant) {
            // participant (still) unknown. Ignore.
            return
        }
        let colorId = this.mod.colorIds[caretPosition.id]
        let posFrom = caretPosition.from
        let posTo = caretPosition.to
        let posHead = caretPosition.head
        let view = caretPosition.view === 'view' ? this.mod.editor.view : this.mod.editor.mod.footnotes.fnView
        // Map the positions through all still unconfirmed changes
        let toSend = sendableSteps(view.state)

        if (toSend) {
            toSend.steps.forEach(step => {
                let map = step.getMap()
                posFrom = map.map(posFrom)
                posTo = map.map(posTo)
                posHead = map.map(posHead)
            })
        }

        // Delete an old marked range for the same session, if there is one.
        this.removeSelection(caretPosition.sessionId)

        let range = false

        if (posFrom !== posTo) {
            range = pm.markRange(
                posFrom,
                posTo,
                {
                    removeWhenEmpty: true,
                    className: 'user-bg-' + colorId
                }
            )
        }

        let headRange = pm.markRange(
            posHead,
            posHead,
            {
                removeWhenEmpty: false
            }
        )


        let headNode = document.createElement('div')
        let className = 'user-'+colorId
        headNode.id = 'caret-' + caretPosition.sessionId
        headNode.classList.add('caret')
        headNode.classList.add(className)
        headNode.innerHTML = '<div class="caret-head"></div>'
        headNode.firstChild.classList.add(className)
        let tooltip = participant.name
        headNode.title = tooltip
        headNode.firstChild.title = tooltip
        this.caretContainer.appendChild(headNode)
        this.caretPositions[caretPosition.sessionId] = {pm, range, headRange, headNode}
    }

    removeSelection(sessionId) {
        if (sessionId in this.caretPositions) {
            let caretPosition = this.caretPositions[sessionId]
            if (Number.isFinite(caretPosition.range.from)) {
                caretPosition.pm.removeRange(caretPosition.range)
            }
            if (Number.isFinite(caretPosition.headRange.from)) {
                caretPosition.pm.removeRange(caretPosition.headRange)
            }
            caretPosition.headNode.parentNode.removeChild(caretPosition.headNode)
            delete this.caretPositions[sessionId]
        }
    }

    updatePositionCSS() {
        // 1st write phase
        fastdom.measure(() => {
            // 1st read phase
            // This phase + next write pahse are used for footnote placement,
            // so we cannot find carets in the footnotes before the next read
            // phase
            fastdom.mutate(() => {
                // 2nd write phase
                fastdom.measure(() => {
                    // 2nd read phase
                    let positionCSS = ''
                    for (let sessionId in this.caretPositions) {
                        let caretPosition = this.caretPositions[sessionId]
                        let coords = caretPosition.view.coordsAtPos(caretPosition.headRange.from)
                        let offsets = this.caretContainer.getBoundingClientRect()
                        let height = coords.bottom - coords.top
                        let top = coords.top - offsets.top
                        let left = coords.left - offsets.left
                        positionCSS += `#caret-${sessionId} {top: ${top}px; left: ${left}px; height: ${height}px;}`
                    }
                    fastdom.mutate(() => {
                        // 3rd write phase
                        if (this.caretPlacementStyle.innerHTML !== positionCSS) {
                            this.caretPlacementStyle.innerHTML = positionCSS
                        }
                    })
                })
            })
        })
    }
}
