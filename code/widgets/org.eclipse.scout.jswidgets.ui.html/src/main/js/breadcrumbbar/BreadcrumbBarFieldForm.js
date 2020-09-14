/*
 * Copyright (c) 2020 BSI Business Systems Integration AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Distribution License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/org/documents/edl-v10.html
 *
 * Contributors:
 *     BSI Business Systems Integration AG - initial API and implementation
 */
import {Form, MessageBoxes, Status, arrays, models} from '@eclipse-scout/core';
import BreadcrumbBarFieldFormModel from './BreadcrumbBarFieldFormModel';

/*******************************************************************************
 * Copyright (c) 2017 BSI Business Systems Integration AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Distribution License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/org/documents/edl-v10.html
 *
 * Contributors:
 *     BSI Business Systems Integration AG - initial API and implementation
 ******************************************************************************/
export default class BreadcrumbBarFieldForm extends Form {

  constructor() {
    super();

    this.breadcrumbBarField = null;
    this._breacrumbActionListener = this._onBreadcrumbAction.bind(this);
  }

  _jsonModel() {
    return models.get(BreadcrumbBarFieldFormModel);
  }

  _onBreadcrumbAction(event) {
    MessageBoxes.openOk(this, this.session.text('BreadcrumbClickedX', event.source.ref), Status.Severity.INFO);
  }

  _init(model) {
    super._init(model);

    this.breadcrumbBarField = this.widget('BreadcrumbBarField');

    this.widget('FormFieldPropertiesBox').setField(this.breadcrumbBarField);
    this.widget('GridDataBox').setField(this.breadcrumbBarField);
    this.widget('WidgetActionsBox').setField(this.breadcrumbBarField);
    this.widget('EventsTab').setField(this.breadcrumbBarField);

    this.widget('BreadcrumbItemsField').on('propertyChange', this._onBreadcrumbItemsPropertyChange.bind(this));
    this.widget('BreadcrumbItemsField').setValue('Storyboard\nFolder\nChild Folder');
  }

  _onBreadcrumbItemsPropertyChange(event) {
    if (event.propertyName !== 'value') {
      return;
    }

    this.breadcrumbBarField.breadcrumbBar.breadcrumbItems.forEach(function(item) {
      item.off('action', this._breacrumbActionListener);
    }.bind(this));

    this.breadcrumbBarField.setBreadcrumbItems(arrays.ensure(event.newValue.split("\n")).map(function(text) {
      return {
        objectType: 'BreadcrumbItem',
        text: text,
        ref: text
      };
    }.bind(this)));

    this.breadcrumbBarField.breadcrumbBar.breadcrumbItems.forEach(function(item) {
      item.on('action', this._breacrumbActionListener);
    }.bind(this));
  }
}
