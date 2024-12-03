// Hàm lọc và hiển thị sách theo thể loại
async function filterByCategory(category) {
  try {
    // Gọi API để lấy tất cả sách
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Lọc sách theo thể loại
    const filteredBooks = books.filter((book) => book.category === category);

    // Hiển thị sách theo thể loại
    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    // Thêm tiêu đề thể loại
    const categoryTitle = document.createElement("h2");
    categoryTitle.textContent = `${category}`;
    bookContainer.appendChild(categoryTitle); // Thêm tiêu đề thể loại

    // Kiểm tra nếu không có sách nào trong thể loại này
    if (filteredBooks.length === 0) {
      const noBooksMessage = document.createElement("p");
      noBooksMessage.textContent = "Không có sách trong thể loại này.";
      bookContainer.appendChild(noBooksMessage);
      return; // Dừng lại nếu không có sách nào
    }

    // Hiển thị từng cuốn sách
    filteredBooks.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";
      bookItem.innerHTML = `
                <img src="${book.img || "/img/default-book.jpg"}" alt="${
        book.title
      }" class="book-image">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-price">$${book.price}</p>
                <div class="progress-container">
                    <span class="progress-text">${book.quantity}/30</span>
                    <div class="progress-bar" style="width: ${
                      (book.quantity / 30) * 100
                    }%;"></div>
                </div>
            `;
      bookContainer.appendChild(bookItem); // Thêm sách vào container
    });
  } catch (error) {
    console.error("Error fetching books by category:", error);
  }
}

function filterByHot() {
  // Gọi API để lấy lại danh sách sách
  fetchBooks()
    .then(() => {
      // Sau khi dữ liệu sách được lấy về, ta lọc ra các cuốn sách có quantity nhỏ hơn 10
      const bookContainer = document.querySelector(".book-container");
      const books = bookContainer.querySelectorAll(".book-item");

      // Lọc các cuốn sách có quantity < 10
      books.forEach((bookItem) => {
        const stockText = bookItem.querySelector(".progress-text").textContent;
        const stock = parseInt(stockText.split("/")[0], 10); // Lấy số lượng sách còn lại

        if (stock >= 10) {
          // Nếu sách có quantity >= 10 thì ẩn nó
          bookItem.style.display = "none";
        } else {
          // Nếu sách có quantity < 10 thì thêm chữ "Hot" vào tiêu đề
          const title = bookItem.querySelector(".book-title");
          title.textContent = title.textContent + " - Hot";
          bookItem.style.display = "block"; // Hiển thị sách có quantity < 10
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
}

// Gọi API lấy dữ liệu sách
async function fetchBooks() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Hiển thị sách trên giao diện
    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    books.forEach((book) => {
      const maxStock = 30;
      const stock = book.quantity;
      const stockPercentage = (stock / maxStock) * 100; // Tính phần trăm số sách còn lại

      // Tạo phần tử HTML cho mỗi cuốn sách
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";
      bookItem.innerHTML = `
                    <img src="${book.img || "/img/default-book.jpg"}" alt="${
        book.title
      }" class="book-image">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-price">$${book.price}</p>
                    <div class="progress-container">
                            <span class="progress-text">${stock}/${maxStock}</span>
                        <div class="progress-bar" style="width: ${stockPercentage}%;">
                        </div>
                    </div>
                `;
      // Thêm cuốn sách vào container
      bookContainer.appendChild(bookItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Gọi hàm khi trang được tải
document.addEventListener("DOMContentLoaded", fetchBooks);

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
