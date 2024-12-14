let booksList = [];

// Hàm lấy danh sách sách từ API và cập nhật mảng booksList
async function fetchBookTitles() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Cập nhật mảng booksList với tên sách, thể loại và tác giả
    booksList = books.map((book) => ({
      ID_sach: book.ID_sach,
      Ten_sach: book.Ten_sach,
      The_loai: book.The_loai,
      Ten_tac_gia: book.Ten_tac_gia,
    }));

    // Đảm bảo rằng kết quả được hiển thị sau khi dữ liệu đã được lấy
    console.log("Danh sách sách hiện tại:", booksList);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Gọi hàm fetchBookTitles và đảm bảo rằng dữ liệu được tải xong trước khi cho phép tìm kiếm
document.addEventListener("DOMContentLoaded", async () => {
  await fetchBookTitles(); // Đảm bảo dữ liệu đã được tải về
});

// Hàm để hiển thị các gợi ý
function showSuggestions(inputElement) {
  const suggestionsBox = inputElement.nextElementSibling; // Lấy thẻ div chứa gợi ý
  const searchTerm = inputElement.value.trim().toLowerCase();

  // Nếu không có gì để tìm, ẩn gợi ý
  if (!searchTerm) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Lọc danh sách sách dựa trên từ khóa người dùng nhập (so sánh tên sách)
  const filteredBooks = booksList.filter(
    (book) => book.Ten_sach.toLowerCase().includes(searchTerm) // Tìm theo tên sách
  );

  // Nếu không tìm thấy gợi ý nào, ẩn gợi ý
  if (filteredBooks.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Hiển thị các gợi ý
  suggestionsBox.innerHTML = filteredBooks
    .map(
      (book) =>
        `<div onclick="selectSuggestion('${book.Ten_sach}', '${inputElement.id}')">${book.Ten_sach}</div>` // Hiển thị tên sách
    )
    .join("");
  suggestionsBox.style.display = "block";
}

// Hàm khi người dùng chọn một gợi ý
function selectSuggestion(book, inputId) {
  const inputElement = document.getElementById(inputId);
  inputElement.value = book; // Gán giá trị gợi ý vào ô input
  inputElement.nextElementSibling.style.display = "none"; // Ẩn gợi ý

  // Tìm sách trong danh sách để lấy thông tin Thể loại và Tác giả
  const selectedBook = booksList.find((b) => b.Ten_sach === book);

  if (selectedBook) {
    // Tự động điền Thể loại và Tác giả vào các ô input tương ứng
    document.getElementById(
      inputId.replace("nameBookInput", "categoryInput")
    ).value = selectedBook.The_loai;
    document.getElementById(inputId.replace("nameBookInput", "idInput")).value =
      selectedBook.ID_sach;
    document.getElementById(
      inputId.replace("nameBookInput", "authorInput")
    ).value = selectedBook.Ten_tac_gia;
  }
}

// Ẩn gợi ý khi người dùng nhấp bên ngoài
document.addEventListener("click", function (e) {
  if (
    !e.target.matches(".book-name") &&
    !e.target.matches(".autocomplete-suggestions div")
  ) {
    document
      .querySelectorAll(".autocomplete-suggestions")
      .forEach((suggestion) => {
        suggestion.style.display = "none";
      });
  }
});

// Lấy thẻ input ngày
const dateInput = document.getElementById("date-receipt");

// Hàm để lấy ngày hiện tại theo định dạng YYYY-MM-DD
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Gán ngày hiện tại vào thẻ input khi trang được tải lên
dateInput.value = getCurrentDate();

// Cập nhật ngày khi người dùng nhấp vào thẻ input
dateInput.addEventListener("focus", function () {
  dateInput.value = getCurrentDate(); // Gán lại ngày hiện tại nếu có thay đổi
});

// Hàm toggle menu
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
    }, 10);
    overlay.style.display = "block";
    icon.textContent = "<";

    // Thêm lớp menu-open để di chuyển icon
    body.classList.add("menu-open");
  } else {
    menu.style.left = "-30%"; // Ẩn menu với hiệu ứng trượt
    overlay.style.display = "none";
    icon.textContent = ">";

    // Loại bỏ lớp menu-open để di chuyển icon về vị trí ban đầu
    body.classList.remove("menu-open");

    setTimeout(() => {
      menu.style.display = "none";
    }, 300);
  }
}

// Hàm thêm dòng mới vào bảng với id duy nhất cho mỗi ô input
function addRow() {
  const tableBody = document.getElementById("table-body");
  const newRow = document.createElement("tr");

  const uniqueId = Date.now(); // Tạo id duy nhất cho các ô input

  newRow.innerHTML = `
        <td><input type="text" placeholder="ID" class="book-no" id="idInput_${uniqueId}" required></td>
    <td class="nameBook">
        <input type="text" placeholder="Book name" class="book-name" id="nameBookInput_${uniqueId}" oninput="showSuggestions(this)" required>
        <div class="autocomplete-suggestions" style="display: none;"></div>
    </td>
    <td><input type="text" placeholder="Category" class="book-category" id="categoryInput_${uniqueId}" required></td>
    <td><input type="text" placeholder="Author" class="book-author" id="authorInput_${uniqueId}" required></td>
    <td><input type="number" placeholder="Quantity" class="book-quantity" id="quantityInput_${uniqueId}" min="1" required></td>
  `;
  tableBody.appendChild(newRow);
}

// Hàm xử lý khi nhấn nút Done với id duy nhất cho từng ô input
function submitBooks() {
  const rows = document.querySelectorAll("#table-body tr");
  const books = [];
  let hasEmptyField = false;

  rows.forEach((row) => {
    const cells = row.querySelectorAll("input");
    const bookData = {
      no: cells[0].value.trim(),
      name: cells[1].value.trim(),
      category: cells[2].value.trim(),
      author: cells[3].value.trim(),
      quantity: cells[4].value.trim(),
    };

    if (
      !bookData.no ||
      !bookData.name ||
      !bookData.category ||
      !bookData.author ||
      !bookData.quantity
    ) {
      hasEmptyField = true;
    }
    books.push(bookData);
  });

  if (hasEmptyField) {
    showToast("error");
    return;
  }

  console.log("Books data:", books);

  showToast("success");

  // Làm mới bảng sau khi nhấn Done
  document.getElementById("table-body").innerHTML = `
        <tr>
            <td><input type="text" name="id" placeholder="ID" id="idInput_1" required></td>
            <td><input type="text" name="book" placeholder="Book Name" id="nameBookInput_1" oninput="showSuggestions(this)" required></td>
            <td><input type="text" name="category" placeholder="Category" id="categoryInput_1" required></td>
            <td><input type="text" name="author" placeholder="Author" id="authorInput_1" required></td>
            <td><input type="number" name="quantity" placeholder="Quantity" id="quantityInput_1" min="1" required></td>
        </tr>
    `;
}

// Hiển thị toast
function showToast(type) {
  // Lấy phần tử toast tương ứng
  const toast =
    type === "success"
      ? document.getElementById("toastSuccess")
      : document.getElementById("toastError");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
