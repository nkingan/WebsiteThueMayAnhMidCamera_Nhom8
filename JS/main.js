// 1. Hàm load Header và Footer
function loadComponent(id, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error('Không thể tải file: ' + file);
            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(error));
}

// 2. Chạy khi trang web load xong
document.addEventListener("DOMContentLoaded", () => {
    // Thay đổi đường dẫn nếu cần thiết cho đúng với cấu trúc thư mục của bạn
    loadComponent("header-placeholder", "../Pages/header.html");
    loadComponent("footer-placeholder", "../Pages/footer.html");

    // 3. Xử lý menu Hamburger (nếu bạn đã có logic này trong file cũ)
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('drawer');
    
    if (hamburger && drawer) {
        hamburger.addEventListener('click', () => {
            drawer.classList.toggle('active');
        });
    }

    // 4. IntersectionObserver kích hoạt hiệu ứng tăng số
    const countUpElements = document.querySelectorAll(".count-up");
    if (countUpElements.length > 0) {
        const observerOptions = {
            threshold: 0.1, // Chạy hiệu ứng khi 10% phần tử xuất hiện trên màn hình
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCountUp(entry.target);
                    observer.unobserve(entry.target); // Chỉ chạy hiệu ứng duy nhất 1 lần
                }
            });
        }, observerOptions);

        countUpElements.forEach(el => observer.observe(el));
    }
});

// Hàm nới lỏng easeOutExpo: Tốc độ cực nhanh lúc đầu, giảm tốc cực mịn ở cuối để dừng đúng đích
function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// Hàm chạy hiệu ứng tăng số
function animateCountUp(element) {
    const targetAttr = element.getAttribute("data-target");
    const targetValue = parseFloat(targetAttr);
    const duration = 2000; // Thời gian chạy hiệu ứng: 2 giây
    const startTime = performance.now();
    
    // Tự động phát hiện số chữ số thập phân của target để hiển thị đồng bộ (ví dụ 4.9 có 1 chữ số thập phân)
    const hasDecimal = targetAttr.includes(".");
    const decimals = hasDecimal ? (targetAttr.split(".")[1] || "").length : 0;

    function update(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const currentValue = easedProgress * targetValue;

        // Cập nhật nội dung hiển thị của số
        element.textContent = currentValue.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = targetValue.toFixed(decimals); // Đảm bảo dừng đúng giá trị đích chính xác
        }
    }

    requestAnimationFrame(update);
}