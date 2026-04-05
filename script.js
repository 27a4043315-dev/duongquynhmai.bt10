class SinhVien {
    constructor(hoTen, msv) {
        this.hoTen = hoTen;
        this.msv = msv;

        this.email = this.taoEmail();
        this.khoaHoc = this.tinhKhoaHoc();
        this.khoa = this.xacDinhKhoa();
    }

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

    tinhKhoaHoc() {
        return "Khoá" + this.msv.substring(0, 2);
    }

  xacDinhKhoa() {
    if (!this.msv || this.msv.length < 6) return "Không xác định";

    let majorCode = this.msv.substring(3, 6);

    switch (majorCode) {
        case "404": return "CNTT & KTS";
        case "408": return "Khoa học dữ liệu";
        case "401": return "Tài chính - Ngân hàng";
        case "403": return "Quản trị kinh doanh";
        case "405": return "Kinh doanh quốc tế";
        case "407": return "Kinh tế";
        case "406": return "Luật";
        case "751": return "Ngoại ngữ";
        case "402": return "Kế toán - Kiểm toán";
        default: return "Không xác định";
    }
        }
    }
}

console.log("JS đã chạy");

document.getElementById("fileInput").addEventListener("change", function(e) {
    console.log("Đã chọn file");

    let file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        console.log("Dữ liệu:", json);

        let danhSach = [];

        // ⚠️ ĐỌC THEO VỊ TRÍ CỘT (fix 100%)
        json.forEach(row => {
            let values = Object.values(row);

            let msv = values[1];   // cột 2: Mã SV
            let hoTen = values[2]; // cột 3: Họ tên

            if (hoTen && msv) {
                danhSach.push(new SinhVien(hoTen, msv));
            }
        });

        hienThi(danhSach);
    };

    reader.readAsArrayBuffer(file);
});

function hienThi(danhSach) {
    const tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    danhSach.forEach(sv => {
        tbody.innerHTML += `
            <tr>
                <td>${sv.hoTen}</td>
                <td>${sv.msv}</td>
                <td>${sv.khoaHoc}</td>
                <td>${sv.khoa}</td>
                <td>${sv.email}</td>
            </tr>
        `;
    });
}
