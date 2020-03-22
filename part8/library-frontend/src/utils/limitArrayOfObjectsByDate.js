const limitArrayOfObjectsByDate = (array, limit = 3, ascending = false) => {
  if (limit < 1) throw new Error("Invalid Limit");
  if (array.some((i) => !i.date)) throw new Error("No Date Property On Items");

  if (array.length <= limit) {
    return array;
  } else {
    const arrayByDateDesc = [...array].sort((a, b) => b.date - a.date);

    if (ascending) {
      const lastThreeItemsAsc = arrayByDateDesc.slice(0, limit);
      return lastThreeItemsAsc;
    } else {
      const lastThreeItemsDesc = arrayByDateDesc.slice(0, limit).reverse();
      return lastThreeItemsDesc;
    }
  }
};

export default limitArrayOfObjectsByDate;
