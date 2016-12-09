'use strict';

const assert = require('assert');
const $ = require('../lib/selector');

describe('Проверка работы плагина selector', function() {
    it('Проверка работы поля parents', function() {
        assert($({
                parents: [{ block: 'card-section', modName: 'view', modVal: 'publication' }, 'link'],
                block: 'icon',
                modName: 'type',
                modVal: 'edit'
            }) === '.card-section_view_publication .link .icon_type_edit');
    });

    it('Проверка работы поля parents в форме строки', function() {
        assert($({ parents: 'link', block: 'icon', modName: 'type', modVal: 'edit' }) === '.link .icon_type_edit');
    });

    it('Проверка работы поля elem', function() {
        assert($({ block: 'card-section', elem: 'status' }) === '.card-section__status');
    });

    it('Проверка работы поля filter', function() {
        assert($({
                parents: [{ block: 'popup', mods: { visible: true } }],
                block: 'menu-item',
                filter: ':last-child'
            }) === '.popup.popup_visible .menu-item:last-child');
    });

    it('Проверка поддержки строки', function() {
        assert($('page') === '.page');
    });

    it('Проверка поддержки поля mods', function() {
        assert($({
                block: 'name',
                elem: 'item',
                mods: { type: 'olol', type1: 'okkok1' }
            }) === '.name__item.name__item_type_olol.name__item_type1_okkok1');
    });

    it('Проверка поддержки mods & filter у поля parents и у поля mix + проверка поддержки mods с булевым модификатором', function() {
        assert($({
                parents: [{ block: 'popup', mods: { visible: true }, filter: ':last-child' }],
                block: 'popup',
                mix: { block: 'dropdown', mods: { switcher: 'link' }, filter: ':last-child' }
            }) === '.popup.popup_visible:last-child .popup.dropdown.dropdown_switcher_link:last-child');
    });

    it('Проверка поддержки нескольких filter', function() {
        assert($({
                block: 'b1',
                filter: ':b1filter',
                mix: { block: 'b2', filter: ':b2filter' }
            }) === '.b1.b2:b1filter:b2filter');
    });
});
