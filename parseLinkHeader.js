// Order: First, Prev, Next, Last
export const parseLinkHeader = (header) => header.match(/<.+?>/g).map(x => x.substr(1, x.length - 2))