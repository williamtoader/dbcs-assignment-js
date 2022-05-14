export const contentGenerator = {
    generatePost: (data) => {
        return `
<article>
  <section class="title">
    <div class="title-heading">${data.title}</div>
    <div class="subtitle-heading">${data.subtitle}</div>
    <div class="added-by-heading">Added by <b>${data.author}</b></div>
    <div class="date-heading">${data.date}</div>
  </section>
  <section class="right-align-container">
    Edit | Delete
  </section>
  <section style="width: 100%; margin-top: 20px;">
    ${data.image}
  </section>
  <section class="content">
    ${data.content}
  </section>
</article>
`;
    },
    paginateDataArray: (data, division) => {

    }

};
