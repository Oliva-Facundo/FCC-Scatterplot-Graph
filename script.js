document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      const w = 1000;
      const h = 500;
      const p = 50;

      const legend = [
        { text: "Doping", color: "blue" },
        { text: "No Doping", color: "red" },
      ];

      const svg = d3.select("#chart").attr("width", w).attr("height", h);

      const xScale = d3
        .scaleLinear()
        .domain([1993, 2016])
        .range([p, w - p]);

      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => new Date(d.Seconds * 1000)))
        .range([h - p, p]);

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

      svg
        .append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - p})`);

      svg
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${p}, 0)`);

      svg
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
        .attr("r", 5)
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => new Date(d.Seconds * 1000).toISOString())
        .attr("fill", (d) => (d.Doping ? "blue" : "red"))
        .on("mouseover", (e, d) => {
          const tooltip = document.getElementById("tooltip");
          tooltip.style.display = "block";
          tooltip.style.left = e.pageX + 10 + "px";
          tooltip.style.top = e.pageY - 20 + "px";
          tooltip.innerHTML = `
          Year: ${d.Year} <br>
          Time: ${d.Time} <br>
          ${d.Doping ? d.Doping : "No Doping Allegation"}`;
          tooltip.setAttribute("data-year", d.Year);
        })
        .on("mouseout", () => {
          document.getElementById("tooltip").style.display = "none";
        });

      const legendGroup = svg
        .append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${w - 100}, ${h / 2})`);

      const legendItems = legendGroup
        .selectAll(".legend-item")
        .data(legend)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      legendItems
        .append("text")
        .attr("x", 15)
        .attr("y", 8)
        .text((d) => d.text);

      legendItems
        .append("circle")
        .attr("cx", 5)
        .attr("cy", 5)
        .attr("r", 5)
        .style("fill", (d) => d.color);

      d3.select("#title").text("Doping in Professional Bicycle Racing");
    });
});
