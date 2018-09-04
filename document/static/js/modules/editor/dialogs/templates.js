import {escapeText} from "../../common"

export let linkDialogTemplate = ({defaultLink, internalTargets, link, linkTitle}) =>
    `${
        internalTargets.length ?
        `<div class="fw-radio">
            <input type="radio" name="link-type" value="internal" class="link-internal-check">
            <label class="link-internal-label">${gettext("Internal")}</label>
        </div>
        <div class="fw-select-container">
            <select class="internal-link-selector fw-button fw-white fw-large" required="">
                <option class="placeholder" selected="" disabled="" value="">
                    ${gettext("Select Target")}
                </option>
                ${
                    internalTargets.map(target =>
                        `<option class="link-item" type="text" value="${target.id}" ${link === `#${target.id}` ? "selected" : ""}>
                            ${target.text}
                        </option>`
                    )
                }
            </select>
            <div class="fw-select-arrow fa fa-caret-down"></div>
        </div>
        <p></p>
        <div class="fw-radio">
            <input type="radio" name="link-type" value="external" class="link-external-check">
            <label class="link-external-label">${gettext("External")}</label>
        </div>`
        :
        ''
    }
    <input class="link-title" type="text" value="${escapeText(linkTitle)}" placeholder="${gettext("Link title")}"/>
    <p></p>
    <input class="link" type="text" value="${["#", undefined].includes(link[0]) ? defaultLink : link}" placeholder="${gettext("URL")}"/>`

/** Dialog to add a note to a revision before saving. */
export let revisionDialogTemplate = ({dir}) =>
    `<p>
        <input type="text" class="revision-note" placeholder="${gettext('Description (optional)')}" dir="${dir}">
    </p>`

export let tableInsertTemplate = () => `
    <table class="insert-table-selection">
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    </table>`

export let mathDialogTemplate = () =>
    `<div title="${gettext("Math")}">
        <p><span class="math-field" type="text" name="math" ></span></p>
        <div><input type="text" class="raw-input" style="display:none"></div>
        <div class="math-preview"></div>
        <div class="math-error"></div>
    </div>`

export let figureImageItemTemplate =  ({id, cats, image, thumbnail, title}) =>
    `<tr id="Image_${id}" class="${cats.map(cat => `cat_${escapeText(cat)} `)}" >
         <td class="type" style="width:100px;">
            ${
                thumbnail === undefined ?
                `<img src="${image}" style="max-heigth:30px;max-width:30px;">` :
                `<img src="${thumbnail}" style="max-heigth:30px;max-width:30px;">`
            }
        </td>
        <td class="title" style="width:212px;">
            <span class="fw-inline">
                <span class="edit-image fw-link-text fa fa-picture-o" data-id="${id}">
                    ${escapeText(title)}
                </span>
            </span>
        </td>
        <td class="checkable" style="width:30px;">
        </td>
    </tr>`

/** A template to select images inside the figure configuration dialog in the editor. */
export let figureImageTemplate = ({imageDB}) =>
    `<div>
        <table id="imagelist" class="tablesorter fw-document-table" style="width:342px;">
            <thead class="fw-document-table-header">
                <tr>
                    <th width="50">${gettext('Image')}</th>
                    <th width="150">${gettext('Title')}</th>
                </tr>
            </thead>
            <tbody class="fw-document-table-body fw-small">
                ${Object.values(imageDB).map(image => figureImageItemTemplate(image))}
            </tbody>
        </table>
        <div class="dialogSubmit">
            <button class="edit-image createNew fw-button fw-light">
                ${gettext('Upload')}
                <span class="fa fa-plus-circle"></span>
            </button>
            <button type="button" id="selectImageFigureButton" class="fw-button fw-dark">
                ${gettext('Insert')}
            </button>
            <button type="button" id="cancelImageFigureButton" class="fw-button fw-orange">
                ${gettext('Cancel')}
            </button>
        </div>
    </div>`

    /** A template to configure the display of a figure in the editor. */
export let configureFigureTemplate = ({image, equation, caption, dir}) =>
    `<div class="fw-media-uploader">
            <div>
                <input class="fw-media-title figure-math" type="text" name="figure-math"
                    placeholder="${gettext('Insert formula')}" value="${escapeText(equation)}"
                    ${image ? 'disabled="disabled"' : ''} />
                <button type="button" id="insertFigureImage" class="fw-button fw-light
                        ${equation === '' ? '' : 'disabled'}">
                    ${gettext('Insert image')} <i class="fa fa-picture-o"></i>
                </button>
            </div>
            <input type="hidden" id="figure-category">
            <div style="margin-top: 10px;">
                <div id="figure-category-btn" class="fw-button fw-light fw-large">
                    <input type="hidden" id="figure-category" />
                    <label></label>
                    <span class="fa fa-caret-down"></span>
                </div>
                <div id="figure-category-pulldown" class="fw-pulldown fw-left"
                        style="left: 10px;">
                    <ul id="figure-category-list">
                        <li><span class="fw-pulldown-item" id="figure-category-none">
                            ${gettext('None')}
                        </span></li>
                        <li><span class="fw-pulldown-item" id="figure-category-figure">
                            ${gettext('Figure')}
                        </span></li>
                        <li><span class="fw-pulldown-item" id="figure-category-photo">
                            ${gettext('Photo')}
                        </span></li>
                        <li><span class="fw-pulldown-item" id="figure-category-table">
                            ${gettext('Table')}
                        </span></li>
                    </ul>
                </div>
            </div>
            <div class="figure-preview">
                <div id="inner-figure-preview"></div>
            </div>
            <div style="margin-top: 10px;">
                <input style="width: 402px;" class="caption"
                        type="text" name="figure-caption" value="${escapeText(caption)}"
                        placeholder="${gettext('Insert caption')}" dir="${dir}" />
            </div>
        </div>`

/** A template to configure citations in the editor */
export let configureCitationTemplate = ({citedItemsHTML, citeFormat}) =>
        `<div id="my-sources" class="fw-ar-container">
            <h3 class="fw-green-title">${gettext("My sources")}</h3>
        </div>
        <span id="add-cite-source" class="fw-button fw-large fw-square fw-light fw-ar-button"><i class="fa fa-caret-right"></i></span>
        <div id="cited-items" class="fw-ar-container">
            <h3 class="fw-green-title">${gettext("Citation format")}</h3>
            <div class="fw-select-container">
                <select id="citation-style-selector" class="fw-button fw-white fw-large" required="">
                    <option value="autocite" ${citeFormat==="autocite" ? "selected" : ""}>${gettext("(Author, 1998)")}</option>
                    <option value="textcite" ${citeFormat==="textcite" ? "selected" : ""}>${gettext("Author (1998)")}</option>
                </select>
                <div class="fw-select-arrow fa fa-caret-down"></div>
            </div>
            <table id="selected-cite-source-table" class="fw-document-table tablesorter">
                <thead class="fw-document-table-header"><tr>
                    <th width="135">${gettext("Title")}</th>
                    <th width="135">${gettext("Author")}</th>
                    <td width="50" align="center">${gettext("Remove")}</td>
                </tr></thead>
                <tbody class="fw-document-table-body fw-min">
                  ${citedItemsHTML}
                </tbody>
            </table>
        </div>`

/** A template for each selected citation item inside the citation configuration
    dialog of the editor. */
export let selectedCitationTemplate = ({title, author, id, db, prefix, locator}) =>
    `<tr id="selected-source-${db}-${id}" class="selected-source">
        <td colspan="3" width="335">
          <table class="fw-cite-parts-table">
              <tr>
                  <td width="135">
                      <span class="fw-document-table-title fw-inline">
                          <i class="fa fa-book"></i>
                          <span data-id="${id}">
                              ${escapeText(title)}
                          </span>
                      </span>
                  </td>
                  <td width="135">
                      <span class="fw-inline">
                          ${escapeText(author)}
                      </span>
                  </td>
                  <td width="50" align="center">
                      <span class="delete fw-inline fw-link-text" data-id="${id}" data-db="${db}">
                          <i class="fa fa-trash-o"></i>
                      </span>
                  </td>
              </tr>
              <tr>
                  <td class="cite-extra-fields" colspan="3" width="335">
                      <div>
                          <label>${gettext('Page')}</label>
                          <input class="fw-cite-page" type="text" value="${escapeText(locator)}" />
                      </div>
                      <div>
                          <label>${gettext('Text before')}</label>
                          <input class="fw-cite-text" type="text" value="${escapeText(prefix)}" />
                      </div>
                  </td>
              </tr>
          </table>
      </td>
    </tr>`


export let authorTemplate = ({author}) =>
    `<input type="text" name="firstname" value="${author.firstname ? author.firstname : ''}" placeholder="${gettext("Firstname")}"/>
    <input type="text" name="lastname" value="${author.lastname ? author.lastname : ''}" placeholder="${gettext("Lastname")}"/>
    <input type="text" name="email" value="${author.email ? author.email : ''}" placeholder="${gettext("Email")}"/>
    <input type="text" name="institution" value="${author.institution ? author.institution : ''}" placeholder="${gettext("Institution")}"/>
    `

export let languageTemplate = ({currentLanguage, LANGUAGES}) =>
    `<select class="fw-button fw-white fw-large">
        ${
            LANGUAGES.map(language =>
                `<option value="${language[0]}" ${language[0]===currentLanguage ? 'selected' : ''}>
                    ${language[1]}
                </option>`
            ).join('')
        }
    </select>`