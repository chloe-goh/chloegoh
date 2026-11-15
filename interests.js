
// ========================================
// LITTLE.SPACE — INTERACTIVE TRAVEL MAP
// ========================================

const visitedCountries = {
    SGP: "Singapore",
    USA: "United States",
    CHN: "China",
    KOR: "South Korea",
    JPN: "Japan",
    KHM: "Cambodia",
    IDN: "Indonesia",
    MYS: "Malaysia",
    PHL: "Philippines",
    NPL: "Nepal",
    FRA: "France",
    CHE: "Switzerland",
    AUT: "Austria",
    SVN: "Slovenia",
    HRV: "Croatia",
    HUN: "Hungary",
    VNM: "Vietnam",
    THA: "Thailand"
};

// Country names used as a fallback when a GeoJSON code is missing.
const visitedNames = new Set(
    Object.values(visitedCountries).map(name => name.toLowerCase())
);

// Update the counter.
const visitedCount = document.getElementById("visited-count");

if (visitedCount) {
    visitedCount.textContent = Object.keys(visitedCountries).length;
}

const mapElement = document.getElementById("world-map");

if (mapElement && typeof L !== "undefined") {

    const map = L.map("world-map", {
        zoomControl: true,
        scrollWheelZoom: false,
        minZoom: 1.5,
        maxZoom: 6,
        worldCopyJump: true
    });

    map.setView([20, 10], 2);

    const countryInfo = document.getElementById("map-country-info");

    function getCountryCode(properties) {
        const possibleCodes = [
            properties.ISO_A3,
            properties.ISO_A3_EH,
            properties.ADM0_A3,
            properties.SOV_A3,
            properties["ISO3166-1-Alpha-3"]
        ];

        return possibleCodes.find(code =>
            code && code !== "-99" && code !== "-1"
        );
    }

    function isVisited(properties) {
        const code = getCountryCode(properties);

        const name = (
            properties.ADMIN ||
            properties.name ||
            properties.NAME ||
            ""
        ).toLowerCase();

        return (
            (code && Object.prototype.hasOwnProperty.call(
                visitedCountries, code
            )) ||
            visitedNames.has(name)
        );
    }

    function countryStyle(feature) {
        const visited = isVisited(feature.properties);

        return {
            fillColor: visited ? "#8b9b85" : "#e8e6de",
            weight: 0.8,
            opacity: 1,
            color: "#f8f7f2",
            fillOpacity: visited ? 0.95 : 0.8
        };
    }

    function showCountry(feature, layer) {
        const properties = feature.properties;

        const name =
            properties.ADMIN ||
            properties.name ||
            properties.NAME ||
            "Unknown country";

        const visited = isVisited(properties);

        layer.bindTooltip(name, {
            sticky: true,
            direction: "top"
        });

        layer.on("click", function () {
            if (countryInfo) {
                countryInfo.innerHTML = `
                    <span class="map-label">
                        ${visited ? "A PLACE I'VE VISITED" : "SOMEDAY, PERHAPS"}
                    </span>
                    <h3>${name}</h3>
                    <p>
                        ${visited
                            ? "a little more of the world collected."
                            : "not yet explored — perhaps a future adventure."}
                    </p>
                `;
            }
        });

        layer.on("mouseover", function () {
            layer.setStyle({
                weight: 1.8,
                color: "#8b9b85"
            });
        });

        layer.on("mouseout", function () {
            layer.setStyle(countryStyle(feature));
        });
    }

    fetch(
        "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    )
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load country boundaries.");
            }
            return response.json();
        })
        .then(data => {
            const countriesLayer = L.geoJSON(data, {
                style: countryStyle,
                onEachFeature: showCountry
            }).addTo(map);

            map.fitBounds(countriesLayer.getBounds(), {
                padding: [10, 10]
            });

            // Leaflet sometimes needs a size refresh after layout changes.
            setTimeout(() => map.invalidateSize(), 100);
        })
        .catch(error => {
            console.error("Travel map error:", error);
            mapElement.innerHTML =
                "The map could not load. Please check your internet connection.";
        });

} else if (mapElement) {
    mapElement.innerHTML =
        "The map library did not load. Please check your Leaflet script imports.";
}
