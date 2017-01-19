import lengthenRaw
    from './util/lengthen-raw';

export default function onInit() {
  //Count total number of IDs for population count.
    this.populationCount = d3.set(
            this.raw_data
                .map(d => d[this.config.id_col])
        ).values().length;

  //Remove non-AE records.
    this.superRaw = this.raw_data
        .filter(d => /[^\s]/.test(d[this.config.term_col]));

  //Set empty settings.color_by values to 'N/A'.
    this.superRaw
        .forEach(d => d[this.config.color_by] = /[^\s]/.test(d[this.config.color_by])
            ? d[this.config.color_by]
            : 'N/A');

  //Append unspecified settings.color_by values to settings.legend.order and define a shade of
  //gray for each.
    const color_by_values = d3.set(
            this.superRaw
                .map(d => d[this.config.color_by])
        ).values();
    color_by_values.forEach((color_by_value,i) => {
        let increment = 25;

        if (this.config.legend.order.indexOf(color_by_value) === -1) {
            this.config.legend.order.push(color_by_value);
            this.chart2.config.legend.order.push(color_by_value);

            this.config.colors.push(`rgb(${increment},${increment},${increment})`);
            this.chart2.config.colors.push(`rgb(${increment},${increment},${increment})`);

            increment += 25;
        }
    });

  //Derived data manipulation
    this.raw_data = lengthenRaw(this.superRaw, [this.config.stdy_col, this.config.endy_col]);
    this.raw_data.forEach(d => {
        d.wc_value = d.wc_value
            ? +d.wc_value
            : NaN;
    });

  //Create div for back button and participant ID title.
    this.chart2.wrap.insert('div', ':first-child')
        .attr('id', 'backButton')
        .insert('button', '.legend')
            .html('&#8592; Back')
            .style('cursor', 'pointer')
            .on('click', () => {
                this.wrap.style('display', 'block');
                this.table.draw([]);
                this.chart2.wrap.style('display', 'none');
                this.chart2.wrap.select('.id-title').remove();
                this.controls.wrap.style('display', 'block');
            });
}
