import _debounce from 'lodash-es/debounce';

import { descending as d3_descending, ascending as d3_ascending } from 'd3-array';
import { event as d3_event, select as d3_select } from 'd3-selection';

import { t, textDirection } from '../util/locale';
import { svgIcon } from '../svg/icon';
import { uiBackgroundDisplayOptions } from './background_display_options';
import { uiBackgroundOffset } from './background_offset';
import { uiCmd } from './cmd';
import { uiDisclosure } from './disclosure';
import { uiMapInMap } from './map_in_map';
import { uiSettingsCustomBackground } from './settings/custom_background';
import { uiTooltipHtml } from './tooltipHtml';
import { tooltip } from '../util/tooltip';


export function uiBackground(context) {
    var key = t('background.key');

    var _pane = d3_select(null), _toggleButton = d3_select(null);

    var _customSource = context.background().findSource('custom');
    var _previousBackground = context.background().findSource(context.storage('background-last-used-toggle'));

    var _backgroundList = d3_select(null);
    var _overlayList = d3_select(null);
    var _displayOptionsContainer = d3_select(null);
    var _offsetContainer = d3_select(null);

    var backgroundDisplayOptions = uiBackgroundDisplayOptions(context);
    var backgroundOffset = uiBackgroundOffset(context);

    var settingsCustomBackground = uiSettingsCustomBackground(context)
        .on('change', customChanged);


    function setTooltips(selection) {
        selection.each(function(d, i, nodes) {
            var item = d3_select(this).select('label');
            var span = item.select('span');
            var placement = (i < nodes.length / 2) ? 'bottom' : 'top';
            var description = d.description();
            var isOverflowing = (span.property('clientWidth') !== span.property('scrollWidth'));

            item.call(tooltip().destroyAny);

            if (d === _previousBackground) {
                item.call(tooltip()
                    .placement(placement)
                    .html(true)
                    .title(function() {
                        var tip = '<div>' + t('background.switch') + '</div>';
                        return uiTooltipHtml(tip, uiCmd('⌘' + key));
                    })
                );
            } else if (description || isOverflowing) {
                item.call(tooltip()
                    .placement(placement)
                    .title(description || d.name())
                );
            }
        });
    }


    function updateLayerSelections(selection) {
        function active(d) {
            return context.background().showsLayer(d);
        }

        selection.selectAll('li')
            .classed('active', active)
            .classed('switch', function(d) { return d === _previousBackground; })
            .call(setTooltips)
            .selectAll('input')
            .property('checked', active);
    }


    function chooseBackground(d) {
        if (d.id === 'custom' && !d.template()) {
            return editCustom();
        }

        d3_event.preventDefault();
        _previousBackground = context.background().baseLayerSource();
        context.storage('background-last-used-toggle', _previousBackground.id);
        context.storage('background-last-used', d.id);
        context.background().baseLayerSource(d);
        _backgroundList.call(updateLayerSelections);
        document.activeElement.blur();
    }


    function customChanged(d) {
        if (d && d.template) {
            _customSource.template(d.template);
            chooseBackground(_customSource);
        } else {
            _customSource.template('');
            chooseBackground(context.background().findSource('none'));
        }
    }


    function editCustom() {
        d3_event.preventDefault();
        context.container()
            .call(settingsCustomBackground);
    }


    function chooseOverlay(d) {
        d3_event.preventDefault();
        context.background().toggleOverlayLayer(d);
        _overlayList.call(updateLayerSelections);
        document.activeElement.blur();
    }


    function drawListItems(layerList, type, change, filter) {
        var sources = context.background()
            .sources(context.map().extent())
            .filter(filter);

        var layerLinks = layerList.selectAll('li')
            .data(sources, function(d) { return d.name(); });

        layerLinks.exit()
            .remove();

        var enter = layerLinks.enter()
            .append('li')
            .classed('layer-custom', function(d) { return d.id === 'custom'; })
            .classed('best', function(d) { return d.best(); });

        enter.filter(function(d) { return d.id === 'custom'; })
            .append('button')
            .attr('class', 'layer-browse')
            .call(tooltip()
                .title(t('settings.custom_background.tooltip'))
                .placement((textDirection === 'rtl') ? 'right' : 'left')
            )
            .on('click', editCustom)
            .call(svgIcon('#iD-icon-more'));

        enter.filter(function(d) { return d.best(); })
            .append('div')
            .attr('class', 'best')
            .call(tooltip()
                .title(t('background.best_imagery'))
                .placement((textDirection === 'rtl') ? 'right' : 'left')
            )
            .append('span')
            .html('&#9733;');

        var label = enter
            .append('label');

        label
            .append('input')
            .attr('type', type)
            .attr('name', 'layers')
            .on('change', change);

        label
            .append('span')
            .text(function(d) { return d.name(); });


        layerList.selectAll('li')
            .sort(sortSources)
            .style('display', layerList.selectAll('li').data().length > 0 ? 'block' : 'none');

        layerList
            .call(updateLayerSelections);


        function sortSources(a, b) {
            return a.best() && !b.best() ? -1
                : b.best() && !a.best() ? 1
                : d3_descending(a.area(), b.area()) || d3_ascending(a.name(), b.name()) || 0;
        }
    }


    function renderBackgroundList(selection) {

        // the background list
        var container = selection.selectAll('.layer-background-list')
            .data([0]);

        _backgroundList = container.enter()
            .append('ul')
            .attr('class', 'layer-list layer-background-list')
            .attr('dir', 'auto')
            .merge(container);


        // add minimap toggle below list
        var minimapEnter = selection.selectAll('.minimap-toggle-list')
            .data([0])
            .enter()
            .append('ul')
            .attr('class', 'layer-list minimap-toggle-list')
            .append('li')
            .attr('class', 'minimap-toggle-item');

        var minimapLabelEnter = minimapEnter
            .append('label')
            .call(tooltip()
                .html(true)
                .title(uiTooltipHtml(t('background.minimap.tooltip'), t('background.minimap.key')))
                .placement('top')
            );

        minimapLabelEnter
            .append('input')
            .attr('type', 'checkbox')
            .on('change', function() {
                d3_event.preventDefault();
                uiMapInMap.toggle();
            });

        minimapLabelEnter
            .append('span')
            .text(t('background.minimap.description'));


        // "Info / Report a Problem" link
        selection.selectAll('.imagery-faq')
            .data([0])
            .enter()
            .append('div')
            .attr('class', 'imagery-faq')
            .append('a')
            .attr('target', '_blank')
            .attr('tabindex', -1)
            .call(svgIcon('#iD-icon-out-link', 'inline'))
            .attr('href', 'https://github.com/openstreetmap/iD/blob/master/FAQ.md#how-can-i-report-an-issue-with-background-imagery')
            .append('span')
            .text(t('background.imagery_source_faq'));

        updateBackgroundList();
    }


    function renderOverlayList(selection) {
        var container = selection.selectAll('.layer-overlay-list')
            .data([0]);

        _overlayList = container.enter()
            .append('ul')
            .attr('class', 'layer-list layer-overlay-list')
            .attr('dir', 'auto')
            .merge(container);

        updateOverlayList();
    }

    function updateBackgroundList() {
        _backgroundList
            .call(drawListItems, 'radio', chooseBackground, function(d) { return !d.isHidden() && !d.overlay; });
    }

    function updateOverlayList() {
        _overlayList
            .call(drawListItems, 'checkbox', chooseOverlay, function(d) { return !d.isHidden() && d.overlay; });
    }


    function update() {
        if (!_pane.select('.disclosure-wrap-background_list').classed('hide')) {
            updateBackgroundList();
        }

        /*
        // OpenHeritageMap change: Disable the overlay list (not needed)
        if (!_pane.select('.disclosure-wrap-overlay_list').classed('hide')) {
            updateOverlayList();
        }
        */
       
        _displayOptionsContainer
            .call(backgroundDisplayOptions);

        _offsetContainer
            .call(backgroundOffset);
    }


    function quickSwitch() {
        if (d3_event) {
            d3_event.stopImmediatePropagation();
            d3_event.preventDefault();
        }
        if (_previousBackground) {
            chooseBackground(_previousBackground);
        }
    }

    var paneTooltip = tooltip()
        .placement((textDirection === 'rtl') ? 'right' : 'left')
        .html(true)
        .title(uiTooltipHtml(t('background.description'), key));

    uiBackground.togglePane = function() {
        if (d3_event) d3_event.preventDefault();
        paneTooltip.hide(_toggleButton);
        context.ui().togglePanes(!_pane.classed('shown') ? _pane : undefined);
    };

    function hidePane() {
        context.ui().togglePanes();
    }

    uiBackground.renderToggleButton = function(selection) {

        _toggleButton = selection
            .append('button')
            .attr('tabindex', -1)
            .on('click', uiBackground.togglePane)
            .call(svgIcon('#iD-icon-layers', 'light'))
            .call(paneTooltip);
    };

    uiBackground.renderPane = function(selection) {

        _pane = selection
            .append('div')
            .attr('class', 'fillL map-pane background-pane hide')
            .attr('pane', 'background');


        var heading = _pane
            .append('div')
            .attr('class', 'pane-heading');

        heading
            .append('h2')
            .text(t('background.title'));

        heading
            .append('button')
            .on('click', hidePane)
            .call(svgIcon('#iD-icon-close'));


        var content = _pane
            .append('div')
            .attr('class', 'pane-content');

        // background list
        content
            .append('div')
            .attr('class', 'background-background-list-container')
            .call(uiDisclosure(context, 'background_list', true)
                .title(t('background.backgrounds'))
                .content(renderBackgroundList)
            );

        // overlay list
        // OpenHeritageMap change: Disable the Overlays menu (not needed)
        // See also 'update' above.
        /*
        content
            .append('div')
            .attr('class', 'background-overlay-list-container')
            .call(uiDisclosure(context, 'overlay_list', true)
                .title(t('background.overlays'))
                .content(renderOverlayList)
            );
        */

        // display options
        _displayOptionsContainer = content
            .append('div')
            .attr('class', 'background-display-options');

        // offset controls
        _offsetContainer = content
            .append('div')
            .attr('class', 'background-offset');


        // add listeners
        context.map()
            .on('move.background-update',
                _debounce(function() { window.requestIdleCallback(update); }, 1000)
            );


        context.background()
            .on('change.background-update', update);


        update();

        context.keybinding()
            .on(key, uiBackground.togglePane)
            .on(uiCmd('⌘' + key), quickSwitch);
    };

    return uiBackground;
}
