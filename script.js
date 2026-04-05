// ===== CLASS SINH VIÊN =====
class SinhVien {
    constructor(hoTen, msv, lop) {
        this.hoTen = hoTen;
        this.msv = msv;
        this.lop = lop;

        this.email = this.taoEmail();
        this.khoaHoc = this.tinhKhoaHoc();
        this.khoa = this.xacDinhKhoa();
    }

    // Tạo email: binhnv.27a4041234@hvnh.edu.vn
    taoEmail() {
        let parts = this.hoTen.trim().toLowerCase().split(" ");

        let ten = parts.pop(); // tên
        let chuCaiDau = parts.map(p => p[0]).join(""); // n v

        return `${ten}${chuCaiDau}.${this.msv.toLowerCase()}@hvnh.edu.vn`;
    }

    // Khóa học (27 -> K27)
    tinhKhoaHoc() {
        return "K" + this.msv.substring(0, 2);
    }

    // Khoa (tuỳ theo quy tắc bạn học)
    xacDinhKhoa() {
        let kyTu = this.msv[2];

        switch (kyTu) {
            case "A": return "Công nghệ thông tin";
            case "B": return "Tài chính";
            case "C": return "Ngân hàng";
            case "D": return "Kế toán";
            default: return "Khác";
        }
    }
}

// ===== XỬ LÝ FILE =====
document.getElementById("fileInput").addEventListener("change", function(e) {
    let file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        let danhSach = [];

        json.forEach(row => {
            let sv = new SinhVien(
                row["Họ tên"],
                row["MSV"],
                row["Lớp"]
            );
            danhSach.push(sv);
        });

        hienThi(danhSach);
    };

    reader.readAsArrayBuffer(file);
});

// ===== HIỂN THỊ =====
function hienThi(danhSach) {
    const tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    danhSach.forEach(sv => {
        let row = `
            <tr>
                <td>${sv.hoTen}</td>
                <td>${sv.msv}</td>
                <td>${sv.lop}</td>
                <td>${sv.khoaHoc}</td>
                <td>${sv.khoa}</td>
                <td>${sv.email}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
