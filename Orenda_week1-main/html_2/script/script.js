const provinceSelect = document.getElementById('provinceSelect');
const districtSelect = document.getElementById('districtSelect');

provinceSelect.addEventListener('change', function () {
    // Kiểm tra nếu giá trị chọn khác với "Chọn tỉnh thành phố"
    if (this.value !== "") {
        districtSelect.disabled = false; // Mở khóa
        districtSelect.style.cursor = "pointer"; // Trả lại con trỏ bình thường
    } else {
        districtSelect.disabled = true; // Khóa lại
        districtSelect.selectedIndex = 0; // Reset quận về mặc định
    }
});



const menuToggle = document.getElementById('menuToggle');
const mobileNavbar = document.getElementById('mobileNavbar');

menuToggle.addEventListener('click', () => {
    mobileNavbar.classList.toggle('active');
});

// Tùy chọn: Đóng menu khi nhấn vào một link bất kỳ
const navLinks = document.querySelectorAll('.nav_text');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNavbar.classList.remove('active');
    });
});

// Đóng menu khi nhấn ra ngoài vùng menu
document.addEventListener('click', (event) => {
    const isClickInsideMenu = mobileNavbar.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    // Nếu vị trí click KHÔNG nằm trong menu và KHÔNG nằm trên nút toggle
    if (!isClickInsideMenu && !isClickOnToggle) {
        mobileNavbar.classList.remove('active');
    }
});





// 1. Lấy danh sách tất cả các card
const cards = document.querySelectorAll('.card_treem > div'); 
const mainImage = document.getElementById('my-image');

// Danh sách các ảnh tương ứng với từng ID (để thay thế đoạn code clickBox1, 2, 3...)
const imageMap = {
    'click-box_1': 'image/Rectangle 11302.png',
    'click-box_2': 'image/ky-nang-tien-hoc-duong-8.jpg',
    'click-box_3': 'image/Thanh-thieu-nien-la-gi-Thanh-thieu-nien-la-bao-nhieu-tuoi.jpg',
    'click-box_4': 'image/sang-loc-truoc-khi-mang-thai-845x564.jpg',
    'click-box_5': 'image/truong-thanh_elleman4.jpg',
    'click-box_6': 'image/cac_benh_co_trieu_chung_ho_co_dom_ma_ban_nen_biet_1_a43fd91f5b.jpg',
    'click-box_7': 'image/20190904_093028_630262_kham_tien_hon_nhan_max_1800x1800_jpg_bc868f2f3c.jpg'
};

cards.forEach(card => {
    card.addEventListener('click', function() {
        
        // --- BƯỚC 1: RESET TẤT CẢ CÁC CARD VỀ TRẠNG THÁI GỐC ---
        cards.forEach(item => {
            item.style.backgroundColor = '#E5F3FE'; // Màu nền xanh nhạt
            
            const p = item.querySelector('p');
            if (p) p.style.color = '#2A50AA'; // Màu chữ xanh đậm
            
            const arrow = item.querySelector('.Arrow');
            if (arrow) arrow.src = "image/Arrow - Right Circle.png"; // Icon mũi tên màu xanh
        });

        // --- BƯỚC 2: THAY ĐỔI RIÊNG CHO CARD ĐƯỢC CLICK ---
        
        // Đổi màu nền card
        this.style.backgroundColor = '#3580DB'; 
        
        // Đổi màu chữ trắng
        const currentP = this.querySelector('p');
        if (currentP) currentP.style.color = '#FFFFFF';
        
        // Đổi mũi tên sang màu trắng (.svg)
        const currentArrow = this.querySelector('.Arrow');
        if (currentArrow) currentArrow.src = "image/Arrow - Right Circle.svg";

        // Đổi ảnh chính dựa vào ID của card
        const cardId = this.id;
        if (imageMap[cardId]) {
            mainImage.src = imageMap[cardId];
        }
    });
});

// 1. Chọn tất cả các card và khối nội dung
const allCards = document.querySelectorAll('.card_treem');
const contentBlock = document.querySelector('.goiTreEm');

allCards.forEach(card => {
    card.addEventListener('click', function() {
    // Kiểm tra nếu màn hình nhỏ hơn 768px (Mobile & Tablet nhỏ)
    // Hoặc bạn có thể đổi thành 576px nếu chỉ muốn Mobile cực nhỏ
    if (window.matchMedia("(max-width: 500px)").matches) { 
        
        const isAlreadyOpen = this.classList.contains('is-opening');
        allCards.forEach(c => c.classList.remove('is-opening'));

        if (!isAlreadyOpen) {
            this.classList.add('is-opening');
            contentBlock.classList.add('mobile-content-area');
            this.insertAdjacentElement('afterend', contentBlock);

            setTimeout(() => {
                contentBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 200);
        } else {
           this.classList.remove('is-opening');
                contentBlock.classList.remove('mobile-content-area');
        }
    }
});
});
// Hàm để đưa mọi thứ về trạng thái Desktop
function resetToDesktop() {
    const contentBlock = document.querySelector('.goiTreEm');
    const desktopParent = document.querySelector('.goiTreEm-container');
    const allCards = document.querySelectorAll('.card_treem');

    // Nếu màn hình từ 768px trở lên
    if (window.innerWidth >= 768) {
        // 1. Kiểm tra nếu khối nội dung đang nằm sai chỗ (không phải con trực tiếp của row)
        if (contentBlock && desktopParent && contentBlock.parentElement !== desktopParent) {
            // Trả nó về làm con của row để col-md-8 có tác dụng
            desktopParent.appendChild(contentBlock);
        }

        // 2. Xóa bỏ các class hỗ trợ hiển thị trên mobile
        contentBlock.classList.remove('mobile-content-area');
        allCards.forEach(card => card.classList.remove('is-opening'));
        
        // 3. Đảm bảo khối nội dung luôn hiển thị trên desktop
        contentBlock.style.display = 'block';
    }
}

// Lắng nghe sự kiện thay đổi kích thước màn hình
window.addEventListener('resize', resetToDesktop);