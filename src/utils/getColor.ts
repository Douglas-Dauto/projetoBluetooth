export function getColor(signal: number): string {
    let color = '';

    if (signal >= -59) {
        color = 'red';
    } else if (signal >= -69) {
        color = 'orange';
    } else if (signal >= -79) {
        color = 'yellow';
    } else if (signal >= -89) {
        color = 'green';
    } else if (signal >= -99) {
        color = 'blue';
    } else {
        color = 'black';
    }

    return color
}
