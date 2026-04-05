class SinhVien {
    constructor(hoTen, msv) {
        this.hoTen = hoTen;
        this.msv = msv;

        this.email = this.taoEmail();
        this.khoaHoc = this.tinhKhoaHoc();
        this.khoa = this.xacDinhKhoa();
    }

    // Tạo email chuẩn
    taoEmail() {
        let cleanName = this.hoTen
            .replace(/\(.*?\)/g, "") // bỏ (LT)
            .trim()
            .toLowerCase();

        let parts = cleanName.split(" ");

        let ten = parts.pop();
        let chuCaiDau = parts.map(p => p[0]).join("");

        return `${ten}${chuCaiDau}.${this.msv.toLowerCase()}@hvnh.edu.vn`;
    }

    // Khóa học
    tinhKhoaHoc() {
        return "K" + this.msv.substring(0, 2);
    }

    // Khoa (theo ký tự thứ 3)
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

// Đọc file Excel
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
            let hoTen = row["Họ tên"];
            let msv = row["Mã SV"];

            if (hoTen && msv) {
                let sv = new SinhVien(hoTen, msv);
                danhSach.push(sv);
            }
        });

        hienThi(danhSach);
    };

    reader.readAsArrayBuffer(file);
});

// Hiển thị
function hienThi(danhSach) {
    const tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    danhSach.forEach(sv => {
        let row = `
            <tr>
                <td>${sv.hoTen}</td>
                <td>${sv.msv}</td>
                <td>${sv.khoaHoc}</td>
                <td>${sv.khoa}</td>
                <td>${sv.email}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
