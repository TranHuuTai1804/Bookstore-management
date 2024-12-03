

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

        menuOv.addEventListener('scroll', function() {
            menuOv.style.scrollbarWidth = 'none'; // Ẩn thanh cuộn khi lướt
            clearTimeout(menuOv.scrollTimeout);
            
            menuOv.scrollTimeout = setTimeout(function() {
                menuOv.style.scrollbarWidth = 'thin'; // Hiển thị lại thanh cuộn khi ngừng lướt
            }, 100); // Ẩn thanh cuộn khi lướt và hiển thị lại sau khi ngừng
        });

        // Hàm thêm dòng mới vào bảng
        function addRow() {
        const tableBody = document.getElementById("table-body");
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
                <td><input type="text" placeholder="No."></td>
                <td><input type="text" placeholder="Book Name"></td>
                <td><input type="text" placeholder="Category"></td>
                <td><input type="text" placeholder="Author"></td>
                <td><input type="number" placeholder="Quantity"></td>
            `;
        tableBody.appendChild(newRow);
        }

        // Hàm xử lý khi nhấn nút Done
        function submitBooks() {
        const rows = document.querySelectorAll("#table-body tr");
        const books = [];

        rows.forEach((row) => {
            const cells = row.querySelectorAll("input");
            const bookData = {
            no: cells[0].value,
            name: cells[1].value,
            category: cells[2].value,
            author: cells[3].value,
            quantity: cells[4].value,
            };
            books.push(bookData);
        });

        // Gửi dữ liệu đến API hoặc xử lý tiếp theo
        console.log(books);

        // Hiển thị toast thông báo
        showToast();

        // Làm mới bảng sau khi nhấn Done
        document.getElementById("table-body").innerHTML = `
                <tr>
                    <td><input type="text" name="no1" placeholder="1"></td>
                    <td><input type="text" name="book1" placeholder="Book Name"></td>
                    <td><input type="text" name="category1" placeholder="Category"></td>
                    <td><input type="text" name="author1" placeholder="Author"></td>
                    <td><input type="number" name="quantity1" placeholder="Quantity"></td>
                </tr>
            `;
        }
        // Hàm hiển thị toast
        function showToast() {
        const toast = document.getElementById("toast");
        toast.classList.add("show");

        // Ẩn toast sau 3 giây
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
        }
