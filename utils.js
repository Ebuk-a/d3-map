function sortData(data) {
	return data.sort((a, b) => a.Population - b.Population);
}

function getTooltipInfo(container, text, customClass = "", x = 6, y = 24) {
	return container
		.append("text")
		.text(text)
		.attr("class", customClass)
		.attr("x", x)
		.attr("y", y);
}

function formatNumber(number) {
	return new Intl.NumberFormat().format(number);
}
