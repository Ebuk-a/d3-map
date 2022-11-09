const height = 900;
const width = 950;

let numberOfCitiesDisplayed = 10;
let cityData = [];

const mainWrapper = d3.select("#map").attr("class", "main-wrapper");

const svg = mainWrapper
	.append("div")
	.attr("class", "svg-container")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("id", "svg_id");

const projection = d3
	.geoNaturalEarth1()
	.translate([width / 2, height / 2])
	.scale(3400)
	.center([-5, 53]);
const path = d3.geoPath().projection(projection);

d3.json("https://yamu.pro/gb.json", function (error, data) {
	svg
		.selectAll(".land")
		.data(data.features)
		.enter()
		.append("path")
		.attr("class", "country")
		.attr("d", path)
		.append("title")
		.text("Great Britain");
});

const plotMap = () => {
	svg.selectAll(".data").remove();

	d3.json(
		`http://34.78.46.186/Circles/Towns/${numberOfCitiesDisplayed}`,
		function (error, data) {
			if (error) {
				console.log(error);
				return;
			}

			cityData = sortData(data);

			const groupElement = svg
				.selectAll(".data")
				.data(data)
				.enter()
				.append("g")
				.attr("class", "data")
				.on("mouseenter", (data) => {
					const { County, Population, Town, lng, lat } = data;
					const coords = projection([lng, lat]);
					const tooltipContainer = svg
						.append("g")
						.attr("class", "tooltip-container")
						.attr(
							"transform",
							`translate(${coords[0] * 1.02}, ${coords[1] * 1.03})`
						);

					tooltipContainer
						.append("rect")
						.attr("class", "tooltip-bg")
						.attr("rx", 10);

					getTooltipInfo(tooltipContainer, "Town:", "town-tooltip");
					getTooltipInfo(tooltipContainer, Town, "", 55);

					getTooltipInfo(tooltipContainer, "County:", "county-tooltip", 6, 48);
					getTooltipInfo(tooltipContainer, County, "", 68, 48);

					getTooltipInfo(
						tooltipContainer,
						"Population:",
						"population-tooltip",
						6,
						72
					);
					getTooltipInfo(
						tooltipContainer,
						formatNumber(Population),
						"",
						96,
						72
					);
				})
				.on("mouseleave", () => {
					svg.selectAll(".tooltip-container").remove();
				});

			groupElement
				.append("circle")
				.attr("class", (d) => {
					return `towns ${d.Town}`;
				})
				.attr("r", 8)
				.attr("cx", function (d) {
					const coords = projection([d.lng, d.lat]);
					return coords[0];
				})
				.attr("cy", function (d) {
					const coords = projection([d.lng, d.lat]);
					return coords[1];
				})
				;

			// groupElement
			// 	.append("text")
			// 	.attr("class", "text")
			// 	.attr("dx", 0)
			// 	.attr("dx", function (d) {
			// 		const coords = projection([d.lng, d.lat]);
			// 		return coords[0] * 1.02;
			// 	})
			// 	.attr("dy", function (d) {
			// 		const coords = projection([d.lng, d.lat]);
			// 		return coords[1] * 1.01;
			// 	})
			// 	.text(function (d) {
			// 		return d.Town;
			// 	});

			groupElement
				.append("text")
				.attr("class", "text")
				.attr("dx", 0)
				.transition()
				.duration(1000)
				.attr("dx", function (d) {
					const coords = projection([d.lng, d.lat]);
					return coords[0] * 1.02;
				})
				.attr("dy", function (d) {
					const coords = projection([d.lng, d.lat]);
					return coords[1] * 1.01;
				})
				.text(function (d) {
					return d.Town;
				});
		}
	);
};

const sideContainer = mainWrapper.append("div").attr("class", "side-container");
sideContainer
	.append("h1")
	.text("Slide To Increase Number")
	.attr("class", "header");


const cityInfo = sideContainer.append("div");
const btnContainer = sideContainer.append("div");

cityInfo
	.append("input")
	.attr("type", "range")
	.attr("max", "500")
	.attr("min", "0")
	.attr("value", "10")
	.attr("step", "10")
	.on("change", () => {
		numberOfCitiesDisplayed = sideContainer.select("input").node().value;
		showNumberOfCities(numberOfCitiesDisplayed);
		plotMap();
	});

const showNumberOfCities = (num) => {
	cityInfo.selectAll("h2").remove();
	cityInfo.append("h2").append("h2").text(num).attr("class", "city-number");
};

btnContainer
	.append("div")
	.append("button")
	.text("Shuffle Cities")
	.attr("class", "btn")
	.on("click", () => plotMap());

sideContainer
	.append("h2")
	.text("Akwiwu-Uzoma, Chukwuebuka Canice")
	.attr("class", "header");

sideContainer
	.append("h2")
	.text("2487418@dundee.ac.uk")
	.attr("class", "header");


plotMap();
showNumberOfCities(numberOfCitiesDisplayed);
