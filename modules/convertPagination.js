const converPagination = function (articles, currentPage) {
  const totalItems = articles.length;
  const perPage = 3;
  const totalPages = Math.ceil(totalItems / perPage);
  const minItem = (currentPage - 1) * perPage + 1;
  const maxItem =
    currentPage * perPage < totalItems ? currentPage * perPage : totalItems;

  const page = {
    totalPages,
    currentPage,
    hasPre: minItem > 1,
    hasNext: currentPage < totalPages,
  };
  articles = articles.slice(minItem - 1, maxItem);

  return {
    articles,
    page,
  };
};

module.exports = converPagination;
