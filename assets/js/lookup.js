// Hàm lấy giá trị So_luong_ton_it_nhat từ server
async function fetchSoLuongTonItHon() {
  try {
    const response = await fetch("/regulation");
    if (!response.ok) {
      throw new Error("Failed to fetch regulation");
    }
    const regulations = await response.json();
    const soLuongTonItHon = regulations?.[0]?.So_luong_ton_it_hon;

    // console.log(soLuongTonItHon);

    if (soLuongTonItHon !== undefined) {
      return soLuongTonItHon;
    } else {
      console.error("Không tìm thấy giá trị So_luong_ton_it_hon");
      return 0; // Hoặc một giá trị mặc định nếu không có
    }
  } catch (error) {
    console.error("Error fetching So_luong_ton_it_nhat:", error);
    return 0; // Giá trị mặc định nếu có lỗi
  }
}

// Khởi tạo mảng chứa tên sách
let bookTitles = [];

// Hàm lấy danh sách sách từ API và cập nhật mảng bookTitles
async function fetchBookTitles() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Cập nhật mảng bookTitles với danh sách tên sách
    bookTitles = books.map((book) => book.Ten_sach);

    // Đảm bảo rằng kết quả được hiển thị sau khi dữ liệu đã được lấy
    console.log("Danh sách tên sách hiện tại:", bookTitles);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Gọi hàm fetchBookTitles để lấy dữ liệu và cập nhật mảng ngay khi trang được tải
document.addEventListener("DOMContentLoaded", async () => {
  await fetchBookTitles(); // Đảm bảo dữ liệu được tải trước khi cho phép tìm kiếm
  await showDefaultList(); // Hiển thị tất cả các sách ngay khi trang tải
});

// Định nghĩa các phần tử trong DOM
const resultIp = document.querySelector(".result-ip");
const searchInput = document.querySelector(".search-input");

// Xử lý sự kiện keyup khi người dùng nhập vào ô tìm kiếm
searchInput.onkeyup = function () {
  let result = [];
  let input = searchInput.value;

  // Nếu input có dữ liệu
  if (input.length) {
    result = bookTitles.filter((keyword) => {
      return keyword.toLowerCase().includes(input.toLowerCase());
    });

    // Hiển thị kết quả tìm kiếm
    display(result);
  }

  // Nếu không có kết quả, xóa danh sách kết quả
  if (!input.length || !result.length) {
    resultIp.innerHTML = "";
  }
};

// Hàm hiển thị kết quả tìm kiếm
function display(result) {
  const content = result.map((list) => {
    return "<li onclick=selectInput(this)>" + list + "</li>";
  });

  // Thêm danh sách vào resultIp
  resultIp.innerHTML = "<ul>" + content.join("") + "</ul>";
}
// Hàm khi người dùng chọn kết quả tìm kiếm
async function selectInput(list) {
  // Cập nhật giá trị ô input với tên sách được chọn
  searchInput.value = list.innerHTML;
  resultIp.innerHTML = ""; // Xóa kết quả sau khi chọn

  try {
    // Gọi API để lấy danh sách sách
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Lấy giá trị So_luong_ton_it_nhat từ quy định
    const soLuongTonItHon = await fetchSoLuongTonItHon();

    // Tìm cuốn sách có tên khớp với tên được chọn
    const selectedBook = books.find((book) => book.Ten_sach === list.innerHTML);

    if (selectedBook) {
      // Hiển thị thông tin chi tiết sách trong khối
      const bookContainer = document.querySelector(".book-container");
      bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

      const bookDetail = document.createElement("div");
      bookDetail.className = "book-detail";
      bookDetail.innerHTML = `
        <div class="book-image-container">
          <img src="${selectedBook.img || "/book/book1.png"}" alt="${
        selectedBook.Ten_sach
      }" class="book-image">
        </div>
        <div class="book-info">
          <h2 class="book-title">${selectedBook.Ten_sach}</h2>
          <p class="book-category">Thể loại: ${selectedBook.The_loai}</p>
          <p class="book-author">Tác giả: ${selectedBook.Ten_tac_gia}</p>
          <p class="book-price">Giá: $${selectedBook.Gia}</p>
          <div class="progress-container">
            <span class="progress-text">${
              selectedBook.So_luong
            }/${soLuongTonItHon}</span>
            <div class="progress-bar" style="width: ${
              (selectedBook.So_luong / soLuongTonItHon) * 100
            }%;"></div>
          </div>
        </div>
      `;
      bookContainer.appendChild(bookDetail);
    } else {
      console.error("Không tìm thấy thông tin sách.");
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
}
// Hàm hiển thị danh sách mặc định (tất cả các loại sách)
async function showDefaultList() {
  try {
    // Gọi API để lấy tất cả sách
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Lấy giá trị So_luong_ton_it_nhat từ quy định
    const soLuongTonItHon = await fetchSoLuongTonItHon();

    // Hiển thị danh sách mặc định
    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    books.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";
      bookItem.innerHTML = `
        <img src="${book.img || "/book/book1.png"}" alt="${
        book.Ten_sach
      }" class="book-image">
        <h3 class="book-title">${book.Ten_sach}</h3>
        <p class="book-price">$${book.Gia}</p>
        <div class="progress-container">
          <span class="progress-text">${book.So_luong}/${soLuongTonItHon}</span>
          <div class="progress-bar" style="width: ${
            (book.So_luong / soLuongTonItHon) * 100
          }%;"></div>
        </div>
      `;

      // Thêm sự kiện click để hiển thị chi tiết sách khi người dùng click vào sách
      bookItem.addEventListener("click", () => selectBook(book));

      bookContainer.appendChild(bookItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Hàm khi người dùng chọn sách từ danh sách
async function selectBook(book) {
  const bookContainer = document.querySelector(".book-container");
  bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

  // Lấy giá trị So_luong_ton_it_nhat từ quy định
  const soLuongTonItHon = await fetchSoLuongTonItHon();

  const bookDetail = document.createElement("div");
  bookDetail.className = "book-detail";
  bookDetail.innerHTML = `
    <div class="book-image-container">
      <img src="${book.img || "/book/book1.png"}" alt="${
    book.Ten_sach
  }" class="book-image">
    </div>
    <div class="book-info">
      <h2 class="book-title">${book.Ten_sach}</h2>
      <p class="book-category">Thể loại: ${book.The_loai}</p>
      <p class="book-author">Tác giả: ${book.Ten_tac_gia}</p>
      <p class="book-price">Giá: $${book.Gia}</p>
      <div class="progress-container">
        <span class="progress-text">${book.So_luong}/${soLuongTonItHon}</span>
        <div class="progress-bar" style="width: ${
          (book.So_luong / soLuongTonItHon) * 100
        }%;"></div>
      </div>
    </div>
  `;
  bookContainer.appendChild(bookDetail);
}
// Khi trang được tải, hiển thị danh sách mặc định
document.addEventListener("DOMContentLoaded", () => {
  showDefaultList(); // Hiển thị tất cả các sách ngay khi trang tải
});

// Hàm hiển thị danh sách sách theo thể loại
async function filterByCategory(category, button) {
  try {
    // Gọi API để lấy tất cả sách
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Lọc sách theo thể loại
    const filteredBooks = books.filter((book) =>
      category === "Hot"
        ? book.So_luong < 100 // Logic riêng cho "Hot"
        : book.The_loai === category
    );

    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    // Kiểm tra nếu không có sách nào
    if (filteredBooks.length === 0) {
      const noBooksMessage = document.createElement("p");
      noBooksMessage.textContent = "Không có sách trong danh mục này.";
      bookContainer.appendChild(noBooksMessage);
      return;
    }

    // Tạo bảng danh sách sách
    const table = document.createElement("table");
    table.className = "book-table";
    table.innerHTML = `
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredBooks
                      .map(
                        (book, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${book.Ten_sach}</td>
                            <td>${book.The_loai}</td>
                            <td>${book.Ten_tac_gia}</td>
                            <td>${book.So_luong}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            `;
    bookContainer.appendChild(table);

    // Cập nhật nút active
  } catch (error) {
    console.error("Error fetching books by category:", error);
  }
}

// Hàm để tải danh sách tác giả từ server và hiển thị trong dropdown
function loadAuthors() {
  // Giả sử bạn có một API để lấy danh sách tác giả
  fetch("/api/books")
    .then((response) => response.json())
    .then((authors) => {
      const authorDropdown = document.getElementById("authorDropdown");
      authorDropdown.innerHTML = ""; // Xóa danh sách cũ

      authors.forEach((author) => {
        const authorButton = document.createElement("button");
        authorButton.classList.add("filter-btn");
        authorButton.textContent = author.Ten_tac_gia;
        authorButton.onclick = () => selectAuthor(author.Ten_tac_gia); // Gọi selectAuthor khi nhấp vào tác giả
        authorDropdown.appendChild(authorButton);
      });
    })
    .catch((error) => console.error("Lỗi khi lấy danh sách tác giả:", error));
}

// Hàm toggle dropdown cho tác giả
function toggleAuthorDropdown() {
  const authorDropdown = document.getElementById("authorDropdown");
  authorDropdown.classList.toggle("show"); // Thêm hoặc xóa lớp 'show' để hiển thị/ẩn dropdown
}

// Hàm chọn tác giả và hiển thị tên tác giả đã chọn
async function selectAuthor(authorName) {
  // Đóng dropdown khi đã chọn tác giả
  const authorDropdown = document.getElementById("authorDropdown");
  authorDropdown.classList.remove("show");

  // Gọi API để lấy tất cả sách
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Lọc sách theo tác giả đã chọn
    const filteredBooks = books.filter(
      (book) => book.Ten_tac_gia === authorName
    );

    // Lấy giá trị So_luong_ton_it_nhat từ quy định
    const soLuongTonItHon = await fetchSoLuongTonItHon();

    // Hiển thị danh sách sách của tác giả
    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    filteredBooks.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";
      bookItem.innerHTML = `
        <img src="${book.img || "/book/book1.png"}" alt="${
        book.Ten_sach
      }" class="book-image">
        <h3 class="book-title">${book.Ten_sach}</h3>
        <p class="book-price">$${book.Gia}</p>
        <div class="progress-container">
          <span class="progress-text">${book.So_luong}/${soLuongTonItHon}</span>
          <div class="progress-bar" style="width: ${
            (book.So_luong / soLuongTonItHon) * 100
          }%;"></div>
        </div>
      `;

      // Thêm sự kiện click để hiển thị chi tiết sách khi người dùng click vào sách
      bookItem.addEventListener("click", () => selectBook(book));

      bookContainer.appendChild(bookItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Hàm toggle dropdown cho thể loại
function toggleDropdown() {
  const categoryDropdown = document.getElementById("categoryDropdown");
  categoryDropdown.classList.toggle("show");
}

// Hàm gọi khi trang web được tải
window.onload = () => {
  loadAuthors(); // Tải danh sách tác giả khi trang web tải
};

// Hàm ẩn các dropdown khi người dùng click ra ngoài
document.addEventListener("click", function (e) {
  const categoryDropdown = document.getElementById("categoryDropdown");
  const authorDropdown = document.getElementById("authorDropdown");

  if (!e.target.closest(".dropdown")) {
    categoryDropdown.classList.remove("show");
    authorDropdown.classList.remove("show");
  }
});

function toggleMenu() {
  const menu = document.getElementById("hero-menu");
  const overlay = document.getElementById("overlay");
  const icon = document.querySelector(".open-menu");
  const body = document.body;

  // Kiểm tra nếu menu đang ẩn
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "block"; // Mở menu
    setTimeout(() => {
      menu.style.left = "0"; // Đặt menu vào vị trí mong muốn với hiệu ứng trượt
    }, 10); // Đảm bảo hiệu ứng trượt được áp dụng
    overlay.style.display = "block"; // Hiện overlay
    icon.textContent = "<"; // Đổi icon thành '<'

    // Thêm lớp menu-open để di chuyển icon
    body.classList.add("menu-open");
  } else {
    menu.style.left = "-30%"; // Ẩn menu với hiệu ứng trượt
    overlay.style.display = "none"; // Ẩn overlay
    icon.textContent = ">"; // Đổi icon thành '>'

    // Loại bỏ lớp menu-open để di chuyển icon về vị trí ban đầu
    body.classList.remove("menu-open");

    setTimeout(() => {
      menu.style.display = "none"; // Ẩn menu sau khi trượt hoàn tất
    }, 300); // Thời gian trượt hoàn tất trước khi ẩn menu
  }
}

// Ẩn thanh cuộn khi người dùng lướt lên hoặc xuống
const menuOv = document.getElementById("hero-menu");

menuOv.addEventListener("scroll", function () {
  menuOv.style.scrollbarWidth = "none"; // Ẩn thanh cuộn khi lướt
  clearTimeout(menuOv.scrollTimeout);

  menuOv.scrollTimeout = setTimeout(function () {
    menuOv.style.scrollbarWidth = "thin"; // Hiển thị lại thanh cuộn khi ngừng lướt
  }, 100); // Ẩn thanh cuộn khi lướt và hiển thị lại sau khi ngừng
});
