
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

        // Hàm xử lý khi nhấn Done
        function submitReceipts() {
            const form = document.getElementById("receipt-form");
            const formData = new FormData(form);

            const receiptData = {};
            formData.forEach((value, key) => {
                receiptData[key] = value;
            });

            console.log("Form data:", receiptData);

            // Reset form
            form.reset();

            // Hiển thị toast thông báo
            showToast();
        }

        // Hiển thị toast
        function showToast() {
            const toast = document.getElementById("toast");
            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        }