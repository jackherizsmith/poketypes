const {
    select,
    scaleLinear,
    max,
    scaleBand,
    axisLeft,
    axisBottom
} = d3;
const svg = select("svg");

const height = document.body.clientHeight;
const width = document.body.clientWidth;

const typeColours = {
    Bug: '#A8B820',
    Dragon: '#7038F8',
    Electric: '#F8D030',
    Fighting: '#C03028',
    Fire: '#F08030',
    Flying: '#A890F0', 
    Grass: '#78C850',
    Ghost: '#705898',
    Ground: '#E0C068',
    Ice: '#98D8D8',
    Normal: '#A8A878',
    Poison: '#A040A0',
    Psychic: '#F85888',
    Rock: '#B8A038',
    Steel: '#B8B8D0',
    Water: '#6890F0',
}

function render(data){
    const xValue = d => d.number;
    const yValue = d => d.type;
    const margin = { top: 20, right: 40, bottom: 30, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    
    const xScale = scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, innerWidth]);

    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxis = axisBottom(xScale).tickSize(-innerHeight);
    
    g.append("g")
        .call(axisLeft(yScale))
        .selectAll(".domain, .tick line")
        .attr('class', 'axis-label')
        .remove();

    const xAxisG = g.append("g")
        .call(xAxis.ticks(5))
        .attr("transform", `translate(0, ${innerHeight})`)
        
    xAxisG.select(".domain")
        .remove(); 
        
    g.selectAll("rect")
        .data(data)
        .enter()
            .append("rect")
                .attr("y", (d) => yScale(yValue(d)))
                .attr("height", yScale.bandwidth())
                .attr('fill', d=>typeColours[d.type])
                .transition().duration(2000)
                .attr("width", (d) => xScale(xValue(d)))
                // .append("title")
                //     .text(d => d.number);
}

const typeObj = {};

fetch('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
.then(res=>res.json())
.then(data => {                
    const pokemon = data.pokemon;
    console.log(pokemon)
    pokemon.forEach(pokemon => {
        typeObj[pokemon.type[0]] = typeObj[pokemon.type[0]] ? typeObj[pokemon.type[0]]+1 : 1;
    })
    console.log(typeObj)
    const types = Object.entries(typeObj).map(([type, number]) => ({type,number}));
    console.table(types)
    
    render(types);
});
