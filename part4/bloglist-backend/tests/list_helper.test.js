const listHelper = require("../utils/list_helper");

const listWithNoBlogs = [];

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const listWithMultipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const result = listHelper.dummy(listWithNoBlogs);
  expect(result).toBe(1);
});

describe("totalLikes(Array.<Blog>)", () => {
  test("of empty list returns zero", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test("of list with single Blog returns number of likes of that Blog", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of list with multple Blogs returns the sum of each Blog's likes", () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    expect(result).toBe(36);
  });
});

describe("favoriteBlog(Array.<Blog>)", () => {
  test("of empty list returns null", () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toEqual(null);
  });

  test("of non-empty list returns object {title, author, likes}", () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs);
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("author");
    expect(result).toHaveProperty("likes");
  });

  describe("AND...", () => {
    test(".title is the title of the most liked blog", () => {
      const result = listHelper.favoriteBlog(listWithMultipleBlogs);
      expect(result.title).toBe("Canonical string reduction");
    });

    test(".author is the author of the most liked blog", () => {
      const result = listHelper.favoriteBlog(listWithMultipleBlogs);
      expect(result.author).toBe("Edsger W. Dijkstra");
    });

    test(".likes is the number of likes of the most liked blog", () => {
      const result = listHelper.favoriteBlog(listWithMultipleBlogs);
      expect(result.likes).toBe(12);
    });
  });
});

describe("mostBlogs(Array.<Blog>)", () => {
  test("of empty list returns null", () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(null);
  });

  test("of non-empty list returns object {author, blogs}", () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs);
    expect(result).toHaveProperty("author");
    expect(result).toHaveProperty("blogs");
  });

  describe("AND...", () => {
    test(".author is the author with the most blogs", () => {
      const result = listHelper.mostBlogs(listWithMultipleBlogs);
      expect(result.author).toBe("Robert C. Martin");
    });

    test(".blogs is the number of blogs by the author", () => {
      const result = listHelper.mostBlogs(listWithMultipleBlogs);
      expect(result.blogs).toBe(3);
    });
  });
});

describe("mostLikes(Array.<Blog>)", () => {
  test("of empty list returns null", () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBe(null);
  });

  test("of non-empty list returns object {author, likes}", () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs);
    expect(result).toHaveProperty("author");
    expect(result).toHaveProperty("likes");
  });

  describe("AND...", () => {
    test(".author is the author with the most likes", () => {
      const result = listHelper.mostLikes(listWithMultipleBlogs);
      expect(result.author).toBe("Edsger W. Dijkstra");
    });

    test(".likes is the total likes of the author's blogs", () => {
      const result = listHelper.mostLikes(listWithMultipleBlogs);
      expect(result.likes).toBe(17);
    });
  });
});
