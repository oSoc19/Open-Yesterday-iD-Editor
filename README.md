<p align="center"><h1>Open Heritage Map</h1></p>

<p align="center"><img src="svg/open-yesterday-project/crest.svg" width="96"><img src="https://github.com/oSoc19/website/blob/master/img/logo/logo-osoc-color.svg" width="128"></p>

<p align="center">With Open Heritage Map, you can preserve memories about objects or locations that no longer exists. Add or edit information about these memories, like a story or a photograph, on the geographical map and cherish them forever as historical data!</p>

<p align="center">Open Heritage Map is an open Summer of Code 2019 (<a href="https://2019.summerofcode.be/" target="_blank">#oSoC19</a>) project, and made by Open Yesterday. It is based on iD (v2.15), a friendly JavaScript editor for <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>. This project is also sponsored by <a href="http://www.erfgoedzuidwest.
be/" target="_blank">erfgoed zuidwest</a>.</p>

<p align="center"><a href="http://zuidwestprojecten.be/ikxploreermee/index.html">See our project in action here!</a></p>

## Slippy Maps

If you want to display a map with data from OHM on your website, a slippy map is what you're looking for!
Fortunately, we have a project that can help you with that. [Check it out!](https://github.com/oSoc19/Open-Yesterday-SlippyMap)

## Backend

The "image upload" feature of this project depends on a lightweight backend written in NodeJS.
- [Github link](https://github.com/oSoc19/Open-Yesterday-iD-Backend).

## Installation, Cloning & Building

See [INSTALLATION.md](INSTALLATION.md)

## Modifying the project

If you'd like to create nor modify a preset, please check the docs in ./data/presets/README.md
If you are running your own backend (check: https://github.com/osoc19/Open-Yesterday-iD-Backend), you can change the link to the API in `./modules/ui/tools/uploadToWikimedia.js` file.

## License

iD is available under the [ISC License](https://opensource.org/licenses/ISC).
See the [LICENSE.md](LICENSE.md) file for more details.

iD also bundles portions of the following open source software.
* [D3.js (BSD-3-Clause)](https://github.com/d3/d3)
* [editor-layer-index (CC-BY-SA 3.0)](https://github.com/osmlab/editor-layer-index)
* [Font Awesome (CC-BY 4.0)](https://fontawesome.com/license)
* [Maki (CC0 1.0)](https://github.com/mapbox/maki)
* [Mapillary JS (MIT)](https://github.com/mapillary/mapillary-js)
* [name-suggestion-index (BSD-3-Clause)](https://github.com/osmlab/name-suggestion-index)
* [osm-community-index (ISC)](https://github.com/osmlab/osm-community-index)

What has been added as part of the Open Heritage Map project:
* [Siema (MIT)](https://github.com/pawelgrzybek/siema)
