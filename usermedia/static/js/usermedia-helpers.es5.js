/* This file has been automatically generated. DO NOT EDIT IT. 
 Changes will be overwritten. Edit usermedia-helpers.es6.js and run ./es6-transpile.sh */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* A template for the form for the image upload dialog. */
var usermediaUploadTemplate = exports.usermediaUploadTemplate = _.template('<div id="uploadimage" class="fw-media-uploader" title="<%- action %>">\
    <form action="#" method="post" class="usermediaUploadForm">\
        <div>\
            <input name="title" class="fw-media-title fw-media-form" type="text" placeholder="' + gettext('Insert a title') + '" value="<%- title %>" />\
            <button type="button" class="fw-media-select-button fw-button fw-light">' + gettext('Select a file') + '</button>\
            <input name="image" type="file" class="fw-media-file-input fw-media-form">\
        </div>\
        <div class="figure-preview"><div>\
            <% if(image) { %><img src="<%- image %>" /><% } %>\
        </div></div>\
        <%= categories %>\
    </form></div>');

/* A template for the image category selection of the image selection dialog. */
var usermediaUploadCategoryTemplate = exports.usermediaUploadCategoryTemplate = _.template('<% if(0 < categories.length) { %>\
        <div class="fw-media-category">\
            <div><%- fieldTitle %></div>\
            <% _.each(categories, function(cat) { %>\
                <label class="fw-checkable fw-checkable-label<%- cat.checked %>" for="imageCat<%- cat.id %>">\
                    <%- cat.category_title %>\
                </label>\
                <input class="fw-checkable-input fw-media-form entry-cat" type="checkbox"\
                    id="imageCat<%- cat.id %>" name="imageCat" value="<%- cat.id %>"<%- cat.checked %>>\
            <% }); %>\
        </div>\
    <% } %>');

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageUploadDialog = undefined;

var _templates = require('./templates');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageUploadDialog = exports.ImageUploadDialog = (function () {
    function ImageUploadDialog(imageDB, imageId, ownerId, callback) {
        _classCallCheck(this, ImageUploadDialog);

        this.imageDB = imageDB;
        this.imageId = imageId;
        this.ownerId = ownerId;
        this.callback = callback;
        this.createImageUploadDialog();
    }

    //open a dialog for uploading an image

    _createClass(ImageUploadDialog, [{
        key: 'createImageUploadDialog',
        value: function createImageUploadDialog() {
            var that = this;
            var title = undefined,
                imageCat = undefined,
                thumbnail = undefined,
                image = undefined,
                action = undefined,
                longAction = undefined;
            if (this.imageId) {
                title = this.imageDB.db[id].title;
                thumbnail = this.imageDB.db[id].thumbnail;
                image = this.imageDB.db[id].image;
                imageCat = this.imageDB.db[id].cats;
                action = gettext('Update');
                longAction = gettext('Update image');
            } else {
                this.imageId = 0;
                title = '';
                imageCat = [];
                thumbnail = false;
                image = false;
                action = gettext('Upload');
                longAction = gettext('Upload image');
            }

            var iCats = [];
            jQuery.each(this.imageDB.cats, function (i, iCat) {
                var len = iCats.length;
                iCats[len] = {
                    'id': iCat.id,
                    'category_title': iCat.category_title
                };
                if (0 <= jQuery.inArray(String(iCat.id), imageCat)) {
                    iCats[len].checked = ' checked';
                } else {
                    iCats[len].checked = '';
                }
            });

            jQuery('body').append((0, _templates.usermediaUploadTemplate)({
                'action': longAction,
                'title': title,
                'thumbnail': thumbnail,
                'image': image,
                'categories': (0, _templates.usermediaUploadCategoryTemplate)({
                    'categories': iCats,
                    'fieldTitle': gettext('Select categories')
                })
            }));
            var diaButtons = {};
            diaButtons[action] = function () {
                that.onCreateImageSubmitHandler();
            };
            diaButtons[gettext('Cancel')] = function () {
                jQuery(this).dialog('close');
            };
            jQuery("#uploadimage").dialog({
                resizable: false,
                height: 'auto',
                width: 'auto',
                modal: true,
                buttons: diaButtons,
                create: function create() {
                    var $the_dialog = jQuery(this).closest(".ui-dialog");
                    $the_dialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
                    $the_dialog.find(".ui-button:last").addClass("fw-button fw-orange");
                    that.setMediaUploadEvents(jQuery('#uploadimage'));
                },
                close: function close() {
                    jQuery("#uploadimage").dialog('destroy').remove();
                }
            });

            jQuery('.fw-checkable-label').bind('click', function () {
                $.setCheckableLabel(jQuery(this));
            });
        }

        //add image upload events

    }, {
        key: 'setMediaUploadEvents',
        value: function setMediaUploadEvents(wrapper) {
            var select_button = wrapper.find('.fw-media-select-button'),
                media_input = wrapper.find('.fw-media-file-input'),
                media_previewer = wrapper.find('.figure-preview > div');

            select_button.bind('click', function () {
                media_input.trigger('click');
            });

            media_input.bind('change', function () {
                var file = jQuery(this).prop('files')[0],
                    fr = new FileReader();

                fr.onload = function () {
                    media_previewer.html('<img src="' + fr.result + '" />');
                };
                fr.readAsDataURL(file);
            });
        }
    }, {
        key: 'onCreateImageSubmitHandler',
        value: function onCreateImageSubmitHandler() {
            //when submitted, the values in form elements will be restored
            var formValues = new FormData(),
                checkboxValues = {};

            formValues.append('id', this.imageId);

            if (this.ownerId) {
                formValues.append('owner_id', this.ownerId);
            }

            jQuery('.fw-media-form').each(function () {
                var $this = jQuery(this);
                var the_name = $this.attr('name') || $this.attr('data-field-name');
                var the_type = $this.attr('type') || $this.attr('data-type');
                var the_value = '';

                switch (the_type) {
                    case 'checkbox':
                        //if it is a checkbox, the value will be restored as an Array
                        if (undefined == checkboxValues[the_name]) checkboxValues[the_name] = [];
                        if ($this.prop("checked")) {
                            checkboxValues[the_name].push($this.val());
                        }
                        return;
                    case 'file':
                        the_value = $this.get(0).files[0];
                        break;
                    default:
                        the_value = $this.val();
                }

                formValues.append(the_name, the_value);
            });

            // Add the values for check boxes
            for (key in checkboxValues) {
                formValues.append(key, checkboxValues[key].join(','));
            }
            this.createImage(formValues);
        }
    }, {
        key: 'createImage',
        value: function createImage(imageData) {
            var that = this;
            this.imageDB.createImage(imageData, function (imageId) {
                jQuery("#uploadimage").dialog('close');
                that.imageId = imageId;
                that.callback(imageId);
            });
        }
    }]);

    return ImageUploadDialog;
})();

},{"./templates":1}],3:[function(require,module,exports){
'use strict';

var _uploadDialog = require('./es6_modules/images/upload-dialog/upload-dialog');

/** Helper functions for user added images/SVGs.
 * @namespace usermediaHelpers
 */
var usermediaHelpers = {};
// NO Export
usermediaHelpers.createImage = function (post_data) {
    $.activateWait();
    $.ajax({
        url: '/usermedia/save/',
        data: post_data,
        type: 'POST',
        dataType: 'json',
        success: function success(response, textStatus, jqXHR) {
            if (usermediaHelpers.displayCreateImageError(response.errormsg)) {
                usermediaHelpers.stopUsermediaTable();
                ImageDB[response.values.pk] = response.values;
                usermediaHelpers.appendToImageTable(response.values.pk, ImageDB[response.values.pk]);
                $.addAlert('success', gettext('The image has been uploaded'));
                usermediaHelpers.startUsermediaTable();
                jQuery("#uploadimage").dialog('close');
            } else {
                $.addAlert('error', gettext('Some errors are found. Please examine the form.'));
            }
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            $.addAlert('error', jqXHR.responseText);
        },
        complete: function complete() {
            $.deactivateWait();
        },
        cache: false,
        contentType: false,
        processData: false
    });
};

usermediaHelpers.displayCreateImageError = function (errors) {
    var noError = true;
    for (var e_key in errors) {
        e_msg = '<div class="warning">' + errors[e_key] + '</div>';
        if ('error' == e_key) {
            jQuery('#createimage').prepend(e_msg);
        } else {
            jQuery('#id_' + e_key).after(e_msg);
        }
        noError = false;
    }
    return noError;
};

//save changes or create a new category

usermediaHelpers.createCategory = function (cats) {
    var post_data = {
        'ids[]': cats.ids,
        'titles[]': cats.titles
    };
    $.activateWait();
    $.ajax({
        url: '/usermedia/save_category/',
        data: post_data,
        type: 'POST',
        dataType: 'json',
        success: function success(response, textStatus, jqXHR) {
            if (jqXHR.status == 201) {
                // TODO: Why do we reload the entire list when one new category is created?
                imageCategories = [];
                jQuery('#image-category-list li').not(':first').remove();
                usermediaHelpers.addImageCategoryList(response.entries);

                $.addAlert('success', gettext('The categories have been updated'));
            }
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            $.addAlert('error', jqXHR.responseText);
        },
        complete: function complete() {
            $.deactivateWait();
        }
    });
};

//delete an image category

usermediaHelpers.deleteCategory = function (ids) {
    var post_data = {
        'ids[]': ids
    };
    $.ajax({
        url: '/usermedia/delete_category/',
        data: post_data,
        type: 'POST',
        dataType: 'json'
    });
};

//open a dialog for editing categories
usermediaHelpers.createCategoryDialog = function () {
    var dialogHeader = gettext('Edit Categories');
    var dialogBody = tmp_usermedia_editcategories({
        'dialogHeader': dialogHeader,
        'categories': tmp_usermedia_categoryforms({
            'categories': imageCategories
        })
    });
    jQuery('body').append(dialogBody);
    var diaButtons = {};
    diaButtons[gettext('Submit')] = function () {
        var new_cat = {
            'ids': [],
            'titles': []
        };
        jQuery('#editCategories .category-form').each(function () {
            var this_val = jQuery.trim(jQuery(this).val());
            var this_id = jQuery(this).attr('data-id');
            if ('undefined' == typeof this_id) this_id = 0;
            if ('' != this_val) {
                new_cat.ids.push(this_id);
                new_cat.titles.push(this_val);
            } else if ('' == this_val && 0 < this_id) {
                usermediaHelpers.deleted_cat[usermediaHelpers.deleted_cat.length] = this_id;
            }
        });
        usermediaHelpers.deleteCategory(usermediaHelpers.deleted_cat);
        usermediaHelpers.createCategory(new_cat);
        jQuery(this).dialog('close');
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery(this).dialog('close');
    };
    jQuery("#editCategories").dialog({
        resizable: false,
        width: 350,
        height: 350,
        modal: true,
        buttons: diaButtons,
        create: function create() {
            var $the_dialog = jQuery(this).closest(".ui-dialog");
            $the_dialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
            $the_dialog.find(".ui-button:last").addClass("fw-button fw-orange");
        },
        close: function close() {
            jQuery("#editCategories").dialog('destroy').remove();
        }
    });
    usermediaHelpers.deleted_cat = [];
    usermediaHelpers.addRemoveListHandler();
};

usermediaHelpers.onCreateImageSubmitHandler = function (id) {
    //when submitted, the values in form elements will be restored
    var formValues = new FormData(),
        checkboxValues = {};

    formValues.append('id', id);

    jQuery('.fw-media-form').each(function () {
        var $this = jQuery(this);
        var the_name = $this.attr('name') || $this.attr('data-field-name');
        var the_type = $this.attr('type') || $this.attr('data-type');
        var the_value = '';

        switch (the_type) {
            case 'checkbox':
                //if it is a checkbox, the value will be restored as an Array
                if (undefined == checkboxValues[the_name]) checkboxValues[the_name] = [];
                if ($this.prop("checked")) {
                    checkboxValues[the_name].push($this.val());
                }
                return;
            case 'file':
                the_value = $this.get(0).files[0];
                break;
            default:
                the_value = $this.val();
        }

        formValues.append(the_name, the_value);
    });

    // Add the values for check boxes
    for (key in checkboxValues) {
        formValues.append(key, checkboxValues[key].join(','));
    }
    usermediaHelpers.createImage(formValues);
};

//open a dialog for uploading an image
usermediaHelpers.createImageDialog = function (id) {
    var title, imageCat, thumbnail, image, action, longAction;
    if ('undefined' === typeof id) {
        id = 0;
        title = '';
        imageCat = [];
        thumbnail = false;
        image = false;
        action = gettext('Upload');
        longAction = gettext('Upload image');
    } else {
        title = ImageDB[id].title;
        thumbnail = ImageDB[id].thumbnail;
        image = ImageDB[id].image;
        imageCat = ImageDB[id].cats;
        action = gettext('Update');
        longAction = gettext('Update image');
    }

    var iCats = [];
    jQuery.each(imageCategories, function (i, iCat) {
        var len = iCats.length;
        iCats[len] = {
            'id': iCat.id,
            'category_title': iCat.category_title
        };
        if (0 <= jQuery.inArray(String(iCat.id), imageCat)) {
            iCats[len].checked = ' checked';cat;
        } else {
            iCats[len].checked = '';
        }
    });

    jQuery('body').append(tmp_usermedia_upload({
        'action': longAction,
        'title': title,
        'thumbnail': thumbnail,
        'image': image,
        'categories': tmp_usermedia_upload_category({
            'categories': iCats,
            'fieldTitle': gettext('Select categories')
        })
    }));
    var diaButtons = {};
    diaButtons[action] = function () {
        usermediaHelpers.onCreateImageSubmitHandler(id);
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery(this).dialog('close');
    };
    jQuery("#uploadimage").dialog({
        resizable: false,
        height: 'auto',
        width: 'auto',
        modal: true,
        buttons: diaButtons,
        create: function create() {
            var $the_dialog = jQuery(this).closest(".ui-dialog");
            $the_dialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
            $the_dialog.find(".ui-button:last").addClass("fw-button fw-orange");
            usermediaHelpers.setMediaUploadEvents(jQuery('#uploadimage'));
        },
        close: function close() {
            jQuery("#uploadimage").dialog('destroy').remove();
        }
    });

    jQuery('.fw-checkable-label').bind('click', function () {
        $.setCheckableLabel(jQuery(this));
    });
};

//add image upload events
usermediaHelpers.setMediaUploadEvents = function (wrapper) {
    var select_button = wrapper.find('.fw-media-select-button'),
        media_input = wrapper.find('.fw-media-file-input'),
        media_previewer = wrapper.find('.figure-preview > div');

    select_button.bind('click', function () {
        media_input.trigger('click');
    });

    media_input.bind('change', function () {
        var file = jQuery(this).prop('files')[0],
            fr = new FileReader();

        fr.onload = function () {
            media_previewer.html('<img src="' + fr.result + '" />');
        };
        fr.readAsDataURL(file);
    });
};

//delete image
usermediaHelpers.deleteImage = function (ids) {
    for (var i = 0; i < ids.length; i++) {
        ids[i] = parseInt(ids[i]);
    }
    var post_data = {
        'ids[]': ids
    };
    $.activateWait();
    $.ajax({
        url: '/usermedia/delete/',
        data: post_data,
        type: 'POST',
        success: function success(response, textStatus, jqXHR) {

            usermediaHelpers.stopUsermediaTable();
            var i,
                len = ids.length,
                j;
            for (i = 0; i < len; i++) {
                delete ImageDB[ids[i]];
            }
            var elements_id = '#Image_' + ids.join(', #Image_');
            jQuery(elements_id).detach();
            usermediaHelpers.startUsermediaTable();
            $.addAlert('success', gettext('The image(s) have been deleted'));
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            $.addAlert('error', jqXHR.responseText);
        },
        complete: function complete() {
            $.deactivateWait();
        }
    });
};

usermediaHelpers.deleteImageDialog = function (ids) {
    jQuery('body').append('<div id="confirmdeletion" title="' + gettext('Confirm deletion') + '"><p>' + gettext('Delete the image(s)') + '?</p></div>');
    diaButtons = {};
    diaButtons[gettext('Delete')] = function () {
        usermediaHelpers.deleteImage(ids);
        jQuery(this).dialog('close');
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery(this).dialog('close');
    };
    jQuery("#confirmdeletion").dialog({
        resizable: false,
        height: 180,
        modal: true,
        buttons: diaButtons,
        create: function create() {
            var $the_dialog = jQuery(this).closest(".ui-dialog");
            $the_dialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
            $the_dialog.find(".ui-button:last").addClass("fw-button fw-orange");
        },
        close: function close() {
            jQuery("#confirmdeletion").dialog('destroy').remove();
        }
    });
};

usermediaHelpers.addImageList = function (images) {
    var i,
        pks = [];
    for (i = 0; i < images.length; i++) {
        images[i].image = images[i].image.split('?')[0];
        pks[i] = images[i]['pk'];
        ImageDB[pks[i]] = images[i];
    }

    if (jQuery('#imagelist').length > 0) {
        for (i = 0; i < pks.length; i++) {
            usermediaHelpers.appendToImageTable(pks[i], ImageDB[pks[i]]);
        }
        usermediaHelpers.startUsermediaTable();
    }
};

usermediaHelpers.addImageCategoryList = function (newimageCategories) {
    var i;
    imageCategories = imageCategories.concat(newimageCategories);
    for (i = 0; i < newimageCategories.length; i++) {
        usermediaHelpers.appendToImageCatList(newimageCategories[i]);
    }
};

usermediaHelpers.addRemoveListHandler = function () {
    //add and remove name list field
    jQuery('.fw-add-input').bind('click', function () {
        var $parent = jQuery(this).parents('.fw-list-input');
        if (0 == $parent.next().size()) {
            var $parent_clone = $parent.clone(true);
            $parent_clone.find('input, select').val('').removeAttr('data-id');
            $parent_clone.insertAfter($parent);
        } else {
            var $the_prev = jQuery(this).prev();
            if ($the_prev.hasClass("category-form")) {
                var this_id = $the_prev.attr('data-id');
                if ('undefined' != typeof this_id) deleted_cat[deleted_cat.length] = this_id;
            }
            $parent.remove();
        }
    });
    jQuery('.dk').dropkick();
};

usermediaHelpers.appendToImageCatList = function (iCat) {
    jQuery('#image-category-list').append(tmp_usermedia_category_list_item({
        'iCat': iCat
    }));
};

usermediaHelpers.appendToImageTable = function (pk, image_info) {
    var $tr = jQuery('#Image_' + pk),
        file_type = image_info.file_type.split('/');

    if (1 < file_type.length) {
        file_type = file_type[1].toUpperCase();
    } else {
        file_type = file_type[0].toUpperCase();
    }

    if (0 < $tr.size()) {
        //if the image entry exists, update
        $tr.replaceWith(tmp_usermedia_table({
            'pk': pk,
            'cats': image_info.cats,
            'file_type': file_type,
            'title': image_info.title,
            'thumbnail': image_info.thumbnail,
            'image': image_info.image,
            'height': image_info.height,
            'width': image_info.width,
            'added': image_info.added
        }));
    } else {
        //if this is the new image, append
        jQuery('#imagelist > tbody').append(tmp_usermedia_table({
            'pk': pk,
            'cats': image_info.cats,
            'file_type': file_type,
            'title': image_info.title,
            'thumbnail': image_info.thumbnail,
            'image': image_info.image,
            'height': image_info.height,
            'width': image_info.width,
            'added': image_info.added
        }));
    }
};

usermediaHelpers.getImageDB = function (callback) {

    window.ImageDB = {};
    window.imageCategories = [];
    //Fill ImageDB

    $.activateWait();

    $.ajax({
        url: '/usermedia/images/',
        data: {
            'owner_id': 0
        },
        type: 'POST',
        dataType: 'json',
        success: function success(response, textStatus, jqXHR) {
            usermediaHelpers.addImageCategoryList(response.imageCategories);
            usermediaHelpers.addImageList(response.images);
            if (callback) {
                callback();
            }
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            $.addAlert('error', jqXHR.responseText);
        },
        complete: function complete() {
            $.deactivateWait();
        }
    });
};

usermediaHelpers.stopUsermediaTable = function () {
    jQuery('#imagelist').dataTable().fnDestroy();
};

usermediaHelpers.startUsermediaTable = function () {
    /* The sortable table seems not to have an option to accept new data
    added to the DOM. Instead we destroy and recreate it.
    */

    jQuery('#imagelist').dataTable({
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bInfo": false,
        "bAutoWidth": false,
        "oLanguage": {
            "sSearch": ''
        },
        "aoColumnDefs": [{
            "bSortable": false,
            "aTargets": [0, 2, 4]
        }]
    });
    jQuery('#imagelist_filter input').attr('placeholder', gettext('Search for Filename'));

    jQuery('#imagelist_filter input').unbind('focus, blur');
    jQuery('#imagelist_filter input').bind('focus', function () {
        jQuery(this).parent().addClass('focus');
    });
    jQuery('#imagelist_filter input').bind('blur', function () {
        jQuery(this).parent().removeClass('focus');
    });

    var autocomplete_tags = [];
    jQuery('#imagelist .fw-searchable').each(function () {
        autocomplete_tags.push(this.textContent.replace(/^\s+/g, '').replace(/\s+$/g, ''));
    });
    autocomplete_tags = _.uniq(autocomplete_tags);
    jQuery("#imagelist_filter input").autocomplete({
        source: autocomplete_tags
    });
};

usermediaHelpers.bindEvents = function () {

    jQuery(document).on('click', '.delete-image', function () {
        var ImageId = jQuery(this).attr('data-id');
        usermediaHelpers.deleteImageDialog([ImageId]);
    });

    jQuery(document).on('click', '.edit-image', function () {
        var iID = jQuery(this).attr('data-id');
        var iType = jQuery(this).attr('data-type');

        usermediaHelpers.createImageDialog(iID, iType);
    });
    jQuery('#edit-category').bind('click', usermediaHelpers.createCategoryDialog);

    //open dropdown for image category
    $.addDropdownBox(jQuery('#image-category-btn'), jQuery('#image-category-pulldown'));
    jQuery(document).on('mousedown', '#image-category-pulldown li > span', function () {
        jQuery('#image-category-btn > label').html(jQuery(this).html());
        jQuery('#image-category').val(jQuery(this).attr('data-id'));
        jQuery('#image-category').trigger('change');
    });
    //filtering function for the list of images
    jQuery('#image-category').bind('change', function () {
        var cat_val = jQuery(this).val();
        if (0 == cat_val) {
            jQuery('#imagelist > tbody > tr').show();
        } else {
            jQuery('#imagelist > tbody > tr').hide();
            jQuery('#imagelist > tbody > tr.cat_' + cat_val).show();
        }
    });
    //select all entries
    jQuery('#select-all-entry').bind('change', function () {
        var new_bool = false;
        if (jQuery(this).prop("checked")) new_bool = true;
        jQuery('.entry-select').each(function () {
            this.checked = new_bool;
        });
    });
    //open dropdown for selecting action
    $.addDropdownBox(jQuery('#select-action-dropdown'), jQuery('#action-selection-pulldown'));
    //submit image actions
    jQuery('#action-selection-pulldown li > span').bind('mousedown', function () {
        var action_name = jQuery(this).attr('data-action'),
            ids = [];
        if ('' == action_name || 'undefined' == typeof action_name) return;
        jQuery('.entry-select:checked').each(function () {
            ids[ids.length] = jQuery(this).attr('data-id');
        });
        if (0 == ids.length) return;
        switch (action_name) {
            case 'delete':
                usermediaHelpers.deleteImageDialog(ids);
                break;
        }
    });
};

usermediaHelpers.init = function (callback) {
    usermediaHelpers.bindEvents();
    usermediaHelpers.getImageDB(callback);
};

usermediaHelpers.bind = function () {
    jQuery(document).ready(function () {
        usermediaHelpers.init();
    });
};

window.usermediaHelpers = usermediaHelpers;

},{"./es6_modules/images/upload-dialog/upload-dialog":2}]},{},[3]);
