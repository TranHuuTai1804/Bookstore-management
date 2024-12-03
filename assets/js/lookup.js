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
function selectInput(list) {
  searchInput.value = list.innerHTML;
  resultIp.innerHTML = ""; // Xóa kết quả sau khi chọn
}

// Hàm hiển thị danh sách mặc định
async function showDefaultList(button = null) {
  try {
    // Gọi API để lấy tất cả sách
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Hiển thị danh sách mặc định
    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    books.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";
      bookItem.innerHTML = `
                    <img src="${book.img || "/book/book1.png"}" alt="${
        book.title
      }" class="book-image">
                    <h3 class="book-title">${book.Ten_sach}</h3>
                    <p class="book-price">$${book.Gia}</p>
                    <div class="progress-container">
                        <span class="progress-text">${book.So_luong}/30</span>
                        <div class="progress-bar" style="width: ${
                          (book.So_luong / 30) * 100
                        }%;"></div>
                    </div>
                `;
      bookContainer.appendChild(bookItem);
    });

    // Cập nhật nút active
    updateActiveButton(button);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

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
        ? book.So_luong < 10 // Logic riêng cho "Hot"
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
    updateActiveButton(button);
  } catch (error) {
    console.error("Error fetching books by category:", error);
  }
}

// Hàm cập nhật trạng thái nút active
function updateActiveButton(button) {
  // Xóa class active khỏi tất cả nút
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Gán class active cho nút hiện tại
  if (button) {
    button.classList.add("active");
  }
}

// Khi trang được tải, hiển thị danh sách mặc định
document.addEventListener("DOMContentLoaded", () => {
  showDefaultList(document.getElementById("allBtn"));
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
